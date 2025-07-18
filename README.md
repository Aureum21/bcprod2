# Student Data Management System on Private Besu Blockchain

This project provides a decentralized, blockchain-based student data management system, built on a private Hyperledger Besu network. It leverages TypeScript and JavaScript to create a secure, privacy-preserving platform for academic institutions to register, manage, and transfer student records.

## Table of Contents

- [Features](#features)
- [Architecture](#architecture)
- [File Structure](#file-structure)
- [Getting Started](#getting-started)
- [Running the Frontend](#running-the-frontend)
- [API Endpoints](#api-endpoints)
- [Smart Contracts](#smart-contracts)
- [Contributing](#contributing)
- [License](#license)

## Features

- **Private Blockchain Network**: Uses Hyperledger Besu for secure, permissioned record management.
- **Student Registration**: Supports private/public registration of students with institutional verification.
- **Data Privacy**: Transactions utilize Tessera for private data sharing between network participants.
- **Student Data Retrieval**: Query APIs to fetch student information and academic records.
- **Institution Transfer**: Manage pending and completed transfers of students between institutions.
- **Skill and Certificate Management**: Add and verify skills/certificates for students on-chain.

## Architecture

- **Backend**: Node.js/TypeScript server interacts with Besu blockchain and Tessera privacy manager.
- **Smart Contracts**: Solidity contracts manage student/institution registration, verification, and data access.
- **API Layer**: RESTful endpoints for registration, data retrieval, and transfer operations.
- **Private Transactions**: Data privacy is enforced via Tessera, ensuring only authorized parties can view sensitive data.

## File Structure

```
backend/
  ├── index.js                # Main API server
  ├── Functions/
  │   ├── StudFunctions.js    # Student registration, profile, and record functions
  │   ├── transferFunctions.js# Institution transfer logic
  │   └── AdminFunctions.js   # Institute admin and verification
  ├── Files/
  │   ├── *.json              # ABI and contract information for smart contracts
  └── ...                     # Additional config, scripts, and util files
contracts/
  └── *.sol                   # Solidity smart contract sources
config/
  └── ...                     # Network and node configs
test/
  └── ...                     # Unit and integration tests
frontend/
  └── ...                     # Frontend application source (see below)
```

## Getting Started

### Prerequisites

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
