import { Grid, GridItem, HStack, Image } from "@chakra-ui/react";
import ColorMode from "../../components/ColorMode";
import NavBar from "../../components/NavBar";
import logoWhite from "../../assets/LogoWhite.svg";
import logoBlack from "../../assets/LogoBlack.svg";
import StudentInfomation, {
  type StudentInfo,
} from "../../components/StudentInfomation";
import { useColorMode } from "../../components/ui/color-mode";
import { useEffect, useState } from "react";
import axios from "axios";
import InfoSkeleton from "../../components/InfoSkeleton";
export const pages = [
  "Home",
  "Register Institution",
  "Add Skill",
  "Add Certificate",
  "Add Work Experience",
];

const StudentHome = () => {
  const studentContractAddress = sessionStorage.getItem(
    "studentContractAddress"
  );
  console.log("studentContractAddress from this", studentContractAddress);
  const colorMode = useColorMode().colorMode;
  const [data, setData] = useState<StudentInfo | undefined>(undefined);
  useEffect(() => {
    !JSON.parse(sessionStorage.getItem("studentInfo") as string)
      ? axios
          .get("http://localhost:5000/studentInformation", {
            params: {
              contractAddress: studentContractAddress,
            },
          })
          .then((res) => {
            sessionStorage.setItem("studentInfo", JSON.stringify(res.data));
            setData(res.data);
          })
      : null;
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
          {JSON.parse(sessionStorage.getItem("studentInfo") as string) ? (
            <StudentInfomation
              data={
                JSON.parse(
                  sessionStorage.getItem("studentInfo") as string
                ) as StudentInfo
              }
            />
          ) : (
            <InfoSkeleton />
          )}
        </center>
      </GridItem>
    </Grid>
  );
};

export default StudentHome;
