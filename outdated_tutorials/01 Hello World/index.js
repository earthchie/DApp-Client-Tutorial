const {ethers} = require('ethers');

async function app(){

    // RPC list: https://chainlist.org/
    const provider = new ethers.providers.JsonRpcProvider('https://rpc-l1.jibchain.net');

    const blockNumber = await provider.getBlockNumber();
    console.log('Hello World!');
    console.log('Lastest block number is:', blockNumber);

    const wallet = ethers.Wallet.createRandom(); // create wallet
    console.log('Address: ', wallet.address);
    console.log('Private Key: ', wallet.privateKey);
    console.log('Mnemonic: ', wallet.mnemonic);

}

app();
