# xpensmat/data/db.py
"""
Simple SQLite wrapper. Intended to be replaced with SQLCipher-enabled connection
in production (pysqlcipher3 or sqlcipher CLI).
"""
import sqlite3
from pathlib import Path
from xpensmat.core.config import settings
from xpensmat.core.logger import logger

DB_PATH = Path(settings.DB_PATH)
DB_PATH.parent.mkdir(parents=True, exist_ok=True)

class DBClient:
    def __init__(self, path: str | None = None):
        self.path = str(path or DB_PATH)
        self.conn = sqlite3.connect(self.path, check_same_thread=False)
        self._init_schema()

    def _init_schema(self):
        cur = self.conn.cursor()
        cur.execute("""
            CREATE TABLE IF NOT EXISTS transactions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp TEXT,
                source TEXT,
                raw_json TEXT,
                amount REAL,
                category TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        """)
        cur.execute("""
            CREATE TABLE IF NOT EXISTS predictions (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                txn_id INTEGER,
                predicted_amount REAL,
                model_name TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        """)
        self.conn.commit()

    def insert_transaction(self, timestamp: str, source: str, raw_json: str, amount: float | None = None, category: str | None = None):
        cur = self.conn.cursor()
        cur.execute("INSERT INTO transactions (timestamp, source, raw_json, amount, category) VALUES (?, ?, ?, ?, ?)",
                    (timestamp, source, raw_json, amount, category))
        self.conn.commit()
        rowid = cur.lastrowid
        logger.debug("Inserted transaction id=%s", rowid)
        return rowid

    def list_transactions(self, limit: int = 100):
        cur = self.conn.cursor()
        cur.execute("SELECT id, timestamp, source, raw_json, amount, category FROM transactions ORDER BY created_at DESC LIMIT ?", (limit,))
        return cur.fetchall()

    def insert_prediction(self, txn_id: int, predicted_amount: float, model_name: str):
        cur = self.conn.cursor()
        cur.execute("INSERT INTO predictions (txn_id, predicted_amount, model_name) VALUES (?, ?, ?)",
                    (txn_id, predicted_amount, model_name))
        self.conn.commit()
        return cur.lastrowid

# single shared client
db = DBClient()
