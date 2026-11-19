"""Orchestrator lifecycle and pipeline tests."""

import threading

import pytest

import xpensmat.core.orchestrator as orchestrator_module
from xpensmat.core.orchestrator import Orchestrator, orchestrator


def _step(name, calls):
    from types import SimpleNamespace

    def record(*args, **kwargs):
        calls.append(name)

    return SimpleNamespace(
        poll_and_store=record,
        pull_accounts=record,
        run_periodic_predict=record,
        sync_to_appwrite=record,
        build_reports_if_needed=record,
    )


def test_run_once_executes_steps_in_order(monkeypatch):
    calls = []
    for attribute, name in [
        ("sms_ingest", "sms"),
        ("bank_ingest", "bank"),
        ("predictor_serve", "predict"),
        ("sync_service", "sync"),
        ("report_builder", "report"),
    ]:
        monkeypatch.setattr(orchestrator_module, attribute, _step(name, calls))

    Orchestrator().run_once()
    assert calls == ["sms", "bank", "predict", "sync", "report"]


def test_run_once_propagates_errors(monkeypatch):
    calls = []

    class _Boom:
        def poll_and_store(self):
            raise RuntimeError("ingest failed")

    monkeypatch.setattr(orchestrator_module, "sms_ingest", _Boom())
    monkeypatch.setattr(orchestrator_module, "bank_ingest", _step("bank", calls))
    with pytest.raises(RuntimeError, match="ingest failed"):
        Orchestrator().run_once()
    assert calls == []


def test_start_and_stop(monkeypatch):
    first_call = threading.Event()
    calls = []

    def fake_run_once():
        calls.append("tick")
        first_call.set()

    instance = Orchestrator(interval=5.0)
    monkeypatch.setattr(instance, "run_once", fake_run_once)

    instance.start()
    try:
        assert first_call.wait(timeout=2), "orchestrator did not run"
        assert instance.is_running
        thread = instance._thread
        instance.start()  # idempotent while running
        assert instance._thread is thread
    finally:
        instance.stop(timeout=2)

    assert instance.is_running is False
    assert instance._thread is None
    assert calls == ["tick"]


def test_stop_without_start_is_safe():
    instance = Orchestrator(interval=0.01)
    instance.stop()
    assert instance.is_running is False


def test_interval_override():
    assert Orchestrator(interval=1.5).interval == 1.5
    assert Orchestrator().interval == orchestrator_module.RUN_INTERVAL_SECONDS


def test_singleton_exists():
    assert isinstance(orchestrator, Orchestrator)
