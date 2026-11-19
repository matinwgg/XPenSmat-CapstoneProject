# xpensmat/appwrite_backend/auth.py
"""
Placeholder authentication hooks for AppWrite.
In production, use the AppWrite Python SDK.
"""
from xpensmat.core.config import settings
from xpensmat.core.logger import logger


def login(email: str, password: str):
    """Attempt a login.

    In this capstone build the Appwrite SDK is not wired up: when no endpoint
    is configured a demo token is returned, otherwise the call is a no-op
    placeholder.  Missing credentials are rejected.
    """
    if not email or not password:
        return {"ok": False, "error": "email and password are required"}
    if not settings.APPWRITE_ENDPOINT:
        logger.warning("AppWrite not configured - login is a noop")
        return {"ok": True, "token": "demo-token"}
    # TODO: implement real login via appwrite sdk
    return {"ok": True}
