import {
  Button,
  Drawer,
  Portal,
  CloseButton,
  HStack,
  VStack,
  Tabs,
} from "@chakra-ui/react";
import React from "react";
import type { Skill } from "../pages/StudentPages/AddSkill";
import type { workExp } from "../pages/StudentPages/AddWorkExp";
import type { addCert } from "../pages/StudentPages/AddCert";
import ShowData from "./ShowData";
import { FaTools } from "react-icons/fa";
import { PiCertificateBold } from "react-icons/pi";
import { IoBriefcaseOutline } from "react-icons/io5";
import ShowDataEmp from "./ShowDataEmp";
import type { skillForApplication } from "../pages/StudentPages/Application";
import type { workExpForApplication } from "../pages/StudentPages/Application";
import type { certForApplication } from "../pages/StudentPages/Application";

interface DrawerProps {
  trigger: React.ReactNode;
  skillData: skillForApplication[];
  workExpData: workExpForApplication[];
  certData: certForApplication[];
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
                <Tabs.Root variant="outline" mt={2} defaultValue="Skills">
                  <Tabs.List>
                    <Tabs.Trigger value="Skills">
                      <FaTools />
                      Skills
                    </Tabs.Trigger>
                    <Tabs.Trigger value="Work Experiance">
                      <IoBriefcaseOutline />
                      Work Experiance
                    </Tabs.Trigger>
                    <Tabs.Trigger value="Certificates">
                      <PiCertificateBold />
                      Certificates
                    </Tabs.Trigger>
                  </Tabs.List>
                  <Tabs.Content value="Skills">
                    <VStack>
                      {skillData.map((item, index) => (
                        <ShowDataEmp
                          key={index}
                          type="Skill"
                          data={item}
                        ></ShowDataEmp>
                      ))}
                    </VStack>
                    <VStack>
                      {workExpData.map((item, index) => (
                        <ShowDataEmp
                          key={index}
                          type="Work EXperiance"
                          data={item}
                        ></ShowDataEmp>
                      ))}
                    </VStack>
                  </Tabs.Content>
                  <Tabs.Content value="Work Experiance">
                    <VStack>
                      {workExpData.map((item, index) => (
                        <ShowDataEmp
                          key={index}
                          type="Work EXperiance"
                          data={item}
                        ></ShowDataEmp>
                      ))}
                    </VStack>
                  </Tabs.Content>
                  <Tabs.Content value="Certificates">
                    <VStack>
                      {certData.map((item, index) => (
                        <ShowDataEmp
                          key={index}
                          type="Certificate"
                          data={item}
                        ></ShowDataEmp>
                      ))}
                    </VStack>
                  </Tabs.Content>
                </Tabs.Root>
                <HStack align="start"></HStack>
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
