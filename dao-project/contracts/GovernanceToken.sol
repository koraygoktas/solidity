// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Votes.sol";
import "@openzeppelin/contracts/utils/cryptography/EIP712.sol";

contract GovernanceToken is ERC20, ERC20Votes {
    constructor(uint256 initialSupply) 
        ERC20("DAO Governance Token", "DGOV") 
        EIP712("DAO Governance Token", "1")
    {
        _mint(msg.sender, initialSupply);
    }

    function _update(address from, address to, uint256 amount)
        internal
        override(ERC20, ERC20Votes)
    {
        super._update(from, to, amount);
    }
}