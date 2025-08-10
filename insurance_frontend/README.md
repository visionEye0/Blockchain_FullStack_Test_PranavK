# Frontend - Crop Insurance NFT Platform

## Overview

This React frontend is designed to interact seamlessly with the backend API and the Ethereum smart contract deployed on the Sepolia testnet. It allows users to browse available insurance policies, purchase (mint) policy NFTs, and claim insurance via an intuitive UI.

---

## Running Locally

1. **Install dependencies**

   ```bash
   npm install
   ```
2. **Configure environment**

   * Create a `.env` file in the repository & enter these values.

   ```
   VITE_API_BASE_URL=http://localhost:5000
   VITE_CONTRACT_ADDRESS={copy the address you got from insurance_blockchain/Readme.md - step 3}
   VITE_RPC_URL=https://sepolia.infura.io/v3/8653c22605d2484ca3aa8748053a7080
   VITE_CHAIN_ID=11155111
   VITE_CHAIN_NAME=Sepolia Test Network
   VITE_CURRENCY_NAME=Ethereum
   VITE_CURRENCY_SYMBOL=ETH
   VITE_CURRENCY_DECIMALS=18
   ```

3. **Start development server**

   ```
   npm run dev
   ```

4. **For testing the frontend, install metamask and add wallet using private key, switch network to sepolia testnet and use this private key**

   ```
   Private_key=d0b18310876d5685ab4c8cc5089c4c0f02fb71b7139d2436bb20291588ad30dd
   ```

5. **Go to `http://localhost:5173` where the frontend is hosted & play around with the functionalities**


---

## Project Structure

```
.
├── eslint.config.js
├── index.html
├── package.json
├── package-lock.json
├── proof
│   └── proof-frontend.mkv
├── public
│   └── vite.svg
├── README.md
├── src
│   ├── api.js
│   ├── App.jsx
│   ├── assets
│   ├── blockchain
│   ├── components
│   ├── config.js
│   ├── index.css
│   ├── main.jsx
│   ├── pages
│   └── web3.js
└── vite.config.js

```


---

## React Setup

- The project uses **React 18** with **Vite** as the build tool for fast development.
- Styling is done with **Tailwind CSS** (or custom CSS) for responsive and clean UI components.
- React Router is used to handle client-side navigation between pages like policy lists and policy details.
- State management relies on React’s built-in hooks (`useState`, `useEffect`) to handle asynchronous data loading and UI state.

---

## API Integration

- API calls are centralized in `src/api.js` using **Axios** configured with a base URL defined in `config.js`.
- Provided API functions:
  - `getAllPolicies()` - Fetches all available insurance policy templates.
  - `getPolicyByUserId(id)` - Fetches all policies owned by a particular farmer (user).
  - `postPolicy(data)` - Sends a request to create a new user policy after minting NFT.
  - `postClaimPolicy(data)` - Updates backend status after a claim on a policy NFT.
- This abstraction keeps API calls organized and easily reusable across components.

---

## Blockchain Integration

- `src/web3.js` contains helper functions that:
  - Connect to the user’s Ethereum wallet (MetaMask).
  - Instantiate the smart contract with its ABI and deployed address.
  - Call contract functions like `mintPolicyNFT` and `claimPolicy`.
  - Handle transaction lifecycle (sending, waiting for confirmation, and parsing events).
- The frontend ensures wallet connection before enabling purchase or claim actions.
- After on-chain transactions, backend API calls update off-chain database records to stay in sync.

---

## UI Design

- **PolicyList Page:**  
  Displays a list of available insurance policies fetched from the backend. Users can browse crop types, coverage amounts, premiums, and durations.

- **PolicyDetail Page:**  
  Shows detailed information about a selected policy, including current status, expiration, and token ID if purchased.  
  Provides buttons to:
  - **Connect Wallet**: Prompt wallet connection if not already connected.
  - **Purchase (Mint NFT)**: Initiates minting on the blockchain and creates a policy record on the backend.
  - **Claim Insurance**: Calls the claim function on-chain and updates backend status.

- The UI handles loading and error states gracefully, showing user feedback during async operations.

---


### Summary

This frontend app provides a seamless user experience to interact with the Crop Insurance NFT system by:

* Fetching available policies from the backend.

* Managing wallet connection and blockchain transactions.

* Reflecting real-time policy status with data from both blockchain and backend.

* Ensuring clear UX for purchase and claim actions with loading and error handling.

### Notes

* Proofs are in the ./proof folder 