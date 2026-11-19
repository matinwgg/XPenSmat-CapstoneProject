"""Pydantic schema tests."""

import pytest
from pydantic import ValidationError

from xpensmat.data.schemas import Prediction, Transaction


def test_transaction_defaults_optional_fields():
    txn = Transaction(timestamp="2025-01-01", source="sms", raw_json="{}")
    assert txn.id is None
    assert txn.amount is None
    assert txn.category is None


def test_transaction_accepts_full_payload():
    txn = Transaction(
        id=1,
        timestamp="2025-01-01",
        source="bank",
        raw_json='{"x": 1}',
        amount=12.5,
        category="Food",
    )
    assert txn.amount == 12.5
    assert txn.model_dump()["category"] == "Food"


def test_transaction_requires_core_fields():
    with pytest.raises(ValidationError):
        Transaction(timestamp="2025-01-01", source="sms")


def test_prediction_schema():
    prediction = Prediction(txn_id=1, predicted_amount=10.0, model_name="m")
    assert prediction.id is None
    with pytest.raises(ValidationError):
        Prediction(txn_id=1, model_name="m")
