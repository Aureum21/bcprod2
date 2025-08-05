import {
  Center,
  Card,
  Box,
  VStack,
  HStack,
  Image,
  Text,
} from "@chakra-ui/react";
import user from "../assets/Institution.jpg";
export interface InstituteInfo {
  instAddress: string;
  name: string;
  id: string;
}
interface EmployerInfo {
  employerAddress: string;
  name: string;
  email: string;
}

const InstituteInformation = ({ data }: { data: InstituteInfo }) => {
  return (
    <Center>
      <Card.Root flexDirection="row" overflow="hidden" maxW="3xl" minW="3xl">
        <Image objectFit="cover" maxW="300px" src={user} alt="Caffe Latte" />
        <Box>
          <Card.Body>
            <Card.Title mb="2"></Card.Title>
            <VStack align="baseline" marginTop="35px">
              <HStack>
                <Text fontWeight="bold">Name:</Text>
                <Text>{data.name}</Text>
              </HStack>
              <VStack align={"start"}>
                <Text fontWeight="bold">Address:</Text>
                <Text>{data.instAddress}</Text>
              </VStack>
              <HStack>
                <Text fontWeight="bold">Institute ID:</Text>
                <Text>{data.id}</Text>
              </HStack>
            </VStack>
          </Card.Body>
          <Card.Footer></Card.Footer>
        </Box>
      </Card.Root>
    </Center>
  );
};

export default InstituteInformation;
