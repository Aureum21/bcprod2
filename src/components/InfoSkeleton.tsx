import {
  HStack,
  Stack,
  Skeleton,
  SkeletonCircle,
  SkeletonText,
  Box,
  Card,
  Center,
  VStack,
} from "@chakra-ui/react";

const InfoSkeleton = () => {
  const list = [1, 2, 3];
  return (
    <>
      <Center>
        <Card.Root
          flexDirection="row"
          overflow="hidden"
          width="668px"
          height="296x"
        >
          <Skeleton width={200} height="296px" borderRadius="0px" />
          <Box>
            <Card.Body>
              <VStack align="start">
                {list.map((item) => {
                  return (
                    <HStack key={item} gap={3}>
                      <SkeletonText noOfLines={1} width={100} height={"24px"} />
                      <SkeletonText noOfLines={1} width={300} height={"24px"} />
                    </HStack>
                  );
                })}
                <VStack gap={3}>
                  <SkeletonText noOfLines={1} width={100} height={"24px"} />
                  <SkeletonText noOfLines={1} width={400} height={"24px"} />
                </VStack>
                <VStack gap={3}>
                  <SkeletonText noOfLines={1} width={100} height={"24px"} />
                  <SkeletonText noOfLines={1} width={400} height={"24px"} />
                </VStack>
              </VStack>
            </Card.Body>
            <Card.Footer></Card.Footer>
          </Box>
        </Card.Root>
      </Center>
    </>
  );
};

export default InfoSkeleton;
