"""CLI entrypoint for training experiments.

Example usage:
python -m ml.src.train --data ml/data/processed/transactions.parquet \
    --model experiments/models/xgb_model.joblib
"""

from __future__ import annotations

import argparse
from pathlib import Path

import joblib

from ml.models.baseline import eval_baseline, train_baseline
from ml.models.xgboost_model import eval_xgb, train_xgb
from ml.src.dataset import make_splits
from ml.src.preprocessing import basic_clean, feature_pipeline, load_df


def main(args: argparse.Namespace) -> None:
    frame = load_df(args.data)
    frame = basic_clean(frame)
    frame = feature_pipeline(frame, target_col=args.target)

    target = args.target
    if target not in frame.columns:
        raise SystemExit(f"Target column {target} not found in processed data")

    X_train, X_test, y_train, y_test = make_splits(
        frame, target_col=target, test_size=args.test_size
    )

    baseline = train_baseline(X_train, y_train, strategy="mean")
    print("Baseline metrics:", eval_baseline(baseline, X_test, y_test))

    model = train_xgb(
        X_train,
        y_train,
        X_val=X_test,
        y_val=y_test,
        num_boost_round=args.num_rounds,
    )
    print("XGBoost metrics:", eval_xgb(model, X_test, y_test))

    out_path = Path(args.out)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(model, out_path)
    print("Saved model to", out_path)


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--data", required=True, help="Processed CSV/parquet path")
    parser.add_argument(
        "--out",
        default="experiments/models/xgb_model.joblib",
        help="Output model path",
    )
    parser.add_argument("--target", default="amount", help="Target column name")
    parser.add_argument(
        "--test-size", dest="test_size", type=float, default=0.2
    )
    parser.add_argument(
        "--num-rounds", dest="num_rounds", type=int, default=200
    )
    main(parser.parse_args())
