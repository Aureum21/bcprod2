import {
  Box,
  Card,
  HStack,
  VStack,
  Text,
  Checkbox,
  Badge,
} from "@chakra-ui/react";
import { CiBookmarkCheck } from "react-icons/ci";

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
  handleCheckboxChange: (e: any, data: any, type: string) => void;
  checked: boolean;
}

const ShowDataApp = ({ type, data, handleCheckboxChange, checked }: Props) => {
  return (
    <Box minWidth={"500px"}>
      <Card.Root
        flexDirection="column"
        overflow="hidden"
        maxW="3xl"
        borderWidth="1px"
        borderRadius="lg"
        shadow="md"
        _hover={{ shadow: "lg" }}
      >
        <Card.Body p={6}>
          <Card.Title mb="4">
            <Text fontSize="xl" fontWeight="bold" color="teal.600">
              {type == "Skill"
                ? data.skill_name
                : type == "Certificate"
                ? data.certificate_name
                : type == "Work EXperiance"
                ? data.role
                : ""}
            </Text>
          </Card.Title>

          {type === "Skill" && (
            <HStack justifyContent="space-between" alignItems="flex-start">
              <VStack align="flex-start" gap={3}>
                <HStack>
                  <Text fontWeight="semibold">Experience:</Text>
                  <Text>{data.experience}</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="semibold">Endorsed:</Text>
                  <Badge colorScheme={data.endorsed ? "green" : "red"}>
                    {data.endorsed ? "Yes" : "No"}
                  </Badge>
                </HStack>

                {data.endorsed && (
                  <>
                    <HStack>
                      <Text fontWeight="semibold">Endorsed By:</Text>
                      <Text>{data.endorsedBy}</Text>
                    </HStack>
                    <HStack>
                      <Text fontWeight="semibold">Review:</Text>
                      <Text>{data.review}</Text>
                    </HStack>
                  </>
                )}
                <HStack>
                  <Text fontWeight="semibold">Visible:</Text>
                  <Badge colorScheme={data.visible ? "green" : "red"}>
                    {data.visible ? "Yes" : "No"}
                  </Badge>
                </HStack>
              </VStack>
              <Checkbox.Root
                size="lg"
                checked={checked}
                onCheckedChange={(e) => handleCheckboxChange(e, data, type)}
              >
                <Checkbox.HiddenInput />
                <Checkbox.Control borderColor="teal.500" />
              </Checkbox.Root>
            </HStack>
          )}

          {type === "Certificate" && (
            <HStack justifyContent="space-between" alignItems="flex-start">
              <VStack align="flex-start" gap={3}>
                <HStack>
                  <Text fontWeight="semibold">Institute Address:</Text>
                  <Text>{data.institute}</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="semibold">Verified:</Text>
                  <Badge colorScheme={data.verified ? "green" : "red"}>
                    {data.verified ? "Yes" : "No"}
                  </Badge>
                </HStack>
                <HStack>
                  <Text fontWeight="semibold">Visible:</Text>
                  <Badge colorScheme={data.visible ? "green" : "red"}>
                    {data.visible ? "Yes" : "No"}
                  </Badge>
                </HStack>
              </VStack>
              <Checkbox.Root
                size="lg"
                checked={checked}
                onCheckedChange={(e) => handleCheckboxChange(e, data, type)}
              >
                <Checkbox.HiddenInput />
                <Checkbox.Control borderColor="teal.500" />
              </Checkbox.Root>
            </HStack>
          )}

          {type === "Work EXperiance" && (
            <HStack justifyContent="space-between" alignItems="flex-start">
              <VStack align="flex-start" gap={3}>
                <HStack>
                  <Text fontWeight="semibold">Start Date:</Text>
                  <Text>{data.startdate}</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="semibold">End Date:</Text>
                  <Text>{data.enddate}</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="semibold">Institute Address:</Text>
                  <Text>{data.institute}</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="semibold">Employer:</Text>
                  <Text>{data.employer}</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="semibold">Verified:</Text>
                  <Badge colorScheme={data.verified ? "green" : "red"}>
                    {data.verified ? "Yes" : "No"}
                  </Badge>
                </HStack>
                <HStack>
                  <Text fontWeight="semibold">Visible:</Text>
                  <Badge colorScheme={data.visible ? "green" : "red"}>
                    {data.visible ? "Yes" : "No"}
                  </Badge>
                </HStack>
                <HStack>
                  <Text fontWeight="semibold">Description:</Text>
                  <Text>{data.description}</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="semibold">Certificate Hash:</Text>
                  <Text>{data.cert_hash}</Text>
                </HStack>
              </VStack>
              <Checkbox.Root
                size="lg"
                checked={checked}
                onCheckedChange={(e) => handleCheckboxChange(e, data, type)}
              >
                <Checkbox.HiddenInput />
                <Checkbox.Control borderColor="teal.500" />
              </Checkbox.Root>
            </HStack>
          )}
        </Card.Body>

        <Card.Footer bg="gray.50" px={6} py={3}>
          <CiBookmarkCheck />
          <Text fontSize="sm" color="gray.500">
            Secure and Verified
          </Text>
        </Card.Footer>
      </Card.Root>
    </Box>
  );
};

export default ShowDataApp;
