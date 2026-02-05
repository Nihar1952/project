const { logFileAction } = require("./services/blockchainService");

(async () => {
  try {
    const txHash = await logFileAction(
      "file_123",                    // fileId (MongoDB or generated ID)
      "userA",                       // userId
      "UPLOAD",                      // action
      "QmEncryptedIPFSHashHere"      // IPFS CID
    );

    console.log("✅ Logged on chain, tx:", txHash);
  } catch (err) {
    console.error("❌ Blockchain log failed:", err);
  }
})();
