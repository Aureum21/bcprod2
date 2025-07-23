import {
  Button,
  Card,
  Field,
  Fieldset,
  Input,
  NativeSelect,
} from "@chakra-ui/react";
import axios from "axios";
import { useContext, useState } from "react";
import { Web3Context } from "../Web3ContextProvider";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const navigate = useNavigate();
  const { connect, check } = useContext(Web3Context);
  const [role, setRole] = useState<string>("Student");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    id: "",
    role: "Student",
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    console.log(formData);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const account = await connect();

    console.log(account);

    if (account) {
      const data = await check(account);
      console.log("data: ", data);
      if (
        data.type !== "moe" &&
        data.type !== "institute" &&
        data.type !== "student"
      ) {
        if (formData.role === "Student") {
          const result = await axios.post(
            "http://localhost:5000/registerStudent",
            {
              name: formData.name,
              student_address: account,
              email: formData.email,
              id: formData.id,
            }
          );
          if (result.status === 200) {
            navigate("/Student-home");
          } else if (result.status === 500) {
            navigate("/signup");
          }
        } else if (formData.role === "Institution") {
          const result = await axios.post(
            "http://localhost:5000/registerInstituteToPending",
            {
              name: formData.name,
              institute_address: account,
              id: formData.id,
            }
          );
          if (result.status === 200) {
            navigate("/waiting-for-verification");
          } else if (result.status === 500) {
            navigate("/signup");
          }
        }
      } else {
        console.log("User already exists");
      }
    }
  };
  return (
    <form onSubmit={(e) => handleSubmit(e)}>
      <Card.Root maxW="sm">
        <Card.Header>
          <Card.Title>Sign up</Card.Title>
          <Card.Description>
            Fill in the form below to Register
          </Card.Description>
        </Card.Header>
        <Card.Body>
          <Fieldset.Root size="lg" maxW="md">
            <Fieldset.Content>
              <Field.Root>
                <Field.Label>User Type</Field.Label>
                <NativeSelect.Root>
                  <NativeSelect.Field
                    name="Role"
                    onChange={(e) => {
                      setRole(e.target.value);
                      setFormData({ ...formData, role: e.target.value });
                    }}
                  >
                    {["Student", "Institution"].map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                  </NativeSelect.Field>
                  <NativeSelect.Indicator />
                </NativeSelect.Root>
              </Field.Root>

              <Field.Root>
                <Field.Label>
                  {role === "Student" ? "Full Name" : "Institution Name"}
                </Field.Label>
                <Input name="name" onChange={(e) => handleChange(e)} />
              </Field.Root>

              <Field.Root display={role === "Student" ? "block" : "none"}>
                <Field.Label>Email address</Field.Label>
                <Input
                  name="email"
                  type="email"
                  onChange={(e) => handleChange(e)}
                />
              </Field.Root>

              <Field.Root>
                <Field.Label>User ID</Field.Label>
                <Input
                  name="id"
                  type="text"
                  onChange={(e) => handleChange(e)}
                />
              </Field.Root>
            </Fieldset.Content>

            <Button type="submit" alignSelf="flex-start">
              Submit
            </Button>
          </Fieldset.Root>
        </Card.Body>
        <Card.Footer justifyContent="flex-end"></Card.Footer>
      </Card.Root>
    </form>
  );
};
export default Signup;
