import { defineConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-ethers"; // ethers plugin'i yeterli

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL || "";
const SEPOLIA_PRIVATE_KEY = process.env.SEPOLIA_PRIVATE_KEY || "";

export default defineConfig({
  solidity: "0.8.28",
  networks: {
    sepolia: {
      type: "http",
      chainType: "l1",
      url: SEPOLIA_RPC_URL,
      accounts: SEPOLIA_PRIVATE_KEY ? [SEPOLIA_PRIVATE_KEY] : [],
    },
  },
});
