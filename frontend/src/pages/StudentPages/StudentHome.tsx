import StudentInfomation, {
  type StudentInfo,
} from "../../components/StudentInfomation";
import { useEffect, useState } from "react";
import axios from "axios";
import InfoSkeleton from "../../components/InfoSkeleton";
import { useQuery } from "@tanstack/react-query";
export const pages = [
  "Home",
  "Register Institution",
  "Add Skill",
  "Add Certificate",
  "Add Work Experience",
  "Application",
];

const StudentHome = () => {
  const studentContractAddress = sessionStorage.getItem(
    "studentContractAddress"
  );
  const [studentInfo, setStudentInfo] = useState<StudentInfo | null>(null);
  console.log("studentContractAddress from this", studentContractAddress);
  const { data, isLoading: studentLoading } = useQuery({
    queryKey: ["studentInfo", studentContractAddress],
    queryFn: () =>
      axios
        .get("http://localhost:5000/studentInformation", {
          params: {
            contractAddress: studentContractAddress,
          },
        })
        .then((res) => {
          sessionStorage.setItem("studentInfo", JSON.stringify(res.data));
          return res.data;
        }),
  });

  return (
    <>
      {!studentLoading ? (
        <StudentInfomation data={data as StudentInfo} />
      ) : (
        <InfoSkeleton />
      )}
    </>
  );
};

export default StudentHome;
