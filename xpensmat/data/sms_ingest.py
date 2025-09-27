# xpensmat/data/sms_ingest.py
"""
SMS ingestion example.

In Android/iOS production: you will push SMS messages to a server or use local Android broadcast.
Here we simulate polling a local file/queue or webhook.
"""
import json
import datetime
from xpensmat.data.db import db
from xpensmat.core.logger import logger

SAMPLE_SMS_FILE = "./data/raw/sample_sms.jsonl"

def parse_sms_text(text: str) -> dict:
    """
    Very simple parser that tries to extract an amount token like 'NGN 2,000' or '2000'.
    Replace with a proper NLP extractor.
    """
    import re
    m = re.search(r"(\d+[\\,\\d]*\\.?\\d*)", text.replace(",", ""))
    value = float(m.group(1)) if m else None
    return {"raw": text, "amount": value}

def poll_and_store():
    # If sample file exists, read lines and insert them then truncate file
    try:
        with open(SAMPLE_SMS_FILE, "r", encoding="utf-8") as f:
            lines = f.read().strip().splitlines()
    except FileNotFoundError:
        return

    for line in lines:
        try:
            payload = json.loads(line)
            text = payload.get("text") or payload.get("message") or ""
            parsed = parse_sms_text(text)
            timestamp = payload.get("timestamp") or datetime.datetime.utcnow().isoformat()
            db.insert_transaction(timestamp=timestamp, source="sms", raw_json=json.dumps(payload), amount=parsed["amount"])
            logger.info("Ingested SMS with amount=%s", parsed["amount"])
        except Exception as e:
            logger.exception("Failed to ingest SMS line: %s", e)

    # clear file after processing
    open(SAMPLE_SMS_FILE, "w").close()
