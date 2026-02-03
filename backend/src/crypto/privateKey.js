const crypto = require("crypto");

function encryptPrivateKey(privateKeyPem, password) {
  const salt = crypto.randomBytes(16);
  const iv = crypto.randomBytes(12);
  const key = crypto.scryptSync(password, salt, 32);

  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([
    cipher.update(privateKeyPem),
    cipher.final(),
  ]);

  return {
    cipher: encrypted.toString("base64"),
    salt: salt.toString("base64"),
    iv: iv.toString("base64"),
    tag: cipher.getAuthTag().toString("base64"),
  };
}

function decryptPrivateKey(enc, password) {
  const key = crypto.scryptSync(password, Buffer.from(enc.salt, "base64"), 32);
  const decipher = crypto.createDecipheriv(
    "aes-256-gcm",
    key,
    Buffer.from(enc.iv, "base64")
  );
  decipher.setAuthTag(Buffer.from(enc.tag, "base64"));

  return Buffer.concat([
    decipher.update(Buffer.from(enc.encryptedPrivateKey, "base64")),
    decipher.final(),
  ]);
}

module.exports = { encryptPrivateKey, decryptPrivateKey };
