// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title PriceOracle
 * @notice Mock price oracle (test için - production'da Chainlink AggregatorV3 kullan)
 */

 contract PriceOracle{
    mapping(address=>uint256) private prices;
    address public owner;

    event PriceUpdated(address indexed token, uint256 price);

    constructor(){
        owner = msg.sender;
    }

    modifier onlyOwner(){
        require(msg.sender ==owner,"only owner");
        _;
    }
     /**
     * @notice Fiyat belirle (sadece test için - admin only)
     */
     function setPrice(address token,uint256 price) external onlyOwner{
        require(price>0,"invalid price");
        prices[token]=price;
        emit PriceUpdated(token, price);
     }
     /**
     * @notice Token fiyatını USD cinsinden getir
     * @return USD fiyatı (8 decimals - $1.00 = 1e8)
     */
     function getPrice(address token) external view returns (uint256){
        uint256 price = prices[token];
        require(price>0,"price not set");
        return price;
     }
     /**
     * @notice USD değerini hesapla
     * @param token Token adresi
     * @param amount Token miktarı (token'ın kendi decimals'ı ile)
     * @return USD değeri (18 decimals)
     */
    function getValueInUSD(address token,uint256 amount) external view returns (uint256){
        uint256 price=prices[token];
        require(price>0,"price not set");
        return (amount * price * 1e10) / 1e18;
    }
 }