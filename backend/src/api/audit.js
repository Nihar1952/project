const express = require("express");
const auth = require("../auth/middleware");

const { ethers } = require("ethers");
const { contractABI, contractAddress } = require("../../config/blockchain");

const FileMetadata = require("../db/FileMetaData"); // ✅ ADD THIS

const router = express.Router();

// Hardhat / local provider
const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

// Read-only contract instance
const auditContract = new ethers.Contract(
  contractAddress,
  contractABI,
  provider
);

/**
 * GET /api/audit/:fileId
 * Returns blockchain audit history for a file
 */
router.get("/:fileId", auth, async (req, res) => {
  try {
    const { fileId } = req.params;
    const userId = req.user.userId; // ✅ ADD THIS

    // 🔐 STEP 1: Check access
    const file = await FileMetadata.findOne({ fileId });

    if (!file || !file.crypto.wrappedKeys.has(userId)) {
      return res.status(403).json({ error: "Access denied" });
    }

    // Read AuditLogged events from blockchain
    const events = await auditContract.queryFilter("AuditLogged");

    // Filter only this file
    const audits = events
      .map(e => ({
        fileId: e.args.fileId,
        userId: e.args.userId,
        action: e.args.action,
        cid: e.args.cid,
        timestamp: Number(e.args.timestamp)
      }))
      .filter(a => a.fileId === fileId);

    res.json({
      audited: audits.length > 0,
      count: audits.length,
      audits
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to read audit logs" });
  }
});

module.exports = router;