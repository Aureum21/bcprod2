import { SkeletonText, Stat } from "@chakra-ui/react";
import React from "react";
import { useColorModeValue } from "./ui/color-mode";
const StatsSkeleton = () => {
  const statBorder = useColorModeValue("teal.300", "teal.500");
  const list = [1, 2];
  return (
    <>
      {list.map((item) => {
        return (
          <Stat.Root
            p={6}
            borderRadius="lg"
            borderWidth="1px"
            borderColor={statBorder}
            shadow="lg"
            textAlign="center"
          >
            <Stat.Label fontSize="lg" fontWeight="semibold">
              <SkeletonText noOfLines={1} width={180} height={"24px"} />
            </Stat.Label>
            <Stat.ValueText fontSize="3xl" fontWeight="bold">
              <SkeletonText noOfLines={1} width={100} height={"24px"} />
            </Stat.ValueText>
          </Stat.Root>
        );
      })}
    </>
  );
};

export default StatsSkeleton;
