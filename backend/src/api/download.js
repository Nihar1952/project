const express = require("express");
const path = require("path");
const fs = require("fs");

const FileMetadata = require("../db/FileMetadata");
const { decryptFile } = require("../crypto/decryptor");
const { sha256File } = require("../crypto/hash");
const { decryptAESKey } = require("../crypto/rsa");

const router = express.Router();

router.get("/:fileId", async (req, res) => {
  const { fileId } = req.params;

  try {
    /* 1️⃣ Fetch metadata from DB */
    const record = await FileMetadata.findOne({ fileId });
    if (!record) {
      return res.status(404).json({ error: "File not found" });
    }

    /* 2️⃣ Download encrypted file from IPFS */
    const { downloadFromIPFS } = await import("../ipfs/ipfsClient.mjs");

    const tempDir = path.join(__dirname, "../../temp");
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir);

    const encryptedPath = path.join(tempDir, `${fileId}.enc`);
    const decryptedPath = path.join(tempDir, record.originalName);

    await downloadFromIPFS(record.cid, encryptedPath);

    /* 3️⃣ Verify ciphertext integrity */
    const cipherHash = sha256File(encryptedPath);
    if (cipherHash !== record.hashes.ciphertext) {
      return res.status(400).json({ error: "Encrypted file tampered" });
    }

    /* 4️⃣ Recover AES key (RSA unwrap) */
    const wrappedKey = Buffer.from(
      record.crypto.wrappedAESKey,
      "base64"
    );

    // ⚠️ DEMO ASSUMPTION:
    // In real systems, private key comes from authenticated user
    const PRIVATE_KEY_PATH = path.join(
      __dirname,
      "../../keys/private.pem"
    );

    if (!fs.existsSync(PRIVATE_KEY_PATH)) {
      return res
        .status(500)
        .json({ error: "Private key not found on server" });
    }

    const privateKey = fs.readFileSync(PRIVATE_KEY_PATH, "utf8");
    const aesKey = decryptAESKey(wrappedKey, privateKey);

    /* 5️⃣ AES decrypt file */
    const meta = {
      algo: record.crypto.algo,
      iv: Buffer.from(record.crypto.iv, "base64"),
      tag: Buffer.from(record.crypto.authTag, "base64"),
      key: aesKey,
    };

    decryptFile(encryptedPath, decryptedPath, meta);

    /* 6️⃣ Verify plaintext integrity */
    const finalHash = sha256File(decryptedPath);
    if (finalHash !== record.hashes.plaintext) {
      return res.status(400).json({ error: "File integrity violated" });
    }

    /* 7️⃣ Send file to client */
    res.download(decryptedPath, record.originalName);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Download failed" });
  }
});

module.exports = router;
