// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/// @title MerkleAirdrop
/// @notice Whitelist'teki adreslerin, tüm listeyi zincirde tutmadan
///         token talep (claim) edebildiği bir airdrop kontratı.
/// @dev Merkle proof doğrulamasını bilinçli olarak elle (OZ MerkleProof
///      kütüphanesi kullanmadan) yazdık ki algoritma tam olarak görünsün.
contract MerkleAirdrop {
    IERC20 public immutable token;
    bytes32 public immutable merkleRoot;
    mapping(address => bool) public hasClaimed;

    event Claimed(address indexed account, uint256 amount);

    error AlreadyClaimed();                 
    error InvalidProof();

    constructor(address _token, bytes32 _merkleRoot) {
        token = IERC20(_token);
        merkleRoot = _merkleRoot;
    }

    function claim(uint256 amount, bytes32[] calldata merkleProof) external {
        if (hasClaimed[msg.sender]) revert AlreadyClaimed();

        bytes32 leaf = keccak256(bytes.concat(keccak256(abi.encode(msg.sender, amount))));

        if (!_verify(merkleProof, merkleRoot, leaf)) revert InvalidProof();

        hasClaimed[msg.sender] = true;
        emit Claimed(msg.sender, amount);

        require(token.transfer(msg.sender, amount), "Transfer failed");
    }

    function _verify(
        bytes32[] calldata proof,
        bytes32 root,
        bytes32 leaf
    ) internal pure returns (bool) {
        bytes32 computedHash = leaf;

        for (uint256 i = 0; i < proof.length; i++) {
            bytes32 proofElement = proof[i];

            if (computedHash <= proofElement) {
                computedHash = keccak256(abi.encodePacked(computedHash, proofElement));
            } else {
                computedHash = keccak256(abi.encodePacked(proofElement, computedHash));
            }
        }

        return computedHash == root;
    }
}