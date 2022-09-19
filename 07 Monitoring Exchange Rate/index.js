const {ethers} = require('ethers');

async function app(){

    // BSC RPC list: https://docs.binance.org/smart-chain/developer/rpc.html
    const provider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed.binance.org/');

    provider.on('block', async (blockNumber) => {

        const price = await getExchangeRateBTCBUSD(provider);

        console.log('Block #' + blockNumber);
        console.log('1 BTC = ', price,' BUSD');

    });
}
app();

async function getExchangeRateBTCBUSD(provider){

    // instance pair contract.
    // see chapter 6 for how to find pair address
    const PairContract = new ethers.Contract('0xF45cd219aEF8618A92BAa7aD848364a158a24F33', [
        'function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)'
    ], provider);

    const reserves = await PairContract.getReserves(); // get reserves of tokens
    const price = reserves[1]/reserves[0]; // price = ETH reserves / BUSD reserves

    return price;
}
