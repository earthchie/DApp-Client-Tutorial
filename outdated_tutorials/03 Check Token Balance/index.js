const {ethers} = require('ethers');

async function app(){

    // RPC list: https://chainlist.org/
    const provider = new ethers.providers.JsonRpcProvider('https://rpc-l1.jibchain.net');
    
    const Token = new ethers.Contract('0xF2Bd9c13E5c65aEDb48CfAfa806e4996c40D2f20', [
        'function balanceOf(address account) external view returns (uint256)'
    ], provider);

    const walletAddress = '0x9999999d46618d114C133e8746396c5bF0090b2B';
    const balance = await Token.balanceOf(walletAddress);

    console.log('My balance is:', ethers.utils.formatUnits(balance));

}

app();
