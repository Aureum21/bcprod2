# Blockchain MBRSLP
To run the project 

```npx quorum-dev-quickstart```




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
- `backend`: This directory contains server-side logic and functions for interacting with the blockchain.
  - `Functions`: Contains JavaScript files for handling different operations like student and institute management.
  - `index.js`: The main entry point for the backend server.
- `src`: This directory contains the React frontend application.
  - `components`: Reusable UI components such as `NavBar`, `ColorMode`, and `UploadCertificate`.
  - `pages`: Different pages for the application, including `StudentPages`, `AdminPages`, and `InstPages`.
  - `App.tsx`: The main entry point for the React application.

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
├── truffle-config.js
├── backend/
│   ├── Functions/
│   │   └── [Your JavaScript files]
│   └── index.js
├── src/
│   ├── components/
│   │   ├── NavBar.js
│   │   ├── ColorMode.js
│   │   └── UploadCertificate.js
│   ├── pages/
│   │   ├── StudentPages.js
│   │   ├── AdminPages.js
│   │   └── InstPages.js
│   └── App.tsx
└── index.js
```

## Navigation
- **Home Page**: Provides an overview and access to different user roles.
- **Student Pages**: Allows students to manage their profiles, add certificates, and view information.
- **Institute Pages**: Enables institutes to manage student data and verify credentials.
- **Admin Pages**: For administrative tasks and overall management.

## API Endpoints
- `/addUnOfficialCert`: Endpoint for adding unofficial certificates.
- `/getUnOfficialCert`: Endpoint for retrieving unofficial certificates.
- `/studentInformation`: Endpoint for fetching student information based on the contract address.

## Prerequisites

- Node.js (v14.0.0 or higher)
- Truffle Suite (`npm install -g truffle`)
- Ganache (Local Blockchain)
- MetaMask Browser Extension
- IPFS Desktop (for local IPFS node)
- Git

## Installation Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/blockchain_mbrslp-.git
   cd blockchain_mbrslp-
   ```

2. Install project dependencies:
   ```bash
   npm install
   ```
3. Install and Start IPFS:
   - Download and install IPFS Desktop from [IPFS Website](https://ipfs.tech/#install)
   - Start your IPFS node
4. Configure Ganache:
   - Install and open Ganache
   - Create a new workspace
   - Link your `truffle-config.js` to the workspace
   - Keep note of the RPC Server URL (usually `http://127.0.0.1:7545`)
5. Deploy Smart Contracts:
   ```bash
   truffle compile
   truffle migrate --reset
   ```
6. Configure MetaMask:
   - Install MetaMask browser extension
   - Connect MetaMask to your Ganache network:
     - Network Name: Ganache
     - New RPC URL: http://127.0.0.1:7545
     - Chain ID: 1337
   - Import accounts from Ganache using private keys

## Running the Application
1. Start your local server (you can use Live Server in VS Code or any HTTP server):
   ```bash
   # If using npm http-server
   npm install -g http-server
   http-server frontend/
   ```

2. Access the application:
   - Open your browser and navigate to `http://localhost:8080/html/connect.html`
   - Ensure MetaMask is connected to your Ganache network
   - You can now interact with the different pages:
     - Registration: `registration.html`
     - Institute Management: `institute.html`
     - Admin Panel: `admin.html`
     - Student Portal: `student.html`
   - Local Host Link to the File: http://localhost:8080/README.md
   - Local Host Link to Registration Page: http://localhost:8080/html/registration.html
   - Local Host Link to Institute Management Page: http://localhost:8080/html/institute.html
   - Local Host Link to Admin Panel: http://localhost:8080/html/admin.html
   - Local Host Link to Student Portal: http://localhost:8080/html/student.html


## Features

- User Registration and Authentication
- Institute Management
- Student Profile Management
- Administrative Controls
- IPFS Integration for Decentralized Storage
- Blockchain-based Data Integrity

## Troubleshooting

1. **MetaMask Connection Issues:**
   - Ensure you're connected to the correct network (Ganache)
   - Reset your account in MetaMask if transactions aren't going through

2. **IPFS Connection:**
   - Verify your IPFS daemon is running, download IPFS Desktop from [IPFS Website](https://ipfs.tech/#install) and start the IPFS app, check if it is running by clicking on the IPFS Desktop icon in the system tray.
   - Check IPFS connection in browser console

3. **Smart Contract Interaction:**
   - Ensure contracts are properly deployed
   - Check if you're using the correct contract addresses


### Detailed Network Configuration
1. **Ganache Settings**
   ```json
   {
     "hostname": "127.0.0.1",
     "port": 7545,
     "network_id": "5777",
     "gas_limit": "6721975",
     "gas_price": "20000000000"
   }
   ```

2. **IPFS Configuration**
   ```bash
   # Required IPFS settings
   API Port: 5001
   Gateway Port: 8080
   Swarm Port: 4001
   ```

### First-Time User Guide

1. **Admin Setup**
   - First login must be with admin account
   - Use the first Ganache account as admin
   - Required initial setup:
     - Set system parameters
     - Register first institution
     - Configure verification parameters

2. **Institution Registration Process**
   - Admin must approve institution first
   - Required documents:
     - Institution license
     - Administrator details
     - Digital signature
   - Wait for blockchain confirmation

3. **Student Registration Flow**
   - Must have institution code
   - Required documents:
     - Personal ID
     - Student ID
     - Profile picture
   - Verification process takes 2-3 blocks

### Common Workflows

1. **Certificate Issuance**
   ```mermaid
   graph TD
   A[Institution Login] --> B[Create Certificate]
   B --> C[Upload to IPFS]
   C --> D[Store Hash on Blockchain]
   D --> E[Student Notification]
   ```

2. **Certificate Verification**
   ```mermaid
   graph TD
   A[Employer Login] --> B[Scan QR Code]
   B --> C[Fetch IPFS Data]
   C --> D[Verify on Blockchain]
   D --> E[Show Verification Status]
   ```

### Development Setup

1. **Required VS Code Extensions**
   - Solidity
   - Live Server
   - ESLint
   - Prettier

2. **Testing Environment**
   ```bash
   # Install testing frameworks
   npm install --save-dev chai mocha truffle-assertions
   
   # Run tests
   truffle test
   ```

 
