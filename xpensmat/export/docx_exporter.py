# xpensmat/export/docx_exporter.py
"""
DOCX exporter: uses python-docx if available, otherwise fallback.
"""
from pathlib import Path

from xpensmat.core.logger import logger

try:  # pragma: no cover - import availability depends on the environment
    import docx

    DOCX_OK = True
except Exception:  # pragma: no cover
    DOCX_OK = False


def export_docx(report_text: str, out_path: str) -> Path:
    """Write ``report_text`` to ``out_path`` as DOCX (or plain text fallback)."""
    path = Path(out_path)
    path.parent.mkdir(parents=True, exist_ok=True)

    if DOCX_OK:
        try:
            document = docx.Document()
            for line in str(report_text).splitlines() or [""]:
                document.add_paragraph(line)
            document.save(str(path))
            logger.info("Wrote DOCX to %s", path)
            return path
        except Exception as exc:  # pragma: no cover - defensive
            logger.warning("DOCX rendering failed (%s); writing text fallback", exc)

    with open(path, "w", encoding="utf-8") as handle:
        handle.write(str(report_text))
    logger.info("python-docx unavailable; wrote plain text to %s", path)
    return path
