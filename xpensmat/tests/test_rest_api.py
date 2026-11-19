"""REST API tests."""

from fastapi.testclient import TestClient

import xpensmat.interfaces.rest_api as rest_api


class _FakeDB:
    def __init__(self):
        self.rows = {
            1: (1, "2025-01-01T00:00:00Z", "sms", "{}", 10.0, "Food"),
        }

    def get_transaction(self, txn_id):
        return self.rows.get(txn_id)


def _client(monkeypatch, db=None):
    monkeypatch.setattr(rest_api, "db", db or _FakeDB())
    return TestClient(rest_api.app)


def test_health(monkeypatch):
    client = _client(monkeypatch)
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_predict_found(monkeypatch):
    client = _client(monkeypatch)
    monkeypatch.setattr(rest_api, "predict_for_txn", lambda txn: 55.5)
    response = client.post("/predict", json={"txn_id": 1})
    assert response.status_code == 200
    assert response.json() == {"txn_id": 1, "predicted_amount": 55.5}


def test_predict_not_found(monkeypatch):
    client = _client(monkeypatch)
    response = client.post("/predict", json={"txn_id": 999})
    assert response.status_code == 404
    assert response.json()["detail"] == "txn not found"


def test_predict_validates_request(monkeypatch):
    client = _client(monkeypatch)
    response = client.post("/predict", json={})
    assert response.status_code == 422


def test_chat(monkeypatch):
    client = _client(monkeypatch)

    class FakeBot:
        def handle_text(self, message):
            return f"echo: {message}"

    monkeypatch.setattr(rest_api, "bot", FakeBot())
    response = client.post("/chat", json={"message": "balance"})
    assert response.status_code == 200
    assert response.json() == {"reply": "echo: balance"}


def test_chat_default_bot():
    client = TestClient(rest_api.app)
    response = client.post("/chat", json={"message": "predict next month"})
    assert response.status_code == 200
    assert "prediction" in response.json()["reply"].lower()
