import StudentInfomation, {
  type StudentInfo,
} from "../../components/StudentInfomation";
import { useColorMode } from "../../components/ui/color-mode";
import { useEffect, useState } from "react";
import axios from "axios";
import InfoSkeleton from "../../components/InfoSkeleton";
export const pages = [
  "Home",
  "Register Institution",
  "Add Skill",
  "Add Certificate",
  "Add Work Experience",
];

const StudentHome = () => {
  const studentContractAddress = sessionStorage.getItem(
    "studentContractAddress"
  );
  console.log("studentContractAddress from this", studentContractAddress);
  const [data, setData] = useState<StudentInfo | undefined>(undefined);
  useEffect(() => {
    !JSON.parse(sessionStorage.getItem("studentInfo") as string)
      ? axios
          .get("http://localhost:5000/studentInformation", {
            params: {
              contractAddress: studentContractAddress,
            },
          })
          .then((res) => {
            sessionStorage.setItem("studentInfo", JSON.stringify(res.data));
            setData(res.data);
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
