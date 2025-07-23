import { Grid, GridItem, HStack, Image } from "@chakra-ui/react";
import ColorMode from "../components/ColorMode";
import NavBar from "../components/NavBar";
import logoWhite from "../assets/LogoWhite.svg";
import logoBlack from "../assets/LogoBlack.svg";
import { useColorMode } from "../components/ui/color-mode";
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";

const InstLayout = () => {
  const colorMode = useColorMode().colorMode;
  const type = sessionStorage.getItem("type");
  const navigate = useNavigate();

  useEffect(() => {
    if (type !== "institute") {
      navigate("/", { replace: true });
    }
  }, [type, navigate]);

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
          <Outlet></Outlet>
        </center>
      </GridItem>
    </Grid>
  );
};

export default InstLayout;
