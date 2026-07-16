import {
  Box,
  Card,
  HStack,
  Image,
  VStack,
  Text,
  Center,
  Badge,
} from "@chakra-ui/react";
import user from "../assets/User.jpg";
import type { Skill } from "../pages/StudentPages/AddSkill";
import type { workExp } from "../pages/StudentPages/AddWorkExp";
import type { addCert } from "../pages/StudentPages/AddCert";
import type { OfficialCertification } from "../pages/InstPages/PendingStud";
import { FaClipboardList } from "react-icons/fa";
import { LuClipboardList } from "react-icons/lu";
import { motion } from "framer-motion";
import { useColorMode } from "./ui/color-mode";
export interface StudentInfo {
  student_name: string;
  email: string;
  id: string;
  student_address: string;
  institutes: string[];
  skills: Skill[];
  workexps: workExp[];
  certifications: addCert[];
  official_certifications: OfficialCertification[];
}

const StudentInfomation = ({ data }: { data: StudentInfo }) => {
  console.log("data", data);
  const { colorMode } = useColorMode();
  return (
    <Center mt={8}>
      <motion.div
        whileHover={{
          y: -3,
          boxShadow: "0 8px 32px 0 rgba(100, 102, 133, 0.15)",
        }}
        transition={{ type: "spring", stiffness: 300 }}
      >
        <Card.Root
          flexDirection="row"
          overflow="hidden"
          shadow={"lg"}
          border={"1px solid"}
          borderColor={colorMode === "dark" ? "gray.700" : "gray.200"}
        >
          <Image
            objectFit="cover"
            width="280px"
            src={user}
            alt="Student Profile"
            borderRight="1px solid"
            borderColor={colorMode === "dark" ? "gray.700" : "gray.200"}
          />
          <Box>
            <Card.Body px={6} py={4}>
              <Center>
                <Card.Title mb="2">
                  <HStack>
                    <LuClipboardList />
                    Student Information
                  </HStack>
                </Card.Title>
              </Center>
              <VStack align="start">
                <HStack
                  bg={colorMode === "dark" ? "gray.700" : "gray.100"}
                  p={2}
                  borderRadius="md"
                >
                  <Text fontWeight="bold">Name:</Text>
                  <Text>{data?.student_name}</Text>
                </HStack>
                <HStack
                  bg={colorMode === "dark" ? "gray.700" : "gray.100"}
                  p={2}
                  borderRadius="md"
                >
                  <Text fontWeight="bold">Email:</Text>
                  <Text>{data?.email}</Text>
                </HStack>
                <HStack
                  bg={colorMode === "dark" ? "gray.700" : "gray.100"}
                  p={2}
                  borderRadius="md"
                >
                  <Text fontWeight="bold">ID:</Text>
                  <Text>{data?.id}</Text>
                </HStack>
                <VStack
                  alignItems={"left"}
                  bg={colorMode === "dark" ? "gray.700" : "gray.100"}
                  p={2}
                  borderRadius="md"
                >
                  <Text fontWeight="bold">Account Address:</Text>
                  <Text>{data?.student_address}</Text>
                </VStack>
                <VStack
                  alignItems={"left"}
                  width="100%"
                  bg={colorMode === "dark" ? "gray.700" : "gray.100"}
                  p={2}
                  borderRadius="md"
                >
                  <Text fontWeight="bold">Institution:</Text>

                  <Badge
                    width="fit-content"
                    colorPalette={data?.institutes.at(-1) ? "green" : "red"}
                  >
                    {data?.institutes.at(-1) || "Not Registered"}
                  </Badge>
                </VStack>
              </VStack>
            </Card.Body>
            <Card.Footer></Card.Footer>
          </Box>
        </Card.Root>
      </motion.div>
    </Center>
  );
};
export default StudentInfomation;
