const Web3 = require("web3");
const ABI = require("./ABI.json"); // paste ABI from Hardhat
const CONTRACT_ADDRESS = "deployed_contract_address";

const web3 = new Web3(process.env.SEPOLIA_RPC_URL);
const account = web3.eth.accounts.privateKeyToAccount(process.env.PRIVATE_KEY);
web3.eth.accounts.wallet.add(account);

const contract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS);

module.exports = { web3, contract, account };
