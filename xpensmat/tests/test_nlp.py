"""NLP and voice-interface tests."""

import pytest

import xpensmat.nlp_engine as nlp_engine
from xpensmat.nlp_engine import ChatBot, parse_intent
from xpensmat.nlp_engine.voice_interface import audio_from_text, text_from_audio


def test_nlp_exports():
    assert hasattr(nlp_engine, "ChatBot")
    assert hasattr(nlp_engine, "parse_intent")


@pytest.mark.parametrize(
    ("text", "intent"),
    [
        ("Please predict my expenses next month", "predict_expense"),
        ("forecast my spending", "predict_expense"),
        ("What's my balance?", "get_balance"),
        ("how much did I spend", "get_balance"),
        ("hello there", "unknown"),
        ("", "unknown"),
    ],
)
def test_parse_intent(text, intent):
    assert parse_intent(text) == intent


def test_parse_intent_is_case_insensitive():
    assert parse_intent("WHAT IS MY BALANCE") == "get_balance"
    assert parse_intent("PREDICT NEXT MONTH") == "predict_expense"


@pytest.mark.parametrize(
    ("text", "expected_fragment"),
    [
        ("balance please", "balance"),
        ("predict next month", "prediction"),
        ("unrelated", "Sorry"),
    ],
)
def test_chatbot_replies(text, expected_fragment):
    bot = ChatBot()
    reply = bot.handle_text(text)
    assert expected_fragment.lower() in reply.lower()
    assert isinstance(reply, str)


def test_chatbot_keeps_history_attribute():
    bot = ChatBot()
    assert bot.history == []
    bot.handle_text("hello")
    assert bot.history == []


def test_text_from_audio_placeholder():
    assert isinstance(text_from_audio("audio.wav"), str)
    assert text_from_audio("audio.wav")


def test_audio_from_text_writes_file(tmp_path):
    destination = tmp_path / "speech.wav"
    audio_from_text("hello", str(destination))
    assert destination.exists()
    assert destination.read_bytes() == b""
