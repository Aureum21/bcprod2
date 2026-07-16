import { HStack, VStack, Text, Box, Spinner } from "@chakra-ui/react";
import Pending from "../../components/Pending";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import type { Skill } from "../StudentPages/AddSkill";
import type { workExp } from "../StudentPages/AddWorkExp";
import type { addCert } from "../StudentPages/AddCert";

export interface OfficialCertification {
  student: string;
  cert_type: string;
  student_name: string;
  institute: string;
  startdate: string;
  enddate: string;
  verified: boolean;
  description: string;
  cert_hash: string;
}

export interface pending {
  name: string;
  index: number;
  application_status: string;
  student_address: string;
  email: string;
  id: string;
  registration_type: string;
  institutes: string[];
  skills: Skill[];
  workexps: workExp[];
  certifications: addCert[];
  official_certifications: OfficialCertification[];
}
interface PendingStud {
  pendingStudents: pending[];
  transferStudents: pending[];
}
const PendingStud = () => {
  const { data: pendingStudents, isLoading: pendingStudentsLoading } = useQuery(
    {
      queryKey: ["pendingStudents"],
      queryFn: () =>
        axios
          .get<PendingStud>("http://localhost:5000/getPendingStudents", {
            params: {
              contractAddress: sessionStorage.getItem("pendingContractAddress"),
            },
          })
          .then((res) => res.data),
    }
  );

  return (
    <>
      <HStack
        minWidth={"500px"}
        justifyContent={"center"}
        gap={"10px"}
        align={"start"}
      >
        <Box
          shadow="md"
          borderRadius="md"
          padding={2}
          backdropBlur={"10px"}
          minWidth={"592.65px"}
        >
          <VStack>
            <Text fontWeight="bold" padding={2}>
              Registration Pending Students
            </Text>
            {pendingStudents?.pendingStudents.length === 0 ? (
              pendingStudentsLoading ? (
                <Spinner />
              ) : (
                <Text>No Pending Students</Text>
              )
            ) : (
              pendingStudents?.pendingStudents.map((pendingStudent, index) =>
                pendingStudent.student_address !==
                "0x0000000000000000000000000000000000000000" ? (
                  <Pending key={index} data={pendingStudent}></Pending>
                ) : (
                  <>
                    <Text>No Pending Students</Text>
                  </>
                )
              )
            )}
          </VStack>
        </Box>
        <Box
          shadow="md"
          borderRadius="md"
          padding={2}
          backdropBlur={"10px"}
          minWidth={"592.65px"}
        >
          <VStack>
            <Text fontWeight="bold" padding={2}>
              Transfer Pending Students
            </Text>
            {pendingStudents?.transferStudents.length === 0 ? (
              pendingStudentsLoading ? (
                <Spinner />
              ) : (
                <Text>No Transfer Students</Text>
              )
            ) : (
              pendingStudents?.transferStudents.map((transfer, index) =>
                transfer.student_address !==
                "0x0000000000000000000000000000000000000000" ? (
                  <Pending key={index} data={transfer}></Pending>
                ) : (
                  <></>
                )
              )
            )}
          </VStack>
        </Box>
      </HStack>
    </>
  );
};

export default PendingStud;
