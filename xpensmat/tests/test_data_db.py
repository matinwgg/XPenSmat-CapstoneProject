"""Database layer tests."""

import sqlite3

import pytest

from xpensmat.data.db import DBClient as DirectDBClient
from xpensmat.data.db import DB_PATH

from xpensmat.data import __all__ as data_exports


def test_data_package_exports_expected_names():
    assert set(data_exports) >= {
        "DBClient",
        "poll_and_store",
        "pull_accounts",
        "sync_to_appwrite",
    }


def test_db_path_is_configured():
    assert DB_PATH.name.endswith(".db")


def test_insert_and_list_transactions(db_client):
    first = db_client.insert_transaction(
        "2025-01-01T00:00:00Z", "sms", '{"n": 1}', amount=10.5, category="Food"
    )
    second = db_client.insert_transaction(
        "2025-01-02T00:00:00Z", "bank", '{"n": 2}', amount=20, category="Transport"
    )
    assert isinstance(first, int) and isinstance(second, int)
    assert second > first

    rows = db_client.list_transactions(limit=10)
    assert len(rows) == 2
    # newest first
    assert rows[0][0] == second
    assert rows[0][4] == 20
    assert rows[1][0] == first


def test_list_transactions_respects_limit(db_client):
    for index in range(5):
        db_client.insert_transaction(
            f"2025-01-0{index + 1}T00:00:00Z", "test", "{}", amount=index
        )
    assert len(db_client.list_transactions(limit=2)) == 2
    assert len(db_client.list_transactions(limit=0)) == 0


def test_get_transaction(db_client):
    txn_id = db_client.insert_transaction("2025-01-01", "sms", "{}", amount=1)
    row = db_client.get_transaction(txn_id)
    assert row is not None
    assert row[0] == txn_id
    assert db_client.get_transaction(txn_id + 999) is None


def test_count_transactions(db_client):
    assert db_client.count_transactions() == 0
    db_client.insert_transaction("2025-01-01", "sms", "{}", amount=1)
    assert db_client.count_transactions() == 1


def test_prediction_round_trip(db_client):
    txn_id = db_client.insert_transaction("2025-01-01", "sms", "{}", amount=1)
    prediction_id = db_client.insert_prediction(txn_id, 99.9, "test-model")
    assert isinstance(prediction_id, int)
    predictions = db_client.list_predictions(limit=10)
    assert len(predictions) == 1
    assert predictions[0][1] == txn_id
    assert predictions[0][2] == 99.9
    assert predictions[0][3] == "test-model"


def test_transaction_amount_and_category_may_be_null(db_client):
    txn_id = db_client.insert_transaction("2025-01-01", "sms", "{}")
    row = db_client.get_transaction(txn_id)
    assert row[4] is None and row[5] is None


def test_in_memory_database():
    client = DirectDBClient(":memory:")
    try:
        txn_id = client.insert_transaction("2025-01-01", "sms", "{}", amount=1)
        assert client.get_transaction(txn_id)[0] == txn_id
    finally:
        client.close()


def test_context_manager_closes_connection(tmp_path):
    with DirectDBClient(tmp_path / "ctx.db") as client:
        client.insert_transaction("2025-01-01", "sms", "{}", amount=1)
    with pytest.raises(sqlite3.ProgrammingError):
        client.conn.execute("SELECT 1")


def test_schema_is_idempotent(tmp_path):
    path = tmp_path / "reopen.db"
    first = DirectDBClient(path)
    first.insert_transaction("2025-01-01", "sms", "{}", amount=1)
    first.close()

    second = DirectDBClient(path)
    try:
        assert second.count_transactions() == 1
        names = {
            row[0]
            for row in second.conn.execute(
                "SELECT name FROM sqlite_master WHERE type='table'"
            ).fetchall()
        }
        assert {"transactions", "predictions"} <= names
    finally:
        second.close()
