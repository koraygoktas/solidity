import { ethers } from "hardhat";
import * as readline from "readline";

// Kullanıcıdan input almak için
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(query, resolve);
  });
}

async function main() {
  console.log("\n🏦 ===== InterestBank Manuel Test =====\n");

  // Contract'ı deploy et
  console.log("📝 Contract deploy ediliyor...");
  const InterestBank = await ethers.getContractFactory("InterestBank");
  const interestBank = await InterestBank.deploy();
  await interestBank.waitForDeployment();
  
  const address = await interestBank.getAddress();
  console.log("✅ InterestBank deployed:", address);
  console.log("💰 Yıllık Faiz Oranı: %5\n");

  const [owner] = await ethers.getSigners();
  
  // Kullanıcıdan yatırılacak miktarı al
  const depositAmountStr = await question("💵 Ne kadar ETH yatırmak istiyorsunuz? (örn: 1.5): ");
  const depositAmount = ethers.parseEther(depositAmountStr);
  
  console.log(`\n💳 ${depositAmountStr} ETH yatırılıyor...`);
  const depositTx = await interestBank.deposit({ value: depositAmount });
  await depositTx.wait();
  console.log("✅ Para yatırıldı!");
  
  const balance = await interestBank.getBalance(owner.address);
  console.log(`📊 Mevcut Bakiye: ${ethers.formatEther(balance)} ETH\n`);

  // Kullanıcıdan vade süresini al
  const daysStr = await question("📅 Kaç gün beklemek istiyorsunuz? (örn: 365, 180, 30): ");
  const days = parseInt(daysStr);
  
  console.log(`\n⏰ ${days} gün ileri sarılıyor (simülasyon)...`);
  
  // Zamanı ilerlet (Hardhat network'te)
  const { time } = await import("@nomicfoundation/hardhat-network-helpers");
  await time.increase(days * 24 * 60 * 60);
  
  console.log("✅ Zaman ilerledi!\n");

  // Faiz hesapla
  const interest = await interestBank.calculateInterest(owner.address);
  const interestInEth = ethers.formatEther(interest);
  
  console.log("📈 ===== Sonuçlar =====");
  console.log(`💰 Yatırılan Miktar: ${depositAmountStr} ETH`);
  console.log(`📅 Vade Süresi: ${days} gün`);
  console.log(`💸 Kazanılan Faiz: ${interestInEth} ETH`);
  
  const totalBalance = await interestBank.getBalance(owner.address);
  const totalAfterInterest = parseFloat(ethers.formatEther(totalBalance)) + parseFloat(interestInEth);
  console.log(`💵 Toplam (Ana Para + Faiz): ${totalAfterInterest.toFixed(6)} ETH`);
  
  // Faiz yüzdesini hesapla
  const interestPercentage = (parseFloat(interestInEth) / parseFloat(depositAmountStr)) * 100;
  console.log(`📊 Kazanç Oranı: %${interestPercentage.toFixed(4)}`);
  
  // Yıllık faize normalize et
  const yearlyRate = (interestPercentage / days) * 365;
  console.log(`📈 Yıllık Eşdeğer Oran: %${yearlyRate.toFixed(2)}`);
  
  console.log("\n======================\n");

  // Faizi talep etmek istiyor mu?
  const claimAnswer = await question("💰 Faizi talep etmek ister misiniz? (evet/hayır): ");
  
  if (claimAnswer.toLowerCase() === "evet" || claimAnswer.toLowerCase() === "e") {
    console.log("\n💸 Faiz talep ediliyor...");
    const claimTx = await interestBank.claimInterest();
    await claimTx.wait();
    console.log("✅ Faiz başarıyla hesabınıza eklendi!");
    
    const finalBalance = await interestBank.getBalance(owner.address);
    console.log(`📊 Güncel Bakiye: ${ethers.formatEther(finalBalance)} ETH`);
    
    const totalEarned = await interestBank.getTotalInterestEarned(owner.address);
    console.log(`💵 Toplam Kazanılan Faiz: ${ethers.formatEther(totalEarned)} ETH\n`);
  } else {
    console.log("\n👍 Faiz talep edilmedi. Bakiyenizde bekliyor.\n");
  }

  rl.close();
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
  rl.close();
});