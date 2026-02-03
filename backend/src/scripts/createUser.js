const mongoose = require("mongoose");
const crypto = require("crypto");

const connectDB = require("../db/mongo");
const User = require("../db/User");

function generateUserKeys(password) {
  const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
    modulusLength: 2048,
    publicKeyEncoding: { type: "pkcs1", format: "pem" },
    privateKeyEncoding: { type: "pkcs1", format: "pem" },
  });

  const salt = crypto.randomBytes(16);
  const key = crypto.scryptSync(password, salt, 32);
  const iv = crypto.randomBytes(12);

  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const encryptedPrivateKey = Buffer.concat([
    cipher.update(privateKey),
    cipher.final(),
  ]);
  const tag = cipher.getAuthTag();

  return {
    publicKey,
    encryptedPrivateKey: encryptedPrivateKey.toString("base64"),
    salt: salt.toString("base64"),
    iv: iv.toString("base64"),
    tag: tag.toString("base64"),
  };
}

async function createUser(userId, password) {
  const cryptoKeys = generateUserKeys(password);

  await User.create({
    userId,
    crypto: cryptoKeys,
  });

  console.log(`✅ User created: ${userId}`);
}

(async () => {
  await connectDB();

  await createUser("userA", "password");
  await createUser("userB", "password");

  process.exit();
})();
