import { HStack, VStack } from "@chakra-ui/react";
import axios from "axios";
import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import ShowData from "../../components/ShowData";
import { useColorMode } from "../../components/ui/color-mode";
import type { data } from "../../components/UploadCertificate";
import UploadCertificate from "../../components/UploadCertificate";
interface Skill {
  name: string;
  experience: string;
  endorsed: boolean;
  endorsedBy: string;
  review: string;
  visible: boolean;
}
const AddSkill = () => {
  const [skills, setSkills] = useState<Skill[]>([]);

  const colorMode = useColorMode().colorMode;
  const studentContractAddress = sessionStorage.getItem(
    "studentContractAddress"
  ) as string;
  const handleUpload = async (data: data, e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(
      data.studentName,
      data.skillName,
      data.experience,
      studentContractAddress
    );
    const result = await axios.post("http://localhost:5000/addSkill", {
      name: data.studentName,
      skill_name: data.skillName,
      experience: data.experience,
      contractAddress: studentContractAddress,
    });
    console.log(result);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const skills = await axios.get("http://localhost:5000/listSkills", {
          params: {
            contractAddress: studentContractAddress,
          },
        });
        console.log(skills.data);
        setSkills(skills.data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <VStack gap={10} alignItems="center">
        <UploadCertificate
          onSubmit={handleUpload}
          type="skill"
        ></UploadCertificate>
        {skills.map((item) => {
          return <ShowData type="Skill" data={item}></ShowData>;
        })}
      </VStack>
    </>
  );
};

export default AddSkill;
