import StudentInfomation, {
  type StudentInfo,
} from "../../components/StudentInfomation";
import { useEffect, useState } from "react";
import axios from "axios";
import InfoSkeleton from "../../components/InfoSkeleton";
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
  useEffect(() => {
    !JSON.parse(sessionStorage.getItem("studentInfo") as string)
      ? axios
          .get("http://localhost:5000/studentInformation", {
            params: {
              contractAddress: studentContractAddress,
            },
          })
          .then((res) => {
            setStudentInfo(res.data);
            sessionStorage.setItem("studentInfo", JSON.stringify(res.data));
          })
      : null;
  }, []);

  return (
    <>
      {JSON.parse(sessionStorage.getItem("studentInfo") as string) ? (
        <StudentInfomation
          data={
            JSON.parse(
              sessionStorage.getItem("studentInfo") as string
            ) as StudentInfo
          }
        />
      ) : (
        <InfoSkeleton />
      )}
    </>
  );
};

export default StudentHome;
