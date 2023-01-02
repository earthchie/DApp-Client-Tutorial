const {ethers} = require('ethers');

async function app(){

    // RPC list: https://chainlist.org/
    const provider = new ethers.providers.JsonRpcProvider('https://rpc-l1.jibchain.net');

    const balance = await provider.getBalance('0x9999999d46618d114C133e8746396c5bF0090b2B');
    console.log('My Balance is:', ethers.utils.formatEther(balance));

}

app();
