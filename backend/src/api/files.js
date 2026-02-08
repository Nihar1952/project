const express = require("express");
const auth = require("../auth/middleware");
const FileMetadata = require("../db/FileMetaData");

const router = express.Router();

/**
 * GET /files/shared-with-me
 * Returns all files the logged-in user can access
 */
router.get("/shared-with-me", auth, async (req, res) => {
  try {
    const userId = req.user.userId;

    // Find files where this user has a wrapped AES key
    const files = await FileMetadata.find({
      [`crypto.wrappedKeys.${userId}`]: { $exists: true }
    }).select("fileId originalName owner cid");

    res.json(files);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch shared files" });
  }
});

/**
 * GET /files/uploaded-by-me
 * Returns all files uploaded by the logged-in user
 */
router.get("/uploaded-by-me", auth, async (req, res) => {
  try {
    const userId = req.user.userId;

    const files = await FileMetadata.find({
      owner: userId
    }).select("fileId originalName cid");

    res.json(files);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch uploaded files" });
  }
});

module.exports = router;
