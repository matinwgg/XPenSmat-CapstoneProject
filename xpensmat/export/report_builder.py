# xpensmat/export/report_builder.py
"""Build daily transaction reports in PDF and DOCX formats."""

from __future__ import annotations

import datetime
from pathlib import Path

from xpensmat.core.logger import logger
from xpensmat.data.db import db
from xpensmat.export.docx_exporter import export_docx
from xpensmat.export.pdf_exporter import export_pdf

REPORT_DIR = Path("./reports")
REPORT_DIR.mkdir(exist_ok=True, parents=True)


def build_reports_if_needed() -> list[str]:
    """Build at most one report pair per UTC day."""
    now = datetime.datetime.now(datetime.UTC)
    day = now.strftime("%Y%m%d")
    if any(REPORT_DIR.glob(f"report_{day}T*")):
        return []

    rows = db.list_transactions(limit=50)
    body = "XPenSmat Daily Report\n\n"
    for row in rows:
        body += (
            f"txn_id={row[0]} src={row[2]} amount={row[4]} ts={row[1]}\n"
        )

    stamp = now.strftime("%Y%m%dT%H%M%S")
    pdf_path = str(REPORT_DIR / f"report_{stamp}.pdf")
    docx_path = str(REPORT_DIR / f"report_{stamp}.docx")
    export_pdf(body, pdf_path)
    export_docx(body, docx_path)
    logger.info("Generated reports: %s, %s", pdf_path, docx_path)
    return [pdf_path, docx_path]
