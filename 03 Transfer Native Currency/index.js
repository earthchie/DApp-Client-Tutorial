const { ethers } = require('ethers');

async function app() {

    // RPC list: https://chainlist.org/
    const provider = new ethers.providers.JsonRpcProvider('https://1rpc.io/sepolia');

    const privateKey = '0x45920de905d32f34678a1ec1d91c01b7dadf418e0b302d683d14de36a0b1a555'; // address: 0x8888888812576f4C14E4D4381cD90f9C02DA44F6
    const wallet = new ethers.Wallet(privateKey, provider);

    let balance = await provider.getBalance(wallet.address);
    console.log('My Initial Balance is:', +ethers.utils.formatEther(balance));

    // sending 0.001 Native Currency to 0x777777763217D7B01068244118050c607021023d
    const trx = await wallet.sendTransaction({
        to: '0x777777763217D7B01068244118050c607021023d', // private key: 0x4c2d49d5b1e66050ffa9d37ade6bc0a4896ad9d8a7f83fe185af81f4d3ec8109
        value: ethers.utils.parseEther('0.001')
    });
    console.log('Sending...\nTransaction hash: ', trx.hash);
    console.log('Waiting for transaction to be confirmed...');

    await trx.wait(); // wait until transaction confirmed
    console.log('Transaction confirmed.');

    // check balance
    balance = await provider.getBalance(wallet.address);
    console.log('My Final Balance is:', +ethers.utils.formatEther(balance));
}

app();
