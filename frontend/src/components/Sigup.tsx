import {
  Button,
  Card,
  Field,
  Fieldset,
  Input,
  NativeSelect,
  Spinner,
  Box,
  VStack,
  HStack,
  Text,
  Separator,
} from "@chakra-ui/react";
import axios from "axios";
import { useContext, useState } from "react";
import { Web3Context } from "../Web3ContextProvider";
import { useNavigate } from "react-router-dom";
import { CiTimer } from "react-icons/ci";
import { useColorMode } from "../components/ui/color-mode";
import Web3 from "web3";

const Signup = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { connect, check } = useContext(Web3Context);
  const { colorMode } = useColorMode();
  
  const [role, setRole] = useState<string>("Student");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    id: "",
    role: "Student",
  });

  // --- RESEARCH BENCHMARK STATE ---
  const [isBenchmarking, setIsBenchmarking] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    console.log(formData);
  };

  const web3Instance = new Web3(window.ethereum);
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
        data.type !== "student" &&
        data.type !== "employer"
      ) {
        if (formData.role === "Student") {
          setIsLoading(true);
          const result = await axios.post(
            "http://localhost:5000/registerStudent",
            {
              name: formData.name,
              student_address: account,
              email: formData.email,
              id: formData.id,
            }
          );
          setIsLoading(false);
          if (result.status === 200) {
            navigate("/student/home");
          } else if (result.status === 500) {
            navigate("/signup");
          }
        } else if (formData.role === "Institution") {
          setIsLoading(true);
          const result = await axios.post(
            "http://localhost:5000/registerInstituteToPending",
            {
              name: formData.name,
              institute_address: account,
              id: formData.id,
            }
          );
          setIsLoading(false);
          if (result.status === 200) {
            navigate("/waiting-for-verification");
          } else if (result.status === 500) {
            navigate("/signup");
          }
        } else if (formData.role === "Employer") {
          setIsLoading(true);
          const result = await axios.post(
            "http://localhost:5000/registerEmployer",
            {
              name: formData.name,
              employer_address: account,
              email: formData.email,
            }
          );
          setIsLoading(false);
          if (result.status === 200) {
            navigate("/");
          } else if (result.status === 500) {
            navigate("/signup");
          }
        }
      } else {
        console.log("User already exists");
      }
    }
  };


  const runBenchmark = async () => {
    const ITERATIONS = 50; 

    if (!confirm(`Run ${ITERATIONS} Institute Registration transactions?`)) {
      return;
    }

    // Attempt to get account, or use a dummy one if not connected
    let account: string | undefined = "";
    try {
        account = await connect();
    } catch(e) {
        console.log("Auto-connect failed, using dummy address");
        account = "0x0000000000000000000000000000000000000000";
    }

    setIsBenchmarking(true);

    try {
      console.log("--- Starting Institute Registration Benchmark ---");

      // 1. Start Timer
      await axios.post("http://localhost:5000/benchmark/start");

      // 2. Loop 50 Times
      for (let i = 0; i < ITERATIONS; i++) {
        const account = web3Instance.eth.accounts.create();
        console.log("Account:", account.address);
        try {
          // We append a timestamp/index to ID and Name to avoid collision errors in the backend/chain
          await axios.post("http://localhost:5000/registerInstituteToPending", {
            name: `Benchmark Institute ${i}`,
            institute_address: account.address, // Reusing address (latency test) or unique addresses if required logic differs
            id: `INST_ID_${i}_${Date.now()}`,
          });

          if (i % 10 === 0) console.log(`Register Request ${i + 1}/${ITERATIONS} completed`);
        } catch (err) {
          console.error(`Request ${i} failed`, err);
        }
      }

      // 3. Stop Timer
      await axios.post("http://localhost:5000/benchmark/stop");

      // 4. Get Metrics
      const metricsResponse = await axios.get("http://localhost:5000/benchmark/metrics");
      const m = metricsResponse.data;

      const report = `
      RESEARCH DATA (Institute Registration):
      ---------------------------------------
      Total Tx: ${m.totalTransactions}
      Total Time: ${m.totalDurationSec}s
      Throughput (TPS): ${m.throughputTPS}
      Avg Latency: ${m.avgLatencyMs}ms
      P99 Latency: ${m.p99LatencyMs}ms
      `;

      alert(report);
      console.log(m);

    } catch (error) {
      console.error("Benchmark crashed:", error);
      alert("Benchmark failed. Check console.");
    } finally {
      setIsBenchmarking(false);
    }
  };

  return (
    <>
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
                    {["Student", "Institution", "Employer"].map((item) => (
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
                  {role === "Student" ? "Full Name" : "Institute Name"}
                </Field.Label>
                <Input name="name" onChange={(e) => handleChange(e)} />
              </Field.Root>

              <Field.Root
                display={
                  role === "Student" || role === "Employer" ? "block" : "none"
                }
              >
                <Field.Label>Email address</Field.Label>
                <Input
                  name="email"
                  type="email"
                  onChange={(e) => handleChange(e)}
                />
              </Field.Root>

              {(role === "Student" || role === "Institution") && (
                <Field.Root>
                  <Field.Label>User ID</Field.Label>
                  <Input
                    name="id"
                    type="text"
                    onChange={(e) => handleChange(e)}
                  />
                </Field.Root>
              )}
            </Fieldset.Content>

            <Button type="submit" alignSelf="flex-start">
              {isLoading ? <Spinner /> : "Submit"}
            </Button>
          </Fieldset.Root>
        </Card.Body>
        <Card.Footer justifyContent="flex-end"></Card.Footer>
      </Card.Root>
    </form>

    {/* --- Research / Stress Test Section --- */}
    <Box 
        mt={8} 
        mx="auto" 
        maxW="sm"
        p={5} 
        borderWidth="1px" 
        borderRadius="lg" 
        bg={colorMode === "dark" ? "gray.800" : "white"}
        shadow="sm"
    >
        <VStack align="stretch" gap={4}>
            <HStack>
                <CiTimer size={24} />
                <Text fontWeight="bold" fontSize="lg">Registration Benchmark</Text>
            </HStack>
            <Separator />
            <Text fontSize="sm" color="gray.500">
                This tool simulates 50 concurrent "Institute Registration" requests.
            </Text>
            <Button 
                colorPalette="pink" 
                variant="solid" 
                onClick={runBenchmark}
                loading={isBenchmarking}
                loadingText="Running 50 Regs..."
            >
                Start Registration Test
            </Button>
        </VStack>
    </Box>
    </>
  );
};
export default Signup;