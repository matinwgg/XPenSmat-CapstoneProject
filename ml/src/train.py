"""
CLI entrypoint for training experiments.

Example usage:
python -m ml.src.train --data ml/data/processed/transactions.parquet --model experiments/xgb_model.joblib
"""

import argparse
from pathlib import Path

import pandas as pd

from ml.models.baseline import eval_baseline, train_baseline
from ml.models.xgboost_model import eval_xgb, train_xgb
from ml.src.dataset import make_splits
from ml.src.preprocessing import basic_clean, feature_pipeline, load_df


def main(args):
    data_path = args.data
    out_model = args.out

    df = load_df(data_path)
    df = basic_clean(df)
    df = feature_pipeline(df)

    target = args.target
    if target not in df.columns:
        raise SystemExit(f"Target column {target} not found in processed data")

    df[target] = pd.to_numeric(df[target], errors="coerce")
    df = df.dropna(subset=[target])
    if len(df) < 5:
        raise SystemExit("Not enough labelled rows to train a model")

    X_train, X_test, y_train, y_test = make_splits(
        df, target_col=target, test_size=args.test_size
    )

    # Baseline
    baseline = train_baseline(X_train, y_train, strategy="mean")
    baseline_metrics = eval_baseline(baseline, X_test, y_test)
    print("Baseline metrics:", baseline_metrics)

    # XGBoost
    model = train_xgb(
        X_train, y_train, X_val=X_test, y_val=y_test, num_boost_round=args.num_rounds
    )
    metrics = eval_xgb(model, X_test, y_test)
    print("XGBoost metrics:", metrics)

    # Save model
    out_path = Path(out_model)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    import joblib

    joblib.dump(model, out_path)
    print("Saved model to", out_path)
    return out_path


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser()
    parser.add_argument("--data", required=True, help="Processed parquet/CSV data path")
    parser.add_argument("--out", default="experiments/xgb_model.joblib", help="Output model path")
    parser.add_argument("--target", default="amount", help="Target column name")
    parser.add_argument("--test-size", dest="test_size", type=float, default=0.2)
    parser.add_argument("--num-rounds", dest="num_rounds", type=int, default=200)
    return parser


if __name__ == "__main__":  # pragma: no cover
    main(build_parser().parse_args())
