# xpensmat/appwrite_backend/auth.py
"""Authentication hooks for AppWrite.

Until the AppWrite SDK integration is implemented, authentication fails closed.
Returning a demo token when the backend is unconfigured would turn a missing
configuration into a full authentication bypass.
"""

from __future__ import annotations

from xpensmat.core.config import settings
from xpensmat.core.logger import logger


def login(email: str, password: str) -> dict:
    if not email or not password:
        return {"ok": False, "error": "email and password are required"}
    if not settings.APPWRITE_ENDPOINT:
        logger.warning("AppWrite is not configured; refusing login")
        return {"ok": False, "error": "AppWrite is not configured"}
    logger.warning("AppWrite login is not implemented; refusing login")
    return {"ok": False, "error": "AppWrite login is not implemented"}
