const { generateRSAKeyPair } = require("../crypto/rsa");
const { encryptFile } = require("../crypto/encryptor");
const { decryptFile } = require("../crypto/decryptor");

function main() {
  console.log("=== CRYPTO MODULE TEST ===");

  const receiverKeys = generateRSAKeyPair();


  const originalText = "Hello this is my secret project file!";
  const fileBuffer = Buffer.from(originalText, "utf8");

 
  const enc = encryptFile({
    fileBuffer,
    senderId: "sender_01",
    receiverId: "receiver_01",
    sensitivity: "high", 
    receiverPublicKeyPem: receiverKeys.publicKeyPem
  });

  console.log("AES used:", enc.metadata.aesAlg);
  console.log("H1:", enc.hashes.H1);
  console.log("H2:", enc.hashes.H2);


  const decrypted = decryptFile({
    ciphertext: enc.ciphertext,
    metadata: enc.metadata,
    hashes: enc.hashes,
    receiverPrivateKeyPem: receiverKeys.privateKeyPem
  });

  const decryptedText = decrypted.toString("utf8");

  console.log("Decrypted:", decryptedText);
  console.log("Match:", decryptedText === originalText);


  console.log("\n--- Tamper Test (H1 should fail) ---");
  const tamperedCipher = Buffer.from(enc.ciphertext);
  tamperedCipher[0] = tamperedCipher[0] ^ 0xff;

  try {
    decryptFile({
      ciphertext: tamperedCipher,
      metadata: enc.metadata,
      hashes: enc.hashes,
      receiverPrivateKeyPem: receiverKeys.privateKeyPem
    });
  } catch (e) {
    console.log("Expected error:", e.message);
  }

 
  console.log("\n--- Tamper Test (H2 should fail) ---");
  const metaTampered = { ...enc.metadata, receiverId: "attacker_01" };

  try {
    decryptFile({
      ciphertext: enc.ciphertext,
      metadata: metaTampered,
      hashes: enc.hashes,
      receiverPrivateKeyPem: receiverKeys.privateKeyPem
    });
  } catch (e) {
    console.log("Expected error:", e.message);
  }

  console.log("\n All tests finished.");
}

main();
