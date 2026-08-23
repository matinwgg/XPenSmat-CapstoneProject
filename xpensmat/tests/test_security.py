import pytest

from xpensmat.core.security import decrypt_bytes, encrypt_bytes


def test_encrypt_decrypt_round_trip():
    plaintext = b"student expense data"
    blob = encrypt_bytes("correct horse battery staple", plaintext)

    assert blob != plaintext
    assert decrypt_bytes("correct horse battery staple", blob) == plaintext


def test_encryption_uses_fresh_salt_and_nonce():
    plaintext = b"same input"
    first = encrypt_bytes("password", plaintext)
    second = encrypt_bytes("password", plaintext)

    assert first != second
    assert decrypt_bytes("password", first) == plaintext
    assert decrypt_bytes("password", second) == plaintext


def test_wrong_password_fails_authentication():
    blob = encrypt_bytes("correct", b"secret")

    with pytest.raises(ValueError):
        decrypt_bytes("wrong", blob)


def test_tampering_fails_authentication():
    blob = bytearray(encrypt_bytes("password", b"secret"))
    blob[-1] ^= 0x01

    with pytest.raises(ValueError):
        decrypt_bytes("password", bytes(blob))
