import { HStack, VStack, Text, Box, Spinner } from "@chakra-ui/react";
import Pending, { type Data } from "../../components/Pending";
import { useColorMode } from "../../components/ui/color-mode";
import { useEffect, useState } from "react";
import axios from "axios";
const PendingStud = () => {
  const colorMode = useColorMode().colorMode;
  const [pendings, setPendings] = useState<Data[]>([]);
  const [transfer, setTransfer] = useState<Data[]>([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const transferRes = await axios.get(
          "http://localhost:5000/listTransferStudents"
        );
        console.log("transferRes.data: ", transferRes.data);
        console.log(transferRes.data);
        setTransfer(
          Array.isArray(transferRes.data)
            ? transferRes.data
            : [transferRes.data]
        );

        const pendingRes = await axios.get(
          "http://localhost:5000/listPendingStudents"
        );
        console.log(pendingRes.data);
        setPendings(
          Array.isArray(pendingRes.data) ? pendingRes.data : [pendingRes.data]
        );
      } catch (error) {
        console.error("Error fetching data:", error);
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
            {/* there are multiple pending students */}
            {pendings.length === 0 ? (
              <Spinner />
            ) : (
              pendings.map((pending, index) =>
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
            {/* there are multiple transfer students */}
            {transfer.length === 0 ? (
              <Spinner />
            ) : (
              transfer.map((transfer, index) =>
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
