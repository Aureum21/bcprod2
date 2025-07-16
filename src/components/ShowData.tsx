import { Box, Card, HStack, Image, VStack, Text } from "@chakra-ui/react";
import user from "../assets/User.jpg";
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
            <Card.Title mb="2">
              {type == "Skill"
                ? "Your Skills"
                : type == "Certificate"
                ? "Your Certificates"
                : "Your Work Experience"}
            </Card.Title>
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
              <VStack>
                <HStack>
                  <Text fontWeight="bold">Certificate Name:</Text>
                  <Text>Programming</Text>
                </HStack>
              </VStack>
            )}
            {type === "Work EXperiance" && (
              <VStack>
                <HStack>
                  <Text fontWeight="bold">Work Experience Name:</Text>
                  <Text>Programming</Text>
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
