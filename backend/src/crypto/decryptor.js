const crypto = require("crypto");
const { rsaDecryptAESKey } = require("./rsa");
const { sha256Hex } = require("./hash");


function decryptFile({
  ciphertext,
  metadata,
  hashes,
  receiverPrivateKeyPem
}) {
  if (!Buffer.isBuffer(ciphertext)) throw new Error("ciphertext must be a Buffer");


  const actualH1 = sha256Hex(ciphertext);
  if (actualH1 !== hashes.H1) {
    throw new Error("TAMPER DETECTED: H1 mismatch (ciphertext modified)");
  }


  const actualH2 = sha256Hex(JSON.stringify(metadata));
  if (actualH2 !== hashes.H2) {
    throw new Error("TAMPER DETECTED: H2 mismatch (metadata modified)");
  }

  const aesAlg = metadata.aesAlg;
  const iv = Buffer.from(metadata.iv, "base64");
  const authTag = Buffer.from(metadata.authTag, "base64");
  const encAESKey = Buffer.from(metadata.encryptedAESKey, "base64");

  const aesKey = rsaDecryptAESKey(encAESKey, receiverPrivateKeyPem);

  const decipher = crypto.createDecipheriv(aesAlg, aesKey, iv);
  decipher.setAuthTag(authTag);

  const plaintext = Buffer.concat([decipher.update(ciphertext), decipher.final()]);
  return plaintext;
}

module.exports = { decryptFile };
