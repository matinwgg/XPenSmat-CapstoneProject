# xpensmat/data/sms_ingest.py
"""
SMS ingestion example.

In Android/iOS production: you will push SMS messages to a server or use local Android broadcast.
Here we simulate polling a local file/queue or webhook.
"""
import datetime
import json
import os
import re
from pathlib import Path

from xpensmat.core.logger import logger
from xpensmat.data.db import db

SAMPLE_SMS_FILE = "./data/raw/sample_sms.jsonl"

# Prefer a currency marker when present so that reference numbers in the same
# message are not mistaken for the transaction amount.
_CURRENCY_AMOUNT = re.compile(
    r"(?:GHS|NGN|USD|GBP|EUR|KES|ZAR|CFA|₵|\$|€|£)\s*([-+]?\d[\d,]*(?:\.\d+)?)",
    re.IGNORECASE,
)
_NUMBER = re.compile(r"[-+]?\d[\d,]*(?:\.\d+)?")


def parse_sms_text(text: str) -> dict:
    """Extract the first monetary amount from an SMS body.

    Handles currency prefixes (``GHS 2,000.50``), thousands separators and
    decimal values. Returns ``None`` when no number is present.
    """
    if not isinstance(text, str):
        return {"raw": text, "amount": None}

    match = _CURRENCY_AMOUNT.search(text) or _NUMBER.search(text)
    if not match:
        return {"raw": text, "amount": None}

    token = (match.group(1) if match.re.groups else match.group(0)).replace(",", "")
    try:
        amount = float(token)
    except ValueError:  # pragma: no cover - guarded by the regex
        amount = None
    return {"raw": text, "amount": amount}


def _target_path(file_path: str | Path | None = None) -> Path:
    if file_path is not None:
        return Path(file_path)
    return Path(os.getenv("XPENSMAT_SMS_FILE", SAMPLE_SMS_FILE))


def poll_and_store(file_path: str | Path | None = None) -> int:
    """Ingest queued SMS messages and return the number stored.

    Unparseable lines are left in the queue instead of being silently dropped
    so that a malformed message cannot destroy financial data.
    """
    path = _target_path(file_path)
    try:
        content = path.read_text(encoding="utf-8")
    except FileNotFoundError:
        return 0

    lines = [line for line in content.splitlines() if line.strip()]
    unprocessed: list[str] = []
    ingested = 0

    for line in lines:
        try:
            payload = json.loads(line)
            if not isinstance(payload, dict):
                raise ValueError("SMS queue entries must be JSON objects")
            text = payload.get("text") or payload.get("message") or ""
            parsed = parse_sms_text(text)
            timestamp = payload.get("timestamp") or datetime.datetime.now(
                datetime.timezone.utc
            ).isoformat()
            db.insert_transaction(
                timestamp=timestamp,
                source="sms",
                raw_json=json.dumps(payload),
                amount=parsed["amount"],
            )
            ingested += 1
            logger.info("Ingested SMS with amount=%s", parsed["amount"])
        except Exception as e:
            logger.exception("Failed to ingest SMS line: %s", e)
            unprocessed.append(line)

    if unprocessed:
        path.write_text("\n".join(unprocessed) + "\n", encoding="utf-8")
    else:
        path.write_text("", encoding="utf-8")

    return ingested
