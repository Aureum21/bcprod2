import { Grid, GridItem, HStack, Image } from "@chakra-ui/react";
import ColorMode from "../../components/ColorMode";
import NavBar from "../../components/NavBar";
import logoWhite from "../../assets/LogoWhite.svg";
import logoBlack from "../../assets/LogoBlack.svg";
import UploadCertificate from "../../components/UploadCertificate";
import { useColorMode } from "../../components/ui/color-mode";
import type { FormEvent } from "react";
import type { data } from "../../components/UploadCertificate";
import axios from "axios";
import { useContext } from "react";
import { Web3Context } from "../../Web3ContextProvider";

const AddOfficialCert = () => {
  const { account, instituteContractAddress } = useContext(Web3Context);
  const onSubmit = (data: data, e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = axios.post("http://localhost:5000/addOfficialCert", {
      name: data.studentName,
      student_address: data.studentAddress,
      certificate_type: data.certificateType,
      institute_address: account,
      certificate_hash: data.certificateHash,
      institute_contract_address: instituteContractAddress,
      startDate: data.startDate,
      endDate: data.endDate,
      description: data.description,
    });
    console.log(result);
  };
  const colorMode = useColorMode().colorMode;
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
          <UploadCertificate
            onSubmit={onSubmit}
            type="normal"
          ></UploadCertificate>
        </center>
      </GridItem>
    </Grid>
  );
};

export default AddOfficialCert;
