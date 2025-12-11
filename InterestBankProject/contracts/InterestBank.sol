//SPDX-License-Identifier: MIT 
pragma solidity ^0.8.20;

contract InterestBank {
    // Kullanıcı hesap bilgileri
    struct Account {
        uint256 balance;           // Ana bakiye
        uint256 lastInterestTime;  // Son faiz hesaplama zamanı
        uint256 totalInterestEarned; // Toplam kazanılan faiz
    }
    
    mapping(address => Account) private accounts;
    
    // Yıllık faiz oranı (5% = 500, %100'lük sistemde)
    uint256 public constant ANNUAL_INTEREST_RATE = 500; // %5
    uint256 public constant RATE_DENOMINATOR = 10000;   // Hassasiyet için
    uint256 public constant SECONDS_PER_YEAR = 365 days;
    
    event Deposit(address indexed user, uint256 amount);
    event Withdraw(address indexed user, uint256 amount);
    event InterestClaimed(address indexed user, uint256 interestAmount);
    
    // Para yatırma
    function deposit() external payable {
        require(msg.value > 0, "aamount must be>0");
        
        // Önce mevcut faizi hesapla ve ekle
        if(accounts[msg.sender].balance > 0) {
            _calculateAndAddInterest(msg.sender);
        } else {
            // İlk kez yatırım yapıyorsa zamanı başlat
            accounts[msg.sender].lastInterestTime = block.timestamp;
        }
        
        accounts[msg.sender].balance += msg.value;
        emit Deposit(msg.sender, msg.value);
    }
    
    // Para çekme
    function withdraw(uint256 amount) external {
        require(amount > 0, "amount must be > 0");
        require(accounts[msg.sender].balance >= amount, "insufficient balance");
        
        // Önce faizi hesapla ve ekle
        _calculateAndAddInterest(msg.sender);
        
        accounts[msg.sender].balance -= amount;
        
        // transfer() yerine call kullan (daha güvenli)
        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "transfer failed");
        
        emit Withdraw(msg.sender, amount);
    }
    
    // Faiz talep etme (biriken faizi bakiyeye ekler)
    function claimInterest() external {
        require(accounts[msg.sender].balance > 0, "no balance to earn interest");
        
        uint256 interest = calculateInterest(msg.sender);
        require(interest > 0, "no interest to claim");
        
        accounts[msg.sender].balance += interest;
        accounts[msg.sender].totalInterestEarned += interest;
        accounts[msg.sender].lastInterestTime = block.timestamp;
        
        emit InterestClaimed(msg.sender, interest);
    }
    
    // Faiz hesaplama (internal fonksiyon)
    function _calculateAndAddInterest(address user) internal {
        uint256 interest = calculateInterest(user);
        if(interest > 0) {
            accounts[user].balance += interest;
            accounts[user].totalInterestEarned += interest;
        }
        accounts[user].lastInterestTime = block.timestamp;
    }
    
    // Biriken faizi hesaplama (view fonksiyon - gas harcamaz)
    function calculateInterest(address user) public view returns(uint256) {
        Account memory account = accounts[user];
        
        if(account.balance == 0) {
            return 0;
        }
        
        uint256 timeElapsed = block.timestamp - account.lastInterestTime;
        
        // Faiz = Bakiye * Faiz Oranı * Geçen Zaman / Yıl
        uint256 interest = (account.balance * ANNUAL_INTEREST_RATE * timeElapsed) 
                          / (RATE_DENOMINATOR * SECONDS_PER_YEAR);
        
        return interest;
    }
    
    // Kullanıcı bilgilerini getir
    function getAccountInfo(address user) external view returns(
        uint256 balance,
        uint256 pendingInterest,
        uint256 totalInterestEarned,
        uint256 lastInterestTime
    ) {
        Account memory account = accounts[user];
        return (
            account.balance,
            calculateInterest(user),
            account.totalInterestEarned,
            account.lastInterestTime
        );
    }
    
    // Sadece bakiyeyi getir
    function getBalance(address user) external view returns(uint256) {
        return accounts[user].balance;
    }
    
    // Toplam kazanılan faizi getir
    function getTotalInterestEarned(address user) external view returns(uint256) {
        return accounts[user].totalInterestEarned;
    }
}