
function buildMetadata({
  senderId,
  receiverId,
  sensitivity,
  aesAlg,
  ivB64,
  authTagB64,
  encryptedAESKeyB64
}) {
  return {
    version: "1.0",
    senderId,
    receiverId,
    sensitivity,
    aesAlg,
    iv: ivB64,
    authTag: authTagB64,
    encryptedAESKey: encryptedAESKeyB64,
    createdAt: new Date().toISOString()
  };
}

module.exports = { buildMetadata };
