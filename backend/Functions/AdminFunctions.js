const Web3 = require("web3");
const Web3Quorum = require("web3js-quorum");
const chainId = 1337;
const path = require("path");
const fs = require("fs-extra");
const { verify } = require("crypto");
const { contractInformations, besu, tessera } = require("../Files/keys.js");
const contractJsonRegInstPath = path.resolve(
  __dirname,
  "../Files",
  "registerInst.json"
);
const contractJsonRegInst = JSON.parse(
  fs.readFileSync(contractJsonRegInstPath)
);
const contractAbiRegInst = contractJsonRegInst.abi;
const contractJsonVerifyInstPath = path.resolve(
  __dirname,
  "../Files",
  "verifyInst.json"
);
const contractJsonPublicDataPath = path.resolve(
  __dirname,
  "../Files",
  "publicdata.json"
);

const contractJsonPublicData = JSON.parse(
  fs.readFileSync(contractJsonPublicDataPath)
);

const contractAbiPublicData = contractJsonPublicData.abi;

const contractJsonVerifyInst = JSON.parse(
  fs.readFileSync(contractJsonVerifyInstPath)
);
const contractAbiVerifyInst = contractJsonVerifyInst.abi;
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
  const contract = new web3quorum.eth.Contract(contractAbiRegInst);
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
  const web3 = new Web3(besu.member2.url);
  const web3quorum = new Web3Quorum(web3, chainId);
  const contract = new web3quorum.eth.Contract(contractAbiRegInst);
  // eslint-disable-next-line no-underscore-dangle
  const number = await PendingInstituteCount();
  const functionAbi = contract._jsonInterface.find((e) => {
    return e.name === "getPendingInstituteByIndex";
  });
  const institutes = [];
  for (let i = 0; i < number; i++) {
    const functionArgs = web3quorum.eth.abi
      .encodeParameter(functionAbi.inputs[0], i)
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
    // console.log(`Transaction hash: ${transactionHash}`);
    const result = await web3quorum.priv.waitForTransactionReceipt(
      transactionHash
    );

    const decoded = web3quorum.eth.abi.decodeParameters(
      ["string", "address", "string", "address"],
      result.output
    );
    institutes.push({
      name: decoded[0],
      address: decoded[1],
      id: decoded[2],
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
  const contract = new web3quorum.eth.Contract(contractAbiRegInst);
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

const VerifyInstitute = async (info) => {
  const web3 = new Web3(besu.member1.url);
  const web3quorum = new Web3Quorum(web3, chainId);
  const key = web3.utils.soliditySha3(info.address, info.id);

  const contract = new web3quorum.eth.Contract(contractAbiVerifyInst);
  // eslint-disable-next-line no-underscore-dangle
  const functionAbi = contract._jsonInterface.find((e) => {
    return e.name === "verifyInstitution";
  });
  console.log("index", info.index, "address", info.InstContractAddress);
  const functionArgs = web3quorum.eth.abi
    .encodeParameters(functionAbi.inputs, [
      key,
      info.index,
      info.InstContractAddress,
    ])
    .slice(2);
  console.log("functionArgs", functionArgs);
  const functionParams = {
    to: contractInformations.verifyInst.contractAddress,
    data: functionAbi.signature + functionArgs,
    privateKey: besu.member1.accountPrivateKey,
    privateFrom: tessera.member1.publicKey,
    privateFor: [tessera.member2.publicKey],
  };
  console.log("functionParams", functionParams);
  const transactionHash = await web3quorum.priv.generateAndSendRawTransaction(
    functionParams
  );

  // console.log(`Transaction hash: ${transactionHash}`);
  const result = await web3quorum.priv.waitForTransactionReceipt(
    transactionHash
  );
  return result;
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
    .registerInstitute(value[0], value[1])
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

  return receipt;
};
const removePendingInst = async (
  clientUrl,
  info,
  fromPrivateKey,
  fromPublicKey,
  toPublicKey
) => {
  const key = await GenerateKey(
    clientUrl,
    { address: info.address, id: info.id },
    fromPrivateKey,
    fromPublicKey,
    toPublicKey
  );
  const web3 = new Web3(clientUrl);
  const web3quorum = new Web3Quorum(web3, chainId);
  const contract = new web3quorum.eth.Contract(contractAbiRegInst);
  // eslint-disable-next-line no-underscore-dangle
  const functionAbi = contract._jsonInterface.find((e) => {
    return e.name === "removePendingInstitute";
  });
  const functionArgs = web3quorum.eth.abi
    .encodeParameters(functionAbi.inputs, [key, info.index])
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
  return result;
};
module.exports = {
  ListPendingInstitutes,
  VerifyInstitute,
  registerInstToPublic,
  removePendingInst,
};
