import { Grid, GridItem, HStack, Image, VStack } from "@chakra-ui/react";
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
import { useContext } from "react";
import { Web3Context } from "../../Web3ContextProvider";
const AddSkill = () => {
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
        <center>
          <VStack>
            <UploadCertificate
              onSubmit={handleUpload}
              type="skill"
            ></UploadCertificate>
            <ShowData type="Skill"></ShowData>
          </VStack>
        </center>
      </GridItem>
    </Grid>
  );
};

export default AddSkill;
