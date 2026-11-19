# xpensmat/core/logger.py
import logging

from .config import settings


def get_logger(name: str = "xpensmat"):
    level = getattr(logging, str(settings.LOG_LEVEL).upper(), logging.INFO)
    logging.basicConfig(
        level=level,
        format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
    )
    logger = logging.getLogger(name)
    # ``basicConfig`` only configures the root logger; set the level on the
    # named logger as well so callers observe the configured threshold.
    logger.setLevel(level)
    return logger


logger = get_logger()
