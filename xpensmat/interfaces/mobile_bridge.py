"""Adapters for transaction payloads submitted by mobile clients."""

from __future__ import annotations

import json
from collections.abc import Mapping
from typing import Any

from xpensmat.core.logger import logger
from xpensmat.data.db import db


def push_mobile_transaction(payload: Mapping[str, Any]) -> dict[str, Any]:
    """Store a mobile transaction payload in the local transaction database."""

    try:
        db.insert_transaction(
            timestamp=payload.get("timestamp"),
            source="mobile",
            raw_json=json.dumps(dict(payload)),
            amount=payload.get("amount"),
        )
        return {"ok": True}
    except Exception as exc:
        logger.exception("Failed to store mobile transaction")
        return {"ok": False, "error": str(exc)}
