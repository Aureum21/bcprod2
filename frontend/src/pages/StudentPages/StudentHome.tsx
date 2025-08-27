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
  // const { data } = useQuery({
  //   queryKey: ["studentInfo", studentContractAddress],
  //   queryFn: () =>
  //     axios
  //       .get("http://localhost:5000/studentInformation", {
  //         params: {
  //           contractAddress: studentContractAddress,
  //         },
  //       })
  //       .then((res) => {
  //         sessionStorage.setItem("studentInfo", JSON.stringify(res.data));
  //         return res.data;
  //       }),
  // });
  const ExampleStudentInfo: StudentInfo = {
    student_name: "Student-1",
    email: "H005406@hct.ac.ae",
    id: "1234",
    student_address: "0x0fBDc686b912d7722dc86510934589E0AAf3b55A",
    institutes: [],
    skills: [],
    workexps: [],
    certifications: [],
    official_certifications: [],
  };

  return (
    <>
      {studentContractAddress ? (
        <StudentInfomation data={ExampleStudentInfo as StudentInfo} />
      ) : (
        <InfoSkeleton />
      )}
    </>
  );
};

export default StudentHome;
