const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const callML = require("../ml/callML");
const { encryptFile } = require("../crypto/encryptor");
const { decryptFile } = require("../crypto/decryptor");
const { sha256File } = require("../crypto/hash");
const {
  generateKeyPair,
  encryptAESKey,
  decryptAESKey,
} = require("../crypto/rsa");

const  connectDB  = require("../db/mongo");
const FileMetadata = require("../db/FileMetadata");

(async () => {
  /* 🔹 Dynamic import for ESM-only Helia IPFS client */
  const { uploadToIPFS, downloadFromIPFS } =
    await import("../ipfs/ipfsClient.mjs");

  /* 🔹 Connect to MongoDB */
  await connectDB();

  const inputFile = path.resolve(process.argv[2]);
  const dir = path.dirname(inputFile);
  const name = path.basename(inputFile);

  console.log("\n=== ML + RSA + DUAL HASH + IPFS + DB TEST ===");
  console.log("Input file:", inputFile);
  console.log("Size:", fs.statSync(inputFile).size, "bytes");

  /* 1️⃣ Plaintext hash */
  const plainHash = sha256File(inputFile);
  console.log("📄 Plaintext Hash:", plainHash);

  /* 2️⃣ ML-based sensitivity */
  const sensitivity = await callML(inputFile);
  console.log("🔐 ML-Predicted Sensitivity:", sensitivity);

  /* 3️⃣ Generate RSA keys (demo user) */
  const { publicKey, privateKey } = generateKeyPair();

  /* 4️⃣ AES encrypt */
  const encryptedPath = path.join(dir, `encrypted_${name}`);
  const decryptedPath = path.join(dir, `decrypted_${name}`);

  const meta = encryptFile(inputFile, encryptedPath, sensitivity);
  console.log("AES Used:", meta.algo);

  /* 5️⃣ Ciphertext hash */
  const cipherHash = sha256File(encryptedPath);
  console.log("📦 Ciphertext Hash:", cipherHash);

  /* 6️⃣ RSA wrap AES key */
  const wrappedAESKey = encryptAESKey(meta.key, publicKey);
  console.log("🔑 AES key wrapped with RSA");

  delete meta.key; // never keep plaintext AES key

  /* 7️⃣ Upload encrypted file to IPFS */
  const cid = await uploadToIPFS(encryptedPath);
  console.log("🌐 Uploaded to IPFS | CID:", cid);

  /* 8️⃣ Persist metadata to DB */
  const fileId = uuidv4();

  const record = new FileMetadata({
    fileId,
    originalName: name,
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

  await record.save();
  console.log("📦 Metadata saved to DB | FileID:", fileId);

  /* ===== Simulated download phase ===== */

  const downloadedEncryptedPath = path.join(
    dir,
    `ipfs_${name}.enc`
  );

  /* 9️⃣ Download encrypted file from IPFS */
  await downloadFromIPFS(cid, downloadedEncryptedPath);
  console.log("⬇️ Downloaded from IPFS");

  /* 🔟 Verify ciphertext integrity */
  const verifyCipherHash = sha256File(downloadedEncryptedPath);
  if (verifyCipherHash !== cipherHash) {
    throw new Error("❌ Encrypted file tampered on IPFS");
  }
  console.log("✅ Ciphertext hash verified");

  /* 1️⃣1️⃣ RSA unwrap AES key */
  meta.key = decryptAESKey(
    Buffer.from(record.crypto.wrappedAESKey, "base64"),
    privateKey
  );

  /* 1️⃣2️⃣ AES decrypt */
  decryptFile(downloadedEncryptedPath, decryptedPath, meta);

  /* 1️⃣3️⃣ Verify plaintext integrity */
  const finalPlainHash = sha256File(decryptedPath);
  console.log("Decrypted file:", decryptedPath);
  console.log(
    "Match:",
    finalPlainHash === plainHash ? "✅ TRUE" : "❌ FALSE"
  );
})();
