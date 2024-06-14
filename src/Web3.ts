const { ethers } = require("ethers");

// Replace with your actual contract address and ABI
const contractAddress = '0x4ec338Fc16FE1Ad097665c744E5C86C2F5D585Db';
const abi = require('../src/contractAbi/chess.json');
const ERC20_ABI = require('../src/contractAbi/token.json');

// Replace with your provider URL (e.g., Alchemy, Infura)
const providerUrl = 'https://data-seed-prebsc-1-s1.binance.org:8545/';

// Replace with your token address (if applicable)
const tokenAddress = '0x38fEC163A8E32b95dC656f22d650ec7af7065Ad1'; // Optional, only needed if transferring tokens



async function joinGame() {
    try {
        // Read the wallet private key from a secure environment variable (recommended)
        const walletPrivateKey = "febc5346232d248d35bad2f26c013b1991fd2a02eb8f4237e98be26bf3fd1810";
        if (!walletPrivateKey) {
            throw new Error('Missing wallet private key. Set the WALLET_PRIVATE_KEY environment variable.');
        }

        const provider = new ethers.providers.JsonRpcProvider(providerUrl);
        const wallet = new ethers.Wallet(walletPrivateKey, provider);
        const contract = new ethers.Contract(contractAddress, abi, provider);


        const connectedContract = contract.connect(wallet);


        // Allowances and Balances (if applicable)
        if (tokenAddress) {
            const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, provider); // Assuming ERC20 standard

            const allowance = await tokenContract.allowance(wallet.address, contractAddress);
            if (allowance.lt(depositAmount)) {
                throw new Error('Contract not approved to transfer tokens');
            }

            const balance = await tokenContract.balanceOf(wallet.address);
            if (balance.lt(depositAmount)) {
                throw new Error('Insufficient token balance');
            }
        }

        // Call the joinGame function (assuming no arguments besides deposit amount)
        const tx = await connectedContract.joinSecondPlayer(); // Use value for ETH deposits (optional)
        console.log('Transaction hash:', tx.hash);
        const receipt = await tx.wait();
        console.log('Transaction confirmed:', receipt.confirmationCount);

    } catch (error) {
        console.error('Error joining game:', error);
        // Handle error appropriately (e.g., display error message to user)
    }
}

// Example usage
const depositAmount = ethers.utils.parseEther('1.0'); // Assuming deposit is in ETH

joinGame();