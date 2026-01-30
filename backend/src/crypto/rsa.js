const crypto = require("crypto");

/**
 * Generate RSA key pair (for testing / demo)
 */
module.exports.generateKeyPair = () => {
  return crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: { type: "pkcs1", format: "pem" },
    privateKeyEncoding: { type: "pkcs1", format: "pem" },
  });
};

/**
 * Encrypt (wrap) AES key using RSA public key
 */
module.exports.encryptAESKey = (aesKey, publicKey) => {
  return crypto.publicEncrypt(
    {
      key: publicKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
    },
    aesKey
  );
};

/**
 * Decrypt (unwrap) AES key using RSA private key
 */
module.exports.decryptAESKey = (encryptedKey, privateKey) => {
  return crypto.privateDecrypt(
    {
      key: privateKey,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256",
    },
    encryptedKey
  );
};
