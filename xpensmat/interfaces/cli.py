# xpensmat/interfaces/cli.py
"""Command-line entry point for XPenSmat.

Heavy or optional components (the predictor, pandas, the orchestrator) are
imported inside the command that needs them so ``--help`` and the ingestion
path keep working even when optional extras are not installed.
"""

from __future__ import annotations

import argparse
import sys
import time


def _run_ingest() -> int:
    from xpensmat.data.sms_ingest import poll_and_store

    count = poll_and_store()
    print(f"Ingested {count} SMS record(s).")
    return 0


def _run_train(args: argparse.Namespace) -> int:
    from xpensmat.predictor.train import train_model

    path = train_model(
        data_path=args.data,
        target_col=args.target or "amount",
        out_path=args.model,
    )
    print(f"Wrote baseline model to {path}.")
    return 0


def _run_predict(args: argparse.Namespace) -> int:
    import pandas as pd

    from xpensmat.predictor.predict import predict_from_csv, save_predictions

    result = predict_from_csv(args.predict, model_path=args.model)
    print(result[:10], "...")
    if args.out:
        frame = pd.read_csv(args.predict)
        destination = save_predictions(
            result, args.out, df=frame, target_col=args.target
        )
        print(f"Wrote predictions to {destination}.")
    return 0


def _run_evaluate(args: argparse.Namespace) -> int:
    from xpensmat.predictor.evaluate import evaluate_model

    metrics = evaluate_model(
        args.evaluate, model_path=args.model, target_col=args.target
    )
    print("Evaluation metrics:", metrics)
    return 0


def _run_orchestrator() -> int:
    from xpensmat.core.orchestrator import orchestrator

    orchestrator.start()
    print("Orchestrator started. Press Ctrl+C to stop.")
    try:
        while True:
            time.sleep(1)
    except KeyboardInterrupt:
        orchestrator.stop()
    return 0


def main(argv: list[str] | None = None) -> int:
    parser = argparse.ArgumentParser(prog="xpensmat")
    parser.add_argument("--ingest-sms", action="store_true")
    parser.add_argument("--train", action="store_true")
    parser.add_argument("--start-orchestrator", action="store_true")
    parser.add_argument("--predict", metavar="CSV", help="CSV file to score")
    parser.add_argument("--out", help="write predictions to this CSV")
    parser.add_argument("--evaluate", metavar="CSV", help="CSV with a target column")
    parser.add_argument("--data", help="training CSV or parquet file")
    parser.add_argument("--model", help="model path (default: experiments/models)")
    parser.add_argument(
        "--target",
        help="target column (default: amount for training; auto-detect for evaluation)",
    )
    args = parser.parse_args(argv)

    if args.out and not args.predict:
        parser.error("--out requires --predict")

    try:
        if args.ingest_sms:
            return _run_ingest()
        if args.train:
            return _run_train(args)
        if args.predict:
            return _run_predict(args)
        if args.evaluate:
            return _run_evaluate(args)
        if args.start_orchestrator:
            return _run_orchestrator()
    except (FileNotFoundError, ValueError) as exc:
        print(f"Error: {exc}", file=sys.stderr)
        return 1

    parser.print_help()
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
