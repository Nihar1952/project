import { defineConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-ethers"; 
import hardhatEthers from "@nomicfoundation/hardhat-ethers"; 

export default defineConfig({
  // This array is MANDATORY in Hardhat 3 to fix the 'undefined' error
  plugins: [hardhatEthers], 
  
  solidity: "0.8.20",
});