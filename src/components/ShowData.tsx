import { Box, Card, HStack, Image, VStack, Text } from "@chakra-ui/react";
import user from "../assets/User.jpg";
import type { workExp } from "../pages/StudentPages/AddWorkExp";
export interface data {
  studentName: string;
  studentAddress: string;
  certificateType: string;
  skillName: string;
  experience: string;
  companyName: string;
  instituteAddress: string;
  jobTitle: string;
  startDate: string;
  endDate: string;
  description: string;
  certificateHash: string;
  certificateName: string;
}
interface Props {
  type: "Certificate" | "Work EXperiance" | "Skill";
  data: any;
}


const ShowData = ({ type, data }: Props) => (
  <Box minWidth={"500px"}>
    <Card.Root flexDirection="row" overflow="hidden" maxW="3xl">
      <Box>
        <Card.Body>
          <Card.Title mb="2"></Card.Title>
          <VStack align="start">
            {type === "Skill" && (
              <HStack>
                <Text fontWeight="bold">Name:</Text>
                <Text>{data.studentName}</Text>
              </HStack>
            )}
            <HStack>
              <Text fontWeight="bold">
                {type === "Certificate"
                  ? "Certificate Name:"
                  : type === "Skill"
                  ? "Skill: "
                  : "Role"}
              </Text>
              <Text>
                {type === "Certificate"
                  ? data.certificate_name
                  : type === "Skill"
                  ? data.skillName
                  : data.role}
              </Text>
            </HStack>
            {type === "Skill" && data.length === 0 ? (
              <p>No Data</p>
            ) : (
              data.map((item: any, index: number) => {
                return (
                  <Box key={index} shadow="md" p={2} mb={2} borderRadius="md">
                    <VStack alignItems="left">
                      <HStack>
                        <Text fontWeight="300">Skill Name:</Text>
                        <Text>{item.name}</Text>
                      </HStack>
                      <HStack>
                        <Text fontWeight="300">Experience:</Text>
                        <Text>{item.experiance}</Text>
                      </HStack>
                    </VStack>
                  </Box>
                );
              })
            )}
            {type === "Certificate" && (
              <VStack alignItems={"left"}>
                {type === "Certificate" && (
                  <HStack>
                    <Text fontWeight="bold">Name:</Text>
                    <Text>{data.name}</Text>
                  </HStack>
                )}
                <HStack>
                  <Text fontWeight="bold">Institute Address:</Text>
                  <Text>{data.institute}</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="bold">Verified:</Text>
                  <Text>{data.verified ? "Yes" : "No"}</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="bold">Visible:</Text>
                  <Text>{data.visible ? "Yes" : "No"}</Text>

                </HStack>
              </VStack>
            )}
            {type === "Work EXperiance" && (
              <VStack alignItems={"left"}>
                <HStack>
                  <Text fontWeight="bold">Start Date:</Text>
                  <Text>{data.startdate}</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="bold">End Date:</Text>
                  <Text>{data.enddate}</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="bold">Institute Address:</Text>
                  <Text>{data.institute}</Text>
                </HStack>
              </VStack>
            )}
          </Card.Body>
          <Card.Footer></Card.Footer>
        </Box>
        {type !== "Skill" && (
          <Image objectFit="cover" maxW="200px" src={user} alt="Caffe Latte" />
        )}
      </Card.Root>
    </Box>
  );
};

export default ShowData;
