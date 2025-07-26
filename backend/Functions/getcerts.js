const { tessera, besu } = require("../Files/keys.js");
const Web3 = require("web3");
const Web3Quorum = require("web3js-quorum");
const chainId = 1337;
const path = require("path");
const fs = require("fs-extra");

// Institute Contract
const contractJsonInstPath = path.resolve(
  __dirname,
  "../Files",
  "institute.json"
);
const contractJsonInst = JSON.parse(fs.readFileSync(contractJsonInstPath));
const contractAbiInst = contractJsonInst.abi;

// Student Contract
const contractJsonStudPath = path.resolve(
  __dirname,
  "../Files",
  "student.json"
);
const contractJsonStud = JSON.parse(fs.readFileSync(contractJsonStudPath));
const contractAbiStud = contractJsonStud.abi;

const getCertCount = async (functionName, contractAddress) => {
  const web3 = new Web3(besu.member3.url);
  const web3quorum = new Web3Quorum(web3, chainId);
  const contract = new web3quorum.eth.Contract(contractAbiStud);
  console.log("contractAddress", contractAddress);
  const functionAbi = contract._jsonInterface.find(
    (e) => e.name === functionName
  );

  if (!functionAbi) {
    throw new Error(`Function ${functionName} not found in ABI`);
  }
  console.log("functionAbiof thecount", functionAbi);
  const functionParams = {
    to: contractAddress,
    data: functionAbi.signature,
    privateKey: besu.member3.accountPrivateKey,
    privateFrom: tessera.member3.publicKey,
    privateFor: [tessera.member1.publicKey],
  };

  const transactionHash = await web3quorum.priv.generateAndSendRawTransaction(
    functionParams
  );
  const result = await web3quorum.priv.waitForTransactionReceipt(
    transactionHash
  );

  const decoded = web3quorum.eth.abi.decodeParameters(
    functionAbi.outputs,
    result.output
  );
  console.log(decoded[0]);
  return decoded[0];
};
async function getUnOfficialCert(student_contract_address) {
  const web3 = new Web3(besu.member3.url);
  const web3quorum = new Web3Quorum(web3, chainId);
  const contract = new web3quorum.eth.Contract(contractAbiStud);
  const functionAbi = contract._jsonInterface.find((e) => {
    return e.name === "getCertificateList";
  });
  const functionParams = {
    to: student_contract_address,
    data: functionAbi.signature,
    privateKey: besu.member3.accountPrivateKey,
    privateFrom: tessera.member3.publicKey,
    privateFor: [tessera.member1.publicKey],
  };
  const transactionHash = await web3quorum.priv.generateAndSendRawTransaction(
    functionParams
  );
  const result = await web3quorum.priv.waitForTransactionReceipt(
    transactionHash
  );
  const decoded = web3quorum.eth.abi.decodeParameters(
    functionAbi.outputs,
    result.output
  );
  const certs = decoded[0];
  const certList = [];
  for (let i = 0; i < certs.length; i++) {
    const intermediate = {
      name: certs[i][0],
      institute: certs[i][1],
      certificate_name: certs[i][2],
      verified: certs[i][3],
      visible: certs[i][4],
      cert_hash: certs[i][5],
    };
    certList.push(intermediate);
  }
  console.log("certList", certList);
  return certList;
}

async function getWorkExp(student_contract_address) {
  const web3 = new Web3(besu.member3.url);
  const web3quorum = new Web3Quorum(web3, chainId);
  const contract = new web3quorum.eth.Contract(contractAbiStud);
  const functionAbi = contract._jsonInterface.find((e) => {
    return e.name === "getWorkExpList";
  });
  const functionParams = {
    to: student_contract_address,
    data: functionAbi.signature,
    privateKey: besu.member3.accountPrivateKey,
    privateFrom: tessera.member3.publicKey,
    privateFor: [tessera.member1.publicKey],
  };
  const transactionHash = await web3quorum.priv.generateAndSendRawTransaction(
    functionParams
  );
  const result = await web3quorum.priv.waitForTransactionReceipt(
    transactionHash
  );
  const decoded = web3quorum.eth.abi.decodeParameters(
    functionAbi.outputs,
    result.output
  );

  const workExps = decoded[0];
  const workExpList = [];
  for (let i = 0; i < workExps.length; i++) {
    console.log("started listing transfer students", i);
    const intermediate = {
      role: workExps[i][0],
      institute: workExps[i][1],
      employer: workExps[i][2],
      startdate: workExps[i][3],
      enddate: workExps[i][4],
      verified: workExps[i][5],
      description: workExps[i][6],
      visible: workExps[i][7],
      cert_hash: workExps[i][8],
    };
    workExpList.push(intermediate);
  }
  console.log("workExpList", workExpList);
  return workExpList;
}

module.exports = {
  getUnOfficialCert,
  getWorkExp,
};
