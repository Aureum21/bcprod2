import { Grid, GridItem, HStack, Image } from "@chakra-ui/react";
import ColorMode from "../../components/ColorMode";
import NavBar from "../../components/NavBar";
import logoWhite from "../../assets/LogoWhite.svg";
import logoBlack from "../../assets/LogoBlack.svg";
import StudentInfomation, {
  type StudentInfo,
} from "../../components/StudentInfomation";
import { useColorMode } from "../../components/ui/color-mode";
import { useContext, useEffect, useState } from "react";
import { Web3Context } from "../../Web3ContextProvider";
import InstituteInformation, {
  type InstituteInfo,
} from "../../components/InstituteInformation";
import axios from "axios";
const StudentHome = () => {
  const colorMode = useColorMode().colorMode;
  const { instituteContractAddress } = useContext(Web3Context);
  const [instInfo, setInstInfo] = useState({} as InstituteInfo);
  useEffect(() => {
    const getInstInfo = async () => {
      const instInfo = await axios.get(
        "http://localhost:5000/getInstituteInfo",
        {
          params: {
            contractAddress: instituteContractAddress,
          },
        }
      );
      setInstInfo(instInfo.data);
    };
    getInstInfo();
  }, []);
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
          <InstituteInformation data={instInfo}></InstituteInformation>
        </center>
      </GridItem>
    </Grid>
  );
};

export default StudentHome;
