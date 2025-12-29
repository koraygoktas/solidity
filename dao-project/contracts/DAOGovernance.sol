// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./GovernanceToken.sol";

contract DAOGovernance is Ownable {
    GovernanceToken public governanceToken;
    
    uint256 public proposalCount;
    uint256 public constant VOTING_PERIOD = 300;
    uint256 public constant MIN_VOTES_REQUIRED = 100 * 10**18;
    
    enum ProposalState { Pending, Active, Succeeded, Defeated, Executed }
    
    struct Proposal {
        uint256 id;
        address proposer;
        string description;
        uint256 forVotes;
        uint256 againstVotes;
        uint256 startBlock;
        uint256 endTime;
        bool executed;
        
    }
    mapping(uint256 => mapping(address => bool)) public hasVoted;
    mapping(uint256 => Proposal) public proposals;
    
    event ProposalCreated(uint256 indexed proposalId, address proposer, string description);
    event Voted(uint256 indexed proposalId, address voter, bool support, uint256 votes);
    event ProposalExecuted(uint256 indexed proposalId);
    
    constructor(address _governanceToken) Ownable(msg.sender) {
        governanceToken = GovernanceToken(_governanceToken);
    }
    
    function propose(string memory description) external returns (uint256) {
        require(governanceToken.getVotes(msg.sender) >= MIN_VOTES_REQUIRED, "Not enough votes");
        
        proposalCount++;
        uint256 proposalId = proposalCount;
        
        Proposal storage newProposal = proposals[proposalId];
        newProposal.id = proposalId;
        newProposal.proposer = msg.sender;
        newProposal.description = description;
        newProposal.startBlock = block.number;
        newProposal.endTime = block.timestamp + VOTING_PERIOD;
        newProposal.executed = false;
        
        emit ProposalCreated(proposalId, msg.sender, description);
        return proposalId;
    }
    
    function vote(uint256 proposalId, bool support) external {
        Proposal storage proposal = proposals[proposalId];
        require(block.timestamp < proposal.endTime, "Voting ended");
        require(!hasVoted[proposalId][msg.sender], "Already voted");
        
        uint256 votes = governanceToken.getPastVotes(msg.sender, proposal.startBlock);
        require(votes > 0, "No voting power");
        
         hasVoted[proposalId][msg.sender] = true;
        
        if (support) {
            proposal.forVotes += votes;
        } else {
            proposal.againstVotes += votes;
        }
        
        emit Voted(proposalId, msg.sender, support, votes);
    }
    
    function getProposalState(uint256 proposalId) public view returns (ProposalState) {
        Proposal storage proposal = proposals[proposalId];
        
        if (proposal.executed) {
            return ProposalState.Executed;
        }
        
        if (block.timestamp < proposal.endTime) {
            return ProposalState.Active;
        }
        
        if (proposal.forVotes > proposal.againstVotes) {
            return ProposalState.Succeeded;
        } else {
            return ProposalState.Defeated;
        }
    }
    
    function executeProposal(uint256 proposalId) external {
        require(getProposalState(proposalId) == ProposalState.Succeeded, "Proposal not succeeded");
        
        Proposal storage proposal = proposals[proposalId];
        proposal.executed = true;
        
        emit ProposalExecuted(proposalId);
    }
}