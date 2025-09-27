# xpensmat/tests/test_nlp_engine.py
from xpensmat.nlp_engine.intent_parser import parse_intent

def test_parse_intent():
    assert parse_intent("Please predict my expenses next month") == "predict_expense"
    assert parse_intent("What's my balance?") == "get_balance"
