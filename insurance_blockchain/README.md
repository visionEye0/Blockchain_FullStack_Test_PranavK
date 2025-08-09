# CropInsuranceNFT

## Overview

`CropInsuranceNFT` is a Solidity smart contract implementing an ERC-721 NFT that represents crop insurance policies. Each NFT stores detailed policy information such as farmer ID, crop type, coverage amount, premium, expiration date, and claim status.

---

## Running Locally (Sepolia testnet)

1. **Install the required packages using `npm install`**

2. **Create a .env file and put in the below values**
   ```
   SEPOLIA_RPC_URL="https://sepolia.infura.io/v3/8653c22605d2484ca3aa8748053a7080"

   SEPOLIA_WALLET_PRIVATE_KEY="fd8d3b00739e9a8373e59df0b4608c68187158095744061d30f425ef44408b49"
   
   ```

3. **Deploy the smart contract by typing `npx hardhat run scripts/deploy.js --network sepolia` and copy the address shown in the console**

   ```
   $insurance_blockchain$ npx hardhat run scripts/deploy.js 

   [dotenv@17.2.1] injecting env (0) from .env -- tip: ⚙️  enable debug logging with { debug: true }
   Compiled 16 Solidity files successfully (evm target: paris).
   [dotenv@17.2.1] injecting env (0) from .env -- tip: 🔐 encrypt with Dotenvx: https://dotenvx.com
   
   Deployed at: 0x5FbDB2315678afecb367f032d93F642f64180aa3
   ```

4. **Also copy `CropInsuranceNFT.json` from `insurance_blockchain/artifacts/contracts/CropInsuranceNFT.sol/` and paste it in `insurance_frontend/src/contractABIs/.`** 


## Features

- Mint crop insurance policy NFTs with custom metadata.
- Claim policy NFTs to mark the insurance as used.
- Retrieve detailed policy information via a view function.

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
