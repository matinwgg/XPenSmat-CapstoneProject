"""Prediction and evaluation tests."""

import numpy as np
import pandas as pd
import pytest

from xpensmat.predictor.evaluate import evaluate_model, regression_metrics
from xpensmat.predictor.predict import (
    predict_dataframe,
    predict_from_csv,
    predict_one,
    save_predictions,
)


def test_predict_from_csv(prediction_csv, trained_model):
    predictions = predict_from_csv(prediction_csv, model_path=trained_model)
    assert len(predictions) == 12
    assert all(isinstance(value, float) for value in predictions)
    assert all(np.isfinite(predictions))


def test_predict_from_missing_csv(tmp_path, trained_model):
    with pytest.raises(FileNotFoundError):
        predict_from_csv(tmp_path / "missing.csv", model_path=trained_model)


def test_predict_one_record(trained_model):
    prediction = predict_one(
        {
            "month": 6,
            "day_of_week": 2,
            "is_weekend": 0,
            "category": "Food",
            "source": "sms",
        },
        model_path=trained_model,
    )
    assert isinstance(prediction, float)
    assert np.isfinite(prediction)


def test_predict_dataframe_ignores_extra_columns(trained_model):
    frame = pd.DataFrame(
        [
            {
                "month": 1,
                "day_of_week": 1,
                "is_weekend": 0,
                "category": "Food",
                "source": "sms",
                "unrelated": "ignored",
            }
        ]
    )
    predictions = predict_dataframe(frame, model_path=trained_model)
    assert predictions.shape == (1,)


def test_predict_dataframe_empty(trained_model):
    predictions = predict_dataframe(pd.DataFrame(), model_path=trained_model)
    assert predictions.size == 0


def test_predict_dataframe_rejects_bad_type(trained_model):
    with pytest.raises(TypeError):
        predict_dataframe(42, model_path=trained_model)


def test_save_predictions_without_target(tmp_path):
    destination = save_predictions([1.5, 2.5], tmp_path / "out.csv")
    frame = pd.read_csv(destination)
    assert list(frame.columns) == ["prediction"]
    assert frame["prediction"].tolist() == [1.5, 2.5]


def test_save_predictions_with_target(tmp_path):
    frame = pd.DataFrame({"MonthlyExpenses": [10, 20], "month": [1, 2]})
    destination = save_predictions(
        np.array([11.0, 19.0]),
        tmp_path / "out.csv",
        df=frame,
        target_col="MonthlyExpenses",
    )
    saved = pd.read_csv(destination)
    assert saved["prediction"].tolist() == [11.0, 19.0]
    assert saved["target"].tolist() == [10, 20]


def test_save_predictions_accepts_dataframe(tmp_path):
    destination = save_predictions(
        pd.DataFrame({"prediction": [1.0, 2.0]}), tmp_path / "out.csv"
    )
    assert pd.read_csv(destination)["prediction"].tolist() == [1.0, 2.0]


def test_save_predictions_rejects_length_mismatch(tmp_path):
    frame = pd.DataFrame({"MonthlyExpenses": [1, 2, 3]})
    with pytest.raises(ValueError):
        save_predictions([1.0], tmp_path / "out.csv", df=frame, target_col="MonthlyExpenses")


def test_save_predictions_rejects_bad_dataframe(tmp_path):
    with pytest.raises(ValueError):
        save_predictions(pd.DataFrame({"other": [1]}), tmp_path / "out.csv")


# ---------------------------------------------------------------------------
# Evaluation
# ---------------------------------------------------------------------------
def _labelled_csv(tmp_path, rows: int = 12) -> "pd.DataFrame":
    frame = pd.DataFrame(
        [
            {
                "month": month,
                "day_of_week": month % 7,
                "is_weekend": int(month % 7 >= 5),
                "category": "Food",
                "source": "sms",
                "MonthlyExpenses": 200 + month * 10,
            }
            for month in range(1, rows + 1)
        ]
    )
    path = tmp_path / "labelled.csv"
    frame.to_csv(path, index=False)
    return path


def test_evaluate_model_returns_metrics(tmp_path, trained_model):
    path = _labelled_csv(tmp_path)
    metrics = evaluate_model(path, model_path=trained_model)
    assert metrics["target"] == "MonthlyExpenses"
    assert metrics["rows"] == 12
    for key in ("rmse", "mae", "r2"):
        assert np.isfinite(metrics[key])


def test_evaluate_model_explicit_target(tmp_path, trained_model):
    path = _labelled_csv(tmp_path)
    metrics = evaluate_model(path, model_path=trained_model, target_col="MonthlyExpenses")
    assert metrics["rows"] == 12


def test_evaluate_model_missing_target(tmp_path, trained_model):
    path = tmp_path / "unlabelled.csv"
    pd.DataFrame({"month": [1, 2, 3]}).to_csv(path, index=False)
    with pytest.raises(ValueError):
        evaluate_model(path, model_path=trained_model)


def test_evaluate_model_missing_file(tmp_path, trained_model):
    with pytest.raises(FileNotFoundError):
        evaluate_model(tmp_path / "missing.csv", model_path=trained_model)


def test_regression_metrics_exact():
    metrics = regression_metrics([1, 2, 3], [1, 2, 3])
    assert metrics == {"rmse": 0.0, "mae": 0.0, "r2": 1.0}


def test_regression_metrics_validates_input():
    with pytest.raises(ValueError):
        regression_metrics([1, 2], [1])
    with pytest.raises(ValueError):
        regression_metrics([], [])
