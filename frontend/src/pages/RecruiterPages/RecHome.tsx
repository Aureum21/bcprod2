import {
  Box,
  HStack,
  VStack,
  Text,
  Stat,
  SimpleGrid,
  Heading,
} from "@chakra-ui/react";
import Piechart from "../../components/Piechart";
import EmployerInformation from "../../components/EmployerInformation";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";
import ListOfEmployees from "../../components/ListOfEmployees";
import { motion } from "framer-motion";
import { useColorModeValue } from "../../components/ui/color-mode";
import StatDisplay from "../../components/StatDisplay";
import EmployerDashboard from "../../components/EmployerDashboard";

const MotionBox = motion(Box);

const RecHome = () => {
  const { data: employerInfo, isLoading: employerInfoLoading } = useQuery({
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

  const { data: numberOfApplicants, isLoading: numberOfApplicantsLoading } =
    useQuery({
      queryKey: ["number-of-applicants"],
      queryFn: () =>
        axios
          .get("http://localhost:5000/getNumberOfApplicants", {
            params: {
              contractAddress: sessionStorage.getItem(
                "employerContractAddress"
              ),
            },
          })
          .then((res) => res.data),
    });

  const { data: employeeInfo, isLoading: employeeInfoLoading } = useQuery({
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

  const cardBg = useColorModeValue("white", "gray.800");

  return (
    <Box px={{ base: 4, md: 10 }} py={6}>
      {/* Employer Info */}
      <HStack alignItems={"start"}>
        <EmployerInformation
          isLoading={employerInfoLoading}
          data={employerInfo}
          totalNumberOfApplicants={totalNumberOfApplicants}
          numberOfApplicants={numberOfApplicants}
        />
        <EmployerDashboard
          isLoading={numberOfApplicantsLoading}
          totalNumberOfApplicants={totalNumberOfApplicants}
          numberOfApplicants={numberOfApplicants}
        />
      </HStack>

      <HStack align="start" gap={8} flexWrap="wrap">
        <Box flex="1" minW="md">
          <ListOfEmployees data={employeeInfo} />
        </Box>
      </HStack>
    </Box>
  );
};

export default RecHome;
