const Web3 = require("web3");
const Web3Quorum = require("web3js-quorum");
const chainId = 1337;
const path = require("path");
const fs = require("fs-extra");
const { besu, tessera, contractInformations } = require("../Files/keys");
// Verify Stud contract
const contractJsonVerifyStudPath = path.resolve(
  __dirname,
  "../Files",
  "verifystud.json"
);
const contractJsonVerifyStud = JSON.parse(
  fs.readFileSync(contractJsonVerifyStudPath)
);
const contractAbiVerifyStud = contractJsonVerifyStud.abi;
//Institute contract
const contractJsonInstPath = path.resolve(
  __dirname,
  "../Files",
  "institute.json"
);
const contractJsonInst = JSON.parse(fs.readFileSync(contractJsonInstPath));
const contractAbiInstitute = contractJsonInst.abi;

//Register Institute contract
const contractJsonRegInstPath = path.resolve(
  __dirname,
  "../Files",
  "registerInst.json"
);
const contractJsonRegInst = JSON.parse(
  fs.readFileSync(contractJsonRegInstPath)
);
const contractAbiRegInst = contractJsonRegInst.abi;
const { getStudContract, getStudProfile } = require("./StudFunctions.js");

const RegisterInstitutePrivateToPending = async (value) => {
  const web3 = new Web3(besu.member2.url);
  const web3quorum = new Web3Quorum(web3, chainId);
  const contract = new web3quorum.eth.Contract(contractAbiRegInst);
  console.log("Contract ABI:", contract._jsonInterface);
  // eslint-disable-next-line no-underscore-dangle
  const functionAbi = contract._jsonInterface.find((e) => {
    return e.name === "registerInstToPending";
  });
  if (!functionAbi) {
    console.error("Function ABI for 'registerInstToPending' not found.");
    return { error: "Function ABI not found" };
  }

  const functionArgs = web3quorum.eth.abi
    .encodeParameters(functionAbi.inputs, [value[0], value[1], value[2]])
    .slice(2);
  const functionParams = {
    to: contractInformations.registerInst.contractAddress,
    data: functionAbi.signature + functionArgs,
    privateKey: besu.member2.accountPrivateKey,
    privateFrom: tessera.member2.publicKey,
    privateFor: [tessera.member1.publicKey],
  };
  const transactionHash = await web3quorum.priv.generateAndSendRawTransaction(
    functionParams
  );
  const result = await web3quorum.priv.waitForTransactionReceipt(
    transactionHash
  );

  return result;
};

const RegisterStudentPrivateTransfer = async (value) => {
  console.log("value", value);
  const web3 = new Web3(besu.member2.url);
  const web3quorum = new Web3Quorum(web3, chainId);
  const contract = new web3quorum.eth.Contract(contractAbiVerifyStud);
  console.log("Contract ABI:", contract._jsonInterface);
  const studentcontract = await getStudContract(value[0]);
  const studInfo = await getStudProfile(
    besu.member3.url,
    studentcontract,
    besu.member3.accountPrivateKey,
    tessera.member3.publicKey,
    tessera.member1.publicKey
  );
  const functionAbi = contract._jsonInterface.find((e) => {
    return e.name === "addTransferStudToPending";
  });
  if (!functionAbi) {
    console.error("Function ABI for 'addTransferStudToPending' not found.");
    return { error: "Function ABI not found" };
  }
  const functionArgs = web3quorum.eth.abi
    .encodeParameters(functionAbi.inputs, [
      studInfo.name,
      studInfo.student_address,
      studInfo.email,
      studInfo.id,
      value[1],
      value[2],
    ])
    .slice(2);
  const functionParams = {
    to: contractInformations.verifyStud.contractAddress,
    data: functionAbi.signature + functionArgs,
    privateKey: besu.member2.accountPrivateKey,
    privateFrom: tessera.member2.publicKey,
    privateFor: [tessera.member1.publicKey],
  };
  console.log("functionParams", functionParams);
  const transactionHash = await web3quorum.priv.generateAndSendRawTransaction(
    functionParams
  );
  const result = await web3quorum.priv.waitForTransactionReceipt(
    transactionHash
  );
  console.log("result", result);

  return result;
};
const getInstituteInfo = async (address) => {
  const web3 = new Web3(besu.member2.url);
  const web3quorum = new Web3Quorum(web3, chainId);
  console.log("address", address);
  const contract = new web3quorum.eth.Contract(contractAbiInstitute);
  console.log("Contract ABI:", contract._jsonInterface);
  const functionAbi = contract._jsonInterface.find((e) => {
    return e.name === "getInstInfo";
  });
  if (!functionAbi) {
    console.error("Function ABI for 'getInstInfo' not found.");
    return { error: "Function ABI not found" };
  }
  console.log("functionAbi", functionAbi);

  const functionParams = {
    to: address,
    data: functionAbi.signature,
    privateKey: besu.member2.accountPrivateKey,
    privateFrom: tessera.member2.publicKey,
    privateFor: [tessera.member1.publicKey],
  };
  console.log("functionParams", functionParams);
  const transactionHash = await web3quorum.priv.generateAndSendRawTransaction(
    functionParams
  );
  const result = await web3quorum.priv.waitForTransactionReceipt(
    transactionHash
  );
  const decodedResult = web3quorum.eth.abi.decodeParameters(
    functionAbi.outputs,
    result.output
  );
  const InstInfo = {
    instAddress: decodedResult[0],
    name: decodedResult[1],
    id: decodedResult[2],
  };

  return InstInfo;
};

module.exports = {
  RegisterInstitutePrivateToPending,
  RegisterStudentPrivateTransfer,
  getInstituteInfo,
};
