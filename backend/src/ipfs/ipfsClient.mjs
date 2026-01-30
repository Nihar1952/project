import { createHelia } from "helia";
import { unixfs } from "@helia/unixfs";
import fs from "fs";

let helia;
let fsHelia;

async function initIPFS() {
  if (!helia) {
    helia = await createHelia();
    fsHelia = unixfs(helia);
  }
}

export async function uploadToIPFS(filePath) {
  await initIPFS();
  const data = fs.readFileSync(filePath);
  const cid = await fsHelia.addBytes(data);
  return cid.toString();
}

export async function downloadFromIPFS(cid, outputPath) {
  await initIPFS();
  const chunks = [];
  for await (const chunk of fsHelia.cat(cid)) {
    chunks.push(chunk);
  }
  fs.writeFileSync(outputPath, Buffer.concat(chunks));
}
