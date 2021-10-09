const {ethers} = require('ethers');

async function app(){

    // BSC RPC list: https://docs.binance.org/smart-chain/developer/rpc.html
    const provider = new ethers.providers.JsonRpcProvider('https://bsc-dataseed.binance.org/');

    const addr = {
        Factory: '0xca143ce32fe78f1f7019d7d551a6402fc5350c73', // PancakeSwap V2 Factory
        BTC: '0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c', // BTCB contract address
        BUSD: '0xe9e7cea3dedca5984780bafc599bd69add087d56' // BUSD contract address
    }

    // find a pair address from Factory contract
    const FactoryContract = new ethers.Contract(addr.Factory, [ 
        'function getPair(address tokenA, address tokenB) external view returns (address pair)'
    ], provider);
    addr.BTC_BUSD = await FactoryContract.getPair(addr.BTC, addr.BUSD);
    console.log('BTC_BUSD Pair Address is: ', addr.BTC_BUSD);

    // instance pair contract
    const PairContract = new ethers.Contract(addr.BTC_BUSD, [
        'function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)'
    ], provider);

    const reserves = await PairContract.getReserves(); // get reserves of tokens
    const price = reserves[1]/reserves[0]; // price = BTC reserves / BUSD reserves

    console.log('1 BTC = ', price,' BUSD');
}
app();