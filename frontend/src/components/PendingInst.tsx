import { Card, VStack, Text, HStack, Button, Spinner } from "@chakra-ui/react";

export interface data {
  name: string;
  address: string;
  id: string;
  index: number;
}

interface PendingProps {
  data: data[];
  accept: (name: string, address: string, id: string, index: number) => void;
  reject: (name: string, address: string, id: string, index: number) => void;
  isLoading: boolean;
}

const PendingInst = ({ data, accept, reject, isLoading }: PendingProps) => {
  return (
    <Card.Root>
      <Card.Header>
        <Text fontSize="2xl" fontWeight="bold">
          Pending Institutes
        </Text>
      </Card.Header>

      <Card.Body>
        {isLoading ? <Spinner alignItems="right" mb={5} /> : <></>}
        {data?.map((item, index) =>
          item.address !== "0x0000000000000000000000000000000000000000" ? (
            <HStack
              key={index}
              padding={3}
              boxShadow="md"
              mb={2}
              justifyContent="space-between"
            >
              <VStack alignItems="start">
                <HStack>
                  <Text fontWeight="bold">Name:</Text>
                  <Text>{item.name}</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="bold">Id:</Text>
                  <Text>{item.id}</Text>
                </HStack>
                <HStack>
                  <Text fontWeight="bold">Address:</Text>
                  <Text>{item.address}</Text>
                </HStack>
              </VStack>
              <HStack>
                <Button
                  key={index}
                  onClick={() => {
                    accept(item.name, item.address, item.id, index);
                  }}
                  size="sm"
                  variant="outline"
                  colorPalette="green"
                >
                  Accept
                </Button>
                <Button
                  key={index}
                  onClick={() => {
                    reject(item.name, item.address, item.id, index);
                  }}
                  size="sm"
                  variant="outline"
                  colorPalette="red"
                >
                  Reject
                </Button>
              </HStack>
            </HStack>
          ) : (
            <></>
          )
        )}
      </Card.Body>
    </Card.Root>
  );
};

export default PendingInst;
