import Web3 from "web3";
import ContractABI from './contractABIs/CropInsuranceNFT.json'; // paste your ABI here

const CONTRACT_ADDRESS = "0xD519979C55998cbBaA49f1b7Df93668C119B237c";

let web3;
let contract;

export const initWeb3 = async () => {
  if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    await window.ethereum.request({ method: 'eth_requestAccounts' });
    contract = new web3.eth.Contract(ContractABI.abi, CONTRACT_ADDRESS);
  } else {
    throw new Error("MetaMask not found");
  }
};

export const purchasePolicy = async (tokenId, from) => {
  return await contract.methods.mintPolicy(tokenId).send({ from });
};

export const claimInsurance = async (tokenId, from) => {
  return await contract.methods.claimPolicy(tokenId).send({ from });
};
