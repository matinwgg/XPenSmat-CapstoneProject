"""
XGBoost training and evaluation helpers.
"""

from pathlib import Path

import joblib
import numpy as np
import xgboost as xgb
from sklearn.metrics import mean_absolute_error, mean_squared_error


def train_xgb(
    X_train,
    y_train,
    X_val=None,
    y_val=None,
    params=None,
    num_boost_round=200,
    early_stopping_rounds=20,
):
    params = params or {
        "objective": "reg:squarederror",
        "eta": 0.05,
        "max_depth": 6,
        "subsample": 0.8,
        "colsample_bytree": 0.8,
        "seed": 42,
        "verbosity": 0,
    }
    dtrain = xgb.DMatrix(X_train, label=y_train)
    evals = [(dtrain, "train")]
    keyword_args = {}
    if X_val is not None and y_val is not None:
        dval = xgb.DMatrix(X_val, label=y_val)
        evals.append((dval, "val"))
        # Early stopping requires a validation set.
        keyword_args["early_stopping_rounds"] = early_stopping_rounds

    return xgb.train(
        params,
        dtrain,
        num_boost_round=num_boost_round,
        evals=evals,
        verbose_eval=False,
        **keyword_args,
    )


def predict_xgb(model, X):
    return model.predict(xgb.DMatrix(X))


def eval_xgb(model, X_test, y_test):
    preds = predict_xgb(model, X_test)
    rmse = float(np.sqrt(mean_squared_error(y_test, preds)))
    mae = float(mean_absolute_error(y_test, preds))
    return {"rmse": rmse, "mae": mae}


def save_xgb(model, path: str):
    Path(path).parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(model, path)
    return Path(path)


def load_xgb(path: str):
    return joblib.load(path)
