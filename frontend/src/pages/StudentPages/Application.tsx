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
} from "@chakra-ui/react";
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
import DataTag from "../../components/DataTag";
import AlertMessage from "../../components/AlertMessage";
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
    // const getSkills = async () => {
    //   try {
    //     await axios
    //       .get("http://localhost:5000/listSkills", {
    //         params: {
    //           contractAddress: studentContractAddress,
    //         },
    //       })
    //       .then((res) => {
    //         sessionStorage.setItem("skills", JSON.stringify(res.data));
    //         setSkills(
    //           JSON.parse(sessionStorage.getItem("skills") as string) as Skill[]
    //         );
    //       });
    //   } catch (error) {
    //     console.error("Error fetching data:", error);
    //   }
    // };
    // const getunofficialcertificates = async () => {
    //   try {
    //     await axios
    //       .get("http://localhost:5000/getUnOfficialCert", {
    //         params: {
    //           contractAddress: studentContractAddress,
    //         },
    //       })
    //       .then((res) => {
    //         sessionStorage.setItem("certData", JSON.stringify(res.data));
    //         setCertData(
    //           JSON.parse(
    //             sessionStorage.getItem("certData") as string
    //           ) as addCert[]
    //         );
    //       });
    //   } catch (error) {
    //     console.error("Error fetching data:", error);
    //   }
    // };
    // const getWorkExp = async () => {
    //   try {
    //     await axios
    //       .get("http://localhost:5000/getWorkExp", {
    //         params: {
    //           contractAddress: studentContractAddress,
    //         },
    //       })
    //       .then((res) => {
    //         sessionStorage.setItem("certData", JSON.stringify(res.data));
    //         setWorkExp(
    //           JSON.parse(
    //             sessionStorage.getItem("certData") as string
    //           ) as workExp[]
    //         );
    //       });
    //   } catch (error) {
    //     console.error("Error fetching data:", error);
    //   }
    // };

    async function order() {
      await fetchEmployers();
      // await getSkills();
      // await getunofficialcertificates();
      // await getWorkExp();
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
      console.log(e.checked, data);
      if (e.checked) {
        setSkillForApp([...skillForApp, data]);
      } else {
        setSkillForApp(
          skillForApp?.filter(
            (item) =>
              item?.skill_name !== data.skill_name &&
              item?.experience !== data.experience &&
              item?.endorsed !== data.endorsed &&
              item?.endorser_address !== data.endorser_address &&
              item?.review !== data.review &&
              item?.visible !== data.visible
          )
        );
      }
      console.log(skillForApp);
    }

    if (type === "Certificate") {
      console.log(e.checked, data);
      if (e.checked) {
        setCertForApp([...certForApp, data]);
      } else {
        setCertForApp(
          certForApp?.filter(
            (item) =>
              item.institute !== data.institute &&
              item.certificate_name !== data.certificate_name &&
              item.cert_hash !== data.cert_hash &&
              item.verified !== data.verified &&
              item.visible !== data.visible
          )
        );
      }
      console.log(certForApp);
    }
    if (type === "Work EXperiance") {
      console.log(e.checked, data);
      if (e.checked) {
        setWorkExpForApp([...workExpForApp, data]);
      } else {
        setWorkExpForApp(
          workExpForApp?.filter(
            (item) =>
              item.role !== data.role &&
              item.institute !== data.institute &&
              item.startdate !== data.startdate &&
              item.enddate !== data.enddate &&
              item.description !== data.description &&
              item.cert_hash !== data.cert_hash &&
              item.visible !== data.visible
          )
        );
      }
      console.log(workExpForApp);
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
          <Button
            disabled={isLoading}
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
        </Card.Body>
      </Card.Root>
    </>
  );
};

export default Application;
