import { network } from "hardhat"; 

async function main() {
  console.log("Starting deployment...");

  // The Hardhat 3 standard: connect to the network to get a verified ethers object
  const { ethers } = await network.connect(); 

  const FileAudit = await ethers.getContractFactory("FileAudit");
  const contract = await FileAudit.deploy();

  await contract.waitForDeployment();

  const address = await contract.getAddress();
  console.log("✅ FileAudit deployed to:", address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});