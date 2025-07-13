const Web3 = require("web3");
const path = require("path");
const fs = require("fs-extra");
const Web3Quorum = require("web3js-quorum");
const chainId = 1337;
const { besu, tessera, contractInformations } = require("../Files/keys");
const createContract = require("../Files/main");
const contractJsonRegStudPath = path.resolve(
  __dirname,
  "../Files",
  "registerStud.json"
);
const contractJsonRegStud = JSON.parse(
  fs.readFileSync(contractJsonRegStudPath)
);
const contractAbiRegStud = contractJsonRegStud.abi;
const contractJsonStudentPath = path.resolve(
  __dirname,
  "../Files",
  "student.json"
);
const contractJsonStudent = JSON.parse(
  fs.readFileSync(contractJsonStudentPath)
);
const contractAbiStudent = contractJsonStudent.abi;

// Public Data
const contractJsonPublicDataPath = path.resolve(
  __dirname,
  "../Files",
  "publicdata.json"
);

const contractJsonPublicData = JSON.parse(
  fs.readFileSync(contractJsonPublicDataPath)
);

const contractAbiPublicData = contractJsonPublicData.abi;

async function RegisterStudentPrivate(
  clientUrl,
  address,
  value,
  fromPrivateKey,
  fromPublicKey,
  toPublicKey
) {
  // Deploy Student COntract
  console.log(
    besu.member3.url,
    besu.member3.accountPrivateKey,
    tessera.member3.publicKey,
    tessera.member1.publicKey
  );
  const StudentContract = await createContract(
    besu.member3.url,
    besu.member3.accountPrivateKey,
    tessera.member3.publicKey,
    tessera.member1.publicKey,
    value
  );
  console.log(
    "Student 11 Contract Address : ",
    StudentContract.contractAddress
  );
  // At Register Stud Contract
  const web3 = new Web3(clientUrl);
  const web3quorum = new Web3Quorum(web3, chainId);
  const contract = new web3quorum.eth.Contract(contractAbiRegStud);
  // eslint-disable-next-line no-underscore-dangle
  const functionAbi = contract._jsonInterface.find((e) => {
    return e.name === "registerStudents";
  });
  console.log([...value, StudentContract.contractAddress]);

  const functionArgs = web3quorum.eth.abi
    .encodeParameters(functionAbi.inputs, [
      value[0],
      value[1],
      value[2],
      value[3],
      StudentContract.contractAddress,
    ])
    .slice(2);
  const functionParams = {
    to: address,
    data: functionAbi.signature + functionArgs,
    privateKey: fromPrivateKey,
    privateFrom: fromPublicKey,
    privateFor: [toPublicKey],
  };
  console.log("Student 22 Contract Address : ", functionParams);
  const transactionHash = await web3quorum.priv.generateAndSendRawTransaction(
    functionParams
  );
  console.log(
    "Student 33 Contract Address : ",
    StudentContract.contractAddress
  );
  console.log(`Transaction hash: ${transactionHash}`);
  const result = await web3quorum.priv.waitForTransactionReceipt(
    transactionHash
  );

  return [result, StudentContract.contractAddress];
}

async function RegisterStudentPublic(contractAddress, value) {
  console.log("Registering Student Public");

  const host = besu.rpcnode.url;
  const web3 = new Web3(host);

  const account = web3.eth.accounts.privateKeyToAccount(
    besu.member3.accountPrivateKey
  );
  const fromAddress = account.address;

  const contractInstance = new web3.eth.Contract(
    contractAbiPublicData,
    contractAddress
  );

  // Encode function call
  const data = contractInstance.methods
    .registerStudent(value[0], value[1])
    .encodeABI();

  const tx = {
    to: contractAddress,
    data: data,
    gas: 150000, // or tune it
    gasPrice: "0x0", // for Besu/Quorum, no fees
    from: fromAddress,
  };

  const signed = await web3.eth.accounts.signTransaction(
    tx,
    besu.member3.accountPrivateKey
  );
  const receipt = await web3.eth.sendSignedTransaction(signed.rawTransaction);

  console.log("Result from Register:", receipt);
  return receipt;
}

const gentStudentInstitution = async (
  clientUrl,
  fromPrivateKey,
  fromPublicKey,
  toPublicKey,
  key
) => {
  const web3 = new Web3(clientUrl);
  const web3quorum = new Web3Quorum(web3, chainId);
  const contract = new web3quorum.eth.Contract(contractAbiRegStud);
  // eslint-disable-next-line no-underscore-dangl
  const functionAbi = contract._jsonInterface.find((e) => {
    return e.name === "getRegisteredStudentByKey";
  });
  const functionArgs = web3quorum.eth.abi
    .encodeParameter(functionAbi.inputs[0], key)
    .slice(2);
  const functionParams = {
    to: contractInformations.registerStud.contractAddress,
    data: functionAbi.signature + functionArgs,
    privateKey: fromPrivateKey,
    privateFrom: fromPublicKey,
    privateFor: [toPublicKey],
  };
  const transactionHash = await web3quorum.priv.generateAndSendRawTransaction(
    functionParams
  );
  // console.log(`Transaction hash: ${transactionHash}`);
  const result = await web3quorum.priv.waitForTransactionReceipt(
    transactionHash
  );
  const decoded = web3quorum.eth.abi.decodeParameters(
    functionAbi.outputs,
    result.output
  );
  console.log("decoded", decoded);
  return decoded;
};

const getStudentInformation = async (
  clientUrl,
  address,
  fromPrivateKey,
  fromPublicKey,
  toPublicKey
) => {
  const web3 = new Web3(clientUrl);
  const web3quorum = new Web3Quorum(web3, chainId);
  const contract = new web3quorum.eth.Contract(contractAbiStudent);
  // eslint-disable-next-line no-underscore-dangle
  const functionAbi = contract._jsonInterface.find((e) => {
    return e.name === "getStudentInfo";
  });

  const functionArgs = web3quorum.eth.abi
    .encodeParameters(functionAbi.inputs, [])
    .slice(2);
  const functionParams = {
    to: address,
    data: functionAbi.signature + functionArgs,
    privateKey: fromPrivateKey,
    privateFrom: fromPublicKey,
    privateFor: [toPublicKey],
  };
  const transactionHash = await web3quorum.priv.generateAndSendRawTransaction(
    functionParams
  );
  // console.log(`Transaction hash: ${transactionHash}`);
  const result = await web3quorum.priv.waitForTransactionReceipt(
    transactionHash
  );
  const decoded = web3quorum.eth.abi.decodeParameters(
    functionAbi.outputs,
    result.output
  );
  console.log("decoded", decoded);
  const key = web3.utils.soliditySha3(decoded[0], decoded[3]);
  console.log("key", key);
  const studentInfo = await gentStudentInstitution(
    clientUrl,

    fromPrivateKey,
    fromPublicKey,
    toPublicKey,
    key
  );
  return studentInfo;
};
module.exports = {
  RegisterStudentPrivate,
  RegisterStudentPublic,
  getStudentInformation,
};
