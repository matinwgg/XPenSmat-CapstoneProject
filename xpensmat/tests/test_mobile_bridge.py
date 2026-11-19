"""Mobile bridge adapter tests."""

import json

from xpensmat.interfaces import mobile_bridge


class _FakeDB:
    def __init__(self):
        self.calls = []

    def insert_transaction(self, **kwargs):
        self.calls.append(kwargs)
        return len(self.calls)


def test_push_mobile_transaction_stores_payload(monkeypatch):
    fake = _FakeDB()
    monkeypatch.setattr(mobile_bridge, "db", fake)

    payload = {
        "timestamp": "2025-01-01T00:00:00Z",
        "source": "android",
        "amount": 12.5,
        "description": "Lunch",
    }
    result = mobile_bridge.push_mobile_transaction(payload)

    assert result == {"ok": True}
    assert len(fake.calls) == 1
    call = fake.calls[0]
    assert call["timestamp"] == payload["timestamp"]
    assert call["source"] == "mobile"
    assert call["amount"] == 12.5
    assert json.loads(call["raw_json"]) == payload


def test_push_mobile_transaction_handles_errors(monkeypatch):
    class _Boom:
        def insert_transaction(self, **kwargs):
            raise RuntimeError("disk full")

    monkeypatch.setattr(mobile_bridge, "db", _Boom())
    result = mobile_bridge.push_mobile_transaction({"amount": 1})
    assert result["ok"] is False
    assert "disk full" in result["error"]


def test_push_mobile_transaction_persists_real_row(db_client, monkeypatch):
    monkeypatch.setattr(mobile_bridge, "db", db_client)
    mobile_bridge.push_mobile_transaction(
        {"timestamp": "2025-03-01T00:00:00Z", "amount": 33.0}
    )
    rows = db_client.list_transactions()
    assert len(rows) == 1
    assert rows[0][2] == "mobile"
    assert rows[0][4] == 33.0
