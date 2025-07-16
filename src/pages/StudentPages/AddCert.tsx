import { Grid, GridItem, HStack, Image, VStack } from "@chakra-ui/react";
import ColorMode from "../../components/ColorMode";
import NavBar from "../../components/NavBar";
import logoWhite from "../../assets/LogoWhite.svg";
import logoBlack from "../../assets/LogoBlack.svg";
import UploadCertificate from "../../components/UploadCertificate";
import ShowData from "../../components/ShowData";
import { pages } from "./StudentHome";
import { useColorMode } from "../../components/ui/color-mode";
import { useContext } from "react";
import { Web3Context } from "../../Web3ContextProvider";
import type { data } from "../../components/UploadCertificate";
import axios from "axios";
import type { FormEvent } from "react";
import { useState } from "react";
import { useEffect } from "react";
interface addCert {
  name: string;
  institute: string;
  certificate_name: string;
  cert_hash: string;
  verified: boolean;
  visible: boolean;
}
const AddCert = () => {
  const colorMode = useColorMode().colorMode;
  const { studentContractAddress } = useContext(Web3Context);
  const [certData, setCertData] = useState<addCert[]>([]);
  const onSubmit = (data: data, e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = axios.post("http://localhost:5000/addUnOfficialCert", {
      certificate_name: data.certificateName,
      institute_address: data.instituteAddress,
      student_contract_address: studentContractAddress,
      certificate_hash: data.certificateHash,
    });
    console.log(result);
  };
  const showData = () => {
    axios
      .get("http://localhost:5000/getUnOfficialCert", {
        params: {
          contractAddress: studentContractAddress,
        },
      })
      .then((res) => {
        console.log(res.data);
        setCertData(res.data);
        console.log(certData);
      });
  };
  useEffect(() => {
    showData();
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
          <VStack>
            <UploadCertificate
              onSubmit={onSubmit}
              type="unOfficial"
            ></UploadCertificate>
            {certData.map((item) => (
              <ShowData type="Certificate" data={item}></ShowData>
            ))}
          </VStack>
        </center>
      </GridItem>
    </Grid>
  );
};

export default AddCert;
