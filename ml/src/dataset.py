"""
Dataset utilities: load processed parquet files and create train/test splits.
"""

from pathlib import Path
import pandas as pd
from sklearn.model_selection import train_test_split
from typing import Tuple

def load_processed(path: str) -> pd.DataFrame:
    p = Path(path)
    if not p.exists():
        raise FileNotFoundError(path)
    return pd.read_parquet(p)

def make_splits(df: pd.DataFrame, target_col: str = "amount", test_size: float = 0.2, random_state: int = 42) -> Tuple[pd.DataFrame, pd.DataFrame, pd.Series, pd.Series]:
    if target_col not in df.columns:
        raise KeyError(f"Target column '{target_col}' not found in dataframe")
    X = df.drop(columns=[target_col])
    y = df[target_col]
    return train_test_split(X, y, test_size=test_size, random_state=random_state)
