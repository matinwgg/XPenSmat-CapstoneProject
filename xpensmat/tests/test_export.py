# xpensmat/tests/test_export.py
from xpensmat.export.report_builder import build_reports_if_needed
from pathlib import Path

def test_build_reports_creates_files(tmp_path, monkeypatch):
    # monkeypatch the report dir to tmp
    import xpensmat.export.report_builder as rb
    rb.REPORT_DIR = Path(tmp_path)
    rb.build_reports_if_needed()
    files = list(Path(tmp_path).glob("*"))
    assert len(files) >= 2  # pdf + docx (or fallback files)
