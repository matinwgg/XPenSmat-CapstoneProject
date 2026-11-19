"""Ingestion and synchronisation tests."""

import json

import pytest

from xpensmat.data import bank_ingest, sms_ingest, sync_service


def _write_sms(path, payloads):
    path.write_text(
        "\n".join(json.dumps(payload) for payload in payloads) + "\n", encoding="utf-8"
    )


# ---------------------------------------------------------------------------
# SMS parsing
# ---------------------------------------------------------------------------
@pytest.mark.parametrize(
    ("text", "expected"),
    [
        ("You spent GHS 2,000.50 at the market", 2000.50),
        ("GHS25 lunch", 25.0),
        ("Debit NGN 1,234", 1234.0),
        ("Payment of $99.99", 99.99),
        ("Your balance is 450", 450.0),
        ("No money here", None),
        ("Account 1234567890 debited GHS 10", 10.0),
        ("", None),
    ],
)
def test_parse_sms_text(text, expected):
    result = sms_ingest.parse_sms_text(text)
    assert result["raw"] == text
    assert result["amount"] == expected


def test_parse_sms_non_string():
    assert sms_ingest.parse_sms_text(None)["amount"] is None


# ---------------------------------------------------------------------------
# SMS queue ingestion
# ---------------------------------------------------------------------------
def test_poll_and_store_ingests_valid_lines(tmp_path, db_client, monkeypatch):
    monkeypatch.setattr(sms_ingest, "db", db_client)
    queue = tmp_path / "queue.jsonl"
    _write_sms(
        queue,
        [
            {"text": "GHS 10 food", "timestamp": "2025-01-01T00:00:00Z"},
            {"message": "GHS 20 transport"},
        ],
    )

    assert sms_ingest.poll_and_store(queue) == 2
    rows = db_client.list_transactions()
    assert len(rows) == 2
    assert {row[2] for row in rows} == {"sms"}
    assert {row[4] for row in rows} == {10.0, 20.0}
    assert queue.read_text(encoding="utf-8") == ""


def test_poll_and_store_keeps_unparseable_lines(tmp_path, db_client, monkeypatch):
    monkeypatch.setattr(sms_ingest, "db", db_client)
    queue = tmp_path / "queue.jsonl"
    queue.write_text(
        '{"text": "GHS 5"}\nthis is not json\n[1, 2, 3]\n', encoding="utf-8"
    )

    assert sms_ingest.poll_and_store(queue) == 1
    remaining = queue.read_text(encoding="utf-8")
    assert "this is not json" in remaining
    assert "[1, 2, 3]" in remaining
    assert db_client.count_transactions() == 1


class _ExplodingDB:
    def insert_transaction(self, *args, **kwargs):  # pragma: no cover - guard
        pytest.fail("the database must not be touched for a missing queue file")


def test_poll_and_store_missing_file_returns_zero(tmp_path, monkeypatch):
    monkeypatch.setattr(sms_ingest, "db", _ExplodingDB())
    assert sms_ingest.poll_and_store(tmp_path / "missing.jsonl") == 0


def test_poll_and_store_uses_environment_path(tmp_path, db_client, monkeypatch):
    monkeypatch.setattr(sms_ingest, "db", db_client)
    queue = tmp_path / "env.jsonl"
    _write_sms(queue, [{"text": "GHS 7"}])
    monkeypatch.setenv("XPENSMAT_SMS_FILE", str(queue))
    assert sms_ingest.poll_and_store() == 1
    assert db_client.count_transactions() == 1


def test_poll_and_store_generates_timestamp(tmp_path, db_client, monkeypatch):
    monkeypatch.setattr(sms_ingest, "db", db_client)
    queue = tmp_path / "queue.jsonl"
    _write_sms(queue, [{"text": "GHS 3"}])
    sms_ingest.poll_and_store(queue)
    row = db_client.list_transactions()[0]
    assert row[1]
    assert "T" in row[1]


# ---------------------------------------------------------------------------
# Bank ingestion
# ---------------------------------------------------------------------------
def test_bank_pull_is_noop_without_mock(tmp_path, db_client, monkeypatch):
    monkeypatch.setattr(bank_ingest, "db", db_client)
    monkeypatch.delenv("XPENSMAT_BANK_MOCK", raising=False)
    assert bank_ingest.pull_accounts() == []
    assert db_client.count_transactions() == 0


def test_bank_pull_mock_enabled_by_env(tmp_path, db_client, monkeypatch):
    monkeypatch.setattr(bank_ingest, "db", db_client)
    monkeypatch.setenv("XPENSMAT_BANK_MOCK", "1")
    result = bank_ingest.pull_accounts()
    assert len(result) == 1
    assert db_client.count_transactions() == 1
    assert db_client.list_transactions()[0][2] == "bank"


def test_bank_pull_mock_flag_overrides_env(db_client, monkeypatch):
    monkeypatch.setattr(bank_ingest, "db", db_client)
    monkeypatch.delenv("XPENSMAT_BANK_MOCK", raising=False)
    assert len(bank_ingest.pull_accounts(mock=True)) == 1
    assert bank_ingest.pull_accounts(mock=False) == []
    assert db_client.count_transactions() == 1


# ---------------------------------------------------------------------------
# Cloud sync placeholder
# ---------------------------------------------------------------------------
def test_sync_skips_without_endpoint(monkeypatch):
    monkeypatch.setattr(sync_service.settings, "APPWRITE_ENDPOINT", None)
    assert sync_service.sync_to_appwrite() is False


def test_sync_reports_placeholder_when_configured(monkeypatch):
    monkeypatch.setattr(sync_service.settings, "APPWRITE_ENDPOINT", "https://example.test/v1")
    assert sync_service.sync_to_appwrite() is False
