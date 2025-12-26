// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title SimpleSwap
 * @dev Basit DEX - ETH/Token swap
 */
contract SimpleSwap is Ownable, ReentrancyGuard {
    
    IERC20 public token;
    
    uint256 public reserveETH;
    uint256 public reserveToken;
    
    mapping(address => uint256) public liquidityShares;
    uint256 public totalLiquidityShares;
    
    uint256 public constant FEE_NUMERATOR = 30;
    uint256 public constant FEE_DENOMINATOR = 10000;
    
    event LiquidityAdded(address indexed provider, uint256 ethAmount, uint256 tokenAmount, uint256 shares);
    event LiquidityRemoved(address indexed provider, uint256 ethAmount, uint256 tokenAmount, uint256 shares);
    event Swap(address indexed user, string swapType, uint256 inputAmount, uint256 outputAmount);
    
    constructor(address _token) Ownable(msg.sender) {
        require(_token != address(0), "Invalid token");
        token = IERC20(_token);
    }
    
    function addLiquidity(uint256 tokenAmount) external payable nonReentrant returns (uint256 shares) {
        require(msg.value > 0, "ETH must be > 0");
        require(tokenAmount > 0, "Token must be > 0");
        
        if (totalLiquidityShares == 0) {
            shares = sqrt(msg.value * tokenAmount);
            require(shares > 0, "Insufficient liquidity");
        } else {
            uint256 ethShare = (msg.value * totalLiquidityShares) / reserveETH;
            uint256 tokenShare = (tokenAmount * totalLiquidityShares) / reserveToken;
            shares = ethShare < tokenShare ? ethShare : tokenShare;
            require(shares > 0, "Insufficient liquidity");
        }
        
        require(token.transferFrom(msg.sender, address(this), tokenAmount), "Transfer failed");
        
        reserveETH += msg.value;
        reserveToken += tokenAmount;
        liquidityShares[msg.sender] += shares;
        totalLiquidityShares += shares;
        
        emit LiquidityAdded(msg.sender, msg.value, tokenAmount, shares);
    }
    
    function removeLiquidity(uint256 shares) external nonReentrant returns (uint256 ethAmount, uint256 tokenAmount) {
        require(shares > 0, "Shares must be > 0");
        require(liquidityShares[msg.sender] >= shares, "Insufficient shares");
        
        ethAmount = (shares * reserveETH) / totalLiquidityShares;
        tokenAmount = (shares * reserveToken) / totalLiquidityShares;
        require(ethAmount > 0 && tokenAmount > 0, "Insufficient liquidity");
        
        liquidityShares[msg.sender] -= shares;
        totalLiquidityShares -= shares;
        reserveETH -= ethAmount;
        reserveToken -= tokenAmount;
        
        require(token.transfer(msg.sender, tokenAmount), "Transfer failed");
        (bool success, ) = msg.sender.call{value: ethAmount}("");
        require(success, "ETH transfer failed");
        
        emit LiquidityRemoved(msg.sender, ethAmount, tokenAmount, shares);
    }
    
    function swapETHForToken(uint256 minTokenAmount) external payable nonReentrant returns (uint256 tokenAmount) {
        require(msg.value > 0, "ETH must be > 0");
        require(reserveToken > 0, "Insufficient liquidity");
        
        uint256 ethAfterFee = msg.value * (FEE_DENOMINATOR - FEE_NUMERATOR) / FEE_DENOMINATOR;
        tokenAmount = getAmountOut(ethAfterFee, reserveETH, reserveToken);
        
        require(tokenAmount >= minTokenAmount, "Slippage too high");
        require(tokenAmount < reserveToken, "Insufficient reserve");
        
        reserveETH += msg.value;
        reserveToken -= tokenAmount;
        
        require(token.transfer(msg.sender, tokenAmount), "Transfer failed");
        emit Swap(msg.sender, "ETH->Token", msg.value, tokenAmount);
    }
    
    function swapTokenForETH(uint256 tokenAmount, uint256 minETHAmount) external nonReentrant returns (uint256 ethAmount) {
        require(tokenAmount > 0, "Token must be > 0");
        require(reserveETH > 0, "Insufficient liquidity");
        
        require(token.transferFrom(msg.sender, address(this), tokenAmount), "Transfer failed");
        
        uint256 tokenAfterFee = tokenAmount * (FEE_DENOMINATOR - FEE_NUMERATOR) / FEE_DENOMINATOR;
        ethAmount = getAmountOut(tokenAfterFee, reserveToken, reserveETH);
        
        require(ethAmount >= minETHAmount, "Slippage too high");
        require(ethAmount < reserveETH, "Insufficient reserve");
        
        reserveToken += tokenAmount;
        reserveETH -= ethAmount;
        
        (bool success, ) = msg.sender.call{value: ethAmount}("");
        require(success, "ETH transfer failed");
        
        emit Swap(msg.sender, "Token->ETH", tokenAmount, ethAmount);
    }
    
    function getAmountOut(uint256 inputAmount, uint256 inputReserve, uint256 outputReserve) public pure returns (uint256) {
        require(inputAmount > 0, "Input must be > 0");
        require(inputReserve > 0 && outputReserve > 0, "Insufficient reserves");
        
        uint256 numerator = inputAmount * outputReserve;
        uint256 denominator = inputReserve + inputAmount;
        return numerator / denominator;
    }
    
    function getPrice() external view returns (uint256) {
        require(reserveETH > 0, "No liquidity");
        return (reserveToken * 1e18) / reserveETH;
    }
    
    function getUserLiquidity(address user) external view returns (uint256 ethAmount, uint256 tokenAmount, uint256 shares) {
        shares = liquidityShares[user];
        if (totalLiquidityShares > 0) {
            ethAmount = (shares * reserveETH) / totalLiquidityShares;
            tokenAmount = (shares * reserveToken) / totalLiquidityShares;
        }
    }
    
    function sqrt(uint256 x) internal pure returns (uint256) {
        if (x == 0) return 0;
        uint256 z = (x + 1) / 2;
        uint256 y = x;
        while (z < y) {
            y = z;
            z = (x / z + z) / 2;
        }
        return y;
    }
    
    receive() external payable {}
}