const hre = require("hardhat");

async function main() {
  console.log("Deploying Lending Protocol...\n");

  const [deployer] = await hre.ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const InterestRateModel = await hre.ethers.getContractFactory("InterestRateModel");
  const interestRateModel = await InterestRateModel.deploy();
  await interestRateModel.waitForDeployment();
  const irmAddress = await interestRateModel.getAddress();
  console.log("InterestRateModel:", irmAddress);

  const PriceOracle = await hre.ethers.getContractFactory("PriceOracle");
  const priceOracle = await PriceOracle.deploy();
  await priceOracle.waitForDeployment();
  const oracleAddress = await priceOracle.getAddress();
  console.log("PriceOracle:", oracleAddress);

  const LendingPool = await hre.ethers.getContractFactory("LendingPool");
  const lendingPool = await LendingPool.deploy(irmAddress, oracleAddress);
  await lendingPool.waitForDeployment();
  const poolAddress = await lendingPool.getAddress();
  console.log("LendingPool:", poolAddress);

  const MockERC20 = await hre.ethers.getContractFactory("MockERC20");
  
  const usdc = await MockERC20.deploy("USD Coin", "USDC", 6);
  await usdc.waitForDeployment();
  const usdcAddress = await usdc.getAddress();
  console.log("USDC:", usdcAddress);
  
  const dai = await MockERC20.deploy("Dai Stablecoin", "DAI", 18);
  await dai.waitForDeployment();
  const daiAddress = await dai.getAddress();
  console.log("DAI:", daiAddress);

  console.log("\nSetting up markets...");
  
  await lendingPool.listMarket(usdcAddress, 7500);
  console.log("USDC market listed");
  
  await lendingPool.listMarket(daiAddress, 7500);
  console.log("DAI market listed");

  console.log("\nSetting up prices...");
  await priceOracle.setPrice(usdcAddress, 1e8, 6);
  console.log("USDC price set");
  
  await priceOracle.setPrice(daiAddress, 1e8, 18);
  console.log("DAI price set");

  console.log("\nDeployment Complete");

  const fs = require('fs');
  const addresses = {
    lendingPool: poolAddress,
    interestRateModel: irmAddress,
    priceOracle: oracleAddress,
    usdc: usdcAddress,
    dai: daiAddress
  };
  
  fs.writeFileSync('deployed-addresses.json', JSON.stringify(addresses, null, 2));
  console.log("Addresses saved to deployed-addresses.json");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });