import { VStack } from "@chakra-ui/react";
import axios from "axios";
import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import ShowData from "../../components/ShowData";
import type { data } from "../../components/UploadCertificate";
import UploadCertificate from "../../components/UploadCertificate";
import { useColorMode } from "../../components/ui/color-mode";
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
  const studentContractAddress = sessionStorage.getItem(
    "studentContractAddress"
  ) as string;
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
    <>
      <VStack>
        <UploadCertificate
          onSubmit={onSubmit}
          type="unOfficial"
        ></UploadCertificate>
        {certData.map((item) => {
          console.log("item", item);
          return <ShowData type="Certificate" data={item}></ShowData>;
        })}
      </VStack>
    </>
  );
};

export default AddCert;
