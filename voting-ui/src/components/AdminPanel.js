import React, { useState, useEffect } from 'react';
import { getContract, getGanacheAccount } from '../utils/contract';

const AdminPanel = () => {
  const [account, setAccount] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [votingDuration, setVotingDuration] = useState(5);
  const [votingActive, setVotingActive] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [results, setResults] = useState([]);
  const [voters, setVoters] = useState([]);

  useEffect(() => {
    checkAdminStatus();
    loadVotingStatus();
  }, []);

  const checkAdminStatus = async () => {
    try {
      const acc = await getGanacheAccount();
      setAccount(acc);
      
      const contract = getContract();
      const adminAddress = await contract.methods.admin().call();
      
      setIsAdmin(adminAddress.toLowerCase() === acc.toLowerCase());
      
      if (adminAddress.toLowerCase() !== acc.toLowerCase()) {
        setMessage('⚠️ You are not an admin. Only the contract deployer can access this panel.');
      }
    } catch (err) {
      console.error("Admin check failed:", err);
      setMessage('❌ Error checking admin status: ' + err.message);
    }
  };

  const loadVotingStatus = async () => {
    try {
      const contract = getContract();
      const status = await contract.methods.getVotingStatus().call();
      
      setVotingActive(status.active);
      setTimeRemaining(parseInt(status.timeRemaining));
      
      // Load results
      const votes1 = await contract.methods.getVotes(1).call();
      const votes2 = await contract.methods.getVotes(2).call();
      const votes3 = await contract.methods.getVotes(3).call();
      
      setResults([
        { id: 1, name: 'Alice', votes: parseInt(votes1) },
        { id: 2, name: 'Bob', votes: parseInt(votes2) },
        { id: 3, name: 'Charlie', votes: parseInt(votes3) }
      ]);
      
    } catch (err) {
      console.log("Could not load voting status:", err);
    }
  };

  const startVoting = async () => {
    if (!isAdmin) {
      setMessage('❌ Only admin can start voting');
      return;
    }
    
    try {
      setLoading(true);
      setMessage('');
      
      const contract = getContract();
      
      await contract.methods.startVoting(votingDuration).send({
        from: account,
        gas: 300000,
        type: '0x0'
      });
      
      setMessage(`✅ Voting started for ${votingDuration} minutes!`);
      setVotingActive(true);
      
      // Update status
      setTimeout(() => {
        loadVotingStatus();
      }, 2000);
      
    } catch (err) {
      console.error("Start voting failed:", err);
      setMessage('❌ Failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const endVoting = async () => {
    if (!isAdmin) {
      setMessage('❌ Only admin can end voting');
      return;
    }
    
    try {
      setLoading(true);
      setMessage('');
      
      const contract = getContract();
      
      await contract.methods.endVoting().send({
        from: account,
        gas: 300000,
        type: '0x0'
      });
      
      setMessage('✅ Voting ended!');
      setVotingActive(false);
      
      // Update results
      setTimeout(() => {
        loadVotingStatus();
      }, 2000);
      
    } catch (err) {
      console.error("End voting failed:", err);
      setMessage('❌ Failed: ' + err.message);
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

  if (!isAdmin) {
    return (
      <div style={{ padding: '40px', textAlign: 'center' }}>
        <h2>Admin Panel</h2>
        <div style={{ 
          background: '#fff3cd', 
          padding: '20px', 
          borderRadius: '8px',
          marginTop: '20px',
          maxWidth: '600px',
          margin: '20px auto'
        }}>
          <h3 style={{ color: '#856404' }}>⚠️ Access Denied</h3>
          <p>{message || 'Only the contract deployer can access the admin panel.'}</p>
          <p><strong>Your account:</strong> {account.slice(0, 10)}...{account.slice(-8)}</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
      <h2>👑 Admin Panel</h2>
      <p><strong>Admin Account:</strong> {account.slice(0, 10)}...{account.slice(-8)}</p>
      
      {message && (
        <div style={{ 
          padding: '10px', 
          margin: '10px 0',
          background: message.includes('✅') ? '#d4edda' : '#f8d7da',
          color: message.includes('✅') ? '#155724' : '#721c24',
          borderRadius: '4px'
        }}>
          {message}
        </div>
      )}

      {/* Voting Control Card */}
      <div style={{ 
        background: 'white', 
        padding: '20px', 
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        marginBottom: '20px'
      }}>
        <h3>Voting Control</h3>
        
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px' }}>Duration (minutes):</label>
          <input
            type="number"
            value={votingDuration}
            onChange={(e) => setVotingDuration(e.target.value)}
            min="1"
            max="60"
            style={{ width: '100px', padding: '8px' }}
          />
        </div>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            onClick={startVoting}
            disabled={loading || votingActive}
            style={{ 
              padding: '10px 20px',
              background: votingActive ? '#ccc' : '#4CAF50',
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
              padding: '10px 20px',
              background: !votingActive ? '#ccc' : '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: !votingActive ? 'not-allowed' : 'pointer'
            }}
          >
            End Voting
          </button>
        </div>
        
        {votingActive && (
          <div style={{ marginTop: '15px', padding: '10px', background: '#e8f5e8', borderRadius: '4px' }}>
            <p><strong>Status:</strong> Active</p>
            <p><strong>Time Remaining:</strong> {formatTime(timeRemaining)}</p>
          </div>
        )}
      </div>

      {/* Results Card */}
      <div style={{ 
        background: 'white', 
        padding: '20px', 
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
      }}>
        <h3>Current Results</h3>
        <button 
          onClick={loadVotingStatus}
          style={{ 
            marginBottom: '15px',
            padding: '8px 16px',
            background: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          🔄 Refresh Results
        </button>
        
        {results.map(candidate => (
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
        
        <div style={{ marginTop: '15px', padding: '10px', background: '#f0f0f0', borderRadius: '4px' }}>
          <p><strong>Total Votes:</strong> {results.reduce((sum, c) => sum + c.votes, 0)}</p>
          <p><strong>Voting Status:</strong> {votingActive ? 'Active' : 'Inactive'}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;