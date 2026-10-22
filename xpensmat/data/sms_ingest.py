# xpensmat/data/sms_ingest.py
"""SMS ingestion helpers.

The parser is deliberately small and deterministic. Production deployments
should replace it with a provider-specific template parser or an NLP extractor
that can distinguish amounts from dates, phone numbers, and reference codes.
"""

from __future__ import annotations

import datetime
import json
import re
from pathlib import Path

from xpensmat.core.config import settings
from xpensmat.core.logger import logger
from xpensmat.data.db import db

SAMPLE_SMS_FILE = Path(settings.DATA_DIR) / "raw" / "sample_sms.jsonl"

# Prefer an explicitly tagged currency amount, then a comma/decimal amount, and
# finally a plain integer. The negative lookarounds keep date fragments such as
# 2025-09-01 from being treated as money.
_CURRENCY_AMOUNT = re.compile(
    r"(?:GHS|NGN|USD|GBP|EUR|₵|\$)\s*([\d,]+(?:\.\d{1,2})?)",
    re.IGNORECASE,
)
_DECIMAL_AMOUNT = re.compile(
    r"(?<![\d-])(\d{1,3}(?:,\d{3})+(?:\.\d{1,2})?|\d+\.\d{1,2})(?![\d-])"
)
_PLAIN_AMOUNT = re.compile(r"(?<![\d-])(\d+)(?![\d-])")


def _extract_amount(text: str) -> float | None:
    for pattern in (_CURRENCY_AMOUNT, _DECIMAL_AMOUNT, _PLAIN_AMOUNT):
        match = pattern.search(text)
        if match:
            try:
                return float(match.group(1).replace(",", ""))
            except ValueError:
                continue
    return None


def parse_sms_text(text: str) -> dict:
    """Extract a best-effort amount from an SMS message."""
    if not isinstance(text, str):
        return {"raw": text, "amount": None}
    return {"raw": text, "amount": _extract_amount(text)}


def _sample_path() -> Path:
    # Read the setting at call time so tests can redirect it.
    return Path(settings.DATA_DIR) / "raw" / "sample_sms.jsonl"


def poll_and_store() -> int:
    """Ingest queued sample SMS records, then clear the queue file."""
    path = _sample_path()
    try:
        lines = path.read_text(encoding="utf-8").splitlines()
    except FileNotFoundError:
        return 0

    count = 0
    for line in lines:
        if not line.strip():
            continue
        try:
            payload = json.loads(line)
            text = payload.get("text") or payload.get("message") or ""
            parsed = parse_sms_text(text)
            timestamp = payload.get("timestamp") or datetime.datetime.now(
                datetime.UTC
            ).isoformat()
            db.insert_transaction(
                timestamp=timestamp,
                source="sms",
                raw_json=json.dumps(payload),
                amount=parsed["amount"],
            )
            count += 1
            logger.info("Ingested SMS with amount=%s", parsed["amount"])
        except Exception as exc:  # noqa: BLE001 - one bad line must not stop the queue
            logger.exception("Failed to ingest SMS line: %s", exc)

    path.write_text("", encoding="utf-8")
    return count
