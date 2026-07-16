import { Grid, GridItem, HStack, Image } from "@chakra-ui/react";
import ColorMode from "../components/ColorMode";
import NavBar from "../components/NavBar";
import { pages } from "../pages/StudentPages/StudentHome";
import logoWhite from "../assets/LogoWhite.svg";
import logoBlack from "../assets/LogoBlack.svg";
import { useColorMode } from "../components/ui/color-mode";
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
const StudentLayout = () => {
  const colorMode = useColorMode().colorMode;
  const type = sessionStorage.getItem("type");
  const navigate = useNavigate();

  useEffect(() => {
    if (type !== "student") {
      navigate("/", { replace: true });
    }
  }, [type, navigate]);

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
          <NavBar pages={pages} type="Student"></NavBar>
          <ColorMode />
        </HStack>
      </GridItem>
      <GridItem area="main" padding={2} overflow={"auto"}>
        <center>
          <Outlet />
        </center>
      </GridItem>
    </Grid>
  );
};

export default StudentLayout;
