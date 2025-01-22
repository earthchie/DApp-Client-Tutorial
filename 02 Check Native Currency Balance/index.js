const { ethers } = require('ethers');

async function app() {

    // RPC list: https://chainlist.org/
    const provider = new ethers.providers.JsonRpcProvider('https://1rpc.io/sepolia');

    const balance = await provider.getBalance('0x8888888812576f4C14E4D4381cD90f9C02DA44F6'); // private key: 0x45920de905d32f34678a1ec1d91c01b7dadf418e0b302d683d14de36a0b1a555
    console.log('My Balance is:', +ethers.utils.formatEther(balance));

    // TIPS: You can get Native for free at https://cloud.google.com/application/web3/faucet/ethereum/sepolia

}

app();
