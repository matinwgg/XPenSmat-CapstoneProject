# xpensmat/core/orchestrator.py
"""
Central orchestrator that wires components together.
This is an example main loop for scheduling ingestion -> feature -> predict -> export.
"""
import threading
import time
from .logger import logger
from xpensmat.data import sms_ingest, bank_ingest, sync_service
from xpensmat.predictor import serve as predictor_serve
from xpensmat.export import report_builder

RUN_INTERVAL_SECONDS = 30

class Orchestrator:
    def __init__(self):
        self._running = False

    def start(self):
        logger.info("Starting XPenSmat orchestrator")
        self._running = True
        t = threading.Thread(target=self._run_loop, daemon=True)
        t.start()

    def _run_loop(self):
        while self._running:
            try:
                logger.debug("Orchestrator tick: ingesting SMS/bank data")
                sms_ingest.poll_and_store()
                bank_ingest.pull_accounts()
                logger.debug("Running feature update and prediction")
                predictor_serve.run_periodic_predict()
                logger.debug("Syncing to cloud and generating reports")
                sync_service.sync_to_appwrite()
                report_builder.build_reports_if_needed()
            except Exception as e:
                logger.exception("Orchestrator error: %s", e)
            time.sleep(RUN_INTERVAL_SECONDS)

    def stop(self):
        self._running = False
        logger.info("Orchestrator stopped")

# convenience instance
orchestrator = Orchestrator()

if __name__ == "__main__":
    orchestrator.start()
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        orchestrator.stop()
