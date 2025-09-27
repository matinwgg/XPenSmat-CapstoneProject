# # ml/src/preprocessing.py
# import pandas as pd
# import numpy as np
# from sklearn.model_selection import train_test_split
# from typing import Tuple

# def load_raw(path: str) -> pd.DataFrame:
#     """Load raw expense dataset (CSV assumed)."""
#     return pd.read_csv(path)

# def feature_engineer(df: pd.DataFrame) -> pd.DataFrame:
#     """Feature engineering for expense prediction."""
#     df = df.copy()
#     # Example transforms - adapt to your schema
#     df['date'] = pd.to_datetime(df['date'])
#     df['dow'] = df['date'].dt.dayofweek
#     df['month'] = df['date'].dt.month
#     df['is_weekend'] = (df['dow'] >= 5).astype(int)
#     # Fill / impute
#     df['amount'] = df['amount'].fillna(0.0)
#     # log-transform skewed amounts
#     df['log_amount'] = np.log1p(df['amount'])
#     return df

# def prepare_xy(df: pd.DataFrame, target_col='amount') -> Tuple[pd.DataFrame, pd.Series]:
#     X = df.drop(columns=[target_col, 'date', 'id'], errors='ignore')
#     y = df[target_col]
#     return X, y

# def train_test_split_df(X, y, test_size=0.2, random_state=42):
#     return train_test_split(X, y, test_size=test_size, random_state=random_state)
# ml/src/preprocessing.py
import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from typing import Tuple

def load_raw(path: str) -> pd.DataFrame:
    """Load raw expense dataset (CSV assumed)."""
    return pd.read_csv(path)

def feature_engineer(df: pd.DataFrame) -> pd.DataFrame:
    """Feature engineering for expense prediction."""
    df = df.copy()
    # Example transforms - adapt to your schema
    df['date'] = pd.to_datetime(df['date'])
    df['dow'] = df['date'].dt.dayofweek
    df['month'] = df['date'].dt.month
    df['is_weekend'] = (df['dow'] >= 5).astype(int)
    # Fill / impute
    df['amount'] = df['amount'].fillna(0.0)
    # log-transform skewed amounts
    df['log_amount'] = np.log1p(df['amount'])
    return df

def prepare_xy(df: pd.DataFrame, target_col='amount') -> Tuple[pd.DataFrame, pd.Series]:
    X = df.drop(columns=[target_col, 'date', 'id'], errors='ignore')
    y = df[target_col]
    return X, y

def train_test_split_df(X, y, test_size=0.2, random_state=42):
    return train_test_split(X, y, test_size=test_size, random_state=random_state)
