const hre = require("hardhat");

async function main() {
  console.log("🚀 Deploying SimpleNFT contract...");
  
  // Get deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("📝 Deploying with account:", deployer.address);
  
  // Get balance
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", hre.ethers.formatEther(balance), "ETH");
  
  // Deploy contract
  const SimpleNFT = await hre.ethers.getContractFactory("SimpleNFT");
  const nft = await SimpleNFT.deploy();
  
  await nft.waitForDeployment();
  const address = await nft.getAddress();
  
  console.log("\n✅ SimpleNFT deployed to:", address);
  console.log("\n📋 Save this address for frontend!");
  console.log("Contract Address:", address);
  
  console.log("\n📋 Verification command:");
  console.log(`npx hardhat verify --network sepolia ${address}`);
  
  // Mint first NFT (optional)
  console.log("\n🎨 Minting first NFT...");
  const tx = await nft.mint(
    deployer.address,
    "ipfs://QmExample123456789abcdef" // Örnek IPFS URI
  );
  await tx.wait();
  console.log("✅ First NFT minted to:", deployer.address);
  
  const totalSupply = await nft.totalSupply();
  console.log("📊 Total Supply:", totalSupply.toString());
}

main()
  .then(function() {
    process.exit(0);
  })
  .catch(function(error) {
    console.error(error);
    process.exit(1);
  });