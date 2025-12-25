const hre = require("hardhat");

async function main() {
  // CONTRACT ADRESİNİ BURAYA YAPIŞTIR
  const CONTRACT_ADDRESS = "0xA24B0f8521bbE3e576bCff84e874E702AF16DF0d";
  
  // METADATA URI
  const METADATA_URI = "ipfs://bafkreiba6xobhl62ynei5ohw25ilx6mx43fjmtjewrl3uldjin6yo4jhfm";
  
  console.log("🎨 NFT minting başlıyor...\n");
  
  const [signer] = await hre.ethers.getSigners();
  console.log("📍 Mint edilen adres:", signer.address);
  console.log("🔗 Metadata URI:", METADATA_URI);
  
  // Contract ABI
  const abi = [
    "function mint(address to, string memory uri) public returns (uint256)",
    "function totalSupply() public view returns (uint256)"
  ];
  
  // Contract'a bağlan (NEW yöntemi - attach değil!)
  const nft = new hre.ethers.Contract(CONTRACT_ADDRESS, abi, signer);
  
  console.log("✅ Contract'a bağlandı:", CONTRACT_ADDRESS, "\n");
  
  // Mint
  console.log("⏳ NFT mint ediliyor...");
  const tx = await nft.mint(signer.address, METADATA_URI);
  console.log("📤 TX:", tx.hash);
  
  console.log("⏳ Mining...");
  await tx.wait();
  console.log("✅ Confirmed!\n");
  
  const tokenId = (await nft.totalSupply()) - 1n;
  
  console.log("🎉 NFT MINT EDİLDİ!");
  console.log("━━━━━━━━━━━━━━━━━━━━");
  console.log("Token ID:", tokenId.toString());
  console.log("\n🌊 OpenSea:");
  console.log(`https://testnets.opensea.io/assets/sepolia/${CONTRACT_ADDRESS}/${tokenId}\n`);
}

main().catch(console.error);