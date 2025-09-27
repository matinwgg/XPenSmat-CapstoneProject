# xpensmat/export/docx_exporter.py
"""
DOCX exporter: uses python-docx if available, otherwise fallback.
"""
from pathlib import Path
from xpensmat.core.logger import logger

try:
    import docx
    DOCX_OK = True
except Exception:
    DOCX_OK = False

def export_docx(report_text: str, out_path: str):
    p = Path(out_path)
    p.parent.mkdir(parents=True, exist_ok=True)
    if DOCX_OK:
        doc = docx.Document()
        doc.add_paragraph(report_text)
        doc.save(str(p))
        logger.info("Wrote DOCX to %s", p)
    else:
        with open(p, "w", encoding="utf-8") as f:
            f.write(report_text)
        logger.info("python-docx not installed; wrote plain text to %s", p)
