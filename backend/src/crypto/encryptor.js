const crypto = require("crypto");
const fs = require("fs");
const adaptiveAES = require("./adaptiveAES");

module.exports.encryptFile = function (inputPath, outputPath, sensitivity) {
  const { algo, keyLen } = adaptiveAES(sensitivity);

  const key = crypto.randomBytes(keyLen);
  const iv = crypto.randomBytes(12);

  const cipher = crypto.createCipheriv(algo, key, iv);
  const data = fs.readFileSync(inputPath);

  const encrypted = Buffer.concat([cipher.update(data), cipher.final()]);
  const tag = cipher.getAuthTag();

  fs.writeFileSync(outputPath, encrypted);

  return { key, iv, tag, algo, sensitivity };
};
