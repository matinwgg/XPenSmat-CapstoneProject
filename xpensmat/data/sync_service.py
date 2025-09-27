# xpensmat/data/sync_service.py
"""
Simple AppWrite cloud sync placeholder.
Replace with real AppWrite SDK integration as required.
"""
from xpensmat.core.logger import logger
from xpensmat.core.config import settings

def sync_to_appwrite():
    if not settings.APPWRITE_ENDPOINT:
        logger.debug("AppWrite not configured; skipping sync")
        return
    # TODO: implement AppWrite SDK calls to upload encrypted blobs
    logger.info("Sync to AppWrite - not implemented (placeholder)")
