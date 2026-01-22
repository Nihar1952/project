const crypto = require("crypto");


function generateRSAKeyPair() {
  const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: { type: "spki", format: "pem" },
    privateKeyEncoding: { type: "pkcs8", format: "pem" }
  });

  return { publicKeyPem: publicKey, privateKeyPem: privateKey };
}


function rsaEncryptAESKey(aesKeyBuffer, receiverPublicKeyPem) {
  return crypto.publicEncrypt(
    {
      key: receiverPublicKeyPem,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256"
    },
    aesKeyBuffer
  ); 
}


function rsaDecryptAESKey(encryptedAESKeyBuffer, receiverPrivateKeyPem) {
  return crypto.privateDecrypt(
    {
      key: receiverPrivateKeyPem,
      padding: crypto.constants.RSA_PKCS1_OAEP_PADDING,
      oaepHash: "sha256"
    },
    encryptedAESKeyBuffer
  ); 
}

module.exports = {
  generateRSAKeyPair,
  rsaEncryptAESKey,
  rsaDecryptAESKey
};
