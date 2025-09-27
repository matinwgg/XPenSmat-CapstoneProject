# xpensmat/core/security.py
"""
Simple crypto helpers and key management.

Notes:
- This file uses Python's built-in libraries for simple symmetric encryption examples.
- For production use, use libs like cryptography + secure key storage (OS keystore/hardware).
"""
import os
from hashlib import sha256
from base64 import b64encode, b64decode
from Crypto.Cipher import AES
from Crypto.Random import get_random_bytes

def derive_key_from_passphrase(passphrase: str, salt: bytes | None = None) -> bytes:
    if salt is None:
        salt = b"xpensmat_salt"
    h = sha256(passphrase.encode() + salt).digest()
    return h  # 32 bytes AES-256 key

def encrypt_bytes(key: bytes, plaintext: bytes) -> bytes:
    iv = get_random_bytes(12)
    cipher = AES.new(key, AES.MODE_GCM, nonce=iv)
    ct, tag = cipher.encrypt_and_digest(plaintext)
    return iv + tag + ct

def decrypt_bytes(key: bytes, blob: bytes) -> bytes:
    iv = blob[:12]
    tag = blob[12:28]
    ct = blob[28:]
    cipher = AES.new(key, AES.MODE_GCM, nonce=iv)
    return cipher.decrypt_and_verify(ct, tag)
