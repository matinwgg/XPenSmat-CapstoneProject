# xpensmat/appwrite_backend/auth.py
"""
Placeholder authentication hooks for AppWrite.
In production, use the AppWrite Python SDK.
"""
from xpensmat.core.logger import logger
from xpensmat.core.config import settings

def login(email: str, password: str):
    if not settings.APPWRITE_ENDPOINT:
        logger.warning("AppWrite not configured - login is a noop")
        return {"ok": True, "token": "demo-token"}
    # TODO: implement real login via appwrite sdk
    return {"ok": True}
