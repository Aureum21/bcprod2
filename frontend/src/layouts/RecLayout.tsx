import { Box, Grid, GridItem, HStack, Image } from "@chakra-ui/react";
import logoWhite from "../assets/LogoWhite.svg";
import logoBlack from "../assets/LogoBlack.svg";
import { Outlet } from "react-router-dom";
import ColorMode from "../components/ColorMode";
import { useColorMode } from "../components/ui/color-mode";
import NavBar from "../components/NavBar";
const RecLayout = () => {
  const pages = ["Home", "Pending Employees"];
  const colorMode = useColorMode().colorMode;
  return (
    <Grid templateAreas={{ base: `"nav" "main"` }}>
      <GridItem
        area="nav"
        justifyContent={"space-between"}
        overflowX={"revert"}
        position="sticky"
        top={0}
        zIndex={1}
        bg={colorMode === "dark" ? "black" : "white"}
      >
        <HStack justifyContent="space-between" padding={2}>
          <Image src={colorMode === "dark" ? logoWhite : logoBlack} />
          <HStack>
            <NavBar pages={pages} type="Employer" />
            <ColorMode />
          </HStack>
        </HStack>
      </GridItem>
      <GridItem area="main" padding={2} overflow={"auto"}>
        <center>
          <Outlet></Outlet>
        </center>
      </GridItem>
    </Grid>
  );
};

export default RecLayout;
