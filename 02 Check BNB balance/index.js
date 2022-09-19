const {ethers} = require('ethers');

async function app(){

    // BSC RPC list: https://docs.binance.org/smart-chain/developer/rpc.html
    const provider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed.binance.org/');

    const balance = await provider.getBalance('0x9999999d46618d114C133e8746396c5bF0090b2B');
    console.log('My BNB Balance is:', ethers.utils.formatEther(balance));

}

app();
