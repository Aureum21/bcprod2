import {
  Button,
  FileUpload,
  type FileUploadFileAcceptDetails,
} from "@chakra-ui/react";
import { HiUpload } from "react-icons/hi";
interface Props {
  onChange: (files: File[]) => void;
}

const UploadFile = ({ onChange }: Props) => {
  return (
    <FileUpload.Root
      maxFiles={5}
      onFileAccept={(file: FileUploadFileAcceptDetails) => onChange(file.files)}
    >
      <FileUpload.HiddenInput />
      <FileUpload.Trigger asChild>
        <Button variant="outline" size="sm">
          <HiUpload /> Upload file
        </Button>
      </FileUpload.Trigger>
      <FileUpload.List showSize clearable />
    </FileUpload.Root>
  );
};
export default UploadFile;
