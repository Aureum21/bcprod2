import { Box, HStack, Tabs, VStack, Text } from "@chakra-ui/react";
import axios from "axios";
import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import ShowData from "../../components/ShowData";
import { useColorMode } from "../../components/ui/color-mode";
import type { data } from "../../components/UploadCertificate";
import UploadCertificate from "../../components/UploadCertificate";
import { LuFolder } from "react-icons/lu";
import { CiViewList } from "react-icons/ci";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AlertMessage from "../../components/AlertMessage";
export interface Skill {
  name: string;
  experience: string;
  endorsed: boolean;
  endorsedBy: string;
  review: string;
  visible: boolean;
}
interface addSkillData {
  name: string;
  skill_name: string;
  experience: string;
  contractAddress: string;
}
const AddSkill = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const colorMode = useColorMode().colorMode;
  const queryClient = useQueryClient();
  const studentContractAddress = sessionStorage.getItem(
    "studentContractAddress"
  ) as string;
  const { mutateAsync: addSkill } = useMutation({
    mutationFn: async (data: addSkillData) => {
      const result = await axios.post("http://localhost:5000/addSkill", {
        name: data.name,
        skill_name: data.skill_name,
        experience: data.experience,
        contractAddress: studentContractAddress,
      });
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["skills"],
      });
    },
  });
  const handleUpload = async (data: data, e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    console.log(
      data.studentName,
      data.skillName,
      data.experience,
      studentContractAddress
    );
    const payload = {
      name: data.studentName,
      skill_name: data.skillName,
      experience: data.experience,
      contractAddress: studentContractAddress,
    };
    const result = await addSkill(payload as addSkillData);
    console.log(result);
    setIsLoading(false);
    setAlertOpen(true);
  };
  const { data: skillsData } = useQuery({
    queryKey: ["skills"],
    queryFn: () =>
      axios.get("http://localhost:5000/listSkills", {
        params: {
          contractAddress: studentContractAddress,
        },
      }),
  });

  return (
    <>
      <Tabs.Root variant="outline" mt={2} defaultValue="Upload Skill">
        <Tabs.List justifyContent="flex-start" position="sticky">
          <Tabs.Trigger value="Upload Skill">
            <LuFolder />
            Upload Skill
          </Tabs.Trigger>
          <Tabs.Trigger value="Show Skills">
            <CiViewList />
            Show Skills
          </Tabs.Trigger>
        </Tabs.List>
        <Tabs.Content value="Upload Skill">
          <center>
            <AlertMessage
              isOpen={alertOpen}
              onClose={() => setAlertOpen(false)}
              type="success"
              message="Your Skill has been added successfully!"
            />
            <UploadCertificate
              onSubmit={handleUpload}
              isLoading={isLoading}
              type="skill"
            ></UploadCertificate>
          </center>
        </Tabs.Content>
        <Tabs.Content value="Show Skills">
          <Box padding={2}>
            <Text fontSize="2xl" fontWeight="bold">
              Skills
            </Text>
            {skillsData?.data.map((item: Skill) => {
              return <ShowData type="Skill" data={item}></ShowData>;
            })}
          </Box>
        </Tabs.Content>
      </Tabs.Root>
    </>
  );
};

export default AddSkill;
