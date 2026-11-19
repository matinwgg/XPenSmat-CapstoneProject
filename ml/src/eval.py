"""Evaluation utilities for trained models."""

import numpy as np
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score


def regression_metrics(y_true, y_pred):
    """Return RMSE/MAE/R².

    ``squared=False`` was removed from scikit-learn in 1.6, so RMSE is
    computed from the mean squared error explicitly.
    """
    y_true = np.asarray(y_true, dtype=float)
    y_pred = np.asarray(y_pred, dtype=float).reshape(-1)
    if y_true.shape[0] != y_pred.shape[0]:
        raise ValueError("y_true and y_pred must have the same length")
    if y_true.shape[0] == 0:
        raise ValueError("Cannot evaluate an empty set of predictions")

    mse = mean_squared_error(y_true, y_pred)
    return {
        "rmse": float(np.sqrt(mse)),
        "mae": float(mean_absolute_error(y_true, y_pred)),
        "r2": float(r2_score(y_true, y_pred)) if y_true.shape[0] > 1 else 0.0,
    }
