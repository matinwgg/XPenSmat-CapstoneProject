# xpensmat/export/report_builder.py
"""
Report builder orchestration: fetches recent transactions and predictions and
writes PDF/DOCX reports periodically.
"""
from xpensmat.data.db import db
from xpensmat.export.pdf_exporter import export_pdf
from xpensmat.export.docx_exporter import export_docx
from xpensmat.core.logger import logger
import datetime
from pathlib import Path

REPORT_DIR = Path("./reports")
REPORT_DIR.mkdir(exist_ok=True, parents=True)

def build_reports_if_needed():
    # For demo, always build a daily report
    rows = db.list_transactions(limit=50)
    body = "XPenSmat Daily Report\n\n"
    for r in rows:
        body += f"txn_id={r[0]} src={r[2]} amount={r[4]} ts={r[1]}\n"
    now = datetime.datetime.utcnow().strftime("%Y%m%dT%H%M%S")
    pdf_path = str(REPORT_DIR / f"report_{now}.pdf")
    docx_path = str(REPORT_DIR / f"report_{now}.docx")
    export_pdf(body, pdf_path)
    export_docx(body, docx_path)
    logger.info("Generated reports: %s, %s", pdf_path, docx_path)
