import { type MouseEvent } from "react";
import { Card, CardBody, VStack, Text, HStack, Button } from "@chakra-ui/react";
import axios from "axios";
import type { pending } from "../pages/InstPages/PendingStud";
import DrawerComponent from "./DrawerComponent";
import { useMutation, useQueryClient } from "@tanstack/react-query";

interface PendingProps {
  data: pending;
}

const Pending = ({ data }: PendingProps) => {
  const account = sessionStorage.getItem("account") as string;
  const queryClient = useQueryClient();

  const { mutate: acceptPendingStudent } = useMutation({
    mutationFn: (data: any) =>
      axios
        .post("http://localhost:5000/acceptPendingStudent", data)
        .then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["pendingStudents"],
      });
    },
    onError: (error) => {
      console.log(error);
    },
  });
  const { mutate: rejectPendingStudent } = useMutation({
    mutationFn: (student_address: string) =>
      axios
        .post("http://localhost:5000/rejectPendingStudent", {
          student_address: student_address,
          inst_Pending_contract_address: sessionStorage.getItem(
            "pendingContractAddress"
          ) as string,
        })
        .then((res) => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["pendingStudents"],
      });
    },
    onError: (error) => {
      console.log(error);
    },
  });
  const handleAccept = (_e: MouseEvent<HTMLButtonElement>) => {
    console.log("accepting");
    console.log("data", data);
    const payload = {
      name: data.name,
      index: data.index,
      application_status: data.application_status,
      student_address: data.student_address,
      email: data.email,
      id: data.id,
      registration_type: data.registration_type,
      institutes: data.institutes,
      skills: data.skills,
      workexps: data.workexps,
      certifications: data.certifications,
      official_certifications: data.official_certifications,
      institute_contract_address: sessionStorage.getItem(
        "instituteContractAddress"
      ) as string,
      inst_address: account,
      inst_Pending_contract_address: sessionStorage.getItem(
        "pendingContractAddress"
      ) as string,
    };
    acceptPendingStudent(payload);
  };

  const handleReject = (_e: MouseEvent<HTMLButtonElement>) => {
    rejectPendingStudent(data.student_address);
  };

  return (
    <Card.Root>
      <CardBody>
        <VStack p={4}>
          <HStack>
            <Text>Name:</Text>
            <Text>{data.name}</Text>
          </HStack>
          <HStack>
            <Text>Address:</Text>
            <Text>{data.student_address}</Text>
          </HStack>
          <HStack>
            <Text>Email:</Text>
            <Text>{data.email}</Text>
          </HStack>
          <HStack>
            <Text>ID:</Text>
            <Text>{data.id}</Text>
          </HStack>
          <HStack>
            <DrawerComponent
              trigger={<Button variant="subtle">Show More Info</Button>}
              skillData={data.skills}
              workExpData={data.workexps}
              certData={data.certifications}
            ></DrawerComponent>
          </HStack>
          <HStack>
            <Button onClick={handleAccept}>Accept</Button>
            <Button onClick={handleReject}>Reject</Button>
          </HStack>
        </VStack>
      </CardBody>
    </Card.Root>
  );
};

export default Pending;
