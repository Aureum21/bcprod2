// Basic Express backend skeleton
const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");
const fs = require("fs-extra");
const Web3 = require("web3");
const Web3Quorum = require("web3js-quorum");

const PORT = process.env.PORT || 5000;
const {
  createStudContract,
  createInstContract,
} = require("./Functions/deploy.js");
const {
  addOfficialCert,
  addUnOfficialCert,
  addWorkExp,
} = require("./Functions/uploadcerts.js");

const {
  ListTransferStudents,
  ListPendingStudents,
  VerifyPendingStudent,
  VerifyTransferStudent,
} = require("./Functions/transferFunctions.js");
const { tessera, besu, contractInformations } = require("./Files/keys.js");
const {
  RegisterInstitutePrivateToPending,
  RegisterStudentPrivateTransfer,
  getInstituteInfo,
} = require("./Functions/InstFunctions.js");
const {
  RegisterStudentPrivate,
  getStudentInformation,
  RegisterStudentPublic,
  RegisterStudentPrivateToPending,
  addSkill,
  ListSkills,
} = require("./Functions/StudFunctions.js");
const {
  ListPendingInstitutes,
  VerifyInstitute,
  registerInstToPublic,
  ListInstitutes,
  getInstituteAddress,
} = require("./Functions/AdminFunctions.js");
const { getUnOfficialCert, getWorkExp } = require("./Functions/getcerts.js");
const {
  RegisterEmployerPrivate,
  ListEmployers,
  applyForJob,
  ListPendingEmployees,
  acceptEmployee,
  rejectEmployee,
  getEmployerInfo,
  getNumberOfApplicants,
  getEmployeeInfo,
} = require("./Functions/employerFunctions.js");
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

  const [resultPrivate, contractAddress] = await RegisterStudentPrivate([
    name,
    student_address,
    email,
    id,
    contractInformations.verifyStud.contractAddress,
    contractInformations.verifyInst.contractAddress,
  ]);
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
  console.log("name", name);
  console.log("institute_address", institute_address);
  console.log("id", id);

  const resultPrivate = await RegisterInstitutePrivateToPending([
    institute_address,
    name,
    id,
  ]);

  console.log(resultPrivate);
  if (resultPrivate.status === true) {
    res.status(200).json({ message: "Institute registered successfully" });
  } else {
    res.status(500).json({ message: "Failed to register institute" });
  }
});

app.get("/listPendingInstitutes", async (req, res) => {
  const institutes = await ListPendingInstitutes();
  console.log(institutes);
  res.status(200).json(institutes);
});

app.post("/acceptInstitute", async (req, res) => {
  const { name, address, id, index } = req.body;
  const moeAddress = besu.member1.accountAddress;
  const InstContract = await createInstContract([
    name,
    address,
    id,
    moeAddress,
  ]);

  const InstContractAddress = InstContract.contractAddress;
  console.log("InstContractAddress: ", InstContractAddress);

  const resultPrivate = await VerifyInstitute({
    name,
    address,
    id,
    index,
    InstContractAddress,
  });
  console.log("Private Registration Receipt", resultPrivate);
  const resultPublic = await registerInstToPublic([
    address,
    InstContractAddress,
  ]);

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
  const studentInfo = await getStudentInformation(contractAddress);
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

app.post("/regStudToInstPending", async (req, res) => {
  const { student_address, institute_name } = req.body;
  const institute_address = await getInstituteAddress(institute_name);

  const resultPrivate = await RegisterStudentPrivateToPending([
    student_address,
    institute_address,
  ]);
  console.log(resultPrivate);
  if (resultPrivate.status === "0x1") {
    res.status(200).json({ message: "Student added to pending successfully" });
  } else {
    res.status(500).json({ message: "Failed to add student to pending" });
  }
});
app.post("/regStudToInstTransfer", async (req, res) => {
  const { student_address, current_institute_address, new_institute_name } =
    req.body;
  console.log("student_address", student_address);
  console.log("current_institute_address", current_institute_address);
  console.log("new_institute_name", new_institute_name);
  const new_institute_address = await getInstituteAddress(new_institute_name);
  console.log("new_institute_address", new_institute_address);
  const resultPrivate = await RegisterStudentPrivateTransfer([
    student_address,
    current_institute_address,
    new_institute_address,
  ]);
  console.log(resultPrivate);
  if (resultPrivate.status === "0x1") {
    res.status(200).json({ message: "Institution transfer Pending" });
  } else {
    res.status(500).json({ message: "Failed to transfer institution" });
  }
});

app.get("/listPendingStudents", async (req, res) => {
  const PendingStudents = await ListPendingStudents();
  console.log(PendingStudents);
  res.status(200).json(PendingStudents);
});
app.get("/listTransferStudents", async (req, res) => {
  const TransferStudents = await ListTransferStudents();
  console.log(TransferStudents);
  res.status(200).json(TransferStudents);
});
app.post("/acceptPendingStudent", async (req, res) => {
  const { name, address, email, id, index, institute_address } = req.body;
  const result = await VerifyPendingStudent(
    name,
    address,
    email,
    id,
    index,
    institute_address
  );
  if (result) {
    res.status(200).json({ message: "Student accepted successfully" });
  } else {
    res.status(500).json({ message: "Failed to accept student" });
  }
});
app.post("/acceptTransferStudent", async (req, res) => {
  const { name, address, email, id, index, institute_address } = req.body;
  const result = await VerifyTransferStudent(
    name,
    address,
    email,
    id,
    index,
    institute_address
  );
  if (result) {
    res.status(200).json({ message: "Student accepted successfully" });
  } else {
    res.status(500).json({ message: "Failed to accept student" });
  }
});

app.post("/addOfficialCert", async (req, res) => {
  const {
    name,
    student_address,
    certificate_type,
    institute_address,
    certificate_hash,
    institute_contract_address,
    startDate,
    endDate,
    description,
  } = req.body;
  const result = await addOfficialCert(
    name,
    student_address,
    institute_address,
    certificate_hash,
    certificate_type,
    institute_contract_address,
    startDate,
    endDate,
    description
  );
  console.log(result);
  if (result.status === "0x1") {
    res
      .status(200)
      .json({ message: "Official Certificate added successfully" });
  } else {
    res.status(500).json({ message: "Failed to add official certificate" });
  }
});
app.post("/addSkill", async (req, res) => {
  const { name, skill_name, experience, contractAddress } = req.body;
  const result = await addSkill(skill_name, name, experience, contractAddress);
  console.log(result);
  if (result.status === "0x1") {
    res.status(200).json({ message: "Skill added successfully" });
  } else {
    res.status(500).json({ message: "Failed to add skill" });
  }
});
app.post("/addUnOfficialCert", async (req, res) => {
  const {
    certificate_name,
    institute_address,
    student_contract_address,
    certificate_hash,
  } = req.body;

  const result = await addUnOfficialCert(
    certificate_name,
    institute_address,
    student_contract_address,
    certificate_hash
  );
  console.log(result);
  if (result.status === "0x1") {
    res.status(200).json({ message: "Institution transfer Pending" });
  } else {
    res.status(500).json({ message: "Failed to transfer institution" });
  }
});
app.post("/addWorkExp", async (req, res) => {
  const {
    role,
    instAddress,
    startDate,
    endDate,
    description,
    certificate_hash,
    student_contract_address,
  } = req.body;
  const result = await addWorkExp(
    role,
    instAddress,
    startDate,
    endDate,
    description,
    certificate_hash,
    student_contract_address
  );
  console.log(result);
  if (result.status === "0x1") {
    res.status(200).json({ message: "Institution transfer Pending" });
  } else {
    res.status(500).json({ message: "Failed to transfer institution" });
  }
});
app.get("/getUnOfficialCert", async (req, res) => {
  const result = await getUnOfficialCert(req.query.contractAddress);
  console.log(result);
  res.status(200).json(result);
});
app.get("/getWorkExp", async (req, res) => {
  const result = await getWorkExp(req.query.contractAddress);
  console.log(result);
  res.status(200).json(result);
});

app.get("/listSkills", async (req, res) => {
  const { contractAddress } = req.query;
  const skills = await ListSkills(contractAddress);
  console.log(skills);
  res.status(200).json(skills);
});
app.get("/getInstituteInfo", async (req, res) => {
  const info = await getInstituteInfo(req.query.contractAddress);
  console.log(info);
  res.status(200).json(info);
});
app.get("/getInstList", async (req, res) => {
  const institutes = await ListInstitutes();
  console.log(institutes);
  res.status(200).json(institutes);
});
app.post("/registerEmployer", async (req, res) => {
  const { name, employer_address, email } = req.body;
  console.log("name", name);
  console.log("employer_address", employer_address);
  console.log("email", email);

  const resultPrivate = await RegisterEmployerPrivate([
    name,
    employer_address,
    email,
    besu.member1.accountAddress,
  ]);

  console.log(resultPrivate);
  if (resultPrivate.status === true) {
    res.status(200).json({ message: "Employer registered successfully" });
  } else {
    res.status(500).json({ message: "Failed to register employer" });
  }
});

app.get("/getEmpList", async (req, res) => {
  const employers = await ListEmployers();
  console.log(employers);
  res.status(200).json(employers);
});

app.post("/applyForJob", async (req, res) => {
  const { account, studentName, employerAddress, skill, cert, workExp } =
    req.body;
  console.log("account", account);
  console.log("studentName", studentName);
  console.log("employerAddress", employerAddress);
  console.log("skill", skill);
  console.log("cert", cert);
  console.log("workExp", workExp);

  const result = await applyForJob(
    account,
    studentName,
    employerAddress,
    skill,
    cert,
    workExp
  );
  console.log(result);
  if (result.status === "0x1") {
    res.status(200).json({ message: "Application submitted successfully" });
  } else {
    res.status(500).json({ message: "Failed to submit application" });
  }
});

app.get("/getPendingEmployees", async (req, res) => {
  const PendingEmployees = await ListPendingEmployees(
    req.query.contractAddress
  );
  console.log(PendingEmployees);
  if (PendingEmployees) {
    res.status(200).json(PendingEmployees);
  } else {
    res.status(500).json({ message: "Failed to get pending employees" });
  }
});

app.post("/acceptEmployee", async (req, res) => {
  const { employeeAddress, employerContractAddress } = req.body;

  const result = await acceptEmployee(employeeAddress, employerContractAddress);
  console.log(result);
  if (result.status === "0x1") {
    res.status(200).json({ message: "Application accepted successfully" });
  } else {
    res.status(500).json({ message: "Failed to accept application" });
  }
});

app.post("/rejectEmployee", async (req, res) => {
  const { employeeAddress, employerContractAddress } = req.body;

  const result = await rejectEmployee(employeeAddress, employerContractAddress);
  console.log(result);
  if (result.status === "0x1") {
    res.status(200).json({ message: "Application rejected successfully" });
  } else {
    res.status(500).json({ message: "Failed to reject application" });
  }
});

app.get("/employerInfo", async (req, res) => {
  const employerInfo = await getEmployerInfo(req.query.contractAddress);
  console.log(employerInfo);
  res.status(200).json(employerInfo);
});
app.get("/getNumberOfApplicants", async (req, res) => {
  const numberOfApplicants = await getNumberOfApplicants(
    req.query.contractAddress
  );
  console.log(numberOfApplicants);
  res.status(200).json(numberOfApplicants);
});
app.get("/getEmployeeInfo", async (req, res) => {
  const employeeInfo = await getEmployeeInfo(req.query.contractAddress);
  console.log(employeeInfo);
  res.status(200).json(employeeInfo);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
