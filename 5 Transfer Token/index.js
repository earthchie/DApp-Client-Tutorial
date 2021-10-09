const {ethers} = require('ethers');

async function app(){

    // BSC RPC list: https://docs.binance.org/smart-chain/developer/rpc.html
    const provider = new ethers.providers.JsonRpcProvider('https://data-seed-prebsc-1-s1.binance.org:8545/'); // TESTNET
    
    const privateKey = '0xea0beba96beab7b2b8a79b2142f89c07a51342d6a2ebb0822267096d5b65abf7'; // address: 0x8526aDDf97F478bEb92223383778A4e8688951D9
    const wallet = new ethers.Wallet(privateKey, provider);

    const BUSD_Contract = new ethers.Contract('0x78867BbEeF44f2326bF8DDd1941a4439382EF2A7', [
        'function balanceOf(address account) external view returns (uint256)',
        'function transfer(address recipient, uint256 amount) external returns (bool)'
    ], wallet);

    let balance = await BUSD_Contract.balanceOf(wallet.address);
    console.log('My Initial BUSD Balance is:', ethers.utils.formatUnits(balance));

    // sending 1 BUSD to 0x4Bd3Cea4dbeCb1bE89e690A049Ce7fa533B1d1eE
    // get free BNB here: https://testnet.binance.org/faucet-smart (TESTNET, of course)
    // then swap BNB to BUSD here https://pancake.kiemtienonline360.com/#/swap
    const trx = await BUSD_Contract.transfer(
        '0x4Bd3Cea4dbeCb1bE89e690A049Ce7fa533B1d1eE', // private key: 0x002d370dbb49f65b232c69852f1148232bafd5c4427c0cf8ee52a1bbb72fe2f8
        ethers.utils.parseUnits('1')
    );
    console.log('Sending...\nTransaction hash: ', trx.hash);
    console.log('waiting transaction to be confirmed...');

    await trx.wait(); // wait until transaction confirmed
    console.log('Transaction confirmed.');

    // check balance
    balance = await BUSD_Contract.balanceOf(wallet.address);
    console.log('My Final BUSD Balance is:', ethers.utils.formatUnits(balance));
}

app();