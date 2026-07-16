import React from "react";
import { VStack, Heading, SimpleGrid, Box, Center } from "@chakra-ui/react";
import { useColorModeValue } from "./ui/color-mode";
import StatDisplay from "./StatDisplay";
import Piechart from "./Piechart";
import StatsSkeleton from "./StatsSkeleton";

interface Props {
  totalNumberOfApplicants: number;
  numberOfApplicants: {
    accepted: string;
    rejected: string;
    pending: string;
  };
  isLoading: boolean;
}

const EmployerDashboard = ({
  totalNumberOfApplicants,
  numberOfApplicants,
  isLoading,
}: Props) => {
  const cardBg = useColorModeValue("white", "gray.800");
  return (
    <VStack
      alignItems="start"
      shadow="md"
      p={6}
      borderRadius="xl"
      w="full"
      maxW="3xl"
      bg={cardBg}
      gap={6}
    >
      <Heading size="md" mb={2}>
        Application Overview
      </Heading>

      <SimpleGrid columns={{ base: 2, md: 2 }} gap={6} w="full">
        {isLoading ? (
          <StatsSkeleton />
        ) : (
          <>
            <StatDisplay
              value={totalNumberOfApplicants}
              Title="Total Applicants"
            />
            <StatDisplay
              value={parseInt(numberOfApplicants?.accepted)}
              Title="Accepted Applicants"
            />
          </>
        )}
      </SimpleGrid>

      <Box ml={20}>
        <Piechart
          data={[
            {
              name: "Accepted",
              value: parseInt(numberOfApplicants?.accepted),
              color: "#4FD1C5",
            },
            {
              name: "Rejected",
              value: parseInt(numberOfApplicants?.rejected),
              color: "#F56565",
            },
            {
              name: "Pending",
              value: parseInt(numberOfApplicants?.pending),
              color: "#ECC94B",
            },
          ]}
        />
      </Box>
    </VStack>
  );
};

export default EmployerDashboard;
