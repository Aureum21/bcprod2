const path = require("path");
const fs = require("fs-extra");
var ethers = require("ethers");
const { tessera, besu, contractInformations } = require("../keys.js");

const host = besu.rpcnode.url;
const accountPrivateKey = besu.member1.accountPrivateKey;

const contractJsonPath = path.resolve(
  __dirname,
  "../../",
  "contracts",
  "publicdata.json"
);
const contractJson = JSON.parse(fs.readFileSync(contractJsonPath));
const contractAbi = contractJson.abi;
const contractBytecode = contractJson.evm.bytecode.object;

async function createContract(provider, wallet, contractAbi, contractByteCode) {
  const factory = new ethers.ContractFactory(
    contractAbi,
    contractByteCode,
    wallet
  );
  const contract = await factory.deploy(
    contractInformations.registerStud.contractAddress,
    contractInformations.registerInst.contractAddress,
    contractInformations.verifyStud.contractAddress,
    contractInformations.verifyInst.contractAddress,
    besu.member1.url,
    besu.member2.url,
    besu.member3.url,
    besu.member1.accountAddress,
    besu.member2.accountAddress,
    besu.member3.accountAddress,
  );
  // The contract is NOT deployed yet; we must wait until it is mined
  const deployed = await contract.waitForDeployment();
  //The contract is deployed now
  return contract;
}

async function main() {
  const provider = new ethers.JsonRpcProvider(host);
  const wallet = new ethers.Wallet(accountPrivateKey, provider);
  const contractInit = [
    contractInformations.registerStud.contractAddress,
    contractInformations.registerInst.contractAddress,
    contractInformations.verifyStud.contractAddress,
    contractInformations.verifyInst.contractAddress,
    besu.member1.url,
    besu.member2.url,
    besu.member3.url,
    besu.member1.accountAddress,
    besu.member2.accountAddress,
    besu.member3.accountAddress,
  ];

  createContract(provider, wallet, contractAbi, contractBytecode)
    .then(async function (contract) {
      console.log(contractInit);
      contractAddress = await contract.getAddress();
      console.log("Contract deployed at address: " + contractAddress);
      console.log(
        "Use the smart contracts 'get' function to read the contract's constructor initialized value .. "
      );
      // await getAllPastEvents(host, contractAbi, tx.contractAddress);
    })
    .catch(console.error);
}

if (require.main === module) {
  main();
}

module.exports = exports = main;
