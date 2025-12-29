const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying with:", deployer.address);

  // Token deploy (gas limiti kaldır)
  const Token = await ethers.getContractFactory("GovernanceToken");
  const token = await Token.deploy(ethers.parseEther("1000000"));
  await token.waitForDeployment();
  console.log("Token:", await token.getAddress());

  // DAO deploy (gas limiti kaldır)
  const DAO = await ethers.getContractFactory("DAOGovernance");
  const dao = await DAO.deploy(await token.getAddress());
  await dao.waitForDeployment();
  console.log("DAO:", await dao.getAddress());

  // Delegate
  await token.delegate(deployer.address);
  console.log("Voting power activated!");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});