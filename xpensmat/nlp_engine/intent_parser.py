# xpensmat/nlp_engine/intent_parser.py
"""
Tiny rule-based intent parser for demo purposes.
"""
def parse_intent(text: str) -> str:
    text = text.lower()
    if "balance" in text or "how much" in text:
        return "get_balance"
    if "predict" in text or "forecast" in text or "next month" in text:
        return "predict_expense"
    return "unknown"
