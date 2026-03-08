import UploadCertificate from "../../components/UploadCertificate";
import type { FormEvent } from "react";
import { useState } from "react";
import type { data } from "../../components/UploadCertificate";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";
import { Box, Button, HStack, Separator, Text, VStack } from "@chakra-ui/react";
import { CiTimer } from "react-icons/ci";
import { useColorMode } from "../../components/ui/color-mode";

const AddOfficialCert = () => {
  const { colorMode } = useColorMode();
  const [isBenchmarking, setIsBenchmarking] = useState(false);

  // Get session data for the benchmark
  const instituteAddress = sessionStorage.getItem("account") as string;
  const instituteContractAddress = sessionStorage.getItem("instituteContractAddress") as string;

  const { mutateAsync: addOfficialCert, isPending } = useMutation({
    mutationFn: async (data: any) =>
      axios
        .post("http://localhost:5000/addOfficialCert", {
          name: data.name,
          student_address: data.student_address,
          certificate_type: data.certificate_type,
          institute_address: instituteAddress,
          certificate_hash: data.certificate_hash,
          institute_contract_address: instituteContractAddress,
          startDate: data.startDate,
          endDate: data.endDate,
          description: data.description,
        })
        .then((res) => res.data),
    onSuccess: () => {
      console.log("Official Certificate added successfully");
    },
    onError: () => {
      console.log("Failed to add official certificate");
    },
  });

  const onSubmit = async (data: data, e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await addOfficialCert({
      name: data.studentName,
      student_address: data.studentAddress,
      certificate_type: data.certificateType,
      institute_address: instituteAddress,
      certificate_hash: data.certificateHash,
      startDate: data.startDate,
      endDate: data.endDate,
      description: data.description,
    });
    console.log(result);
  };

  // --- RESEARCH BENCHMARK FUNCTION ---
  const runBenchmark = async () => {
    const ITERATIONS = 50;

    if (!confirm(`Run ${ITERATIONS} Official Certificate transactions? This will stress test the Institute contract.`)) {
      return;
    }

    if (!instituteAddress || !instituteContractAddress) {
      alert("Missing Institute credentials in session. Please log in as an Institute.");
      return;
    }

    setIsBenchmarking(true);

    try {
      console.log("--- Starting Official Cert Benchmark ---");

      // 1. Start Timer
      await axios.post("http://localhost:5000/benchmark/start");

      // 2. Loop 50 Times
      for (let i = 0; i < ITERATIONS; i++) {
        try {
          // Using a dummy student address for stress testing
          // In a real scenario, this would be a valid student address registered in the system
          const dummyStudentAddress = "0xbb23581B48C134F563548E9FB437D10E71b29786"; 
          
          await axios.post("http://localhost:5000/addOfficialCert", {
            name: `Benchmark Student ${i}`,
            student_address: dummyStudentAddress,
            certificate_type: `Stress Test Degree ${i}`,
            institute_address: instituteAddress,
            certificate_hash: `OFFICIAL_HASH_${i}_${Date.now()}`,
            institute_contract_address: instituteContractAddress,
            startDate: "2023-01-01",
            endDate: "2024-01-01",
            description: `Automated official cert issuance #${i}`,
          });

          if (i % 10 === 0) console.log(`Cert Transaction ${i + 1}/${ITERATIONS} completed`);

        } catch (err) {
          console.error(`Transaction ${i} failed`, err);
        }
      }

      // 3. Stop Timer
      await axios.post("http://localhost:5000/benchmark/stop");

      // 4. Get Metrics
      const metricsResponse = await axios.get("http://localhost:5000/benchmark/metrics");
      const m = metricsResponse.data;

      const report = `
      RESEARCH DATA (Official Certs):
      -------------------------------
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
      <UploadCertificate onSubmit={onSubmit} type="normal" isLoading={isPending}></UploadCertificate>

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
                <Text fontWeight="bold" fontSize="lg">Research Benchmark (Institute)</Text>
            </HStack>
            <Separator />
            <Text fontSize="sm" color="gray.500">
                This tool automates 50 "Add Official Certificate" transactions.
                It measures the throughput of the Institute's contract writing capabilities.
            </Text>
            <Button 
                colorPalette="orange" 
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

export default AddOfficialCert;