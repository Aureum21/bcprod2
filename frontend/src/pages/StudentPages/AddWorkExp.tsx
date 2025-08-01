import { VStack } from "@chakra-ui/react";
import axios from "axios";
import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import ShowData from "../../components/ShowData";
import { useColorMode } from "../../components/ui/color-mode";
import type { data } from "../../components/UploadCertificate";
import UploadCertificate from "../../components/UploadCertificate";
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
  const onSubmit = async (data: data, e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await axios.post("http://localhost:5000/addWorkExp", {
      role: data.jobTitle,
      instAddress: data.instituteAddress,
      startDate: data.startDate,
      endDate: data.endDate,
      description: data.description,
      certificate_hash: data.certificateHash,
      student_contract_address: studentContractAddress,
    });
    console.log(result);
    showData();
  };
  const showData = async () => {
    try {
      await axios
        .get("http://localhost:5000/getWorkExp", {
          params: {
            contractAddress: studentContractAddress,
          },
        })
        .then((res) => {
          sessionStorage.setItem("certData", JSON.stringify(res.data));
          setCertData(
            JSON.parse(
              sessionStorage.getItem("certData") as string
            ) as workExp[]
          );
        });
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };
  useEffect(() => {
    showData();
  }, []);
  console.log(certData);
  return (
    <>
      <VStack>
        <UploadCertificate
          onSubmit={onSubmit}
          type="workExperiance"
        ></UploadCertificate>

        {certData.map((item) => (
          <ShowData type="Work EXperiance" data={item}></ShowData>
        ))}
      </VStack>
    </>
  );
};

export default AddWorkExp;
