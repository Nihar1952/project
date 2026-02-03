const express = require("express");
const path = require("path");

const auth = require("../auth/middleware");

const FileMetadata = require("../db/FileMetaData");
const User = require("../db/User");

const { decryptAESKey } = require("../crypto/rsa");
const { decryptFile } = require("../crypto/decryptor");
const { sha256File } = require("../crypto/hash");
const { decryptPrivateKey } = require("../crypto/privateKey");

const { downloadFromIPFS } = require("../ipfs/ipfsClient");

const router = express.Router();

router.post("/:fileId", auth, async (req, res) => {
  try {
    const { password } = req.body;
    const { fileId } = req.params;

    const meta = await FileMetadata.findOne({ fileId });
    const wrappedKey = meta.crypto.wrappedKeys.get(req.user.userId);

    if (!wrappedKey) return res.status(403).json({ error: "Access denied" });

    const user = await User.findOne({ userId: req.user.userId });
    const privateKey = decryptPrivateKey(
  {
    encryptedPrivateKey: user.crypto.encryptedPrivateKey,
    salt: user.crypto.salt,
    iv: user.crypto.iv,
    tag: user.crypto.tag,
  },
  password
);

    const aesKey = decryptAESKey(
      Buffer.from(wrappedKey, "base64"),
      privateKey
    );

    const encPath = path.join("temp", `${fileId}.enc`);
    await downloadFromIPFS(meta.cid, encPath);

    if (sha256File(encPath) !== meta.hashes.ciphertext)
      return res.status(400).json({ error: "Integrity failed" });

    const outPath = path.join("temp", meta.originalName);
    decryptFile(encPath, outPath, {
      key: aesKey,
      iv: Buffer.from(meta.crypto.iv, "base64"),
      tag: Buffer.from(meta.crypto.authTag, "base64"),
      algo: meta.crypto.algo,
    });

    res.download(outPath);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Download failed" });
  }
});

module.exports = router;
