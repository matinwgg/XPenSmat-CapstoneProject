# xpensmat/data/db.py
"""Small SQLite wrapper used by the local XPenSmat pipeline.

The database stores transaction metadata and model predictions. It is not
encrypted at rest; deployments that store real financial data should use an
encrypted SQLite build (SQLCipher) or encrypt sensitive columns before insert.
"""

from __future__ import annotations

import sqlite3
import threading
from pathlib import Path

from xpensmat.core.config import settings
from xpensmat.core.logger import logger

DB_PATH = Path(settings.DB_PATH)
DB_PATH.parent.mkdir(parents=True, exist_ok=True)


class DBClient:
    def __init__(self, path: str | None = None):
        self.path = str(path or DB_PATH)
        Path(self.path).parent.mkdir(parents=True, exist_ok=True)
        self.conn = sqlite3.connect(
            self.path, check_same_thread=False, timeout=10.0
        )
        self.conn.execute("PRAGMA busy_timeout=5000")
        self.conn.execute("PRAGMA journal_mode=WAL")
        self.conn.execute("PRAGMA foreign_keys=ON")
        self._lock = threading.RLock()
        self._init_schema()

    def _init_schema(self) -> None:
        with self._lock:
            cur = self.conn.cursor()
            cur.execute(
                """
                CREATE TABLE IF NOT EXISTS transactions (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    timestamp TEXT,
                    source TEXT,
                    raw_json TEXT,
                    amount REAL,
                    category TEXT,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
                """
            )
            cur.execute(
                """
                CREATE TABLE IF NOT EXISTS predictions (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    txn_id INTEGER,
                    predicted_amount REAL,
                    model_name TEXT,
                    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                )
                """
            )
            cur.execute(
                "CREATE INDEX IF NOT EXISTS idx_transactions_created "
                "ON transactions(created_at)"
            )
            cur.execute(
                "CREATE INDEX IF NOT EXISTS idx_predictions_txn "
                "ON predictions(txn_id, model_name)"
            )
            self.conn.commit()

    def insert_transaction(
        self,
        timestamp: str,
        source: str,
        raw_json: str,
        amount: float | None = None,
        category: str | None = None,
    ) -> int:
        with self._lock:
            cur = self.conn.cursor()
            cur.execute(
                "INSERT INTO transactions "
                "(timestamp, source, raw_json, amount, category) "
                "VALUES (?, ?, ?, ?, ?)",
                (timestamp, source, raw_json, amount, category),
            )
            self.conn.commit()
            rowid = cur.lastrowid
        logger.debug("Inserted transaction id=%s", rowid)
        return int(rowid)

    def list_transactions(self, limit: int = 100) -> list[tuple]:
        limit = max(1, min(int(limit), 10_000))
        with self._lock:
            cur = self.conn.cursor()
            cur.execute(
                "SELECT id, timestamp, source, raw_json, amount, category "
                "FROM transactions ORDER BY id DESC LIMIT ?",
                (limit,),
            )
            return cur.fetchall()

    def get_transaction(self, txn_id: int) -> tuple | None:
        with self._lock:
            cur = self.conn.cursor()
            cur.execute(
                "SELECT id, timestamp, source, raw_json, amount, category "
                "FROM transactions WHERE id = ?",
                (txn_id,),
            )
            return cur.fetchone()

    def count_transactions(self) -> int:
        with self._lock:
            cur = self.conn.cursor()
            cur.execute("SELECT COUNT(*) FROM transactions")
            return int(cur.fetchone()[0])

    def insert_prediction(
        self, txn_id: int, predicted_amount: float, model_name: str
    ) -> int | None:
        """Insert one prediction, skipping duplicates for the same model."""
        with self._lock:
            cur = self.conn.cursor()
            cur.execute(
                "SELECT id FROM predictions WHERE txn_id = ? AND model_name = ? "
                "LIMIT 1",
                (txn_id, model_name),
            )
            if cur.fetchone() is not None:
                return None
            cur.execute(
                "INSERT INTO predictions "
                "(txn_id, predicted_amount, model_name) VALUES (?, ?, ?)",
                (txn_id, predicted_amount, model_name),
            )
            self.conn.commit()
            return int(cur.lastrowid)

    def list_predictions(self, limit: int = 100) -> list[tuple]:
        limit = max(1, min(int(limit), 10_000))
        with self._lock:
            cur = self.conn.cursor()
            cur.execute(
                "SELECT id, txn_id, predicted_amount, model_name, created_at "
                "FROM predictions ORDER BY id DESC LIMIT ?",
                (limit,),
            )
            return cur.fetchall()


# Shared client for the local process.
db = DBClient()
