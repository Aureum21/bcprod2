import { HStack, VStack, Text, Box, Spinner } from "@chakra-ui/react";
import Pending, { type Data } from "../../components/Pending";
import { useEffect, useState } from "react";
import axios from "axios";
const PendingStud = () => {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        await axios
          .get("http://localhost:5000/listTransferStudents")
          .then((res) => {
            sessionStorage.setItem(
              "transfer",
              JSON.stringify(res.data as Data[])
            );
          });

        await axios
          .get("http://localhost:5000/listPendingStudents")
          .then((res) => {
            sessionStorage.setItem(
              "pending",
              JSON.stringify(res.data as Data[])
            );
          });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <>
      <HStack
        minWidth={"500px"}
        justifyContent={"center"}
        gap={"10px"}
        align={"start"}
      >
        <Box
          shadow="md"
          borderRadius="md"
          padding={2}
          backdropBlur={"10px"}
          minWidth={"592.65px"}
        >
          <VStack>
            <Text fontWeight="bold" padding={2}>
              Registration Pending Students
            </Text>
            {JSON.parse(sessionStorage.getItem("pending") as string).length ===
            0 ? (
              isLoading ? (
                <Spinner />
              ) : (
                <Text>No Pending Students</Text>
              )
            ) : (
              (
                JSON.parse(
                  sessionStorage.getItem("pending") as string
                ) as Data[]
              ).map((pending, index) =>
                pending.address !==
                "0x0000000000000000000000000000000000000000" ? (
                  <Pending key={index} data={pending} type="pending"></Pending>
                ) : (
                  <>
                    <Text>No Pending Students</Text>
                  </>
                )
              )
            )}
          </VStack>
        </Box>
        <Box
          shadow="md"
          borderRadius="md"
          padding={2}
          backdropBlur={"10px"}
          minWidth={"592.65px"}
        >
          <VStack>
            <Text fontWeight="bold" padding={2}>
              Transfer Pending Students
            </Text>
            {JSON.parse(sessionStorage.getItem("transfer") as string).length ===
            0 ? (
              isLoading ? (
                <Spinner />
              ) : (
                <Text>No Transfer Students</Text>
              )
            ) : (
              (
                JSON.parse(
                  sessionStorage.getItem("transfer") as string
                ) as Data[]
              ).map((transfer, index) =>
                transfer.address !==
                "0x0000000000000000000000000000000000000000" ? (
                  <Pending
                    key={index}
                    data={transfer}
                    type="transfer"
                  ></Pending>
                ) : (
                  <>
                    <Text>No Transfer Students</Text>
                  </>
                )
              )
            )}
          </VStack>
        </Box>
      </HStack>
    </>
  );
};

export default PendingStud;
