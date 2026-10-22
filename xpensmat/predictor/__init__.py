"""Prediction package used by the XPenSmat application.

The original ``xpensmat/predictor`` gitlink was not included in the repository,
so this package provides a small, deterministic baseline that keeps the CLI,
orchestrator, and REST API functional. Real model training lives under ``ml/``.
"""

from .evaluate import evaluate_model
from .model_store import MODEL_DIR, load_model
from .predict import predict_from_csv, save_predictions
from .train import train_model

__all__ = [
    "MODEL_DIR",
    "evaluate_model",
    "load_model",
    "predict_from_csv",
    "save_predictions",
    "train_model",
]
