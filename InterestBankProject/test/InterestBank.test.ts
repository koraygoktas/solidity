import { expect } from "chai";
import { ethers } from "hardhat";
import { time } from "@nomicfoundation/hardhat-network-helpers";
import { InterestBank } from "../typechain-types";

describe("InterestBank", function () {
  
  it("Should deploy with correct interest rate", async function () {
    const InterestBank = await ethers.getContractFactory("InterestBank");
    const interestBank = await InterestBank.deploy();
    await interestBank.waitForDeployment();
    
    const rate = await interestBank.ANNUAL_INTEREST_RATE();
    expect(rate).to.equal(500); // %5
  });

  it("Should deposit ETH correctly", async function () {
    const InterestBank = await ethers.getContractFactory("InterestBank");
    const interestBank = await InterestBank.deploy();
    await interestBank.waitForDeployment();
    
    const [owner] = await ethers.getSigners();
    
    await interestBank.deposit({ value: ethers.parseEther("1.0") });
    
    const balance = await interestBank.getBalance(owner.address);
    expect(balance).to.equal(ethers.parseEther("1.0"));
  });

  it("Should calculate interest correctly after 1 year", async function () {
    const InterestBank = await ethers.getContractFactory("InterestBank");
    const interestBank = await InterestBank.deploy();
    await interestBank.waitForDeployment();
    
    const [owner] = await ethers.getSigners();
    
    // 1 ETH yatır
    await interestBank.deposit({ value: ethers.parseEther("1.0") });
    
    // 1 yıl ilerlet
    await time.increase(365 * 24 * 60 * 60); // 1 yıl
    
    // Faiz hesapla
    const interest = await interestBank.calculateInterest(owner.address);
    
    // %5 faiz = 0.05 ETH olmalı
    const expectedInterest = ethers.parseEther("0.05");
    
    // Küçük bir tolerans ile kontrol (gas maliyetleri için)
    const tolerance = ethers.parseEther("0.0001");
    expect(interest).to.be.closeTo(expectedInterest, tolerance);
  });

  it("Should claim interest correctly", async function () {
    const InterestBank = await ethers.getContractFactory("InterestBank");
    const interestBank = await InterestBank.deploy();
    await interestBank.waitForDeployment();
    
    const [owner] = await ethers.getSigners();
    
    await interestBank.deposit({ value: ethers.parseEther("1.0") });
    
    // 1 yıl ilerlet
    await time.increase(365 * 24 * 60 * 60);
    
    // Faiz talep et
    await interestBank.claimInterest();
    
    const balance = await interestBank.getBalance(owner.address);
    const expectedBalance = ethers.parseEther("1.05"); // 1 + 0.05
    
    const tolerance = ethers.parseEther("0.0001");
    expect(balance).to.be.closeTo(expectedBalance, tolerance);
  });

  it("Should calculate interest for partial year", async function () {
    const InterestBank = await ethers.getContractFactory("InterestBank");
    const interestBank = await InterestBank.deploy();
    await interestBank.waitForDeployment();
    
    const [owner] = await ethers.getSigners();
    
    await interestBank.deposit({ value: ethers.parseEther("1.0") });
    
    // 6 ay ilerlet (365/2 gün)
    await time.increase(182.5 * 24 * 60 * 60);
    
    const interest = await interestBank.calculateInterest(owner.address);
    
    // %5'in yarısı = 0.025 ETH olmalı
    const expectedInterest = ethers.parseEther("0.025");
    const tolerance = ethers.parseEther("0.001");
    
    expect(interest).to.be.closeTo(expectedInterest, tolerance);
  });

  it("Should withdraw with accumulated interest", async function () {
    const InterestBank = await ethers.getContractFactory("InterestBank");
    const interestBank = await InterestBank.deploy();
    await interestBank.waitForDeployment();
    
    const [owner] = await ethers.getSigners();
    
    await interestBank.deposit({ value: ethers.parseEther("2.0") });
    
    // 1 yıl ilerlet
    await time.increase(365 * 24 * 60 * 60);
    
    const initialBalance = await ethers.provider.getBalance(owner.address);
    
    // 1 ETH çek (faiz otomatik eklenecek)
    const tx = await interestBank.withdraw(ethers.parseEther("1.0"));
    const receipt = await tx.wait();
    const gasUsed = receipt!.gasUsed * receipt!.gasPrice;
    
    const finalBalance = await ethers.provider.getBalance(owner.address);
    const contractBalance = await interestBank.getBalance(owner.address);
    
    // Kontrat bakiyesi: 2 + 0.1 (faiz) - 1 (çekilen) = 1.1 ETH olmalı
    const expectedContractBalance = ethers.parseEther("1.1");
    const tolerance = ethers.parseEther("0.001");
    
    expect(contractBalance).to.be.closeTo(expectedContractBalance, tolerance);
  });

  it("Should track total interest earned", async function () {
    const InterestBank = await ethers.getContractFactory("InterestBank");
    const interestBank = await InterestBank.deploy();
    await interestBank.waitForDeployment();
    
    const [owner] = await ethers.getSigners();
    
    await interestBank.deposit({ value: ethers.parseEther("1.0") });
    
    // 1 yıl ilerlet
    await time.increase(365 * 24 * 60 * 60);
    
    await interestBank.claimInterest();
    
    const totalEarned = await interestBank.getTotalInterestEarned(owner.address);
    const expectedEarned = ethers.parseEther("0.05");
    const tolerance = ethers.parseEther("0.0001");
    
    expect(totalEarned).to.be.closeTo(expectedEarned, tolerance);
  });

  it("Should handle multiple users independently", async function () {
    const InterestBank = await ethers.getContractFactory("InterestBank");
    const interestBank = await InterestBank.deploy();
    await interestBank.waitForDeployment();
    
    const [owner, user1, user2] = await ethers.getSigners();
    
    // User1 1 ETH yatırır
    await interestBank.connect(user1).deposit({ value: ethers.parseEther("1.0") });
    
    // 6 ay geçer
    await time.increase(182.5 * 24 * 60 * 60);
    
    // User2 2 ETH yatırır
    await interestBank.connect(user2).deposit({ value: ethers.parseEther("2.0") });
    
    // 6 ay daha geçer
    await time.increase(182.5 * 24 * 60 * 60);
    
    // User1'in 1 yıllık faizi olmalı (~0.05 ETH)
    const interest1 = await interestBank.calculateInterest(user1.address);
    const expectedInterest1 = ethers.parseEther("0.05");
    
    // User2'nin 6 aylık faizi olmalı (~0.05 ETH çünkü 2 ETH * %5 * 0.5)
    const interest2 = await interestBank.calculateInterest(user2.address);
    const expectedInterest2 = ethers.parseEther("0.05");
    
    const tolerance = ethers.parseEther("0.001");
    expect(interest1).to.be.closeTo(expectedInterest1, tolerance);
    expect(interest2).to.be.closeTo(expectedInterest2, tolerance);
  });

  it("Should emit InterestClaimed event", async function () {
    const InterestBank = await ethers.getContractFactory("InterestBank");
    const interestBank = await InterestBank.deploy();
    await interestBank.waitForDeployment();
    
    const [owner] = await ethers.getSigners();
    
    await interestBank.deposit({ value: ethers.parseEther("1.0") });
    await time.increase(365 * 24 * 60 * 60);
    
    const expectedInterest = await interestBank.calculateInterest(owner.address);
    
    await expect(interestBank.claimInterest())
      .to.emit(interestBank, "InterestClaimed");
    
    // Event parametrelerini ayrı kontrol et
    const events = await interestBank.queryFilter(interestBank.filters.InterestClaimed());
    expect(events[0].args[0]).to.equal(owner.address);
    
    // Faiz miktarı için tolerans ekle
    const actualInterest = events[0].args[1];
    const tolerance = ethers.parseEther("0.0001");
    expect(actualInterest).to.be.closeTo(expectedInterest, tolerance);
  });

  it("Should reject claiming interest with zero balance", async function () {
    const InterestBank = await ethers.getContractFactory("InterestBank");
    const interestBank = await InterestBank.deploy();
    await interestBank.waitForDeployment();
    
    await expect(
      interestBank.claimInterest()
    ).to.be.revertedWith("no balance to earn interest");
  });

  it("Should get complete account info", async function () {
    const InterestBank = await ethers.getContractFactory("InterestBank");
    const interestBank = await InterestBank.deploy();
    await interestBank.waitForDeployment();
    
    const [owner] = await ethers.getSigners();
    
    await interestBank.deposit({ value: ethers.parseEther("1.0") });
    await time.increase(365 * 24 * 60 * 60);
    
    const accountInfo = await interestBank.getAccountInfo(owner.address);
    
    expect(accountInfo[0]).to.equal(ethers.parseEther("1.0")); // balance
    expect(accountInfo[1]).to.be.gt(0); // pendingInterest
    expect(accountInfo[2]).to.equal(0); // totalInterestEarned (henüz claim edilmedi)
    expect(accountInfo[3]).to.be.gt(0); // lastInterestTime
  });
});