# ml/src/preprocessing.py
"""Preprocessing helpers for the ML experiments."""

from typing import Tuple

import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split


def load_raw(path: str) -> pd.DataFrame:
    """Load a raw CSV dataset."""
    return pd.read_csv(path)


def load_df(path: str) -> pd.DataFrame:
    """Load a CSV or Parquet dataset based on its suffix."""
    lowered = str(path).lower()
    if lowered.endswith((".parquet", ".pq")):
        return pd.read_parquet(path)
    return pd.read_csv(path)


def basic_clean(df: pd.DataFrame) -> pd.DataFrame:
    """Normalise column names and remove unusable rows/columns."""
    cleaned = df.copy()
    cleaned.columns = [str(column).strip() for column in cleaned.columns]
    cleaned = cleaned.dropna(axis=1, how="all")
    cleaned = cleaned.drop_duplicates()

    for column in ("amount", "target", "MonthlyExpenses", "ItemAmount"):
        if column in cleaned.columns:
            cleaned[column] = pd.to_numeric(cleaned[column], errors="coerce")

    cleaned = cleaned.dropna(how="all")
    return cleaned.reset_index(drop=True)


def _is_text_column(series: pd.Series) -> bool:
    return (
        pd.api.types.is_object_dtype(series)
        or pd.api.types.is_string_dtype(series)
        or isinstance(series.dtype, pd.CategoricalDtype)
    )


def _datetime_features(df: pd.DataFrame) -> pd.DataFrame:
    out = df.copy()
    for column in list(out.columns):
        if not _is_text_column(out[column]):
            continue
        name = column.lower()
        if not any(token in name for token in ("date", "time")):
            continue
        parsed = pd.to_datetime(out[column], errors="coerce", utc=True)
        if parsed.notna().mean() < 0.5:
            continue
        out[f"{column}_dow"] = parsed.dt.dayofweek
        out[f"{column}_month"] = parsed.dt.month
        out[f"{column}_is_weekend"] = (parsed.dt.dayofweek >= 5).astype(int)
        out = out.drop(columns=[column])
    return out


def feature_pipeline(df: pd.DataFrame) -> pd.DataFrame:
    """Derive numeric features suitable for XGBoost/scikit-learn models.

    Categorical columns are label-encoded so a ``DMatrix`` can be built
    directly.  For production use, persist the encoder rather than relying on
    ``pd.factorize`` (documented limitation of this research script).
    """
    out = _datetime_features(df.copy())

    for column in out.columns:
        if pd.api.types.is_bool_dtype(out[column]):
            out[column] = out[column].astype(int)

    for column in list(out.columns):
        if _is_text_column(out[column]):
            codes, _ = pd.factorize(out[column].astype("string").fillna("<missing>"))
            out[column] = codes.astype(float)

    numeric = out.select_dtypes(include=[np.number]).columns
    for column in numeric:
        out[column] = out[column].fillna(out[column].median())

    return out


def feature_engineer(df: pd.DataFrame) -> pd.DataFrame:
    """Add date and log-amount features (legacy helper)."""
    out = df.copy()
    if "date" in out.columns:
        out["date"] = pd.to_datetime(out["date"], errors="coerce")
        out["dow"] = out["date"].dt.dayofweek
        out["month"] = out["date"].dt.month
        out["is_weekend"] = (out["dow"] >= 5).astype(int)
    if "amount" in out.columns:
        out["amount"] = pd.to_numeric(out["amount"], errors="coerce").fillna(0.0)
        out["log_amount"] = np.log1p(out["amount"])
    return out


def prepare_xy(df: pd.DataFrame, target_col: str = "amount") -> Tuple[pd.DataFrame, pd.Series]:
    """Split a feature frame and target series."""
    if target_col not in df.columns:
        raise KeyError(f"Target column '{target_col}' not found in dataframe")
    X = df.drop(columns=[target_col, "date", "id"], errors="ignore")
    y = df[target_col]
    return X, y


def train_test_split_df(X, y, test_size: float = 0.2, random_state: int = 42):
    """Thin wrapper around scikit-learn's splitter."""
    return train_test_split(X, y, test_size=test_size, random_state=random_state)
