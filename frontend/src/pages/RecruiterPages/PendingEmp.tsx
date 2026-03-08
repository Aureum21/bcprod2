import { useState } from "react";
import type { ApplicantData } from "../../components/PendingEmployees";
import axios from "axios";
import PendingEmployees from "../../components/PendingEmployees";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Box, Button, HStack, Separator, Text, VStack } from "@chakra-ui/react";
import { CiTimer } from "react-icons/ci";
import { useColorMode } from "../../components/ui/color-mode";

const PendingEmp = () => {
  const [isAcceptLoading, setIsAcceptLoading] = useState(false);
  const [isRejectLoading, setIsRejectLoading] = useState(false);
  const [isBenchmarking, setIsBenchmarking] = useState(false);
  const contractAddress = sessionStorage.getItem("employerContractAddress");
  const { colorMode } = useColorMode();
  const queryClient = useQueryClient();

  const { data: pendingEmployees, isLoading: pendingEmployeesLoading } =
    useQuery({
      queryKey: ["pending-employees"],
      queryFn: () =>
        axios
          .get("http://localhost:5000/getPendingEmployees", {
            params: {
              contractAddress: contractAddress,
            },
          })
          .then((res) => res.data),
    });

  const accept = (employeeAddress: string, employerContractAddress: string) => {
    setIsAcceptLoading(true);
    return axios
      .post("http://localhost:5000/acceptEmployee", {
        employeeAddress,
        employerContractAddress,
      })
      .then((res) => {
        console.log(res.data);
        setIsAcceptLoading(false);
        queryClient.invalidateQueries({ queryKey: ["pending-employees"] });
      });
  };

  const reject = (employeeAddress: string, employerContractAddress: string) => {
    setIsRejectLoading(true);
    return axios
      .post("http://localhost:5000/rejectEmployee", {
        employeeAddress,
        employerContractAddress,
      })
      .then((res) => {
        console.log(res.data);
        setIsRejectLoading(false);
        queryClient.invalidateQueries({ queryKey: ["pending-employees"] });
      });
  };

  // --- RESEARCH BENCHMARK LOGIC ---
  const runBenchmark = async (type: "ACCEPT" | "REJECT") => {
    const ITERATIONS = 45;

    if (!pendingEmployees || pendingEmployees.length === 0) {
      alert("No pending employees found. Please apply for jobs first.");
      return;
    }

    if (pendingEmployees.length < ITERATIONS) {
      if (!confirm(`Warning: Only ${pendingEmployees.length} pending items found. Benchmark will run fewer than ${ITERATIONS} iterations. Continue?`)) {
          return;
      }
    }

    setIsBenchmarking(true);
    const limit = Math.min(pendingEmployees.length, ITERATIONS);

    try {
      console.log(`--- Starting ${type} Employee Benchmark (${limit} iterations) ---`);

      // 1. Start Timer
      await axios.post("http://localhost:5000/benchmark/start");

      // 2. Loop
      for (let i = 0; i < limit; i++) {
        // We use the item from the snapshot.
        // If the contract shifts indices, this might need logic adjustment (e.g. always popping index 0),
        // but for throughput testing based on addresses, snapshot iteration is usually fine if addresses are unique.
        const applicant = pendingEmployees[i];
        
        
        try {
          // Note: The UI function 'accept' above expects specific args. 
          // We call the API directly here to await it properly in the loop without triggering UI loading states per item.
          const endpoint = type === "ACCEPT" ? "acceptEmployee" : "rejectEmployee";
          
          await axios.post(`http://localhost:5000/${endpoint}`, {
            employeeAddress: applicant.employee_address, // Ensure this matches your API expectation
            employerContractAddress: contractAddress,
          });

          if (i % 5 === 0) console.log(`${type} Tx ${i + 1}/${limit} sent for ${applicant.student_address}`);
        } catch (err) {
          console.error(`${type} failed for index ${i}`, err);
        }
      }

      // 3. Stop Timer
      await axios.post("http://localhost:5000/benchmark/stop");

      // 4. Get Metrics
      const m = (await axios.get("http://localhost:5000/benchmark/metrics")).data;

      const report = `
      EMPLOYER ${type} RESULTS:
      -------------------------
      Processed: ${m.totalTransactions} / ${limit}
      Total Time: ${m.totalDurationSec}s
      Throughput: ${m.throughputTPS} TPS
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
      queryClient.invalidateQueries({ queryKey: ["pending-employees"] });
    }
  };

  return (
    <>
      <PendingEmployees
        isLoading={pendingEmployeesLoading}
        isAcceptLoading={isAcceptLoading}
        isRejectLoading={isRejectLoading}
        data={pendingEmployees}
        accept={accept}
        reject={reject}
      />

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
        mb={10}
      >
        <VStack align="stretch" gap={4}>
            <HStack>
                <CiTimer size={24} />
                <Text fontWeight="bold" fontSize="lg">Employer Operations Benchmark</Text>
            </HStack>
            <Separator />
            <Text fontSize="sm" color="gray.500">
                Measure the throughput of Hiring (Accept) or Rejecting applicants.
                <br />
                <b>Requirement:</b> You must have at least 25 applicants in the pending list (Use Application Benchmark).
            </Text>
            
            <HStack gap={4}>
                <Button 
                    colorPalette="green" 
                    variant="solid" 
                    flex={1}
                    onClick={() => runBenchmark("ACCEPT")}
                    loading={isBenchmarking}
                    disabled={isBenchmarking}
                >
                    Test Accept (25)
                </Button>

                <Button 
                    colorPalette="red" 
                    variant="solid" 
                    flex={1}
                    onClick={() => runBenchmark("REJECT")}
                    loading={isBenchmarking}
                    disabled={isBenchmarking}
                >
                    Test Reject (25)
                </Button>
            </HStack>
        </VStack>
      </Box>
    </>
  );
};

export default PendingEmp;