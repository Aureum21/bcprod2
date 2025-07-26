import {
  Box,
  Button,
  Card,
  Field,
  Input,
  List,
  Text,
  VStack,
} from "@chakra-ui/react";
import type { ChangeEvent } from "react";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
interface Props {
  type: "transfer" | "register" | "fetch";
}

const TransferRegister = ({ type }: Props) => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const account = sessionStorage.getItem("account") as string;
  const [formDataPending, setFormDataPending] = useState({
    institute_address: "",
  });
  const [formDataTransfer, setFormDataTransfer] = useState({
    student_address: "",
    new_institute_address: "",
  });
  const [institutes, setInstitutes] = useState<string[]>(() => {
    const stored = sessionStorage.getItem("instituteList");
    try {
      return stored ? JSON.parse(stored) : [];
    } catch (err) {
      console.error("Failed to parse instituteList from sessionStorage", err);
      return [];
    }
  });

  async function handleSubmittoPending(
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> {
    console.log(searchTerm);
    e.preventDefault();
    const result = await axios.post(
      "http://localhost:5000/regStudToInstPending",
      {
        student_address: account,
        institute_name: searchTerm,
      }
    );
    if (result.status === 200) {
      navigate("/waiting-for-verification");
    } else if (result.status === 500) {
      navigate("/Student/register-institution");
    }
  }
  async function handleSubmitTransfer(
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> {
    e.preventDefault();
    const result = await axios.post(
      "http://localhost:5000/regStudToInstTransfer",
      {
        student_address: formDataTransfer.student_address,
        current_institute_address: account,
        new_institute_name: searchTerm,
      }
    );
    if (result.status === 200) {
      navigate("/institution/home");
    } else if (result.status === 500) {
      navigate("/institution/transfer-students");
    }
  }
  function handleChangepending(e: ChangeEvent<HTMLInputElement>): void {
    setFormDataPending({ ...formDataPending, [e.target.name]: e.target.value });
  }
  function handleChangeTransfer(e: ChangeEvent<HTMLInputElement>): void {
    setFormDataTransfer({
      ...formDataTransfer,
      [e.target.name]: e.target.value,
    });
  }

  useEffect(() => {
    const fetchInstitutes = async () => {
      const institutes = await axios.get("http://localhost:5000/getInstList");
      sessionStorage.setItem("instituteList", JSON.stringify(institutes.data));
      setInstitutes(
        JSON.parse(sessionStorage.getItem("instituteList") as string)
      );
    };
    fetchInstitutes();
  }, []);

  const filteredWords = institutes.filter((word) =>
    word.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box width={{ base: "full", md: "700px" }}>
      <form
        onSubmit={(e) => {
          if (type === "register") {
            handleSubmittoPending(e);
          } else if (type === "transfer") {
            handleSubmitTransfer(e);
          }
        }}
      >
        <Card.Root>
          <Card.Header>
            <Card.Title>
              {type == "register"
                ? "Register With Institution"
                : type === "fetch"
                ? "Fetch Student"
                : "Transfer Student"}
            </Card.Title>
            <Card.Description>
              {type === "register"
                ? "Please Fill the institution Address"
                : "Fill the Address"}
            </Card.Description>
          </Card.Header>
          <Card.Body>
            {type === "transfer" && (
              <Field.Root>
                <Field.Label>Student Address:</Field.Label>
                <Input
                  name="student_address"
                  placeholder="Student Address"
                  value={formDataTransfer.student_address}
                  onChange={handleChangeTransfer}
                />
              </Field.Root>
            )}
            <Field.Root>
              <Field.Label>
                {type === "register"
                  ? "Register at:"
                  : type === "fetch"
                  ? "Fetch from:"
                  : "Transfer to:"}
              </Field.Label>
              {(type === "transfer" || type === "register") && (
                <>
                  <Input
                    placeholder="Type to search..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    mb={4}
                  />
                  <List.Root variant="plain" width="full">
                    <VStack
                      width="full"
                      alignItems="start"
                      overflowY="scroll"
                      height="200px"
                      p={2}
                    >
                      {filteredWords.length > 0 ? (
                        filteredWords.map((word, index) => (
                          <List.Item
                            width="full"
                            key={index}
                            bg="gray.100"
                            p={2}
                            rounded="md"
                            gap={2}
                            onClick={() => setSearchTerm(word)}
                          >
                            {word}
                          </List.Item>
                        ))
                      ) : (
                        <Text color="gray.500">No results found.</Text>
                      )}
                    </VStack>
                  </List.Root>
                </>
              )}

              {type === "fetch" && (
                <Input name="fetch_stud_info" placeholder="Student Address" />
              )}
            </Field.Root>

            {/* New with Search bar */}
          </Card.Body>
          <Card.Footer>
            <Button type="submit">
              {type === "register"
                ? "Register"
                : type === "transfer"
                ? "Transfer"
                : "Fetch"}
            </Button>
          </Card.Footer>
        </Card.Root>
      </form>
    </Box>
  );
};

export default TransferRegister;
