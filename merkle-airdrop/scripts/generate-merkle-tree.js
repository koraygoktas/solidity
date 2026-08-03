import { ethers } from "ethers";
import { MerkleTree } from "merkletreejs";
import keccak256 from "keccak256";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const whitelist = JSON.parse(
  fs.readFileSync(path.join(__dirname, "../data/whitelist.json"), "utf8")
);

const abiCoder = ethers.AbiCoder.defaultAbiCoder();

// Solidity'deki: keccak256(bytes.concat(keccak256(abi.encode(address, amount))))
function hashLeaf(address, amount) {
  const innerHash = ethers.keccak256(
    abiCoder.encode(["address", "uint256"], [address, amount])
  );
  const outerHash = ethers.keccak256(innerHash);
  return Buffer.from(outerHash.slice(2), "hex");
}

const leaves = whitelist.map((entry) =>
  hashLeaf(entry.address, entry.amount)
);

// sortPairs: true -> kontrattaki "her zaman büyükten küçüğe sıralı birleştir"
// mantığıyla eşleşmesi için şart.
const tree = new MerkleTree(leaves, keccak256, { sortPairs: true });
const merkleRoot = tree.getHexRoot();

const proofs = {};
whitelist.forEach((entry, i) => {
  proofs[entry.address] = {
    amount: entry.amount,
    proof: tree.getHexProof(leaves[i]),
  };
});

fs.writeFileSync(
  path.join(__dirname, "../data/merkleRoot.json"),
  JSON.stringify({ merkleRoot }, null, 2)
);

fs.writeFileSync(
  path.join(__dirname, "../data/proofs.json"),
  JSON.stringify(proofs, null, 2)
);

console.log("Merkle root:", merkleRoot);
console.log(`${whitelist.length} adres için proof üretildi -> data/proofs.json`);