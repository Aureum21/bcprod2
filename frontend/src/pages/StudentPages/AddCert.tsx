import { Box, Tabs, Text, Button, VStack } from "@chakra-ui/react"; // Added Button, VStack
import axios from "axios";
import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import ShowData from "../../components/ShowData";
import type { data } from "../../components/UploadCertificate";
import UploadCertificate from "../../components/UploadCertificate";
import { useColorMode } from "../../components/ui/color-mode";
import { PiCertificate } from "react-icons/pi";
import { CiViewList, CiTimer } from "react-icons/ci"; // Added CiTimer
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AlertMessage from "../../components/AlertMessage";

export interface addCert {
  name: string;
  institute: string;
  certificate_name: string;
  cert_hash: string;
  verified: boolean;
  visible: boolean;
}
interface addCertData {
  cert_name: string;
  institute: string;
  cert_hash: string;
}

const AddCert = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  // New state for benchmark loading
  const [isBenchmarking, setIsBenchmarking] = useState(false);

  const colorMode = useColorMode().colorMode;
  const studentContractAddress = sessionStorage.getItem(
    "studentContractAddress"
  ) as string;
  const queryClient = useQueryClient();

  const { mutateAsync: addCert } = useMutation({
    mutationFn: async (data: addCertData) => {
      const result = await axios.post(
        "http://localhost:5000/addUnOfficialCert",
        {
          certificate_name: data.cert_name,
          institute_address: data.institute,
          student_contract_address: studentContractAddress,
          certificate_hash: data.cert_hash,
        }
      );
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["certs"],
      });
      setAlertOpen(true);
    },
  });

  const onSubmit = async (data: data, e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    // Notice: "data.instituteAddress" comes from the form input
    const result = await addCert({
      cert_name: data.certificateName,
      institute: data.instituteAddress,
      cert_hash: data.certificateHash,
    });
    setIsLoading(false);
    console.log(result);
  };

  // --- RESEARCH BENCHMARK FUNCTION (CERTIFICATES) ---
  const runBenchmark = async () => {
    const ITERATIONS = 50;

    if (!confirm(`Are you sure you want to run ${ITERATIONS} Certificate transactions?`)) {
      return;
    }

    setIsBenchmarking(true);

    try {
      console.log("--- Starting Certificate Benchmark ---");

      // 1. Tell Backend to Start Timer
      await axios.post("http://localhost:5000/benchmark/start");

      // 2. Loop 50 Times
      for (let i = 0; i < ITERATIONS; i++) {
        try {
          // We use a dummy institute address for the test
          // If your smart contract validates this, ensure this address is valid or exists in your system
          const dummyInstAddress = "0x0000000000000000000000000000000000000000"; 
          
          await axios.post("http://localhost:5000/addUnOfficialCert", {
            certificate_name: `Benchmark Cert ${i + 1}`,
            institute_address: dummyInstAddress, 
            student_contract_address: studentContractAddress,
            certificate_hash: `HASH_TEST_${i}_${Date.now()}`, // Unique hash
          });

          if (i % 10 === 0) console.log(`Cert Transaction ${i + 1}/${ITERATIONS} completed`);

        } catch (err) {
          console.error(`Transaction ${i} failed`, err);
        }
      }

      // 3. Tell Backend to Stop Timer
      await axios.post("http://localhost:5000/benchmark/stop");

      // 4. Get Data
      const metricsResponse = await axios.get("http://localhost:5000/benchmark/metrics");
      const m = metricsResponse.data;

      const report = `
      RESEARCH DATA (Certificates):
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
      queryClient.invalidateQueries({ queryKey: ["certs"] });
    }
  };
  // ----------------------------------------------------

  const { data: certData } = useQuery({
    queryKey: ["certs"],
    queryFn: () =>
      axios.get<addCert[]>("http://localhost:5000/getUnOfficialCert", {
        params: {
          contractAddress: studentContractAddress,
        },
      }),
  });

  return (
    <>
      <AlertMessage
        isOpen={alertOpen}
        onClose={() => setAlertOpen(false)}
        type="success"
        message="Your Certificate has been added successfully!"
      />
      <Tabs.Root variant="outline" mt={2} defaultValue="Upload Certificate">
        <Tabs.List
          justifyContent="flex-start"
          zIndex={1}
          position="sticky"
          overflowX="revert"
        >
          <Tabs.Trigger value="Upload Certificate">
            <PiCertificate />
            Upload Certificate
          </Tabs.Trigger>
          <Tabs.Trigger value="Show Certificates">
            <CiViewList />
            Show Certificates
          </Tabs.Trigger>
          {/* New Research Tab */}
          <Tabs.Trigger value="Research">
            <CiTimer />
            Research Tools
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="Upload Certificate" overflow="auto">
          <UploadCertificate
            onSubmit={onSubmit}
            type="unOfficial"
            isLoading={isLoading}
          ></UploadCertificate>
        </Tabs.Content>

        <Tabs.Content value="Show Certificates">
          <Box padding={2}>
            <Text fontSize="2xl" fontWeight="bold">
              Certificates
            </Text>

            {certData?.data.map((item, index) => {
              // Added key to map
              return <ShowData key={index} type="Certificate" data={item}></ShowData>;
            })}
          </Box>
        </Tabs.Content>

        {/* New Research Tab Content */}
        <Tabs.Content value="Research">
          <VStack gap={6} mt={10}>
            <Text fontSize="xl" fontWeight="bold">
              Automated Performance Testing (Certificates)
            </Text>
            <Text color="gray.500" maxW="md" textAlign="center">
              Clicking below will execute 50 "Add Certificate" transactions sequentially.
              Open your browser console (F12) to see progress.
            </Text>
            <Button
              colorPalette="red"
              size="xl"
              onClick={runBenchmark}
              loading={isBenchmarking}
              loadingText="Running 50 Tx..."
            >
              Start 50 Iteration Benchmark
            </Button>
          </VStack>
        </Tabs.Content>
      </Tabs.Root>
    </>
  );
};

export default AddCert;