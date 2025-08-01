import { VStack } from "@chakra-ui/react";
import axios from "axios";
import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import ShowData from "../../components/ShowData";
import type { data } from "../../components/UploadCertificate";
import UploadCertificate from "../../components/UploadCertificate";
import { useColorMode } from "../../components/ui/color-mode";
export interface addCert {
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
  const onSubmit = async (data: data, e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await axios.post("http://localhost:5000/addUnOfficialCert", {
      certificate_name: data.certificateName,
      institute_address: data.instituteAddress,
      student_contract_address: studentContractAddress,
      certificate_hash: data.certificateHash,
    });
    console.log(result);
    showData();
  };
  const showData = async () => {
    try {
      await axios
        .get("http://localhost:5000/getUnOfficialCert", {
          params: {
            contractAddress: studentContractAddress,
          },
        })
        .then((res) => {
          sessionStorage.setItem("certData", JSON.stringify(res.data));
          setCertData(
            JSON.parse(
              sessionStorage.getItem("certData") as string
            ) as addCert[]
          );
        });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
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
          return <ShowData type="Certificate" data={item}></ShowData>;
        })}
      </VStack>
    </>
  );
};

export default AddCert;
