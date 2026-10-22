import pandas as pd

from ml.src.dataset import make_splits
from ml.src.preprocessing import basic_clean, feature_pipeline, load_df


def _frame():
    return pd.DataFrame(
        {
            "date": pd.date_range("2025-01-01", periods=10, freq="D"),
            "amount": list(range(10)),
            "category": ["food", "travel"] * 5,
        }
    )


def test_feature_pipeline_does_not_leak_target(tmp_path):
    path = tmp_path / "data.csv"
    _frame().to_csv(path, index=False)

    result = feature_pipeline(
        basic_clean(load_df(path)), target_col="amount"
    )

    assert "amount" in result.columns
    assert "log_amount" not in result.columns
    assert "dow" in result.columns
    assert "month" in result.columns
    assert "category_travel" in result.columns


def test_time_split_keeps_future_rows_in_test():
    frame = feature_pipeline(basic_clean(_frame()), target_col="amount")

    X_train, X_test, y_train, y_test = make_splits(
        frame, target_col="amount", test_size=0.2
    )

    assert len(X_train) == 8
    assert len(X_test) == 2
    assert y_test.tolist() == [8.0, 9.0]
    assert "date" not in X_test.columns
