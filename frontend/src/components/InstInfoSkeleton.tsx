import {
  Center,
  Card,
  Box,
  VStack,
  HStack,
  Image,
  SkeletonText,
} from "@chakra-ui/react";
import user from "../assets/Institution.jpg";
const InstituteInformationSkeleton = () => {
  return (
    <Center>
      <Card.Root flexDirection="row" overflow="hidden" maxW="3xl" minW="3xl">
        <Image objectFit="cover" maxW="300px" src={user} alt="Caffe Latte" />
        <Box flex="1">
          <Card.Body>
            <Card.Title mb="2"></Card.Title>
            <VStack align="baseline" marginTop="35px" gap={4}>
              <HStack>
                <SkeletonText noOfLines={1} width="60px" />
                <SkeletonText noOfLines={1} width="200px" />
              </HStack>
              <VStack align="start" gap={1}>
                <SkeletonText noOfLines={1} width="80px" />
                <SkeletonText noOfLines={1} width="250px" />
              </VStack>
              <HStack>
                <SkeletonText noOfLines={1} width="110px" />
                <SkeletonText noOfLines={1} width="180px" />
              </HStack>
            </VStack>
          </Card.Body>
          <Card.Footer></Card.Footer>
        </Box>
      </Card.Root>
    </Center>
  );
};

export default InstituteInformationSkeleton;
