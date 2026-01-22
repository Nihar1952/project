const fs = require("fs");
const path = require("path");

const { generateRSAKeyPair } = require("../crypto/rsa");
const { encryptFile } = require("../crypto/encryptor");
const { decryptFile } = require("../crypto/decryptor");

function main() {
  console.log("=== REAL FILE ENCRYPT/DECRYPT TEST (PURE FILE-BASED AES) ===");


  const userArgPath = process.argv[2];

  if (!userArgPath) {
    console.log(" No input file provided.");
    console.log(" Example usage:");
    console.log("   npm run test:file -- temp/aes128_test.txt");
    console.log("   npm run test:file -- temp/aes192_2mb.bin");
    console.log("   npm run test:file -- temp/aes256_20mb.bin");
    process.exit(1);
  }

  const receiverKeys = generateRSAKeyPair();

  const inputFile = path.resolve(process.cwd(), userArgPath);

  const parsed = path.parse(inputFile);
  const outputFile = path.join(parsed.dir, `decrypted_${parsed.base}`);

  if (!fs.existsSync(inputFile)) {
    console.log(" Input file not found:", inputFile);
    process.exit(1);
  }

  const fileBuffer = fs.readFileSync(inputFile);
  console.log("Input file:", inputFile);
  console.log("Input file size:", fileBuffer.length, "bytes");

  const enc = encryptFile({
    fileBuffer,
    senderId: "sender_01",
    receiverId: "receiver_01",
    receiverPublicKeyPem: receiverKeys.publicKeyPem
  });

  console.log("AES used:", enc.metadata.aesAlg);
  console.log("H1:", enc.hashes.H1);
  console.log("H2:", enc.hashes.H2);

 
  const decryptedBuffer = decryptFile({
    ciphertext: enc.ciphertext,
    metadata: enc.metadata,
    hashes: enc.hashes,
    receiverPrivateKeyPem: receiverKeys.privateKeyPem
  });

  
  fs.writeFileSync(outputFile, decryptedBuffer);
  console.log(" Decrypted file saved as:", outputFile);

  const original = fs.readFileSync(inputFile);
  const decrypted = fs.readFileSync(outputFile);

  const same = Buffer.compare(original, decrypted) === 0;
  console.log("Match (byte-by-byte):", same ? "TRUE" : "FALSE");

  if (!same) {
    console.log(" Something is wrong: output file differs from original");
  }
}

main();
