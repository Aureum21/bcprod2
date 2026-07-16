import { Box, Button, HStack, SimpleGrid, Text } from "@chakra-ui/react";
import { useState } from "react";
import type { ApplicantData } from "./PendingEmployees";
import EmployeeInfo from "./EmployeeInfo";
interface Props {
  data: ApplicantData[];
}

const ListOfEmployees = ({ data }: Props) => {
  const [limit, setLimit] = useState(4);
  return (
    <Box shadow="md" p={6} borderRadius="lg" mt={6}>
      <Text bg="gray.50" fontSize="2xl" fontWeight="bold">
        Employees
      </Text>
      <SimpleGrid columns={{ base: 1, md: 3 }} gap="4" mt="5">
        {data?.map((item, index) => {
          if (index < limit) {
            return <EmployeeInfo key={index} data={item} />;
          }
        })}
      </SimpleGrid>
      <Button variant="outline" mt={4} onClick={() => setLimit(data.length)}>
        Load More
      </Button>
    </Box>
  );
};

export default ListOfEmployees;
