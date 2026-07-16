import {
  Card,
  VStack,
  Text,
  HStack,
  Button,
  Heading,
  Spinner,
} from "@chakra-ui/react";
import type { skillForApplication } from "../pages/StudentPages/Application";
import type { workExpForApplication } from "../pages/StudentPages/Application";
import type { certForApplication } from "../pages/StudentPages/Application";
import DrawerComponent from "./DrawerComponent";
import { useColorModeValue } from "./ui/color-mode";

export interface ApplicantData {
  employee_name: string;
  application_status: string;
  employee_address: string;
  role: string;
  institutes: string[];
  skills: skillForApplication[];
  workexps: workExpForApplication[];
  certifications: certForApplication[];
}

interface PendingProps {
  data: ApplicantData[];
  isAcceptLoading: boolean;
  isRejectLoading: boolean;
  accept: (employee_address: string, employerContractAddress: string) => void;
  reject: (employee_address: string, employerContractAddress: string) => void;
  isLoading: boolean;
}

const PendingEmployees = ({
  data,
  accept,
  reject,
  isAcceptLoading,
  isRejectLoading,
  isLoading,
}: PendingProps) => {
  const employerContractAddress = sessionStorage.getItem(
    "employerContractAddress"
  ) as string;

  const cardBg = useColorModeValue("white", "gray.800");
  const cardBorder = useColorModeValue("gray.200", "gray.700");

  return isLoading ? (
    <>
      <Spinner size="md" />
      <Text>Loading...</Text>
    </>
  ) : (
    <VStack gap={6} w="full" overflow="auto">
      {data?.map(
        (item, index) =>
          item.employee_address !==
            "0x0000000000000000000000000000000000000000" && (
            <Card.Root
              key={index}
              w="full"
              maxW="3xl"
              borderWidth="1px"
              borderColor={cardBorder}
              borderRadius="lg"
              shadow="md"
              bg={cardBg}
              _hover={{ shadow: "lg", borderColor: "teal.400" }}
              transition="all 0.2s ease-in-out"
              p={6}
            >
              <Card.Body>
                <VStack align="start" gap={4}>
                  <Heading size="md" color="teal.500">
                    {item.employee_name}
                  </Heading>

                  <HStack gap={2}>
                    <Text fontWeight="semibold">Address:</Text>
                    <Text fontSize="sm" color="gray.500" maxLines={1}>
                      {item.employee_address}
                    </Text>
                  </HStack>

                  <HStack gap={2}>
                    <Text fontWeight="semibold">Application Status:</Text>
                    <Text color="blue.500" fontWeight="medium">
                      {item.application_status}
                    </Text>
                  </HStack>

                  <DrawerComponent
                    skillData={item.skills}
                    workExpData={item.workexps}
                    certData={item.certifications}
                    trigger={
                      <Button size="sm" variant="outline" colorScheme="teal">
                        Show Info
                      </Button>
                    }
                  />

                  <HStack gap={4} pt={2}>
                    <Button
                      colorPalette="green"
                      size="sm"
                      onClick={() =>
                        accept(item.employee_address, employerContractAddress)
                      }
                      variant="subtle"
                      disabled={isAcceptLoading}
                    >
                      {isAcceptLoading ? <Spinner size="sm" /> : "Accept"}
                    </Button>
                    <Button
                      colorPalette="red"
                      size="sm"
                      variant="subtle"
                      onClick={() =>
                        reject(item.employee_address, employerContractAddress)
                      }
                      disabled={isRejectLoading}
                    >
                      {isRejectLoading ? <Spinner size="sm" /> : "Reject"}
                    </Button>
                  </HStack>
                </VStack>
              </Card.Body>
            </Card.Root>
          )
      )}
    </VStack>
  );
};

export default PendingEmployees;
