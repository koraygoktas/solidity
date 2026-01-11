const hre = require("hardhat");

async function main() {
  console.log("Testing Lending Protocol\n");

  const addresses = require('../deployed-addresses.json');
  const [deployer, user1, user2] = await hre.ethers.getSigners();
  
  const lendingPool = await hre.ethers.getContractAt("LendingPool", addresses.lendingPool);
  const usdc = await hre.ethers.getContractAt("MockERC20", addresses.usdc);
  const dai = await hre.ethers.getContractAt("MockERC20", addresses.dai);
  
  console.log("Test Users:");
  console.log("User1:", user1.address);
  console.log("User2:", user2.address);
  
  console.log("\n" + "=".repeat(60));
  console.log("TEST 1: Minting tokens");
  console.log("=".repeat(60));
  
  await usdc.mint(user1.address, 10000e6);
  await dai.mint(user2.address, hre.ethers.parseEther("20000"));
  
  console.log("User1: 10,000 USDC");
  console.log("User2: 20,000 DAI");
  
  console.log("\n" + "=".repeat(60));
  console.log("TEST 2: User1 deposits 5,000 USDC");
  console.log("=".repeat(60));
  
  await usdc.connect(user1).approve(addresses.lendingPool, 5000e6);
  await lendingPool.connect(user1).deposit(addresses.usdc, 5000e6);
  
  const [deposit1, borrow1] = await lendingPool.getUserBalance(user1.address, addresses.usdc);
  console.log("User1 USDC deposit:", Number(deposit1) / 1e6, "USDC");
  
  const [totalCollateral, totalBorrow] = await lendingPool.getAccountLiquidity(user1.address);
  console.log("User1 collateral power:", hre.ethers.formatEther(totalCollateral), "USD");
  
  console.log("\n" + "=".repeat(60));
  console.log("TEST 3: User2 deposits 10,000 DAI");
  console.log("=".repeat(60));
  
  await dai.connect(user2).approve(addresses.lendingPool, hre.ethers.parseEther("10000"));
  await lendingPool.connect(user2).deposit(addresses.dai, hre.ethers.parseEther("10000"));
  
  const [deposit2, borrow2] = await lendingPool.getUserBalance(user2.address, addresses.dai);
  console.log("User2 DAI deposit:", hre.ethers.formatEther(deposit2), "DAI");
  
  console.log("\n" + "=".repeat(60));
  console.log("TEST 4: User1 borrows 2,000 DAI");
  console.log("=".repeat(60));
  
  await lendingPool.connect(user1).borrow(addresses.dai, hre.ethers.parseEther("2000"));
  
  const [depositDAI, borrowDAI] = await lendingPool.getUserBalance(user1.address, addresses.dai);
  console.log("User1 DAI borrow:", hre.ethers.formatEther(borrowDAI), "DAI");
  
  let healthFactor = await lendingPool.getHealthFactor(user1.address);
  console.log("Health Factor:", hre.ethers.formatEther(healthFactor));
  
  if (healthFactor >= hre.ethers.parseEther("1.0")) {
    console.log("Position is SAFE");
  } else {
    console.log("Position is RISKY");
  }
  
  console.log("\n" + "=".repeat(60));
  console.log("TEST 5: Interest rates");
  console.log("=".repeat(60));
  
  const rates = await lendingPool.getAPY(addresses.dai);
  const supplyAPY = Number(rates[0]) / 1e18 * 100;
  const borrowAPY = Number(rates[1]) / 1e18 * 100;
  
  console.log("DAI Supply APY:", supplyAPY.toFixed(2) + "%");
  console.log("DAI Borrow APY:", borrowAPY.toFixed(2) + "%");
  
  console.log("\n" + "=".repeat(60));
  console.log("TEST 6: User1 repays 500 DAI");
  console.log("=".repeat(60));
  
  await dai.connect(user1).approve(addresses.lendingPool, hre.ethers.parseEther("500"));
  await lendingPool.connect(user1).repay(addresses.dai, hre.ethers.parseEther("500"));
  
  const [, remainingBorrow] = await lendingPool.getUserBalance(user1.address, addresses.dai);
  console.log("Remaining borrow:", hre.ethers.formatEther(remainingBorrow), "DAI");
  
  healthFactor = await lendingPool.getHealthFactor(user1.address);
  console.log("New Health Factor:", hre.ethers.formatEther(healthFactor));
  
  console.log("\n" + "=".repeat(60));
  console.log("TEST 7: User1 withdraws 1,000 USDC");
  console.log("=".repeat(60));
  
  await lendingPool.connect(user1).withdraw(addresses.usdc, 1000e6);
  
  const [finalDeposit] = await lendingPool.getUserBalance(user1.address, addresses.usdc);
  console.log("Remaining deposit:", Number(finalDeposit) / 1e6, "USDC");
  
  healthFactor = await lendingPool.getHealthFactor(user1.address);
  console.log("Final Health Factor:", hre.ethers.formatEther(healthFactor));
  
  console.log("\n" + "=".repeat(60));
  console.log("FINAL SUMMARY");
  console.log("=".repeat(60));
  
  const [user1Deposit, user1Borrow] = await lendingPool.getUserBalance(user1.address, addresses.usdc);
  const [user1DepositDAI, user1BorrowDAI] = await lendingPool.getUserBalance(user1.address, addresses.dai);
  
  console.log("\nUser1:");
  console.log("  USDC Deposit:", Number(user1Deposit) / 1e6, "USDC");
  console.log("  DAI Borrow:", hre.ethers.formatEther(user1BorrowDAI), "DAI");
  console.log("  Health Factor:", hre.ethers.formatEther(await lendingPool.getHealthFactor(user1.address)));
  
  const [user2DepositDAI] = await lendingPool.getUserBalance(user2.address, addresses.dai);
  console.log("\nUser2:");
  console.log("  DAI Deposit:", hre.ethers.formatEther(user2DepositDAI), "DAI");
  
  console.log("\n" + "=".repeat(60));
  console.log("All Tests Passed");
  console.log("=".repeat(60));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\nTest failed:");
    console.error(error.message);
    process.exit(1);
  });