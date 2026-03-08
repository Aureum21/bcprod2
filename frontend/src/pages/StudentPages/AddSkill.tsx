import { Box, HStack, Tabs, VStack, Text, Button } from "@chakra-ui/react"; // Added Button
import axios from "axios";
import type { FormEvent } from "react";
import { useEffect, useState } from "react";
import ShowData from "../../components/ShowData";
import { useColorMode } from "../../components/ui/color-mode";
import type { data } from "../../components/UploadCertificate";
import UploadCertificate from "../../components/UploadCertificate";
import { LuFolder } from "react-icons/lu";
import { CiViewList, CiTimer } from "react-icons/ci"; // Added Timer Icon
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import AlertMessage from "../../components/AlertMessage";

export interface Skill {
  name: string;
  experience: string;
  endorsed: boolean;
  endorsedBy: string;
  review: string;
  visible: boolean;
}
interface addSkillData {
  name: string;
  skill_name: string;
  experience: string;
  contractAddress: string;
}

const AddSkill = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  // Separate state for benchmark loading to distinguish from normal uploads
  const [isBenchmarking, setIsBenchmarking] = useState(false); 

  const colorMode = useColorMode().colorMode;
  const queryClient = useQueryClient();
  const studentContractAddress = sessionStorage.getItem(
    "studentContractAddress"
  ) as string;

  const { mutateAsync: addSkill } = useMutation({
    mutationFn: async (data: addSkillData) => {
      const result = await axios.post("http://localhost:5000/addSkill", {
        name: data.name,
        skill_name: data.skill_name,
        experience: data.experience,
        contractAddress: studentContractAddress,
      });
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["skills"],
      });
    },
  });

  const handleUpload = async (data: data, e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    console.log(
      data.studentName,
      data.skillName,
      data.experience,
      studentContractAddress
    );
    const payload = {
      name: data.studentName,
      skill_name: data.skillName,
      experience: data.experience,
      contractAddress: studentContractAddress,
    };
    const result = await addSkill(payload as addSkillData);
    console.log(result);
    setIsLoading(false);
    setAlertOpen(true);
  };

  // --- RESEARCH BENCHMARK FUNCTION ---
  const runBenchmark = async () => {
    const ITERATIONS = 50;
    
    if (!confirm(`Are you sure you want to run ${ITERATIONS} transactions? This might take a while.`)) {
        return;
    }

    setIsBenchmarking(true);

    try {
      console.log("--- Starting Benchmark ---");
      
      // 1. Tell Backend to Start Timer
      await axios.post("http://localhost:5000/benchmark/start");

      // 2. Loop 50 Times
      // We use a sequential loop here to ensure the blockchain doesn't reject transactions due to Nonce issues.
      // If you want higher throughput (but higher risk of errors), you could batch these with Promise.all.
      for (let i = 0; i < ITERATIONS; i++) {
        try {
          // Direct axios call is faster/cleaner for loops than using the React Query mutation
          await axios.post("http://localhost:5000/addSkill", {
            name: "Benchmark Bot",
            skill_name: `Stress Test Skill ${i + 1}`,
            experience: "99 Years",
            contractAddress: studentContractAddress,
          });
          
          // Optional: Log progress every 10 transactions to avoid cluttering console
          if (i % 10 === 0) console.log(`Transaction ${i + 1}/${ITERATIONS} completed`);
          
        } catch (err) {
          console.error(`Transaction ${i} failed`, err);
        }
      }

      // 3. Tell Backend to Stop Timer
      await axios.post("http://localhost:5000/benchmark/stop");

      // 4. Get the Data for your Paper
      const metricsResponse = await axios.get("http://localhost:5000/benchmark/metrics");
      const m = metricsResponse.data;

      const report = `
      RESEARCH DATA COLLECTED:
      ------------------------
      Total Tx: ${m.totalTransactions}
      Total Time: ${m.totalDurationSec}s
      Throughput (TPS): ${m.throughputTPS}
      Avg Latency: ${m.avgLatencyMs}ms
      P99 Latency: ${m.p99LatencyMs}ms
      `;
      
      alert(report);
      console.log(m); // The full array of latencies will be in the console for your graphs

    } catch (error) {
      console.error("Benchmark crashed:", error);
      alert("Benchmark failed. Check console for details.");
    } finally {
      setIsBenchmarking(false);
      // Refresh list to show the 50 new items
      queryClient.invalidateQueries({ queryKey: ["skills"] });
    }
  };
  // -----------------------------------

  const { data: skillsData } = useQuery({
    queryKey: ["skills"],
    queryFn: () =>
      axios.get("http://localhost:5000/listSkills", {
        params: {
          contractAddress: studentContractAddress,
        },
      }),
  });

  return (
    <>
      <Tabs.Root variant="outline" mt={2} defaultValue="Upload Skill">
        <Tabs.List justifyContent="flex-start" position="sticky">
          <Tabs.Trigger value="Upload Skill">
            <LuFolder />
            Upload Skill
          </Tabs.Trigger>
          <Tabs.Trigger value="Show Skills">
            <CiViewList />
            Show Skills
          </Tabs.Trigger>
          {/* New Tab for Research Tools */}
          <Tabs.Trigger value="Research">
            <CiTimer />
            Research Tools
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="Upload Skill">
          <center>
            <AlertMessage
              isOpen={alertOpen}
              onClose={() => setAlertOpen(false)}
              type="success"
              message="Your Skill has been added successfully!"
            />
            <UploadCertificate
              onSubmit={handleUpload}
              isLoading={isLoading}
              type="skill"
            ></UploadCertificate>
          </center>
        </Tabs.Content>

        <Tabs.Content value="Show Skills">
          <Box padding={2}>
            <Text fontSize="2xl" fontWeight="bold">
              Skills
            </Text>
            {skillsData?.data.map((item: Skill, index: number) => {
              return <ShowData key={index} type="Skill" data={item}></ShowData>;
            })}
          </Box>
        </Tabs.Content>

        {/* New Research Tab Content */}
        <Tabs.Content value="Research">
          <VStack gap={6} mt={10}>
            <Text fontSize="xl" fontWeight="bold">
              Automated Performance Testing
            </Text>
            <Text color="gray.500" maxW="md" textAlign="center">
              Clicking below will execute 50 "Add Skill" transactions sequentially. 
              Open your browser console (F12) to see progress.
              Results will be calculated by the backend.
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

export default AddSkill;