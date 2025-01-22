const { ethers } = require('ethers');

async function app() {

    // RPC list: https://chainlist.org/
    const provider = new ethers.providers.JsonRpcProvider('https://1rpc.io/sepolia');

    const privateKey = '0x45920de905d32f34678a1ec1d91c01b7dadf418e0b302d683d14de36a0b1a555'; // address: 0x8888888812576f4C14E4D4381cD90f9C02DA44F6
    const wallet = new ethers.Wallet(privateKey, provider);

    // check the USDT contract: https://sepolia.etherscan.io/address/0x7169D38820dfd117C3FA1f22a697dBA58d90BA06#code
    const Token = new ethers.Contract('0x7169D38820dfd117C3FA1f22a697dBA58d90BA06', [
        'function decimals() public view returns (uint256)',
        'event Transfer(address indexed from, address indexed to, uint value)',
        'function transfer(address _to, uint _value) public'
    ], wallet); // please note that the last parameter is not the provider anymore, we replaced the provider with wallet object (signer object) because we want to send some transaction to the blockchain.

    const decimals = await Token.decimals();

    const targetAddress = '0x777777763217D7B01068244118050c607021023d'; // private key: 0x4c2d49d5b1e66050ffa9d37ade6bc0a4896ad9d8a7f83fe185af81f4d3ec8109
    Token.on('Transfer', function (from, to, value, tx) {
        if (to.toLowerCase() === targetAddress.toLowerCase()) {
            console.warn('Incoming Transfer Detected!');
            console.log('From:', from);
            console.log('To:', to);
            console.log('Value:', +ethers.utils.formatUnits(value, decimals));
            console.log('Transaction Hash:', tx.transactionHash);
        }
    });


    // test by sending 1 Token to targetAddress
    const trx = await Token.transfer(
        targetAddress,
        ethers.utils.parseUnits('1', decimals)
    );
    console.log('Sending', 1, 'USDT...\nTransaction hash: ', trx.hash);
    console.log('waiting for transaction to be confirmed...');

    await trx.wait(); // wait until transaction confirmed
    console.log('Transaction confirmed.');

    // test by sending 2 Token to targetAddress
    const trx2 = await Token.transfer(
        targetAddress,
        ethers.utils.parseUnits('2', decimals)
    );
    console.log('Sending', 2, 'USDT...\nTransaction hash: ', trx2.hash);
    console.log('waiting for transaction to be confirmed...');

    await trx2.wait(); // wait until transaction confirmed
    console.log('Transaction confirmed.');

}

app();
