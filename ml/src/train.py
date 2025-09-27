"""
CLI entrypoint for training experiments.

Example usage:
python -m ml.src.train --data ml/data/processed/transactions.parquet --model experiments/xgb_model.joblib
"""

import argparse
from pathlib import Path
from ml.src.preprocessing import load_df, basic_clean, feature_pipeline
from ml.src.dataset import make_splits
from ml.src.models.xgboost_model import train_xgb, save_xgb, eval_xgb
from ml.src.models.baseline import train_baseline, eval_baseline
import joblib

def main(args):
    data_path = args.data
    out_model = args.out
    df = load_df(data_path)
    df = basic_clean(df)
    df = feature_pipeline(df)

    # Default: use amount as target
    target = args.target
    if target not in df.columns:
        raise SystemExit(f"Target column {target} not found in processed data")

    X_train, X_test, y_train, y_test = make_splits(df, target_col=target, test_size=args.test_size)

    # Baseline
    baseline = train_baseline(X_train, y_train, strategy="mean")
    baseline_metrics = eval_baseline(baseline, X_test, y_test)
    print("Baseline metrics:", baseline_metrics)

    # XGBoost
    model = train_xgb(X_train, y_train, X_val=X_test, y_val=y_test, num_boost_round=args.num_rounds)
    metrics = eval_xgb(model, X_test, y_test)
    print("XGBoost metrics:", metrics)

    # Save model
    out_path = Path(out_model)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(model, out_path)
    print("Saved model to", out_path)

if __name__ == "__main__":
    p = argparse.ArgumentParser()
    p.add_argument("--data", required=True, help="Processed parquet data path")
    p.add_argument("--out", default="experiments/xgb_model.joblib", help="Output model path")
    p.add_argument("--target", default="amount", help="Target column name")
    p.add_argument("--test-size", dest="test_size", type=float, default=0.2)
    p.add_argument("--num-rounds", dest="num_rounds", type=int, default=200)
    args = p.parse_args()
    main(args)
