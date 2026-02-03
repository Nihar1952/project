const express = require("express");
const bcrypt = require("bcryptjs");

const User = require("../db/User");
const { generateKeyPair } = require("../crypto/rsa");
const { encryptPrivateKey } = require("../crypto/privateKey");

const router = express.Router();

router.post("/", async (req, res) => {
  try {
    const { userId, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ error: "User already exists" });
    }

    // RSA key pair
    const { publicKey, privateKey } = generateKeyPair();

    // Encrypt private key with password
    const encrypted = encryptPrivateKey(privateKey, password);

    await User.create({
      userId,
      email,

      // 🔴 FIX: store hashed password in passwordHash
      passwordHash: await bcrypt.hash(password, 10),

      crypto: {
        publicKey,
        encryptedPrivateKey: encrypted.cipher,
        salt: encrypted.salt,
        iv: encrypted.iv,
        tag: encrypted.tag,
      },
    });

    res.json({ message: "User registered successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Registration failed" });
  }
});

module.exports = router;
