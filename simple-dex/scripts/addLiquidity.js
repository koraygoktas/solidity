const hre = require("hardhat");

async function main() {
  // Adresleri buraya yapıştır (deploy'dan sonra)
  const TOKEN_ADDRESS = "0xf468c54C926b216a279362e09E966e958b9f8981";
  const SWAP_ADDRESS = "0xfb8A0B3e7b55Fe84C55A2731Dcb22008e55D8be3";

  console.log("💧 Liquidity ekleniyor...\n");

  const [signer] = await hre.ethers.getSigners();
  
  // Contract'lara bağlan
  const token = await hre.ethers.getContractAt("contracts/mocks/MockERC20.sol:MockERC20", TOKEN_ADDRESS);
  const simpleSwap = await hre.ethers.getContractAt("SimpleSwap", SWAP_ADDRESS);

  // Miktar belirle
  const ethAmount = hre.ethers.parseEther("0.01"); // 0.01 ETH
  const tokenAmount = hre.ethers.parseEther("20"); // 20 KRP

  console.log("📊 Eklenecek miktar:");
  console.log("ETH:", hre.ethers.formatEther(ethAmount));
  console.log("KRP:", hre.ethers.formatEther(tokenAmount), "\n");

  // Token'ı approve et
  console.log("✅ Token approve ediliyor...");
  const approveTx = await token.approve(SWAP_ADDRESS, tokenAmount);
  await approveTx.wait();
  console.log("✅ Approve tamamlandı!\n");

  // Liquidity ekle
  console.log("💧 Liquidity ekleniyor...");
  const addTx = await simpleSwap.addLiquidity(tokenAmount, {
    value: ethAmount
  });
  
  const receipt = await addTx.wait();
  console.log("✅ Liquidity eklendi!");
  console.log("TX Hash:", receipt.hash, "\n");

  // Pool durumunu göster
  const reserveETH = await simpleSwap.reserveETH();
  const reserveToken = await simpleSwap.reserveToken();
  const shares = await simpleSwap.liquidityShares(signer.address);

  console.log("═══════════════════════════════════════");
  console.log("📊 POOL DURUMU:");
  console.log("═══════════════════════════════════════");
  console.log("Reserve ETH:", hre.ethers.formatEther(reserveETH));
  console.log("Reserve KRP:", hre.ethers.formatEther(reserveToken));
  console.log("Your LP Shares:", hre.ethers.formatEther(shares));
  console.log("═══════════════════════════════════════\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });