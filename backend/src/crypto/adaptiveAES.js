
console.log(" adaptiveAES.js LOADED (file-based version)");

function chooseAESKeyLength(sensitivity, fileSizeBytes) {
    console.log("DEBUG adaptive input => sensitivity:", sensitivity, "fileSizeBytes:", fileSizeBytes);
  
  let keyLen;
  if (fileSizeBytes < 1 * 1024 * 1024) {
    keyLen = 16; 
  } else if (fileSizeBytes < 10 * 1024 * 1024) {
    keyLen = 24; 
  } else {
    keyLen = 32; 
  }

  
  const sens = (sensitivity || "low").toLowerCase();

  if (sens === "high") {
    keyLen = 32;
  } else if (sens === "medium") {
    keyLen = Math.max(keyLen, 24);
  } 


  return keyLen; 
}

function aesAlgorithmFromKeyLen(keyLenBytes) {
  if (keyLenBytes === 16) return "aes-128-gcm";
  if (keyLenBytes === 24) return "aes-192-gcm";
  if (keyLenBytes === 32) return "aes-256-gcm";
  throw new Error("Invalid AES key length. Must be 16/24/32 bytes.");
}

module.exports = { chooseAESKeyLength, aesAlgorithmFromKeyLen };
