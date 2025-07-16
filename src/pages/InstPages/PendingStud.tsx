import {
  Grid,
  GridItem,
  HStack,
  Image,
  VStack,
  Text,
  Box,
  Spinner,
} from "@chakra-ui/react";
import ColorMode from "../../components/ColorMode";
import NavBar from "../../components/NavBar";
import logoWhite from "../../assets/LogoWhite.svg";
import logoBlack from "../../assets/LogoBlack.svg";
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
    <Grid templateAreas={{ base: `"nav" "main"` }}>
      <GridItem area="nav" justifyContent={"space-between"}>
        <HStack justifyContent="space-between" padding={2}>
          <Image src={colorMode === "dark" ? logoWhite : logoBlack} />
          <NavBar
            pages={[
              "Home",
              "Pending Students",
              "Transfer Students",
              "Add Certificate",
            ]}
            type="Institution"
          ></NavBar>
          <ColorMode />
        </HStack>
      </GridItem>
      <GridItem area="main" padding={2}>
        <center>
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
                  pendings.map((pending, index) => (
                    <Pending
                      key={index}
                      data={pending}
                      type="pending"
                    ></Pending>
                  ))
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
                  transfer.map((transfer, index) => (
                    <Pending
                      key={index}
                      data={transfer}
                      type="transfer"
                    ></Pending>
                  ))
                )}
              </VStack>
            </Box>
          </HStack>
        </center>
      </GridItem>
    </Grid>
  );
};

export default PendingStud;
