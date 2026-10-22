import pandas as pd
import pytest

from xpensmat.interfaces import cli


def _csv(tmp_path):
    path = tmp_path / "data.csv"
    pd.DataFrame({"amount": [10.0, 20.0, 30.0]}).to_csv(path, index=False)
    return path


def test_help_exits_zero():
    with pytest.raises(SystemExit) as exc:
        cli.main(["--help"])
    assert exc.value.code == 0


def test_out_requires_predict():
    with pytest.raises(SystemExit) as exc:
        cli.main(["--out", "predictions.csv"])
    assert exc.value.code == 2


def test_train_predict_and_evaluate(tmp_path, capsys):
    data = _csv(tmp_path)
    model = tmp_path / "model.joblib"
    output = tmp_path / "predictions.csv"

    assert (
        cli.main(
            [
                "--train",
                "--data",
                str(data),
                "--model",
                str(model),
                "--target",
                "amount",
            ]
        )
        == 0
    )
    assert model.exists()

    assert (
        cli.main(
            [
                "--predict",
                str(data),
                "--model",
                str(model),
                "--out",
                str(output),
                "--target",
                "amount",
            ]
        )
        == 0
    )
    assert output.exists()

    assert (
        cli.main(
            [
                "--evaluate",
                str(data),
                "--model",
                str(model),
                "--target",
                "amount",
            ]
        )
        == 0
    )
    assert "Evaluation metrics" in capsys.readouterr().out
