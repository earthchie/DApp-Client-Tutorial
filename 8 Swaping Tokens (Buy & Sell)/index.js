const {ethers} = require('ethers');

async function app(){

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

    const slippage = 0.1; // slippage percentage
    const deadline = Math.floor(new Date().getTime() / 1000) + 60 * 10; // 10 minutes from now
    const gas = {
        gasPrice: ethers.utils.parseUnits('10', 'gwei'),
        gasLimit: '150000'
    };

    /***********\
     * Buy ETH *
    \***********/
    
    const BUSDAmountToPay = ethers.utils.parseUnits('5'); // 5 BUSD
    if(BUSDAmountToPay > 0){
        const estimateETHReceive = await Router.getAmountsOut(BUSDAmountToPay, [BUSD.address, ETH.address]); // estimate ETH recieve from spending 5 BUSD
        const minETHReceive = parseInt(estimateETHReceive[1] - estimateETHReceive[1] * slippage / 100); // set minimum ETH receive
        
        // give an allowance to the Router when needed
        const BUSDAllowance = await BUSD.allowance(wallet.address, Router.address); // get allowance amount
        if(BUSDAllowance < BUSDAmountToPay){
            await BUSD.approve(Router.address, BUSDAmountToPay.toString(), gas); // grant Router ability to transfer BUSD out of our wallet
        }
        
        console.log('Swapping', 
            ethers.utils.formatUnits(BUSDAmountToPay), 'BUSD for ', 
            ethers.utils.formatUnits(minETHReceive), 'ETH'
        );
        // swapping heppened here
        const buyTrx = await Router.swapExactTokensForTokens(
            BUSDAmountToPay.toString(), 
            minETHReceive.toString(), 
            [BUSD.address, ETH.address], 
            wallet.address, 
            deadline, 
            gas
        );

        console.log('Transaction hash is:', buyTrx.hash);
        await buyTrx.wait(); // wait until transaction confirmed
        console.log('Transaction confirmed.');
    }
    /************\
     * Sell ETH *
    \************/
    
    const ETHAmountToPay = await ETH.balanceOf(wallet.address); // spend all of ETH in our wallet
    if(ETHAmountToPay > 0){        
        const estimateBUSDReceive = await Router.getAmountsOut(ETHAmountToPay, [ETH.address, BUSD.address]); // estimate BUSD recieve from spending all ETH
        const minBUSDReceive = parseInt(estimateBUSDReceive[1] - estimateBUSDReceive[1] * slippage / 100); // set minimum BUSD receive

        // give an allowance to the Router when needed
        const ETHAllowance = await ETH.allowance(wallet.address, Router.address); // get allowance amount
        if(ETHAllowance < ETHAmountToPay){
            await ETH.approve(Router.address, ETHAmountToPay.toString(), gas); // grant Router ability to transfer ETH out of our wallet
        }

        console.log('Swapping', 
            ethers.utils.formatUnits(ETHAmountToPay.toString()), 'ETH for ', 
            ethers.utils.formatUnits(minBUSDReceive.toString()), 'BUSD'
        );
        // swapping heppened here
        const sellTrx = await Router.swapExactTokensForTokens(
            ETHAmountToPay.toString(), 
            minBUSDReceive.toString(), 
            [ETH.address, BUSD.address], 
            wallet.address, 
            deadline, 
            gas
        );
        console.log('Transaction hash is:', sellTrx.hash);
        await sellTrx.wait(); // wait until transaction confirmed
        console.log('Transaction confirmed.');
    }
}

app();