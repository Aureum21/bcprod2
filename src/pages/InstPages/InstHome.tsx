import { Grid, GridItem, HStack, Image } from "@chakra-ui/react";
import ColorMode from "../../components/ColorMode";
import NavBar from "../../components/NavBar";
import logoWhite from "../../assets/LogoWhite.svg";
import logoBlack from "../../assets/LogoBlack.svg";
import StudentInfomation, {
  type StudentInfo,
} from "../../components/StudentInfomation";
import { useColorMode } from "../../components/ui/color-mode";
import { useContext } from "react";
import { Web3Context } from "../../Web3ContextProvider";
const StudentHome = () => {
  const colorMode = useColorMode().colorMode;
  const { instituteContractAddress } = useContext(Web3Context);
  return (
    <Grid templateAreas={{ base: `"nav" "main"` }}>
      <GridItem area="nav" justifyContent={"space-between"}>
        <HStack justifyContent="space-between" padding={2}>
          <Image src={colorMode === "dark" ? logoWhite : logoBlack} />
          <NavBar
            pages={[
              "Home",
              "Pending Students",
              "Transfer Students",
              "Add Certificate",
            ]}
            type="Institution"
          ></NavBar>
          <ColorMode />
        </HStack>
      </GridItem>
      <GridItem area="main" padding={2}>
        <center>
          <StudentInfomation data={{} as StudentInfo}></StudentInfomation>
        </center>
      </GridItem>
    </Grid>
  );
};

export default StudentHome;
