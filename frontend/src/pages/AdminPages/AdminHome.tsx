import axios from "axios";
import { useEffect, useState } from "react";
import type { data } from "../../components/PendingInst";
import PendingInst from "../../components/PendingInst";
import { useColorMode } from "../../components/ui/color-mode";
const AdminHome = () => {
  const colorMode = useColorMode().colorMode;
  const [pending, setPending] = useState<data[]>([]);
  useEffect(() => {
    axios.get("http://localhost:5000/listPendingInstitutes").then((res) => {
      console.log(res.data);
      setPending(res.data as data[]);
    });
  }, []);

  const accept = (name: string, address: string, id: string, index: number) => {
    axios.post("http://localhost:5000/acceptInstitute", {
      name,
      address,
      id,
      index,
    });
    // axios.get("http://localhost:5000/listPendingInstitutes").then((res) => {
    //   console.log(res.data);
    //   setPending(res.data as data[]);
    // });
  };
  const reject = (name: string, address: string, id: string, index: number) => {
    axios.post("http://localhost:5000/rejectInstitute", {
      name,
      address,
      id,
      index,
    });
    // axios.get("http://localhost:5000/listPendingInstitutes").then((res) => {
    //   console.log(res.data);
    //   setPending(res.data as data[]);
    // });
  };
  return (
    <PendingInst data={pending} accept={accept} reject={reject}></PendingInst>
  );
};

export default AdminHome;
