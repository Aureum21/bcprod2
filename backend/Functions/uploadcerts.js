const { tessera, besu } = require("../Files/keys.js");
const Web3 = require("web3");
const Web3Quorum = require("web3js-quorum");
const chainId = 1337;
const { getStudProfile } = require("./StudFunctions.js");
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

async function addOfficialCert(
  name,
  student_address,
  institute_address,
  certificate_hash,
  certificate_type,
  institute_contract_address,
  startDate,
  endDate,
  description
) {
  const web3 = new Web3(besu.member2.url);
  const web3quorum = new Web3Quorum(web3, chainId);
  const contract = new web3quorum.eth.Contract(contractAbiInst);

  const functionAbi = contract._jsonInterface.find((e) => {
    return e.name === "AddnewOfficialCert";
  });
  const official_cert = {
    student: student_address,
    cert_type: certificate_type,
    student_name: name,
    institute: institute_address,
    startdate: startDate,
    enddate: endDate,
    verified: false,
    description: description,
    cert_hash: certificate_hash,
  };
  const functionArgs = web3quorum.eth.abi
    .encodeParameters(functionAbi.inputs, [student_address, official_cert])
    .slice(2);
  const functionParams = {
    to: institute_contract_address,
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
}

async function addUnOfficialCert(
  certificate_name,
  institute_address,
  student_contract_address,
  certificate_hash
) {
  console.log("student_contract_address", student_contract_address);
  console.log("institute_address", institute_address);
  console.log("certificate_name", certificate_name);
  const studentProfile = await getStudProfile(student_contract_address);
  console.log("studentProfile name", studentProfile.name);
  const web3 = new Web3(besu.member3.url);
  const web3quorum = new Web3Quorum(web3, chainId);
  const contract = new web3quorum.eth.Contract(contractAbiStud);
  const functionAbi = contract._jsonInterface.find((e) => {
    return e.name === "addCertification";
  });
  const functionArgs = web3quorum.eth.abi
    .encodeParameters(functionAbi.inputs, [
      studentProfile.student_name,
      institute_address,
      certificate_name,
      certificate_hash,
    ])
    .slice(2);
  console.log("functionArgs", functionArgs);
  const functionParams = {
    to: student_contract_address,
    data: functionAbi.signature + functionArgs,
    privateKey: besu.member3.accountPrivateKey,
    privateFrom: tessera.member3.publicKey,
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
}

async function addWorkExp(
  role,
  instAddress,
  employer,
  startDate,
  endDate,
  description,
  certificate_hash,
  student_contract_address
) {
  console.log("student_contract_address", student_contract_address);
  console.log("instAddress", instAddress);
  console.log("role", role);
  console.log("employer", employer);
  console.log("startDate", startDate);
  console.log("endDate", endDate);
  console.log("description", description);
  console.log("certificate_hash", certificate_hash);
  const web3 = new Web3(besu.member3.url);
  const web3quorum = new Web3Quorum(web3, chainId);
  const contract = new web3quorum.eth.Contract(contractAbiStud);
  const functionAbi = contract._jsonInterface.find((e) => {
    return e.name === "addWorkExp";
  });
  const functionArgs = web3quorum.eth.abi
    .encodeParameters(functionAbi.inputs, [
      role,
      instAddress,
      employer,
      startDate,
      endDate,
      description,
      certificate_hash,
    ])
    .slice(2);
  console.log("functionArgs", functionArgs);
  const functionParams = {
    to: student_contract_address,
    data: functionAbi.signature + functionArgs,
    privateKey: besu.member3.accountPrivateKey,
    privateFrom: tessera.member3.publicKey,
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
}
module.exports = { addOfficialCert, addUnOfficialCert, addWorkExp };
