# xpensmat/nlp_engine/chatbot.py
"""
Minimal chatbot wrapper that uses a simple intent parser.
Replace with a real NLP model (Rasa, HuggingFace, or cloud NLP).
"""
from .intent_parser import parse_intent
from xpensmat.core.logger import logger

class ChatBot:
    def __init__(self):
        self.history = []

    def handle_text(self, user_text: str) -> str:
        intent = parse_intent(user_text)
        logger.debug("Detected intent: %s", intent)
        if intent == "get_balance":
            return "I can't fetch your balance yet — integration coming soon."
        elif intent == "predict_expense":
            return "I will run a prediction for next month — please confirm."
        else:
            return "Sorry, I didn't understand. Try asking about your expenses."
