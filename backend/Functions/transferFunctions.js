const Web3 = require("web3");
const path = require("path");
const fs = require("fs-extra");
const Web3Quorum = require("web3js-quorum");
const chainId = 1337;
const { besu, tessera, contractInformations } = require("../Files/keys");
const { getStudContract } = require("./StudFunctions");
const { removePendingStudents } = require("./InstFunctions");
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
// register stud ABI
const contractJsonRegStudPath = path.resolve(
  __dirname,
  "../Files",
  "registerStud.json"
);
const contractJsonRegStud = JSON.parse(
  fs.readFileSync(contractJsonRegStudPath)
);
const contractAbiRegStud = contractJsonRegStud.abi;

// pending inst contract
const contractJsonInstPendingPath = path.resolve(
  __dirname,
  "../Files",
  "InstitutePending.json"
);
const contractJsonInstPending = JSON.parse(
  fs.readFileSync(contractJsonInstPendingPath)
);
const contractAbiInstPending = contractJsonInstPending.abi;

// Verify Inst contract
const contractJsonAdminPath = path.resolve(__dirname, "../Files", "admin.json");
const contractJsonAdmin = JSON.parse(fs.readFileSync(contractJsonAdminPath));
const contractAbiAdmin = contractJsonAdmin.abi;
// student contract
const contractJsonStudPath = path.resolve(
  __dirname,
  "../Files",
  "student.json"
);
const contractJsonStud = JSON.parse(fs.readFileSync(contractJsonStudPath));
const contractAbiStud = contractJsonStud.abi;

const getInstitutesCount = async (functionName) => {
  const web3 = new Web3(besu.member1.url);
  const web3quorum = new Web3Quorum(web3, chainId);
  const contract = new web3.eth.Contract(contractAbiAdmin);

  // Dynamically find the ABI for the provided function name
  const functionAbi = contract._jsonInterface.find(
    (e) => e.name === functionName
  );

  if (!functionAbi) {
    throw new Error(`Function ${functionName} not found in ABI`);
  }

  const functionParams = {
    to: contractInformations.admin.contractAddress,
    data: functionAbi.signature,
    privateKey: besu.member1.accountPrivateKey,
    privateFrom: tessera.member1.publicKey,
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

const getStudentsCount = async (functionName) => {
  const web3 = new Web3(besu.member2.url);
  const web3quorum = new Web3Quorum(web3, chainId);
  const contract = new web3quorum.eth.Contract(contractAbiInstitute);

  // Dynamically find the ABI for the provided function name
  const functionAbi = contract._jsonInterface.find(
    (e) => e.name === functionName
  );

  if (!functionAbi) {
    throw new Error(`Function ${functionName} not found in ABI`);
  }
  console.log("functionAbiof thecount", functionAbi);
  const functionParams = {
    to: contractInformations.institute.contractAddress,
    data: functionAbi.signature,
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

  const decoded = web3quorum.eth.abi.decodeParameters(
    functionAbi.outputs,
    result.output
  );
  console.log(decoded[0]);
  return decoded[0];
};

const ListPendingStudents = async (contractAddress) => {
  const web3 = new Web3(besu.member2.url);
  const web3quorum = new Web3Quorum(web3, chainId);
  const contract = new web3quorum.eth.Contract(contractAbiInstPending);
  console.log("started listing");
  const functionAbi = contract._jsonInterface.find((e) => {
    return e.name === "getPendingList";
  });
  const functionParams = {
    to: contractAddress,
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
  const decoded = web3quorum.eth.abi.decodeParameters(
    functionAbi.outputs,
    result.output
  );
  console.log(decoded);

  const pendingStudentList = decoded[0].map((student, index) => {
    return {
      name: student[0],
      index: index,
      application_status: student[1],
      student_address: student[2],
      email: student[3],
      id: student[4],
      registration_type: student[5],
      institutes: student[6],
      skills: student[7].map((skill) => {
        return {
          skillName: skill[0],
          experience: skill[1],
          endorsed: skill[2],
          endorsedBy: skill[3],
          review: skill[4],
          visible: skill[5],
          cert_hash: skill[6],
        };
      }),
      workexps: student[7].map((exp) => {
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
      certifications: student[8].map((cert) => {
        return {
          institute: cert[0],
          certificate_name: cert[1],
          visible: cert[2],
          verified: cert[3],
          cert_hash: cert[4],
        };
      }),
      official_certifications: student[9].map((cert) => {
        return {
          institute: cert[0],
          certificate_name: cert[1],
          visible: cert[2],
          verified: cert[3],
          cert_hash: cert[4],
        };
      }),
    };
  });
  const transferStudents = [];
  const pendingStudents = [];

  for (let i = 0; i < pendingStudentList.length; i++) {
    const student = pendingStudentList[i];
    if (student.registration_type === "Transfer") {
      transferStudents.push(student);
    } else if (student.registration_type === "Pending") {
      pendingStudents.push(student);
    }
  }

  return { pendingStudents, transferStudents };
};

// const ListTransferStudents = async (contractAddress) => {
//   const web3 = new Web3(besu.member2.url);
//   const web3quorum = new Web3Quorum(web3, chainId);
//   const contract = new web3quorum.eth.Contract(contractAbiInstitute);

//   const functionAbi = contract._jsonInterface.find((e) => {
//     return e.name === "getTransferStudentsList";
//   });
//   const functionParams = {
//     to: contractAddress,
//     data: functionAbi.signature,
//     privateKey: besu.member2.accountPrivateKey,
//     privateFrom: tessera.member2.publicKey,
//     privateFor: [tessera.member1.publicKey],
//   };
//   const transactionHash = await web3quorum.priv.generateAndSendRawTransaction(
//     functionParams
//   );
//   const result = await web3quorum.priv.waitForTransactionReceipt(
//     transactionHash
//   );
//   const decoded = web3quorum.eth.abi.decodeParameters(
//     functionAbi.outputs,
//     result.output
//   );
//   console.log("decoded", decoded);
//   const transferStud = decoded[0];
//   const students = [];
//   for (let i = 0; i < transferStud.length; i++) {
//     const student = {
//       name: transferStud[i][0],
//       address: transferStud[i][1],
//       email: transferStud[i][2],
//       id: transferStud[i][3],
//       institute_address: transferStud[i][4],
//       index: i,
//     };
//     students.push(student);
//   }
//   console.log("studentsList", students);
//   return students;
// };
const addInstTostudInfo = async (key, institute_address) => {
  console.log("Args", key, institute_address);
  const web3 = new Web3(besu.member3.url);
  const web3quorum = new Web3Quorum(web3, chainId);
  const contract = new web3quorum.eth.Contract(contractAbiRegStud);
  console.log("started addingtoinfo step1");
  const functionAbi = contract._jsonInterface.find((e) => {
    return e.name === "addInstTostudInfo";
  });
  const functionArgs = web3quorum.eth.abi
    .encodeParameters(functionAbi.inputs, [key, institute_address])
    .slice(2);

  console.log("functionArgs1", functionArgs);

  const functionParams = {
    to: contractInformations.registerStud.contractAddress,
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
  console.log("result1", result);
  return result;
};
const verifystudent = async (
  studentInfo,
  functionName,
  institute_contract_address
) => {
  const web3 = new Web3(besu.member2.url);
  const web3quorum = new Web3Quorum(web3, chainId);
  const contract = new web3quorum.eth.Contract(contractAbiInstitute);
  console.log("started verifying step2");
  const functionAbi = contract._jsonInterface.find((e) => {
    return e.name === functionName;
  });
  const functionArgs = web3quorum.eth.abi
    .encodeParameters(functionAbi.inputs, [studentInfo])
    .slice(2);

  console.log("functionArgs", functionArgs);
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
  console.log("result2", result);
  return result;
};
const addInstToProfile = async (studAddress, instituteAddress) => {
  const web3 = new Web3(besu.member1.url);
  const web3quorum = new Web3Quorum(web3, chainId);
  const contract = new web3quorum.eth.Contract(contractAbiStud);
  console.log("started addingtoprofile step3");
  const functionAbi = contract._jsonInterface.find((e) => {
    return e.name === "addInstToProfile";
  });
  const contractAddress = await getStudContract(studAddress);
  const functionArgs = web3quorum.eth.abi
    .encodeParameter(functionAbi.inputs[0], instituteAddress)
    .slice(2);

  console.log("functionArgs", functionArgs);
  const functionParams = {
    to: contractAddress,
    data: functionAbi.signature + functionArgs,
    privateKey: besu.member1.accountPrivateKey,
    privateFrom: tessera.member1.publicKey,
    privateFor: [tessera.member3.publicKey],
  };
  console.log("functionParams", functionParams);
  const transactionHash = await web3quorum.priv.generateAndSendRawTransaction(
    functionParams
  );
  const result = await web3quorum.priv.waitForTransactionReceipt(
    transactionHash
  );
  console.log("result3", result);
  return result;
};
const VerifyPendingStudent = async (
  student_name,
  index,
  application_status,
  student_address,
  email,
  id,
  registration_type,
  institutes,
  skills,
  workexps,
  certifications,
  official_certifications,
  institute_contract_address,
  inst_address,
  inst_Pending_contract_address
) => {
  const studentInfo = {
    student_name,
    application_status,
    student_address,
    email,
    id,
    registration_type,
    institutes,
    inst_address,
    skills,
    workexps,
    certifications,
    official_certifications,
  };
  console.log("studentInfo", studentInfo);
  console.log("started verifying");
  const web3 = new Web3(besu.member2.url);
  const key = web3.utils.soliditySha3(student_address, id);
  console.log("key", key);
  const result1 = await addInstTostudInfo(key, inst_address);
  const result2 = await verifystudent(
    studentInfo,
    "verifystudent",
    institute_contract_address
  );
  const result3 = await addInstToProfile(student_address, inst_address);
  const result4 = await removePendingStudents(
    student_address,
    inst_Pending_contract_address
  );
  console.log("result1", result1);
  console.log("result2", result2);
  console.log("result3", result3);
  console.log("result4", result4);
  console.log(
    result1.status === "0x1" &&
      result2.status === "0x1" &&
      result3.status === "0x1" &&
      result4.status === "0x1"
  );
  return (
    result1.status === "0x1" &&
    result2.status === "0x1" &&
    result3.status === "0x1" &&
    result4.status === "0x1"
  );
};
const VerifyTransferStudent = async (
  name,
  address,
  email,
  id,
  index,
  institute_address
) => {
  const web3 = new Web3(besu.member2.url);
  console.log("started verifying", index);
  const key = web3.utils.soliditySha3(address, id);
  const result1 = await addInstTostudInfo(index, key, institute_address);
  const result2 = await verifystudent(index, "verifyTransferstudent");
  const result3 = await addInstToProfile(index, address, institute_address);

  console.log(
    result1.status === "0x1" &&
      result2.status === "0x1" &&
      result3.status === "0x1"
  );
  return (
    result1.status === "0x1" &&
    result2.status === "0x1" &&
    result3.status === "0x1"
  );
};

module.exports = {
  ListPendingStudents,
  VerifyPendingStudent,
  VerifyTransferStudent,
  getInstitutesCount,
  getStudentsCount,
};
