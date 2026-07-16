const Web3 = require("web3");
const path = require("path");
const fs = require("fs-extra");
const { contractInformations, besu } = require("../Files/keys.js");
const contractJsonPublicDataPath = path.resolve(
  __dirname,
  "../Files",
  "publicdata.json"
);

const contractJsonPublicData = JSON.parse(
  fs.readFileSync(contractJsonPublicDataPath)
);

const contractAbiPublicData = contractJsonPublicData.abi;

const checkMoe = async (address) => {
  const host = besu.rpcnode.url;
  const web3 = new Web3(host);

  const account = web3.eth.accounts.privateKeyToAccount(
    besu.member1.accountPrivateKey
  );
  // const fromAddress = account.address;

  const contractInstance = new web3.eth.Contract(
    contractAbiPublicData,
    contractInformations.publicdata.contractAddress
  );

  // Direct call — specify `from` so msg.sender is correct
  const isMoe = await contractInstance.methods.ismoe().call({
    from: address,
  });

  console.log("Is caller MOE? ->", isMoe);
  return isMoe;
};
const getInstAddress = async (address) => {
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

  // Direct call — specify `from` so msg.sender is correct
  const instInfo = await contractInstance.methods
    .getInstContractAddress(address)
    .call({
      from: fromAddress,
    });

  console.log("Is caller MOE? ->", instInfo);
  return instInfo;
};

const getStudAddress = async (address) => {
  const host = besu.rpcnode.url;
  const web3 = new Web3(host);

  const account = web3.eth.accounts.privateKeyToAccount(
    besu.member3.accountPrivateKey
  );
  const fromAddress = account.address;

  const contractInstance = new web3.eth.Contract(
    contractAbiPublicData,
    contractInformations.publicdata.contractAddress
  );

  // Direct call — specify `from` so msg.sender is correct
  const studInfo = await contractInstance.methods
    .getStudContractAddress(address)
    .call({
      from: fromAddress,
    });

  console.log("Is caller MOE? ->", studInfo);
  return studInfo;
};
const getEmployerAddress = async (address) => {
  const host = besu.rpcnode.url;
  const web3 = new Web3(host);

  const account = web3.eth.accounts.privateKeyToAccount(
    besu.member4.accountPrivateKey
  );
  const fromAddress = account.address;
  console.log("fromAddress", fromAddress);

  const contractInstance = new web3.eth.Contract(
    contractAbiPublicData,
    contractInformations.publicdata.contractAddress
  );

  // Direct call — specify `from` so msg.sender is correct
  const employerInfo = await contractInstance.methods
    .getEmployerContractAddress(address)
    .call({
      from: fromAddress,
    });

  console.log("Is caller MOE? ->", employerInfo);
  return employerInfo;
};

module.exports = {
  checkMoe,
  getInstAddress,
  getStudAddress,
  getEmployerAddress,
};
