// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title InterestRateModel
 * @notice Arz-talebe göre dinamik faiz hesaplama
 * @dev Utilization Rate = Borrowed / (Cash + Borrowed)
 */
contract InterestRateModel {
    // Sabit faiz parametreleri (yıllık APR basis points - 10000 = 100%)
    uint256 public constant BASE_RATE = 200;           // 2% base rate
    uint256 public constant MULTIPLIER = 1000;         // 10% at 100% utilization
    uint256 public constant JUMP_MULTIPLIER = 10000;   // 100% after kink
    uint256 public constant KINK = 8000;               // 80% utilization'da jump başlar
    
    uint256 public constant BLOCKS_PER_YEAR = 2628000; // ~12 saniye block time
    
    /**
     * @notice Borç alma faizini hesapla
     * @param cash Havuzdaki mevcut likidite
     * @param borrowed Toplam borç
     * @param reserves Protokol rezervleri
     * @return Blok başına borrow rate (scaled by 1e18)
     */
    function getBorrowRate(
        uint256 cash,
        uint256 borrowed,
        uint256 reserves
    ) public pure returns (uint256) {
        uint256 utilization = getUtilizationRate(cash, borrowed, reserves);
        
        // Utilization 0 ise, sadece base rate
        if (utilization == 0) {
            return (BASE_RATE * 1e18) / (BLOCKS_PER_YEAR * 10000);
        }
        
        // Kink noktasına kadar lineer artış
        if (utilization <= KINK) {
            uint256 rate = BASE_RATE + (MULTIPLIER * utilization) / 10000;
            return (rate * 1e18) / (BLOCKS_PER_YEAR * 10000);
        }
        
        // Kink sonrası hızlı artış (yüksek kullanımı caydırmak için)
        uint256 excessUtil = utilization - KINK;
        uint256 normalRate = BASE_RATE + (MULTIPLIER * KINK) / 10000;
        uint256 jumpRate = (JUMP_MULTIPLIER * excessUtil) / 10000;
        
        return ((normalRate + jumpRate) * 1e18) / (BLOCKS_PER_YEAR * 10000);
    }
    
    /**
     * @notice Borç verme faizini hesapla
     * @dev Supply rate = Borrow rate * Utilization * (1 - Reserve Factor)
     */
    function getSupplyRate(
        uint256 cash,
        uint256 borrowed,
        uint256 reserves,
        uint256 reserveFactor // 10000 = 100%
    ) public pure returns (uint256) {
        uint256 borrowRate = getBorrowRate(cash, borrowed, reserves);
        uint256 utilization = getUtilizationRate(cash, borrowed, reserves);
        
        uint256 rateToPool = (borrowRate * (10000 - reserveFactor)) / 10000;
        return (rateToPool * utilization) / 1e18;
    }
    
    /**
     * @notice Utilization rate hesapla
     * @return Utilization scaled by 1e18 (10000 = 100%)
     */
    function getUtilizationRate(
        uint256 cash,
        uint256 borrowed,
        uint256 reserves
    ) public pure returns (uint256) {
        if (borrowed == 0) return 0;
        
        uint256 totalSupply = cash + borrowed - reserves;
        if (totalSupply == 0) return 0;
        
        return (borrowed * 10000) / totalSupply;
    }
}