import { Button, Drawer, Portal, CloseButton, HStack } from "@chakra-ui/react";
import React from "react";
import type { Skill } from "../pages/StudentPages/AddSkill";
import type { workExp } from "../pages/StudentPages/AddWorkExp";
import type { addCert } from "../pages/StudentPages/AddCert";
import ShowDataApp from "./showdataapp";
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
                <HStack>
                  {skillData.map((item, index) => (
                    <ShowData key={index} type="Skill" data={item}></ShowData>
                  ))}
                  {workExpData.map((item, index) => (
                    <ShowData
                      key={index}
                      type="Work EXperiance"
                      data={item}
                    ></ShowData>
                  ))}
                  {certData.map((item, index) => (
                    <ShowData
                      key={index}
                      type="Certificate"
                      data={item}
                    ></ShowData>
                  ))}
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
