const { ethers } = require('ethers');

async function app() {

    // RPC list: https://chainlist.org/
    const provider = new ethers.providers.JsonRpcProvider('https://1rpc.io/sepolia');

    const privateKey = '0x45920de905d32f34678a1ec1d91c01b7dadf418e0b302d683d14de36a0b1a555'; // address: 0x8888888812576f4C14E4D4381cD90f9C02DA44F6
    const wallet = new ethers.Wallet(privateKey, provider);

    const targetAddress = '0x777777763217D7B01068244118050c607021023d'; // private key: 0x4c2d49d5b1e66050ffa9d37ade6bc0a4896ad9d8a7f83fe185af81f4d3ec8109
    provider.on('block', async (blockNumber) => {

        // Fetch block details
        const block = await provider.getBlockWithTransactions(blockNumber);

        // Check each transaction in the block
        block.transactions.forEach((tx) => {
            // Check if the transaction is a native currency transfer to the monitored address
            if (tx.to && tx.to.toLowerCase() === targetAddress.toLowerCase()) {
                console.warn('Incoming Transfer Detected!');
                console.log('From:', tx.from);
                console.log('To:', tx.to);
                console.log('Value:', +ethers.utils.formatEther(tx.value));
                console.log('Transaction Hash:', tx.hash);
            }
        });
    });

    // test by sending 0.00001 Native Currency to targetAddress
    const trx = await wallet.sendTransaction({
        to: targetAddress,
        value: ethers.utils.parseEther('0.00001')
    });
    console.log('Sending first transaction...\nTransaction hash: ', trx.hash);
    console.log('Waiting for transaction to be confirmed...');

    await trx.wait(); // wait until transaction confirmed
    console.log('Transaction confirmed.');


    // test by sending 0.00002 Native Currency to targetAddress
    const trx2 = await wallet.sendTransaction({
        to: targetAddress,
        value: ethers.utils.parseEther('0.00002')
    });
    console.log('Sending second transaction...\nTransaction hash: ', trx2.hash);
    console.log('Waiting for transaction to be confirmed...');

    await trx2.wait(); // wait until transaction confirmed
    console.log('Transaction confirmed.');

}

app();
