import json

import pytest

from xpensmat.data import sms_ingest


@pytest.mark.parametrize(
    "text, expected",
    [
        ("You spent GHS 2,000.50 at the market", 2000.50),
        ("Payment of 150 received", 150.0),
        ("NGN 1,234", 1234.0),
        ("Card debit USD 12.99", 12.99),
        ("No money here", None),
        ("Transaction dated 2025-09-01", None),
    ],
)
def test_parse_sms_text_extracts_amounts(text, expected):
    assert sms_ingest.parse_sms_text(text)["amount"] == expected


def test_poll_and_store_reads_and_clears_queue(tmp_path, monkeypatch):
    monkeypatch.setattr(sms_ingest.settings, "DATA_DIR", str(tmp_path))
    raw = tmp_path / "raw"
    raw.mkdir()
    queue = raw / "sample_sms.jsonl"
    queue.write_text(
        json.dumps({"text": "GHS 2,000 at Shoprite", "timestamp": "2025-01-01"}),
        encoding="utf-8",
    )

    count = sms_ingest.poll_and_store()

    assert count == 1
    assert queue.read_text(encoding="utf-8") == ""

    from xpensmat.data.db import db

    rows = db.list_transactions(limit=10)
    assert any(row[4] == 2000.0 for row in rows)
