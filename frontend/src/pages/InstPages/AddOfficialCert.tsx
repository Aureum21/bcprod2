import UploadCertificate from "../../components/UploadCertificate";
import type { FormEvent } from "react";
import type { data } from "../../components/UploadCertificate";
import axios from "axios";

const AddOfficialCert = () => {
  const onSubmit = (data: data, e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = axios.post("http://localhost:5000/addOfficialCert", {
      name: data.studentName,
      student_address: data.studentAddress,
      certificate_type: data.certificateType,
      institute_address: sessionStorage.getItem("account") as string,
      certificate_hash: data.certificateHash,
      institute_contract_address: sessionStorage.getItem(
        "instituteContractAddress"
      ) as string,
      startDate: data.startDate,
      endDate: data.endDate,
      description: data.description,
    });
    console.log(result);
  };
  return (
    <>
      <UploadCertificate onSubmit={onSubmit} type="normal"></UploadCertificate>
    </>
  );
};

export default AddOfficialCert;
