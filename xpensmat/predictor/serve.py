"""Background prediction helpers used by the orchestrator and REST API."""

from __future__ import annotations

from xpensmat.core.logger import logger
from xpensmat.data.db import db

from .model_store import load_model, model_name


def predict_for_txn(txn: tuple, model: object | None = None) -> float:
    """Return a prediction for one transaction row.

    A real feature contract is not part of the application layer, so a loaded
    model is used only when the caller can provide compatible features. The
    deterministic baseline returns the mean amount.
    """
    if model is None:
        model = load_model()
    if isinstance(model, dict) and model.get("type") == "mean":
        return float(model.get("mean", 0.0))
    # The transaction tuple carries an observed amount at index 4. Without a
    # documented feature mapping, use it rather than inventing features.
    if len(txn) > 4 and txn[4] is not None:
        return float(txn[4])
    return 0.0


def run_periodic_predict(limit: int = 100) -> int:
    """Store predictions for recent transactions, skipping duplicates."""
    model = load_model()
    name = model_name(model)
    stored = 0
    for txn in db.list_transactions(limit=limit):
        predicted = predict_for_txn(txn, model=model)
        if db.insert_prediction(txn[0], predicted, name) is not None:
            stored += 1
    logger.info("Stored %s new prediction(s) with model %s", stored, name)
    return stored
