import { Grid, GridItem, HStack, Image, Spinner } from "@chakra-ui/react";
import ColorMode from "../../components/ColorMode";
import NavBar from "../../components/NavBar";
import logoWhite from "../../assets/LogoWhite.svg";
import logoBlack from "../../assets/LogoBlack.svg";
import StudentInfomation, {
  type StudentInfo,
} from "../../components/StudentInfomation";
import { useColorMode } from "../../components/ui/color-mode";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Web3Context } from "../../Web3ContextProvider";
export const pages = [
  "Home",
  "Register Institution",
  "Add Skill",
  "Add Certificate",
  "Add Work Experience",
];

const StudentHome = () => {
  const { account, studentContractAddress } = useContext(Web3Context);
  console.log(account);
  console.log(studentContractAddress);
  const colorMode = useColorMode().colorMode;
  const [data, setData] = useState<StudentInfo | undefined>(undefined);
  useEffect(() => {
    axios
      .get("http://localhost:5000/studentInformation", {
        params: {
          contractAddress: studentContractAddress,
        },
      })
      .then((res) => {
        console.log(res.data);
        setData(res.data);
      });
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
        <center>
          {data ? <StudentInfomation data={data} /> : <Spinner />}
        </center>
      </GridItem>
    </Grid>
  );
};

export default StudentHome;
function useWeb3Context(): { studentContractAddress: any } {
  throw new Error("Function not implemented.");
}
