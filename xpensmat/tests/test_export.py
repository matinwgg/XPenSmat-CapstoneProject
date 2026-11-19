"""Export tests: PDF, DOCX and report orchestration."""

from pathlib import Path

from xpensmat.export import docx_exporter, pdf_exporter, report_builder
from xpensmat.export.docx_exporter import export_docx
from xpensmat.export.pdf_exporter import export_pdf


def test_export_pdf_creates_pdf(tmp_path):
    destination = tmp_path / "nested" / "report.pdf"
    result = export_pdf("Line one\nLine two with ünïcode", str(destination))
    assert result == destination
    assert destination.exists()
    assert destination.read_bytes().startswith(b"%PDF")


def test_export_pdf_fallback_when_reportlab_missing(tmp_path, monkeypatch):
    monkeypatch.setattr(pdf_exporter, "REPORTLAB_OK", False)
    destination = tmp_path / "fallback.pdf"
    export_pdf("plain text report", str(destination))
    assert destination.read_text(encoding="utf-8") == "plain text report"


def test_export_docx_creates_docx(tmp_path):
    destination = tmp_path / "report.docx"
    export_docx("First paragraph\nSecond paragraph", str(destination))
    assert destination.exists()
    assert destination.read_bytes().startswith(b"PK")


def test_export_docx_fallback_when_python_docx_missing(tmp_path, monkeypatch):
    monkeypatch.setattr(docx_exporter, "DOCX_OK", False)
    destination = tmp_path / "fallback.docx"
    export_docx("plain docx report", str(destination))
    assert destination.read_text(encoding="utf-8") == "plain docx report"


class _FakeDB:
    def list_transactions(self, limit=100):
        return [
            (1, "2025-01-01T00:00:00Z", "sms", "{}", 10.0, "Food"),
            (2, "2025-01-02T00:00:00Z", "bank", "{}", 20.0, "Transport"),
        ]


def test_build_reports_creates_pdf_and_docx(tmp_path, monkeypatch):
    monkeypatch.setattr(report_builder, "db", _FakeDB())
    pdf_path, docx_path = report_builder.build_reports_if_needed(tmp_path)

    assert pdf_path.exists() and pdf_path.suffix == ".pdf"
    assert docx_path.exists() and docx_path.suffix == ".docx"
    assert len(list(Path(tmp_path).glob("*"))) == 2


def test_build_reports_uses_module_directory_by_default(tmp_path, monkeypatch):
    monkeypatch.setattr(report_builder, "db", _FakeDB())
    monkeypatch.setattr(report_builder, "REPORT_DIR", tmp_path)
    pdf_path, docx_path = report_builder.build_reports_if_needed()
    assert pdf_path.parent == tmp_path
    assert docx_path.parent == tmp_path


def test_report_body_contains_transactions(tmp_path, monkeypatch):
    monkeypatch.setattr(report_builder, "db", _FakeDB())
    captured = {}

    def fake_pdf(text, path):
        captured["text"] = text
        Path(path).write_text(text, encoding="utf-8")

    def fake_docx(text, path):
        Path(path).write_text(text, encoding="utf-8")

    monkeypatch.setattr(report_builder, "export_pdf", fake_pdf)
    monkeypatch.setattr(report_builder, "export_docx", fake_docx)

    report_builder.build_reports_if_needed(tmp_path)
    body = captured["text"]
    assert "XPenSmat Daily Report" in body
    assert "txn_id=1" in body
    assert "amount=10.0" in body
    assert "txn_id=2" in body
