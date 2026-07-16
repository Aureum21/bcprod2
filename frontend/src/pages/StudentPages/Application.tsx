import React, { useEffect, useState } from "react";
import SearchBar from "../../components/SearchBar";
import axios from "axios";
import {
  Button,
  HStack,
  VStack,
  Text,
  Card,
  Box,
  Badge,
  Spinner,
  Separator, 
} from "@chakra-ui/react"; // Added Separator for style
import ShowDataApp from "../../components/ShowDataApp";
import type { Skill } from "./AddSkill";
import type { addCert } from "./AddCert";
import type { workExp } from "./AddWorkExp";
import { useNavigate } from "react-router-dom";
import { IoIosAttach } from "react-icons/io";
import AttachFile from "../../components/AttachFile";
import { FaTools } from "react-icons/fa";
import { PiCertificateBold } from "react-icons/pi";
import { IoBriefcaseOutline } from "react-icons/io5";
import { CiTimer } from "react-icons/ci"; // Added Icon
import DataTag from "../../components/DataTag";
import AlertMessage from "../../components/AlertMessage";
import Web3 from "web3";

interface Employer {
  name: string;
  employer_address: string;
  email: string;
}
export interface skillForApplication {
  skill_name: string;
  experience: string;
  endorsed: boolean;
  endorser_address: string;
  review: string;
  visible: boolean;
  cert_hash: string;
}
export interface workExpForApplication {
  role: string;
  institute: string;
  employer: string;
  startdate: string;
  enddate: string;
  verified: boolean;
  description: string;
  visible: boolean;
  cert_hash: string;
}
export interface certForApplication {
  institute: string;
  certificate_name: string;
  visible: boolean;
  verified: boolean;
  cert_hash: string;
}

const Application = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState<Employer>({
    name: "",
    employer_address: "",
    email: "",
  });

  // Benchmark State
  const [isBenchmarking, setIsBenchmarking] = useState(false);

  const studentContractAddress = sessionStorage.getItem(
    "studentContractAddress"
  );
  const account = sessionStorage.getItem("account");
  const studentName = JSON.parse(
    sessionStorage.getItem("studentInfo") as string
  )?.student_name;

  const [skills, setSkills] = useState<skillForApplication[]>(() => {
    const stored = JSON.parse(
      sessionStorage.getItem("studentInfo") as string
    )?.skills;
    try {
      return stored ? stored : [];
    } catch (err) {
      console.error("Failed to parse skills from sessionStorage", err);
      return [];
    }
  });
  const [employers, setEmployers] = useState<Employer[]>(() => {
    const stored = sessionStorage.getItem("employerList");
    try {
      return stored ? JSON.parse(stored) : [];
    } catch (err) {
      console.error("Failed to parse employerList from sessionStorage", err);
      return [];
    }
  });
  const [certData, setCertData] = useState<certForApplication[]>(() => {
    const stored = JSON.parse(
      sessionStorage.getItem("studentInfo") as string
    )?.certifications;
    try {
      return stored ? stored : [];
    } catch (err) {
      console.error("Failed to parse certData from sessionStorage", err);
      return [];
    }
  });
  const [workExp, setWorkExp] = useState<workExpForApplication[]>(() => {
    const stored = JSON.parse(
      sessionStorage.getItem("studentInfo") as string
    )?.workexps;
    try {
      return stored ? stored : [];
    } catch (err) {
      console.error("Failed to parse workExp from sessionStorage", err);
      return [];
    }
  });
  const filteredWords = employers?.filter((word) =>
    word.name.toLowerCase().includes(searchTerm.name.toLowerCase())
  );

  console.log(studentName);
  useEffect(() => {
    const fetchEmployers = async () => {
      const employers = await axios.get("http://localhost:5000/getEmpList");
      sessionStorage.setItem("employerList", JSON.stringify(employers.data));
      setEmployers(
        JSON.parse(sessionStorage.getItem("employerList") as string)
      );
    };

    async function order() {
      await fetchEmployers();
    }
    order();
  }, []);

  const [skillForApp, setSkillForApp] = useState<skillForApplication[]>([]);
  const [certForApp, setCertForApp] = useState<certForApplication[]>([]);
  const [workExpForApp, setWorkExpForApp] = useState<workExpForApplication[]>(
    []
  );

  const handleCheckboxChange = (e: any, data: any, type: string) => {
    if (type === "Skill") {
      if (e.checked) {
        setSkillForApp([...skillForApp, data]);
      } else {
        setSkillForApp(
          skillForApp?.filter(
            (item) =>
              item?.skill_name !== data.skill_name
          )
        );
      }
    }

    if (type === "Certificate") {
      if (e.checked) {
        setCertForApp([...certForApp, data]);
      } else {
        setCertForApp(
          certForApp?.filter(
            (item) =>
              item.certificate_name !== data.certificate_name
          )
        );
      }
    }
    if (type === "Work EXperiance") {
      if (e.checked) {
        setWorkExpForApp([...workExpForApp, data]);
      } else {
        setWorkExpForApp(
          workExpForApp?.filter(
            (item) =>
              item.role !== data.role
          )
        );
      }
    }
  };
  const [alertOpen, setAlertOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const apply = async (
    employerAddress: string,
    skill: skillForApplication[],
    cert: certForApplication[],
    workExp: workExp[]
  ) => {
    try {
      setIsLoading(true);
      await axios
        .post("http://localhost:5000/applyForJob", {
          account,
          studentName,
          employerAddress,
          skill,
          cert,
          workExp,
        })
        .then(() => {
          setAlertOpen(true);
          navigate("/student/application");
        });
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
      setSkillForApp([]);
      setCertForApp([]);
      setWorkExpForApp([]);
    }
  };
  const web3Instance = new Web3(window.ethereum);
  // --- RESEARCH BENCHMARK FUNCTION (APPLICATION) ---
  const runBenchmark = async () => {
    const ITERATIONS = 50; // Adjusted to 50 as requested
    
    // Ensure an employer is selected or pick the first one available
    let targetEmployer = searchTerm.employer_address;
    if (!targetEmployer) {
       if (employers.length > 0) {
           targetEmployer = employers[0].employer_address;
           console.log(`Auto-selected employer: ${employers[0].name}`);
       } else {
           alert("Please wait for employer list to load or select one manually.");
           return;
       }
    }

    if (!confirm(`Run ${ITERATIONS} Application transactions to ${targetEmployer}?`)) {
      return;
    }

    setIsBenchmarking(true);

    try {
      console.log("--- Starting Application Benchmark ---");

      // 1. Start Timer
      await axios.post("http://localhost:5000/benchmark/start");

      // 2. Loop 50 Times
      for (let i = 5; i < ITERATIONS; i++) {
        try {
          // Construct dummy data matching the interfaces
          const dummySkill = [{
            skill_name: `Speed Coding ${i}`,
            experience: "10 years",
            endorsed: false,
            endorsedBy: "0x0000000000000000000000000000000000000000",
            review: "Fast",
            visible: true,
            cert_hash: ""
          }];
          
          const dummyCert = [{
            institute: "0x0000000000000000000000000000000000000000",
            certificate_name: `Stress Test Degree ${i}`,
            visible: true,
            verified: true,
            cert_hash: `HASH_${i}`
          }];

          const dummyWork = [{
            role: "Load Tester",
            institute: "0x0000000000000000000000000000000000000000",
            employer: "The Blockchain",
            startdate: "2023",
            enddate: "2024",
            verified: false,
            description: "Spamming the network",
            visible: true,
            cert_hash: ""
          }];
          const accountstudent = web3Instance?.eth?.accounts?.create();
          await axios.post("http://localhost:5000/applyForJob", {
            account: accountstudent?.address,
            studentName: `${studentName} (Bot ${i})`,
            employerAddress: targetEmployer,
            skill: dummySkill,
            cert: dummyCert,
            workExp: dummyWork,
          });

          if (i % 10 === 0) console.log(`Application ${i + 1}/${ITERATIONS} sent`);

        } catch (err) {
          console.error(`App Transaction ${i} failed`, err);
        }
      }

      // 3. Stop Timer
      await axios.post("http://localhost:5000/benchmark/stop");

      // 4. Get Metrics
      const metricsResponse = await axios.get("http://localhost:5000/benchmark/metrics");
      const m = metricsResponse.data;

      const report = `
      RESEARCH DATA (Application):
      ----------------------------
      Total Tx: ${m.totalTransactions}
      Total Time: ${m.totalDurationSec}s
      Throughput (TPS): ${m.throughputTPS}
      Avg Latency: ${m.avgLatencyMs}ms
      P99 Latency: ${m.p99LatencyMs}ms
      `;

      alert(report);
      console.log(m);

    } catch (error) {
      console.error("Benchmark crashed:", error);
      alert("Benchmark failed.");
    } finally {
      setIsBenchmarking(false);
    }
  };
  // ----------------------------------------------------

  const handleChange = (
    word: string,
    employer_address: string,
    email: string
  ) => {
    setSearchTerm({
      name: word,
      employer_address,
      email,
    });
  };
  const handleCancel = () => {
    console.log("Cancel");
    console.log(skillForApp, certForApp, workExpForApp);
  };
  const handleReomveData = (
    data: skillForApplication | workExpForApplication | certForApplication,
    type: string
  ) => {
      // (Original remove logic preserved)
    console.log(data, type);
    if (type === "Skill") {
      setSkillForApp(
        skillForApp?.filter(
          (item) =>
            item?.skill_name !== (data as skillForApplication)?.skill_name
        )
      );
    }
    if (type === "Certificate") {
      setCertForApp(
        certForApp?.filter(
          (item) =>
            item?.certificate_name !==
            (data as certForApplication)?.certificate_name
        )
      );
    }
    if (type === "Work Experience") {
      setWorkExpForApp(
        workExpForApp?.filter(
          (item) => item?.role !== (data as workExpForApplication)?.role
        )
      );
    }
  };

  return (
    <>
      <AlertMessage
        isOpen={alertOpen}
        onClose={() => setAlertOpen(false)}
        type="success"
        message="Your Application has been submitted successfully!"
      />
      <Card.Root>
        <Card.Header>
          <Card.Title fontSize="2xl" fontWeight="bold">
            Apply for Job
          </Card.Title>
        </Card.Header>
        <Card.Body>
          <Box shadow="md" p={4} borderRadius={4} mb={4}>
            <Text fontSize="sm" fontWeight="normal">
              Search Employer:
            </Text>
            <SearchBar
              words={filteredWords}
              handleChange={handleChange}
              searchTerm={searchTerm?.name}
            />
          </Box>
          <HStack gap={1}>
            <IoIosAttach />
            <Text fontWeight="normal">Attach Your Data:</Text>
          </HStack>

          <HStack alignItems="start">
            <HStack alignItems="start">
              <VStack alignItems="start">
                <AttachFile
                  handleCancel={handleCancel}
                  type="Skill"
                  trigger={
                    <Button variant="subtle" m={2}>
                      <FaTools /> Skills
                    </Button>
                  }
                  handleCheckboxChange={handleCheckboxChange}
                  data={skills}
                  selectedData={skillForApp}
                />
                {skillForApp?.map((skill, index) => (
                  <DataTag
                    key={index}
                    data={skill}
                    type="Skill"
                    handleRemoveData={handleReomveData}
                  />
                ))}
              </VStack>
              <VStack alignItems="start">
                <AttachFile
                  handleCancel={handleCancel}
                  type="Certificate"
                  trigger={
                    <Button variant="subtle" m={2}>
                      <PiCertificateBold /> Certificates
                    </Button>
                  }
                  handleCheckboxChange={handleCheckboxChange}
                  data={certData}
                  selectedData={certForApp}
                />
                {certForApp?.map((cert, index) => (
                  <DataTag
                    key={index}
                    data={cert}
                    type="Certificate"
                    handleRemoveData={handleReomveData}
                  />
                ))}
              </VStack>
              <VStack alignItems="start">
                <AttachFile
                  handleCancel={handleCancel}
                  type="Work EXperiance"
                  trigger={
                    <Button variant="subtle" m={2}>
                      <IoBriefcaseOutline /> Work EXperiance
                    </Button>
                  }
                  handleCheckboxChange={handleCheckboxChange}
                  data={workExp}
                  selectedData={workExpForApp}
                />
                {workExpForApp?.map((workExp, index) => (
                  <DataTag
                    key={index}
                    data={workExp}
                    type="Work Experience"
                    handleRemoveData={handleReomveData}
                  />
                ))}
              </VStack>
            </HStack>
          </HStack>

          {/* Regular Apply Button */}
          <Button
            disabled={isLoading || isBenchmarking}
            mt={2}
            alignSelf="end"
            width="25%"
            onClick={() =>
              apply(
                searchTerm.employer_address,
                skillForApp,
                certForApp,
                workExpForApp
              )
            }
            variant="outline"
            colorPalette="teal"
          >
            {isLoading ? <Spinner /> : "Apply"}
          </Button>

          {/* --- Research / Stress Test Section --- */}
          <Separator mt={8} mb={4} />
          <VStack align="stretch" bg="gray.50" p={4} borderRadius="md" border="1px dashed gray">
            <HStack>
                <CiTimer size={24} />
                <Text fontWeight="bold">Research Mode</Text>
            </HStack>
            <Text fontSize="sm" color="gray.600">
                Automate 50 consecutive job applications to the selected employer for throughput testing.
            </Text>
            <Button 
                colorPalette="red" 
                variant="solid" 
                onClick={runBenchmark}
                loading={isBenchmarking}
                loadingText="Running 50 Tx..."
            >
                Start 50-Iteration Stress Test
            </Button>
          </VStack>

        </Card.Body>
      </Card.Root>
    </>
  );
};

export default Application;