// SPDX-License-Identifier: MIT
pragma solidity ^0.5.16;

contract Voting {
    string public candidate1 = "Alice";
    string public candidate2 = "Bob";
    string public candidate3 = "Charlie";
    
    uint256 public votes1;
    uint256 public votes2;
    uint256 public votes3;
    
    address public admin;
    bool public votingActive = false;
    uint256 public votingEndTime = 0;
    
    // Track who has voted
    mapping(address => bool) public hasVoted;
    
    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this");
        _;
    }
    
    modifier onlyWhenActive() {
        require(votingActive, "Voting is not active");
        require(block.timestamp < votingEndTime, "Voting period has ended");
        _;
    }
    
    constructor() public {
        admin = msg.sender;
    }
    
    // Start voting with duration in minutes
    function startVoting(uint256 durationInMinutes) public onlyAdmin {
        require(!votingActive, "Voting is already active");
        votingActive = true;
        votingEndTime = block.timestamp + (durationInMinutes * 1 minutes);
    }
    
    // End voting manually
    function endVoting() public onlyAdmin {
        votingActive = false;
        votingEndTime = block.timestamp;
    }
    
    // Vote function - checks if already voted
    function voteForCandidate(uint candidateNumber) public onlyWhenActive {
        require(!hasVoted[msg.sender], "You have already voted");
        require(candidateNumber >= 1 && candidateNumber <= 3, "Invalid candidate");
        
        hasVoted[msg.sender] = true;
        
        if (candidateNumber == 1) {
            votes1++;
        } else if (candidateNumber == 2) {
            votes2++;
        } else if (candidateNumber == 3) {
            votes3++;
        }
    }
    
    function getVotes(uint candidateNumber) public view returns (uint256) {
        if (candidateNumber == 1) return votes1;
        if (candidateNumber == 2) return votes2;
        if (candidateNumber == 3) return votes3;
        return 0;
    }
    
    // Check voting status with time remaining
    function getVotingStatus() public view returns (
        bool active, 
        uint256 endTime, 
        uint256 timeRemaining
    ) {
        if (votingActive && block.timestamp < votingEndTime) {
            timeRemaining = votingEndTime - block.timestamp;
        } else {
            timeRemaining = 0;
        }
        return (votingActive, votingEndTime, timeRemaining);
    }
    
    // Check if an address has voted
    function checkIfVoted(address voter) public view returns (bool) {
        return hasVoted[voter];
    }
}