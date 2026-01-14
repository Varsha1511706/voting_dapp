import React, { useState, useEffect } from 'react';
import { getContract, getGanacheAccount } from '../utils/contract';

const VoteNow = () => {
  const [candidates, setCandidates] = useState([
    { id: 1, name: 'Alice', votes: 0 },
    { id: 2, name: 'Bob', votes: 0 },
    { id: 3, name: 'Charlie', votes: 0 }
  ]);
  const [selectedCandidate, setSelectedCandidate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [account, setAccount] = useState('');
  const [votingActive, setVotingActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminMessage, setAdminMessage] = useState('');
  const [votingDuration, setVotingDuration] = useState(5);
  const [initialized, setInitialized] = useState(false);

  // This is your original loadCandidates function
  const loadCandidates = async () => {
    try {
      console.log('Loading candidates...');
      
      const candidatesList = [
        { id: 1, name: 'Alice', votes: 0 },
        { id: 2, name: 'Bob', votes: 0 },
        { id: 3, name: 'Charlie', votes: 0 }
      ];
      
      // If voting has ended, show actual votes
      if (showResults) {
        try {
          const contract = getContract();
          const votes1 = await contract.methods.getVotes(1).call();
          const votes2 = await contract.methods.getVotes(2).call();
          const votes3 = await contract.methods.getVotes(3).call();
          
          candidatesList[0].votes = parseInt(votes1);
          candidatesList[1].votes = parseInt(votes2);
          candidatesList[2].votes = parseInt(votes3);
          
          console.log('Actual votes:', { votes1, votes2, votes3 });
        } catch (voteError) {
          console.log('Could not get votes:', voteError);
        }
      }
      
      setCandidates(candidatesList);
      console.log('Candidates loaded:', candidatesList);
      
    } catch (err) {
      console.error('Failed to load:', err);
      setError('Failed to load candidates: ' + err.message);
    }
  };

  const checkVotingStatus = async () => {
    try {
      const contract = getContract();
      const status = await contract.methods.getVotingStatus().call();
      const active = status.active;
      const remaining = parseInt(status.timeRemaining);
      
      setVotingActive(active);
      setTimeRemaining(remaining);
      
      // Show results if voting is not active OR time is up
      if (!active || remaining === 0) {
        setShowResults(true);
        // Load actual votes
        await loadCandidates();
      } else {
        setShowResults(false);
      }
    } catch (error) {
      console.log('Could not check voting status:', error);
    }
  };

  useEffect(() => {
    const initialize = async () => {
      try {
        console.log("🔧 Initializing app...");
        
        // Wait a moment for contract to initialize
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Get account
        const acc = await getGanacheAccount();
        setAccount(acc);
        console.log("✅ Account loaded:", acc);
        
        // Get contract
        const contract = getContract();
        console.log("✅ Contract loaded");
        
        // Check admin status
        try {
          const adminAddress = await contract.methods.admin().call();
          console.log("Admin address:", adminAddress);
          const isUserAdmin = adminAddress.toLowerCase() === acc.toLowerCase();
          setIsAdmin(isUserAdmin);
          console.log("Is admin?", isUserAdmin);
        } catch (adminError) {
          console.log("⚠️ Could not check admin:", adminError.message);
          setIsAdmin(false);
        }
        
        // Check voting status
        try {
          const status = await contract.methods.getVotingStatus().call();
          console.log("Voting status:", status);
          setVotingActive(status.active);
          setTimeRemaining(parseInt(status.timeRemaining));
          setShowResults(!status.active || parseInt(status.timeRemaining) === 0);
        } catch (statusError) {
          console.log("⚠️ Could not get voting status:", statusError.message);
          setVotingActive(false);
          setShowResults(false);
        }
        
        // Load candidates
        await loadCandidates();
        
        setInitialized(true);
        console.log("🎉 App initialized successfully!");
        
      } catch (err) {
        console.error("❌ Initialization failed:", err);
        setError('Failed to initialize: ' + err.message);
      }
    };
    
    initialize();
  }, []);

  const handleVote = async () => {
    if (!selectedCandidate) return;
    
    if (!votingActive) {
      setError("Voting is not active!");
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      const contract = getContract();
      const candidateId = parseInt(selectedCandidate);
      
      await contract.methods.voteForCandidate(candidateId).send({
        from: account,
        gas: 300000,
        type: '0x0'
      });
      
      alert('✅ Vote submitted!');
      setSelectedCandidate('');
      
      // Refresh if results are visible
      if (showResults) {
        await loadCandidates();
      }
      
    } catch (err) {
      console.error("Vote failed:", err);
      setError("Vote failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const startVoting = async () => {
    try {
      setLoading(true);
      setAdminMessage('');
      
      const contract = getContract();
      
      await contract.methods.startVoting(votingDuration).send({
        from: account,
        gas: 300000,
        type: '0x0'
      });
      
      setAdminMessage(`✅ Voting started for ${votingDuration} minutes!`);
      setVotingActive(true);
      setShowResults(false);
      
      // Refresh status
      await checkVotingStatus();
      
    } catch (err) {
      console.error("Start voting error:", err);
      
      // Check if it's the EIP-1559 error
      if (err.message.includes('Eip1559NotSupportedError') || err.message.includes('eip-1559')) {
        setAdminMessage('❌ Error: Please update Ganache or use legacy transactions.');
      } else {
        setAdminMessage('❌ Error: ' + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const endVoting = async () => {
    try {
      setLoading(true);
      setAdminMessage('');
      
      const contract = getContract();
      
      await contract.methods.endVoting().send({
        from: account,
        gas: 300000,
        type: '0x0'
      });
      
      setAdminMessage('✅ Voting ended!');
      setVotingActive(false);
      setShowResults(true);
      
      // Load final votes
      await loadCandidates();
      
    } catch (err) {
      console.error("End voting failed:", err);
      setAdminMessage("❌ Failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    if (seconds <= 0) return "00:00";
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  // Loading screen
  if (!initialized && !error) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Loading Blockchain Voting System...</h2>
        <p>Connecting to Ganache...</p>
        <div style={{ marginTop: '20px' }}>
          <div style={{ 
            width: '100%', 
            height: '4px', 
            background: '#e0e0e0',
            borderRadius: '2px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: '60%',
              height: '100%',
              background: '#4CAF50',
              animation: 'loading 1.5s infinite'
            }}></div>
          </div>
        </div>
        <style>{`
          @keyframes loading {
            0% { transform: translateX(-100%); }
            100% { transform: translateX(300%); }
          }
        `}</style>
      </div>
    );
  }

  // Error screen
  if (error) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
        <h2 style={{ color: '#d32f2f' }}>❌ Connection Error</h2>
        <p style={{ 
          background: '#ffebee', 
          padding: '15px', 
          borderRadius: '8px',
          margin: '20px 0'
        }}>
          {error}
        </p>
        <div style={{ textAlign: 'left', background: '#f5f5f5', padding: '20px', borderRadius: '8px' }}>
          <h3>Troubleshooting steps:</h3>
          <ol>
            <li>Make sure Ganache is running: <code>npx ganache-cli --port 8545</code></li>
            <li>Deploy contract: <code>truffle migrate --reset</code></li>
            <li>Check if Voting.json has admin functions</li>
            <li>Refresh the page</li>
          </ol>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>🗳️ Blockchain Voting System</h2>
      <p><strong>Account:</strong> {account.slice(0, 10)}...{account.slice(-8)}</p>
      
      {isAdmin && (
        <div style={{ background: '#e8f4fd', padding: '15px', borderRadius: '8px', marginBottom: '20px' }}>
          <h3>👑 Admin Panel</h3>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
            <input
              type="number"
              value={votingDuration}
              onChange={(e) => setVotingDuration(e.target.value)}
              min="1"
              max="60"
              style={{ padding: '8px', width: '80px' }}
            />
            <button 
              onClick={startVoting} 
              disabled={loading || votingActive}
              style={{ 
                padding: '8px 15px',
                backgroundColor: votingActive ? '#ccc' : '#4CAF50',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: votingActive ? 'not-allowed' : 'pointer'
              }}
            >
              {votingActive ? 'Voting Active' : 'Start Voting'}
            </button>
            <button 
              onClick={endVoting} 
              disabled={loading || !votingActive}
              style={{ 
                padding: '8px 15px',
                backgroundColor: !votingActive ? '#ccc' : '#f44336',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: !votingActive ? 'not-allowed' : 'pointer'
              }}
            >
              End Voting
            </button>
          </div>
          {adminMessage && (
            <p style={{ 
              marginTop: '10px',
              padding: '8px',
              background: adminMessage.includes('✅') ? '#d4edda' : '#f8d7da',
              color: adminMessage.includes('✅') ? '#155724' : '#721c24',
              borderRadius: '4px'
            }}>
              {adminMessage}
            </p>
          )}
        </div>
      )}
      
      <div style={{ 
        background: votingActive ? '#d4edda' : '#fff3cd', 
        padding: '15px', 
        borderRadius: '8px',
        marginBottom: '20px'
      }}>
        <h3 style={{ marginTop: 0 }}>
          {votingActive ? '⏳ Voting Active' : 
           showResults ? '🏆 Results Available' : '📋 Voting Not Started'}
        </h3>
        {votingActive && (
          <p><strong>Time remaining:</strong> {formatTime(timeRemaining)}</p>
        )}
      </div>
      
      {votingActive && (
        <div style={{ marginBottom: '20px' }}>
          <h3>Cast Your Vote</h3>
          <select
            value={selectedCandidate}
            onChange={(e) => setSelectedCandidate(e.target.value)}
            disabled={loading}
            style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
          >
            <option value="">Select candidate</option>
            {candidates.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <button 
            onClick={handleVote} 
            disabled={loading || !selectedCandidate}
            style={{ 
              width: '100%', 
              padding: '12px', 
              backgroundColor: loading ? '#ccc' : '#28a745', 
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Processing...' : 'Vote'}
          </button>
        </div>
      )}
      
      {showResults && (
        <div>
          <h3>Results</h3>
          {candidates.map(candidate => (
            <div key={candidate.id} style={{ 
              padding: '10px', 
              margin: '5px 0', 
              background: '#f8f9fa', 
              borderRadius: '4px',
              display: 'flex',
              justifyContent: 'space-between'
            }}>
              <span>{candidate.name}</span>
              <strong>{candidate.votes} votes</strong>
            </div>
          ))}
          
          <button 
            onClick={loadCandidates}
            style={{ 
              marginTop: '15px',
              padding: '10px 20px',
              backgroundColor: '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            🔄 Refresh Results
          </button>
        </div>
      )}
      
      {!showResults && !votingActive && (
        <div>
          <h3>Candidates</h3>
          <p><em>Vote counts hidden during voting period</em></p>
          {candidates.map(candidate => (
            <div key={candidate.id} style={{ 
              padding: '10px', 
              margin: '5px 0', 
              background: '#f8f9fa', 
              borderRadius: '4px'
            }}>
              {candidate.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VoteNow;