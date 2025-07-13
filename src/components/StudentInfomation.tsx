import {
  Box,
  Card,
  HStack,
  Image,
  VStack,
  Text,
  Center,
} from "@chakra-ui/react";
import user from "../assets/User.jpg";

export interface StudentInfo {
  name: string;
  email: string;
  id: string;
  accountAddress: string;
  institution: string;
}

const StudentInfomation = ({ data }: { data: StudentInfo }) => {
  console.log("data", data);

  return (
    <Center>
      <Card.Root flexDirection="row" overflow="hidden" maxW="3xl">
        <Image objectFit="cover" maxW="200px" src={user} alt="Caffe Latte" />
        <Box>
          <Card.Body>
            <Card.Title mb="2"></Card.Title>
            <VStack align="start">
              <HStack>
                <Text fontWeight="bold">Name:</Text>
                <Text>{data.name}</Text>
              </HStack>
              <HStack>
                <Text fontWeight="bold">Email:</Text>
                <Text>{data.email}</Text>
              </HStack>
              <HStack>
                <Text fontWeight="bold">ID:</Text>
                <Text>{data.id}</Text>
              </HStack>
              <VStack alignItems={"left"}>
                <Text fontWeight="bold">Account Address:</Text>
                <Text>{data.accountAddress}</Text>
              </VStack>
              <HStack>
                <VStack alignItems={"left"}>
                  <Text fontWeight="bold">Institution:</Text>
                  <Text>{data.institution}</Text>
                </VStack>
              </HStack>
            </VStack>
          </Card.Body>
          <Card.Footer></Card.Footer>
        </Box>
      </Card.Root>
    </Center>
  );
};
export default StudentInfomation;
