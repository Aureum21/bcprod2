// Complete Express Backend with Full Metrics Coverage
const express = require("express");
const cors = require("cors");
const app = express();
const path = require("path");
const fs = require("fs-extra");
const crypto = require("crypto");
const Web3 = require("web3");
const Web3Quorum = require("web3js-quorum");
const { performance } = require("perf_hooks");
const axios = require('axios');
const PORT = process.env.PORT || 5000;
const studentWalletStorePath = path.resolve(
  __dirname,
  "Files",
  "studentWallets.json",
);
const walletWeb3 = new Web3();
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

// --- BENCHMARK GLOBAL VARIABLES ---
let benchmark = {
  isRunning: false,
  startTime: 0,
  endTime: 0,
  transactionCount: 0,
  latencies: [],
};

// Middleware
app.use(cors());
app.use(express.json());

// --- BENCHMARK CONTROL ROUTES ---

app.post("/benchmark/start", (req, res) => {
  benchmark = {
    isRunning: true,
    startTime: performance.now(),
    endTime: 0,
    transactionCount: 0,
    latencies: [],
  };
  console.log("Benchmark STARTED");
  res.status(200).json({ message: "Benchmark started" });
});

app.post("/benchmark/stop", (req, res) => {
  if (!benchmark.isRunning)
    return res.status(400).json({ message: "Benchmark not running" });
  benchmark.endTime = performance.now();
  benchmark.isRunning = false;
  console.log("Benchmark STOPPED");
  res.status(200).json({ message: "Benchmark stopped" });
});

app.get("/benchmark/metrics", (req, res) => {
  const totalTimeMs =
    (benchmark.endTime || performance.now()) - benchmark.startTime;
  const totalTimeSec = totalTimeMs / 1000;
  const tps = totalTimeSec > 0 ? benchmark.transactionCount / totalTimeSec : 0;

  const avgLatency =
    benchmark.latencies.length > 0
      ? benchmark.latencies.reduce((a, b) => a + b, 0) /
        benchmark.latencies.length
      : 0;

  const sortedLatencies = [...benchmark.latencies].sort((a, b) => a - b);
  const p99Index = Math.floor(sortedLatencies.length * 0.99);
  const p99Latency = sortedLatencies[p99Index] || 0;

  const report = {
    totalTransactions: benchmark.transactionCount,
    totalDurationSec: totalTimeSec.toFixed(4),
    throughputTPS: tps.toFixed(4),
    avgLatencyMs: avgLatency.toFixed(4),
    p99LatencyMs: p99Latency.toFixed(4),
    latencies: benchmark.latencies,
  };
  console.table(report);
  res.status(200).json(report);
});

const recordTx = (latency) => {
  if (benchmark.isRunning) {
    benchmark.transactionCount++;
    benchmark.latencies.push(latency);
  }
};

const derivePasswordHash = (password, salt) => {
  return crypto.scryptSync(password, salt, 64).toString("hex");
};

const createPasswordHash = (password) => {
  const salt = crypto.randomBytes(16).toString("hex");
  return {
    salt,
    password_hash: `${salt}:${derivePasswordHash(password, salt)}`,
  };
};

const verifyPasswordHash = (password, passwordHash) => {
  const [salt, expectedHash] = passwordHash.split(":");
  if (!salt || !expectedHash) {
    return false;
  }

  const derivedHash = derivePasswordHash(password, salt);
  const expectedBuffer = Buffer.from(expectedHash, "hex");
  const derivedBuffer = Buffer.from(derivedHash, "hex");

  if (expectedBuffer.length !== derivedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(expectedBuffer, derivedBuffer);
};




const encryptStudentPrivateKey = (privateKey, password) => {

    const salt = crypto.randomBytes(16);

    const key = crypto.pbkdf2Sync(
        password,
        salt,
        600000,
        32,
        "sha256"
    );


    const iv = crypto.randomBytes(12);


    const cipher = crypto.createCipheriv(
        "aes-256-gcm",
        key,
        iv
    );


    const encrypted = Buffer.concat([
        cipher.update(privateKey, "utf8"),
        cipher.final()
    ]);


    const authTag = cipher.getAuthTag();


    return {

        encrypted_private_key:
            encrypted.toString("hex"),

        salt:
            salt.toString("hex"),

        iv:
            iv.toString("hex"),

        auth_tag:
            authTag.toString("hex")
    };
};

const decryptStudentPrivateKey = (
    encrypted_private_key,
    salt,
    iv,
    auth_tag,
    password
) => {
    const key = crypto.pbkdf2Sync(
        password,
        Buffer.from(salt, "hex"),
        600000,
        32,
        "sha256"
    );
    const decipher = crypto.createDecipheriv(
        "aes-256-gcm",
        key,
        Buffer.from(iv, "hex")
    );
    decipher.setAuthTag(
        Buffer.from(auth_tag, "hex")
    );
    const decrypted = Buffer.concat([
        decipher.update(
            Buffer.from(
                encrypted_private_key,
                "hex"
            )
        ),
        decipher.final()
    ]);

    const decryptedStr = decrypted.toString("utf8").trim();

    // Check if it already starts with '0x' to prevent prepending it twice
    const has0x = decryptedStr.startsWith("0x");
    const with0x = has0x ? decryptedStr : `0x${decryptedStr}`;
    const without0x = has0x ? decryptedStr.slice(2) : decryptedStr;

    return {
        with0x,
        without0x
    };
};
const createStudentWalletBundle = (username,password) => {

  const wallet = walletWeb3.eth.accounts.create();
  const passwordHash = createPasswordHash(password);
  const encryptedBundle = encryptStudentPrivateKey(
        wallet.privateKey,
        password
  );


  return {
    username,

    wallet_address: wallet.address,

    encrypted_private_key:
        encryptedBundle.encrypted_private_key,

    salt:
        encryptedBundle.salt,

    iv:
        encryptedBundle.iv,

    auth_tag:
        encryptedBundle.auth_tag,

    password_hash:
        passwordHash.password_hash
};

};

const db = require("../server/config/database");


const saveStudentWalletRecord = async (walletRecord) => {

    const sql = `
    INSERT INTO users
    (
        username,
        blockchain_address,
        encrypted_private_key,
        encryption_salt,
        encryption_iv,
        password_hash
    )
    VALUES
    (?, ?, ?, ?, ?, ?)
    `;

    const values = [

        walletRecord.username,
        walletRecord.wallet_address,
        walletRecord.encrypted_private_key,
        walletRecord.salt,
        walletRecord.iv,
        walletRecord.password_hash
    ];


    const [result] = await db.execute(sql, values);
    return result.insertId;
};

// --- APPLICATION ROUTES ---

app.post("/registerStudent", async (req, res) => {
  const tStart = performance.now();
  const { name, email, id, password } = req.body;
  if (!password) {
    return res.status(400).json({ message: "Password is required" });
  }

  const studentWallet = createStudentWalletBundle(id,password);
  const { with0x, without0x } = decryptStudentPrivateKey(studentWallet.encrypted_private_key,studentWallet.salt,studentWallet.iv,studentWallet.auth_tag,password);
  const studentData = {
    name,
    student_address: studentWallet.wallet_address,
    email,
    id,
    without0x
  };

  const [resultPrivate, contractAddress] = await RegisterStudentPrivate(
    studentData
  );
  const resultPublic = await RegisterStudentPublic(
    contractInformations.publicdata.contractAddress,
    [studentWallet.wallet_address, contractAddress, with0x],
  );
  const tEnd = performance.now();
  if (resultPrivate.status === "0x1" && resultPublic.status === true) {
    await saveStudentWalletRecord({
      username: id,
      wallet_address: studentWallet.wallet_address,
      encrypted_private_key: studentWallet.encrypted_private_key,
      salt: studentWallet.salt,
      iv: studentWallet.iv,
      password_hash: studentWallet.password_hash,
    });
    recordTx(tEnd - tStart);
    res.status(200).json({
      message: "Student registered successfully",
      latency: tEnd - tStart,
      wallet_address: studentWallet.wallet_address,
    });
  } else {
    res.status(500).json({ message: "Failed to register student" });
  }
});
app.post("/registerBatchStudents", async (req, res) => {
  const count = parseInt(req.body.count) || 50;
  console.log(`\n======================================================`);
  console.log(`   Starting Wrapper Batch Registration: ${count} Students`);
  console.log(`======================================================\n`);

  // 1. Trigger the benchmark start timer
  try {
    await axios.post("http://localhost:5000/benchmark/start");
  } catch (err) {
    console.warn("Could not start benchmark timer (is benchmark start route configured?)");
  }

  const startTime = performance.now();

  // 2. Map count to an array of self-executing axios requests targeting /registerStudent
  const batchRequests = Array.from({ length: count }, (_, i) => {
    return axios.post("http://localhost:5000/registerStudent", {
      name: `Benchmark Institute ${i}`,
      email: `benchmark${i}@example.com`,
      id: `STUD_ID_${i}_${Date.now()}`,
      password: `password${i}`,
    })
    .then((response) => {
      console.log(`✓ Concurrent Student ${i + 1}/${count} completed successfully.`);
      return { success: true };
    })
    .catch((err) => {
      console.error(`✗ Concurrent Student ${i + 1}/${count} failed:`, err.message);
      return { success: false, error: err.message };
    });
  });

  // 3. Execute all requests at the exact same time
  const results = await Promise.all(batchRequests);

  // 4. Trigger the benchmark stop timer
  try {
    await axios.post("http://localhost:5000/benchmark/stop");
  } catch (err) {
    console.warn("Could not stop benchmark timer.");
  }

  const totalTime = (performance.now() - startTime) / 1000;
  const successfulRuns = results.filter(r => r.success).length;

  console.log(`\n======================================================`);
  console.log(`   Wrapper Batch Finished!`);
  console.log(`   Successful: ${successfulRuns}/${count}`);
  console.log(`   Total time taken: ${totalTime.toFixed(2)}s`);
  console.log(`======================================================\n`);

  // 5. Fetch and return metrics
  try {
    const metricsResponse = await axios.get("http://localhost:5000/benchmark/metrics");
    res.status(200).json({
      message: `Batch wrapper run completed!`,
      successCount: successfulRuns,
      totalCount: count,
      durationSec: totalTime,
      blockchainMetrics: metricsResponse.data
    });
  } catch (err) {
    res.status(200).json({
      message: `Batch wrapper run completed, but metrics retrieval failed.`,
      successCount: successfulRuns,
      totalCount: count,
      durationSec: totalTime,
    });
  }
});
// end batch registration

app.post("/registerInstituteToPending", async (req, res) => {
  const tStart = performance.now();
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
  const tEnd = performance.now();
  console.log(
    "Time taken for a private institute registration to pending : ",
    tEnd - tStart,
  );
  if (resultPrivate.status === true) {
    recordTx(tEnd - tStart);
    res.status(200).json({
      message: "Institute registered successfully",
      latency: tEnd - tStart,
    });
  } else {
    res.status(500).json({ message: "Failed to register institute" });
  }
});

app.get("/listPendingInstitutes", async (req, res) => {
  const tStart = performance.now();
  const institutes = await ListPendingInstitutes();
  console.log(institutes);
  const tEnd = performance.now();
  recordTx(tEnd - tStart);
  res.status(200).json(institutes);
});

app.post("/acceptInstitute", async (req, res) => {
  const tStart = performance.now();
  const { name, address, id, index } = req.body;
  const moeAddress = besu.member1.accountAddress;
  const InstContract = await createInstContract(
    [name, address, id, moeAddress],
    "Institute",
  );
  const InstPendingContract = await createInstContract(
    [name, address, id, moeAddress],
    "Pending",
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
    console.log("Address", address);
    console.log("InstContractAddress", InstContractAddress);
    console.log("InstPendingContractAddress", InstPendingContractAddress);
    const resultPublic = await registerInstToPublic([
      address,
      InstContractAddress,
      InstPendingContractAddress,
    ]);
    console.log("Public Registration Receipt", resultPublic);

    const tEnd = performance.now();
    console.log("Time taken for the whole process: ", tEnd - tStart);

    if (resultPrivate.status === "0x1" && resultPublic.status === true) {
      recordTx(tEnd - tStart);
      res.status(200).json({
        message: "Institute verified successfully",
        latency: tEnd - tStart,
      });
    } else {
      res.status(500).json({ message: "Failed to verify institute" });
    }
  } else {
    res.status(500).json({ message: "Failed to create institute" });
  }
});

app.post("/rejectInstitute", async (req, res) => {
  const tStart = performance.now();
  const { name, address, id, index } = req.body;
  const resultPrivate = await rejectInstitute(address, id);

  console.log(resultPrivate);
  const tEnd = performance.now();
  if (resultPrivate.status === "0x1") {
    recordTx(tEnd - tStart);
    res.status(200).json({
      message: "Institute rejected successfully",
      latency: tEnd - tStart,
    });
  } else {
    res.status(500).json({ message: "Failed to reject institute" });
  }
});

app.get("/studentInformation", async (req, res) => {
  const tStart = performance.now();
  const { contractAddress } = req.query;
  console.log("contractAddress", contractAddress);
  const studentInfo = await getStudProfile(contractAddress);
  console.log(studentInfo);
  const tEnd = performance.now();
  recordTx(tEnd - tStart);
  res.status(200).json(studentInfo);
});

app.post("/regStudToInstPending", async (req, res) => {
  const tStart = performance.now();
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
  const tEnd = performance.now();
  console.log(
    "Time taken for a private student registration to pending : ",
    tEnd - tStart,
  );
  if (resultPrivate.status === "0x1") {
    recordTx(tEnd - tStart);
    res.status(200).json({
      message: "Student added to pending successfully",
      latency: tEnd - tStart,
    });
  } else {
    res.status(500).json({ message: "Failed to add student to pending" });
  }
});

app.post("/regStudToInstTransfer", async (req, res) => {
  const tStart = performance.now();
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
  const tEnd = performance.now();
  if (resultPrivate.status === "0x1") {
    recordTx(tEnd - tStart);
    res.status(200).json({
      message: "Institution transfer Pending",
      latency: tEnd - tStart,
    });
  } else {
    res.status(500).json({ message: "Failed to transfer institution" });
  }
});

app.get("/getPendingStudents", async (req, res) => {
  const tStart = performance.now();
  const PendingStudents = await ListPendingStudents(req.query.contractAddress);
  const tEnd = performance.now();
  recordTx(tEnd - tStart);
  res.status(200).json(PendingStudents);
});

app.post("/acceptPendingStudent", async (req, res) => {
  const tStart = performance.now();
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
    inst_Pending_contract_address,
  );
  const tEnd = performance.now();
  if (result) {
    recordTx(tEnd - tStart);
    res.status(200).json({
      message: "Student accepted successfully",
      latency: tEnd - tStart,
    });
  } else {
    res.status(500).json({ message: "Failed to accept student" });
  }
});

app.post("/rejectPendingStudent", async (req, res) => {
  const tStart = performance.now();
  const { student_address, inst_Pending_contract_address } = req.body;
  const result = await removePendingStudents(
    student_address,
    inst_Pending_contract_address,
  );
  const tEnd = performance.now();
  if (result) {
    recordTx(tEnd - tStart);
    res.status(200).json({
      message: "Student rejected successfully",
      latency: tEnd - tStart,
    });
  } else {
    res.status(500).json({ message: "Failed to reject student" });
  }
});

app.post("/acceptTransferStudent", async (req, res) => {
  const tStart = performance.now();
  const { name, address, email, id, index, institute_address } = req.body;
  const result = await VerifyTransferStudent(
    name,
    address,
    email,
    id,
    index,
    institute_address,
  );
  const tEnd = performance.now();
  console.log(
    "Time taken for the whole accept transfer student : ",
    tEnd - tStart,
  );
  if (result) {
    recordTx(tEnd - tStart);
    res.status(200).json({
      message: "Student accepted successfully",
      latency: tEnd - tStart,
    });
  } else {
    res.status(500).json({ message: "Failed to accept student" });
  }
});

app.post("/addOfficialCert", async (req, res) => {
  const tStart = performance.now();
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
    description,
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
    description,
  );
  console.log(result);
  const tEnd = performance.now();
  if (result.status === "0x1") {
    recordTx(tEnd - tStart);
    res.status(200).json({
      message: "Official Certificate added successfully",
      latency: tEnd - tStart,
    });
  } else {
    res.status(500).json({ message: "Failed to add official certificate" });
  }
});

app.post("/addSkill", async (req, res) => {
  const tStart = performance.now();
  const { name, skill_name, experience, contractAddress } = req.body;
  console.log(name, skill_name, experience, contractAddress);
  const result = await addSkill(skill_name, name, experience, contractAddress);
  console.log(result);
  const tEnd = performance.now();
  console.log("Time taken for the whole add skill : ", tEnd - tStart);
  if (result.status === "0x1") {
    recordTx(tEnd - tStart);
    res
      .status(200)
      .json({ message: "Skill added successfully", latency: tEnd - tStart });
  } else {
    res.status(500).json({ message: "Failed to add skill" });
  }
});

app.post("/addUnOfficialCert", async (req, res) => {
  const tStart = performance.now();
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
    certificate_hash,
  );
  console.log(result);
  const tEnd = performance.now();
  if (result.status === "0x1") {
    recordTx(tEnd - tStart);
    res.status(200).json({
      message: "Unofficial certificate added",
      latency: tEnd - tStart,
    });
  } else {
    res.status(500).json({ message: "Failed to add certificate" });
  }
});

app.post("/addWorkExp", async (req, res) => {
  const tStart = performance.now();
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
    student_contract_address,
  );
  console.log(result);
  const tEnd = performance.now();
  if (result.status === "0x1") {
    recordTx(tEnd - tStart);
    res.status(200).json({ message: "Work exp added", latency: tEnd - tStart });
  } else {
    res.status(500).json({ message: "Failed to add work exp" });
  }
});

app.get("/getUnOfficialCert", async (req, res) => {
  const tStart = performance.now();
  const result = await getUnOfficialCert(req.query.contractAddress);
  console.log(result);
  const tEnd = performance.now();
  recordTx(tEnd - tStart);
  res.status(200).json(result);
});

app.get("/getWorkExp", async (req, res) => {
  const tStart = performance.now();
  const result = await getWorkExp(req.query.contractAddress);
  console.log(result);
  const tEnd = performance.now();
  recordTx(tEnd - tStart);
  res.status(200).json(result);
});

app.get("/listSkills", async (req, res) => {
  const tStart = performance.now();
  const { contractAddress } = req.query;
  const skills = await ListSkills(contractAddress);
  console.log(skills);
  const tEnd = performance.now();
  recordTx(tEnd - tStart);
  res.status(200).json(skills);
});

app.get("/getInstituteInfo", async (req, res) => {
  const tStart = performance.now();
  const info = await getInstituteInfo(req.query.contractAddress);
  console.log(info);
  const tEnd = performance.now();
  recordTx(tEnd - tStart);
  res.status(200).json(info);
});

app.get("/getInstList", async (req, res) => {
  const tStart = performance.now();
  const institutes = await ListInstitutes();
  console.log(institutes);
  const tEnd = performance.now();
  recordTx(tEnd - tStart);
  res.status(200).json(institutes);
});

app.post("/registerEmployer", async (req, res) => {
  const tStart = performance.now();
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
  const tEnd = performance.now();
  if (resultPrivate.status === true) {
    recordTx(tEnd - tStart);
    res.status(200).json({
      message: "Employer registered successfully",
      latency: tEnd - tStart,
    });
  } else {
    res.status(500).json({ message: "Failed to register employer" });
  }
});

app.get("/getEmpList", async (req, res) => {
  const tStart = performance.now();
  const employers = await ListEmployers();
  console.log(employers);
  const tEnd = performance.now();
  recordTx(tEnd - tStart);
  res.status(200).json(employers);
});

app.post("/applyForJob", async (req, res) => {
  const tStart = performance.now();
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
      skill_name: safeString(skills.skill_name),
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
    newWorkExp,
  );
  console.log(result);
  const tEnd = performance.now();
  console.log("Time taken for the whole apply for job : ", tEnd - tStart);
  if (result.status === "0x1") {
    recordTx(tEnd - tStart);
    res.status(200).json({
      message: "Application submitted successfully",
      latency: tEnd - tStart,
    });
  } else {
    res.status(500).json({ message: "Failed to submit application" });
  }
});

app.get("/getPendingEmployees", async (req, res) => {
  const tStart = performance.now();
  const PendingEmployees = await ListPendingEmployees(
    req.query.contractAddress,
  );
  console.log(PendingEmployees);
  const tEnd = performance.now();
  if (PendingEmployees) {
    recordTx(tEnd - tStart);
    res.status(200).json(PendingEmployees);
  } else {
    res.status(500).json({ message: "Failed to get pending employees" });
  }
});

app.post("/acceptEmployee", async (req, res) => {
  const tStart = performance.now();
  const { employeeAddress, employerContractAddress } = req.body;
  const result = await acceptEmployee(employeeAddress, employerContractAddress);
  console.log(result);
  const tEnd = performance.now();
  console.log("Time taken for the whole accept employee : ", tEnd - tStart);
  if (result.status === "0x1") {
    recordTx(tEnd - tStart);
    res.status(200).json({
      message: "Application accepted successfully",
      latency: tEnd - tStart,
    });
  } else {
    res.status(500).json({ message: "Failed to accept application" });
  }
});

app.post("/rejectEmployee", async (req, res) => {
  const tStart = performance.now();
  const { employeeAddress, employerContractAddress } = req.body;

  const result = await rejectEmployee(employeeAddress, employerContractAddress);
  console.log(result);
  const tEnd = performance.now();
  if (result.status === "0x1") {
    recordTx(tEnd - tStart);
    res.status(200).json({
      message: "Application rejected successfully",
      latency: tEnd - tStart,
    });
  } else {
    res.status(500).json({ message: "Failed to reject application" });
  }
});

app.get("/employerInfo", async (req, res) => {
  const tStart = performance.now();
  const employerInfo = await getEmployerInfo(req.query.contractAddress);
  console.log(employerInfo);
  const tEnd = performance.now();
  recordTx(tEnd - tStart);
  res.status(200).json(employerInfo);
});

app.get("/getNumberOfApplicants", async (req, res) => {
  const tStart = performance.now();
  const numberOfApplicants = await getNumberOfApplicants(
    req.query.contractAddress,
  );
  console.log(numberOfApplicants);
  const tEnd = performance.now();
  recordTx(tEnd - tStart);
  res.status(200).json(numberOfApplicants);
});

app.get("/getEmployeeInfo", async (req, res) => {
  const tStart = performance.now();
  const employeeInfo = await getEmployeeInfo(req.query.contractAddress);
  console.log(employeeInfo);
  const tEnd = performance.now();
  console.log("Time taken for the whole get employee info : ", tEnd - tStart);
  recordTx(tEnd - tStart);
  res.status(200).json(employeeInfo);
});

app.get("/getMoe", async (req, res) => {
  const tStart = performance.now();
  const moe = await getMoe();
  console.log(moe);
  const tEnd = performance.now();
  recordTx(tEnd - tStart);
  res.status(200).json(moe);
});

app.get("/checkAccount", async (req, res) => {
  const tStart = performance.now();
  
  const moe = await checkMoe(req.query.account);
  const instAddress = await getInstAddress(req.query.account);
  const studAddress = await getStudAddress(req.query.account);
  const employerAddress = await getEmployerAddress(req.query.account);
  console.log(moe);
  const tEnd = performance.now();
  recordTx(tEnd - tStart);
  res.status(200).json({ moe, instAddress, studAddress, employerAddress });
});

// Dynamic Port Selection (defaults to 5000 if no PORT variable is specified)
const serverPort = process.argv[2] || process.env.PORT || 5000;

app.listen(serverPort, () => {
  console.log(`Server running on http://localhost:${serverPort}`);
});
