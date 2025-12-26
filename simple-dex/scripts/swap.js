const hre = require("hardhat");

async function main() {
  const TOKEN_ADDRESS = "0xf468c54C926b216a279362e09E966e958b9f8981";
  const SWAP_ADDRESS = "0xfb8A0B3e7b55Fe84C55A2731Dcb22008e55D8be3";

  console.log("🔄 Swap işlemi başlıyor...\n");

  const [signer] = await hre.ethers.getSigners();
  const simpleSwap = await hre.ethers.getContractAt("SimpleSwap", SWAP_ADDRESS);
  const token = await hre.ethers.getContractAt("contracts/mocks/MockERC20.sol:MockERC20", TOKEN_ADDRESS);

  // ETH → KRP swap
  const ethAmount = hre.ethers.parseEther("0.01"); // 0.01 ETH
  
  console.log("📊 Swap: 0.01 ETH → KRP");
  
  const balanceBefore = await token.balanceOf(signer.address);
  
  const swapTx = await simpleSwap.swapETHForToken(0, {
    value: ethAmount
  });
  
  await swapTx.wait();
  
  const balanceAfter = await token.balanceOf(signer.address);
  const received = balanceAfter - balanceBefore;

  console.log("✅ Swap tamamlandı!");
  console.log("Alınan KRP:", hre.ethers.formatEther(received), "\n");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });