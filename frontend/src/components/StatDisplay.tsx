import { Stat } from "@chakra-ui/react";
import React from "react";
import { useColorModeValue } from "./ui/color-mode";

interface Props {
  value: number;
  Title: string;
}
import { motion } from "framer-motion";
import { Box } from "@chakra-ui/react";

const MotionBox = motion(Box);

const StatDisplay = ({ value, Title }: Props) => {
  const statBorder = useColorModeValue("teal.300", "teal.500");
  return (
    <MotionBox
      whileHover={{
        y: -3,
        boxShadow: "0 8px 32px 0 rgba(100, 102, 133, 0.15)",
      }}
      transition={{ type: "spring", stiffness: 300 }}
    >
      <Stat.Root
        p={6}
        borderRadius="lg"
        borderWidth="1px"
        borderColor={statBorder}
        shadow="lg"
        textAlign="center"
      >
        <Stat.Label fontSize="lg" fontWeight="semibold">
          {Title}
        </Stat.Label>
        <Stat.ValueText fontSize="3xl" fontWeight="bold">
          {value}
        </Stat.ValueText>
      </Stat.Root>
    </MotionBox>
  );
};

export default StatDisplay;
