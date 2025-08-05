import {
  Center,
  Card,
  Box,
  VStack,
  HStack,
  Image,
  Text,
} from "@chakra-ui/react";
import React from "react";
import type { data } from "react-router-dom";
import user from "../assets/User.jpg";
interface EmployerInfo {
  employer_address: string;
  employer_name: string;
  email: string;
}

const EmployerInformation = ({ data }: { data: EmployerInfo }) => {
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
                <Text>{data?.employer_name}</Text>
              </HStack>
              <VStack align={"start"}>
                <Text fontWeight="bold">Address:</Text>
                <Text>{data?.employer_address}</Text>
              </VStack>
              <HStack>
                <Text fontWeight="bold">Email:</Text>
                <Text>{data?.email}</Text>
              </HStack>
            </VStack>
          </Card.Body>
          <Card.Footer></Card.Footer>
        </Box>
      </Card.Root>
    </Center>
  );
};

export default EmployerInformation;
