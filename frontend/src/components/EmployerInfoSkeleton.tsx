import React from "react";
import { Card, VStack, HStack, SkeletonText } from "@chakra-ui/react";

const EmployerInfoSkeleton = () => {
  const list = [1, 2, 3];
  return (
    <Card.Body>
      <VStack align="start">
        <SkeletonText noOfLines={1} width={300} height={"24px"} />

        {list.map((item) => {
          return (
            <>
              <HStack key={item} gap={3}>
                <SkeletonText noOfLines={1} width={100} height={"24px"} />
                <SkeletonText noOfLines={1} width={300} height={"24px"} />
              </HStack>
            </>
          );
        })}
      </VStack>
    </Card.Body>
  );
};

export default EmployerInfoSkeleton;
