"""Tests for the standalone ML research package (`ml/`)."""

import numpy as np
import pandas as pd
import pytest

from ml.models import baseline
from ml.models import tf_priv_model
from ml.models.xgboost_model import eval_xgb, load_xgb, predict_xgb, save_xgb, train_xgb
from ml.src import eval as ml_eval
from ml.src.dataset import load_processed, make_splits
from ml.src.predict import predict_from_csv
from ml.src.preprocessing import (
    basic_clean,
    feature_engineer,
    feature_pipeline,
    load_df,
    load_raw,
    prepare_xy,
    train_test_split_df,
)
from ml.src.train import build_parser, main


@pytest.fixture()
def raw_frame() -> pd.DataFrame:
    return pd.DataFrame(
        {
            "date": [f"2025-01-{(index % 28) + 1:02d}" for index in range(30)],
            "amount": [100 + index * 5 for index in range(30)],
            "category": ["Food", "Transport", "Rent"] * 10,
        }
    )


def _write_csv(frame: pd.DataFrame, tmp_path) -> str:
    path = tmp_path / "data.csv"
    frame.to_csv(path, index=False)
    return str(path)


def _require_parquet(tmp_path) -> None:
    """Skip when no working parquet engine is available (e.g. blocked DLL)."""
    try:
        pd.DataFrame({"a": [1]}).to_parquet(tmp_path / "_probe.parquet")
    except Exception as exc:  # pragma: no cover - environment dependent
        pytest.skip(f"parquet engine unavailable: {exc}")


# ---------------------------------------------------------------------------
# Preprocessing
# ---------------------------------------------------------------------------
def test_load_raw_and_load_df(raw_frame, tmp_path):
    csv_path = _write_csv(raw_frame, tmp_path)
    assert len(load_raw(csv_path)) == len(raw_frame)
    assert len(load_df(csv_path)) == len(raw_frame)


def test_load_df_parquet(raw_frame, tmp_path):
    _require_parquet(tmp_path)
    path = tmp_path / "data.parquet"
    raw_frame.to_parquet(path)
    assert len(load_df(str(path))) == len(raw_frame)


def test_basic_clean(raw_frame):
    dirty = pd.concat([raw_frame, raw_frame.iloc[[0]]], ignore_index=True)
    dirty.columns = [f" {column} " for column in dirty.columns]
    dirty["empty"] = np.nan
    cleaned = basic_clean(dirty)
    assert "amount" in cleaned.columns
    assert "empty" not in cleaned.columns
    assert len(cleaned) == len(raw_frame)  # duplicate removed
    assert pd.api.types.is_numeric_dtype(cleaned["amount"])


def test_feature_pipeline(raw_frame):
    processed = feature_pipeline(raw_frame)
    assert "date" not in processed.columns
    assert {"date_dow", "date_month", "date_is_weekend"} <= set(processed.columns)
    assert "category" in processed.columns
    assert pd.api.types.is_numeric_dtype(processed["category"])
    assert processed.isna().sum().sum() == 0


def test_feature_engineer(raw_frame):
    engineered = feature_engineer(raw_frame)
    assert {"dow", "month", "is_weekend", "log_amount"} <= set(engineered.columns)
    assert np.allclose(engineered["log_amount"], np.log1p(engineered["amount"]))


def test_prepare_xy(raw_frame):
    X, y = prepare_xy(feature_pipeline(raw_frame))
    assert "amount" not in X.columns
    assert y.name == "amount"
    assert len(X) == len(y)


def test_prepare_xy_missing_target(raw_frame):
    with pytest.raises(KeyError):
        prepare_xy(raw_frame, target_col="nope")


def test_train_test_split_df(raw_frame):
    X, y = prepare_xy(feature_pipeline(raw_frame))
    X_train, X_test, y_train, y_test = train_test_split_df(X, y, test_size=0.25)
    assert len(X_test) == len(y_test) == 8
    assert len(X_train) + len(X_test) == len(X)


# ---------------------------------------------------------------------------
# Dataset utilities
# ---------------------------------------------------------------------------
def test_load_processed_and_make_splits(raw_frame, tmp_path):
    _require_parquet(tmp_path)
    processed = feature_pipeline(raw_frame)
    path = tmp_path / "processed.parquet"
    processed.to_parquet(path)
    loaded = load_processed(str(path))
    X_train, X_test, y_train, y_test = make_splits(loaded, target_col="amount")
    assert len(X_train) + len(X_test) == len(loaded)
    assert len(y_train) == len(X_train)


def test_load_processed_missing(tmp_path):
    with pytest.raises(FileNotFoundError):
        load_processed(str(tmp_path / "missing.parquet"))


def test_make_splits_missing_target(raw_frame):
    with pytest.raises(KeyError):
        make_splits(raw_frame, target_col="nope")


# ---------------------------------------------------------------------------
# Metrics and baselines
# ---------------------------------------------------------------------------
def test_regression_metrics():
    metrics = ml_eval.regression_metrics([1, 2, 3], [1, 2, 4])
    assert metrics["rmse"] == pytest.approx(np.sqrt(1 / 3))
    assert metrics["mae"] == pytest.approx(1 / 3)
    assert metrics["r2"] == pytest.approx(0.5)


def test_regression_metrics_validation():
    with pytest.raises(ValueError):
        ml_eval.regression_metrics([1, 2], [1])
    with pytest.raises(ValueError):
        ml_eval.regression_metrics([], [])


def test_baseline_mean(raw_frame):
    processed = feature_pipeline(raw_frame)
    X_train, X_test, y_train, y_test = make_splits(processed, target_col="amount")
    model = baseline.train_baseline(X_train, y_train, strategy="mean")
    predictions = baseline.predict_baseline(model, X_test)
    assert len(predictions) == len(X_test)
    metrics = baseline.eval_baseline(model, X_test, y_test)
    assert set(metrics) == {"rmse", "mae"}
    assert metrics["rmse"] >= 0


def test_baseline_linear(raw_frame):
    processed = feature_pipeline(raw_frame)
    X_train, X_test, y_train, y_test = make_splits(processed, target_col="amount")
    model = baseline.train_baseline(X_train, y_train, strategy="linear")
    assert baseline.eval_baseline(model, X_test, y_test)["mae"] >= 0


# ---------------------------------------------------------------------------
# XGBoost helpers
# ---------------------------------------------------------------------------
def test_xgboost_train_predict_evaluate(raw_frame, tmp_path):
    processed = feature_pipeline(raw_frame)
    X_train, X_test, y_train, y_test = make_splits(processed, target_col="amount")

    model = train_xgb(
        X_train,
        y_train,
        X_val=X_test,
        y_val=y_test,
        num_boost_round=3,
        early_stopping_rounds=2,
    )
    predictions = predict_xgb(model, X_test)
    assert len(predictions) == len(X_test)
    metrics = eval_xgb(model, X_test, y_test)
    assert {"rmse", "mae"} == set(metrics)

    path = tmp_path / "xgb.joblib"
    save_xgb(model, str(path))
    assert path.exists()
    assert len(predict_xgb(load_xgb(str(path)), X_test)) == len(X_test)


def test_xgboost_without_validation_set(raw_frame):
    processed = feature_pipeline(raw_frame)
    X_train, _, y_train, _ = make_splits(processed, target_col="amount")
    # Early stopping must be omitted when no validation set is supplied.
    model = train_xgb(X_train, y_train, num_boost_round=2)
    assert len(model.predict(__import__("xgboost").DMatrix(X_train))) == len(X_train)


# ---------------------------------------------------------------------------
# TensorFlow-Privacy guard
# ---------------------------------------------------------------------------
def test_tf_priv_guard():
    assert isinstance(tf_priv_model.TENSORFLOW_OK, bool)
    if not tf_priv_model.TENSORFLOW_OK:
        with pytest.raises(RuntimeError):
            tf_priv_model.ensure_tf()
    else:  # pragma: no cover - tensorflow is an optional heavy dependency
        assert tf_priv_model.build_dp_model(3) is not None


# ---------------------------------------------------------------------------
# Training CLI
# ---------------------------------------------------------------------------
def test_train_cli_end_to_end(raw_frame, tmp_path):
    csv_path = _write_csv(raw_frame, tmp_path)
    model_path = tmp_path / "cli-model.joblib"
    args = build_parser().parse_args(
        ["--data", csv_path, "--out", str(model_path), "--num-rounds", "2"]
    )
    result = main(args)
    assert result == model_path
    assert model_path.exists()


def test_predict_from_csv(raw_frame, tmp_path):
    csv_path = _write_csv(raw_frame, tmp_path)
    model_path = tmp_path / "model.joblib"
    args = build_parser().parse_args(
        ["--data", csv_path, "--out", str(model_path), "--num-rounds", "2"]
    )
    main(args)

    input_path = tmp_path / "input.csv"
    feature_pipeline(raw_frame).drop(columns=["amount"]).to_csv(input_path, index=False)
    output_path = tmp_path / "predictions.csv"
    predictions = predict_from_csv(str(model_path), str(input_path), str(output_path))
    assert len(predictions) == len(raw_frame)
    saved = pd.read_csv(output_path)
    assert list(saved.columns) == ["prediction"]
