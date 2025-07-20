import { Grid, GridItem, HStack, Image, VStack } from "@chakra-ui/react";
import ColorMode from "../../components/ColorMode";
import NavBar from "../../components/NavBar";
import logoWhite from "../../assets/LogoWhite.svg";
import logoBlack from "../../assets/LogoBlack.svg";
import UploadCertificate from "../../components/UploadCertificate";
import ShowData from "../../components/ShowData";
import { pages } from "./StudentHome";
import { useColorMode } from "../../components/ui/color-mode";
import type { data } from "../../components/UploadCertificate";
import axios from "axios";
import type { FormEvent } from "react";
import { useState } from "react";
import { useEffect } from "react";
export interface workExp {
  role: string;
  institute: string;
  startdate: string;
  enddate: string;
  description: string;
  cert_hash: string;
  visible: boolean;
}
const AddWorkExp = () => {
  const colorMode = useColorMode().colorMode;
  const studentContractAddress = sessionStorage.getItem(
    "studentContractAddress"
  ) as string;
  const [certData, setCertData] = useState<workExp[]>([]);
  const onSubmit = (data: data, e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = axios.post("http://localhost:5000/addWorkExp", {
      role: data.jobTitle,
      instAddress: data.instituteAddress,
      startDate: data.startDate,
      endDate: data.endDate,
      description: data.description,
      certificate_hash: data.certificateHash,
      student_contract_address: studentContractAddress,
    });
    console.log(result);
  };
  const showData = () => {
    axios
      .get("http://localhost:5000/getWorkExp", {
        params: {
          contractAddress: studentContractAddress,
        },
      })
      .then((res) => {
        console.log("res.data", res.data);
        setCertData(res.data);
      });
  };
  useEffect(() => {
    showData();
  }, []);
  console.log(certData);
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
              onSubmit={onSubmit}
              type="workExperiance"
            ></UploadCertificate>

            {certData.map((item) => (
              <ShowData type="Work EXperiance" data={item}></ShowData>
            ))}
          </VStack>
        </center>
      </GridItem>
    </Grid>
  );
};

export default AddWorkExp;
