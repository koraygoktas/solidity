// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol"; //belirli fonkları içermesini sağlıyor
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol"; //bazıları false olsa dahi revert olmaz onun için
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol"; //aynı anda işleme girilmesini engelliyor
import "./InterestRateModel.sol";
import "./PriceOracle.sol";

/**
 * @title LendingPool
 * @notice Aave/Compound tarzı lending/borrowing protokolü
 */
contract LendingPool is ReentrancyGuard {
    using SafeERC20 for IERC20;
    
    InterestRateModel public interestRateModel;
    PriceOracle public priceOracle;
    
    uint256 public constant LIQUIDATION_THRESHOLD = 8000;
    uint256 public constant LIQUIDATION_BONUS = 500;
    uint256 public constant MIN_HEALTH_FACTOR = 1e18;
    uint256 public constant RESERVE_FACTOR = 1000;
    
    struct Market {
        bool isListed;
        uint256 collateralFactor;
        uint256 totalCash;
        uint256 totalBorrowed;
        uint256 totalReserves;
        uint256 borrowIndex;
        uint256 lastUpdateBlock;
    }
    
    struct UserAccount {
        uint256 depositBalance;
        uint256 depositIndex;
        uint256 borrowBalance;
        uint256 borrowIndex;
    }
    
    mapping(address => Market) public markets;
    mapping(address => mapping(address => UserAccount)) public userAccounts;
    address[] public allMarkets;
    
    event MarketListed(address indexed token, uint256 collateralFactor);
    event Deposit(address indexed user, address indexed token, uint256 amount);
    event Withdraw(address indexed user, address indexed token, uint256 amount);
    event Borrow(address indexed user, address indexed token, uint256 amount);
    event Repay(address indexed user, address indexed token, uint256 amount);
    event Liquidation(
        address indexed liquidator,
        address indexed borrower,
        address indexed collateralToken,
        address debtToken,
        uint256 debtAmount,
        uint256 collateralSeized
    );
    
    constructor(address _interestRateModel, address _priceOracle) {
        interestRateModel = InterestRateModel(_interestRateModel);
        priceOracle = PriceOracle(_priceOracle);
    }
    
    function listMarket(address token, uint256 collateralFactor) external {
        require(!markets[token].isListed, "Already listed");
        require(collateralFactor <= LIQUIDATION_THRESHOLD, "CF > liquidation threshold");
        
        markets[token] = Market({
            isListed: true,
            collateralFactor: collateralFactor,
            totalCash: 0,
            totalBorrowed: 0,
            totalReserves: 0,
            borrowIndex: 1e18,
            lastUpdateBlock: block.number
        });
        
        allMarkets.push(token);
        emit MarketListed(token, collateralFactor);
    }
    
    function deposit(address token, uint256 amount) external nonReentrant {
        require(markets[token].isListed, "Market not listed");
        require(amount > 0, "Invalid amount");
        
        accrueInterest(token);
        
        Market storage market = markets[token];
        UserAccount storage account = userAccounts[msg.sender][token];
        
        uint256 currentBalance = account.depositBalance;
        if (account.depositIndex > 0) {
            currentBalance = (account.depositBalance * market.borrowIndex) / account.depositIndex;
        }
        
        account.depositBalance = currentBalance + amount;
        account.depositIndex = market.borrowIndex;
        market.totalCash += amount;
        
        IERC20(token).safeTransferFrom(msg.sender, address(this), amount);
        emit Deposit(msg.sender, token, amount);
    }
    
    function withdraw(address token, uint256 amount) external nonReentrant {
        require(markets[token].isListed, "Market not listed");
        require(amount > 0, "Invalid amount");
        
        accrueInterest(token);
        
        Market storage market = markets[token];
        UserAccount storage account = userAccounts[msg.sender][token];
        
        uint256 currentBalance = (account.depositBalance * market.borrowIndex) / account.depositIndex;
        require(currentBalance >= amount, "Insufficient balance");
        
        account.depositBalance = currentBalance - amount;
        account.depositIndex = market.borrowIndex;
        market.totalCash -= amount;
        
        require(getHealthFactor(msg.sender) >= MIN_HEALTH_FACTOR, "Insufficient collateral");
        
        IERC20(token).safeTransfer(msg.sender, amount);
        emit Withdraw(msg.sender, token, amount);
    }
    
    function borrow(address token, uint256 amount) external nonReentrant {
        require(markets[token].isListed, "Market not listed");
        require(amount > 0, "Invalid amount");
        
        accrueInterest(token);
        
        Market storage market = markets[token];
        UserAccount storage account = userAccounts[msg.sender][token];
        
        uint256 currentBorrow = account.borrowBalance;
        if (account.borrowIndex > 0) {
            currentBorrow = (account.borrowBalance * market.borrowIndex) / account.borrowIndex;
        }
        
        account.borrowBalance = currentBorrow + amount;
        account.borrowIndex = market.borrowIndex;
        market.totalBorrowed += amount;
        market.totalCash -= amount;
        
        require(getHealthFactor(msg.sender) >= MIN_HEALTH_FACTOR, "Insufficient collateral");
        require(market.totalCash >= amount, "Insufficient liquidity");
        
        IERC20(token).safeTransfer(msg.sender, amount);
        emit Borrow(msg.sender, token, amount);
    }
    
    function repay(address token, uint256 amount) external nonReentrant {
        require(markets[token].isListed, "Market not listed");
        
        accrueInterest(token);
        
        Market storage market = markets[token];
        UserAccount storage account = userAccounts[msg.sender][token];
        
        uint256 currentBorrow = (account.borrowBalance * market.borrowIndex) / account.borrowIndex;
        require(currentBorrow > 0, "No debt");
        
        uint256 repayAmount = amount == type(uint256).max ? currentBorrow : amount;
        require(repayAmount <= currentBorrow, "Repay too much");
        
        account.borrowBalance = currentBorrow - repayAmount;
        account.borrowIndex = market.borrowIndex;
        market.totalBorrowed -= repayAmount;
        market.totalCash += repayAmount;
        
        IERC20(token).safeTransferFrom(msg.sender, address(this), repayAmount);
        emit Repay(msg.sender, token, repayAmount);
    }
    
    function liquidate(
        address borrower,
        address debtToken,
        address collateralToken,
        uint256 debtAmount
    ) external nonReentrant {
        require(borrower != msg.sender, "Cannot liquidate yourself");
        require(markets[debtToken].isListed && markets[collateralToken].isListed, "Market not listed");
        
        accrueInterest(debtToken);
        accrueInterest(collateralToken);
        
        uint256 healthFactor = getHealthFactor(borrower);
        require(healthFactor < MIN_HEALTH_FACTOR, "Position is healthy");
        
        UserAccount storage debtAccount = userAccounts[borrower][debtToken];
        uint256 currentDebt = (debtAccount.borrowBalance * markets[debtToken].borrowIndex) / debtAccount.borrowIndex;
        require(currentDebt > 0, "No debt");
        require(debtAmount <= currentDebt, "Repay too much");
        
        uint256 collateralSeized = calculateCollateralSeized(debtToken, collateralToken, debtAmount);
        
        UserAccount storage collateralAccount = userAccounts[borrower][collateralToken];
        uint256 currentCollateral = (collateralAccount.depositBalance * markets[collateralToken].borrowIndex) 
            / collateralAccount.depositIndex;
        require(currentCollateral >= collateralSeized, "Insufficient collateral");
        
        debtAccount.borrowBalance = currentDebt - debtAmount;
        markets[debtToken].totalBorrowed -= debtAmount;
        markets[debtToken].totalCash += debtAmount;
        
        collateralAccount.depositBalance = currentCollateral - collateralSeized;
        
        IERC20(debtToken).safeTransferFrom(msg.sender, address(this), debtAmount);
        IERC20(collateralToken).safeTransfer(msg.sender, collateralSeized);
        
        emit Liquidation(msg.sender, borrower, collateralToken, debtToken, debtAmount, collateralSeized);
    }
    
    function getHealthFactor(address user) public view returns (uint256) {
        (uint256 totalCollateralValue, uint256 totalBorrowValue) = getAccountLiquidity(user);
        
        if (totalBorrowValue == 0) return type(uint256).max;
        
        uint256 adjustedCollateral = (totalCollateralValue * LIQUIDATION_THRESHOLD) / 10000;
        return (adjustedCollateral * 1e18) / totalBorrowValue;
    }
    
    function getAccountLiquidity(address user) public view returns (uint256 totalCollateral, uint256 totalBorrow) {
        for (uint256 i = 0; i < allMarkets.length; i++) {
            address token = allMarkets[i];
            Market storage market = markets[token];
            UserAccount storage account = userAccounts[user][token];
            
            if (account.depositBalance > 0 && account.depositIndex > 0) {
                uint256 balance = (account.depositBalance * market.borrowIndex) / account.depositIndex;
                uint256 value = priceOracle.getValueInUSD(token, balance);
                uint256 collateralValue = (value * market.collateralFactor) / 10000;
                totalCollateral += collateralValue;
            }
            
            if (account.borrowBalance > 0 && account.borrowIndex > 0) {
                uint256 borrowed = (account.borrowBalance * market.borrowIndex) / account.borrowIndex;
                totalBorrow += priceOracle.getValueInUSD(token, borrowed);
            }
        }
    }
    
    function calculateCollateralSeized(
        address debtToken,
        address collateralToken,
        uint256 debtAmount
    ) public view returns (uint256) {
        uint256 debtValue = priceOracle.getValueInUSD(debtToken, debtAmount);
        uint256 valueWithBonus = (debtValue * (10000 + LIQUIDATION_BONUS)) / 10000;
        uint256 collateralPrice = priceOracle.getPrice(collateralToken);
        return (valueWithBonus * 1e8) / collateralPrice;
    }
    
    function accrueInterest(address token) public {
        Market storage market = markets[token];
        uint256 currentBlock = block.number;
        
        if (market.lastUpdateBlock == currentBlock) return;
        
        uint256 blockDelta = currentBlock - market.lastUpdateBlock;
        
        if (market.totalBorrowed == 0) {
            market.lastUpdateBlock = currentBlock;
            return;
        }
        
        uint256 borrowRate = interestRateModel.getBorrowRate(
            market.totalCash,
            market.totalBorrowed,
            market.totalReserves
        );
        
        uint256 interestAccumulated = (borrowRate * market.totalBorrowed * blockDelta) / 1e18;
        uint256 reservesAdded = (interestAccumulated * RESERVE_FACTOR) / 10000;
        
        market.totalBorrowed += interestAccumulated;
        market.totalReserves += reservesAdded;
        market.borrowIndex = market.borrowIndex + (borrowRate * blockDelta);
        market.lastUpdateBlock = currentBlock;
    }
    
    function getUserBalance(address user, address token) external view returns (
        uint256 depositBalance,
        uint256 borrowBalance
    ) {
        Market storage market = markets[token];
        UserAccount storage account = userAccounts[user][token];
        
        if (account.depositIndex > 0) {
            depositBalance = (account.depositBalance * market.borrowIndex) / account.depositIndex;
        }
        
        if (account.borrowIndex > 0) {
            borrowBalance = (account.borrowBalance * market.borrowIndex) / account.borrowIndex;
        }
    }
    
    function getAPY(address token) external view returns (uint256 supplyAPY, uint256 borrowAPY) {
        Market storage market = markets[token];
        
        borrowAPY = interestRateModel.getBorrowRate(
            market.totalCash,
            market.totalBorrowed,
            market.totalReserves
        ) * 2628000;
        
        supplyAPY = interestRateModel.getSupplyRate(
            market.totalCash,
            market.totalBorrowed,
            market.totalReserves,
            RESERVE_FACTOR
        ) * 2628000;
    }
}