// SPDX-Licence-Identifier: MIT
pragma solidity ^0.8.24;

contract MultiSigWallet {
  address[] public owners;
  mapping(address => bool) public isOwner;
  uint public numConfirmationRequired;


constructor(address[] memory _owners, uint _numconfirmationRequired){
  require(_owners.length > 0,"owners required");
  require(
    _numconfirmationRequired > 0 &&
    _numconfirmationRequired <= _owners.length,
    "invalid number of required confirmations"
    );

  for (uint i=0; i<_owners.length; i++){
    address owner = owners[i];

    require(owner!=address(0),"invalid owner");
    require(!isOwner[owner],"owner not unique");


    isOwner[owner] = true;
    owners.push(owner);
  }
}


}