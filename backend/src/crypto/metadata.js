module.exports.createMetadata = (meta) => ({
  algo: meta.algo,
  iv: meta.iv.toString("base64"),
  tag: meta.tag.toString("base64"),
  sensitivity: meta.sensitivity,
});
