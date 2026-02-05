const { ethers } = require("ethers");
const { contractABI, contractAddress } = require("../config/blockchain");

// Hardhat local node
const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");

// Hardhat default account private key
const PRIVATE_KEY =
  "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

const wallet = new ethers.Wallet(PRIVATE_KEY, provider);

// Contract instance
const fileAuditContract = new ethers.Contract(
  contractAddress,
  contractABI,
  wallet
);

/**
 * Logs audit data to blockchain
 */
async function logFileAction(fileId, userId, action, cid) {
  const tx = await fileAuditContract.logAudit(
    fileId,
    userId,
    action,
    cid
  );

  await tx.wait();
  return tx.hash;
}

module.exports = {
  logFileAction
};
