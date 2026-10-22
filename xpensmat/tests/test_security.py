import pytest
# PyCryptodome provides the maintained Crypto namespace.
from Crypto.Random import get_random_bytes  # nosec B413

from xpensmat.core.security import (
    CryptoError,
    SALT_SIZE,
    decode_blob,
    decrypt_bytes,
    derive_key_from_passphrase,
    encode_blob,
    encrypt_bytes,
)

PASSPHRASE = "correct horse battery staple"


def _key(salt: bytes | None = None) -> bytes:
    return derive_key_from_passphrase(PASSPHRASE, salt)


def test_round_trip():
    salt = get_random_bytes(SALT_SIZE)
    key = _key(salt)
    assert len(key) == 32
    assert len(salt) == SALT_SIZE
    blob = encrypt_bytes(key, b"private expense data")
    assert decrypt_bytes(key, blob) == b"private expense data"


def test_same_passphrase_with_same_salt_is_deterministic():
    salt = get_random_bytes(SALT_SIZE)
    assert _key(salt) == _key(salt)


def test_wrong_key_is_rejected():
    key = _key(get_random_bytes(SALT_SIZE))
    wrong = derive_key_from_passphrase("another long passphrase")
    blob = encrypt_bytes(key, b"secret")
    with pytest.raises(CryptoError, match="authentication failed"):
        decrypt_bytes(wrong, blob)


def test_tampering_is_rejected():
    key = _key()
    blob = bytearray(encrypt_bytes(key, b"secret"))
    blob[-1] ^= 1
    with pytest.raises(CryptoError, match="authentication failed"):
        decrypt_bytes(key, bytes(blob))


def test_aad_mismatch_is_rejected():
    key = _key()
    blob = encrypt_bytes(key, b"secret", aad=b"v1")
    with pytest.raises(CryptoError, match="authentication failed"):
        decrypt_bytes(key, blob, aad=b"v2")


def test_short_passphrase_and_bad_salt_are_rejected():
    with pytest.raises(CryptoError, match="at least 12"):
        derive_key_from_passphrase("short")
    with pytest.raises(CryptoError, match="salt"):
        derive_key_from_passphrase(PASSPHRASE, b"short")


def test_base64_helpers_round_trip():
    key = _key()
    blob = encrypt_bytes(key, b"secret")
    assert decode_blob(encode_blob(blob)) == blob
    with pytest.raises(CryptoError, match="Base64"):
        decode_blob("not!base64")
