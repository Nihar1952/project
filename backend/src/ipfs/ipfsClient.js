const fs = require("fs");

let ipfs;

async function getIPFS() {
  if (!ipfs) {
    const { create } = await import("kubo-rpc-client");
    ipfs = create({ url: "http://127.0.0.1:5001" });
    console.log("🟢 Connected to IPFS (Kubo RPC)");
  }
  return ipfs;
}

async function uploadToIPFS(filePath) {
  const ipfs = await getIPFS();
  const data = fs.readFileSync(filePath);
  const { cid } = await ipfs.add(data);
  return cid.toString();
}

async function downloadFromIPFS(cid, outputPath) {
  const ipfs = await getIPFS();
  const chunks = [];
  for await (const chunk of ipfs.cat(cid)) {
    chunks.push(chunk);
  }
  fs.writeFileSync(outputPath, Buffer.concat(chunks));
}

module.exports = { uploadToIPFS, downloadFromIPFS };
