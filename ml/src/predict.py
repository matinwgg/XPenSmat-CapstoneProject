"""Simple prediction CLI.

Usage:
python -m ml.src.predict --model experiments/models/xgb_model.joblib \
    --input new.csv --out preds.csv
"""

from __future__ import annotations

import argparse
from pathlib import Path

import joblib
import numpy as np
import pandas as pd


def _select_features(model, frame: pd.DataFrame) -> pd.DataFrame:
    feature_names = getattr(model, "feature_names_in_", None)
    if feature_names is None:
        return frame
    missing = [name for name in feature_names if name not in frame.columns]
    if missing:
        raise ValueError(
            "input is missing model features: " + ", ".join(map(str, missing))
        )
    return frame[list(feature_names)]


def predict_from_csv(
    model_path: str, input_csv: str, out_csv: str | None = None
) -> list[float]:
    model = joblib.load(model_path)
    frame = pd.read_csv(input_csv)
    data = _select_features(model, frame)

    try:
        predictions = model.predict(data)
    except Exception:
        # XGBoost Booster objects need a DMatrix rather than a DataFrame.
        if type(model).__module__.startswith("xgboost"):
            import xgboost as xgb

            predictions = model.predict(xgb.DMatrix(data))
        else:
            raise
    values = np.asarray(predictions, dtype=float).reshape(-1).tolist()

    if out_csv:
        destination = Path(out_csv)
        destination.parent.mkdir(parents=True, exist_ok=True)
        pd.DataFrame({"prediction": values}).to_csv(destination, index=False)
        print("Wrote predictions to", destination)
    return values


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--model", required=True)
    parser.add_argument("--input", required=True)
    parser.add_argument("--out", required=False)
    args = parser.parse_args()
    result = predict_from_csv(args.model, args.input, args.out)
    print("Predictions:", result[:10])
