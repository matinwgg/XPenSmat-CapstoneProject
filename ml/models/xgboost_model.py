"""XGBoost training and evaluation helpers.

XGBoost is imported lazily so importing this module does not require the
optional ML extras (or a working OpenMP runtime) until training is requested.
"""

from __future__ import annotations

from pathlib import Path

import joblib
import numpy as np
from sklearn.metrics import mean_absolute_error, mean_squared_error


def _xgb():
    import xgboost

    return xgboost


def train_xgb(
    X_train,
    y_train,
    X_val=None,
    y_val=None,
    params: dict | None = None,
    num_boost_round: int = 200,
    early_stopping_rounds: int = 20,
):
    xgb = _xgb()
    params = params or {
        "objective": "reg:squarederror",
        "eta": 0.05,
        "max_depth": 6,
        "subsample": 0.8,
        "colsample_bytree": 0.8,
        "seed": 42,
        "verbosity": 1,
    }
    dtrain = xgb.DMatrix(X_train, label=y_train)
    evals = [(dtrain, "train")]
    kwargs: dict = {}
    if X_val is not None and y_val is not None:
        evals.append((xgb.DMatrix(X_val, label=y_val), "val"))
        kwargs["early_stopping_rounds"] = early_stopping_rounds
    return xgb.train(
        params,
        dtrain,
        num_boost_round=num_boost_round,
        evals=evals,
        verbose_eval=20,
        **kwargs,
    )


def predict_xgb(model, X):
    return model.predict(_xgb().DMatrix(X))


def eval_xgb(model, X_test, y_test) -> dict[str, float]:
    predictions = predict_xgb(model, X_test)
    return {
        "rmse": float(np.sqrt(mean_squared_error(y_test, predictions))),
        "mae": float(mean_absolute_error(y_test, predictions)),
    }


def save_xgb(model, path: str | Path) -> None:
    destination = Path(path)
    destination.parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(model, destination)


def load_xgb(path: str | Path):
    return joblib.load(path)
