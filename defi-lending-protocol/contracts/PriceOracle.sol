// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract PriceOracle {
    mapping(address => uint256) private prices;
    mapping(address => uint8) private decimals;
    address public owner;
    
    event PriceUpdated(address indexed token, uint256 price);
    
    constructor() {
        owner = msg.sender;
    }
    
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }
    
    function setPrice(address token, uint256 price, uint8 tokenDecimals) external onlyOwner {
        require(price > 0, "Invalid price");
        prices[token] = price;
        decimals[token] = tokenDecimals;
        emit PriceUpdated(token, price);
    }
    
    function getPrice(address token) external view returns (uint256) {
        uint256 price = prices[token];
        require(price > 0, "Price not set");
        return price;
    }
    
    function getValueInUSD(address token, uint256 amount) external view returns (uint256) {
        uint256 price = prices[token];
        require(price > 0, "Price not set");
        
        uint8 tokenDecimals = decimals[token];
        
        uint256 valueInUSD = (amount * price * 1e18) / (10 ** tokenDecimals) / 1e8;
        return valueInUSD;
    }
}