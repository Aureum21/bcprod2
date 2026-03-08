import { Button, Card, Image, Box, VStack, HStack, Text, Separator } from "@chakra-ui/react";
import { useContext, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Web3Context } from "../Web3ContextProvider";
import { useNavigate } from "react-router-dom";
import logoBlack from "../assets/Student Data Management(black).svg";
import logoWhite from "../assets/Student Data Management(white).svg";
import { useColorMode } from "../components/ui/color-mode";
import axios from "axios";
import { CiTimer } from "react-icons/ci";

const Choose = () => {
  const navigate = useNavigate();
  const { setTrigger, connect, check } = useContext(Web3Context);
  const theme = useColorMode().colorMode;

  const handleLogin = async () => {
    const connecdAccount = await connect();
    setTrigger((prev) => !prev);
    console.log(connecdAccount);

    if (connecdAccount) {
      console.log("Connected");
      const data = await check(connecdAccount);
      console.log("data: ", data);

      if (data.type === "moe") navigate("/admin");
      else if (data.type === "institute") navigate("/institution/home");
      else if (data.type === "student") navigate("/student/home");
      else if (data.type === "employer") navigate("/employer/home");
      else navigate("/signup");
    }
  };

  // --- RESEARCH BENCHMARK STATE ---
  const [isBenchmarking, setIsBenchmarking] = useState(false);

  // --- RESEARCH BENCHMARK FUNCTION ---
  const runBenchmark = async () => {
    const ITERATIONS = 50; 
    // Using the known student address from your previous Transfer test to ensure a valid hit
    const TEST_ACCOUNT = "0xbb23581B48C134F563548E9FB437D10E71b29786";

    if (!confirm(`Run ${ITERATIONS} "Check Account" queries on the Public Network?`)) {
      return;
    }

    setIsBenchmarking(true);

    try {
      console.log("--- Starting Login/Check Benchmark ---");

      // 1. Start Timer
      await axios.post("http://localhost:5000/benchmark/start");

      // 2. Loop 50 Times
      for (let i = 0; i < ITERATIONS; i++) {
        try {
          // We call the backend directly to avoid the 'navigate' side-effect of the context check() function
          await axios.get("http://localhost:5000/checkAccount", {
            params: { account: TEST_ACCOUNT },
          });

          if (i % 10 === 0) console.log(`Check Request ${i + 1}/${ITERATIONS} completed`);
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
      RESEARCH DATA (Account Verification):
      -------------------------------------
      Total Checks: ${m.totalTransactions}
      Total Time: ${m.totalDurationSec}s
      Throughput (RPS): ${m.throughputTPS}
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
    <center>
      <Card.Root width="500px" padding={2}>
        <Card.Header>
          <Image src={theme === "dark" ? logoWhite : logoBlack} />
        </Card.Header>

        <Card.Body>
          <Card.Description></Card.Description>
        </Card.Body>
        <Card.Footer justifyContent={"center"} spaceX={2}>
          <RouterLink to="/signup">
            <Button variant="outline">SignUp</Button>
          </RouterLink>
          <Button onClick={handleLogin}>Login</Button>
        </Card.Footer>
      </Card.Root>

      {/* --- Research / Stress Test Section --- */}
      <Box 
        mt={8} 
        width="500px"
        p={5} 
        borderWidth="1px" 
        borderRadius="lg" 
        bg={theme === "dark" ? "gray.800" : "white"}
        shadow="sm"
        textAlign="left"
      >
        <VStack align="stretch" gap={4}>
            <HStack>
                <CiTimer size={24} />
                <Text fontWeight="bold" fontSize="lg">Login Latency Benchmark</Text>
            </HStack>
            <Separator />
            <Text fontSize="sm" color="gray.500">
                This tool simulates 50 users logging in simultaneously by verifying the account status of a known student address on the blockchain.
            </Text>
            <Button 
                colorPalette="purple" 
                variant="solid" 
                onClick={runBenchmark}
                loading={isBenchmarking}
                loadingText="Verifying 50 times..."
            >
                Start Login Throughput Test
            </Button>
        </VStack>
      </Box>
    </center>
  );
};
export default Choose;