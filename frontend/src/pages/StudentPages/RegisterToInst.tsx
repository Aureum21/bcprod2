import { useState } from "react";
import TransferRegister from "../../components/TransferRegister";
import { useColorMode } from "../../components/ui/color-mode";
import { Button, VStack, Text, Box, Separator, HStack } from "@chakra-ui/react";
import { CiTimer } from "react-icons/ci";
import axios from "axios";

const RegisterToInst = () => {
  const colorMode = useColorMode().colorMode;

  const [searchTerm, setSearchTerm] = useState("");
  // Keeping your existing boilerplate code
  const words = ["apple", "banana", "cherry", "date", "grape", "mango"];
  const filteredWords = words.filter((word) =>
    word.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // --- RESEARCH BENCHMARK LOGIC ---
  const [isBenchmarking, setIsBenchmarking] = useState(false);
  const account = sessionStorage.getItem("account");

  const runBenchmark = async () => {
    const ITERATIONS = 50; // As requested

    if (!confirm(`Run ${ITERATIONS} Registration transactions?`)) {
      return;
    }

    setIsBenchmarking(true);

    try {
      console.log("--- Starting Registration Benchmark ---");

      // 1. Fetch the VALID list of institutes from the blockchain/backend
      const instListResponse = await axios.get("http://localhost:5000/getInstList");
      const instList = instListResponse.data;
      
      if (!instList || instList.length === 0) {
        alert("No institutes found. Please register an institute in the system first.");
        setIsBenchmarking(false);
        return;
      }

      console.log(`Loaded ${instList.length} institutes for testing.`);

      // 2. Start Timer
      await axios.post("http://localhost:5000/benchmark/start");

      // 3. Loop 50 Times
      for (let i = 0; i < ITERATIONS; i++) {
        try {
          // CYCLE through the real institute list
          // This ensures we don't just spam one, and we ONLY use names returned by the server.
          const targetInst = instList[i % instList.length];
          
          await axios.post("http://localhost:5000/regStudToInstPending", {
            student_address: account,
            institute_name: "aus", // Strictly from the GET request
          });

          if (i % 10 === 0) console.log(`Registration ${i + 1}/${ITERATIONS} sent to ${targetInst.name}`);

        } catch (err) {
          console.error(`Transaction ${i} failed`, err);
        }
      }

      // 4. Stop Timer
      await axios.post("http://localhost:5000/benchmark/stop");

      // 5. Get Metrics
      const metricsResponse = await axios.get("http://localhost:5000/benchmark/metrics");
      const m = metricsResponse.data;

      const report = `
      RESEARCH DATA (Registration):
      -----------------------------
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
      <TransferRegister type="register"></TransferRegister>

      {/* --- Research / Stress Test Section --- */}
      <Box 
        mt={8} 
        mx="auto" 
        maxW="4xl" 
        p={5} 
        borderWidth="1px" 
        borderRadius="lg" 
        bg={colorMode === "dark" ? "gray.800" : "white"}
        shadow="sm"
      >
        <VStack align="stretch" gap={4}>
            <HStack>
                <CiTimer size={24} />
                <Text fontWeight="bold" fontSize="lg">Research Benchmark</Text>
            </HStack>
            <Separator />
            <Text fontSize="sm" color="gray.500">
                This tool automates 50 "Register to Institute" requests.
                It cycles through the list of existing institutes fetched from the server.
            </Text>
            <Button 
                colorPalette="purple" 
                variant="solid" 
                onClick={runBenchmark}
                loading={isBenchmarking}
                loadingText="Running 50 Tx..."
            >
                Start 50-Iteration Test
            </Button>
        </VStack>
      </Box>
    </>
  );
};

export default RegisterToInst;