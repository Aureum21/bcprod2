import { Tag } from "@chakra-ui/react";
import React from "react";
import type {
  skillForApplication,
  workExpForApplication,
  certForApplication,
} from "../pages/StudentPages/Application";
interface DataTagProps {
  data: skillForApplication | workExpForApplication | certForApplication;
  type: string;

  handleRemoveData: (
    data: skillForApplication | workExpForApplication | certForApplication,
    type: string
  ) => void;
}

const DataTag = ({ data, type, handleRemoveData }: DataTagProps) => {
  return (
    <Tag.Root
      colorPalette="teal"
      borderRadius="full"
      px={4}
      py={2}
      fontWeight="semibold"
      fontSize="md"
      display="flex"
      alignItems="center"
      boxShadow="sm"
      _hover={{ bg: "teal.50", boxShadow: "md" }}
      transition="all 0.15s"
      justifyContent={"space-between"}
    >
      <Tag.Label>
        {type === "Skill"
          ? (data as skillForApplication)?.skill_name
          : type === "Work Experience"
          ? (data as workExpForApplication)?.role
          : (data as certForApplication)?.certificate_name}
      </Tag.Label>
      <Tag.EndElement>
        <Tag.CloseTrigger
          aria-label={`Remove task: ${data}`}
          onClick={() => handleRemoveData(data, type)}
          _hover={{ bg: "red.100" }}
        />
      </Tag.EndElement>
    </Tag.Root>
  );
};

export default DataTag;
