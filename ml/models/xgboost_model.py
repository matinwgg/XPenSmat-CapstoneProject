"""
XGBoost training and evaluation helpers.
"""

import xgboost as xgb
from sklearn.metrics import mean_squared_error, mean_absolute_error
import joblib
from pathlib import Path
import numpy as np

def train_xgb(X_train, y_train, X_val=None, y_val=None, params=None, num_boost_round=200, early_stopping_rounds=20):
    params = params or {
        "objective": "reg:squarederror",
        "eta": 0.05,
        "max_depth": 6,
        "subsample": 0.8,
        "colsample_bytree": 0.8,
        "seed": 42,
        "verbosity": 1
    }
    dtrain = xgb.DMatrix(X_train, label=y_train)
    evals = [(dtrain, "train")]
    watchlist = []
    if X_val is not None and y_val is not None:
        dval = xgb.DMatrix(X_val, label=y_val)
        evals.append((dval, "val"))
    model = xgb.train(params, dtrain, num_boost_round=num_boost_round, evals=evals, early_stopping_rounds=early_stopping_rounds, verbose_eval=20)
    return model

def predict_xgb(model, X):
    d = xgb.DMatrix(X)
    return model.predict(d)

def eval_xgb(model, X_test, y_test):
    preds = predict_xgb(model, X_test)
    rmse = mean_squared_error(y_test, preds, squared=False)
    mae = mean_absolute_error(y_test, preds)
    return {"rmse": rmse, "mae": mae}

def save_xgb(model, path: str):
    Path(path).parent.mkdir(parents=True, exist_ok=True)
    joblib.dump(model, path)

def load_xgb(path: str):
    return joblib.load(path)
