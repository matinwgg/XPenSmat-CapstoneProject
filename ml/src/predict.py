"""
Simple prediction CLI.

Usage:
python -m ml.src.predict --model experiments/xgb_model.joblib --input new.csv --out preds.csv
"""

import argparse
from pathlib import Path
import pandas as pd
import joblib
import numpy as np

def predict_from_csv(model_path: str, input_csv: str, out_csv: str = None):
    model = joblib.load(model_path)
    df = pd.read_csv(input_csv)
    # Basic assumption: model expects same features as in processed training,
    # so user should run preprocessing.feature_pipeline first on new rows.
    # If df contains a single column 'amount' and model is trivial, adapt accordingly.
    # If model is an XGBoost trained via xgb.train, joblib load might return Booster; handle both.
    try:
        # If it is an sklearn-style estimator
        preds = model.predict(df)
    except Exception:
        # Try XGBoost Booster predict path
        try:
            import xgboost as xgb
            d = xgb.DMatrix(df)
            preds = model.predict(d)
        except Exception:
            raise RuntimeError("Model type not supported for automatic prediction. Preprocess input to match training features.")

    preds = list(preds)
    if out_csv:
        out = Path(out_csv)
        out.parent.mkdir(parents=True, exist_ok=True)
        pd.DataFrame({"prediction": preds}).to_csv(out, index=False)
        print("Wrote predictions to", out)
    return preds

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--model", required=True)
    parser.add_argument("--input", required=True)
    parser.add_argument("--out", required=False)
    args = parser.parse_args()
    res = predict_from_csv(args.model, args.input, args.out)
    print("Predictions:", res[:10])
