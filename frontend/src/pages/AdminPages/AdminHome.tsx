import axios from "axios";
import { useEffect, useState } from "react";
import type { data } from "../../components/PendingInst";
import PendingInst from "../../components/PendingInst";
import { useColorMode } from "../../components/ui/color-mode";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Box, Button, HStack, Separator, Text, VStack } from "@chakra-ui/react";
import { CiTimer } from "react-icons/ci";

const AdminHome = () => {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const colorMode = useColorMode().colorMode;
  const [isBenchmarking, setIsBenchmarking] = useState(false);

  const { data: PendingInstitutes } = useQuery({
    queryKey: ["PendingInstitutes"],
    queryFn: () =>
      axios
        .get("http://localhost:5000/listPendingInstitutes")
        .then((res) => res.data),
  });
  console.log("Pending Institutes:", PendingInstitutes?.institute_address);

  const { mutate: acceptMutation } = useMutation({
    mutationFn: (vars: {
      name: string;
      address: string;
      id: string;
      index: number;
    }) => {
      return axios.post("http://localhost:5000/acceptInstitute", vars);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["PendingInstitutes"] });
    },
    onError: (error) => {
      console.error("Error accepting institute:", error);
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  const accept = (name: string, address: string, id: string, index: number) => {
    setIsLoading(true);
    acceptMutation({ name, address, id, index });
  };

  const { mutate: rejectMutation } = useMutation({
    mutationFn: (vars: {
      name: string;
      address: string;
      id: string;
      index: number;
    }) => {
      return axios.post("http://localhost:5000/rejectInstitute", vars);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["PendingInstitutes"] });
    },
    onError: (error) => {
      console.error("Error rejecting institute:", error);
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  const reject = (name: string, address: string, id: string, index: number) => {
    setIsLoading(true);
    rejectMutation({ name, address, id, index });
  };

// --- RESEARCH BENCHMARK LOGIC ---
  const runBenchmark = async (type: "ACCEPT" | "REJECT") => {
    const ITERATIONS = 106;
    
    // 1. Validation
    if (!PendingInstitutes || PendingInstitutes.length === 0) {
      alert("No pending institutes found. Please use the Signup Page Benchmark to populate 'Pending Institutes' first.");
      return;
    }

    if (PendingInstitutes.length < ITERATIONS) {
        if (!confirm(`Warning: Only ${PendingInstitutes.length} pending items found. Benchmark will run fewer than ${ITERATIONS} iterations. Continue?`)) {
            return;
        }
    }

    setIsBenchmarking(true);
    const limit = Math.min(PendingInstitutes.length, ITERATIONS);

    try {
      console.log(`--- Starting ${type} Benchmark (${limit} iterations) ---`);
      
      // 2. Start Timer
      await axios.post("http://localhost:5000/benchmark/start");

      // 3. Loop
      for (let i = 81; i < limit; i++) {
        // We use 'i' to get the DATA from our snapshot...
        const item = PendingInstitutes[i];
        if (item.address.toLowerCase()!== "0x0000000000000000000000000000000000000000") {
           const payload = {
            name: item.name,
            // Ensure we use the correct field name (fallback to address if institute_address is missing)
            address: item.address, 
            id: item.id,
            
            // --- CRITICAL FIX ---
            // We always send index: 0. 
            // Why? When we accept/reject, the contract likely removes the item from the array.
            // The item that was at index 1 shifts down to index 0.
            // So we always process the "Head" of the list.
            index: 0 
        };

        try {
            if (type === "ACCEPT") {
                await axios.post("http://localhost:5000/acceptInstitute", payload);
            } else {
                await axios.post("http://localhost:5000/rejectInstitute", payload);
            }
            if (i % 5 === 0) console.log(`${type} Tx ${i + 1}/${limit} sent`);
        } catch (err) {
            console.error(`${type} failed for snapshot item ${i}`, err);
        }
          
        }
        
       
      }

      // 4. Stop Timer
      await axios.post("http://localhost:5000/benchmark/stop");

      // 5. Get Metrics
      const m = (await axios.get("http://localhost:5000/benchmark/metrics")).data;

      const report = `
      ${type} RESULTS:
      ----------------
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
      alert("Benchmark failed.");
    } finally {
      setIsBenchmarking(false);
      // Refresh list to show they are gone
      queryClient.invalidateQueries({ queryKey: ["PendingInstitutes"] });
    }
  };

  return (
    <>
      <PendingInst
        isLoading={isLoading}
        data={PendingInstitutes}
        accept={accept}
        reject={reject}
      ></PendingInst>

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
                <Text fontWeight="bold" fontSize="lg">Admin Operations Benchmark</Text>
            </HStack>
            <Separator />
            <Text fontSize="sm" color="gray.500">
                Measure the throughput of Approving or Rejecting institutes.
                <br />
                <b>Requirement:</b> You must have at least 25 items in the pending list (Use Signup Benchmark).
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

export default AdminHome;