const {ethers} = require('ethers');

// BSC RPC list: https://docs.binance.org/smart-chain/developer/rpc.html
const provider = new ethers.providers.JsonRpcProvider('https://data-seed-prebsc-1-s1.binance.org:8545/'); // TESTNET
const privateKey = '0xea0beba96beab7b2b8a79b2142f89c07a51342d6a2ebb0822267096d5b65abf7'; // address: 0x8526aDDf97F478bEb92223383778A4e8688951D9
const wallet = new ethers.Wallet(privateKey, provider);

const Router = new ethers.Contract('0x9Ac64Cc6e4415144C455BD8E4837Fea55603e5c3', [
    'function getAmountsOut(uint amountIn, address[] calldata path) external view returns (uint[] memory amounts)',
    'function swapExactTokensForTokens(uint amountIn, uint amountOutMin, address[] calldata path, address to, uint deadline) external returns (uint[] memory amounts)'
], wallet);

const BUSD = new ethers.Contract('0x78867BbEeF44f2326bF8DDd1941a4439382EF2A7', [
    'function balanceOf(address account) external view returns (uint256)',
    'function approve(address spender, uint256 amount) external returns (bool)',
    'function allowance(address _owner, address spender) external view returns (uint256)'
], wallet);

const ETH = new ethers.Contract('0x8babbb98678facc7342735486c851abd7a0d17ca', [
    'function balanceOf(address account) external view returns (uint256)',
    'function approve(address spender, uint256 amount) external returns (bool)',
    'function allowance(address _owner, address spender) external view returns (uint256)'
], wallet);

const WBNB = new ethers.Contract('0xae13d989dac2f0debff460ac112a837c89baa7cd', [
    'function balanceOf(address account) external view returns (uint256)',
    'function approve(address spender, uint256 amount) external returns (bool)',
    'function allowance(address _owner, address spender) external view returns (uint256)'
], wallet);

async function app(){

    // the rest ratio will be BUSD by default
    // below setup means: ETH 35%, WBNB 35% and BUSD 30%
    const rebalance = {
        ETH: {
            contract: ETH,
            ratio: 0.35 // 35%
        },
        WBNB: {
            contract: WBNB,
            ratio: 0.35 // 35%
        }
    };

    bot(wallet, rebalance);
}

app();

async function bot(wallet, rebalance){

    // loop to calculate individual token value & total port value
    let totalValue = parseFloat(ethers.utils.formatUnits(await BUSD.balanceOf(wallet.address)));

    const tokens = Object.keys(rebalance);
    for(let i = 0; i < tokens.length; i++){
        const token = tokens[i];

        rebalance[token].price = await getExchangeRateInBUSD(token, wallet);
        rebalance[token].amount = ethers.utils.formatUnits(await rebalance[token].contract.balanceOf(wallet.address));
        rebalance[token].values = rebalance[token].amount * rebalance[token].price;
        totalValue += rebalance[token].values;
    }

    // loop to calculate ratio of each token
    for(let i = 0; i < tokens.length; i++){
        const token = tokens[i];


        rebalance[token].ratioNow = rebalance[token].values / totalValue;
        rebalance[token].ratioDiff = rebalance[token].ratioNow - rebalance[token].ratio;

        if(Math.abs(rebalance[token].ratioDiff) > 0.01){ // if position change is larger than 1%, do buy or sell.

            if(rebalance[token].ratioDiff > 0){ // holds more than it should, sell
                const sellAmount = ethers.utils.parseUnits((rebalance[token].ratioDiff * totalValue / rebalance[token].price).toString());
                console.log('sell', ethers.utils.formatUnits(sellAmount), token);
                await swap(wallet, rebalance[token].contract, sellAmount, BUSD);
            }else{  // holds less than it should, buy
                console.log(rebalance[token].ratioDiff * totalValue);
                const BUSDAmount = ethers.utils.parseUnits(Math.abs(rebalance[token].ratioDiff * totalValue).toString());
                console.log('buy', token, 'for', ethers.utils.formatUnits(BUSDAmount), 'BUSD');
                await swap(wallet, BUSD, BUSDAmount, rebalance[token].contract);
            }

        }
    }
    
    console.log(rebalance);

    setTimeout(function(){
        bot(wallet, rebalance);
    }, 60000); // sleep for 1 minute, then attempt to rebalance again

}

async function getExchangeRateInBUSD(token, provider){

    const pairAddr = {
        ETH: '0x6a9D99Db0bD537f3aC57cBC316A9DD8b11A703aC',
        WBNB: '0xe0e92035077c39594793e61802a350347c320cf2'
    }

    // instance pair contract.
    // see chapter 6 for how to find pair address
    const PairContract = new ethers.Contract(pairAddr[token], [
        'function getReserves() external view returns (uint112 reserve0, uint112 reserve1, uint32 blockTimestampLast)'
    ], provider);

    const reserves = await PairContract.getReserves(); // get reserves of tokens
    const price = reserves[0]/reserves[1]; // price = token1 reserves / token2 reserves

    return price;
}

async function swap(wallet, TokenIn, amount, TokenOut){
    
    const slippage = 0.1; // slippage percentage
    const deadline = Math.floor(new Date().getTime() / 1000) + 60 * 10; // 10 minutes from now
    const gas = {
        gasPrice: ethers.utils.parseUnits('10', 'gwei'),
        gasLimit: '150000'
    };

    if(amount > 0){    
        const estimateReceive = await Router.getAmountsOut(amount, [TokenIn.address, TokenOut.address]); // estimate TokenOut recieved
        const minReceive = parseInt(estimateReceive[1] - estimateReceive[1] * slippage / 100); // set minimum TokenOut received

        // give an allowance to the Router when needed
        const TokenInAllowance = await TokenIn.allowance(wallet.address, Router.address); // get allowance amount
        if(TokenInAllowance < amount){
            await TokenIn.approve(Router.address, amount.toString(), gas); // grant Router ability to transfer ETH out of our wallet
        }
        console.log('Swapping...');
        // swapping heppened here
        const trx = await Router.swapExactTokensForTokens(
            amount.toString(), 
            minReceive.toString(), 
            [TokenIn.address, TokenOut.address], 
            wallet.address, 
            deadline, 
            gas
        );
        console.log('Transaction hash is:', trx.hash);
        await trx.wait(); // wait until transaction confirmed
        console.log('Transaction confirmed.');
    }
}