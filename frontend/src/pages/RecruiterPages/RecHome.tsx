import { useEffect, useState } from "react";
import Application from "../StudentPages/Application";
import type { ApplicantData } from "../../components/PendingEmployees";
import axios from "axios";
import PendingEmployees from "../../components/PendingEmployees";

const RecHome = () => {
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
  return (
    <>
      <PendingEmployees data={data} accept={() => {}} reject={() => {}} />
    </>
  );
};

export default RecHome;
