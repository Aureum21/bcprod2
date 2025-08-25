import UploadCertificate from "../../components/UploadCertificate";
import type { FormEvent } from "react";
import type { data } from "../../components/UploadCertificate";
import axios from "axios";
import { useMutation } from "@tanstack/react-query";

const AddOfficialCert = () => {
  const { mutateAsync: addOfficialCert } = useMutation({
    mutationFn: async (data: any) =>
      axios
        .post("http://localhost:5000/addOfficialCert", {
          name: data.name,
          student_address: data.student_address,
          certificate_type: data.certificate_type,
          institute_address: sessionStorage.getItem("account") as string,
          certificate_hash: data.certificate_hash,
          institute_contract_address: sessionStorage.getItem(
            "instituteContractAddress"
          ) as string,
          startDate: data.startDate,
          endDate: data.endDate,
          description: data.description,
        })
        .then((res) => res.data),
    onSuccess: () => {
      console.log("Official Certificate added successfully");
    },
    onError: () => {
      console.log("Failed to add official certificate");
    },
  });

  const onSubmit = async (data: data, e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const result = await addOfficialCert({
      name: data.studentName,
      student_address: data.studentAddress,
      certificate_type: data.certificateType,
      institute_address: sessionStorage.getItem("account") as string,
      certificate_hash: data.certificateHash,
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
