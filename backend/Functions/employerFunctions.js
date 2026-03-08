const Web3 = require("web3");
const path = require("path");
const fs = require("fs-extra");
const Web3Quorum = require("web3js-quorum");
const chainId = 1337;
const { besu, tessera, contractInformations } = require("../Files/keys");
const { createEmpContract } = require("./deploy");

//public data
const contractJsonPublicDataPath = path.resolve(
  __dirname,
  "../Files",
  "publicdata.json"
);

const contractJsonPublicData = JSON.parse(
  fs.readFileSync(contractJsonPublicDataPath)
);

const contractAbiPublicData = contractJsonPublicData.abi;
// Register Employer contract
const contractJsonRegEmpPath = path.resolve(
  __dirname,
  "../Files",
  "registerEmp.json"
);
const contractJsonRegEmp = JSON.parse(fs.readFileSync(contractJsonRegEmpPath));
const contractAbiRegEmp = contractJsonRegEmp.abi;

//employer contract
const contractJsonEmpPath = path.resolve(
  __dirname,
  "../Files",
  "employer.json"
);
const contractJsonEmp = JSON.parse(fs.readFileSync(contractJsonEmpPath));
const contractAbiEmp = contractJsonEmp.abi;

async function RegisterEmployerToPrivate(value) {
  const web3 = new Web3(besu.member4.url);
  const web3quorum = new Web3Quorum(web3, chainId);
  const contract = new web3quorum.eth.Contract(contractAbiRegEmp);
  const functionAbi = contract._jsonInterface.find((e) => {
    return e.name === "registerEmployers";
  });

  const functionArgs = web3quorum.eth.abi
    .encodeParameters(functionAbi.inputs, [
      value[0],
      value[1],
      value[2],
      value[3],
    ])
    .slice(2);
  const functionParams = {
    to: contractInformations.registerEmp.contractAddress,
    data: functionAbi.signature + functionArgs,
    privateKey: besu.member4.accountPrivateKey,
    privateFrom: tessera.member4.publicKey,
    privateFor: [tessera.member1.publicKey],
  };
  console.log("Employer 22 Contract Address : ", functionParams);
  const transactionHash = await web3quorum.priv.generateAndSendRawTransaction(
    functionParams
  );
  const result = await web3quorum.priv.waitForTransactionReceipt(
    transactionHash
  );
  console.log("Employer 33 result : ", result);

  return result;
}

async function RegisterEmployerPrivate(value) {
  const EmployerContract = await createEmpContract(value);
  console.log("Employer Contract Address : ", EmployerContract.contractAddress);
  console.log("Employer Address : ", value[1]);
  const result = await RegisterEmployerToPrivate([
    value[0],
    value[1],
    value[2],
    EmployerContract.contractAddress,
  ]);
  const receipt = await RegisterEmployerPublic(
    value[1],
    EmployerContract.contractAddress
  );

  return receipt;
}

async function RegisterEmployerPublic(employer_address, contractAddress) {
  console.log("Registering employer Public");

  const host = besu.rpcnode.url;
  const web3 = new Web3(host);

  const account = web3.eth.accounts.privateKeyToAccount(
    besu.member4.accountPrivateKey
  );
  const fromAddress = account.address;

  const contractInstance = new web3.eth.Contract(
    contractAbiPublicData,
    contractInformations.publicdata.contractAddress
  );

  // Encode function call
  const data = contractInstance.methods
    .registerEmployer(employer_address, contractAddress)
    .encodeABI();

  const tx = {
    to: contractInformations.publicdata.contractAddress,
    data: data,
    gas: 150000, // or tune it
    gasPrice: "0x0", // for Besu/Quorum, no fees
    from: fromAddress,
  };

  const signed = await web3.eth.accounts.signTransaction(
    tx,
    besu.member4.accountPrivateKey
  );
  const receipt = await web3.eth.sendSignedTransaction(signed.rawTransaction);

  console.log("Result from Register:", receipt);
  return receipt;
}

async function ListEmployers() {
  const web3 = new Web3(besu.member4.url);
  const web3quorum = new Web3Quorum(web3, chainId);
  const contract = new web3quorum.eth.Contract(contractAbiRegEmp);
  const functionAbi = contract._jsonInterface.find((e) => {
    return e.name === "getRegisteredEmployerList";
  });

  const functionParams = {
    to: contractInformations.registerEmp.contractAddress,
    data: functionAbi.signature,
    privateKey: besu.member4.accountPrivateKey,
    privateFrom: tessera.member4.publicKey,
    privateFor: [tessera.member1.publicKey],
  };
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
  const employers = decodedResult[0].map((employer) => {
    return {
      name: employer[0],
      employer_address: employer[1],
      email: employer[2],
    };
  });
  console.log("decodedResult", employers);

  return employers;
}

async function applyForJob(
  employeeAddress,
  employeeName,
  employerAddress,
  skill,
  cert,
  workExp
) {
  // function safeString(val) {
  //   return typeof val === "string" ? val : "";
  // }

  // const convertedSkills = skill.map((skill) => {
  //   return {
  //     skill_name: safeString(skill.skillName),
  //     experience: safeString(skill.experience),
  //     endorsed: !!skill.endorsed,
  //     endorser_address:
  //       skill.endorsedBy || "0x0000000000000000000000000000000000000000",
  //     review: safeString(skill.review),
  //     visible: skill.visible !== undefined ? skill.visible : true,
  //     cert_hash: safeString(skill.cert_hash),
  //   };
  // });

  // const convertedWorkExp = workExp.map((exp) => {
  //   return {
  //     role: safeString(exp.role),
  //     institute: exp.institute || "0x0000000000000000000000000000000000000000", // or pass actual address
  //     employer: "",
  //     startdate: safeString(exp.startdate),
  //     enddate: safeString(exp.enddate),
  //     verified: false,
  //     description: safeString(exp.description),
  //     visible: exp.visible !== undefined ? exp.visible : true,
  //     cert_hash: safeString(exp.cert_hash),
  //   };
  // });

  // const convertedCerts = cert.map((cert) => {
  //   return {
  //     institute: cert.institute || "0x0000000000000000000000000000000000000000",
  //     certificate_name: safeString(cert.certificate_name),
  //     visible: cert.visible !== undefined ? cert.visible : true,
  //     verified: cert.verified !== undefined ? cert.verified : false,
  //     cert_hash: safeString(cert.cert_hash),
  //   };
  // });

  const contractAddress = await getEmployerContractAddress(employerAddress);
  console.log("contractAddress", contractAddress);
  const web3 = new Web3(besu.member4.url);
  const web3quorum = new Web3Quorum(web3, chainId);
  const contract = new web3quorum.eth.Contract(contractAbiEmp);
  const functionAbi = contract._jsonInterface.find((e) => {
    return e.name === "addpendingEmployeeInfo";
  });

  const functionArgs = web3quorum.eth.abi
    .encodeParameters(functionAbi.inputs, [
      employeeName,
      "applied",
      employeeAddress,
      workExp,
      skill,
      cert,
    ])
    .slice(2);
  console.log(functionArgs);
  const functionParams = {
    to: contractAddress,
    data: functionAbi.signature + functionArgs,
    privateKey: besu.member4.accountPrivateKey,
    privateFrom: tessera.member4.publicKey,
    privateFor: [tessera.member1.publicKey],
  };
  const startTimer = performance.now();
  const transactionHash = await web3quorum.priv.generateAndSendRawTransaction(
    functionParams
  );
  console.log("Transaction Hash from applyForJob : ", transactionHash);
  const result = await web3quorum.priv.waitForTransactionReceipt(
    transactionHash
  );
  console.log("Result from applyForJob : ", result);
  const endTimer = performance.now();
  console.log("Time taken for the just applied job block: ", endTimer - startTimer);
  return result;
}

async function getEmployerContractAddress(employerAddress) {
  const web3 = new Web3(besu.member4.url);
  const web3quorum = new Web3Quorum(web3, chainId);
  const contract = new web3quorum.eth.Contract(contractAbiRegEmp);
  const functionAbi = contract._jsonInterface.find((e) => {
    return e.name === "getRegisteredEmployersContract";
  });

  const functionArgs = web3quorum.eth.abi
    .encodeParameters(functionAbi.inputs, [employerAddress])
    .slice(2);
  const functionParams = {
    to: contractInformations.registerEmp.contractAddress,
    data: functionAbi.signature + functionArgs,
    privateKey: besu.member4.accountPrivateKey,
    privateFrom: tessera.member4.publicKey,
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
  console.log("decodedResult", decodedResult[0]);

  return decodedResult[0];
}
const ListPendingEmployees = async (contractAddress) => {
  const web3 = new Web3(besu.member4.url);
  const web3quorum = new Web3Quorum(web3, chainId);
  const contract = new web3quorum.eth.Contract(contractAbiEmp);
  const functionAbi = contract._jsonInterface.find((e) => {
    return e.name === "getPendingEmployeeInfo";
  });

  const functionParams = {
    to: contractAddress,
    data: functionAbi.signature,
    privateKey: besu.member4.accountPrivateKey,
    privateFrom: tessera.member4.publicKey,
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
  const decodedResult = web3quorum.eth.abi.decodeParameters(
    functionAbi.outputs,
    result.output
  );
  console.log("decodedResult", decodedResult[0]);
  const pendingEmployees = decodedResult[0].map((employee) => {
    return {
      employee_name: employee[0],
      application_status: employee[1],
      employee_address: employee[2],
      role: employee[3],
      institutes: employee[4],
      skills: employee[5].map((skill) => {
        return {
          skill_name: skill[0],
          experience: skill[1],
          endorsed: skill[2],
          endorsedBy: skill[3],
          review: skill[4],
          visible: skill[5],
          cert_hash: skill[6],
        };
      }),
      workexps: employee[6].map((exp) => {
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
      certifications: employee[7].map((cert) => {
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

  return pendingEmployees;
};

const acceptEmployee = async (employeeAddress, employerContractAddress) => {
  const web3 = new Web3(besu.member4.url);
  const web3quorum = new Web3Quorum(web3, chainId);
  const contract = new web3quorum.eth.Contract(contractAbiEmp);
  const functionAbi = contract._jsonInterface.find((e) => {
    return e.name === "acceptEmployee";
  });

  const functionArgs = web3quorum.eth.abi
    .encodeParameters(functionAbi.inputs, [employeeAddress])
    .slice(2);
  const functionParams = {
    to: employerContractAddress,
    data: functionAbi.signature + functionArgs,
    privateKey: besu.member4.accountPrivateKey,
    privateFrom: tessera.member4.publicKey,
    privateFor: [tessera.member1.publicKey],
  };
  const startTimer = performance.now();
  const transactionHash = await web3quorum.priv.generateAndSendRawTransaction(
    functionParams
  );
  const result = await web3quorum.priv.waitForTransactionReceipt(
    transactionHash
  );
  const endTimer = performance.now();
  console.log("Time taken for the block: ", endTimer - startTimer);
  return result;
};
const rejectEmployee = async (employeeAddress, employerContractAddress) => {
  const web3 = new Web3(besu.member4.url);
  const web3quorum = new Web3Quorum(web3, chainId);
  const contract = new web3quorum.eth.Contract(contractAbiEmp);
  const functionAbi = contract._jsonInterface.find((e) => {
    return e.name === "rejectEmployee";
  });

  const functionArgs = web3quorum.eth.abi
    .encodeParameters(functionAbi.inputs, [employeeAddress])
    .slice(2);
  const functionParams = {
    to: employerContractAddress,
    data: functionAbi.signature + functionArgs,
    privateKey: besu.member4.accountPrivateKey,
    privateFrom: tessera.member4.publicKey,
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

const getEmployerInfo = async (employerContractAddress) => {
  const web3 = new Web3(besu.member4.url);
  const web3quorum = new Web3Quorum(web3, chainId);
  const contract = new web3quorum.eth.Contract(contractAbiEmp);
  const functionAbi = contract._jsonInterface.find((e) => {
    return e.name === "getEmployerInfo";
  });

  const functionParams = {
    to: employerContractAddress,
    data: functionAbi.signature,
    privateKey: besu.member4.accountPrivateKey,
    privateFrom: tessera.member4.publicKey,
    privateFor: [tessera.member1.publicKey],
  };
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
  const employerInfo = decodedResult;
  const convertedEmployerInfo = {
    employer_address: employerInfo[0],
    employer_name: employerInfo[1],
    email: employerInfo[2],
  };

  return convertedEmployerInfo;
};
const getNumberOfApplicants = async (employerContractAddress) => {
  const web3 = new Web3(besu.member4.url);
  const web3quorum = new Web3Quorum(web3, chainId);
  const contract = new web3quorum.eth.Contract(contractAbiEmp);
  const functionAbi = contract._jsonInterface.find((e) => {
    return e.name === "getNumberOfApplicants";
  });

  const functionParams = {
    to: employerContractAddress,
    data: functionAbi.signature,
    privateKey: besu.member4.accountPrivateKey,
    privateFrom: tessera.member4.publicKey,
    privateFor: [tessera.member1.publicKey],
  };
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
  const numberOfApplicants = {
    rejected: decodedResult[0],
    accepted: decodedResult[2],
    pending: decodedResult[1],
  };

  return numberOfApplicants;
};
const getEmployeeInfo = async (employerContractAddress) => {
  const web3 = new Web3(besu.member4.url);
  const web3quorum = new Web3Quorum(web3, chainId);
  const contract = new web3quorum.eth.Contract(contractAbiEmp);
  const functionAbi = contract._jsonInterface.find((e) => {
    return e.name === "getEmployeeInfo";
  });

  const functionParams = {
    to: employerContractAddress,
    data: functionAbi.signature,
    privateKey: besu.member4.accountPrivateKey,
    privateFrom: tessera.member4.publicKey,
    privateFor: [tessera.member1.publicKey],
  };
  const startTimer = performance.now();
  const transactionHash = await web3quorum.priv.generateAndSendRawTransaction(
    functionParams
  );
  const result = await web3quorum.priv.waitForTransactionReceipt(
    transactionHash
  ); 
  const endTimer = performance.now();
  console.log("Time taken for the block: ", endTimer - startTimer);
  console.log(result);

  const decodedResult = web3quorum.eth.abi.decodeParameters(
    functionAbi.outputs,
    result.output
  );
  console.log(decodedResult);
  const employeeInfo = decodedResult[0].map((employee) => {
    return {
      employee_name: employee[0],
      application_status: employee[1],
      employee_address: employee[2],
      role: employee[3],
      institutes: employee[4],
      skills: employee[5].map((skill) => {
        return {
          skill_name: skill[0],
          experience: skill[1],
          endorsed: skill[2],
          endorsedBy: skill[3],
          review: skill[4],
          visible: skill[5],
          cert_hash: skill[6],
        };
      }),
      workexps: employee[6].map((exp) => {
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
      certifications: employee[7].map((cert) => {
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

  return employeeInfo;
};
module.exports = {
  RegisterEmployerPrivate,
  ListEmployers,
  applyForJob,
  ListPendingEmployees,
  acceptEmployee,
  rejectEmployee,
  getEmployerInfo,
  getNumberOfApplicants,
  getEmployeeInfo,
};
