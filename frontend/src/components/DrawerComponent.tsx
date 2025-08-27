import {
  Button,
  Drawer,
  Portal,
  CloseButton,
  HStack,
  VStack,
} from "@chakra-ui/react";
import React from "react";
import type { Skill } from "../pages/StudentPages/AddSkill";
import type { workExp } from "../pages/StudentPages/AddWorkExp";
import type { addCert } from "../pages/StudentPages/AddCert";
import ShowData from "./ShowData";

interface DrawerProps {
  trigger: React.ReactNode;
  skillData: Skill[];
  workExpData: workExp[];
  certData: addCert[];
}
const DrawerComponent = ({
  trigger,
  skillData,
  workExpData,
  certData,
}: DrawerProps) => {
  const size = "full";
  return (
    <>
      <Drawer.Root key={size} size={size}>
        <Drawer.Trigger asChild>{trigger}</Drawer.Trigger>
        <Portal>
          <Drawer.Backdrop />
          <Drawer.Positioner>
            <Drawer.Content>
              <Drawer.Header>
                <Drawer.Title>Drawer Title</Drawer.Title>
              </Drawer.Header>
              <Drawer.Body>
                <HStack align="start">
                  <VStack>
                    {skillData.map((item, index) => (
                      <ShowData key={index} type="Skill" data={item}></ShowData>
                    ))}
                  </VStack>
                  <VStack>
                    {workExpData.map((item, index) => (
                      <ShowData
                        key={index}
                        type="Work EXperiance"
                        data={item}
                      ></ShowData>
                    ))}
                  </VStack>
                  <VStack>
                    {certData.map((item, index) => (
                      <ShowData
                        key={index}
                        type="Certificate"
                        data={item}
                      ></ShowData>
                    ))}
                  </VStack>
                </HStack>
              </Drawer.Body>
              <Drawer.Footer>
                <Drawer.CloseTrigger asChild>
                  <CloseButton size="sm" />
                </Drawer.CloseTrigger>
              </Drawer.Footer>
            </Drawer.Content>
          </Drawer.Positioner>
        </Portal>
      </Drawer.Root>
    </>
  );
};

export default DrawerComponent;
