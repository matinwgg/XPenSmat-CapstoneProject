# xpensmat/core/logger.py
import logging
from .config import settings

def get_logger(name: str = "xpensmat"):
    level = getattr(logging, settings.LOG_LEVEL.upper(), logging.INFO)
    logging.basicConfig(
        level=level,
        format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
    )
    return logging.getLogger(name)

logger = get_logger()
