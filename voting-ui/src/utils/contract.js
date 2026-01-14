import Web3 from 'web3';
import Voting from '../contracts/Voting.json';

// SIMPLE Web3 instance without hardfork configuration
const web3 = new Web3('http://127.0.0.1:8545');

let votingContract = null;

// Initialize contract
export const initContract = async () => {
  try {
    // Get network ID from Ganache
    const networkId = await web3.eth.net.getId();
    console.log("Network ID:", networkId);
    
    // Find contract for this network
    const deployedNetwork = Voting.networks[networkId];
    
    if (!deployedNetwork) {
      console.error("Contract not found on network", networkId);
      throw new Error('Contract not deployed. Run: truffle migrate --reset');
    }
    
    // Create contract instance
    votingContract = new web3.eth.Contract(Voting.abi, deployedNetwork.address);
    console.log("✅ Contract initialized at:", deployedNetwork.address);
    
    return votingContract;
  } catch (error) {
    console.error("❌ Contract initialization failed:", error);
    throw error;
  }
};

// Get contract instance
export const getContract = () => {
  if (!votingContract) {
    throw new Error('Contract not initialized. Call initContract() first.');
  }
  return votingContract;
};

// Get first Ganache account
export const getGanacheAccount = async () => {
  try {
    const accounts = await web3.eth.getAccounts();
    if (accounts.length === 0) {
      throw new Error('No accounts found in Ganache');
    }
    console.log("Using account:", accounts[0]);
    return accounts[0];
  } catch (error) {
    console.error("Error getting account:", error);
    throw error;
  }
};

// Auto-initialize
initContract().catch(console.error);

export default getContract;