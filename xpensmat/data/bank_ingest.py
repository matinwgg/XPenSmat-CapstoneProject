# xpensmat/data/bank_ingest.py
"""
Bank/financial ingestion connectors.

This file contains skeleton functions for integrating with bank APIs (Plaid,
Monnify, etc.).  A mock transaction is only inserted when explicitly enabled
via ``XPENSMAT_BANK_MOCK=1`` (or ``pull_accounts(mock=True)``) so that the
background orchestrator does not create fake transactions on every tick.
"""
import datetime
import json
import os

from xpensmat.core.logger import logger
from xpensmat.data.db import db

MOCK_ENV = "XPENSMAT_BANK_MOCK"
_TRUE_VALUES = {"1", "true", "yes", "on"}


def _mock_enabled(mock: bool | None) -> bool:
    if mock is not None:
        return bool(mock)
    return os.getenv(MOCK_ENV, "").strip().lower() in _TRUE_VALUES


def pull_accounts(mock: bool | None = None) -> list[dict]:
    """Pull recent transactions from configured bank providers.

    No provider is configured in this capstone build.  When mock mode is
    enabled a single example transaction is stored and returned; otherwise the
    function is a no-op that returns an empty list.
    """
    if not _mock_enabled(mock):
        logger.debug("pull_accounts: no provider configured")
        return []

    now = datetime.datetime.now(datetime.timezone.utc).isoformat()
    example = {
        "provider": "mockbank",
        "description": "Coffee shop",
        "amount": 1200,
    }
    db.insert_transaction(
        timestamp=now,
        source="bank",
        raw_json=json.dumps(example),
        amount=example["amount"],
    )
    logger.info("Mock bank transaction inserted")
    return [example]
