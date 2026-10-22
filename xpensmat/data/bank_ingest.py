# xpensmat/data/bank_ingest.py
"""Bank/financial ingestion connectors.

The provider clients are intentionally not implemented yet. Demo mode can
insert a synthetic transaction so the rest of the pipeline can be exercised,
but it is opt-in so a real database never receives fake rows by accident.
"""

from __future__ import annotations

import datetime
import json

from xpensmat.core.config import settings
from xpensmat.core.logger import logger
from xpensmat.data.db import db


def pull_accounts() -> int:
    """Pull recent transactions from configured providers.

    Returns the number of inserted transactions. No provider is configured in
    this prototype, so this is a no-op unless demo mode is enabled.
    """
    if not settings.DEMO_MODE:
        logger.debug("pull_accounts: no provider configured")
        return 0

    now = datetime.datetime.now(datetime.UTC).isoformat()
    example = {"provider": "mockbank", "description": "Coffee shop", "amount": 1200}
    db.insert_transaction(
        timestamp=now,
        source="bank",
        raw_json=json.dumps(example),
        amount=example["amount"],
    )
    logger.info("Demo bank transaction inserted")
    return 1
