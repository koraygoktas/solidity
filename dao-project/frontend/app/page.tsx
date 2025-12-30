'use client';

import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import contractsData from '../contracts.json';
import tokenAbiFile from '../abis/GovernanceToken.json';
import daoAbiFile from '../abis/DAOGovernance.json';

const tokenAbi = (tokenAbiFile as any).abi;
const daoAbi = (daoAbiFile as any).abi;

declare global {
  interface Window {
    ethereum?: any;
  }
}

export default function Home() {
  const [account, setAccount] = useState('');
  const [balance, setBalance] = useState('0');
  const [votingPower, setVotingPower] = useState('0');
  const [description, setDescription] = useState('');
  const [proposalId, setProposalId] = useState('');
  const [proposals, setProposals] = useState<any[]>([]);
  const [proposalCount, setProposalCount] = useState(0);

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const accounts = await provider.send('eth_requestAccounts', []);
      setAccount(accounts[0]);
      await loadData(provider, accounts[0]);
    }
  };

  const loadData = async (provider: any, account: string) => {
    const token = new ethers.Contract(contractsData.GovernanceToken, tokenAbi, provider);
    const dao = new ethers.Contract(contractsData.DAOGovernance, daoAbi, provider);
    
    const balance = await token.balanceOf(account);
    const votes = await token.getVotes(account);
    const count = await dao.proposalCount();
    
    setBalance(ethers.formatEther(balance));
    setVotingPower(ethers.formatEther(votes));
    setProposalCount(Number(count));
    
    // Load proposals
    const proposalsList = [];
    for (let i = 1; i <= Number(count); i++) {
      const proposal = await dao.proposals(i);
      const state = await dao.getProposalState(i);
      proposalsList.push({
        id: i,
        proposer: proposal.proposer,
        description: proposal.description,
        forVotes: ethers.formatEther(proposal.forVotes),
        againstVotes: ethers.formatEther(proposal.againstVotes),
        state: ['Pending', 'Active', 'Succeeded', 'Defeated', 'Executed'][Number(state)]
      });
    }
    setProposals(proposalsList);
  };

  const createProposal = async () => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const dao = new ethers.Contract(contractsData.DAOGovernance, daoAbi, signer);
    const tx = await dao.propose(description);
    await tx.wait();
    alert('Proposal created!');
    setDescription('');
    await loadData(provider, account);
  };

  const vote = async (id: number, support: boolean) => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const dao = new ethers.Contract(contractsData.DAOGovernance, daoAbi, signer);
    
    
    const tx = await dao.vote(id, support);
    await tx.wait();
    alert(support ? 'Voted YES!' : 'Voted NO!');
    await loadData(provider, account);
  };

  const executeProposal = async (id: number) => {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const dao = new ethers.Contract(contractsData.DAOGovernance, daoAbi, signer);
    
    
    const tx = await dao.executeProposal(id);
    await tx.wait();
    alert('Proposal executed!');
    await loadData(provider, account);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
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
            <div className="bg-gray-800 p-6 rounded-lg mb-8">
              <p className="mb-2"><strong>Account:</strong> {account}</p>
              <p className="mb-2"><strong>Balance:</strong> {balance} DGOV</p>
              <p><strong>Voting Power:</strong> {votingPower}</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Create Proposal */}
              <div className="bg-gray-800 p-6 rounded-lg">
                <h2 className="text-2xl mb-4">Create Proposal</h2>
                <input
                  type="text"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-3 rounded bg-gray-700 mb-4"
                  placeholder="Proposal description"
                />
                <button 
                  onClick={createProposal}
                  className="bg-green-600 px-6 py-3 rounded hover:bg-green-700 w-full"
                >
                  Create Proposal
                </button>
              </div>

              {/* Quick Vote */}
              <div className="bg-gray-800 p-6 rounded-lg">
                <h2 className="text-2xl mb-4">Quick Vote</h2>
                <input
                  type="number"
                  value={proposalId}
                  onChange={(e) => setProposalId(e.target.value)}
                  className="w-full p-3 rounded bg-gray-700 mb-4"
                  placeholder="Proposal ID"
                />
                <div className="flex gap-4">
                  <button 
                    onClick={() => vote(parseInt(proposalId), true)}
                    className="bg-green-600 px-6 py-3 rounded hover:bg-green-700 flex-1"
                  >
                    Vote YES
                  </button>
                  <button 
                    onClick={() => vote(parseInt(proposalId), false)}
                    className="bg-red-600 px-6 py-3 rounded hover:bg-red-700 flex-1"
                  >
                    Vote NO
                  </button>
                </div>
              </div>
            </div>

            {/* Proposals List */}
            <div className="mt-8">
              <h2 className="text-2xl mb-4">All Proposals ({proposalCount})</h2>
              <div className="space-y-4">
                {proposals.map((proposal) => (
                  <div key={proposal.id} className="bg-gray-800 p-6 rounded-lg">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h3 className="text-xl font-bold">#{proposal.id}: {proposal.description}</h3>
                        <p className="text-sm text-gray-400">Proposer: {proposal.proposer.slice(0, 10)}...</p>
                      </div>
                      <span className={`px-3 py-1 rounded text-sm ${
                        proposal.state === 'Active' ? 'bg-blue-600' :
                        proposal.state === 'Succeeded' ? 'bg-green-600' :
                        proposal.state === 'Executed' ? 'bg-purple-600' :
                        'bg-red-600'
                      }`}>
                        {proposal.state}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-green-400">For: {proposal.forVotes}</p>
                      </div>
                      <div>
                        <p className="text-red-400">Against: {proposal.againstVotes}</p>
                      </div>
                    </div>

                    <div className="flex gap-4">
                      <button 
                        onClick={() => vote(proposal.id, true)}
                        disabled={proposal.state !== 'Active'}
                        className="bg-green-600 px-4 py-2 rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Vote YES
                      </button>
                      <button 
                        onClick={() => vote(proposal.id, false)}
                        disabled={proposal.state !== 'Active'}
                        className="bg-red-600 px-4 py-2 rounded hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Vote NO
                      </button>
                      <button 
                        onClick={() => executeProposal(proposal.id)}
                        disabled={proposal.state !== 'Succeeded'}
                        className="bg-purple-600 px-4 py-2 rounded hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Execute
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}