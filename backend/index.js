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
  removePendingStudents,
} = require("./Functions/InstFunctions.js");
const {
  RegisterStudentPrivate,
  getStudentInformation,
  RegisterStudentPublic,
  RegisterStudentPrivateToPending,
  addSkill,
  getStudProfile,
  ListSkills,
} = require("./Functions/StudFunctions.js");
const {
  checkMoe,
  getInstAddress,
  getStudAddress,
  getEmployerAddress,
} = require("./Functions/AuthFunctions.js");
const {
  ListPendingInstitutes,
  VerifyInstitute,
  registerInstToPublic,
  ListInstitutes,
  getInstituteAddress,
  rejectInstitute,
  getMoe,
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
  const InstContract = await createInstContract(
    [name, address, id, moeAddress],
    "Institute"
  );
  const InstPendingContract = await createInstContract(
    [name, address, id, moeAddress],
    "Pending"
  );
  if (InstContract.status === "0x1") {
    const InstContractAddress = InstContract.contractAddress;
    const InstPendingContractAddress = InstPendingContract.contractAddress;

    const resultPrivate = await VerifyInstitute({
      name,
      address,
      id,
      index,
      InstContractAddress,
      InstPendingContractAddress,
    });
    console.log("Private Registration Receipt", resultPrivate);
    const resultPublic = await registerInstToPublic([
      address,
      InstContractAddress,
      InstPendingContractAddress,
    ]);
    console.log("Public Registration Receipt", resultPublic);

    if (resultPrivate.status === "0x1" && resultPublic.status === true) {
      res.status(200).json({ message: "Institute verified successfully" });
    } else {
      res.status(500).json({ message: "Failed to verify institute" });
    }
  } else {
    res.status(500).json({ message: "Failed to create institute" });
  }
});

app.post("/rejectInstitute", async (req, res) => {
  const { name, address, id, index } = req.body;
  const resultPrivate = await rejectInstitute(address, id);

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
  const studentInfo = await getStudProfile(contractAddress);
  console.log(studentInfo);
  res.status(200).json(studentInfo);
});

app.post("/regStudToInstPending", async (req, res) => {
  const { student_address, institute_name } = req.body;
  console.log("student_address", student_address);
  console.log("institute_name", institute_name);
  const institute_address = await getInstituteAddress(institute_name);
  console.log("institute_address", institute_address);
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

app.get("/getPendingStudents", async (req, res) => {
  const PendingStudents = await ListPendingStudents(req.query.contractAddress);
  res.status(200).json(PendingStudents);
});
// app.get("/listTransferStudents", async (req, res) => {
//   const TransferStudents = await ListTransferStudents(
//     req.query.contractAddress
//   );
//   console.log(TransferStudents);
//   res.status(200).json(TransferStudents);
// });
app.post("/acceptPendingStudent", async (req, res) => {
  const {
    name,
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
    inst_Pending_contract_address,
  } = req.body;

  const result = await VerifyPendingStudent(
    name,
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
  );
  if (result) {
    res.status(200).json({ message: "Student accepted successfully" });
  } else {
    res.status(500).json({ message: "Failed to accept student" });
  }
});

app.post("/rejectPendingStudent", async (req, res) => {
  const { student_address, inst_Pending_contract_address } = req.body;
  const result = await removePendingStudents(
    student_address,
    inst_Pending_contract_address
  );
  if (result) {
    res.status(200).json({ message: "Student rejected successfully" });
  } else {
    res.status(500).json({ message: "Failed to reject student" });
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
  console.log(
    "stRTED",
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
  console.log(name, skill_name, experience, contractAddress);
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
    employer,
    startDate,
    endDate,
    description,
    certificate_hash,
    student_contract_address,
  } = req.body;
  const result = await addWorkExp(
    role,
    instAddress,
    employer,
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
  function safeString(val) {
    return typeof val === "string" ? val : "";
  }
  const newskill = skill.map((skills) => {
    return {
      skill_name: safeString(skills.name),
      experience: safeString(skills.experience),
      endorsed: !!skills.endorsed,
      endorser_address:
        skills.endorsedBy || "0x0000000000000000000000000000000000000000",
      review: safeString(skills.review),
      visible: !!skills.visible,
      cert_hash: "",
    };
  });
  const newcert = cert.map((certification) => {
    return {
      institute: safeString(certification.institute),
      certificate_name: safeString(certification.certificate_name),
      visible: !!certification.visible,
      verified: !!certification.verified,
      cert_hash: safeString(certification.cert_hash),
    };
  });
  const newWorkExp = workExp.map((work) => {
    return {
      role: safeString(work.role),
      institute: safeString(work.institute),
      employer: safeString(work.employer),
      startdate: safeString(work.startdate),
      enddate: safeString(work.enddate),
      verified: false,
      description: safeString(work.description),
      visible: !!work.visible,
      cert_hash: safeString(work.certificate_hash),
    };
  });

  const result = await applyForJob(
    account,
    studentName,
    employerAddress,
    newskill,
    newcert,
    newWorkExp
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
app.get("/getMoe", async (req, res) => {
  const moe = await getMoe();
  console.log(moe);
  res.status(200).json(moe);
});

app.get("/checkAccount", async (req, res) => {
  const moe = await checkMoe(req.query.account);
  const instAddress = await getInstAddress(req.query.account);
  const studAddress = await getStudAddress(req.query.account);
  const employerAddress = await getEmployerAddress(req.query.account);
  console.log(moe);
  res.status(200).json({ moe, instAddress, studAddress, employerAddress });
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
