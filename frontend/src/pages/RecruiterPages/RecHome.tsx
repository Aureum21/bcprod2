import { Box, HStack, VStack, Text, Button } from "@chakra-ui/react";
import Piechart from "../../components/Piechart";
import EmployerInformation from "../../components/EmployerInformation";
import EmployeeInfo from "../../components/employeeInfo";
import { useEffect } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import ListOfEmployees from "../../components/ListOfEmployees";
import type { ApplicantData } from "../../components/PendingEmployees";

const numbers = [1, 2, 3, 4];
const RecHome = () => {
  const { data: employerInfo } = useQuery({
    queryKey: ["employer-info"],
    queryFn: () =>
      axios
        .get("http://localhost:5000/employerInfo", {
          params: {
            contractAddress: sessionStorage.getItem("employerContractAddress"),
          },
        })
        .then((res) => res.data),
  });

  const { data: numberOfApplicants } = useQuery({
    queryKey: ["number-of-applicants"],
    queryFn: () =>
      axios
        .get("http://localhost:5000/getNumberOfApplicants", {
          params: {
            contractAddress: sessionStorage.getItem("employerContractAddress"),
          },
        })
        .then((res) => res.data),
  });
  const { data: employeeInfo } = useQuery({
    queryKey: ["employee-info"],
    queryFn: () =>
      axios
        .get("http://localhost:5000/getEmployeeInfo", {
          params: {
            contractAddress: sessionStorage.getItem("employerContractAddress"),
          },
        })
        .then((res) => res.data),
  });
  const totalNumberOfApplicants =
    parseInt(numberOfApplicants?.accepted) +
    parseInt(numberOfApplicants?.rejected) +
    parseInt(numberOfApplicants?.pending);
  return (
    <Box p={4}>
      <HStack alignItems="center" mb="5" gap="2">
        <EmployerInformation data={employerInfo} />
        <VStack
          shadow="md"
          width="100%"
          p={4}
          borderRadius="md"
          alignItems="start"
        >
          <Box shadow="md" p="2" borderRadius="md" bg="white">
            <Text>Total Number of Employees</Text>
            <Text>{totalNumberOfApplicants}</Text>
          </Box>
          <Piechart
            data={[
              {
                name: "Accepted",
                value: parseInt(numberOfApplicants?.accepted),
                color: "#8884d8",
              },
              {
                name: "Rejected",
                value: parseInt(numberOfApplicants?.rejected),
                color: "#82ca9d",
              },
              {
                name: "Pending",
                value: parseInt(numberOfApplicants?.pending),
                color: "#82ca2d",
              },
            ]}
          />
        </VStack>
      </HStack>
      <ListOfEmployees data={employeeInfo} />
    </Box>
  );
};

export default RecHome;
