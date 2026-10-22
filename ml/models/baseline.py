"""Simple baseline models: mean predictor and linear regression baseline."""

from __future__ import annotations

import numpy as np
from sklearn.dummy import DummyRegressor
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error


def train_baseline(X_train, y_train, strategy: str = "mean"):
    model = DummyRegressor(strategy="mean") if strategy == "mean" else LinearRegression()
    model.fit(X_train, y_train)
    return model


def predict_baseline(model, X):
    return model.predict(X)


def eval_baseline(model, X_test, y_test) -> dict[str, float]:
    predictions = predict_baseline(model, X_test)
    return {
        "rmse": float(np.sqrt(mean_squared_error(y_test, predictions))),
        "mae": float(mean_absolute_error(y_test, predictions)),
    }
