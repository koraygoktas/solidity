// SPDX-License-Identifier: MIT 
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
/// @notice sadece testlerde kullanılacak basit bir token
contract MockERC20 is ERC20{
    constructor(uint256 initialSupply) ERC20("Airdrop Token","ADT"){
        _mint(msg.sender,initialSupply);
    }
}