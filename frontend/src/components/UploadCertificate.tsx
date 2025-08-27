import {
  Box,
  Button,
  Card,
  Field,
  Fieldset,
  Input,
  NativeSelect,
  Spinner,
  Textarea,
} from "@chakra-ui/react";
import { useState, type FormEvent } from "react";
import { HiUpload } from "react-icons/hi";
type CertificateType = "normal" | "skill" | "workExperiance" | "unOfficial";
export interface data {
  studentName: string;
  studentAddress: string;
  certificateType: string;
  skillName: string;
  experience: string;
  companyName: string;
  instituteAddress: string;
  jobTitle: string;
  startDate: string;
  endDate: string;
  description: string;
  certificateHash: string;
  certificateName: string;
}
interface Props {
  type: CertificateType;
  onSubmit: (data: data, e: FormEvent<HTMLFormElement>) => void;
  isLoading: boolean;
}

const UploadCertificate = ({ type, onSubmit, isLoading }: Props) => {
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    console.log(formData);
  };
  const [formData, setFormData] = useState<data>({
    studentName: "",
    studentAddress: "",
    certificateType: "",
    skillName: "",
    experience: "",
    companyName: "",
    instituteAddress: "",
    jobTitle: "",
    startDate: "",
    endDate: "",
    description: "",
    certificateHash: "",
    certificateName: "",
  });
  async function uploadToIPFS() {
    const popup = window.open(
      "http://localhost:3000/",
      "IPFS Upload",
      "width=600,height=400"
    );
    if (!popup) {
      alert("Popup blocked");
      return;
    }
    popup.onload = function () {
      const uploadCompleteButton =
        popup.document.getElementById("uploadComplete");
      const fileNameElement = popup.document.getElementById("fileName");
      if (!uploadCompleteButton || !fileNameElement) {
        alert("Required elements not found in the popup.");
        popup.close();
        return;
      }
      uploadCompleteButton.onclick = function () {
        const uploadedFile = fileNameElement.innerText;
        const uploadedFileDisplay = document.getElementById(
          "uploadedFileDisplay"
        );
        if (uploadedFileDisplay) {
          uploadedFileDisplay.innerText = "Latest Upload: " + uploadedFile;
        } else {
          alert("Display element not found.");
        }
        popup.close();
      };
    };
  }

  return (
    <form onSubmit={(e) => onSubmit(formData, e)}>
      <Box minWidth={"500px"}>
        <Card.Root padding={2} maxW="3xl">
          <Card.Header>
            <Card.Title>
              {type === "workExperiance"
                ? "Add Work Experience"
                : type === "skill"
                ? "Add Skill"
                : "Upload Certificate"}
            </Card.Title>
            <Card.Description>
              Please provide your{" "}
              {type === "workExperiance"
                ? "work experience details"
                : type === "skill"
                ? "skill details"
                : "certificate details"}{" "}
              below.
            </Card.Description>
          </Card.Header>
          <Card.Body>
            <Fieldset.Root size="lg">
              <Fieldset.Content>
                {/* Common Field: Certificate Name */}
                {type === "normal" && (
                  <>
                    <Field.Root>
                      <Field.Label>Student Name</Field.Label>
                      <Input
                        name="studentName"
                        onChange={(e) => handleChange(e)}
                      />
                    </Field.Root>
                    <Field.Root>
                      <Field.Label>Student Address</Field.Label>
                      <Input
                        name="studentAddress"
                        onChange={(e) => handleChange(e)}
                      />
                    </Field.Root>
                    <Field.Root>
                      <Field.Label>Certificate Type</Field.Label>
                      <NativeSelect.Root>
                        <NativeSelect.Field
                          name="certificateType"
                          onChange={(e) => handleChange(e)}
                        >
                          {["Diploma", "Bachelor", "Master", "PhD"].map(
                            (item) => (
                              <option key={item} value={item}>
                                {item}
                              </option>
                            )
                          )}
                        </NativeSelect.Field>
                        <NativeSelect.Indicator />
                      </NativeSelect.Root>
                    </Field.Root>
                    <Field.Root>
                      <Field.Label>Start Date</Field.Label>
                      <Input
                        name="startDate"
                        type="date"
                        onChange={(e) => handleChange(e)}
                      />
                    </Field.Root>
                    <Field.Root>
                      <Field.Label>End Date</Field.Label>
                      <Input
                        name="endDate"
                        type="date"
                        onChange={(e) => handleChange(e)}
                      />
                    </Field.Root>
                    <Field.Root>
                      <Field.Label>Description</Field.Label>
                      <Textarea
                        name="description"
                        onChange={(e) => handleChange(e)}
                      />
                    </Field.Root>
                  </>
                )}
                {type === "unOfficial" && (
                  <>
                    <Field.Root>
                      <Field.Label>Certificate Name</Field.Label>
                      <Input
                        name="certificateName"
                        onChange={(e) => handleChange(e)}
                      />
                    </Field.Root>
                    <Field.Root>
                      <Field.Label>Institute Address</Field.Label>
                      <Input
                        name="instituteAddress"
                        onChange={(e) => handleChange(e)}
                      />
                    </Field.Root>
                  </>
                )}
                {type === "skill" && (
                  <>
                    <Field.Root>
                      <Field.Label>Student Name</Field.Label>
                      <Input
                        name="studentName"
                        onChange={(e) => handleChange(e)}
                      />
                    </Field.Root>
                    <Field.Root>
                      <Field.Label>Skill Name</Field.Label>
                      <Input
                        name="skillName"
                        onChange={(e) => handleChange(e)}
                      />
                    </Field.Root>
                    <Field.Root>
                      <Field.Label>Experience</Field.Label>
                      <Input
                        name="experience"
                        onChange={(e) => handleChange(e)}
                      />
                    </Field.Root>
                  </>
                )}

                {type === "workExperiance" && (
                  <>
                    <Field.Root>
                      <Field.Label>Company Name</Field.Label>
                      <Input
                        name="companyName"
                        onChange={(e) => handleChange(e)}
                      />
                    </Field.Root>
                    <Field.Root>
                      <Field.Label>Institute Address</Field.Label>
                      <Input
                        name="instituteAddress"
                        onChange={(e) => handleChange(e)}
                      />
                    </Field.Root>
                    <Field.Root>
                      <Field.Label>Job Title</Field.Label>
                      <Input
                        name="jobTitle"
                        onChange={(e) => handleChange(e)}
                      />
                    </Field.Root>
                    <Field.Root>
                      <Field.Label>Start Date</Field.Label>
                      <Input
                        name="startDate"
                        type="date"
                        onChange={(e) => handleChange(e)}
                      />
                    </Field.Root>
                    <Field.Root>
                      <Field.Label>End Date</Field.Label>
                      <Input
                        name="endDate"
                        type="date"
                        onChange={(e) => handleChange(e)}
                      />
                    </Field.Root>
                    <Field.Root>
                      <Field.Label>Description</Field.Label>
                      <Textarea
                        name="description"
                        onChange={(e) => handleChange(e)}
                      />
                    </Field.Root>
                  </>
                )}

                {/* File Upload (for all types) */}
                <Field.Root>
                  <Field.Label>Upload Certificate File</Field.Label>
                  <Button variant="outline" size="sm" onClick={uploadToIPFS}>
                    <HiUpload /> Upload file
                  </Button>
                </Field.Root>

                {/* Certificate Hash (for all types) */}
                <Field.Root>
                  <Field.Label>Certificate Hash</Field.Label>
                  <Input
                    name="certificateHash"
                    onChange={(e) => handleChange(e)}
                  />
                </Field.Root>
              </Fieldset.Content>

              <Button type="submit" alignSelf="flex-start" mt={4} minW="100px">
                {isLoading ? <Spinner /> : "Submit"}
              </Button>
            </Fieldset.Root>
          </Card.Body>
        </Card.Root>
      </Box>
    </form>
  );
};

export default UploadCertificate;
