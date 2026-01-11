// scripts/deploy.js
const hre = require("hardhat");

async function main() {
  console.log(" Deploying Lending Protocol...\n");

  const [deployer] = await hre.ethers.getSigners();
  console.log(" Deploying contracts with account:", deployer.address);
  console.log(" Account balance:", (await hre.ethers.provider.getBalance(deployer.address)).toString());

  // 1. Deploy InterestRateModel
  console.log("\n Deploying InterestRateModel...");
  const InterestRateModel = await hre.ethers.getContractFactory("InterestRateModel");
  const interestRateModel = await InterestRateModel.deploy();
  await interestRateModel.waitForDeployment();
  const irmAddress = await interestRateModel.getAddress();
  console.log(" InterestRateModel deployed to:", irmAddress);

  // 2. Deploy PriceOracle
  console.log("\n Deploying PriceOracle...");
  const PriceOracle = await hre.ethers.getContractFactory("PriceOracle");
  const priceOracle = await PriceOracle.deploy();
  await priceOracle.waitForDeployment();
  const oracleAddress = await priceOracle.getAddress();
  console.log(" PriceOracle deployed to:", oracleAddress);

  // 3. Deploy LendingPool
  console.log("\n Deploying LendingPool...");
  const LendingPool = await hre.ethers.getContractFactory("LendingPool");
  const lendingPool = await LendingPool.deploy(irmAddress, oracleAddress);
  await lendingPool.waitForDeployment();
  const poolAddress = await lendingPool.getAddress();
  console.log(" LendingPool deployed to:", poolAddress);

  // 4. Deploy Mock Tokens
  console.log("\n Deploying Mock Tokens...");
  const MockERC20 = await hre.ethers.getContractFactory("MockERC20");
  
  const usdc = await MockERC20.deploy("USD Coin", "USDC", 6);
  await usdc.waitForDeployment();
  const usdcAddress = await usdc.getAddress();
  console.log(" USDC deployed to:", usdcAddress);
  
  const dai = await MockERC20.deploy("Dai Stablecoin", "DAI", 18);
  await dai.waitForDeployment();
  const daiAddress = await dai.getAddress();
  console.log(" DAI deployed to:", daiAddress);

  // 5. Setup Markets
  console.log("\n  Setting up markets...");
  
  await lendingPool.listMarket(usdcAddress, 7500); // 75% collateral factor
  console.log(" USDC market listed (CF: 75%)");
  
  await lendingPool.listMarket(daiAddress, 7500);
  console.log(" DAI market listed (CF: 75%)");

  // 6. Setup Prices
  console.log("\n Setting up prices...");
  await priceOracle.setPrice(usdcAddress, 1e8); // $1.00
  console.log(" USDC price set: $1.00");
  
  await priceOracle.setPrice(daiAddress, 1e8);  // $1.00
  console.log(" DAI price set: $1.00");

  // 7. Summary
  console.log("\n" + "=".repeat(60));
  console.log("✨ Deployment Complete! ✨");
  console.log("=".repeat(60));
  console.log("\n📝 Contract Addresses:");
  console.log("─".repeat(60));
  console.log("LendingPool:        ", poolAddress);
  console.log("InterestRateModel:  ", irmAddress);
  console.log("PriceOracle:        ", oracleAddress);
  console.log("USDC:               ", usdcAddress);
  console.log("DAI:                ", daiAddress);
  console.log("─".repeat(60));

  // Save addresses to file
  const fs = require('fs');
  const addresses = {
    lendingPool: poolAddress,
    interestRateModel: irmAddress,
    priceOracle: oracleAddress,
    usdc: usdcAddress,
    dai: daiAddress
  };
  
  fs.writeFileSync(
    'deployed-addresses.json',
    JSON.stringify(addresses, null, 2)
  );
  console.log("\n Addresses saved to deployed-addresses.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });