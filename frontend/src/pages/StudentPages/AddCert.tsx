import { Box, Tabs, Text } from "@chakra-ui/react";
import axios from "axios";
import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import ShowData from "../../components/ShowData";
import type { data } from "../../components/UploadCertificate";
import UploadCertificate from "../../components/UploadCertificate";
import { useColorMode } from "../../components/ui/color-mode";
import { PiCertificate } from "react-icons/pi";
import { CiViewList } from "react-icons/ci";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AlertMessage from "../../components/AlertMessage";
export interface addCert {
  name: string;
  institute: string;
  certificate_name: string;
  cert_hash: string;
  verified: boolean;
  visible: boolean;
}
interface addCertData {
  cert_name: string;
  institute: string;

  cert_hash: string;
}
const AddCert = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const colorMode = useColorMode().colorMode;
  const studentContractAddress = sessionStorage.getItem(
    "studentContractAddress"
  ) as string;
  const queryClient = useQueryClient();
  const { mutateAsync: addCert } = useMutation({
    mutationFn: async (data: addCertData) => {
      const result = await axios.post(
        "http://localhost:5000/addUnOfficialCert",
        {
          certificate_name: data.cert_name,
          institute_address: data.institute,
          student_contract_address: studentContractAddress,
          certificate_hash: data.cert_hash,
        }
      );
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["certs"],
      });
      setAlertOpen(true);
    },
  });

  const onSubmit = async (data: data, e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const result = await addCert({
      cert_name: data.certificateName,
      institute: data.instituteAddress,
      cert_hash: data.certificateHash,
    });
    setIsLoading(false);
    console.log(result);
  };
  const { data: certData } = useQuery({
    queryKey: ["certs"],
    queryFn: () =>
      axios.get<addCert[]>("http://localhost:5000/getUnOfficialCert", {
        params: {
          contractAddress: studentContractAddress,
        },
      }),
  });

  return (
    <>
      <AlertMessage
        isOpen={alertOpen}
        onClose={() => setAlertOpen(false)}
        type="success"
        message="Your Certificate has been added successfully!"
      />
      <Tabs.Root variant="outline" mt={2} defaultValue="Upload Certificate">
        <Tabs.List
          justifyContent="flex-start"
          zIndex={1}
          position="sticky"
          overflowX="revert"
        >
          <Tabs.Trigger value="Upload Certificate">
            <PiCertificate />
            Upload Certificate
          </Tabs.Trigger>
          <Tabs.Trigger value="Show Certificates">
            <CiViewList />
            Show Certificates
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="Upload Certificate" overflow="auto">
          <UploadCertificate
            onSubmit={onSubmit}
            type="unOfficial"
            isLoading={isLoading}
          ></UploadCertificate>
        </Tabs.Content>
        <Tabs.Content value="Show Certificates">
          <Box padding={2}>
            <Text fontSize="2xl" fontWeight="bold">
              Certificates
            </Text>

            {certData?.data.map((item) => {
              return <ShowData type="Certificate" data={item}></ShowData>;
            })}
          </Box>
        </Tabs.Content>
      </Tabs.Root>
    </>
  );
};

export default AddCert;
