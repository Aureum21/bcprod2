const { tessera, besu } = require("../Files/keys.js");
const Web3 = require("web3");
const Web3Quorum = require("web3js-quorum");
const chainId = 1337;
const path = require("path");
const fs = require("fs-extra");
const contractJsonInstPath = path.resolve(
  __dirname,
  "../Files",
  "institute.json"
);
const contractJsonInst = JSON.parse(fs.readFileSync(contractJsonInstPath));
const contractAbiInst = contractJsonInst.abi;

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
    return e.name === "addEducation";
  });
  const functionArgs = web3quorum.eth.abi
    .encodeParameters(functionAbi.inputs, [
      name,
      student_address,
      startDate,
      endDate,
      description,
      certificate_type,
      institute_address,
      certificate_hash,
    ])
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

module.exports = addOfficialCert;
