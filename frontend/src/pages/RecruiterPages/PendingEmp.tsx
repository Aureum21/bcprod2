import { useEffect, useState } from "react";
import type { ApplicantData } from "../../components/PendingEmployees";
import axios from "axios";
import PendingEmployees from "../../components/PendingEmployees";
import { useQuery } from "@tanstack/react-query";

const PendingEmp = () => {
  const [isAcceptLoading, setIsAcceptLoading] = useState(false);
  const [isRejectLoading, setIsRejectLoading] = useState(false);
  const contractAddress = sessionStorage.getItem("employerContractAddress");
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
    axios
      .post("http://localhost:5000/acceptEmployee", {
        employeeAddress,
        employerContractAddress,
      })
      .then((res) => {
        console.log(res.data);
        setIsAcceptLoading(false);
      });
  };
  const reject = (employeeAddress: string, employerContractAddress: string) => {
    setIsRejectLoading(true);
    axios
      .post("http://localhost:5000/rejectEmployee", {
        employeeAddress,
        employerContractAddress,
      })
      .then((res) => {
        console.log(res.data);
        setIsRejectLoading(false);
      });
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
    </>
  );
};

export default PendingEmp;
