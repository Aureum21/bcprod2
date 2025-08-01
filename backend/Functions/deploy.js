const path = require("path");
const fs = require("fs-extra");
const Web3 = require("web3");
const Web3Quorum = require("web3js-quorum");

const chainId = 1337;
const { besu, tessera } = require("../Files/keys");

const contractJsonPath = path.resolve(__dirname, "../Files", "student.json");
const contractJson = JSON.parse(fs.readFileSync(contractJsonPath));
const contractBytecode = contractJson.evm.bytecode.object;
const contractJsonInstPath = path.resolve(
  __dirname,
  "../Files",
  "institute.json"
);
const contractJsonInst = JSON.parse(fs.readFileSync(contractJsonInstPath));
const contractBytecodeInst = contractJsonInst.evm.bytecode.object;
const contractJsonEmpPath = path.resolve(
  __dirname,
  "../Files",
  "employer.json"
);
const contractJsonEmp = JSON.parse(fs.readFileSync(contractJsonEmpPath));
const contractBytecodeEmp = contractJsonEmp.evm.bytecode.object;

async function createStudContract(value) {
  const web3 = new Web3(besu.member3.url);
  const web3quorum = new Web3Quorum(web3, chainId);
  const contractConstructorInit = web3.eth.abi
    .encodeParameters(
      ["string", "address", "string", "string", "address", "address"],
      value
    )
    .slice(2);
  const txOptions = {
    data: "0x" + contractBytecode + contractConstructorInit,
    privateKey: besu.member3.accountPrivateKey,
    privateFrom: tessera.member3.publicKey,
    privateFor: [tessera.member1.publicKey],
  };
  console.log("Creating contract...");
  const txHash = await web3quorum.priv.generateAndSendRawTransaction(txOptions);
  console.log("Getting contractAddress from txHash: ", txHash);
  const privateTxReceipt = await web3quorum.priv.waitForTransactionReceipt(
    txHash
  );
  console.log("Private Transaction Receipt: ", privateTxReceipt);
  return privateTxReceipt;
}
async function createInstContract(value) {
  const web3 = new Web3(besu.member2.url);
  const web3quorum = new Web3Quorum(web3, chainId);

  const contractConstructorInit = web3.eth.abi
    .encodeParameters(["string", "address", "string", "address"], value)
    .slice(2);

  const txOptions = {
    data: "0x" + contractBytecodeInst + contractConstructorInit,
    privateKey: besu.member2.accountPrivateKey,
    privateFrom: tessera.member2.publicKey,
    privateFor: [tessera.member1.publicKey],
  };
  console.log("Creating contract...");
  const txHash = await web3quorum.priv.generateAndSendRawTransaction(txOptions);
  console.log("Getting contractAddress from txHash: ", txHash);
  const privateTxReceipt = await web3quorum.priv.waitForTransactionReceipt(
    txHash
  );
  console.log("Private Transaction Receipt: ", privateTxReceipt);
  return privateTxReceipt;
}
async function createEmpContract(value) {
  const web3 = new Web3(besu.member4.url);
  const web3quorum = new Web3Quorum(web3, chainId);

  const contractConstructorInit = web3.eth.abi
    .encodeParameters(["string", "address", "string", "address"], value)
    .slice(2);

  const txOptions = {
    data: "0x" + contractBytecodeEmp + contractConstructorInit,
    privateKey: besu.member4.accountPrivateKey,
    privateFrom: tessera.member4.publicKey,
    privateFor: [tessera.member1.publicKey],
  };
  console.log("Creating contract...");
  const txHash = await web3quorum.priv.generateAndSendRawTransaction(txOptions);
  console.log("Getting contractAddress from txHash: ", txHash);
  const privateTxReceipt = await web3quorum.priv.waitForTransactionReceipt(
    txHash
  );
  console.log("Private Transaction Receipt: ", privateTxReceipt);
  return privateTxReceipt;
}

module.exports = { createStudContract, createInstContract, createEmpContract };
