const { ethers } = require('ethers');

async function app() {

    // RPC list: https://chainlist.org/
    const provider = new ethers.providers.JsonRpcProvider('https://1rpc.io/sepolia');

    const blockNumber = await provider.getBlockNumber();
    console.log('Hello World!');
    console.log('Lastest block number is:', blockNumber);

    const feeData = await provider.getFeeData();
    console.log('gasPrice:', +ethers.utils.formatUnits(feeData.gasPrice, 'gwei'), 'gwei');
    console.log('maxFeePerGas:', +ethers.utils.formatUnits(feeData.maxFeePerGas, 'gwei'), 'gwei');
    console.log('maxPriorityFeePerGas:', +ethers.utils.formatUnits(feeData.maxPriorityFeePerGas, 'gwei'), 'gwei');

    const wallet = ethers.Wallet.createRandom(); // create wallet
    console.log('Address: ', wallet.address);
    console.log('Private Key: ', wallet.privateKey);
    console.log('Mnemonic: ', wallet.mnemonic);

}

app();
