"""Smoke tests that every public module imports cleanly."""

import importlib

import pytest

MODULES = [
    "xpensmat",
    "xpensmat.core.config",
    "xpensmat.core.logger",
    "xpensmat.core.security",
    "xpensmat.core.orchestrator",
    "xpensmat.data.db",
    "xpensmat.data.schemas",
    "xpensmat.data.sms_ingest",
    "xpensmat.data.bank_ingest",
    "xpensmat.data.sync_service",
    "xpensmat.export.pdf_exporter",
    "xpensmat.export.docx_exporter",
    "xpensmat.export.report_builder",
    "xpensmat.interfaces.cli",
    "xpensmat.interfaces.mobile_bridge",
    "xpensmat.interfaces.rest_api",
    "xpensmat.nlp_engine.chatbot",
    "xpensmat.nlp_engine.intent_parser",
    "xpensmat.nlp_engine.voice_interface",
    "xpensmat.appwrite_backend.auth",
    "xpensmat.appwrite_backend.storage",
    "xpensmat.appwrite_backend.functions",
    "xpensmat.predictor.model_store",
    "xpensmat.predictor.train",
    "xpensmat.predictor.predict",
    "xpensmat.predictor.evaluate",
    "xpensmat.predictor.serve",
    "core.security",
    "ml.src.preprocessing",
    "ml.src.dataset",
    "ml.src.eval",
    "ml.src.predict",
    "ml.src.train",
    "ml.models.baseline",
    "ml.models.xgboost_model",
    "ml.models.tf_priv_model",
]


@pytest.mark.parametrize("module_name", MODULES)
def test_module_imports(module_name):
    assert importlib.import_module(module_name) is not None


def test_export_package_exports():
    import xpensmat.export as export_package

    assert {
        "build_reports_if_needed",
        "export_pdf",
        "export_docx",
    } <= set(export_package.__all__ if hasattr(export_package, "__all__") else dir(export_package))


def test_appwrite_package_exports():
    import xpensmat.appwrite_backend as package

    assert callable(package.login)
    assert callable(package.upload_blob)
    assert callable(package.call_function)
