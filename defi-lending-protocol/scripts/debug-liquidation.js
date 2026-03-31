const hre = require("hardhat");

async function main() {
  const addresses = require('../deployed-addresses.json');
  const [deployer, borrower, liquidator] = await hre.ethers.getSigners();
  
  const lendingPool = await hre.ethers.getContractAt("LendingPool", addresses.lendingPool);
  const usdc = await hre.ethers.getContractAt("MockERC20", addresses.usdc);
  const dai = await hre.ethers.getContractAt("MockERC20", addresses.dai);
  const priceOracle = await hre.ethers.getContractAt("PriceOracle", addresses.priceOracle);
  
  console.log("Debug: Checking prices and decimals\n");
  
  const usdcPrice = await priceOracle.getPrice(addresses.usdc);
  const daiPrice = await priceOracle.getPrice(addresses.dai);
  
  console.log("USDC price:", Number(usdcPrice));
  console.log("DAI price:", Number(daiPrice));
  
  const testAmount = hre.ethers.parseEther("1000");
  console.log("\nTest liquidation amount:", hre.ethers.formatEther(testAmount), "DAI");
  
  const seized = await lendingPool.calculateCollateralSeized(
    addresses.dai,
    addresses.usdc,
    testAmount
  );
  
  console.log("Seized amount (raw):", seized.toString());
  console.log("Seized amount (USDC):", Number(seized) / 1e6);
  
  const daiValue = await priceOracle.getValueInUSD(addresses.dai, testAmount);
  console.log("\n1000 DAI value in USD:", hre.ethers.formatEther(daiValue));
  
  const usdcBalance = 10000e6;
  const usdcValue = await priceOracle.getValueInUSD(addresses.usdc, usdcBalance);
  console.log("10000 USDC value in USD:", hre.ethers.formatEther(usdcValue));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });