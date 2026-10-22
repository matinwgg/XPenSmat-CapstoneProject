# xpensmat/appwrite_backend/functions.py
from xpensmat.core.logger import logger


def call_function(name: str, payload: dict):
    logger.warning("AppWrite function call is not implemented: %s", name)
    return {"status": "not_implemented", "name": name}
