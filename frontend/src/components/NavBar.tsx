import { Flex, Button } from "@chakra-ui/react";
import { Link as RouterLink } from "react-router-dom";

interface Props {
  pages: string[];
  type: "Student" | "Institution";
}

const NavBar = ({ pages, type }: Props) => {
  return (
    <Flex as="nav" p={4} align="center">
      <Flex gap={4}>
        {pages.map((page) => {
          return (
            <RouterLink
              to={
                "/" +
                type.toLowerCase() +
                "-" +
                page.toLowerCase().replace(/\s+/g, "-")
              }
            >
              <Button variant="ghost">{page}</Button>
            </RouterLink>
          );
        })}
      </Flex>
    </Flex>
  );
};

export default NavBar;
