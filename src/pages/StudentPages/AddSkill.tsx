import {
  Center,
  Grid,
  GridItem,
  HStack,
  Image,
  VStack,
} from "@chakra-ui/react";
import ColorMode from "../../components/ColorMode";
import NavBar from "../../components/NavBar";
import logoWhite from "../../assets/LogoWhite.svg";
import logoBlack from "../../assets/LogoBlack.svg";
import UploadCertificate from "../../components/UploadCertificate";
import ShowData from "../../components/ShowData";
import { pages } from "./StudentHome";
import { useColorMode } from "../../components/ui/color-mode";
import type { FormEvent } from "react";
import type { data } from "../../components/UploadCertificate";
import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { Web3Context } from "../../Web3ContextProvider";
interface Skill {
  name: string;
  skill_name: string;
  experience: string;
}
const AddSkill = () => {
  const [skills, setSkills] = useState<Skill[]>([]);

  const colorMode = useColorMode().colorMode;
  const { studentContractAddress } = useContext(Web3Context);
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
    <Grid templateAreas={{ base: `"nav" "main"` }}>
      <GridItem area="nav" justifyContent={"space-between"}>
        <HStack justifyContent="space-between" padding={2}>
          <Image src={colorMode === "dark" ? logoWhite : logoBlack} />
          <NavBar pages={pages} type="Student"></NavBar>
          <ColorMode />
        </HStack>
      </GridItem>
      <GridItem area="main" padding={2}>
        <Center>
          <HStack gap={10} alignItems="start">
            <ShowData type="Skill" data={skills}></ShowData>
            <UploadCertificate
              onSubmit={handleUpload}
              type="skill"
            ></UploadCertificate>
          </HStack>
        </Center>
      </GridItem>
    </Grid>
  );
};

export default AddSkill;
