# xpensmat/data/sync_service.py
"""
Simple AppWrite cloud sync placeholder.

Replace with real AppWrite SDK integration as required.  Returning a boolean
lets the orchestrator and tests distinguish "skipped" from "attempted".
"""
from xpensmat.core.config import settings
from xpensmat.core.logger import logger


def sync_to_appwrite() -> bool:
    if not settings.APPWRITE_ENDPOINT:
        logger.debug("AppWrite not configured; skipping sync")
        return False
    # TODO: implement AppWrite SDK calls to upload encrypted blobs
    logger.info("Sync to AppWrite - not implemented (placeholder)")
    return False
