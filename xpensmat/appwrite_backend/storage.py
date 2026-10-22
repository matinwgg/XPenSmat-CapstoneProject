# xpensmat/appwrite_backend/storage.py
from pathlib import Path

from xpensmat.core.config import settings
from xpensmat.core.logger import logger


def upload_blob(name: str, data: bytes):
    if not settings.APPWRITE_ENDPOINT:
        logger.warning(
            "AppWrite is not configured; writing %s to the local mirror", name
        )
        mirror = Path("./cloud_mirror")
        mirror.mkdir(parents=True, exist_ok=True)
        destination = mirror / name
        destination.write_bytes(data)
        return {
            "ok": False,
            "error": "AppWrite is not configured",
            "path": str(destination),
        }
    logger.warning("AppWrite blob upload is not implemented: %s", name)
    return {"ok": False, "error": "AppWrite upload is not implemented"}
