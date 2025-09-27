# xpensmat/interfaces/mobile_bridge.py
"""
Simple adapter functions used by the mobile app to push messages/transactions.
Mobile apps should call REST endpoints; this file shows helper functions used on server side.
"""
from xpensmat.data.db import db
from xpensmat.core.logger import logger
import json

def push_mobile_transaction(payload: dict):
    # payload should contain at least timestamp, source, and amount fields
    try:
        db.insert_transaction(timestamp=payload.get("timestamp"), source="mobile", raw_json=json.dumps(payload), amount=payload.get("amount"))
        return {"ok": True}
    except Exception as e:
        logger.exception("push_mobile_transaction failed: %s", e)
        return {"ok": False, "error": str(e)}
