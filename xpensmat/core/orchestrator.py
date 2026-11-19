# xpensmat/core/orchestrator.py
"""
Central orchestrator that wires components together.

The loop schedules ingestion -> feature update -> prediction -> cloud sync ->
report generation.  ``run_once`` executes a single tick and is used by tests
and by deployments that prefer an external scheduler.
"""
from __future__ import annotations

import threading

from xpensmat.core.logger import logger
from xpensmat.data import bank_ingest, sms_ingest, sync_service
from xpensmat.export import report_builder
from xpensmat.predictor import serve as predictor_serve

RUN_INTERVAL_SECONDS = 30


class Orchestrator:
    def __init__(self, interval: float | None = None):
        self.interval = RUN_INTERVAL_SECONDS if interval is None else float(interval)
        self._running = False
        self._stop_event = threading.Event()
        self._thread: threading.Thread | None = None

    @property
    def is_running(self) -> bool:
        return self._running

    def run_once(self) -> None:
        """Run one pipeline tick synchronously.

        Exceptions propagate so callers/tests can observe failures; the
        background loop wraps this method and logs instead.
        """
        logger.debug("Orchestrator tick: ingesting SMS/bank data")
        sms_ingest.poll_and_store()
        bank_ingest.pull_accounts()
        logger.debug("Running feature update and prediction")
        predictor_serve.run_periodic_predict()
        logger.debug("Syncing to cloud and generating reports")
        sync_service.sync_to_appwrite()
        report_builder.build_reports_if_needed()

    def _run_loop(self) -> None:
        while not self._stop_event.is_set():
            try:
                self.run_once()
            except Exception as e:  # pragma: no cover - exercised indirectly
                logger.exception("Orchestrator error: %s", e)
            self._stop_event.wait(self.interval)

    def start(self) -> None:
        if self._running:
            return
        logger.info("Starting XPenSmat orchestrator")
        self._stop_event.clear()
        self._running = True
        self._thread = threading.Thread(
            target=self._run_loop, name="xpensmat-orchestrator", daemon=True
        )
        self._thread.start()

    def stop(self, timeout: float = 5.0) -> None:
        self._stop_event.set()
        self._running = False
        if self._thread is not None:
            self._thread.join(timeout=timeout)
            self._thread = None
        logger.info("Orchestrator stopped")


# convenience instance
orchestrator = Orchestrator()

if __name__ == "__main__":  # pragma: no cover
    import time

    orchestrator.start()
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        orchestrator.stop()
