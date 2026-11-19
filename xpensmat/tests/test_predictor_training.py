"""Model persistence and training tests."""

from pathlib import Path

import pandas as pd
import pytest
from sklearn.dummy import DummyRegressor

from xpensmat.predictor import model_store
from xpensmat.predictor.model_store import (
    ModelNotFoundError,
    default_model_path,
    load_metadata,
    load_model,
    model_exists,
    save_model,
)
from xpensmat.predictor.train import train_model


# ---------------------------------------------------------------------------
# model_store
# ---------------------------------------------------------------------------
def test_save_and_load_model(tmp_path):
    path = tmp_path / "model.joblib"
    model = DummyRegressor(strategy="mean").fit([[1], [2]], [10, 20])
    saved = save_model(model, path, metadata={"target_col": "amount"})
    assert saved == path
    assert path.exists()
    assert model_exists(path)

    loaded = load_model(path)
    assert loaded.predict([[5]])[0] == 15.0
    assert load_metadata(path)["target_col"] == "amount"


def test_load_missing_model_raises(tmp_path):
    with pytest.raises(ModelNotFoundError):
        load_model(tmp_path / "absent.joblib")


def test_metadata_missing_returns_empty(tmp_path):
    path = tmp_path / "model.joblib"
    save_model(DummyRegressor(), path)
    assert load_metadata(path) == {}


def test_metadata_corrupt_returns_empty(tmp_path):
    path = tmp_path / "model.joblib"
    save_model(DummyRegressor(), path)
    path.with_suffix(path.suffix + ".meta.json").write_text("{not json", encoding="utf-8")
    assert load_metadata(path) == {}


def test_default_model_path_honours_environment(tmp_path, monkeypatch):
    monkeypatch.setenv("XPENSMAT_MODEL_DIR", str(tmp_path))
    assert default_model_path() == tmp_path / model_store.MODEL_FILENAME
    monkeypatch.delenv("XPENSMAT_MODEL_DIR", raising=False)
    assert default_model_path().name == model_store.MODEL_FILENAME


# ---------------------------------------------------------------------------
# training
# ---------------------------------------------------------------------------
def test_train_default_synthetic_dataset(trained_model):
    assert isinstance(trained_model, Path)
    assert trained_model.exists()
    metadata = load_metadata(trained_model)
    assert metadata["target_col"] == "MonthlyExpenses"
    assert metadata["rows"] == 240
    assert metadata["trained_at"]
    assert set(metadata["metrics"]) == {"rmse", "mae", "r2"}
    assert metadata["metrics"]["rmse"] >= 0
    assert metadata["feature_columns"]


def test_train_from_csv_infers_target(tmp_path):
    frame = pd.DataFrame(
        {
            "month": list(range(1, 21)),
            "amount": [100 + index * 3 for index in range(20)],
            "category": ["Food", "Transport"] * 10,
        }
    )
    csv_path = tmp_path / "data.csv"
    frame.to_csv(csv_path, index=False)
    model_path = train_model(data_path=csv_path, out_path=tmp_path / "model.joblib")
    metadata = load_metadata(model_path)
    assert metadata["target_col"] == "amount"
    assert metadata["source"] == str(csv_path)
    assert "category" in metadata["categorical_features"]


def test_train_explicit_target(tmp_path):
    frame = pd.DataFrame(
        {
            "month": list(range(1, 11)),
            "MonthlyExpenses": [200 + index for index in range(10)],
        }
    )
    csv_path = tmp_path / "data.csv"
    frame.to_csv(csv_path, index=False)
    model_path = train_model(
        data_path=csv_path, target_col="MonthlyExpenses", out_path=tmp_path / "m.joblib"
    )
    assert load_metadata(model_path)["target_col"] == "MonthlyExpenses"


def test_train_explicit_missing_target(tmp_path):
    csv_path = tmp_path / "data.csv"
    pd.DataFrame({"month": [1, 2, 3, 4, 5], "value": [1, 2, 3, 4, 5]}).to_csv(
        csv_path, index=False
    )
    with pytest.raises(ValueError):
        train_model(data_path=csv_path, target_col="nope", out_path=tmp_path / "m.joblib")


def test_train_missing_file(tmp_path):
    with pytest.raises(FileNotFoundError):
        train_model(data_path=tmp_path / "nope.csv", out_path=tmp_path / "m.joblib")


def test_train_requires_enough_rows(tmp_path):
    csv_path = tmp_path / "tiny.csv"
    pd.DataFrame({"feature": [1, 2, 3], "amount": [1, 2, 3]}).to_csv(csv_path, index=False)
    with pytest.raises(ValueError, match="At least 5"):
        train_model(data_path=csv_path, out_path=tmp_path / "m.joblib")


def test_train_requires_features(tmp_path):
    csv_path = tmp_path / "target-only.csv"
    pd.DataFrame({"amount": list(range(10))}).to_csv(csv_path, index=False)
    with pytest.raises(ValueError, match="feature"):
        train_model(data_path=csv_path, out_path=tmp_path / "m.joblib")


def test_train_uses_local_database(tmp_path, db_client, monkeypatch):
    for index in range(25):
        db_client.insert_transaction(
            timestamp=f"2025-01-{(index % 28) + 1:02d}T00:00:00Z",
            source=["sms", "bank", "mobile"][index % 3],
            raw_json="{}",
            amount=50 + index,
            category=["Food", "Transport", "Rent"][index % 3],
        )
    monkeypatch.setattr("xpensmat.data.db.db", db_client)

    model_path = train_model(out_path=tmp_path / "db-model.joblib")
    metadata = load_metadata(model_path)
    assert metadata["rows"] == 25
    assert metadata["target_col"] == "MonthlyExpenses"
    assert metadata["source"] == "synthetic-or-local-db"


def test_train_parquet_input(tmp_path):
    try:
        pd.DataFrame({"a": [1]}).to_parquet(tmp_path / "_probe.parquet")
    except Exception as exc:  # pragma: no cover - environment dependent
        pytest.skip(f"parquet engine unavailable: {exc}")
    frame = pd.DataFrame(
        {
            "month": list(range(1, 16)),
            "amount": [100 + index for index in range(15)],
        }
    )
    path = tmp_path / "data.parquet"
    frame.to_parquet(path)
    model_path = train_model(data_path=path, out_path=tmp_path / "model.joblib")
    assert model_path.exists()
