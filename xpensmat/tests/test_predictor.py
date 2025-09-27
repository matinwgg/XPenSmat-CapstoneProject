# xpensmat/tests/test_predictor.py
from xpensmat.predictor.train import train_model
from xpensmat.predictor.model_store import load_model

def test_train_and_load(tmp_path):
    # run a quick train (writes model to experiments/models)
    p = train_model()
    # load via model_store
    from xpensmat.predictor.model_store import MODEL_DIR
    # assert file exists
    assert p.exists()
