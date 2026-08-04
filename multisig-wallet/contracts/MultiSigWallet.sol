// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

contract MultiSigWallet {
  address[] public owners;
  mapping(address => bool) public isOwner;
  uint public numConfirmationRequired;

  modifier onlyOwner(){
    require(isOwner[msg.sender],"not owner");
    _;
  }

struct Transaction{
  address to;
  uint value;
  bytes data;
  bool executed;
  uint numConfirmations;
}

event Deposit(address indexed sender, uint amount, uint balanca);
event SubmitTransaction(
  address indexed owner,
  uint indexed txIndex,
  address indexed to,
  uint value,
  bytes data
);
event ConfirmTransaction(address indexed owner,uint indexed txIndes);
event RevokeConfirmation(address indexed owner,uint indexed txIndes);
event ExecuteTransaction(address indexed owner,uint indexed txIndes);


Transaction[] public transaction;
mapping(uint => mapping(address =>bool)) public isConfirmed;

constructor(address[] memory _owners, uint _numconfirmationRequired){
  require(_owners.length > 0,"owners required");
  require(
    _numconfirmationRequired > 0 &&
    _numconfirmationRequired <= _owners.length,
    "invalid number of required confirmations"
    );

  for (uint i=0; i<_owners.length; i++){
    address owner = _owners[i];

    require(owner!=address(0),"invalid owner");
    require(!isOwner[owner],"owner not unique");


    isOwner[owner] = true;
    owners.push(owner);
    numConfirmationRequired = _numconfirmationRequired;
  }
}

receive() external payable {
  emit Deposit(msg.sender,msg.value,address(this).balance);
}

function submitTransaction(
  address _to,
  uint _value,
  bytes memory _data
) public onlyOwner {
  uint txIndex = transaction.length;

  transaction.push(
    Transaction({
      to : _to,
      value : _value,
      data : _data,
      executed : false,
      numConfirmations: 0
    })
  );
  emit SubmitTransaction(msg.sender,txIndex, _to, _value, _data);
}


}