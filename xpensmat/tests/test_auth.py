import xpensmat.appwrite_backend.auth as auth


def test_login_fails_closed_without_config(monkeypatch):
    monkeypatch.setattr(auth.settings, "APPWRITE_ENDPOINT", None)
    result = auth.login("student@example.com", "password")
    assert result["ok"] is False
    assert "not configured" in result["error"]


def test_login_fails_closed_when_present_but_unimplemented(monkeypatch):
    monkeypatch.setattr(
        auth.settings, "APPWRITE_ENDPOINT", "https://cloud.appwrite.io/v1"
    )
    result = auth.login("student@example.com", "password")
    assert result["ok"] is False
    assert "not implemented" in result["error"]


def test_login_rejects_missing_credentials():
    result = auth.login("", "")
    assert result["ok"] is False
