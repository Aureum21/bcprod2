import { Box, Card, HStack, VStack, Text } from "@chakra-ui/react";
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

const ShowData = ({ type, data }: Props) => {
  return (
    <Box minWidth={"500px"}>
      <Card.Root flexDirection="row" overflow="hidden" maxW="3xl">
        <Box>
          <Card.Body>
            <Card.Title mb="2"></Card.Title>

            {type === "Skill" && (
              <VStack alignItems="left">
                <HStack>
                  <Text fontWeight="bold">Skill Name:</Text>
                  <Text>{data.skillName}</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="bold">Experience:</Text>
                  <Text>{data.experience}</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="bold">Endorsed:</Text>
                  <Text>{data.endorsed ? "Yes" : "No"}</Text>
                </HStack>
                {data.endorsed && (
                  <>
                    <HStack>
                      <Text fontWeight="bold">Endorsed By:</Text>
                      <Text>{data.endorsedBy}</Text>
                    </HStack>
                    <HStack>
                      <Text fontWeight="bold">Review:</Text>
                      <Text>{data.review}</Text>
                    </HStack>
                  </>
                )}
                <HStack>
                  <Text fontWeight="bold">Visible:</Text>
                  <Text>{data.visible ? "Yes" : "No"}</Text>
                </HStack>
              </VStack>
            )}
            {type === "Certificate" && (
              <VStack alignItems={"left"}>
                {type === "Certificate" && (
                  <HStack>
                    <Text fontWeight="bold">Certificate Name:</Text>
                    <Text>{data.certificate_name}</Text>
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
                <HStack>
                  <Text fontWeight="bold">Employer:</Text>
                  <Text>{data.employer}</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="bold">Verified:</Text>
                  <Text>{data.verified ? "Yes" : "No"}</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="bold">Visible:</Text>
                  <Text>{data.visible ? "Yes" : "No"}</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="bold">Description:</Text>
                  <Text>{data.description}</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="bold">Certificate Hash:</Text>
                  <Text>{data.cert_hash}</Text>
                </HStack>
              </VStack>
            )}
          </Card.Body>
          <Card.Footer></Card.Footer>
        </Box>
      </Card.Root>
    </Box>
  );
};

export default ShowData;
