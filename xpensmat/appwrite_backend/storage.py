# xpensmat/appwrite_backend/storage.py
from pathlib import Path

from xpensmat.core.config import settings
from xpensmat.core.logger import logger


def _safe_name(name: str) -> str:
    if not isinstance(name, str) or not name.strip():
        raise ValueError("blob name must be a non-empty string")
    # Never allow a caller to escape the local mirror directory.
    if name != Path(name).name or name in {".", ".."}:
        raise ValueError("blob name must be a plain filename")
    return name


def upload_blob(name: str, data: bytes):
    filename = _safe_name(name)
    if not isinstance(data, (bytes, bytearray)):
        raise TypeError("data must be bytes")

    if not settings.APPWRITE_ENDPOINT:
        logger.debug("AppWrite not configured; writing to local ./cloud_mirror/%s", filename)
        directory = Path("./cloud_mirror")
        directory.mkdir(parents=True, exist_ok=True)
        path = directory / filename
        path.write_bytes(bytes(data))
        return {"ok": True, "path": str(path)}
    # TODO: integrate AppWrite SDK
    return {"ok": False, "error": "not implemented"}
