import Web3 from 'web3';

export const connectWallet = async () => {
  try {
    if (!window.ethereum) {
      throw new Error('Please install MetaMask');
    }

    // Request account access
    const accounts = await window.ethereum.request({ 
      method: 'eth_requestAccounts' 
    });
    
    const account = accounts[0];
    
    // Switch to Ganache network if needed
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x539' }], // 1337 in hex
      });
    } catch (switchError) {
      // If network doesn't exist, add it
      if (switchError.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [{
            chainId: '0x539',
            chainName: 'Ganache Local',
            rpcUrls: ['http://127.0.0.1:8545'],
            nativeCurrency: { name: 'ETH', symbol: 'ETH', decimals: 18 },
          }],
        });
      }
    }
    
    return account;
  } catch (error) {
    throw error;
  }
};

// Export the web3 instance that uses MetaMask
let web3;
if (typeof window !== 'undefined' && typeof window.ethereum !== 'undefined') {
  web3 = new Web3(window.ethereum);
} else {
  web3 = new Web3('http://127.0.0.1:8545');
}

export default web3;