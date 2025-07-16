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

  // Dynamically find the ABI for the provided function name
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
  const certCount = await getCertCount(
    "getCertificationCount",
    student_contract_address
  );
  console.log("certCount", certCount);
  const functionAbi = contract._jsonInterface.find((e) => {
    return e.name === "getCertificationByIndex";
  });
  const certs = [];
  for (let i = 0; i < certCount; i++) {
    console.log("started listing transfer students", i);
    const functionArgs = web3quorum.eth.abi
      .encodeParameter(functionAbi.inputs[0], i)
      .slice(2);
    const functionParams = {
      to: student_contract_address,
      data: functionAbi.signature + functionArgs,
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
    console.log(decoded);
    const intermediate = {
      name: decoded[0],
      institute: decoded[1],
      certificate_name: decoded[2],
      cert_hash: decoded[3],
      verified: decoded[4],
      visible: decoded[5],
    };
    certs.push(intermediate);
  }
  console.log("certs", certs);
  return certs;
}

async function getWorkExp(student_contract_address) {
  const web3 = new Web3(besu.member3.url);
  const web3quorum = new Web3Quorum(web3, chainId);
  const contract = new web3quorum.eth.Contract(contractAbiStud);
  const workExpCount = await getCertCount(
    "getWorkExpCount",
    student_contract_address
  );
  console.log("workExpCount", workExpCount);
  const functionAbi = contract._jsonInterface.find((e) => {
    return e.name === "getWorkExpByIndex";
  });
  const workExps = [];
  for (let i = 0; i < workExpCount; i++) {
    console.log("started listing transfer students", i);
    const functionArgs = web3quorum.eth.abi
      .encodeParameter(functionAbi.inputs[0], i)
      .slice(2);
    const functionParams = {
      to: student_contract_address,
      data: functionAbi.signature + functionArgs,
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
    console.log(decoded);
    const intermediate = {
      role: decoded[0],
      cert_hash: decoded[1],
      institute: decoded[2],
      startdate: decoded[3],
      enddate: decoded[4],
      description: decoded[5],
      visible: decoded[6],
    };
    console.log("decoded", decoded);
    workExps.push(intermediate);
  }
  console.log("workExps", workExps);
  return workExps;
}

module.exports = {
  getUnOfficialCert,
  getWorkExp,
};
