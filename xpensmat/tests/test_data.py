# xpensmat/tests/test_data.py
from xpensmat.data.db import DBClient


def test_db_insert_and_list(tmp_path):
    # create a fresh DB client using a temp file
    tmp = tmp_path / "test.db"
    client = DBClient(str(tmp))
    tid = client.insert_transaction(
        "2025-01-01T00:00:00Z", "test", '{"x":1}', amount=100.0
    )
    assert isinstance(tid, int)
    rows = client.list_transactions(limit=10)
    assert len(rows) >= 1
    assert client.get_transaction(tid)[4] == 100.0
    assert client.count_transactions() == 1


def test_predictions_are_deduplicated_per_model(tmp_path):
    client = DBClient(str(tmp_path / "predictions.db"))
    tid = client.insert_transaction("2025-01-01", "test", "{}", amount=50.0)

    first = client.insert_prediction(tid, 55.0, "mean")
    duplicate = client.insert_prediction(tid, 60.0, "mean")
    other_model = client.insert_prediction(tid, 60.0, "other")

    assert isinstance(first, int)
    assert duplicate is None
    assert isinstance(other_model, int)
    assert len(client.list_predictions()) == 2
