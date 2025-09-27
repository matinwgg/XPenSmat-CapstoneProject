# xpensmat/tests/test_core.py
def test_config_loads():
    from xpensmat.core.config import settings
    assert settings.APP_NAME is not None
