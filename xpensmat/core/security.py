"""Authenticated local encryption helpers for XPenSmat.

The storage format is self-contained:
    version(1) | salt(16) | nonce(12) | tag(16) | ciphertext

Passphrases are converted to AES-256 keys with Argon2id. A fresh random
salt is generated for every encrypted blob, preventing reuse of derived keys.
"""

from __future__ import annotations

from argon2.low_level import Type, hash_secret_raw
from Crypto.Cipher import AES
from Crypto.Random import get_random_bytes

VERSION = b"\x01"
SALT_SIZE = 16
NONCE_SIZE = 12
TAG_SIZE = 16
KEY_SIZE = 32

# Reasonable interactive defaults; callers can tune these if needed.
ARGON2_TIME_COST = 3
ARGON2_MEMORY_COST = 64 * 1024
ARGON2_PARALLELISM = 2


def derive_key_from_passphrase(passphrase: str, salt: bytes) -> bytes:
    """Derive a 256-bit key using Argon2id."""
    if not isinstance(passphrase, str) or not passphrase:
        raise ValueError("passphrase must be a non-empty string")
    if len(salt) != SALT_SIZE:
        raise ValueError(f"salt must be exactly {SALT_SIZE} bytes")
    return hash_secret_raw(
        secret=passphrase.encode("utf-8"),
        salt=salt,
        time_cost=ARGON2_TIME_COST,
        memory_cost=ARGON2_MEMORY_COST,
        parallelism=ARGON2_PARALLELISM,
        hash_len=KEY_SIZE,
        type=Type.ID,
    )


def encrypt_bytes(passphrase: str, plaintext: bytes) -> bytes:
    """Encrypt plaintext with AES-256-GCM using a password-derived key."""
    salt = get_random_bytes(SALT_SIZE)
    nonce = get_random_bytes(NONCE_SIZE)
    key = derive_key_from_passphrase(passphrase, salt)
    cipher = AES.new(key, AES.MODE_GCM, nonce=nonce)
    cipher.update(VERSION)
    ciphertext, tag = cipher.encrypt_and_digest(plaintext)
    return VERSION + salt + nonce + tag + ciphertext


def decrypt_bytes(passphrase: str, blob: bytes) -> bytes:
    """Decrypt an XPenSmat encrypted blob and verify its authentication tag."""
    minimum = 1 + SALT_SIZE + NONCE_SIZE + TAG_SIZE
    if len(blob) < minimum or blob[:1] != VERSION:
        raise ValueError("invalid or unsupported encrypted blob")

    offset = 1
    salt = blob[offset : offset + SALT_SIZE]
    offset += SALT_SIZE
    nonce = blob[offset : offset + NONCE_SIZE]
    offset += NONCE_SIZE
    tag = blob[offset : offset + TAG_SIZE]
    ciphertext = blob[offset + TAG_SIZE :]

    key = derive_key_from_passphrase(passphrase, salt)
    cipher = AES.new(key, AES.MODE_GCM, nonce=nonce)
    cipher.update(VERSION)
    return cipher.decrypt_and_verify(ciphertext, tag)
