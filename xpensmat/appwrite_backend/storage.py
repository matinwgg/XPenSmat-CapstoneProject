# xpensmat/appwrite_backend/storage.py
from xpensmat.core.logger import logger
from xpensmat.core.config import settings
from pathlib import Path

def upload_blob(name: str, data: bytes):
    if not settings.APPWRITE_ENDPOINT:
        logger.debug("AppWrite not configured; writing to local ./cloud_mirror/%s", name)
        p = Path("./cloud_mirror")
        p.mkdir(parents=True, exist_ok=True)
        with open(p / name, "wb") as f:
            f.write(data)
        return {"ok": True, "path": str(p / name)}
    # TODO: integrate AppWrite SDK
    return {"ok": False, "error": "not implemented"}
