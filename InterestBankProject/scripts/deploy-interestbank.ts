import { ethers } from "hardhat";

async function main() {
  console.log("Deploying InterestBank contract...");
  
  const InterestBank = await ethers.getContractFactory("InterestBank");
  const interestBank = await InterestBank.deploy();
  await interestBank.waitForDeployment();

  const address = await interestBank.getAddress();
  console.log("InterestBank deployed to:", address);
  
  // Contract bilgilerini göster
  const annualRate = await interestBank.ANNUAL_INTEREST_RATE();
  const denominator = await interestBank.RATE_DENOMINATOR();
  const actualRate = (Number(annualRate) / Number(denominator)) * 100;
  
  console.log("\n=== Contract Information ===");
  console.log("Annual Interest Rate:", actualRate + "%");
  console.log("Rate Denominator:", denominator.toString());
  console.log("============================\n");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});