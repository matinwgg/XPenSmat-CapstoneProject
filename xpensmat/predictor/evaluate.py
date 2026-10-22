"""Regression evaluation without requiring scikit-learn at runtime."""

from __future__ import annotations

from pathlib import Path

import numpy as np
import pandas as pd

from .model_store import load_model
from .predict import _predict


def evaluate_model(
    csv_path: str | Path,
    model_path: str | Path | None = None,
    target_col: str | None = None,
) -> dict[str, float]:
    frame = pd.read_csv(csv_path)
    if target_col is None:
        for candidate in ("MonthlyExpenses", "amount", "Amount", "expense"):
            if candidate in frame.columns:
                target_col = candidate
                break
    if target_col is None or target_col not in frame.columns:
        raise ValueError("evaluation data needs a target column")

    target = pd.to_numeric(frame[target_col], errors="coerce")
    mask = target.notna()
    if not mask.any():
        raise ValueError("target column has no numeric values")

    predictions = _predict(load_model(model_path), frame.loc[mask])
    actual = target.loc[mask].to_numpy(dtype=float)
    errors = actual - predictions

    rmse = float(np.sqrt(np.mean(errors**2)))
    mae = float(np.mean(np.abs(errors)))
    denominator = float(np.sum((actual - actual.mean()) ** 2))
    r2 = float(1.0 - np.sum(errors**2) / denominator) if denominator else 0.0
    return {"rmse": rmse, "mae": mae, "r2": r2, "n": float(mask.sum())}
