"""Serving / orchestration-facing prediction tests."""

import math

from xpensmat.predictor import serve


def test_record_from_tuple():
    record, amount = serve._record_from_transaction(
        (1, "2025-06-14T12:00:00Z", "sms", '{"category": "Food"}', 42.5, None)
    )
    assert amount == 42.5
    assert record["category"] == "Food"
    assert record["source"] == "sms"
    assert record["month"] == 6
    assert record["day_of_week"] == 5
    assert record["is_weekend"] == 1
    assert record["timestamp_month"] == 6


def test_record_from_dict_with_invalid_json_and_amount():
    record, amount = serve._record_from_transaction(
        {"timestamp": None, "raw_json": "{bad", "amount": "not-a-number"}
    )
    assert amount is None
    assert record["source"] is None
    assert "month" not in record


def test_record_from_invalid_type():
    import pytest

    with pytest.raises(TypeError):
        serve._record_from_transaction(42)


def test_predict_for_txn_without_model_falls_back_to_amount():
    prediction = serve.predict_for_txn(
        (1, "2025-01-01T00:00:00Z", "sms", "{}", 123.456, "Food"),
        model_path="definitely/missing/model.joblib",
    )
    assert prediction == 123.46


def test_predict_for_txn_without_amount_returns_zero():
    prediction = serve.predict_for_txn(
        (1, "2025-01-01T00:00:00Z", "sms", "{}", None, None),
        model_path="definitely/missing/model.joblib",
    )
    assert prediction == 0.0


def test_predict_for_txn_uses_model(trained_model):
    prediction = serve.predict_for_txn(
        {
            "timestamp": "2025-06-14T12:00:00Z",
            "source": "sms",
            "category": "Food",
            "amount": 100.0,
            "raw_json": "{}",
        },
        model_path=trained_model,
    )
    assert isinstance(prediction, float)
    assert math.isfinite(prediction)


def test_run_periodic_predict_skips_without_model(db_client, monkeypatch):
    monkeypatch.setattr(serve, "model_exists", lambda path=None: False)
    db_client.insert_transaction("2025-01-01", "sms", "{}", amount=10)
    assert serve.run_periodic_predict(db_client=db_client) == []
    assert db_client.list_predictions() == []


def test_run_periodic_predict_inserts_and_deduplicates(db_client, monkeypatch):
    first = db_client.insert_transaction("2025-01-01", "sms", "{}", amount=10)
    second = db_client.insert_transaction("2025-01-02", "bank", "{}", amount=20)

    monkeypatch.setattr(serve, "model_exists", lambda path=None: True)
    monkeypatch.setattr(serve, "predict_for_txn", lambda txn, model_path=None: 55.5)

    results = serve.run_periodic_predict(db_client=db_client)
    assert {txn_id for txn_id, _ in results} == {first, second}
    assert len(db_client.list_predictions()) == 2

    # A second tick must not create duplicate predictions.
    assert serve.run_periodic_predict(db_client=db_client) == []
    assert len(db_client.list_predictions()) == 2
