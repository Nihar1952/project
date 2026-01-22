const crypto = require("crypto");
const { chooseAESKeyLength, aesAlgorithmFromKeyLen } = require("./adaptiveAES");
const { rsaEncryptAESKey } = require("./rsa");
const { sha256Hex } = require("./hash");
const { buildMetadata } = require("./metadata");


function encryptFile({
  fileBuffer,
  senderId,
  receiverId,
  sensitivity,
  receiverPublicKeyPem
}) {
  if (!Buffer.isBuffer(fileBuffer)) {
    throw new Error("fileBuffer must be a Buffer");
  }

  const fileSizeBytes = fileBuffer.length;


  const keyLen = chooseAESKeyLength(sensitivity, fileSizeBytes);
  const aesAlg = aesAlgorithmFromKeyLen(keyLen);


  const aesKey = crypto.randomBytes(keyLen);
  const iv = crypto.randomBytes(12);


  const cipher = crypto.createCipheriv(aesAlg, aesKey, iv);
  const ciphertext = Buffer.concat([cipher.update(fileBuffer), cipher.final()]);
  const authTag = cipher.getAuthTag();


  const encAESKey = rsaEncryptAESKey(aesKey, receiverPublicKeyPem);


  const metadata = buildMetadata({
    senderId,
    receiverId,
    sensitivity,
    aesAlg,
    ivB64: iv.toString("base64"),
    authTagB64: authTag.toString("base64"),
    encryptedAESKeyB64: encAESKey.toString("base64")
  });


  const H1 = sha256Hex(ciphertext);                
  const H2 = sha256Hex(JSON.stringify(metadata));   

  return {
    ciphertext,     
    metadata,       
    hashes: { H1, H2 }
  };
}

module.exports = { encryptFile };
