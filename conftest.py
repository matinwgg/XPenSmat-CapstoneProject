"""Keep the test suite away from the developer's real XPenSmat data.

This file is loaded before any test module, so imports of
``xpensmat.core.config`` and ``xpensmat.data.db`` see the temporary paths.
"""

import os
import tempfile
from pathlib import Path

_TMP = Path(tempfile.mkdtemp(prefix="xpensmat-tests-"))
os.environ["XPENSMAT_DB"] = str(_TMP / "xpensmat.db")
os.environ["XPENSMAT_DATA_DIR"] = str(_TMP / "data")
os.environ["XPENSMAT_MODEL_DIR"] = str(_TMP / "models")
