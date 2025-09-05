import {
  Box,
  Card,
  HStack,
  VStack,
  Text,
  Badge,
  Button,
} from "@chakra-ui/react";

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
  const handleDownload = (hash: string) => {
    const link = document.createElement("a");
    link.href = `http://localhost:3000/download/${hash}`;
    link.download = "";
    link.click();
  };

  return (
    <Box minWidth={"500px"} py={4}>
      <Card.Root
        overflow="hidden"
        maxW="3xl"
        rounded="xl"
        shadow="md"
        border="1px solid"
        borderColor="gray.200"
        bg="white"
      >
        <Box>
          <Card.Body px={6} py={5}>
            <Card.Title mb="4" fontSize="xl" fontWeight="bold" color="blue.600">
              {type === "Skill"
                ? data.skillName
                : type === "Certificate"
                ? data.certificate_name
                : data.role}
            </Card.Title>

            {/* Skill Section */}
            {type === "Skill" && (
              <>
                <VStack align="start" gap={3}>
                  <HStack>
                    <Text fontWeight="semibold" color="gray.600">
                      Skill Name:
                    </Text>
                    <Badge colorScheme="blue" px={3} py={1} rounded="md">
                      {data.skillName}
                    </Badge>
                  </HStack>
                  <HStack>
                    <Text fontWeight="semibold" color="gray.600">
                      Experience:
                    </Text>
                    <Text>{data.experience}</Text>
                  </HStack>
                  <HStack>
                    <Text fontWeight="semibold" color="gray.600">
                      Endorsed:
                    </Text>
                    <Text>{data.endorsed ? "✅ Yes" : "❌ No"}</Text>
                  </HStack>
                  {data.endorsed && (
                    <>
                      <HStack>
                        <Text fontWeight="semibold" color="gray.600">
                          Endorsed By:
                        </Text>
                        <Text>{data.endorsedBy}</Text>
                      </HStack>
                      <HStack>
                        <Text fontWeight="semibold" color="gray.600">
                          Review:
                        </Text>
                        <Text>{data.review}</Text>
                      </HStack>
                    </>
                  )}
                  <HStack>
                    <Text fontWeight="semibold" color="gray.600">
                      Visible:
                    </Text>
                    <Text>{data.visible ? "Yes" : "No"}</Text>
                  </HStack>
                </VStack>
                {/* <button onClick={handleDownload}>Download</button> */}
              </>
            )}

            {/* Certificate Section */}
            {type === "Certificate" && (
              <>
                <VStack align="start" gap={3}>
                  <HStack>
                    <Text fontWeight="semibold" color="gray.600">
                      Certificate Name:
                    </Text>
                    <Badge colorScheme="purple" px={3} py={1} rounded="md">
                      {data.certificate_name}
                    </Badge>
                  </HStack>
                  <HStack>
                    <Text fontWeight="semibold" color="gray.600">
                      Institute Address:
                    </Text>
                    <Text>{data.institute}</Text>
                  </HStack>
                  <HStack>
                    <Text fontWeight="semibold" color="gray.600">
                      Verified:
                    </Text>
                    <Text>{data.verified ? "✅ Yes" : "❌ No"}</Text>
                  </HStack>
                  <HStack>
                    <Text fontWeight="semibold" color="gray.600">
                      Visible:
                    </Text>
                    <Text>{data.visible ? "Yes" : "No"}</Text>
                  </HStack>
                </VStack>

                <Button
                  colorPalette="blue"
                  onClick={() => handleDownload(data.cert_hash)}
                >
                  Download
                </Button>
              </>
            )}

            {/* Work Experience Section */}
            {type === "Work EXperiance" && (
              <>
                <VStack align="start" gap={3}>
                  <HStack>
                    <Text fontWeight="semibold" color="gray.600">
                      Start Date:
                    </Text>
                    <Text>{data.startdate}</Text>
                  </HStack>
                  <HStack>
                    <Text fontWeight="semibold" color="gray.600">
                      End Date:
                    </Text>
                    <Text>{data.enddate}</Text>
                  </HStack>
                  <HStack>
                    <Text fontWeight="semibold" color="gray.600">
                      Institute Address:
                    </Text>
                    <Text>{data.institute}</Text>
                  </HStack>
                  <HStack>
                    <Text fontWeight="semibold" color="gray.600">
                      Employer:
                    </Text>
                    <Text>{data.employer}</Text>
                  </HStack>
                  <HStack>
                    <Text fontWeight="semibold" color="gray.600">
                      Verified:
                    </Text>
                    <Text>{data.verified ? "✅ Yes" : "❌ No"}</Text>
                  </HStack>
                  <HStack>
                    <Text fontWeight="semibold" color="gray.600">
                      Visible:
                    </Text>
                    <Text>{data.visible ? "Yes" : "No"}</Text>
                  </HStack>
                  <HStack align="start">
                    <Text fontWeight="semibold" color="gray.600">
                      Description:
                    </Text>
                    <Text maxW="md">{data.description}</Text>
                  </HStack>
                  <HStack>
                    <Text fontWeight="semibold" color="gray.600">
                      Certificate Hash:
                    </Text>
                    <Text fontSize="sm" color="gray.500">
                      {data.cert_hash}
                    </Text>
                  </HStack>
                </VStack>
                <Button
                  colorPalette="blue"
                  onClick={() => handleDownload(data.cert_hash)}
                >
                  Download
                </Button>
              </>
            )}
          </Card.Body>

          <Card.Footer
            bg="gray.50"
            px={6}
            py={3}
            borderTop="1px solid"
            borderColor="gray.200"
          >
            <Text fontSize="sm" color="gray.500">
              {type} details • Secure & Verified
            </Text>
          </Card.Footer>
        </Box>
      </Card.Root>
    </Box>
  );
};

export default ShowData;
