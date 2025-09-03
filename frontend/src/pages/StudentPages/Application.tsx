import React, { useEffect, useState } from "react";
import SearchBar from "../../components/SearchBar";
import axios from "axios";
import { Button, HStack, VStack, Text } from "@chakra-ui/react";
import ShowDataApp from "../../components/ShowDataApp";
import type { Skill } from "./AddSkill";
import type { addCert } from "./AddCert";
import type { workExp } from "./AddWorkExp";
import { useNavigate } from "react-router-dom";
interface Employer {
  name: string;
  employer_address: string;
  email: string;
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

  const [skills, setSkills] = useState<Skill[]>(() => {
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
  const [certData, setCertData] = useState<addCert[]>(() => {
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
  const [workExp, setWorkExp] = useState<workExp[]>(() => {
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
  const [skillForApp, setSkillForApp] = useState<Skill[]>([]);
  const [certForApp, setCertForApp] = useState<addCert[]>([]);
  const [workExpForApp, setWorkExpForApp] = useState<workExp[]>([]);
  const handleCheckboxChange = (e: any, data: any, type: string) => {
    if (type === "Skill") {
      console.log(e.checked, data);
      if (e.checked) {
        setSkillForApp([...skillForApp, data]);
      } else {
        setSkillForApp(
          skillForApp?.filter(
            (item) =>
              item?.name !== data.name &&
              item?.experience !== data.experience &&
              item?.endorsed !== data.endorsed &&
              item?.endorsedBy !== data.endorsedBy &&
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
              item.name !== data.name &&
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

  const apply = async (
    employerAddress: string,
    skill: Skill[],
    cert: addCert[],
    workExp: workExp[]
  ) => {
    try {
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
          navigate("/student/application");
        });
    } catch (error) {
      console.error("Error fetching data:", error);
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

  return (
    <>
      <SearchBar
        words={filteredWords}
        handleChange={handleChange}
        searchTerm={searchTerm?.name}
      />

      <HStack alignItems="start">
        <VStack>
          {skills?.map((skill) => (
            <ShowDataApp
              key={skill?.name}
              type="Skill"
              data={skill}
              handleCheckboxChange={handleCheckboxChange}
            />
          ))}
        </VStack>
        <VStack>
          {certData?.map((cert) => (
            <ShowDataApp
              key={cert?.name}
              type="Certificate"
              data={cert}
              handleCheckboxChange={handleCheckboxChange}
            />
          ))}
        </VStack>
        <VStack>
          {workExp?.map((work) => (
            <ShowDataApp
              key={work?.role}
              type="Work EXperiance"
              data={work}
              handleCheckboxChange={handleCheckboxChange}
            />
          ))}
        </VStack>
      </HStack>
      <Button
        onClick={() =>
          apply(
            searchTerm.employer_address,
            skillForApp,
            certForApp,
            workExpForApp
          )
        }
      >
        Apply
      </Button>
    </>
  );
};

export default Application;
