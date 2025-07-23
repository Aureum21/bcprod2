import { useState } from "react";
import TransferRegister from "../../components/TransferRegister";
import { useColorMode } from "../../components/ui/color-mode";

const RegisterToInst = () => {
  const colorMode = useColorMode().colorMode;

  const [searchTerm, setSearchTerm] = useState("");
  const words = ["apple", "banana", "cherry", "date", "grape", "mango"];

  const filteredWords = words.filter((word) =>
    word.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <>
      <TransferRegister type="register"></TransferRegister>
    </>
  );
};

export default RegisterToInst;
