# xpensmat/interfaces/cli.py
"""Command-line interface for XPenSmat."""
from __future__ import annotations

import argparse
from typing import Sequence

import pandas as pd

from xpensmat.core.logger import logger
from xpensmat.core.orchestrator import orchestrator
from xpensmat.data.sms_ingest import poll_and_store
from xpensmat.predictor.evaluate import evaluate_model
from xpensmat.predictor.predict import predict_from_csv, save_predictions
from xpensmat.predictor.train import train_model


def build_parser() -> argparse.ArgumentParser:
    parser = argparse.ArgumentParser(prog="xpensmat")
    parser.add_argument("--ingest-sms", action="store_true")
    parser.add_argument("--train", action="store_true")
    parser.add_argument("--start-orchestrator", action="store_true")
    parser.add_argument("--predict", metavar="CSV", help="Path to CSV for prediction")
    parser.add_argument("--out", type=str, help="Optional: path to save predictions as CSV")
    parser.add_argument(
        "--evaluate", metavar="CSV", type=str, help="Path to CSV with target column"
    )
    return parser


def main(argv: Sequence[str] | None = None) -> int:
    parser = build_parser()
    args = parser.parse_args(argv)

    if args.out and not args.predict:
        parser.error("--out requires --predict CSV")

    if args.ingest_sms:
        count = poll_and_store()
        logger.info("Ingested %s SMS messages", count)

    if args.train:
        model_path = train_model()
        print(f"Saved model to {model_path}")

    if args.start_orchestrator:
        orchestrator.start()

    if args.predict:
        csv_path = args.predict
        frame = pd.read_csv(csv_path)
        result = predict_from_csv(csv_path)
        print(list(result)[:10], "...")

        if args.out:
            destination = save_predictions(
                result,
                args.out,
                df=frame,
                target_col="MonthlyExpenses",
            )
            print(f"Wrote predictions to {destination}")

    if args.evaluate:
        metrics = evaluate_model(args.evaluate)
        print("Evaluation metrics:", metrics)

    return 0


if __name__ == "__main__":  # pragma: no cover
    raise SystemExit(main())
