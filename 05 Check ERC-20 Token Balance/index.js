const { ethers } = require('ethers');

async function app() {

    // RPC list: https://chainlist.org/
    const provider = new ethers.providers.JsonRpcProvider('https://1rpc.io/sepolia');

    // check the USDT contract: https://sepolia.etherscan.io/address/0x7169D38820dfd117C3FA1f22a697dBA58d90BA06#code
    const Token = new ethers.Contract('0x7169D38820dfd117C3FA1f22a697dBA58d90BA06', [
        'function decimals() public view returns (uint256)',
        'function balanceOf(address account) external view returns (uint256)'
    ], provider);

    const decimals = await Token.decimals();

    const walletAddress = '0x8888888812576f4C14E4D4381cD90f9C02DA44F6'; // private key: 0x45920de905d32f34678a1ec1d91c01b7dadf418e0b302d683d14de36a0b1a555
    const balance = await Token.balanceOf(walletAddress);

    console.log('My balance is ', +ethers.utils.formatUnits(balance, decimals), 'USDT');

}

app();
