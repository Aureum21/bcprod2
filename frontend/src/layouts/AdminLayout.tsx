import { Grid, GridItem, HStack, Image } from "@chakra-ui/react";
import { useEffect } from "react";
import ColorMode from "../components/ColorMode";
import logoWhite from "../assets/LogoWhite.svg";
import logoBlack from "../assets/LogoBlack.svg";
import { useColorMode } from "../components/ui/color-mode";
import { Outlet, useNavigate } from "react-router-dom";

const AdminLayout = () => {
  const colorMode = useColorMode().colorMode;
  const type = sessionStorage.getItem("type");
  const navigate = useNavigate();

  useEffect(() => {
    if (type !== "moe") {
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

export default AdminLayout;
