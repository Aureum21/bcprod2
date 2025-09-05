import { Alert, CloseButton } from "@chakra-ui/react";
import React from "react";
interface Props {
  isOpen: boolean;
  onClose: () => void;
  type: "success" | "error";
  message: string;
}

const AlertMessage = ({ isOpen, onClose, type, message }: Props) => {
  return isOpen ? (
    <Alert.Root status={type} justifyContent="space-between">
      <Alert.Title>{message}</Alert.Title>
      <CloseButton
        variant="outline"
        asChild
        size="2xs"
        onClick={onClose}
      ></CloseButton>
    </Alert.Root>
  ) : null;
};

export default AlertMessage;
