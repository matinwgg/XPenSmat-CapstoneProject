# xpensmat/export/pdf_exporter.py
"""
Simple PDF exporter using reportlab if installed; else produce a plain text fallback.
"""
from xpensmat.core.logger import logger
from pathlib import Path

try:
    from reportlab.lib.pagesizes import letter
    from reportlab.pdfgen import canvas
    REPORTLAB_OK = True
except Exception:
    REPORTLAB_OK = False

def export_pdf(report_text: str, out_path: str):
    p = Path(out_path)
    p.parent.mkdir(parents=True, exist_ok=True)
    if REPORTLAB_OK:
        c = canvas.Canvas(str(p), pagesize=letter)
        c.drawString(72, 720, report_text[:1000])
        c.save()
        logger.info("Wrote PDF to %s", p)
    else:
        # fallback to .txt with .pdf extension for demo
        with open(p, "w", encoding="utf-8") as f:
            f.write(report_text)
        logger.info("Reportlab not installed; wrote fallback PDF-text to %s", p)
