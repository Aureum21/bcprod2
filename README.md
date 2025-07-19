# Blockchain MBRSLP

To run the project

`npx quorum-dev-quickstart`

## Project Overview

A blockchain-based system student certification manager holding four stake holders: the Students, the Education Institutions, the MOE (education adminstrative) and employing Organizations. The membership system that utilizes IPFS for decentralized storage. The project includes user registration, institute management, and administrative features.

## Project Structure

- `contracts`: This directory contains the smart contracts written in Solidity.
- `migrations`: This directory contains the migration scripts for deploying the smart contracts.
- `test`: This directory contains the test files for the smart contracts.
- `truffle-config.js`: This file contains the configuration for the Truffle Suite.
- `frontend`: This directory contains the frontend application code.
- `ipfs`: This directory contains the IPFS configuration and files.
- `README.md`: This file contains the project documentation and instructions.
- `package.json`: This file contains the project dependencies and scripts.
- `node_modules`: This directory contains the project dependencies installed using npm.

```
blockchain_mbrslp-/
├── contracts/
│   ├── Migrations.sol
│   └── [Your contract files].sol
│
├── frontend/
│   ├── html/
│   │   ├── admin.html
│   │   ├── connect.html
│   │   ├── fetchprof.html
│   │   ├── institute.html
│   │   ├── registration.html
│   │   └── student.html
│   │
│   ├── js/
│   │   ├── constants/
│   │   │   └── constantsregisterinst.js
│   │   └── admin.js
│   │
│   ├── css/
│   │   └── [Your CSS files]
│   │
│   └── assets/
│       └── [Your image/media files]
│
├── ipfs/
│   └── README.md
│
├── migrations/
│   ├── 1_initial_migration.js
│   └── [Your migration files].js
│
├── test/
│   └── [Your test files].js
│
├── node_modules/
│
├── .gitignore
├── package.json
├── README.md
├── readme2.md
└── truffle-config.js
```

## Prerequisites

- Node.js v16+
- npm or yarn
- Hyperledger Besu nodes (private network)
- Tessera privacy manager

### Installation (Backend)

```bash
git clone https://github.com/mbrslp-blockchain/privatebc.git
cd privatebc/backend
npm install
```

### Environment Setup

- Configure Besu and Tessera nodes as per the `/config` directory.
- Update contract addresses and keys in `/backend/Files/keys.js`.

### Running the Backend

```bash
npm start
```

## Running the Frontend

The frontend application is located in the `/frontend` directory.

1. Install dependencies:

   ```bash
   cd privatebc/frontend
   npm install
   ```

2. Start the frontend development server:

   ```bash
   npm start
   ```

   This will launch the frontend app, typically on [http://localhost:3000](http://localhost:3000).  
   Ensure that the backend server is running and accessible to the frontend for API calls.

> Note: If your frontend uses a different framework or has custom build/start instructions, refer to the documentation in the `/frontend` directory.

## API Endpoints

- `POST /registerStudent`: Register a student (private and public records).
- `GET /studentInformation?contractAddress=...`: Fetch student details by contract address.
- `POST /regStudToInstPending`: Register pending institution transfer.
- `POST /regStudToInstTransfer`: Complete student transfer between institutions.
- `GET /listPendingStudents`: List all students pending institution transfer.

Refer to `backend/index.js` for more endpoints and details.

## Smart Contracts

- `registerStud.sol`: Manages registration of students.
- `student.sol`: Stores student profile and academic data.
- `publicdata.sol`: Handles public-facing student data.
- `verifystud.sol`: Verifies student registration and transfer.
- Additional contracts for skills/certificates and institutional logic.

Contract ABIs and deployment info are located in `backend/Files`.

## Contributing

Contributions are welcome! Please fork the repo and open a pull request with your improvements.

## License

This project is licensed under the MIT License.
