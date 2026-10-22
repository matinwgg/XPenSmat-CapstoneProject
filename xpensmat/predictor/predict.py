"""Prediction helpers shared by the CLI and REST API."""

from __future__ import annotations

from pathlib import Path

import numpy as np
import pandas as pd

from .model_store import load_model


def _predict(model: object, frame: pd.DataFrame) -> np.ndarray:
    if isinstance(model, dict) and model.get("type") == "mean":
        return np.full(len(frame), float(model.get("mean", 0.0)), dtype=float)

    if not hasattr(model, "predict"):
        raise ValueError(f"model {type(model).__name__} does not support prediction")

    feature_names = getattr(model, "feature_names_in_", None)
    if feature_names is not None:
        missing = [name for name in feature_names if name not in frame.columns]
        if missing:
            raise ValueError(
                "input is missing model features: " + ", ".join(map(str, missing))
            )
        data = frame[list(feature_names)]
    else:
        data = frame

    try:
        predictions = model.predict(data)
    except Exception:
        # xgboost Booster objects need a DMatrix rather than a DataFrame.
        if type(model).__module__.startswith("xgboost"):
            import xgboost as xgb

            predictions = model.predict(xgb.DMatrix(data))
        else:
            raise
    return np.asarray(predictions, dtype=float).reshape(-1)


def predict_from_csv(
    csv_path: str | Path, model_path: str | Path | None = None
) -> list[float]:
    frame = pd.read_csv(csv_path)
    return [float(value) for value in _predict(load_model(model_path), frame)]


def save_predictions(
    predictions: list[float],
    out_path: str | Path,
    df: pd.DataFrame | None = None,
    target_col: str | None = None,
) -> Path:
    destination = Path(out_path)
    destination.parent.mkdir(parents=True, exist_ok=True)

    output = pd.DataFrame({"prediction": list(predictions)})
    if df is not None:
        if len(df) != len(output):
            raise ValueError("predictions and input rows have different lengths")
        base = df.drop(columns=[target_col], errors="ignore").reset_index(drop=True)
        output = pd.concat([base, output], axis=1)

    output.to_csv(destination, index=False)
    return destination
