import pandas as pd
import pytest

from xpensmat.predictor.evaluate import evaluate_model
from xpensmat.predictor.model_store import load_model
from xpensmat.predictor.predict import predict_from_csv, save_predictions
from xpensmat.predictor.train import train_model


def _training_csv(tmp_path):
    path = tmp_path / "training.csv"
    pd.DataFrame({"amount": [10.0, 20.0, 30.0]}).to_csv(path, index=False)
    return path


def test_train_and_load(tmp_path):
    model_path = train_model(
        data_path=_training_csv(tmp_path),
        target_col="amount",
        out_path=tmp_path / "mean.joblib",
    )
    assert model_path.exists()
    model = load_model(model_path)
    assert model["type"] == "mean"
    assert model["mean"] == 20.0


def test_predict_from_csv_uses_mean_baseline(tmp_path):
    data = _training_csv(tmp_path)
    model_path = train_model(
        data_path=data, target_col="amount", out_path=tmp_path / "mean.joblib"
    )
    assert predict_from_csv(data, model_path=model_path) == [20.0, 20.0, 20.0]


def test_save_predictions_keeps_input_columns(tmp_path):
    data = _training_csv(tmp_path)
    model_path = train_model(
        data_path=data, target_col="amount", out_path=tmp_path / "mean.joblib"
    )
    predictions = predict_from_csv(data, model_path=model_path)
    output = save_predictions(
        predictions,
        tmp_path / "predictions.csv",
        df=pd.read_csv(data),
        target_col="amount",
    )
    frame = pd.read_csv(output)
    assert "prediction" in frame.columns
    assert "amount" not in frame.columns
    assert frame["prediction"].tolist() == predictions


def test_evaluate_model(tmp_path):
    data = _training_csv(tmp_path)
    model_path = train_model(
        data_path=data, target_col="amount", out_path=tmp_path / "mean.joblib"
    )
    metrics = evaluate_model(data, model_path=model_path, target_col="amount")
    assert metrics["n"] == 3
    assert metrics["mae"] == pytest.approx(20.0 / 3.0)


def test_explicit_missing_model_is_an_error(tmp_path):
    with pytest.raises(FileNotFoundError):
        load_model(tmp_path / "missing.joblib")


def test_periodic_predictions_are_stored_once():
    from xpensmat.data.db import db
    from xpensmat.predictor.serve import run_periodic_predict

    db.insert_transaction("2025-01-01", "test", "{}", amount=42.0)

    assert run_periodic_predict(limit=10) >= 1
    assert run_periodic_predict(limit=10) == 0
