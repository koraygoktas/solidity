import { expect } from "chai";
import { network } from "hardhat";
import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";

const { ethers } = await network.getOrCreate();

// Kontrattaki hash mantığıyla birebir aynı olmalı:
// keccak256(keccak256(abi.encode(address, amount)))
function hashLeaf(address, amount) {
  const abiCoder = ethers.AbiCoder.defaultAbiCoder();
  const inner = ethers.keccak256(
    abiCoder.encode(["address", "uint256"], [address, amount])
  );
  return Buffer.from(ethers.keccak256(inner).slice(2), "hex");
}

describe("MerkleAirdrop", function () {
  let token, airdrop, owner, alice, bob, mallory;
  let tree, whitelist;

  beforeEach(async function () {
    [owner, alice, bob, mallory] = await ethers.getSigners();

    whitelist = [
      { address: alice.address, amount: ethers.parseEther("1000") },
      { address: bob.address, amount: ethers.parseEther("500") },
    ];

    const leaves = whitelist.map((e) => hashLeaf(e.address, e.amount));
    tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
    const merkleRoot = tree.getHexRoot();

    const Token = await ethers.getContractFactory("MockERC20");
    token = await Token.deploy(ethers.parseEther("10000"));

    const Airdrop = await ethers.getContractFactory("MerkleAirdrop");
    airdrop = await Airdrop.deploy(await token.getAddress(), merkleRoot);

    await token.transfer(await airdrop.getAddress(), ethers.parseEther("1500"));
  });

  it("whitelist'teki adres doğru proof ile claim edebilir", async function () {
    const entry = whitelist[0]; // alice
    const leaf = hashLeaf(entry.address, entry.amount);
    const proof = tree.getHexProof(leaf);

    await expect(airdrop.connect(alice).claim(entry.amount, proof))
      .to.emit(airdrop, "Claimed")
      .withArgs(alice.address, entry.amount);

    expect(await token.balanceOf(alice.address)).to.equal(entry.amount);
  });

  it("aynı adres iki kez claim edemez", async function () {
    const entry = whitelist[0];
    const leaf = hashLeaf(entry.address, entry.amount);
    const proof = tree.getHexProof(leaf);

    await airdrop.connect(alice).claim(entry.amount, proof);

    await expect(
      airdrop.connect(alice).claim(entry.amount, proof)
    ).to.be.revertedWithCustomError(airdrop, "AlreadyClaimed");
  });

  it("whitelist'te olmayan adres claim edemez", async function () {
    const fakeAmount = ethers.parseEther("1000");
    const fakeProof = tree.getHexProof(hashLeaf(alice.address, fakeAmount));

    await expect(
      airdrop.connect(mallory).claim(fakeAmount, fakeProof)
    ).to.be.revertedWithCustomError(airdrop, "InvalidProof");
  });

  it("doğru adres yanlış miktar ile claim edemez", async function () {
    const entry = whitelist[0];
    const leaf = hashLeaf(entry.address, entry.amount);
    const proof = tree.getHexProof(leaf);
    const wrongAmount = ethers.parseEther("999999");

    await expect(
      airdrop.connect(alice).claim(wrongAmount, proof)
    ).to.be.revertedWithCustomError(airdrop, "InvalidProof");
  });
});