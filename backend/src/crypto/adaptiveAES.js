module.exports = function adaptiveAES(level) {
  switch (level) {
    case "LOW":
      return { algo: "aes-128-gcm", keyLen: 16 };
    case "MEDIUM":
      return { algo: "aes-192-gcm", keyLen: 24 };
    default:
      return { algo: "aes-256-gcm", keyLen: 32 };
  }
};
