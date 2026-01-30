const crypto = require("crypto");
const fs = require("fs");

module.exports.decryptFile = function (inputPath, outputPath, meta) {
  const decipher = crypto.createDecipheriv(
    meta.algo,
    meta.key,
    meta.iv
  );

  decipher.setAuthTag(meta.tag);

  const encrypted = fs.readFileSync(inputPath);
  const decrypted = Buffer.concat([
    decipher.update(encrypted),
    decipher.final(),
  ]);

  fs.writeFileSync(outputPath, decrypted);
};
