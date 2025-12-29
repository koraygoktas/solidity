'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import contractsData from '../contracts.json';
import tokenAbi from '../abis/GovernanceToken.json';
import daoAbi from '../abis/DAOGovernance.json';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export default function Home() {
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState('0');
  const [votingPower, setVotingPower] = useState('0');
  const [proposals, setProposals] = useState<any[]>([]);
  const [description, setDescription] = useState('');

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      setAccount(accounts[0]);
      await loadData(provider, accounts[0]);
    }
  };

  const loadData = async (provider: any, account: string) => {
    const token = new ethers.Contract(contractsData.GovernanceToken, tokenAbi.abi, provider);
    const balance = await token.balanceOf(account);
    const votes = await token.getVotes(account);
    setBalance(ethers.formatEther(balance));
    setVotingPower(ethers.formatEther(votes));
  };

  const createProposal = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const dao = new ethers.Contract(contractsData.DAOGovernance, daoAbi.abi, signer);
    const tx = await dao.propose(description);
    await tx.wait();
    alert('Proposal created!');
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">DAO Governance</h1>
        
        {!account ? (
          <button 
            onClick={connectWallet}
            className="bg-blue-600 px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Connect Wallet
          </button>
        ) : (
          <div>
            <p className="mb-4">Account: {account}</p>
            <p>Balance: {balance} DGOV</p>
            <p>Voting Power: {votingPower}</p>
            
            <div className="mt-8">
              <h2 className="text-2xl mb-4">Create Proposal</h2>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full p-3 rounded bg-gray-800 mb-4"
                placeholder="Proposal description"
              />
              <button 
                onClick={createProposal}
                className="bg-green-600 px-6 py-3 rounded hover:bg-green-700"
              >
                Create Proposal
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}