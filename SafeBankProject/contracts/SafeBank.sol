//SPDX-License-Identifier: MIT 
pragma solidity ^0.8.20;

contract SafeBank {
    mapping(address => uint256) private balances;

    event Deposit(address indexed user, uint256 amount);
    event Withdraw(address indexed user, uint256 amount);

    // Para yatırma
    function deposit() external payable {
        require(msg.value > 0, "amount must be > 0");
        balances[msg.sender] += msg.value;  // balance değil balances
        emit Deposit(msg.sender, msg.value);
    }
    
    // Para çekme
    function withdraw(uint256 amount) external {  // Withdraw değil withdraw (küçük w)
        require(amount > 0, "amount must be > 0");
        require(balances[msg.sender] >= amount, "insufficient balance");
        balances[msg.sender] -= amount;  // += değil -=
        payable(msg.sender).transfer(amount);
        emit Withdraw(msg.sender, amount);
    }
    
    // Bakiyeyi okuma
    function getBalance(address user) external view returns(uint256) {
        return balances[user];  // balance değil balances
    }
}