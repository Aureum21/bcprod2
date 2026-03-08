import { useState } from "react";
import TransferRegister from "../../components/TransferRegister";
import { Box, Button, HStack, Separator, Text, VStack } from "@chakra-ui/react";
import { CiTimer } from "react-icons/ci";
import { useColorMode } from "../../components/ui/color-mode";
import axios from "axios";

const Transfer = () => {
  const { colorMode } = useColorMode();
  
  // --- RESEARCH BENCHMARK STATE ---
  const [isBenchmarking, setIsBenchmarking] = useState(false);
  const account = sessionStorage.getItem("account") as string;

  // --- RESEARCH BENCHMARK FUNCTION ---
  const runBenchmark = async () => {
    const ITERATIONS = 50; // Using 50 iterations for write operations

    if (!confirm(`Run ${ITERATIONS} Transfer transactions with hardcoded values?`)) {
      return;
    }

    if (!account) {
      alert("Institute account not found in session.");
      return;
    }

    setIsBenchmarking(true);

    try {
      console.log("--- Starting Transfer Throughput Benchmark ---");

      // 1. Start Timer
      await axios.post("http://localhost:5000/benchmark/start");

      // 2. Loop 50 Times
      for (let i = 0; i < ITERATIONS; i++) {
        try {
          // Using the specific values requested
          await axios.post("http://localhost:5000/regStudToInstTransfer", {
            student_address: "0xbb23581B48C134F563548E9FB437D10E71b29786",
            current_institute_address: account,
            new_institute_name: "aus", 
          });

          if (i % 10 === 0) console.log(`Transfer Request ${i + 1}/${ITERATIONS} completed`);
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
      RESEARCH DATA (Student Transfer):
      ---------------------------------
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
      <TransferRegister type="transfer"></TransferRegister>

      {/* --- Research / Stress Test Section --- */}
      <Box 
        mt={8} 
        mx="auto" 
        maxW={{ base: "full", md: "700px" }} // Matching the width of TransferRegister
        p={5} 
        borderWidth="1px" 
        borderRadius="lg" 
        bg={colorMode === "dark" ? "gray.800" : "white"}
        shadow="sm"
      >
        <VStack align="stretch" gap={4}>
            <HStack>
                <CiTimer size={24} />
                <Text fontWeight="bold" fontSize="lg">Research Benchmark (Transfer)</Text>
            </HStack>
            <Separator />
            <Text fontSize="sm" color="gray.500">
                This tool automates 50 "Transfer Student" requests using the fixed test values:
                <br/> - Student: 0xbb23...9786
                <br/> - Target Institute: "aus"
            </Text>
            <Button 
                colorPalette="teal" 
                variant="solid" 
                onClick={runBenchmark}
                loading={isBenchmarking}
                loadingText="Running 50 Transfers..."
            >
                Start Transfer Benchmark
            </Button>
        </VStack>
      </Box>
    </>
  );
};

export default Transfer;