const { ethers } = require("ethers");
const ChessABI = require('../src/contractAbi/chess.json');

const chessContractAddress = '0xCAb0B71462c1c1382da671bA20d66638d76e3C9a';
const rpc = 'https://data-seed-prebsc-1-s1.binance.org:8545/';
const provider = new ethers.providers.JsonRpcProvider(rpc);
// const userPvtKey = 'febc5346232d248d35bad2f26c013b1991fd2a02eb8f4237e98be26bf3fd1810';
const secUserPvtKey = '8cc7ee5baa46b99f36955211bb607d62214b19942a532138def190a410c84e63';
const wallet = new ethers.Wallet(secUserPvtKey, provider);
const contract = new ethers.Contract(chessContractAddress, ChessABI, wallet);



const joinGame = async () => {
    await contract.joinSecondPlayer().then(() => {
        console.log("complete");
        return "complete";
    })
};

// to do

joinGame()

