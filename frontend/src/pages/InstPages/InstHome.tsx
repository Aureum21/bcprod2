import InstituteInformation, {
  type InstituteInfo,
} from "../../components/InstituteInformation";
import { useEffect, useState } from "react";
import axios from "axios";
import InstInfoSkeleton from "../../components/InstInfoSkeleton";
import { useQuery } from "@tanstack/react-query";
import { Box, Button, HStack, Separator, Text, VStack } from "@chakra-ui/react"; // Added imports
import { CiTimer } from "react-icons/ci"; // Added Icon
import { useColorMode } from "../../components/ui/color-mode"; // For styling

const InstHome = () => {
  const { colorMode } = useColorMode();
  const instituteContractAddress = sessionStorage.getItem(
    "instituteContractAddress"
  );
  
  // --- RESEARCH BENCHMARK STATE ---
  const [isBenchmarking, setIsBenchmarking] = useState(false);

  const { data, isLoading: instLoading } = useQuery({
    queryKey: ["instituteInfo", instituteContractAddress],
    queryFn: () =>
      axios
        .get("http://localhost:5000/getInstituteInfo", {
          params: {
            contractAddress: instituteContractAddress,
          },
        })
        .then((res) => {
          sessionStorage.setItem("instituteInfo", JSON.stringify(res.data));
          return res.data;
        }),
  });

  // --- RESEARCH BENCHMARK FUNCTION (READ TEST) ---
  const runReadBenchmark = async () => {
    const ITERATIONS = 50; // Standard read test count

    if (!confirm(`Run ${ITERATIONS} Institute Profile Read requests?`)) {
      return;
    }

    if (!instituteContractAddress) {
      alert("Institute Contract Address not found in session.");
      return;
    }

    setIsBenchmarking(true);

    try {
      console.log("--- Starting Institute Read Throughput Benchmark ---");

      // 1. Start Timer
      await axios.post("http://localhost:5000/benchmark/start");

      // 2. Loop 50 Times (GET Requests)
      for (let i = 0; i < ITERATIONS; i++) {
        try {
          await axios.get("http://localhost:5000/getInstituteInfo", {
            params: {
              contractAddress: instituteContractAddress,
            },
          });
          
          if (i % 20 === 0) console.log(`Read Request ${i + 1}/${ITERATIONS} completed`);
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
      RESEARCH DATA (Institute Profile Reads):
      ----------------------------------------
      Total Requests: ${m.totalTransactions}
      Total Time: ${m.totalDurationSec}s
      Read Throughput (RPS): ${m.throughputTPS}
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
      {!instLoading ? (
        <InstituteInformation data={data as InstituteInfo} />
      ) : (
        <InstInfoSkeleton />
      )}

      {/* --- Research / Stress Test Section --- */}
      <Box 
        mt={8} 
        mx="auto" 
        maxW="6xl" 
        p={5} 
        borderWidth="1px" 
        borderRadius="lg" 
        bg={colorMode === "dark" ? "gray.800" : "white"}
        shadow="sm"
      >
        <VStack align="stretch" gap={4}>
            <HStack>
                <CiTimer size={24} />
                <Text fontWeight="bold" fontSize="lg">Read Performance Benchmark (Institute)</Text>
            </HStack>
            <Separator />
            <Text fontSize="sm" color="gray.500">
                This tool simulates high-traffic load by requesting the institute profile 50 times.
                Use this to compare Read vs Write performance for your paper.
            </Text>
            <Button 
                colorPalette="cyan" 
                variant="solid" 
                onClick={runReadBenchmark}
                loading={isBenchmarking}
                loadingText="Fetching 50 times..."
            >
                Start Read Throughput Test
            </Button>
        </VStack>
      </Box>
    </>
  );
};

export default InstHome;