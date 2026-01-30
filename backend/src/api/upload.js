const express = require("express");
const multer = require("multer");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const callML = require("../ml/callML");
const { encryptFile } = require("../crypto/encryptor");
const { sha256File } = require("../crypto/hash");
const { generateKeyPair, encryptAESKey } = require("../crypto/rsa");
const FileMetadata = require("../db/FileMetadata");

const router = express.Router();
const upload = multer({ dest: "temp/" });

router.post("/", upload.single("file"), async (req, res) => {
  const { uploadToIPFS } = await import("../ipfs/ipfsClient.mjs");

  const inputPath = req.file.path;
  const originalName = req.file.originalname;

  // 1️⃣ Plain hash
  const plainHash = sha256File(inputPath);

  // 2️⃣ ML sensitivity
  const sensitivity = await callML(inputPath);

  // 3️⃣ RSA keys (demo)
  const { publicKey } = generateKeyPair();

  // 4️⃣ AES encrypt
  const encryptedPath = `${inputPath}.enc`;
  const meta = encryptFile(inputPath, encryptedPath, sensitivity);

  // 5️⃣ Cipher hash
  const cipherHash = sha256File(encryptedPath);

  // 6️⃣ RSA wrap AES key
  const wrappedAESKey = encryptAESKey(meta.key, publicKey);
  delete meta.key;

  // 7️⃣ Upload to IPFS
  const cid = await uploadToIPFS(encryptedPath);

  // 8️⃣ Store metadata
  const fileId = uuidv4();

  await FileMetadata.create({
    fileId,
    originalName,
    cid,
    crypto: {
      algo: meta.algo,
      iv: meta.iv.toString("base64"),
      authTag: meta.tag.toString("base64"),
      wrappedAESKey: wrappedAESKey.toString("base64"),
    },
    hashes: {
      plaintext: plainHash,
      ciphertext: cipherHash,
    },
    sensitivity,
    owner: "demo-user",
  });

  res.json({
    message: "File uploaded securely",
    fileId,
    sensitivity,
  });
});

module.exports = router;
