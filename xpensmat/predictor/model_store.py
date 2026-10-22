"""Model discovery and safe loading for the application predictor."""

from __future__ import annotations

import logging
from pathlib import Path

import joblib

from xpensmat.core.config import settings

logger = logging.getLogger(__name__)

MODEL_DIR = Path(settings.MODEL_DIR)
MEAN_MODEL_PATH = MODEL_DIR / "mean_model.joblib"
XGB_MODEL_PATH = MODEL_DIR / "xgb_model.joblib"


def _default_model_path() -> Path:
    if XGB_MODEL_PATH.exists():
        return XGB_MODEL_PATH
    return MEAN_MODEL_PATH


def load_model(path: str | Path | None = None) -> object:
    """Load a model, falling back to the mean baseline when possible.

    A caller-supplied path is strict: an unreadable model raises. The default
    path is best-effort because the repository may not have XGBoost or the
    optional runtime libraries installed.
    """
    explicit = path is not None
    model_path = Path(path) if path is not None else _default_model_path()

    if not model_path.exists():
        if explicit:
            raise FileNotFoundError(f"predictor model not found: {model_path}")
        logger.info("No predictor model found; using the mean baseline")
        return {"type": "mean", "mean": 0.0}

    try:
        return joblib.load(model_path)
    except Exception as exc:  # optional xgboost/sklearn may be unavailable
        if not explicit and model_path != MEAN_MODEL_PATH and MEAN_MODEL_PATH.exists():
            logger.warning(
                "Could not load %s (%s); falling back to %s",
                model_path,
                exc,
                MEAN_MODEL_PATH,
            )
            return joblib.load(MEAN_MODEL_PATH)
        raise ValueError(f"could not load predictor model {model_path}: {exc}") from exc


def model_name(model: object) -> str:
    if isinstance(model, dict) and model.get("type") == "mean":
        return "mean"
    return type(model).__name__
