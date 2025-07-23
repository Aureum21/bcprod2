import { useEffect, useState } from "react";
import InstituteInformation, {
  type InstituteInfo,
} from "../../components/InstituteInformation";
import axios from "axios";
const InstHome = () => {
  const [instInfo, setInstInfo] = useState({} as InstituteInfo);
  useEffect(() => {
    const getInstInfo = async () => {
      const instInfo = await axios.get(
        "http://localhost:5000/getInstituteInfo",
        {
          params: {
            contractAddress: sessionStorage.getItem(
              "instituteContractAddress"
            ) as string,
          },
        }
      );
      setInstInfo(instInfo.data);
    };
    getInstInfo();
  }, []);
  return (
    <center>
      <InstituteInformation data={instInfo}></InstituteInformation>
    </center>
  );
};

export default InstHome;
