// Basic Express backend skeleton
const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");
const fs = require("fs-extra");
const Web3 = require("web3");
const Web3Quorum = require("web3js-quorum");
const PORT = process.env.PORT || 5000;
const createContract = require("./Files/main.js");
const { tessera, besu, contractInformations } = require("./Files/keys.js");
const RegisterInstitutePrivateToPending = require("./Functions/InstFunctions.js");
const {
  RegisterStudentPrivate,
  getStudentInformation,
  RegisterStudentPublic,
} = require("./Functions/StudFunctions.js");
const {
  ListPendingInstitutes,
  createInstContract,
  VerifyInstitute,
  registerInstToPublic,
} = require("./Functions/AdminFunctions.js");
const chainId = 1337;

const contractJsonRegStudPath = path.resolve(
  __dirname,
  "./Files",
  "registerStud.json"
);
const contractJsonRegStud = JSON.parse(
  fs.readFileSync(contractJsonRegStudPath)
);

const contractAbiRegStud = contractJsonRegStud.abi;

// Public Data
const contractJsonPublicDataPath = path.resolve(
  __dirname,
  "./Files",
  "publicdata.json"
);

const contractJsonPublicData = JSON.parse(
  fs.readFileSync(contractJsonPublicDataPath)
);

const contractAbiPublicData = contractJsonPublicData.abi;

const contractJsonRegInstPath = path.resolve(
  __dirname,
  "./Files",
  "registerInst.json"
);
const contractJsonRegInst = JSON.parse(
  fs.readFileSync(contractJsonRegInstPath)
);
const contractAbiRegInst = contractJsonRegInst.abi;

// Middleware
app.use(cors());
app.use(express.json());

// Example route
app.post("/registerStudent", async (req, res) => {
  const { name, student_address, email, id } = req.body;

  const [resultPrivate, contractAddress] = await RegisterStudentPrivate(
    besu.member3.url,
    contractInformations.registerStud.contractAddress,
    [
      name,
      student_address,
      email,
      id,
      contractInformations.verifyStud.contractAddress,
      contractInformations.verifyInst.contractAddress,
    ],
    besu.member3.accountPrivateKey,
    tessera.member3.publicKey,
    tessera.member1.publicKey
  );
  console.log(contractInformations.publicdata.contractAddress);
  console.log(resultPrivate);
  console.log(contractAddress);
  const resultPublic = await RegisterStudentPublic(
    contractInformations.publicdata.contractAddress,
    [student_address, contractAddress]
  );
  console.log("the Last", resultPublic);
  if (resultPrivate.status === "0x1" && resultPublic.status === true) {
    res.status(200).json({ message: "Student registered successfully" });
  } else {
    res.status(500).json({ message: "Failed to register student" });
  }
});

app.post("/registerInstituteToPending", async (req, res) => {
  const { name, institute_address, id } = req.body;

  const resultPrivate = await RegisterInstitutePrivateToPending(
    besu.member2.url,
    contractInformations.registerInst.contractAddress,
    [institute_address, name, id],
    contractAbiRegInst,
    besu.member2.accountPrivateKey,
    tessera.member2.publicKey,
    tessera.member1.publicKey
  );

  console.log(resultPrivate);
  if (resultPrivate.status === "0x1") {
    res.status(200).json({ message: "Institute registered successfully" });
  } else {
    res.status(500).json({ message: "Failed to register institute" });
  }
});

app.get("/listPendingInstitutes", async (req, res) => {
  const institutes = await ListPendingInstitutes(
    besu.member2.url,
    "node",
    contractInformations.registerInst.contractAddress,
    besu.member2.accountPrivateKey,
    tessera.member2.publicKey,
    tessera.member1.publicKey
  );
  console.log(institutes);
  res.status(200).json(institutes);
});

app.post("/acceptInstitute", async (req, res) => {
  const { name, address, id, index } = req.body;
  const moeAddress = besu.member1.accountAddress;
  const InstContract = await createInstContract(
    besu.member1.url,
    besu.member1.accountPrivateKey,
    tessera.member1.publicKey,
    tessera.member2.publicKey,
    [name, address, id, moeAddress]
  );

  const InstContractAddress = InstContract.contractAddress;
  console.log("InstContractAddress: ", InstContractAddress);

  const resultPrivate = await VerifyInstitute(
    besu.member1.url,
    { name, address, id, index, InstContractAddress },

    besu.member1.accountPrivateKey,
    tessera.member1.publicKey,
    tessera.member2.publicKey
  );
  console.log("Private Registration Receipt", resultPrivate);
  const resultPublic = await registerInstToPublic(
    contractInformations.publicdata.contractAddress,
    [address, InstContractAddress]
  );

  if (resultPrivate.status === "0x1" && resultPublic.status === true) {
    res.status(200).json({ message: "Institute verified successfully" });
  } else {
    res.status(500).json({ message: "Failed to verify institute" });
  }
});

app.post("/rejectInstitute", async (req, res) => {
  const { name, address, id, index } = req.body;
  const resultPrivate = await removePendingInst(
    besu.member1.url,
    { name, address, id, index },
    besu.member1.accountPrivateKey,
    tessera.member1.publicKey,
    tessera.member2.publicKey
  );
  console.log(resultPrivate);
  if (resultPrivate.status === "0x1") {
    res.status(200).json({ message: "Institute rejected successfully" });
  } else {
    res.status(500).json({ message: "Failed to reject institute" });
  }
});

app.get("/studentInformation", async (req, res) => {
  const { contractAddress } = req.query;
  console.log("contractAddress", contractAddress);
  const studentInfo = await getStudentInformation(
    besu.member3.url,
    contractAddress,
    besu.member3.accountPrivateKey,
    tessera.member3.publicKey,
    tessera.member1.publicKey
  );
  console.log(studentInfo);

  const studentInformation = {
    name: studentInfo[0],
    accountAddress: studentInfo[1],
    email: studentInfo[2],
    id: studentInfo[3],
    institution: studentInfo[4],
  };

  console.log(studentInformation);
  console.log(contractAddress);
  res.status(200).json(studentInformation);
});
// Placeholder for your Quorum/Web3 logic
// app.post('/api/your-endpoint', async (req, res) => { ... });

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
