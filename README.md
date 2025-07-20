# Student Data Management System

## Project Overview

A blockchain-based system student data management system holding four stake holders: the Students, the Education Institutions, the MOE (education adminstrative) and employing Organizations. The system that utilizes IPFS for decentralized storage. 
The project includes:
- `User registration` : Registering students and Institutes to the network.
- `Verification`: authentication to new users by an already verified stakeholder.
- `Certificate Upload`: adding certificates: official and unofficial to students profile for employers to access
- `Transfering Institutes`: trnasfering a student from one institute to another.
  
## To run the project
we are using the hyperledger besu as our private blockchain network. To setup up the system on your machine, follow the below procedures.

1, install quorum-dev-quickstart

```
npx quorum-dev-quickstart
```
> **ℹ️ NOTE**  
> From the options select: `Hyperledger Besu`, `Y`, `Loki`, `N`, `N`, `Enter` respectively.

2, navigate to quorum test network folder

```
cd quorum-test-network
```

3, clone the github repository 

```
git clone https://github.com/mbrslp-blockchain/privatebc.git
```

4, Replace contracts and scripts in the quickstart with smart_contract and script folders from the repo. 

```
rm -rf dapps
rm -rf smart_contracts/contracts
rm -rf smart_contracts/scripts
mv privatebc/smart_contracts smart_contracts/contracts
mv privatebc/scripts smart_contracts/scripts
mv privatebc dapps
```

### The folder structure  in dapps should look like:
- `frontend`: This directory contains the frontend application code.
- `backend`: Contains the backend logic written in expressJs to interact with the network.
- `ipfs`: This directory contains the IPFS configuration and files.
- `README.md`: This file contains the project documentation and instructions.
- `package.json`: This file contains the project dependencies and scripts.
### The folder structure  in smart_contracts should look like:
- `contracts`: This directory contains the smart contracts written in Solidity.
- `scripts`: Contains compile and deploy logic.
- ...
  
5, Being in the quorum-test-network directory run 
```
./run.sh
```
6, Install dependencies and navigate to scripts folder
```
cd smart_contracts/
npm i --force
cd scripts/
```
7, compile the smart contracts
```
node compile.js
```
8, deploy the contracts and update the contracts addresses in keys.js file.
```
cd privacy
node deploy_regInst.js
```
> Update the contract address of the registerInst key in keys .js

```
node deploy_regStud.js
```
> Update the contract address of the registerStud key in keys .js
```
node deploy_verInst.js
```
> Update the contract address of the verifyInst key in keys .js

```
node deploy_verStud.js
```
> Update the contract address of the verifyStud key in keys .js

```
cd ../public/
node publicdata.js
```
> Update the contract address of the publicdata key in keys .js

9, navigate to the ipfs in dapps and run ipfs
```
# from the main directory(quorum-test-network)
cd dapps/ipfs
npm i --force
npm run start
```
10, navigate to the backend and run index.js
```
# from the main directory(quorum-test-network)
cd dapps/backend
npm i --force
npm run start
```
11, navigate to the frontend and run index.js
```
# from the main directory(quorum-test-network)
cd dapps/frontend
npm i --force
npm run dev
```
> open the link and play with the system.

