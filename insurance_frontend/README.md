# Frontend - Crop Insurance NFT Platform

## Overview

This React frontend is designed to interact seamlessly with the backend API and the Ethereum smart contract deployed on the Sepolia testnet. It allows users to browse available insurance policies, purchase (mint) policy NFTs, and claim insurance via an intuitive UI.

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

## Running Locally

1. **Install dependencies**

```bash
npm install
```
2. **Configure environment**

* Update src/config.js with the correct API base URL and deployed smart contract address.

3. **Start development server**

```
npm run dev
```

Open http://localhost:5000 (or the port shown) to access the app.

### Summary

This frontend app provides a seamless user experience to interact with the Crop Insurance NFT system by:

* Fetching available policies from the backend.

* Managing wallet connection and blockchain transactions.

* Reflecting real-time policy status with data from both blockchain and backend.

* Ensuring clear UX for purchase and claim actions with loading and error handling.

### Notes

* Proofs are in the ./proof folder 