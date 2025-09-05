import { Button, CloseButton, Dialog, Portal, VStack } from "@chakra-ui/react";
import React from "react";
import ShowDataApp from "./ShowDataApp";
import type {
  certForApplication,
  skillForApplication,
  workExpForApplication,
} from "../pages/StudentPages/Application";

interface Props {
  type: "Skill" | "Certificate" | "Work EXperiance";
  trigger: React.ReactNode;
  handleCheckboxChange: (e: any, data: any, type: string) => void;
  data: skillForApplication[] | certForApplication[] | workExpForApplication[];
  handleCancel: () => void;
  selectedData:
    | skillForApplication[]
    | certForApplication[]
    | workExpForApplication[];
}
const AttachFile = ({
  type,
  trigger,
  handleCheckboxChange,
  data,
  handleCancel,
  selectedData,
}: Props) => {
  return (
    <Dialog.Root size="lg" placement="center" motionPreset="slide-in-bottom">
      <Dialog.Trigger asChild>{trigger}</Dialog.Trigger>
      <Portal>
        <Dialog.Backdrop />
        <Dialog.Positioner>
          <Dialog.Content>
            <Dialog.Header>
              <Dialog.Title>Select {type}s</Dialog.Title>
              <Dialog.CloseTrigger asChild>
                <CloseButton size="sm" />
              </Dialog.CloseTrigger>
            </Dialog.Header>
            <Dialog.Body overflow="auto">
              <VStack overflow="auto" maxH="400px">
                {type === "Skill"
                  ? (data as skillForApplication[])?.map((skill) => (
                      <ShowDataApp
                        key={skill?.skill_name}
                        type="Skill"
                        data={skill}
                        handleCheckboxChange={handleCheckboxChange}
                        checked={selectedData?.some(
                          (item: any) => item?.skill_name === skill?.skill_name
                        )}
                      />
                    ))
                  : type === "Certificate"
                  ? (data as certForApplication[])?.map((cert) => (
                      <ShowDataApp
                        key={cert?.certificate_name}
                        type="Certificate"
                        data={cert}
                        handleCheckboxChange={handleCheckboxChange}
                        checked={selectedData?.some(
                          (item: any) =>
                            item?.certificate_name === cert?.certificate_name
                        )}
                      />
                    ))
                  : type === "Work EXperiance"
                  ? (data as workExpForApplication[])?.map((workExp) => (
                      <ShowDataApp
                        key={workExp?.role}
                        type="Work EXperiance"
                        data={workExp}
                        handleCheckboxChange={handleCheckboxChange}
                        checked={selectedData?.some(
                          (item: any) => item?.role === workExp?.role
                        )}
                      />
                    ))
                  : null}
              </VStack>
            </Dialog.Body>
            <Dialog.Footer>
              <Dialog.ActionTrigger asChild>
                <Button onClick={() => handleCancel()}>Close</Button>
              </Dialog.ActionTrigger>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Portal>
    </Dialog.Root>
  );
};

export default AttachFile;
