const Web3 = require("web3");
const path = require("path");
const fs = require("fs-extra");
const Web3Quorum = require("web3js-quorum");
const { formatCurrentDate } = require("./InstFunctions");
const chainId = 1337;
const { besu, tessera, contractInformations } = require("../Files/keys");
const { createStudContract } = require("./deploy");
const contractJsonRegStudPath = path.resolve(
  __dirname,
  "../Files",
  "registerStud.json"
);
const { getInstAddress } = require("./AuthFunctions.js");

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

// pending institute contract
const contractJsonInstitutePendingPath = path.resolve(
  __dirname,
  "../Files",
  "InstitutePending.json"
);
const contractJsonInstitutePending = JSON.parse(
  fs.readFileSync(contractJsonInstitutePendingPath)
);
const contractAbiInstitutePending = contractJsonInstitutePending.abi;

// Verify Stud contract
const contractJsonInstitutePath = path.resolve(
  __dirname,
  "../Files",
  "institute.json"
);
const contractJsonInstitute = JSON.parse(
  fs.readFileSync(contractJsonInstitutePath)
);
const contractAbiInstitute = contractJsonInstitute.abi;

async function getStudContract(accountAddress) {
  const web3 = new Web3(besu.member1.url);
  const web3quorum = new Web3Quorum(web3, chainId);
  const contract = new web3quorum.eth.Contract(contractAbiRegStud);
  const functionAbi = contract._jsonInterface.find((e) => {
    return e.name === "getRegisteredStudentsContract";
  });
  const functionArgs = web3quorum.eth.abi
    .encodeParameters(functionAbi.inputs, [accountAddress])
    .slice(2);
  const functionParams = {
    to: contractInformations.registerStud.contractAddress,
    data: functionAbi.signature + functionArgs,
    privateKey: besu.member1.accountPrivateKey,
    privateFrom: tessera.member1.publicKey,
    privateFor: [tessera.member3.publicKey],
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
  console.log("Contract Address : ", decoded[0]);
  return decoded[0];
}
async function getStudProfile(contractAddress) {
  const web3 = new Web3(besu.member3.url);
  const web3quorum = new Web3Quorum(web3, chainId);
  const contract = new web3quorum.eth.Contract(contractAbiStudent);
  const functionAbi = contract._jsonInterface.find((e) => {
    return e.name === "getStudentInfo";
  });
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
  const studentInformation = web3quorum.eth.abi.decodeParameters(
    functionAbi.outputs,
    result.output
  );
  const decoded = studentInformation[0];
  const studInfo = {
    name: decoded[0],
    student_address: decoded[1],
    email: decoded[2],
    id: decoded[3],
    institutes: decoded[4],
    skills: decoded[5].map((skill) => {
      return {
        skillName: skill[0],
        experience: skill[2],
        endorsed: skill[3],
        endorsedBy: skill[4],
        review: skill[5],
        visible: skill[6],
        cert_hash: skill[7],
      };
    }),
    workexps: decoded[6].map((exp) => {
      return {
        role: exp[0],
        institute: exp[1],
        employer: exp[2],
        startdate: exp[3],
        enddate: exp[4],
        verified: exp[5],
        description: exp[6],
        visible: exp[7],
        cert_hash: exp[8],
      };
    }),
    certifications: decoded[7].map((cert) => {
      return {
        institute: cert[1],
        certificate_name: cert[2],
        visible: cert[3],
        verified: cert[4],
        cert_hash: cert[5],
      };
    }),
  };
  console.log(studInfo);
  return studInfo;
}
async function RegisterStudentPrivate(value) {
  const StudentContract = await createStudContract(value);
  console.log(
    "Student 11 Contract Address : ",
    StudentContract.contractAddress
  );
  const web3 = new Web3(besu.member3.url);
  const web3quorum = new Web3Quorum(web3, chainId);
  const contract = new web3quorum.eth.Contract(contractAbiRegStud);
  const functionAbi = contract._jsonInterface.find((e) => {
    return e.name === "registerStudents";
  });
  console.log([...value, StudentContract.contractAddress]);
  const currentDate = formatCurrentDate();

  const functionArgs = web3quorum.eth.abi
    .encodeParameters(functionAbi.inputs, [
      value[0],
      value[1],
      value[2],
      value[3],
      StudentContract.contractAddress,
      currentDate,
    ])
    .slice(2);
  const functionParams = {
    to: contractInformations.registerStud.contractAddress,
    data: functionAbi.signature + functionArgs,
    privateKey: besu.member3.accountPrivateKey,
    privateFrom: tessera.member3.publicKey,
    privateFor: [tessera.member1.publicKey],
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

async function RegisterStudentPrivateToPending(value) {
  const web3 = new Web3(besu.member2.url);
  const web3quorum = new Web3Quorum(web3, chainId);
  const contract = new web3quorum.eth.Contract(contractAbiInstitutePending);
  const studentcontract = await getStudContract(value[0]);

  const studInfo = await getStudProfile(studentcontract);
  console.log("studInfo", studInfo);
  const InstitutePendingContract = await getInstAddress(value[1]);
  const functionAbi = contract._jsonInterface.find((e) => {
    return e.name === "AddStudInfoToPending";
  });
  function safeString(val) {
    return typeof val === "string" ? val : "";
  }
  const functionArgs = web3quorum.eth.abi
    .encodeParameters(functionAbi.inputs, [
      safeString(studInfo.name),
      safeString(studInfo.student_address),
      safeString(studInfo.email),
      safeString(studInfo.id),
      "Pending",
      safeString(value[1]),
      studInfo.institutes || [],
      studInfo.workexps || [],
      studInfo.skills || [],
      studInfo.certifications || [],
      [],
    ])
    .slice(2);
  const functionParams = {
    to: InstitutePendingContract[0][1],
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
}

//   console.log("value", value);
// const web3 = new Web3(besu.member2.url);
// const web3quorum = new Web3Quorum(web3, chainId);
// const contract = new web3quorum.eth.Contract(contractAbiInstitutePending);
// console.log("Contract ABI:", contract._jsonInterface);
// const studentcontract = await getStudContract(value[0]);
// const studInfo = await getStudProfile(studentcontract);
// const InstitutePendingContract = await getInstAddress(value[2]);
// const functionAbi = contract._jsonInterface.find((e) => {
//   return e.name === "AddStudInfoToPending";
// });
// if (!functionAbi) {
//   console.error("Function ABI for 'addTransferStudToPending' not found.");
//   return { error: "Function ABI not found" };
// }
// console.log("studentinfo from", studInfo);
// const functionArgs = web3quorum.eth.abi
//   .encodeParameters(functionAbi.inputs, [
//     studInfo.name,
//     studInfo.student_address,
//     studInfo.email,
//     studInfo.id,
//     "Transfer",
//     value[2],
//     studInfo.institutes || [],
//     studInfo.skills || [],
//     studInfo.workexps || [],
//     studInfo.certifications || [],
//     studInfo.official_certifications || [],
//   ])

//   .slice(2);
// const functionParams = {
//   to: InstitutePendingContract[0][1],
//   data: functionAbi.signature + functionArgs,
//   privateKey: besu.member2.accountPrivateKey,
//   privateFrom: tessera.member2.publicKey,
//   privateFor: [tessera.member1.publicKey],
// };
// console.log("functionParams", functionParams);
// const transactionHash = await web3quorum.priv.generateAndSendRawTransaction(
//   functionParams
// );
// const result = await web3quorum.priv.waitForTransactionReceipt(
//   transactionHash
// );
// console.log("result", result);
// return result;

const gentStudentInstitution = async (key) => {
  const web3 = new Web3(besu.member3.url);
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
    privateKey: besu.member3.accountPrivateKey,
    privateFrom: tessera.member3.publicKey,
    privateFor: [tessera.member1.publicKey],
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
const getStudentInformation = async (address) => {
  const web3 = new Web3(besu.member3.url);
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
    privateKey: besu.member3.accountPrivateKey,
    privateFrom: tessera.member3.publicKey,
    privateFor: [tessera.member1.publicKey],
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
  const studentInfo = await gentStudentInstitution(key);
  return studentInfo;
};
const addSkill = async (skill, student_name, experiance, contractAddress) => {
  const web3 = new Web3(besu.member3.url);
  const web3quorum = new Web3Quorum(web3, chainId);
  const contract = new web3quorum.eth.Contract(contractAbiStudent);
  const functionAbi = contract._jsonInterface.find((e) => {
    return e.name === "addSkill";
  });
  console.log(skill, student_name, experiance, contractAddress);
  const functionArgs = web3quorum.eth.abi
    .encodeParameters(functionAbi.inputs, [skill, student_name, experiance])
    .slice(2);
  console.log(functionArgs);
  const functionParams = {
    to: contractAddress,
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
  return result;
};
const getSkillCount = async (contractAddress) => {
  const web3 = new Web3(besu.member3.url);
  const web3quorum = new Web3Quorum(web3, chainId);
  const contract = new web3quorum.eth.Contract(contractAbiStudent);
  const functionAbi = contract._jsonInterface.find((e) => {
    return e.name === "getSkillCount";
  });

  const functionParams = {
    to: contractAddress,
    data: functionAbi.signature,
    privateKey: besu.member3.accountPrivateKey,
    privateFrom: tessera.member3.publicKey,
    privateFor: [tessera.member1.publicKey],
  };
  console.log("contractAddress", contractAddress);
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
  const count = decoded[0];
  console.log("decoded", count);
  return count;
};
const ListSkills = async (contractAddress) => {
  const web3 = new Web3(besu.member3.url);
  const web3quorum = new Web3Quorum(web3, chainId);
  const contract = new web3quorum.eth.Contract(contractAbiStudent);

  const functionAbi = contract._jsonInterface.find((e) => {
    return e.name === "getSkillList";
  });
  const functionParams = {
    to: contractAddress,
    data: functionAbi.signature,
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
  const decoded = web3quorum.eth.abi.decodeParameters(
    functionAbi.outputs,
    result.output
  );
  const skills = decoded[0];
  const skillList = [];
  for (let i = 0; i < skills.length; i++) {
    const skill = {
      skillName: skills[i][0],
      studentName: skills[i][1],
      experience: skills[i][2],
      endorsed: skills[i][3],
      endorsedBy: skills[i][4],
      review: skills[i][5],
      visible: skills[i][6],
      cert_hash: skills[i][7],
    };
    skillList.push(skill);
  }
  console.log("skillList", skillList);
  return skillList;
};

module.exports = {
  RegisterStudentPrivate,
  RegisterStudentPublic,
  RegisterStudentPrivateToPending,
  getStudContract,
  getStudProfile,
  getStudentInformation,
  addSkill,
  ListSkills,
};
