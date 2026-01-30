const crypto = require("crypto");
const fs = require("fs");

module.exports.sha256File = (path) =>
  crypto.createHash("sha256").update(fs.readFileSync(path)).digest("hex");
