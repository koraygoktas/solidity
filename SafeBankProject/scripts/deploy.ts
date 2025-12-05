const hre = require("hardhat");

async function main() {
  const SafeBank = await hre.ethers.getContractFactory("SafeBank");
  const safebank = await SafeBank.deploy();
  await safebank.waitForDeployment();

  console.log("SafeBank deployed to:", await safebank.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});