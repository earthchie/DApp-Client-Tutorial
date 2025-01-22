const { ethers } = require('ethers');

async function app() {

    // RPC list: https://chainlist.org/
    const provider = new ethers.providers.JsonRpcProvider('https://1rpc.io/sepolia');

    const wallet = new ethers.Wallet('0x45920de905d32f34678a1ec1d91c01b7dadf418e0b302d683d14de36a0b1a555', provider); // address: 0x8888888812576f4C14E4D4381cD90f9C02DA44F6

    // check the USDT contract: https://sepolia.etherscan.io/address/0x7169D38820dfd117C3FA1f22a697dBA58d90BA06#code
    const Token = new ethers.Contract('0x7169D38820dfd117C3FA1f22a697dBA58d90BA06', [
        'function decimals() public view returns (uint256)',
        'function _mint(address receiver, uint amount)', // since this is a testnet, there are no access control, anyone can call _mint() function for free
        'function balanceOf(address account) external view returns (uint256)'
    ], wallet); // please note that the last parameter is not the provider anymore, we replaced the provider with wallet object (signer object) because we want to send some transaction to the blockchain.

    const decimals = await Token.decimals();

    const balance = await Token.balanceOf(wallet.address);
    console.log('My initial Balance is ', +ethers.utils.formatUnits(balance, decimals), 'USDT');

    const mintAmount = Math.ceil(Math.random() * 5) * 10; // random amount to mint
    const trx = await Token._mint(wallet.address, ethers.utils.parseUnits(mintAmount.toString(), decimals));
    console.log('Minting', mintAmount, 'USDT...\nTransaction hash: ', trx.hash);
    console.log('waiting for transaction to be confirmed...');

    await trx.wait(); // wait until transaction confirmed
    console.log('Transaction confirmed. USDT has been minted');

    const balance2 = await Token.balanceOf(wallet.address);
    console.log('My current Balance is ', +ethers.utils.formatUnits(balance2, decimals), 'USDT');

}

app();
