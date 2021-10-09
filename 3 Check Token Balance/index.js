const {ethers} = require('ethers');

async function app(){

    // BSC RPC list: https://docs.binance.org/smart-chain/developer/rpc.html
    const provider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed.binance.org/');
    
    const BUSD_Contract = new ethers.Contract('0xe9e7cea3dedca5984780bafc599bd69add087d56', [
        'function balanceOf(address account) external view returns (uint256)'
    ], provider);

    const walletAddress = '0x9999999d46618d114C133e8746396c5bF0090b2B';
    const BUSD_balance = await BUSD_Contract.balanceOf(walletAddress);

    console.log('My BUSD Balance is:', ethers.utils.formatUnits(BUSD_balance));

}

app();