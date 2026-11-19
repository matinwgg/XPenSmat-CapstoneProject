# xpensmat/export/pdf_exporter.py
"""
Simple PDF exporter using reportlab if installed; else produce a plain text fallback.
"""
from pathlib import Path

from xpensmat.core.logger import logger

try:  # pragma: no cover - import availability depends on the environment
    from reportlab.lib.pagesizes import letter
    from reportlab.pdfgen import canvas

    REPORTLAB_OK = True
except Exception:  # pragma: no cover
    REPORTLAB_OK = False


def _latin1(value: str) -> str:
    """Reportlab's built-in fonts cannot render every Unicode character."""
    return value.encode("latin-1", errors="replace").decode("latin-1")


def _write_text_fallback(text: str, path: Path) -> None:
    with open(path, "w", encoding="utf-8") as handle:
        handle.write(text)


def export_pdf(report_text: str, out_path: str) -> Path:
    """Write ``report_text`` to ``out_path`` as a PDF.

    Returns the path written.  When reportlab is unavailable (or cannot encode
    the content) a UTF-8 text file with a ``.pdf`` extension is produced so the
    report is never lost.
    """
    path = Path(out_path)
    path.parent.mkdir(parents=True, exist_ok=True)

    if REPORTLAB_OK:
        try:
            document = canvas.Canvas(str(path), pagesize=letter)
            document.setFont("Helvetica", 10)
            y = 760
            for raw_line in str(report_text).splitlines() or [""]:
                if y < 40:
                    document.showPage()
                    document.setFont("Helvetica", 10)
                    y = 760
                document.drawString(60, y, _latin1(raw_line)[:180])
                y -= 14
            document.save()
            logger.info("Wrote PDF to %s", path)
            return path
        except Exception as exc:  # pragma: no cover - defensive
            logger.warning("PDF rendering failed (%s); writing text fallback", exc)

    _write_text_fallback(str(report_text), path)
    logger.info("Reportlab unavailable; wrote fallback PDF-text to %s", path)
    return path
