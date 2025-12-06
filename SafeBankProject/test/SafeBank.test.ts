import { expect } from "chai";
import { ethers } from "hardhat";

describe("SafeBank", function () {
  
  it("Should deposit ETH correctly", async function () {
    const SafeBank = await ethers.getContractFactory("SafeBank");
    const safeBank = await SafeBank.deploy();
    await safeBank.waitForDeployment();
    
    const [owner] = await ethers.getSigners();
    
    await safeBank.deposit({ value: ethers.parseEther("1.0") });
    
    const balance = await safeBank.getBalance(owner.address);
    expect(balance).to.equal(ethers.parseEther("1.0"));
  });

  it("Should withdraw ETH correctly", async function () {
    const SafeBank = await ethers.getContractFactory("SafeBank");
    const safeBank = await SafeBank.deploy();
    await safeBank.waitForDeployment();
    
    const [owner] = await ethers.getSigners();
    
    await safeBank.deposit({ value: ethers.parseEther("2.0") });
    await safeBank.withdraw(ethers.parseEther("1.0"));
    
    const balance = await safeBank.getBalance(owner.address);
    expect(balance).to.equal(ethers.parseEther("1.0"));
  });

  it("Should reject zero deposit", async function () {
    const SafeBank = await ethers.getContractFactory("SafeBank");
    const safeBank = await SafeBank.deploy();
    await safeBank.waitForDeployment();
    
    await expect(
      safeBank.deposit({ value: 0 })
    ).to.be.revertedWith("amount must be > 0");
  });

  it("Should reject insufficient balance withdrawal", async function () {
    const SafeBank = await ethers.getContractFactory("SafeBank");
    const safeBank = await SafeBank.deploy();
    await safeBank.waitForDeployment();
    
    await safeBank.deposit({ value: ethers.parseEther("1.0") });
    
    await expect(
      safeBank.withdraw(ethers.parseEther("5.0"))
    ).to.be.revertedWith("insufficient balance");
  });

  // YENİ TEST BURAYA EKLENDİ ↓
  it("Should handle multiple users independently", async function () {
    const SafeBank = await ethers.getContractFactory("SafeBank");
    const safeBank = await SafeBank.deploy();
    await safeBank.waitForDeployment();
    
    const [owner, user1, user2] = await ethers.getSigners();
    
    // User1 para yatırır
    await safeBank.connect(user1).deposit({ value: ethers.parseEther("1.0") });
    
    // User2 para yatırır
    await safeBank.connect(user2).deposit({ value: ethers.parseEther("2.0") });
    
    // Her kullanıcının bakiyesi ayrı olmalı
    expect(await safeBank.getBalance(user1.address)).to.equal(ethers.parseEther("1.0"));
    expect(await safeBank.getBalance(user2.address)).to.equal(ethers.parseEther("2.0"));
  });

  // İsterseniz daha fazla test ekleyebilirsiniz ↓
  it("Should emit Deposit event", async function () {
    const SafeBank = await ethers.getContractFactory("SafeBank");
    const safeBank = await SafeBank.deploy();
    await safeBank.waitForDeployment();
    
    const [owner] = await ethers.getSigners();
    const depositAmount = ethers.parseEther("0.5");
    
    await expect(safeBank.deposit({ value: depositAmount }))
      .to.emit(safeBank, "Deposit")
      .withArgs(owner.address, depositAmount);
  });

  it("Should emit Withdraw event", async function () {
    const SafeBank = await ethers.getContractFactory("SafeBank");
    const safeBank = await SafeBank.deploy();
    await safeBank.waitForDeployment();
    
    const [owner] = await ethers.getSigners();
    
    await safeBank.deposit({ value: ethers.parseEther("2.0") });
    
    const withdrawAmount = ethers.parseEther("1.0");
    await expect(safeBank.withdraw(withdrawAmount))
      .to.emit(safeBank, "Withdraw")
      .withArgs(owner.address, withdrawAmount);
  });
});