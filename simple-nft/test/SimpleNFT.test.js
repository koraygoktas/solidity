const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("SimpleNFT", function () {
  let nft;
  let owner;
  let addr1;
  let addr2;
  
  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    
    const SimpleNFT = await ethers.getContractFactory("SimpleNFT");
    nft = await SimpleNFT.deploy();
    await nft.waitForDeployment();
  });
  
  describe("Deployment", function () {
    it("Should set the correct name and symbol", async function () {
      expect(await nft.name()).to.equal("SimpleNFT");
      expect(await nft.symbol()).to.equal("SNFT");
    });
    
    it("Should set the correct owner", async function () {
      expect(await nft.owner()).to.equal(owner.address);
    });
    
    it("Should start with 0 total supply", async function () {
      expect(await nft.totalSupply()).to.equal(0);
    });
  });
  
  describe("Minting", function () {
    it("Should mint NFT correctly", async function () {
      const tokenURI = "ipfs://QmTest123";
      
      await nft.mint(addr1.address, tokenURI);
      
      expect(await nft.ownerOf(0)).to.equal(addr1.address);
      expect(await nft.tokenURI(0)).to.equal(tokenURI);
      expect(await nft.balanceOf(addr1.address)).to.equal(1);
      expect(await nft.totalSupply()).to.equal(1);
    });
    
    it("Should emit NFTMinted event", async function () {
      const tokenURI = "ipfs://QmTest123";
      
      await expect(nft.mint(addr1.address, tokenURI))
        .to.emit(nft, "NFTMinted")
        .withArgs(addr1.address, 0, tokenURI);
    });
    
    it("Should mint multiple NFTs", async function () {
      await nft.mint(addr1.address, "ipfs://QmTest1");
      await nft.mint(addr1.address, "ipfs://QmTest2");
      await nft.mint(addr2.address, "ipfs://QmTest3");
      
      expect(await nft.balanceOf(addr1.address)).to.equal(2);
      expect(await nft.balanceOf(addr2.address)).to.equal(1);
      expect(await nft.totalSupply()).to.equal(3);
    });
  });
  
  describe("Transfer", function () {
    beforeEach(async function () {
      await nft.mint(addr1.address, "ipfs://QmTest123");
    });
    
    it("Should transfer NFT correctly", async function () {
      await nft.connect(addr1).transferNFT(addr2.address, 0);
      
      expect(await nft.ownerOf(0)).to.equal(addr2.address);
      expect(await nft.balanceOf(addr1.address)).to.equal(0);
      expect(await nft.balanceOf(addr2.address)).to.equal(1);
    });
    
    it("Should emit NFTTransferred event", async function () {
      await expect(nft.connect(addr1).transferNFT(addr2.address, 0))
        .to.emit(nft, "NFTTransferred")
        .withArgs(addr1.address, addr2.address, 0);
    });
    
    it("Should fail if not owner", async function () {
      await expect(
        nft.connect(addr2).transferNFT(addr2.address, 0)
      ).to.be.revertedWith("You don't own this NFT");
    });
  });
  
  describe("TokensOfOwner", function () {
    it("Should return all tokens of owner", async function () {
      await nft.mint(addr1.address, "ipfs://QmTest1");
      await nft.mint(addr1.address, "ipfs://QmTest2");
      await nft.mint(addr2.address, "ipfs://QmTest3");
      await nft.mint(addr1.address, "ipfs://QmTest4");
      
      const tokens = await nft.tokensOfOwner(addr1.address);
      
      expect(tokens.length).to.equal(3);
      expect(tokens[0]).to.equal(0);
      expect(tokens[1]).to.equal(1);
      expect(tokens[2]).to.equal(3);
    });
    
    it("Should return empty array for address with no tokens", async function () {
      const tokens = await nft.tokensOfOwner(addr1.address);
      expect(tokens.length).to.equal(0);
    });
  });
});