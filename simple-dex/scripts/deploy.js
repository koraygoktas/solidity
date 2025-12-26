const hre = require("hardhat");

async function main() {
  console.log("🚀 Deployment başlıyor...\n");

  const [deployer] = await hre.ethers.getSigners();
  console.log("📝 Deploy eden adres:", deployer.address);
  
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Bakiye:", hre.ethers.formatEther(balance), "ETH\n");

  // 1. KryptoToken deploy et (veya mevcut adresi kullan)
  console.log("📦 KryptoToken deploy ediliyor...");
  
  const KryptoToken = await hre.ethers.getContractFactory("contracts/mocks/MockERC20.sol:MockERC20");
  const token = await KryptoToken.deploy(
    "KryptoToken",
    "KRP",
    hre.ethers.parseEther("1000000") // 1 million KRP
  );
  
  await token.waitForDeployment();
  const tokenAddress = await token.getAddress();
  console.log("✅ KryptoToken deployed:", tokenAddress, "\n");

  // 2. SimpleSwap deploy et
  console.log("📦 SimpleSwap deploy ediliyor...");
  
  const SimpleSwap = await hre.ethers.getContractFactory("SimpleSwap");
  const simpleSwap = await SimpleSwap.deploy(tokenAddress);
  
  await simpleSwap.waitForDeployment();
  const swapAddress = await simpleSwap.getAddress();
  console.log("✅ SimpleSwap deployed:", swapAddress, "\n");

  // 3. Özet
  console.log("═══════════════════════════════════════");
  console.log("🎉 DEPLOYMENT TAMAMLANDI!");
  console.log("═══════════════════════════════════════");
  console.log("KryptoToken:", tokenAddress);
  console.log("SimpleSwap:", swapAddress);
  console.log("═══════════════════════════════════════\n");

  // 4. Verify için komutlar
  console.log("🔍 Verify komutları:");
  console.log(`npx hardhat verify --network sepolia ${tokenAddress} "KryptoToken" "KRP" "1000000000000000000000000"`);
  console.log(`npx hardhat verify --network sepolia ${swapAddress} ${tokenAddress}`);
  console.log("\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });