"""
Simple baseline models: mean predictor and linear regression baseline.
"""

import numpy as np
from sklearn.dummy import DummyRegressor
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error


def train_baseline(X_train, y_train, strategy="mean"):
    if strategy == "mean":
        model = DummyRegressor(strategy="mean")
    else:
        model = LinearRegression()
    model.fit(X_train, y_train)
    return model


def predict_baseline(model, X):
    return model.predict(X)


def eval_baseline(model, X_test, y_test):
    preds = predict_baseline(model, X_test)
    rmse = float(np.sqrt(mean_squared_error(y_test, preds)))
    mae = float(mean_absolute_error(y_test, preds))
    return {"rmse": rmse, "mae": mae}
