"""Dataset splitting utilities.

Expense data is time-ordered. A random split lets the model learn from future
rows, so the default is a chronological split. A random split remains available
explicitly for non-temporal datasets.
"""

from __future__ import annotations

from pathlib import Path

import pandas as pd
from sklearn.model_selection import train_test_split


def load_processed(path: str | Path) -> pd.DataFrame:
    source = Path(path)
    if not source.exists():
        raise FileNotFoundError(source)
    return pd.read_parquet(source)


def make_splits(
    df: pd.DataFrame,
    target_col: str = "amount",
    test_size: float = 0.2,
    date_col: str = "date",
    random_state: int = 42,
) -> tuple[pd.DataFrame, pd.DataFrame, pd.Series, pd.Series]:
    """Return train/test splits, ordered by time when a date column exists."""
    if target_col not in df.columns:
        raise KeyError(f"Target column {target_col!r} not found in dataframe")
    if not 0 < test_size < 1:
        raise ValueError("test_size must be between 0 and 1")
    df = df.dropna(subset=[target_col])

    if date_col in df.columns:
        ordered = df.sort_values(date_col, kind="mergesort").reset_index(drop=True)
        if len(ordered) < 2:
            raise ValueError("at least two rows are required for a split")
        boundary = int(round(len(ordered) * (1 - test_size)))
        boundary = max(1, min(boundary, len(ordered) - 1))
        train = ordered.iloc[:boundary]
        test = ordered.iloc[boundary:]
        drop = [target_col, date_col]
        return (
            train.drop(columns=drop, errors="ignore"),
            test.drop(columns=drop, errors="ignore"),
            train[target_col],
            test[target_col],
        )

    X = df.drop(columns=[target_col])
    y = df[target_col]
    return train_test_split(
        X, y, test_size=test_size, random_state=random_state
    )
