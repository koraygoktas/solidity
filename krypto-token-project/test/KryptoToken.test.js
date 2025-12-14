const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("KryptoToken", function () {
  let token;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    [owner, addr1, addr2] = await ethers.getSigners();
    
    const KryptoToken = await ethers.getContractFactory("KryptoToken");
    token = await KryptoToken.deploy(1000000);
    await token.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Doğru isim ve sembol olmalı", async function () {
      expect(await token.name()).to.equal("Krypto");
      expect(await token.symbol()).to.equal("KRP");
    });

    it("Owner'a initial supply verilmeli", async function () {
      const ownerBalance = await token.balanceOf(owner.address);
      expect(await token.totalSupply()).to.equal(ownerBalance);
    });
  });

  describe("Transfer", function () {
    it("Token transferi yapılabilmeli", async function () {
      const amount = ethers.parseEther("100");
      await token.transfer(addr1.address, amount);
      expect(await token.balanceOf(addr1.address)).to.equal(amount);
    });

    it("Yetersiz bakiyede hata vermeli", async function () {
      await expect(
        token.connect(addr1).transfer(owner.address, ethers.parseEther("1"))
      ).to.be.revertedWith("Yetersiz bakiye");
    });
  });

  describe("Burn", function () {
    it("Token yakılabilmeli", async function () {
      const burnAmount = ethers.parseEther("1000");
      const initialSupply = await token.totalSupply();
      
      await token.burn(burnAmount);
      
      expect(await token.totalSupply()).to.equal(initialSupply - burnAmount);
    });
  });
});