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
import { useColorMode } from "./ui/color-mode";
import Web3 from "web3";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { connect, check } = useContext(Web3Context);
  const { colorMode } = useColorMode();

  const [role, setRole] = useState<string>("Student");
  const [formData, setFormData] = useState({
    id: "",
    password: "",
    // role: "Student",
  });

  const [isBenchmarking, setIsBenchmarking] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    console.log(formData);
  };

//   const web3Instance = new Web3(window.ethereum);
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

        if (formData.id && formData.password) {
          setIsLoading(true);
          const result = await axios.post(
            "http://localhost:5000/registerStudent",
            {
              name: formData.name,
              student_address: account,
              email: formData.email,
              id: formData.id,
              password: formData.password,
            },
          );
          setIsLoading(false);
          if (result.status === 200) {
            navigate("/student/home");
          } else if (result.status === 500) {
            navigate("/signup");
          }
        } 

  const runBenchmark = async () => {
    const ITERATIONS = 50;

    if (!confirm(`Run ${ITERATIONS} Institute Registration transactions?`)) {
      return;
    }

    setIsBenchmarking(true);

    try {
      console.log("--- Starting Institute Registration Benchmark ---");

      // 1. Start Timer
      await axios.post("http://localhost:5000/benchmark/start");

      // 2. Create an array of promises to run in parallel
      const requests = Array.from({ length: ITERATIONS }, (_, i) => {
        return axios.post("http://localhost:5000/registerStudent", {
          name: `Benchmark Institute ${i}`,
          email: `benchmark${i}@example.com`, 
          id: `STUD_ID_${i}_${Date.now()}`,
          password: `password${i}`,
        })
        .then((response) => {
          // Log progress every 10 requests
          if ((i + 1) % 10 === 0) {
            console.log(`Register Request ${i + 1}/${ITERATIONS} completed`);
          }
          return response;
        })
        .catch((err) => {
          console.error(`Request ${i} failed`, err);
          return null; // Return null on error so Promise.all doesn't crash entirely
        });
      });

      // Send all 50 requests concurrently
      await Promise.all(requests);

      // 3. Stop Timer
      await axios.post("http://localhost:5000/benchmark/stop");

      // 4. Get Metrics
      const metricsResponse = await axios.get(
        "http://localhost:5000/benchmark/metrics",
      );
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
            <Card.Title>Log in</Card.Title>
            <Card.Description>
              Fill in the form below to Log in
            </Card.Description>
          </Card.Header>
          <Card.Body>
            <Fieldset.Root size="lg" maxW="md">
              <Fieldset.Content>
                {/* <Field.Root>
                  <Field.Label>User Type</Field.Label>
                  <NativeSelect.Root>
                    {/* <NativeSelect.Field */}
                      {/* name="Role" */}
                    {/* //   onChange={(e) => { */}
                        {/* // setRole(e.target.value);
                        // setFormData({ ...formData, role: e.target.value });
                      }}
                    >
                      {["Student", "Institution", "Employer"].map((item) => (
                        <option key={item} value={item}>
                          {item}
                        </option>
                      ))} */}
                    {/* </NativeSelect.Field>
                    <NativeSelect.Indicator />
                  </NativeSelect.Root>
                </Field.Root> */} 

                <Field.Root>
                  <Field.Label>User ID</Field.Label>
                  <Input
                    name="id"
                    type="text"
                    onChange={(e) => handleChange(e)}
                  />
                </Field.Root>

                <Field.Root>
                    <Field.Label>Password</Field.Label>
                    <Input
                        name="password"
                        type="password"
                        onChange={(e) => handleChange(e)}
                    />
                </Field.Root>
                
              </Fieldset.Content>

              <Button type="submit" alignSelf="flex-start">
                {isLoading ? <Spinner /> : "Login"}
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
            <Text fontWeight="bold" fontSize="lg">
              Registration Benchmark
            </Text>
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
export default Login;
