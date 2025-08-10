## API Setup, MongoDB Configuration, Web3.js Integration, and Testing

---

### Running Locally (api server)

1. **Ensure you have mongodb installed in your system, to check that type `sudo systemctl status mongod.service` in your linux terminal**
    * If its installed it'll show like this
      ```
      ● mongod.service - MongoDB Database Server
      Loaded: loaded (/lib/systemd/system/mongod.service; enabled; vendor preset: enabled)
      Active: active (running) since Sat 2025-08-09 16:53:58 UTC; 23min ago
      ```

2. **Then install the necessary packages using the command**

   ```
   cd insurance_api/
   npm install
   ```
3. **Create .env file in the insurance_api directory and populate it with following values**
   ```
   MONGODB_URI=mongodb://localhost:27017/crop-insurance
   ```

4. **Then type in `node seedAvailablePolicies.js` to populate the database with a list of policies the farmers can purchase**

5. **Now run the node.js server by typing `node index.js`**

6. **Now Go to `insurance_blockchain/README.md` and follow the steps there**

### API Overview

The backend API is built using **Express.js** and connects to **MongoDB** via Mongoose for data persistence.

- **Routes:**
  - `routes/available_policies.js`: Provides an endpoint to fetch available insurance policy templates.
    - **GET** `/available-policies` — Returns all available policy templates.
  - `routes/user_policies.js`: Manages policies purchased by users.
    - **POST** `/policies` — Create a new policy when a user purchases insurance.
    - **GET** `/policies/:farmer_id` — Retrieve all policies owned by a specific farmer (case-insensitive).
    - **POST** `/policies/claim` — Update a policy status to "claimed" after the user claims insurance.

- **Express app setup** typically imports these routes and sets up middleware for JSON parsing and CORS.

---

### MongoDB Configuration

- The project uses **MongoDB** to store both available policy templates and user-purchased policies.

- **Models:**

  - `AvailablePolicy.js`  
    Defines insurance templates with fields:
    - `crop_type` (String, required)
    - `coverage_amount` (Number, required)
    - `premium` (Number, required)
    - `duration_months` (Number, required)
    - `description` (String, optional)

  - `policy.js`  
    Defines user policies with fields:
    - `farmer_id` (String)
    - `crop_type` (String)
    - `coverage_amount` (Number)
    - `premium` (Number)
    - `expiration_date` (Number, Unix timestamp)
    - `status` (Enum: `'active' | 'claimed'`, default `'active'`)
    - `token_id` (Number)

- **Seeding Data:**

  The `seedAvailablePolicies.js` script connects to MongoDB, clears existing available policies, and inserts predefined crop insurance templates.

  To run the seed script:

  ```bash
  node seedAvailablePolicies.js
  ```

- **MongoDB Connection:**

  Connects with Mongoose using:

  ```
  mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  ```

  Replace `MONGO_URI` with your actual MongoDB connection string (local or cloud-hosted)

  ---

### Web3.js Integration
* The frontend uses Web3.js (or optionally ethers.js) to interact with the deployed smart contract on the Sepolia testnet.

* Key interactions include:

  * Minting a Policy NFT:
Calls the smart contract’s mintPolicyNFT function, passing metadata like farmerId, cropType, coverageAmount, premium, and expirationDate.

  * Claiming Insurance:
Calls the claimPolicy function on the smart contract with the token ID of the policy NFT.

* The frontend manages wallet connections (e.g., MetaMask), account retrieval, and signing transactions.

* After minting or claiming, the frontend updates the backend API with relevant policy data, ensuring off-chain and on-chain data stay consistent.

### Testing Process

* Backend API Testing:

  * Use tools like Postman or curl to verify API endpoints:

    * Create policies (POST /policies)

    * Fetch policies for a user (GET /policies/:farmer_id)

    * Claim a policy (POST /policies/claim)

    * Fetch available policies (GET /available-policies)

  * Ensure correct status codes and error handling (e.g., 400 for missing params, 404 for not found).

* Integration Testing:

  * Frontend integration with backend API and smart contract is tested by:

    * Purchasing a policy via the frontend.

    * Confirming on-chain mint event and off-chain DB update.

    * Claiming the policy NFT and reflecting the claim on backend.

    * Handling edge cases like wallet disconnects or transaction failures gracefully.

### Project Structure

```
├── index.js                   # Main Express server entrypoint
├── models
│   ├── AvailablePolicy.js     # Schema for insurance templates
│   └── policy.js              # Schema for purchased policies
├── routes
│   ├── available_policies.js  # Route for available policy templates
│   └── user_policies.js       # Route for user policies management
├── seedAvailablePolicies.js   # Script to seed policy templates in DB
├── package.json
└── ...


```

### Notes

* The proofs are in the proof folder 
