"""CLI behaviour tests."""

from pathlib import Path

import pandas as pd
import pytest

import xpensmat.interfaces.cli as cli


def test_no_arguments_is_a_noop(capsys):
    assert cli.main([]) == 0
    assert capsys.readouterr().out == ""


def test_ingest_sms(monkeypatch):
    calls = []
    monkeypatch.setattr(cli, "poll_and_store", lambda: calls.append(True) or 3)
    assert cli.main(["--ingest-sms"]) == 0
    assert calls == [True]


def test_train(monkeypatch, capsys, tmp_path):
    model_path = tmp_path / "model.joblib"
    monkeypatch.setattr(cli, "train_model", lambda: model_path)
    assert cli.main(["--train"]) == 0
    assert f"Saved model to {model_path}" in capsys.readouterr().out


def test_start_orchestrator(monkeypatch):
    class FakeOrchestrator:
        def __init__(self):
            self.started = False

        def start(self):
            self.started = True

    fake = FakeOrchestrator()
    monkeypatch.setattr(cli, "orchestrator", fake)
    assert cli.main(["--start-orchestrator"]) == 0
    assert fake.started is True


def test_predict_and_save(monkeypatch, capsys, tmp_path):
    csv_path = tmp_path / "input.csv"
    pd.DataFrame({"month": [1, 2], "amount": [10, 20]}).to_csv(csv_path, index=False)
    out_path = tmp_path / "predictions.csv"

    captured = {}

    def fake_predict(path):
        captured["predict_path"] = path
        return [1.0, 2.0]

    def fake_save(result, out, df=None, target_col=None):
        captured["result"] = result
        captured["out"] = out
        captured["target_col"] = target_col
        captured["df_rows"] = len(df)
        return Path(out)

    monkeypatch.setattr(cli, "predict_from_csv", fake_predict)
    monkeypatch.setattr(cli, "save_predictions", fake_save)

    assert cli.main(["--predict", str(csv_path), "--out", str(out_path)]) == 0
    assert captured["predict_path"] == str(csv_path)
    assert captured["result"] == [1.0, 2.0]
    assert captured["out"] == str(out_path)
    assert captured["target_col"] == "MonthlyExpenses"
    assert captured["df_rows"] == 2
    output = capsys.readouterr().out
    assert "Wrote predictions to" in output


def test_out_without_predict_is_rejected(capsys):
    with pytest.raises(SystemExit) as excinfo:
        cli.main(["--out", "predictions.csv"])
    assert excinfo.value.code == 2
    assert "--out requires --predict" in capsys.readouterr().err


def test_evaluate(monkeypatch, capsys, tmp_path):
    csv_path = tmp_path / "labelled.csv"
    csv_path.write_text("amount\n1\n", encoding="utf-8")
    monkeypatch.setattr(
        cli, "evaluate_model", lambda path: {"rmse": 0.0, "mae": 0.0, "r2": 1.0}
    )
    assert cli.main(["--evaluate", str(csv_path)]) == 0
    assert "Evaluation metrics" in capsys.readouterr().out


def test_parser_has_expected_options():
    parser = cli.build_parser()
    args = parser.parse_args([])
    assert args.ingest_sms is False
    assert args.predict is None
    assert args.out is None
    assert args.evaluate is None
