async function main(){
    const [deployer] = await ethers.getSigners();
    console.log("deploying with : ",deployer.address);

    const Token = await ethers.getContractFactory("GovernanceToken");
    const token = await Token.deploy(ethers.parseEther("1000000"));
    await token.waitForDeployment();
    console.log("Token:",await token.getAddress());

    const DAO = await ethers.getContractFactory("DAOGovernance");
    const dao = await DAO.deploy(await token.getAddress());
    await dao.waitForDeployment();
    console.log("DAO :",await dao.getAddress());

    await token.delegate(deployer.address);
    console.log("voting power activated!");
}

main().catch((error)=>{
    console.error(error);
    process.exitCode=1;
});