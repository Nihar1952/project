const express = require("express");
const multer = require("multer");
const { v4: uuidv4 } = require("uuid");

const auth = require("../auth/middleware");

const callML = require("../ml/callML");
const { encryptFile } = require("../crypto/encryptor");
const { sha256File } = require("../crypto/hash");
const { encryptAESKey } = require("../crypto/rsa");

const FileMetadata = require("../db/FileMetaData");
const User = require("../db/User");
const { uploadToIPFS } = require("../ipfs/ipfsClient");
const { logFileAction } = require("../../services/blockchainService");

const router = express.Router();
const upload = multer({ dest: "temp/" });

router.post("/", auth, upload.single("file"), async (req, res) => {
  try {
    const inputPath = req.file.path;
    const originalName = req.file.originalname;
    const recipients = [].concat(req.body.recipients || []);

    const plainHash = sha256File(inputPath);
    const sensitivity = await callML(inputPath);

    const encryptedPath = `${inputPath}.enc`;
    const meta = encryptFile(inputPath, encryptedPath, sensitivity);

    const cipherHash = sha256File(encryptedPath);
    const wrappedKeys = new Map();

    const owner = await User.findOne({ userId: req.user.userId });
    wrappedKeys.set(
      owner.userId,
      encryptAESKey(meta.key, owner.crypto.publicKey).toString("base64")
    );

    for (const r of recipients) {
      const u = await User.findOne({ userId: r });
      if (!u) continue;
      wrappedKeys.set(
        u.userId,
        encryptAESKey(meta.key, u.crypto.publicKey).toString("base64")
      );
    }

    delete meta.key;

    console.log("⏳ Uploading to IPFS...");
    const cid = await uploadToIPFS(encryptedPath);
    console.log("🌐 Uploaded to IPFS | CID:", cid);

    const fileId = uuidv4();

    await FileMetadata.create({
      fileId,
      originalName,
      owner: owner.userId,
      cid,
      crypto: {
        algo: meta.algo,
        iv: meta.iv.toString("base64"),
        authTag: meta.tag.toString("base64"),
        wrappedKeys,
      },
      hashes: { plaintext: plainHash, ciphertext: cipherHash },
      sensitivity,
    });
    await logFileAction(
      fileId,              // same UUID you generated
      owner.userId,        // uploader
      "UPLOAD",            // action
      cid                  // IPFS CID
    );
    res.json({ fileId, cid, sensitivity });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "Upload failed" });
  }
});

module.exports = router;
