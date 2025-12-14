const hre = require("hardhat");

async function main() {
  console.log("🚀 KRYPTO Token deploy ediliyor...\n");

  // Initial supply: 1,000,000 KRP
  const initialSupply = 1000000;

  const KryptoToken = await hre.ethers.getContractFactory("KryptoToken");
  const token = await KryptoToken.deploy(initialSupply);

  await token.waitForDeployment();

  const address = await token.getAddress();

  console.log("✅ KRYPTO Token deploy edildi!");
  console.log("📍 Kontrat Adresi:", address);
  console.log("🪙 Initial Supply:", initialSupply, "KRP");
  console.log("\n📋 Bu adresi krypto-token-dapp.html dosyasına yapıştırın!\n");

  // Bilgileri göster
  const [deployer] = await hre.ethers.getSigners();
  console.log("👤 Owner:", deployer.address);
  
  const balance = await token.balanceOf(deployer.address);
  console.log("💰 Owner Bakiye:", hre.ethers.formatEther(balance), "KRP\n");

  console.log("🔍 Etherscan'de görüntülemek için:");
  console.log(`https://sepolia.etherscan.io/address/${address}\n`);

  console.log("✨ Verify komutu (isteğe bağlı):");
  console.log(`npx hardhat verify --network sepolia ${address} ${initialSupply}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });