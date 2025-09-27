# xpensmat/nlp_engine/voice_interface.py
"""
Voice interface placeholder.

For local testing we don't include heavy STT/TTS libs; in production, use
speech-to-text providers or open-source models.
"""
from xpensmat.core.logger import logger

def text_from_audio(file_path: str) -> str:
    logger.debug("Pretend transcribe audio at %s", file_path)
    return "transcribed text (demo)"

def audio_from_text(text: str, out_path: str) -> None:
    logger.debug("Pretend TTS for text '%s' -> %s", text, out_path)
    with open(out_path, "wb") as f:
        f.write(b"")  # placeholder
