"""
Simple baseline models: mean predictor and linear regression baseline.
"""

from sklearn.dummy import DummyRegressor
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, mean_absolute_error
import numpy as np

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
    rmse = mean_squared_error(y_test, preds, squared=False)
    mae = mean_absolute_error(y_test, preds)
    return {"rmse": rmse, "mae": mae}
      