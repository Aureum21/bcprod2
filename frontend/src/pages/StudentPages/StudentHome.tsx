import StudentInfomation, {
  type StudentInfo,
} from "../../components/StudentInfomation";
import { useEffect, useState } from "react";
import axios from "axios";
import InfoSkeleton from "../../components/InfoSkeleton";
import { useQuery } from "@tanstack/react-query";
import { Box, Button, HStack, Separator, Text, VStack } from "@chakra-ui/react"; // Added imports
import { CiTimer } from "react-icons/ci"; // Added Icon
import { useColorMode } from "../../components/ui/color-mode"; // For styling

export const pages = [
  "Home",
  "Register Institution",
  "Add Skill",
  "Add Certificate",
  "Add Work Experience",
  "Application",
];

const StudentHome = () => {
  const { colorMode } = useColorMode();
  const studentContractAddress = sessionStorage.getItem(
    "studentContractAddress"
  );
  const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(null);

  // --- RESEARCH BENCHMARK STATE ---
  const [isBenchmarking, setIsBenchmarking] = useState(false);

  const { data, isLoading: studentLoading } = useQuery({
    queryKey: ["studentInfo", studentContractAddress],
    queryFn: () =>
      axios
        .get("http://localhost:5000/studentInformation", {
          params: {
            contractAddress: studentContractAddress,
          },
        })
        .then((res) => {
          sessionStorage.setItem("studentInfo", JSON.stringify(res.data));
          return res.data;
        }),
  });

  // --- RESEARCH BENCHMARK FUNCTION (READ TEST) ---
  const runReadBenchmark = async () => {
    const ITERATIONS = 50; // Reads are fast, so we can do more

    if (!confirm(`Run ${ITERATIONS} Profile Read requests?`)) {
      return;
    }

    setIsBenchmarking(true);

    try {
      console.log("--- Starting Read Throughput Benchmark ---");

      // 1. Start Timer
      await axios.post("http://localhost:5000/benchmark/start");

      // 2. Loop 50 Times (GET Requests)
      for (let i = 0; i < ITERATIONS; i++) {
        try {
          await axios.get("http://localhost:5000/studentInformation", {
            params: {
              contractAddress: studentContractAddress,
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
      RESEARCH DATA (Profile Reads):
      ------------------------------
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
      alert("Benchmark failed.");
    } finally {
      setIsBenchmarking(false);
    }
  };

  return (
    <>
      {!studentLoading ? (
        <StudentInfomation data={data as StudentInfo} />
      ) : (
        <InfoSkeleton />
      )}

      {/* --- Research / Stress Test Section --- */}
      <Box 
        mt={8} 
        mx="auto" 
        maxW="6xl" // Matches the width of the student info card usually
        p={5} 
        borderWidth="1px" 
        borderRadius="lg" 
        bg={colorMode === "dark" ? "gray.800" : "white"}
        shadow="sm"
      >
        <VStack align="stretch" gap={4}>
            <HStack>
                <CiTimer size={24} />
                <Text fontWeight="bold" fontSize="lg">Read Performance Benchmark</Text>
            </HStack>
            <Separator />
            <Text fontSize="sm" color="gray.500">
                This tool simulates high-traffic load by requesting the student profile 50 times.
                Use this to measure Read Latency vs Write Latency in your paper.
            </Text>
            <Button 
                colorPalette="blue" 
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

export default StudentHome;