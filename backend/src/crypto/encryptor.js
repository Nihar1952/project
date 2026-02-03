const crypto = require("crypto");
const fs = require("fs");

/*
  Encrypts a file using AES-GCM based on sensitivity
  Returns algorithm + key material (key removed later)
*/
function encryptFile(inputPath, outputPath, sensitivity) {
  const algoMap = {
    LOW: "aes-128-gcm",
    MEDIUM: "aes-192-gcm",
    HIGH: "aes-256-gcm",
  };

  const algo = algoMap[sensitivity] || "aes-256-gcm";

  const keyLength =
    algo === "aes-128-gcm" ? 16 :
    algo === "aes-192-gcm" ? 24 :
    32;

  const key = crypto.randomBytes(keyLength);
  const iv = crypto.randomBytes(12); // GCM standard

  const cipher = crypto.createCipheriv(algo, key, iv);

  const input = fs.readFileSync(inputPath);
  const encrypted = Buffer.concat([
    cipher.update(input),
    cipher.final(),
  ]);

  const tag = cipher.getAuthTag();

  fs.writeFileSync(outputPath, encrypted);

  return {
    algo,
    key,
    iv,
    tag,
  };
}

/*
  Decrypts a file using AES-GCM
*/
function decryptFile(encryptedPath, outputPath, key, algo, iv, tag) {
  const decipher = crypto.createDecipheriv(algo, key, iv);
  decipher.setAuthTag(tag);

  const encrypted = fs.readFileSync(encryptedPath);
  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]);

  fs.writeFileSync(outputPath, decrypted);
}

/* ✅ NAMED EXPORTS — THIS WAS THE BUG */
module.exports = {
  encryptFile,
  decryptFile,
};
