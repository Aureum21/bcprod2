import { Box, Button, Card, Field, Input } from "@chakra-ui/react";
import type { ChangeEvent } from "react";
import axios from "axios";
import { useContext, useState } from "react";
import { Web3Context } from "../Web3ContextProvider";
import { useNavigate } from "react-router-dom";
interface Props {
  type: "transfer" | "register" | "fetch";
}

const TransferRegister = ({ type }: Props) => {
  const navigate = useNavigate();
  const { account } = useContext(Web3Context);
  const [formDataPending, setFormDataPending] = useState({
    institute_address: "",
  });
  const [formDataTransfer, setFormDataTransfer] = useState({
    student_address: "",
    new_institute_address: "",
  });

  async function handleSubmittoPending(
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> {
    e.preventDefault();
    const result = await axios.post(
      "http://localhost:5000/regStudToInstPending",
      {
        student_address: account,
        institute_address: formDataPending.institute_address,
      }
    );
    if (result.status === 200) {
      navigate("/waiting-for-verification");
    } else if (result.status === 500) {
      navigate("/Student-register-institution");
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
        new_institute_address: formDataTransfer.new_institute_address,
      }
    );
    if (result.status === 200) {
      navigate("/institution-home");
    } else if (result.status === 500) {
      navigate("/institution-transfer-students");
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

  return (
    <Box width={"500px"}>
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
              {type === "transfer" && (
                <Input
                  name="new_institute_address"
                  placeholder="New Institute Address"
                  value={formDataTransfer.new_institute_address}
                  onChange={handleChangeTransfer}
                />
              )}
              {type === "register" && (
                <Input
                  name="institute_address"
                  placeholder="Institute Address"
                  value={formDataPending.institute_address}
                  onChange={handleChangepending}
                />
              )}
              {type === "fetch" && (
                <Input name="fetch_stud_info" placeholder="Student Address" />
              )}
            </Field.Root>
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
