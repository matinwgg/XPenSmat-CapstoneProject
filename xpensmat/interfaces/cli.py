# xpensmat/interfaces/cli.py
import argparse
from xpensmat.predictor.predict import predict_from_csv
from xpensmat.core.logger import logger
from xpensmat.data.sms_ingest import poll_and_store
from xpensmat.predictor.train import train_model
from xpensmat.core.orchestrator import orchestrator
from xpensmat.predictor.predict import predict_from_csv, save_predictions
from xpensmat.predictor.evaluate import evaluate_model
     # ALSO load the dataframe here so we have the target column
import pandas as pd

def main():
    p = argparse.ArgumentParser()
    p.add_argument("--ingest-sms", action="store_true")
    p.add_argument("--train", action="store_true")
    p.add_argument("--start-orchestrator", action="store_true")
    p.add_argument("--predict", nargs=1, help="Path to CSV for prediction")
    p.add_argument("--out", type=str, help="Optional: path to save predictions as CSV")
    p.add_argument("--evaluate", type=str, help="Path to CSV with target column for evaluation")
    args = p.parse_args()
    if args.ingest_sms:
        poll_and_store()
    if args.train:
        train_model()
    if args.start_orchestrator:
        orchestrator.start()
    if args.predict:
        csv_path = args.predict[0]
        df = pd.read_csv(csv_path)
        result = predict_from_csv(csv_path)
        print(result[:10], "...")  # Print first 10 predictions
    if args.out:
        # ✅ pass df and target_col so the target column can be saved
        save_predictions(result, args.out, df=df, target_col="MonthlyExpenses")
    if args.evaluate:
        metrics = evaluate_model(args.evaluate)
        print("Evaluation metrics:", metrics)

if __name__ == "__main__":
    main()
