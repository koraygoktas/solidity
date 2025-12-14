import { ethers } from "hardhat";

async function main() {
  console.log("\n🚀 ===== InterestBank Deploy Başlıyor =====\n");
  
  // Deploy eden hesabın bilgilerini göster
  const [deployer] = await ethers.getSigners();
  console.log("📍 Deploy eden adres:", deployer.address);
  
  // Bakiyeyi kontrol et
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Hesap bakiyesi:", ethers.formatEther(balance), "ETH");
  
  // Network bilgisini göster
  const network = await ethers.provider.getNetwork();
  console.log("🌐 Network:", network.name, "(Chain ID:", network.chainId.toString() + ")");
  console.log("");
  
  // Minimum bakiye kontrolü
  if (balance < ethers.parseEther("0.01")) {
    console.log("⚠️  UYARI: Bakiyeniz düşük! Deploy için minimum 0.01 ETH gerekir.");
    console.log("💡 Test ETH almak için: https://sepoliafaucet.com/\n");
    process.exit(1);
  }
  
  console.log("⏳ Contract deploy ediliyor...");
  
  const InterestBank = await ethers.getContractFactory("InterestBank");
  const interestBank = await InterestBank.deploy();
  
  console.log("⛏️  Transaction gönderildi, mining bekleniyor...");
  await interestBank.waitForDeployment();

  const address = await interestBank.getAddress();
  
  console.log("\n✅ Deploy başarılı!\n");
  console.log("📍 Contract Adresi:", address);
  
  // Contract bilgilerini göster
  const annualRate = await interestBank.ANNUAL_INTEREST_RATE();
  const denominator = await interestBank.RATE_DENOMINATOR();
  const actualRate = (Number(annualRate) / Number(denominator)) * 100;
  
  console.log("\n📊 ===== Contract Bilgileri =====");
  console.log("💹 Yıllık Faiz Oranı:", actualRate + "%");
  console.log("🔢 Rate Denominator:", denominator.toString());
  console.log("📅 Saniye/Yıl:", (await interestBank.SECONDS_PER_YEAR()).toString());
  console.log("================================\n");
  
  // Network'e göre explorer linkini göster
  if (network.chainId === 11155111n) { // Sepolia
    console.log("🔗 Sepolia Etherscan'de Görüntüle:");
    console.log(`   https://sepolia.etherscan.io/address/${address}\n`);
  } else if (network.chainId === 1n) { // Mainnet
    console.log("🔗 Etherscan'de Görüntüle:");
    console.log(`   https://etherscan.io/address/${address}\n`);
  } else if (network.chainId === 31337n) { // Local Hardhat
    console.log("💻 Local Hardhat Network'te deploy edildi\n");
  }
  
  console.log("💡 Bu adresi kaydedin! Etkileşim için gerekecek.");
  console.log("✨ Deploy tamamlandı!\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("\n❌ Deploy Hatası:", error.message);
    process.exitCode = 1;
  })