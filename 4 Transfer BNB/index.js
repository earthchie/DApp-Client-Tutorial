const {ethers} = require('ethers');

async function app(){

    // BSC RPC list: https://docs.binance.org/smart-chain/developer/rpc.html
    const provider = new ethers.providers.JsonRpcProvider('https://data-seed-prebsc-1-s1.binance.org:8545/'); // TESTNET
    
    const privateKey = '0xea0beba96beab7b2b8a79b2142f89c07a51342d6a2ebb0822267096d5b65abf7'; // address: 0x8526aDDf97F478bEb92223383778A4e8688951D9
    const wallet = new ethers.Wallet(privateKey, provider);

    let balance = await provider.getBalance(wallet.address);
    console.log('My Initial Balance is:', ethers.utils.formatEther(balance));

    // sending 0.1 BNB to 0x4Bd3Cea4dbeCb1bE89e690A049Ce7fa533B1d1eE
    // get free BNB here: https://testnet.binance.org/faucet-smart (TESTNET, of course)
    const trx = await wallet.sendTransaction({
        to: '0x4Bd3Cea4dbeCb1bE89e690A049Ce7fa533B1d1eE', // private key: 0x002d370dbb49f65b232c69852f1148232bafd5c4427c0cf8ee52a1bbb72fe2f8
        value: ethers.utils.parseEther('0.1')
    });
    console.log('Sending...\nTransaction hash: ', trx.hash);
    console.log('waiting transaction to be confirmed...');

    await trx.wait(); // wait until transaction confirmed
    console.log('Transaction confirmed.');

    // check balance
    balance = await provider.getBalance(wallet.address);
    console.log('My Final Balance is:', ethers.utils.formatEther(balance));
}

app();