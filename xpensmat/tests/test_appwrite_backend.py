"""Appwrite backend placeholder tests."""

import pytest

from xpensmat.appwrite_backend import auth, functions, storage


# ---------------------------------------------------------------------------
# Authentication
# ---------------------------------------------------------------------------
def test_login_requires_credentials(monkeypatch):
    monkeypatch.setattr(auth.settings, "APPWRITE_ENDPOINT", None)
    assert auth.login("", "password")["ok"] is False
    assert auth.login("user@example.com", "")["ok"] is False


def test_login_without_endpoint_returns_demo_token(monkeypatch):
    monkeypatch.setattr(auth.settings, "APPWRITE_ENDPOINT", None)
    result = auth.login("user@example.com", "password")
    assert result == {"ok": True, "token": "demo-token"}


def test_login_with_endpoint_returns_placeholder(monkeypatch):
    monkeypatch.setattr(auth.settings, "APPWRITE_ENDPOINT", "https://example.test/v1")
    assert auth.login("user@example.com", "password") == {"ok": True}


# ---------------------------------------------------------------------------
# Storage
# ---------------------------------------------------------------------------
def test_upload_blob_without_endpoint_writes_file(tmp_path, monkeypatch):
    monkeypatch.setattr(storage.settings, "APPWRITE_ENDPOINT", None)
    monkeypatch.chdir(tmp_path)
    result = storage.upload_blob("backup.bin", b"payload")
    assert result["ok"] is True
    assert (tmp_path / "cloud_mirror" / "backup.bin").read_bytes() == b"payload"


def test_upload_blob_with_endpoint_is_placeholder(monkeypatch):
    monkeypatch.setattr(storage.settings, "APPWRITE_ENDPOINT", "https://example.test/v1")
    assert storage.upload_blob("backup.bin", b"payload")["ok"] is False


@pytest.mark.parametrize("name", ["", "../escape.bin", "nested/file.bin", ".", ".."])
def test_upload_blob_rejects_unsafe_names(name, monkeypatch):
    monkeypatch.setattr(storage.settings, "APPWRITE_ENDPOINT", None)
    with pytest.raises(ValueError):
        storage.upload_blob(name, b"payload")


def test_upload_blob_rejects_non_bytes(monkeypatch):
    monkeypatch.setattr(storage.settings, "APPWRITE_ENDPOINT", None)
    with pytest.raises(TypeError):
        storage.upload_blob("file.bin", "text")


# ---------------------------------------------------------------------------
# Functions
# ---------------------------------------------------------------------------
def test_call_function_returns_status():
    assert functions.call_function("sync", {"a": 1}) == {"status": "ok"}


def test_call_function_validates_input():
    with pytest.raises(ValueError):
        functions.call_function("", {})
    with pytest.raises(TypeError):
        functions.call_function("sync", ["not", "a", "dict"])
