# xpensmat/appwrite_backend/functions.py
from xpensmat.core.logger import logger


def call_function(name: str, payload: dict):
    if not name:
        raise ValueError("function name is required")
    if not isinstance(payload, dict):
        raise TypeError("payload must be a dict")
    logger.info("Call AppWrite function (placeholder): %s payload=%s", name, payload)
    # TODO: integrate appwrite-python sdk
    return {"status": "ok"}
