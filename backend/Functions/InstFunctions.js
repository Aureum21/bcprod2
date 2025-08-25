const Web3 = require("web3");
const Web3Quorum = require("web3js-quorum");
const chainId = 1337;
const path = require("path");
const fs = require("fs-extra");
const { besu, tessera, contractInformations } = require("../Files/keys");
const { getInstAddress } = require("./AuthFunctions.js");

const contractJsonPublicDataPath = path.resolve(
  __dirname,
  "../Files",
  "publicdata.json"
);
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
    student_name: decoded[0],
    student_address: decoded[1],
    email: decoded[2],
    id: decoded[3],
    institutes: decoded[4],
    skills: decoded[5]
      ? decoded[5].map((skill) => {
          return {
            skill_name: skill[0],
            experience: skill[1],
            endorsed: skill[2],
            endorser_address: skill[3],
            review: skill[4],
            visible: skill[5],
            cert_hash: skill[6],
          };
        })
      : [],
    workexps: decoded[6]
      ? decoded[6].map((exp) => {
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
        })
      : [],
    certifications: decoded[7]
      ? decoded[7].map((cert) => {
          return {
            institute: cert[0],
            certificate_name: cert[1],
            visible: cert[2],
            verified: cert[3],
            cert_hash: cert[4],
          };
        })
      : [],
  };

  console.log(studInfo);
  return studInfo;
}
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
const contractJsonPublicData = JSON.parse(
  fs.readFileSync(contractJsonPublicDataPath)
);

const contractAbiPublicData = contractJsonPublicData.abi;
// Institute contract
const contractJsonInstPath = path.resolve(
  __dirname,
  "../Files",
  "institute.json"
);
const contractJsonInst = JSON.parse(fs.readFileSync(contractJsonInstPath));
const contractAbiInstitute = contractJsonInst.abi;
// institute pending
const contractJsonInstPendingPath = path.resolve(
  __dirname,
  "../Files",
  "InstitutePending.json"
);
const contractJsonInstPending = JSON.parse(
  fs.readFileSync(contractJsonInstPendingPath)
);
const contractAbiInstitutePending = contractJsonInstPending.abi;

//Register Institute contract
const contractJsonAdminPath = path.resolve(__dirname, "../Files", "admin.json");
const contractJsonAdmin = JSON.parse(fs.readFileSync(contractJsonAdminPath));
const contractAbiAdmin = contractJsonAdmin.abi;

function formatCurrentDate() {
  const date = new Date();
  const day = date.getDate();
  const year = date.getFullYear();

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const month = monthNames[date.getMonth()];

  const getOrdinalSuffix = (n) => {
    if (n >= 11 && n <= 13) return "th";
    switch (n % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  };

  return `${day}${getOrdinalSuffix(day)} ${month} ${year}`;
}

const RegInstPublicToPending = async (value) => {
  console.log("value", value);
  const currentDate = formatCurrentDate();
  console.log("currentDate", currentDate);
  const host = besu.rpcnode.url;
  const web3 = new Web3(host);

  const account = web3.eth.accounts.privateKeyToAccount(
    besu.member2.accountPrivateKey
  );
  const fromAddress = account.address;

  const contractInstance = new web3.eth.Contract(
    contractAbiPublicData,
    contractInformations.publicdata.contractAddress
  );

  const data = contractInstance.methods
    .addInstToPending(value, currentDate)
    .encodeABI();

  const tx = {
    to: contractInformations.publicdata.contractAddress,
    data: data,
    gas: 150000, // or tune it
    gasPrice: "0x0", // for Besu/Quorum, no fees
    from: fromAddress,
  };
  console.log("tx", tx);

  const signed = await web3.eth.accounts.signTransaction(
    tx,
    besu.member2.accountPrivateKey
  );
  const receipt = await web3.eth.sendSignedTransaction(signed.rawTransaction);

  console.log("Result from Register:", receipt);
  return receipt;
};

const RegisterInstitutePrivateToPending = async (value) => {
  const web3 = new Web3(besu.member1.url);
  const web3quorum = new Web3Quorum(web3, chainId);
  const contract = new web3quorum.eth.Contract(contractAbiAdmin);
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
    to: contractInformations.admin.contractAddress,
    data: functionAbi.signature + functionArgs,
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
  if (result.status === "0x1") {
    console.log("result", result);
    const resultPublic = await RegInstPublicToPending(value[0]);
    console.log("resultPublic", resultPublic);
    return resultPublic;
  }
};

const RegisterStudentPrivateTransfer = async (value) => {
  console.log("value", value);
  const web3 = new Web3(besu.member2.url);
  const web3quorum = new Web3Quorum(web3, chainId);
  const contract = new web3quorum.eth.Contract(contractAbiInstitutePending);
  console.log("Contract ABI:", contract._jsonInterface);
  const studentcontract = await getStudContract(value[0]);
  const studInfo = await getStudProfile(studentcontract);
  const InstitutePendingContract = await getInstAddress(value[2]);
  const functionAbi = contract._jsonInterface.find((e) => {
    return e.name === "AddStudInfoToPending";
  });
  if (!functionAbi) {
    console.error("Function ABI for 'addTransferStudToPending' not found.");
    return { error: "Function ABI not found" };
  }
  console.log("studentinfo from", studInfo);
  const functionArgs = web3quorum.eth.abi
    .encodeParameters(functionAbi.inputs, [
      studInfo.student_name,
      studInfo.student_address,
      studInfo.email,
      studInfo.id,
      "Transfer",
      value[2],
      studInfo.institutes || [],
      studInfo.workexps || [],
      studInfo.skills || [],
      studInfo.certifications || [],
      studInfo.official_certifications || [],
    ])

    .slice(2);
  const functionParams = {
    to: InstitutePendingContract[0][1],
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
  console.log("result", result);
  const decodedResult = web3quorum.eth.abi.decodeParameters(
    ["address", "string", "string"],
    result.output
  );
  console.log("decodedResult", decodedResult);
  const InstInfo = {
    instAddress: decodedResult[0],
    name: decodedResult[1],
    id: decodedResult[2],
  };
  console.log("InstInfo", InstInfo);

  return InstInfo;
};

const removePendingStudents = async (
  student_address,
  InstPendingContractAddress
) => {
  const web3 = new Web3(besu.member2.url);
  const web3quorum = new Web3Quorum(web3, chainId);
  const contract = new web3quorum.eth.Contract(contractAbiInstitutePending);
  const functionAbi = contract._jsonInterface.find((e) => {
    return e.name === "removeFromPending";
  });

  const functionArgs = web3quorum.eth.abi
    .encodeParameters(functionAbi.inputs, [student_address])
    .slice(2);
  const functionParams = {
    to: InstPendingContractAddress,
    data: functionAbi.signature + functionArgs,
    privateKey: besu.member2.accountPrivateKey,
    privateFrom: tessera.member2.publicKey,
    privateFor: [tessera.member1.publicKey],
  };
  const transactionHash = await web3quorum.priv.generateAndSendRawTransaction(
    functionParams
  );
  console.log("Transaction hash removePendingInstitute: ", transactionHash);
  const result = await web3quorum.priv.waitForTransactionReceipt(
    transactionHash
  );
  console.log("removePendingInstitute result", result);

  return result;
};

module.exports = {
  RegisterInstitutePrivateToPending,
  RegisterStudentPrivateTransfer,
  getInstituteInfo,
  formatCurrentDate,
  removePendingStudents,
  getStudProfile,
};
