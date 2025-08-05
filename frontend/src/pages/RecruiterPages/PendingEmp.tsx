import { useEffect, useState } from "react";
import type { ApplicantData } from "../../components/PendingEmployees";
import axios from "axios";
import PendingEmployees from "../../components/PendingEmployees";

const PendingEmp = () => {
  const [data, setData] = useState<ApplicantData[]>([]);
  const contractAddress = sessionStorage.getItem("employerContractAddress");
  useEffect(() => {
    axios
      .get("http://localhost:5000/getPendingEmployees", {
        params: {
          contractAddress: contractAddress,
        },
      })
      .then((res) => {
        console.log(res.data);
        setData(res.data);
      });
  }, []);
  const accept = (employeeAddress: string, employerContractAddress: string) => {
    axios
      .post("http://localhost:5000/acceptEmployee", {
        employeeAddress,
        employerContractAddress,
      })
      .then((res) => {
        console.log(res.data);
      });
  };
  const reject = (employeeAddress: string, employerContractAddress: string) => {
    axios
      .post("http://localhost:5000/rejectEmployee", {
        employeeAddress,
        employerContractAddress,
      })
      .then((res) => {
        console.log(res.data);
      });
  };

  return (
    <>
      <PendingEmployees data={data} accept={accept} reject={reject} />
    </>
  );
};

export default PendingEmp;
