const Web3 = require("web3");
const Web3Quorum = require("web3js-quorum");
const chainId = 1337;
const path = require("path");
const fs = require("fs-extra");
const { verify } = require("crypto");
const { contractInformations, besu, tessera } = require("../Files/keys.js");
const { formatCurrentDate } = require("./InstFunctions.js");
const contractJsonAdminPath = path.resolve(__dirname, "../Files", "admin.json");
const contractJsonPublicDataPath = path.resolve(
  __dirname,
  "../Files",
  "publicdata.json"
);

const contractJsonPublicData = JSON.parse(
  fs.readFileSync(contractJsonPublicDataPath)
);

const contractAbiPublicData = contractJsonPublicData.abi;

const contractJsonAdmin = JSON.parse(fs.readFileSync(contractJsonAdminPath));
const contractAbiAdmin = contractJsonAdmin.abi;
const contractJsonInstPath = path.resolve(
  __dirname,
  "../Files",
  "institute.json"
);
const contractJsonInst = JSON.parse(fs.readFileSync(contractJsonInstPath));
const contractAbiInst = contractJsonInst.abi;
const contractBytecodeInst = contractJsonInst.evm.bytecode.object;

const PendingInstituteCount = async () => {
  const web3 = new Web3(besu.member2.url);
  const web3quorum = new Web3Quorum(web3, chainId);
  const contract = new web3quorum.eth.Contract(contractAbiAdmin);
  // eslint-disable-next-line no-underscore-dangle
  const functionAbi = contract._jsonInterface.find((e) => {
    return e.name === "getPendingInstitutesCount";
  });
  const functionParams = {
    to: contractInformations.registerInst.contractAddress,
    data: functionAbi.signature,
    privateKey: besu.member2.accountPrivateKey,
    privateFrom: tessera.member2.publicKey,
    privateFor: [tessera.member1.publicKey],
  };
  const transactionHash = await web3quorum.priv.generateAndSendRawTransaction(
    functionParams
  );
  // console.log(`Transaction hash: ${transactionHash}`);
  const result = await web3quorum.priv.waitForTransactionReceipt(
    transactionHash
  );

  return result.output;
};
const ListPendingInstitutes = async () => {
  const web3 = new Web3(besu.member1.url);
  const web3quorum = new Web3Quorum(web3, chainId);
  const contract = new web3quorum.eth.Contract(contractAbiAdmin);
  const functionAbi = contract._jsonInterface.find((e) => {
    return e.name === "getPendingInstList";
  });
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
  // console.log(`Transaction hash: ${transactionHash}`);
  const result = await web3quorum.priv.waitForTransactionReceipt(
    transactionHash
  );

  const decoded = web3quorum.eth.abi.decodeParameters(
    functionAbi.outputs,
    result.output
  );
  console.log("decoded", decoded);
  const inst = decoded[0];
  const institutes = [];
  for (let i = 0; i < inst.length; i++) {
    institutes.push({
      name: inst[i][0],
      address: inst[i][1],
      id: inst[i][2],
    });
  }
  return institutes;
};

const GenerateKey = async (
  clientUrl,
  info,
  fromPrivateKey,
  fromPublicKey,
  toPublicKey
) => {
  const web3 = new Web3(clientUrl);
  const web3quorum = new Web3Quorum(web3, chainId);
  const contract = new web3quorum.eth.Contract(contractAbiAdmin);
  // eslint-disable-next-line no-underscore-dangle
  const functionAbi = contract._jsonInterface.find((e) => {
    return e.name === "generateKey";
  });

  const functionArgs = web3quorum.eth.abi
    .encodeParameters(functionAbi.inputs, [info.address, info.id])
    .slice(2);
  const functionParams = {
    to: contractInformations.registerInst.contractAddress,
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

  return result.output;
};

const removePendingInstitute = async (address) => {
  const web3 = new Web3(besu.member1.url);
  const web3quorum = new Web3Quorum(web3, chainId);
  const contract = new web3quorum.eth.Contract(contractAbiAdmin);
  const functionAbi = contract._jsonInterface.find((e) => {
    return e.name === "removePendingInstitute";
  });

  const functionArgs = web3quorum.eth.abi
    .encodeParameters(functionAbi.inputs, [address])
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
  console.log("Transaction hash removePendingInstitute: ", transactionHash);
  const result = await web3quorum.priv.waitForTransactionReceipt(
    transactionHash
  );
  console.log("removePendingInstitute result", result);

  return result;
};

const VerifyInstitute = async (info) => {
  const web3 = new Web3(besu.member1.url);
  const web3quorum = new Web3Quorum(web3, chainId);

  const contract = new web3quorum.eth.Contract(contractAbiAdmin);
  // eslint-disable-next-line no-underscore-dangle
  const functionAbi = contract._jsonInterface.find((e) => {
    return e.name === "verifyInstitution";
  });

  console.log("index", info.index, "address", info.InstContractAddress);
  const functionArgs = web3quorum.eth.abi
    .encodeParameters(functionAbi.inputs, [
      info.InstContractAddress,
      info.name,
      info.address,
      info.InstPendingContractAddress,
    ])
    .slice(2);
  console.log("functionArgs", functionArgs);
  const functionParams = {
    to: contractInformations.admin.contractAddress,
    data: functionAbi.signature + functionArgs,
    privateKey: besu.member1.accountPrivateKey,
    privateFrom: tessera.member1.publicKey,
    privateFor: [tessera.member1.publicKey],
  };
  console.log("functionParams", functionParams);
  const transactionHash = await web3quorum.priv.generateAndSendRawTransaction(
    functionParams
  );

  // console.log(`Transaction hash: ${transactionHash}`);
  const result = await web3quorum.priv.waitForTransactionReceipt(
    transactionHash
  );
  console.log("VerifyInstitute result", result);
  const removeResult = await removePendingInstitute(info.address);
  console.log("removeResult", removeResult);
  return result;
};
const rejectInstitute = async (address) => {
  const resultPrivate = await removePendingInstitute(address);
  return resultPrivate;
};
const updateInstStatus = async (value) => {
  const verDate = formatCurrentDate();
  const host = besu.rpcnode.url;
  const web3 = new Web3(host);
  const account = web3.eth.accounts.privateKeyToAccount(
    besu.member1.accountPrivateKey
  );
  const fromAddress = account.address;

  const contractInstance = new web3.eth.Contract(
    contractAbiPublicData,
    contractInformations.publicdata.contractAddress
  );

  // Encode function call
  const data = contractInstance.methods
    .verifyInstitute(value, verDate)
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
    besu.member1.accountPrivateKey
  );
  const receipt = await web3.eth.sendSignedTransaction(signed.rawTransaction);

  return receipt;
};

const registerInstToPublic = async (value) => {
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

  // Encode function call
  const data = contractInstance.methods
    .registerInstitute(value[0], value[1], value[2])
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
    besu.member2.accountPrivateKey
  );
  const receipt = await web3.eth.sendSignedTransaction(signed.rawTransaction);
  if (receipt.status === true) {
    const stat = await updateInstStatus(value[0]);
    return stat;
  }
};

const ListInstitutes = async () => {
  const web3 = new Web3(besu.member1.url);
  const web3quorum = new Web3Quorum(web3, chainId);
  const contract = new web3quorum.eth.Contract(contractAbiAdmin);
  const functionAbi = contract._jsonInterface.find((e) => {
    return e.name === "getInstList";
  });

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
  const decodedResult = web3quorum.eth.abi.decodeParameters(
    functionAbi.outputs,
    result.output
  );
  console.log("decodedResult", decodedResult[0]);

  return decodedResult[0];
};
const getInstituteAddress = async (name) => {
  const web3 = new Web3(besu.member1.url);
  const web3quorum = new Web3Quorum(web3, chainId);
  const contract = new web3quorum.eth.Contract(contractAbiAdmin);
  const functionAbi = contract._jsonInterface.find((e) => {
    return e.name === "getAddresByName";
  });

  const functionArgs = web3quorum.eth.abi
    .encodeParameters(functionAbi.inputs, [name])
    .slice(2);
  const functionParams = {
    to: contractInformations.admin.contractAddress,
    data: functionAbi.signature + functionArgs,
    privateKey: besu.member1.accountPrivateKey,
    privateFrom: tessera.member1.publicKey,
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
  console.log("decodedResult", decodedResult);

  return decodedResult[0];
};
const getMoe = async () => {
  const web3 = new Web3(besu.member1.url);
  const web3quorum = new Web3Quorum(web3, chainId);
  const contract = new web3quorum.eth.Contract(contractAbiAdmin);
  console.log("Contract ABI:", contract._jsonInterface);
  const functionAbi = contract._jsonInterface.find((e) => {
    return e.name === "MOE";
  });

  console.log("functionAbi", functionAbi);

  const functionParams = {
    to: contractInformations.admin.contractAddress,
    data: functionAbi.signature,
    privateKey: besu.member1.accountPrivateKey,
    privateFrom: tessera.member1.publicKey,
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
};
module.exports = {
  ListPendingInstitutes,
  VerifyInstitute,
  registerInstToPublic,
  ListInstitutes,
  getInstituteAddress,
  rejectInstitute,
  getMoe,
};
