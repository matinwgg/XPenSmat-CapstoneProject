# xpensmat/core/security.py
"""Authenticated encryption helpers for local financial data.

AES-256-GCM protects confidentiality *and* integrity.  Passphrases are
stretched with scrypt and a random per-record salt; a static salt is never
used.  Callers must persist the salt returned by
:func:`derive_key_with_salt` next to the ciphertext.
"""
from __future__ import annotations

import base64
import binascii
import hashlib
import os

from cryptography.exceptions import InvalidTag
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

SALT_SIZE = 16
NONCE_SIZE = 12
KEY_SIZE = 32
TAG_SIZE = 16
MIN_BLOB_SIZE = NONCE_SIZE + TAG_SIZE
MAX_PLAINTEXT_SIZE = 16 * 1024 * 1024

# scrypt parameters: ~32 MB memory, interactive-login cost.
_SCRYPT_N = 2**15
_SCRYPT_R = 8
_SCRYPT_P = 1


class CryptoError(ValueError):
    """Raised when cryptographic input is malformed or authentication fails."""


def derive_key_with_salt(
    passphrase: str, salt: bytes | None = None
) -> tuple[bytes, bytes]:
    """Derive an AES-256 key and the salt used to derive it."""

    if not isinstance(passphrase, str) or not passphrase:
        raise CryptoError("passphrase must be a non-empty string")
    if len(passphrase) < 12:
        raise CryptoError("passphrase must contain at least 12 characters")
    if salt is None:
        salt = os.urandom(SALT_SIZE)
    if not isinstance(salt, bytes) or len(salt) != SALT_SIZE:
        raise CryptoError(f"salt must be exactly {SALT_SIZE} bytes")

    key = hashlib.scrypt(
        passphrase.encode("utf-8"),
        salt=salt,
        n=_SCRYPT_N,
        r=_SCRYPT_R,
        p=_SCRYPT_P,
        dklen=KEY_SIZE,
        maxmem=64 * 1024 * 1024,
    )
    return key, salt


def derive_key_from_passphrase(passphrase: str, salt: bytes | None = None) -> bytes:
    """Derive a key; a random salt is used when none is supplied."""

    key, _ = derive_key_with_salt(passphrase, salt)
    return key


def _validate_key(key: bytes) -> None:
    if not isinstance(key, bytes) or len(key) != KEY_SIZE:
        raise CryptoError("key must be exactly 32 bytes")


def encrypt_bytes(key: bytes, plaintext: bytes, aad: bytes | None = None) -> bytes:
    """Encrypt bytes and return ``nonce || tag || ciphertext``."""

    _validate_key(key)
    if not isinstance(plaintext, bytes):
        raise CryptoError("plaintext must be bytes")
    if len(plaintext) > MAX_PLAINTEXT_SIZE:
        raise CryptoError("plaintext exceeds maximum supported size")
    if aad is not None and not isinstance(aad, bytes):
        raise CryptoError("AAD must be bytes or None")

    nonce = os.urandom(NONCE_SIZE)
    sealed = AESGCM(key).encrypt(nonce, plaintext, aad)
    ciphertext, tag = sealed[:-TAG_SIZE], sealed[-TAG_SIZE:]
    return nonce + tag + ciphertext


def decrypt_bytes(key: bytes, blob: bytes, aad: bytes | None = None) -> bytes:
    """Decrypt and authenticate a blob produced by :func:`encrypt_bytes`."""

    _validate_key(key)
    if not isinstance(blob, bytes) or len(blob) < MIN_BLOB_SIZE:
        raise CryptoError("encrypted blob is malformed")
    if len(blob) > MAX_PLAINTEXT_SIZE + MIN_BLOB_SIZE:
        raise CryptoError("encrypted blob exceeds maximum supported size")
    if aad is not None and not isinstance(aad, bytes):
        raise CryptoError("AAD must be bytes or None")

    nonce = blob[:NONCE_SIZE]
    tag = blob[NONCE_SIZE:MIN_BLOB_SIZE]
    ciphertext = blob[MIN_BLOB_SIZE:]
    try:
        return AESGCM(key).decrypt(nonce, ciphertext + tag, aad)
    except (InvalidTag, ValueError) as exc:
        raise CryptoError("ciphertext authentication failed") from exc


def encode_blob(blob: bytes) -> str:
    """Base64-encode an encrypted blob for text storage/transport."""

    if not isinstance(blob, bytes):
        raise CryptoError("blob must be bytes")
    return base64.b64encode(blob).decode("ascii")


def decode_blob(value: str) -> bytes:
    """Strictly decode a Base64 encrypted blob."""

    if not isinstance(value, str):
        raise CryptoError("value must be a string")
    try:
        return base64.b64decode(value.encode("ascii"), validate=True)
    except (binascii.Error, ValueError, UnicodeEncodeError) as exc:
        raise CryptoError("invalid Base64 encoding") from exc
