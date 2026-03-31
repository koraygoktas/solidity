const hre = require("hardhat");

async function main() {
  console.log("Testing Liquidation\n");

  const addresses = require('../deployed-addresses.json');
  const [deployer, borrower, liquidator, supplier] = await hre.ethers.getSigners();
  
  const lendingPool = await hre.ethers.getContractAt("LendingPool", addresses.lendingPool);
  const usdc = await hre.ethers.getContractAt("MockERC20", addresses.usdc);
  const dai = await hre.ethers.getContractAt("MockERC20", addresses.dai);
  const priceOracle = await hre.ethers.getContractAt("PriceOracle", addresses.priceOracle);
  
  console.log("Accounts:");
  console.log("Borrower:", borrower.address);
  console.log("Liquidator:", liquidator.address);
  console.log("Supplier:", supplier.address);
  
  console.log("\n" + "=".repeat(60));
  console.log("SETUP: Mint tokens");
  console.log("=".repeat(60));
  
  await usdc.mint(borrower.address, 10000e6);
  await dai.mint(supplier.address, hre.ethers.parseEther("20000"));
  await dai.mint(liquidator.address, hre.ethers.parseEther("10000"));
  
  console.log("Borrower: 10,000 USDC");
  console.log("Supplier: 20,000 DAI");
  console.log("Liquidator: 10,000 DAI");
  
  console.log("\n" + "=".repeat(60));
  console.log("STEP 1: Supplier provides DAI liquidity");
  console.log("=".repeat(60));
  
  await dai.connect(supplier).approve(addresses.lendingPool, hre.ethers.parseEther("15000"));
  await lendingPool.connect(supplier).deposit(addresses.dai, hre.ethers.parseEther("15000"));
  
  console.log("Supplier deposited: 15,000 DAI");
  
  console.log("\n" + "=".repeat(60));
  console.log("STEP 2: Borrower deposits USDC as collateral");
  console.log("=".repeat(60));
  
  await usdc.connect(borrower).approve(addresses.lendingPool, 10000e6);
  await lendingPool.connect(borrower).deposit(addresses.usdc, 10000e6);
  
  const [collateral1] = await lendingPool.getUserBalance(borrower.address, addresses.usdc);
  console.log("Borrower collateral:", Number(collateral1) / 1e6, "USDC");
  
  const [totalColl1] = await lendingPool.getAccountLiquidity(borrower.address);
  console.log("Collateral power:", hre.ethers.formatEther(totalColl1), "USD");
  
  console.log("\n" + "=".repeat(60));
  console.log("STEP 3: Borrower borrows DAI");
  console.log("=".repeat(60));
  
  await lendingPool.connect(borrower).borrow(addresses.dai, hre.ethers.parseEther("5000"));
  
  const [, borrow1] = await lendingPool.getUserBalance(borrower.address, addresses.dai);
  console.log("Borrowed:", hre.ethers.formatEther(borrow1), "DAI");
  
  let healthFactor = await lendingPool.getHealthFactor(borrower.address);
  console.log("Health Factor:", hre.ethers.formatEther(healthFactor));
  
  if (healthFactor >= hre.ethers.parseEther("1.0")) {
    console.log("Position is SAFE");
  } else {
    console.log("Position is RISKY");
  }
  
  console.log("\n" + "=".repeat(60));
  console.log("STEP 4: USDC price drops");
  console.log("=".repeat(60));
  
  console.log("Old USDC price: $1.00");
  console.log("New USDC price: $0.60");
  
  await priceOracle.setPrice(addresses.usdc, 60000000, 6);
  
  healthFactor = await lendingPool.getHealthFactor(borrower.address);
  console.log("New Health Factor:", hre.ethers.formatEther(healthFactor));
  
  if (healthFactor < hre.ethers.parseEther("1.0")) {
    console.log("Position is UNDERWATER - Liquidation available");
  }
  
  const [totalColl2, totalBorrow2] = await lendingPool.getAccountLiquidity(borrower.address);
  console.log("Collateral value:", hre.ethers.formatEther(totalColl2), "USD");
  console.log("Borrow value:", hre.ethers.formatEther(totalBorrow2), "USD");
  
  console.log("\n" + "=".repeat(60));
  console.log("STEP 5: Liquidator liquidates position");
  console.log("=".repeat(60));
  
  const liquidateAmount = hre.ethers.parseEther("2000");
  
  console.log("Liquidator repaying:", hre.ethers.formatEther(liquidateAmount), "DAI");
  
  const liquidatorDAIBefore = await dai.balanceOf(liquidator.address);
  const liquidatorUSDCBefore = await usdc.balanceOf(liquidator.address);
  
  await dai.connect(liquidator).approve(addresses.lendingPool, liquidateAmount);
  await lendingPool.connect(liquidator).liquidate(
    borrower.address,
    addresses.dai,
    addresses.usdc,
    liquidateAmount
  );
  
  const liquidatorDAIAfter = await dai.balanceOf(liquidator.address);
  const liquidatorUSDCAfter = await usdc.balanceOf(liquidator.address);
  
  console.log("\nLiquidator spent:", hre.ethers.formatEther(liquidatorDAIBefore - liquidatorDAIAfter), "DAI");
  console.log("Liquidator received:", Number(liquidatorUSDCAfter - liquidatorUSDCBefore) / 1e6, "USDC");
  
  console.log("\n" + "=".repeat(60));
  console.log("STEP 6: Check borrower remaining position");
  console.log("=".repeat(60));
  
  const [collateralFinal] = await lendingPool.getUserBalance(borrower.address, addresses.usdc);
  const [, borrowFinal] = await lendingPool.getUserBalance(borrower.address, addresses.dai);
  
  console.log("Remaining collateral:", Number(collateralFinal) / 1e6, "USDC");
  console.log("Remaining borrow:", hre.ethers.formatEther(borrowFinal), "DAI");
  
  healthFactor = await lendingPool.getHealthFactor(borrower.address);
  console.log("Final Health Factor:", hre.ethers.formatEther(healthFactor));
  
  if (healthFactor >= hre.ethers.parseEther("1.0")) {
    console.log("Position is now SAFE");
  } else {
    console.log("Position still RISKY");
  }
  
  console.log("\n" + "=".repeat(60));
  console.log("Liquidation Test Complete");
  console.log("=".repeat(60));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\nTest failed:");
    console.error(error.message);
    process.exit(1);
  });