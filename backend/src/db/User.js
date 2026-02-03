const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  userId: { type: String, unique: true },
  email: { type: String, unique: true },
  passwordHash: String,

  crypto: {
    publicKey: String,
    encryptedPrivateKey: String,
    salt: String,
    iv: String,
    tag: String,
  },
});

module.exports = mongoose.model("User", UserSchema);
