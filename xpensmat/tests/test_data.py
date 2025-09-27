# xpensmat/tests/test_data.py
from xpensmat.data.db import db

def test_db_insert_and_list(tmp_path):
    # create a fresh DB client using a temp file
    from xpensmat.data.db import DBClient
    tmp = tmp_path / "test.db"
    client = DBClient(str(tmp))
    tid = client.insert_transaction("2025-01-01T00:00:00Z", "test", '{"x":1}', amount=100.0)
    assert isinstance(tid, int)
    rows = client.list_transactions(limit=10)
    assert len(rows) >= 1
