import { Button, HStack, Text } from "@chakra-ui/react";
import { useState } from "react";
import type { ApplicantData } from "./PendingEmployees";
import EmployeeInfo from "./employeeInfo";
interface Props {
  data: ApplicantData[];
}

const ListOfEmployees = ({ data }: Props) => {
  const [limit, setLimit] = useState(4);
  return (
    <>
      <Text fontSize="2xl" fontWeight="bold">
        Employees
      </Text>
      <HStack gap="4" mt="5">
        {data?.map((item, index) => {
          if (index < limit) {
            return <EmployeeInfo key={index} data={item} />;
          }
        })}
      </HStack>
      <Button variant="outline" mt={4} onClick={() => setLimit(data.length)}>
        Load More
      </Button>
    </>
  );
};

export default ListOfEmployees;
