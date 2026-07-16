import { Grid, GridItem, HStack, Image } from "@chakra-ui/react";
import ColorMode from "../components/ColorMode";
import logoWhite from "../assets/LogoWhite.svg";
import logoBlack from "../assets/LogoBlack.svg";
import { useColorMode } from "../components/ui/color-mode";
import { Outlet } from "react-router-dom";
const TimeLineLayout = () => {
  const colorMode = useColorMode().colorMode;
  return (
    <Grid templateAreas={{ base: `"nav" "main"` }}>
      <GridItem area="nav" justifyContent={"space-between"}>
        <HStack justifyContent="space-between" padding={2}>
          <Image src={colorMode === "dark" ? logoWhite : logoBlack} />
          <ColorMode />
        </HStack>
      </GridItem>
      <GridItem area="main" padding={2}>
        <center>
          <Outlet></Outlet>
        </center>
      </GridItem>
    </Grid>
  );
};

export default TimeLineLayout;
