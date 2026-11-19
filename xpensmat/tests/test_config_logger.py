"""Configuration and logging tests."""

import logging

import pytest
from pydantic import ValidationError

from xpensmat.core import config as config_module
from xpensmat.core.config import Settings, settings
from xpensmat.core.logger import get_logger, logger


def test_default_settings():
    fresh = Settings(_env_file=None)
    assert fresh.APP_NAME == "XPenSmat"
    assert fresh.DATA_DIR
    assert fresh.DB_PATH
    assert fresh.P2P_PORT == 8765
    assert fresh.LOG_LEVEL == "INFO"
    assert isinstance(fresh.P2P_PORT, int)


def test_environment_overrides(monkeypatch):
    monkeypatch.setenv("XPENSMAT_DB", "./custom/test.db")
    monkeypatch.setenv("XPENSMAT_DATA_DIR", "./custom-data")
    monkeypatch.setenv("P2P_PORT", "9999")
    monkeypatch.setenv("LOG_LEVEL", "debug")
    fresh = Settings(_env_file=None)
    assert fresh.DB_PATH == "./custom/test.db"
    assert fresh.DATA_DIR == "./custom-data"
    assert fresh.P2P_PORT == 9999
    assert fresh.LOG_LEVEL == "debug"


def test_plain_field_alias_is_accepted(monkeypatch):
    monkeypatch.delenv("XPENSMAT_DB", raising=False)
    monkeypatch.setenv("DB_PATH", "./alias/test.db")
    fresh = Settings(_env_file=None)
    assert fresh.DB_PATH == "./alias/test.db"


def test_invalid_port_rejected(monkeypatch):
    monkeypatch.setenv("P2P_PORT", "not-a-number")
    with pytest.raises(ValidationError):
        Settings(_env_file=None)


def test_module_settings_instance():
    assert settings.APP_NAME == "XPenSmat"


def test_logger_returns_named_logger():
    obtained = get_logger("xpensmat.tests")
    assert obtained.name == "xpensmat.tests"
    assert obtained.level in {
        logging.DEBUG,
        logging.INFO,
        logging.WARNING,
        logging.ERROR,
        logging.CRITICAL,
    }


def test_logger_invalid_level_falls_back_to_info(monkeypatch):
    monkeypatch.setattr(config_module.settings, "LOG_LEVEL", "definitely-not-a-level")
    obtained = get_logger("xpensmat.invalid-level")
    assert obtained.level == logging.INFO


def test_logger_maps_debug_level(monkeypatch):
    monkeypatch.setattr(config_module.settings, "LOG_LEVEL", "DEBUG")
    obtained = get_logger("xpensmat.debug-level")
    assert obtained.level == logging.DEBUG


def test_default_logger_object_exists():
    assert isinstance(logger, logging.Logger)
