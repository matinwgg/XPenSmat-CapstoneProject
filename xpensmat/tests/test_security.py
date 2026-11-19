"""Cryptography tests for both security implementations."""

import base64

import pytest

import core.security as root_security
import xpensmat.core.security as pkg_security

PASSPHRASE = "correct horse battery staple"


# ---------------------------------------------------------------------------
# Root implementation (core/security.py)
# ---------------------------------------------------------------------------
def test_root_round_trip():
    key = root_security.derive_key_from_passphrase(PASSPHRASE)
    assert len(key) == root_security.KEY_SIZE
    blob = root_security.encrypt_bytes(key, b"salaries and secrets")
    assert blob[: root_security.NONCE_SIZE] != b""
    assert root_security.decrypt_bytes(key, blob) == b"salaries and secrets"


def test_root_round_trip_with_aad():
    key = root_security.derive_key_from_passphrase(PASSPHRASE, salt=b"\x01" * 16)
    blob = root_security.encrypt_bytes(key, b"payload", aad=b"transaction:42")
    assert root_security.decrypt_bytes(key, blob, aad=b"transaction:42") == b"payload"
    with pytest.raises(root_security.CryptoError):
        root_security.decrypt_bytes(key, blob, aad=b"transaction:43")


def test_root_salt_generation_is_random():
    first = root_security.derive_key_from_passphrase(PASSPHRASE)
    second = root_security.derive_key_from_passphrase(PASSPHRASE)
    assert first != second


def test_root_derivation_with_fixed_salt_is_deterministic():
    salt = b"s" * root_security.SALT_SIZE
    first = root_security.derive_key_from_passphrase(PASSPHRASE, salt=salt)
    second = root_security.derive_key_from_passphrase(PASSPHRASE, salt=salt)
    assert first == second


@pytest.mark.parametrize("passphrase", ["", "short", 123, None])
def test_root_rejects_bad_passphrase(passphrase):
    with pytest.raises(root_security.CryptoError):
        root_security.derive_key_from_passphrase(passphrase)


@pytest.mark.parametrize("salt", [b"short", "not-bytes", b"x" * 17])
def test_root_rejects_bad_salt(salt):
    with pytest.raises(root_security.CryptoError):
        root_security.derive_key_from_passphrase(PASSPHRASE, salt=salt)


def test_root_rejects_bad_key():
    with pytest.raises(root_security.CryptoError):
        root_security.encrypt_bytes(b"short", b"data")
    with pytest.raises(root_security.CryptoError):
        root_security.decrypt_bytes(b"short", b"x" * 28)


def test_root_rejects_bad_plaintext_type():
    key = root_security.derive_key_from_passphrase(PASSPHRASE)
    with pytest.raises(root_security.CryptoError):
        root_security.encrypt_bytes(key, "not-bytes")
    with pytest.raises(root_security.CryptoError):
        root_security.encrypt_bytes(key, b"data", aad="not-bytes")


def test_root_rejects_oversized_plaintext(monkeypatch):
    monkeypatch.setattr(root_security, "MAX_PLAINTEXT_SIZE", 4)
    key = root_security.derive_key_from_passphrase(PASSPHRASE)
    with pytest.raises(root_security.CryptoError):
        root_security.encrypt_bytes(key, b"12345")


def test_root_rejects_malformed_and_oversized_blob(monkeypatch):
    key = root_security.derive_key_from_passphrase(PASSPHRASE)
    with pytest.raises(root_security.CryptoError):
        root_security.decrypt_bytes(key, b"too-short")
    monkeypatch.setattr(root_security, "MAX_PLAINTEXT_SIZE", 1)
    with pytest.raises(root_security.CryptoError):
        root_security.decrypt_bytes(key, b"x" * (root_security.MIN_BLOB_SIZE + 2))


def test_root_tampering_is_detected():
    key = root_security.derive_key_from_passphrase(PASSPHRASE)
    blob = bytearray(root_security.encrypt_bytes(key, b"important"))
    blob[-1] ^= 0xFF
    with pytest.raises(root_security.CryptoError):
        root_security.decrypt_bytes(key, bytes(blob))


def test_root_wrong_key_is_rejected():
    first = root_security.derive_key_from_passphrase(PASSPHRASE, salt=b"a" * 16)
    second = root_security.derive_key_from_passphrase(PASSPHRASE, salt=b"b" * 16)
    blob = root_security.encrypt_bytes(first, b"secret")
    with pytest.raises(root_security.CryptoError):
        root_security.decrypt_bytes(second, blob)


def test_root_blob_encoding_round_trip():
    key = root_security.derive_key_from_passphrase(PASSPHRASE)
    blob = root_security.encrypt_bytes(key, b"encode me")
    encoded = root_security.encode_blob(blob)
    assert isinstance(encoded, str)
    assert root_security.decode_blob(encoded) == blob


@pytest.mark.parametrize("value", ["not base64!!", "%%%%", 123, None])
def test_root_decode_rejects_invalid_input(value):
    with pytest.raises(root_security.CryptoError):
        root_security.decode_blob(value)


# ---------------------------------------------------------------------------
# Package implementation (xpensmat/core/security.py)
# ---------------------------------------------------------------------------
def test_package_round_trip():
    key = pkg_security.derive_key_from_passphrase(PASSPHRASE)
    blob = pkg_security.encrypt_bytes(key, b"expense data")
    assert pkg_security.decrypt_bytes(key, blob) == b"expense data"


def test_package_derive_key_with_salt_is_deterministic():
    first_key, first_salt = pkg_security.derive_key_with_salt(PASSPHRASE)
    second_key, second_salt = pkg_security.derive_key_with_salt(PASSPHRASE, salt=first_salt)
    assert first_key == second_key
    assert first_salt == second_salt
    assert len(first_key) == pkg_security.KEY_SIZE
    assert len(first_salt) == pkg_security.SALT_SIZE


def test_package_generates_unique_salts():
    _, first_salt = pkg_security.derive_key_with_salt(PASSPHRASE)
    _, second_salt = pkg_security.derive_key_with_salt(PASSPHRASE)
    assert first_salt != second_salt


def test_package_validation():
    with pytest.raises(pkg_security.CryptoError):
        pkg_security.derive_key_from_passphrase("short")
    with pytest.raises(pkg_security.CryptoError):
        pkg_security.derive_key_from_passphrase(PASSPHRASE, salt=b"bad")
    key = pkg_security.derive_key_from_passphrase(PASSPHRASE)
    with pytest.raises(pkg_security.CryptoError):
        pkg_security.encrypt_bytes(key, "text")
    with pytest.raises(pkg_security.CryptoError):
        pkg_security.decrypt_bytes(key, b"short")


def test_package_tampering_detected():
    key = pkg_security.derive_key_from_passphrase(PASSPHRASE)
    blob = bytearray(pkg_security.encrypt_bytes(key, b"amount=10"))
    blob[pkg_security.NONCE_SIZE] ^= 0x01
    with pytest.raises(pkg_security.CryptoError):
        pkg_security.decrypt_bytes(key, bytes(blob))


def test_package_base64_helpers():
    key = pkg_security.derive_key_from_passphrase(PASSPHRASE)
    blob = pkg_security.encrypt_bytes(key, b"abc")
    encoded = pkg_security.encode_blob(blob)
    assert base64.b64decode(encoded) == blob
    assert pkg_security.decode_blob(encoded) == blob
    with pytest.raises(pkg_security.CryptoError):
        pkg_security.decode_blob("!!!")
