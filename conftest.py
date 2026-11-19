"""Repository-wide pytest configuration and shared fixtures."""

import sys
from pathlib import Path

import pytest

REPO_ROOT = Path(__file__).resolve().parent
if str(REPO_ROOT) not in sys.path:
    sys.path.insert(0, str(REPO_ROOT))


@pytest.fixture(scope="session")
def repo_root() -> Path:
    return REPO_ROOT


@pytest.fixture()
def db_client(tmp_path):
    from xpensmat.data.db import DBClient

    client = DBClient(tmp_path / "test.db")
    yield client
    client.close()


@pytest.fixture()
def sample_expenses() -> list[dict]:
    return [
        {
            "timestamp": "2025-01-05T10:00:00+00:00",
            "source": "sms",
            "raw_json": '{"text": "GHS 120 Food"}',
            "amount": 120.0,
            "category": "Food",
        },
        {
            "timestamp": "2025-02-11T12:30:00+00:00",
            "source": "bank",
            "raw_json": '{"description": "Transport"}',
            "amount": 45.5,
            "category": "Transport",
        },
    ]


@pytest.fixture()
def trained_model(tmp_path_factory):
    from xpensmat.predictor.train import train_model

    directory = tmp_path_factory.mktemp("trained-model")
    return train_model(out_path=directory / "xpensmat_model.joblib")


@pytest.fixture()
def prediction_csv(tmp_path_factory) -> Path:
    import pandas as pd

    path = tmp_path_factory.mktemp("prediction-input") / "input.csv"
    rows = [
        {
            "month": month,
            "day_of_week": month % 7,
            "is_weekend": int(month % 7 >= 5),
            "category": ["Food", "Transport", "Rent"][month % 3],
            "source": ["sms", "bank", "mobile"][month % 3],
        }
        for month in range(1, 13)
    ]
    pd.DataFrame(rows).to_csv(path, index=False)
    return path
