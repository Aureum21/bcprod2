import {
  Center,
  Card,
  Box,
  VStack,
  HStack,
  Image,
  Text,
  Badge,
  Heading,
  SimpleGrid,
  Spinner,
} from "@chakra-ui/react";
import user from "../assets/Employer.jpg";
import { CiCircleCheck } from "react-icons/ci";
import StatDisplay from "./StatDisplay";
import { useColorModeValue } from "./ui/color-mode";
import Piechart from "./Piechart";
import EmployerDashboard from "./EmployerDashboard";
import EmployerInfoSkeleton from "./EmployerInfoSkeleton";

interface EmployerInfo {
  employer_address: string;
  employer_name: string;
  email: string;
}
interface props {
  isLoading: boolean;
  data: EmployerInfo;
  totalNumberOfApplicants: number;
  numberOfApplicants: {
    accepted: string;
    rejected: string;
    pending: string;
  };
}

const EmployerInformation = ({
  isLoading,
  data,
  totalNumberOfApplicants,
  numberOfApplicants,
}: props) => {
  const cardBg = useColorModeValue("white", "gray.800");
  return (
    <Center>
      <Card.Root
        flexDirection="row"
        overflow="hidden"
        minW="3xl"
        borderWidth="1px"
        borderRadius="xl"
        shadow="md"
        _hover={{ shadow: "lg" }}
        bg="white"
      >
        {/* Left Side - Image */}
        <Box bg="gray.50" display="flex" alignItems="center" p={6}>
          <Image
            src={user}
            alt="Employer"
            borderRadius="full"
            boxSize="120px"
            objectFit="cover"
            shadow="md"
          />
        </Box>

        {/* Right Side - Info */}
        <Box flex="1">
          {isLoading ? (
            <EmployerInfoSkeleton />
          ) : (
            <Card.Body p={6}>
              <Card.Title mb="4">
                <Text fontSize="2xl" fontWeight="bold" color="teal.600">
                  Your Information
                </Text>
              </Card.Title>
              <HStack>
                <VStack align="start" gap={4}>
                  <HStack>
                    <Text fontWeight="semibold" color="gray.600">
                      Name:
                    </Text>
                    <Badge colorScheme="teal" px={3} py={1} borderRadius="md">
                      {data?.employer_name}
                    </Badge>
                  </HStack>

                  <VStack align="start" gap={1}>
                    <Text fontWeight="semibold" color="gray.600">
                      Address:
                    </Text>
                    <Text>{data?.employer_address}</Text>
                  </VStack>

                  <HStack>
                    <Text fontWeight="semibold" color="gray.600">
                      Email:
                    </Text>
                    <Text>{data?.email}</Text>
                  </HStack>
                </VStack>
              </HStack>
            </Card.Body>
          )}

          <Card.Footer bg="gray.50" px={6} py={3}>
            <HStack>
              <CiCircleCheck />
              <Text fontSize="sm" color="gray.500">
                Verified
              </Text>
            </HStack>
          </Card.Footer>
        </Box>
      </Card.Root>
    </Center>
  );
};

export default EmployerInformation;
