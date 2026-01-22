const crypto = require("crypto");

function sha256Hex(bufferOrString) {
  return crypto.createHash("sha256").update(bufferOrString).digest("hex");
}

module.exports = { sha256Hex };
