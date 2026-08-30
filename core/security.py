"""Cryptographic helpers for protecting local XPenSmat data.

This module provides authenticated encryption with AES-256-GCM. Password
processing uses a memory-hard KDF; callers must persist the generated salt
alongside ciphertext metadata and must never reuse a static salt.
"""

from __future__ import annotations

import base64
import hashlib
import hmac
import os

from Crypto.Cipher import AES
from Crypto.Protocol.KDF import scrypt
from Crypto.Random import get_random_bytes

SALT_SIZE = 16
NONCE_SIZE = 12
KEY_SIZE = 32
TAG_SIZE = 16
MIN_BLOB_SIZE = NONCE_SIZE + TAG_SIZE
MAX_PLAINTEXT_SIZE = 16 * 1024 * 1024


class CryptoError(ValueError):
    """Raised when cryptographic input is malformed or authentication fails."""


def derive_key_from_passphrase(passphrase: str, salt: bytes | None = None) -> bytes:
    """Derive an AES-256 key using scrypt.

    A fresh random salt is generated when one is not supplied. The salt is
    not secret and must be stored with the encrypted record by the caller.
    """
    if not isinstance(passphrase, str) or not passphrase:
        raise CryptoError("passphrase must be a non-empty string")
    if len(passphrase) < 12:
        raise CryptoError("passphrase must contain at least 12 characters")
    if salt is None:
        salt = get_random_bytes(SALT_SIZE)
    if not isinstance(salt, bytes) or len(salt) != SALT_SIZE:
        raise CryptoError(f"salt must be exactly {SALT_SIZE} bytes")

    return scrypt(passphrase.encode("utf-8"), salt, key_len=KEY_SIZE, N=2**15, r=8, p=1)


def encrypt_bytes(key: bytes, plaintext: bytes, aad: bytes | None = None) -> bytes:
    """Encrypt bytes using AES-256-GCM and return nonce || tag || ciphertext."""
    if not isinstance(key, bytes) or len(key) != KEY_SIZE:
        raise CryptoError("key must be exactly 32 bytes")
    if not isinstance(plaintext, bytes):
        raise CryptoError("plaintext must be bytes")
    if len(plaintext) > MAX_PLAINTEXT_SIZE:
        raise CryptoError("plaintext exceeds maximum supported size")
    if aad is not None and not isinstance(aad, bytes):
        raise CryptoError("AAD must be bytes or None")

    nonce = get_random_bytes(NONCE_SIZE)
    cipher = AES.new(key, AES.MODE_GCM, nonce=nonce)
    if aad is not None:
        cipher.update(aad)
    ciphertext, tag = cipher.encrypt_and_digest(plaintext)
    return nonce + tag + ciphertext


def decrypt_bytes(key: bytes, blob: bytes, aad: bytes | None = None) -> bytes:
    """Decrypt and authenticate an AES-256-GCM blob."""
    if not isinstance(key, bytes) or len(key) != KEY_SIZE:
        raise CryptoError("key must be exactly 32 bytes")
    if not isinstance(blob, bytes) or len(blob) < MIN_BLOB_SIZE:
        raise CryptoError("encrypted blob is malformed")
    if len(blob) > MAX_PLAINTEXT_SIZE + MIN_BLOB_SIZE:
        raise CryptoError("encrypted blob exceeds maximum supported size")
    if aad is not None and not isinstance(aad, bytes):
        raise CryptoError("AAD must be bytes or None")

    nonce, tag, ciphertext = blob[:NONCE_SIZE], blob[NONCE_SIZE:MIN_BLOB_SIZE], blob[MIN_BLOB_SIZE:]
    cipher = AES.new(key, AES.MODE_GCM, nonce=nonce)
    if aad is not None:
        cipher.update(aad)
    try:
        plaintext = cipher.decrypt(ciphertext)
        cipher.verify(tag)
        return plaintext
    except ValueError as exc:
        raise CryptoError("ciphertext authentication failed") from exc


def encode_blob(blob: bytes) -> str:
    """Encode an encrypted blob for text-based storage or transport."""
    if not isinstance(blob, bytes):
        raise CryptoError("blob must be bytes")
    return base64.b64encode(blob).decode("ascii")


def decode_blob(value: str) -> bytes:
    """Strictly decode a Base64 encrypted blob."""
    if not isinstance(value, str):
        raise CryptoError("value must be a string")
    try:
        return base64.b64decode(value.encode("ascii"), validate=True)
    except (ValueError, UnicodeEncodeError) as exc:
        raise CryptoError("invalid Base64 encoding") from exc
