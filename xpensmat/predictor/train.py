"""Train the small application-level baseline predictor.

The research pipeline under ``ml/`` trains richer models. This module only
produces a safe fallback model (the mean of observed amounts) so the app has a
working prediction path even when the ML extras are not installed.
"""

from __future__ import annotations

from pathlib import Path

import joblib
import pandas as pd

from .model_store import MEAN_MODEL_PATH


def _load_amounts(data_path: str | Path, target_col: str) -> pd.Series:
    path = Path(data_path)
    if path.suffix.lower() == ".parquet":
        frame = pd.read_parquet(path)
    else:
        frame = pd.read_csv(path)
    if target_col not in frame.columns:
        raise ValueError(f"target column {target_col!r} not found in {path}")
    return pd.to_numeric(frame[target_col], errors="coerce").dropna()


def _amounts_from_db() -> pd.Series:
    # Imported lazily so training from a CSV does not create the local DB.
    from xpensmat.data.db import db

    rows = db.list_transactions(limit=10_000)
    values = [row[4] for row in rows if row[4] is not None]
    return pd.Series(values, dtype="float64")


def train_model(
    data_path: str | Path | None = None,
    target_col: str = "amount",
    out_path: str | Path | None = None,
) -> Path:
    """Write a mean baseline model and return its path.

    With ``data_path`` the target column is read from CSV/parquet. Without it,
    the local transaction database is used.
    """
    amounts = (
        _load_amounts(data_path, target_col)
        if data_path is not None
        else _amounts_from_db()
    )
    mean = float(amounts.mean()) if len(amounts) else 0.0
    model = {
        "type": "mean",
        "mean": mean,
        "n_samples": int(len(amounts)),
    }

    destination = Path(out_path) if out_path is not None else MEAN_MODEL_PATH
    destination.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(model, destination)
    return destination
