# CropInsuranceNFT

## Overview

`CropInsuranceNFT` is a Solidity smart contract implementing an ERC-721 NFT that represents crop insurance policies. Each NFT stores detailed policy information such as farmer ID, crop type, coverage amount, premium, expiration date, and claim status.

---

## Features

- Mint crop insurance policy NFTs with custom metadata.
- Claim policy NFTs to mark the insurance as used.
- Retrieve detailed policy information via a view function.

---

## Smart Contract Setup

### Prerequisites

- [Node.js](https://nodejs.org/) and npm installed
- [Hardhat](https://hardhat.org/) framework installed (`npm install --save-dev hardhat`)
- Sepolia testnet RPC URL (e.g., from [Infura](https://infura.io/) or [Alchemy](https://www.alchemy.com/))
- Ethereum wallet (e.g., MetaMask) with Sepolia testnet access

### Install Dependencies

```bash
npm install --save-dev @openzeppelin/contracts ethers hardhat
```

---

### Deployment Process

**1. Configure Hardhat**

Create or update your `hardhat.config.js`

```
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config()

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL,
      accounts: [process.env.SEPOLIA_WALLET_PRIVATE_KEY],
    },
  },
};

```
**_Replace SEPOLIA_RPC_URL and SEPOLIA_WALLET_PRIVATE_KEY with your actual values_**

**2. Execute the deployment script**

```
npx hardhat run scripts/deploy.js --network sepolia
```

**The contract will deploy and output its address, for example:**

```
CropInsuranceNFT deployed to: 0xD519979C55998cbBaA49f1b7Df93668C119B237c
```

---

### Testing

**Automated tests are located in the test directory as CropInsuranceNFT.test.js**

**Run Tests**
Execute:

```
npx hardhat test
```

**The tests cover:**

* Minting new policy NFTs with correct metadata.

* Claiming policies only by the NFT owner.

* Preventing double claims.

* Preventing claims after expiration.

* Validating access control on claims.

### Interacting with the Deployed Contract
You can interact with the deployed contract using:

* Hardhat console connected to Sepolia:

```
npx hardhat console --network sepolia
```
* Your frontend app using ethers.js or web3.js with the contract ABI and address:

```
0xD519979C55998cbBaA49f1b7Df93668C119B237c
```

### Notes

* Proofs are in the ./proof folder
* This contract leverages OpenZeppelin libraries for security and standards compliance.

* If you have questions or need help with frontend integration or deployment scripts, feel free to ask!
