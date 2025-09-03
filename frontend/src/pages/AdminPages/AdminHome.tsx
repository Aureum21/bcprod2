import axios from "axios";
import { useEffect, useState } from "react";
import type { data } from "../../components/PendingInst";
import PendingInst from "../../components/PendingInst";
import { useColorMode } from "../../components/ui/color-mode";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
const AdminHome = () => {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const colorMode = useColorMode().colorMode;
  const [pending, setPending] = useState<data[]>([]);
  const { data: PendingInstitutes } = useQuery({
    queryKey: ["PendingInstitutes"],
    queryFn: () =>
      axios
        .get("http://localhost:5000/listPendingInstitutes")
        .then((res) => res.data),
  });

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
      // Refetch institutes after accepting one
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
    acceptMutation({
      name,
      address,
      id,
      index,
    });
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
      // Refetch institutes after accepting one
      queryClient.invalidateQueries({ queryKey: ["PendingInstitutes"] });
    },
    onError: (error) => {
      console.error("Error accepting institute:", error);
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  const reject = (name: string, address: string, id: string, index: number) => {
    setIsLoading(true);
    rejectMutation({
      name,
      address,
      id,
      index,
    });
  };
  return (
    <PendingInst
      isLoading={isLoading}
      data={PendingInstitutes}
      accept={accept}
      reject={reject}
    ></PendingInst>
  );
};

export default AdminHome;
