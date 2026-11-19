"""Compatibility import for the canonical :mod:`xpensmat.core.security` API."""

import sys

from xpensmat.core import security as _security

# Alias the module itself so callers and test tooling observe the canonical
# constants and functions as one shared implementation.
sys.modules[__name__] = _security
