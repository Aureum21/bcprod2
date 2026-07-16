import { Box, Tabs, Text, Button, VStack } from "@chakra-ui/react"; // Added Button, VStack
import axios from "axios";
import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import ShowData from "../../components/ShowData";
import { useColorMode } from "../../components/ui/color-mode";
import type { data } from "../../components/UploadCertificate";
import UploadCertificate from "../../components/UploadCertificate";
import { MdWorkOutline } from "react-icons/md";
import { CiViewList, CiTimer } from "react-icons/ci"; // Added CiTimer
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AlertMessage from "../../components/AlertMessage";

export interface workExp {
  role: string;
  institute: string;
  employer: string;
  startdate: string;
  enddate: string;
  description: string;
  verified: boolean;
  visible: boolean;
  cert_hash: string;
}

interface addWorkExpData {
  role: string;
  institute: string;
  employer: string;
  startdate: string;
  enddate: string;
  description: string;
  cert_hash: string;
}

const AddWorkExp = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  // New state for benchmark loading
  const [isBenchmarking, setIsBenchmarking] = useState(false);

  const colorMode = useColorMode().colorMode;
  const studentContractAddress = sessionStorage.getItem(
    "studentContractAddress"
  ) as string;
  const queryClient = useQueryClient();

  const { mutateAsync: addWorkExp } = useMutation({
    mutationFn: async (data: addWorkExpData) => {
      const result = await axios.post("http://localhost:5000/addWorkExp", {
        role: data.role,
        instAddress: data.institute,
        employer: data.employer,
        startDate: data.startdate,
        endDate: data.enddate,
        description: data.description,
        certificate_hash: data.cert_hash,
        student_contract_address: studentContractAddress,
      });
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["workExp"],
      });
      setAlertOpen(true);
    },
  });

  const onSubmit = async (data: data, e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    // Note: data.instituteAddress maps to the "institute" field (University/School)
    // data.companyName maps to the "employer" field (Company Name)
    // data.jobTitle maps to the "role" field (Job Title/Role)
    const result = await addWorkExp({
      role: data.jobTitle,
      institute: data.instituteAddress,
      employer: data.companyName,
      startdate: data.startDate,
      enddate: data.endDate,
      description: data.description,
      cert_hash: data.certificateHash,
    });
    console.log(result);
    setIsLoading(false);
  };

  // --- RESEARCH BENCHMARK FUNCTION (WORK EXPERIENCE) ---
  const runBenchmark = async () => {
    const ITERATIONS = 50;

    if (!confirm(`Are you sure you want to run ${ITERATIONS} Work Exp transactions?`)) {
      return;
    }

    setIsBenchmarking(true);

    try {
      console.log("--- Starting Work Experience Benchmark ---");

      // 1. Tell Backend to Start Timer
      await axios.post("http://localhost:5000/benchmark/start");

      // 2. Loop 50 Times
      for (let i = 0; i < ITERATIONS; i++) {
        try {
          // Dummy data for stress testing
          const dummyInstAddress = "0x0000000000000000000000000000000000000000"; 
          
          await axios.post("http://localhost:5000/addWorkExp", {
            role: `Benchmark Dev ${i + 1}`,
            instAddress: dummyInstAddress,
            employer: `Tech Corp ${i}`,
            startDate: "2023-01-01",
            endDate: "2024-01-01",
            description: `Automated load test entry #${i}`,
            certificate_hash: `WORK_HASH_${i}_${Date.now()}`,
            student_contract_address: studentContractAddress,
          });

          if (i % 10 === 0) console.log(`WorkExp Transaction ${i + 1}/${ITERATIONS} completed`);

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
      RESEARCH DATA (Work Exp):
      -------------------------
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
      queryClient.invalidateQueries({ queryKey: ["workExp"] });
    }
  };
  // ----------------------------------------------------

  const { data: workExpData } = useQuery({
    queryKey: ["workExp"],
    queryFn: () =>
      axios.get<workExp[]>("http://localhost:5000/getWorkExp", {
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
        message="Your Work Experience has been added successfully!"
      />
      <Tabs.Root variant="outline" mt={2} defaultValue="Upload Work Experience">
        <Tabs.List
          justifyContent="flex-start"
          zIndex={1}
          position="sticky"
          overflowX="revert"
        >
          <Tabs.Trigger value="Upload Work Experience">
            <MdWorkOutline />
            Upload Work Experience
          </Tabs.Trigger>
          <Tabs.Trigger value="Show Work Experience">
            <CiViewList />
            Show Work Experience
          </Tabs.Trigger>
          {/* New Research Tab */}
          <Tabs.Trigger value="Research">
            <CiTimer />
            Research Tools
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="Upload Work Experience" overflow="auto">
          <UploadCertificate
            onSubmit={onSubmit}
            isLoading={isLoading}
            type="workExp"
          ></UploadCertificate>
        </Tabs.Content>

        <Tabs.Content value="Show Work Experience">
          <Box padding={2}>
            <Text fontSize="2xl" fontWeight="bold">
              Work Experience
            </Text>

            {workExpData?.data.map((item, index) => {
              return <ShowData key={index} type="Work EXperiance" data={item}></ShowData>;
            })}
          </Box>
        </Tabs.Content>

        {/* New Research Tab Content */}
        <Tabs.Content value="Research">
          <VStack gap={6} mt={10}>
            <Text fontSize="xl" fontWeight="bold">
              Automated Performance Testing (Work Exp)
            </Text>
            <Text color="gray.500" maxW="md" textAlign="center">
              Clicking below will execute 50 "Add Work Experience" transactions sequentially.
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

export default AddWorkExp;