# xpensmat/export/report_builder.py
"""
Report builder orchestration: fetches recent transactions and predictions and
writes PDF/DOCX reports periodically.
"""
import datetime
from pathlib import Path

from xpensmat.core.logger import logger
from xpensmat.data.db import db
from xpensmat.export.docx_exporter import export_docx
from xpensmat.export.pdf_exporter import export_pdf

REPORT_DIR = Path("./reports")
REPORT_DIR.mkdir(exist_ok=True, parents=True)


def build_reports_if_needed(report_dir: str | Path | None = None) -> tuple[Path, Path]:
    """Build a daily report and return ``(pdf_path, docx_path)``."""
    directory = Path(report_dir) if report_dir is not None else REPORT_DIR
    directory.mkdir(parents=True, exist_ok=True)

    rows = db.list_transactions(limit=50)
    body = "XPenSmat Daily Report\n\n"
    for row in rows:
        body += f"txn_id={row[0]} src={row[2]} amount={row[4]} ts={row[1]}\n"

    now = datetime.datetime.now(datetime.timezone.utc).strftime("%Y%m%dT%H%M%S%f")
    pdf_path = directory / f"report_{now}.pdf"
    docx_path = directory / f"report_{now}.docx"
    export_pdf(body, str(pdf_path))
    export_docx(body, str(docx_path))
    logger.info("Generated reports: %s, %s", pdf_path, docx_path)
    return pdf_path, docx_path
