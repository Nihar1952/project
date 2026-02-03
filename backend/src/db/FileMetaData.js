const mongoose = require("mongoose");

const FileSchema = new mongoose.Schema({
  fileId: { type: String, required: true, unique: true },
  originalName: String,
  cid: String,

  crypto: {
  algo: String,
  iv: String,
  authTag: String,

  wrappedKeys: {
    type: Map,
    of: String // userId -> wrapped AES key (base64)
  }
}
,

  hashes: {
    plaintext: String,
    ciphertext: String,
  },

  sensitivity: String,
  owner: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("FileMetadata", FileSchema);
