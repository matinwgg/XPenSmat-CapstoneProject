"""Loading, cleaning, and feature engineering for the ML experiments."""

from __future__ import annotations

import argparse
from pathlib import Path

import pandas as pd
from sklearn.model_selection import train_test_split


def load_df(path: str | Path) -> pd.DataFrame:
    """Load a CSV or parquet dataset with a clear error if it is missing."""
    source = Path(path)
    if not source.exists():
        raise FileNotFoundError(f"dataset not found: {source}")
    if source.suffix.lower() == ".parquet":
        return pd.read_parquet(source)
    return pd.read_csv(source)


def load_raw(path: str | Path) -> pd.DataFrame:
    """Backward-compatible alias for :func:`load_df`."""
    return load_df(path)


def basic_clean(df: pd.DataFrame) -> pd.DataFrame:
    """Normalise dates/amounts and remove duplicate rows.

    The target column is deliberately not transformed here. In particular, no
    ``log(amount)`` feature is created, because that would leak the target.
    """
    cleaned = df.copy()
    if "date" in cleaned.columns:
        cleaned["date"] = pd.to_datetime(cleaned["date"], errors="coerce")
        cleaned = cleaned.dropna(subset=["date"])
    if "amount" in cleaned.columns:
        cleaned["amount"] = pd.to_numeric(cleaned["amount"], errors="coerce")
    return cleaned.drop_duplicates().reset_index(drop=True)


def feature_pipeline(
    df: pd.DataFrame,
    date_col: str = "date",
    target_col: str | None = None,
) -> pd.DataFrame:
    """Create date features and one-hot encode categorical columns.

    The target column is preserved so callers can split it off afterwards. It
    is never used to derive an input feature.
    """
    frame = df.copy()

    for column in ("id", "description", "raw_json"):
        if column in frame.columns:
            frame = frame.drop(columns=[column])

    if date_col in frame.columns:
        frame[date_col] = pd.to_datetime(frame[date_col], errors="coerce")
        frame = frame.dropna(subset=[date_col])
        frame["dow"] = frame[date_col].dt.day_of_week
        frame["month"] = frame[date_col].dt.month
        frame["is_weekend"] = (frame["dow"] >= 5).astype(int)

    categorical = frame.select_dtypes(
        exclude=["number", "datetime", "datetimetz", "bool"]
    ).columns.tolist()
    if target_col in categorical:
        categorical.remove(target_col)
    if categorical:
        frame = pd.get_dummies(frame, columns=categorical, drop_first=True)

    bool_columns = frame.select_dtypes(include=["bool"]).columns
    if len(bool_columns):
        frame[bool_columns] = frame[bool_columns].astype(int)

    return frame.reset_index(drop=True)


# Backward-compatible name used by older notebooks/scripts.
def feature_engineer(df: pd.DataFrame) -> pd.DataFrame:
    return feature_pipeline(df)


def prepare_xy(
    df: pd.DataFrame, target_col: str = "amount"
) -> tuple[pd.DataFrame, pd.Series]:
    if target_col not in df.columns:
        raise KeyError(f"Target column {target_col!r} not found")
    X = df.drop(columns=[target_col, "date", "id"], errors="ignore")
    y = df[target_col]
    return X, y


def train_test_split_df(X, y, test_size=0.2, random_state=42):
    return train_test_split(X, y, test_size=test_size, random_state=random_state)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Clean and featurize a dataset")
    parser.add_argument("--input", required=True, help="CSV or parquet input")
    parser.add_argument("--out", required=True, help="CSV or parquet output")
    parser.add_argument(
        "--target", default=None, help="Target column to preserve (optional)"
    )
    args = parser.parse_args()

    frame = feature_pipeline(
        basic_clean(load_df(args.input)), target_col=args.target
    )
    destination = Path(args.out)
    destination.parent.mkdir(parents=True, exist_ok=True)
    if destination.suffix.lower() == ".parquet":
        frame.to_parquet(destination, index=False)
    else:
        frame.to_csv(destination, index=False)
    print(f"Wrote {len(frame)} rows to {destination}")
