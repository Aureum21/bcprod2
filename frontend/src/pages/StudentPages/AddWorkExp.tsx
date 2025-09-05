import { Tabs, Box, Text } from "@chakra-ui/react";
import axios from "axios";
import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import ShowData from "../../components/ShowData";
import { useColorMode } from "../../components/ui/color-mode";
import type { data } from "../../components/UploadCertificate";
import UploadCertificate from "../../components/UploadCertificate";
import { MdWorkOutline } from "react-icons/md";
import { CiViewList } from "react-icons/ci";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AlertMessage from "../../components/AlertMessage";
export interface workExp {
  role: string;
  institute: string;
  employer: string;
  startdate: string;
  enddate: string;
  description: string;
  cert_hash: string;
  visible: boolean;
}
interface addWorkExpData {
  role: string;
  institute: string;
  employer: string;
  startdate: string;
  enddate: string;
  description: string;
  cert_hash: string;
}
const AddWorkExp = () => {
  const colorMode = useColorMode().colorMode;
  const [isLoading, setIsLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const studentContractAddress = sessionStorage.getItem(
    "studentContractAddress"
  ) as string;
  const queryClient = useQueryClient();
  const { mutateAsync: addWorkExp } = useMutation({
    mutationFn: async (data: addWorkExpData) => {
      const result = await axios.post("http://localhost:5000/addWorkExp", {
        role: data.role,
        instAddress: data.institute,
        employer: data.employer,
        startDate: data.startdate,
        endDate: data.enddate,
        description: data.description,
        certificate_hash: data.cert_hash,
        student_contract_address: studentContractAddress,
      });
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["certData"],
      });
      setAlertOpen(true);
    },
  });

  const onSubmit = async (data: data, e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    const result = await addWorkExp({
      role: data.jobTitle,
      institute: data.instituteAddress,
      employer: data.companyName,
      startdate: data.startDate,
      enddate: data.endDate,
      description: data.description,
      cert_hash: data.certificateHash,
    });
    console.log(result);
    setIsLoading(false);
  };
  const { data: certData } = useQuery({
    queryKey: ["certData"],
    queryFn: () =>
      axios.get<workExp[]>("http://localhost:5000/getWorkExp", {
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
        message="Your Work Experiance has been added successfully!"
      />
      <Tabs.Root variant="outline" mt={2} defaultValue="Upload Work Experiance">
        <Tabs.List>
          <Tabs.Trigger value="Upload Work Experiance">
            <MdWorkOutline />
            Upload Work Experiance
          </Tabs.Trigger>
          <Tabs.Trigger value="Show Work Experiance">
            <CiViewList />
            Show Work Experiance
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="Upload Work Experiance">
          <UploadCertificate
            onSubmit={onSubmit}
            type="workExperiance"
            isLoading={isLoading}
          ></UploadCertificate>
        </Tabs.Content>
        <Tabs.Content value="Show Work Experiance">
          <Box padding={2}>
            <Text fontSize="2xl" fontWeight="bold">
              Work Experiance
            </Text>

            {certData?.data.map((item) => {
              return <ShowData type="Work EXperiance" data={item}></ShowData>;
            })}
          </Box>
        </Tabs.Content>
      </Tabs.Root>
    </>
  );
};

export default AddWorkExp;
