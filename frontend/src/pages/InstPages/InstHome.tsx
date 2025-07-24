import { useEffect } from "react";
import InstituteInformation, {
  type InstituteInfo,
} from "../../components/InstituteInformation";
import axios from "axios";
const InstHome = () => {
  useEffect(() => {
    const getInstInfo = async () => {
      !JSON.parse(sessionStorage.getItem("instInfo") as string)
        ? axios
            .get("http://localhost:5000/getInstituteInfo", {
              params: {
                contractAddress: sessionStorage.getItem(
                  "instituteContractAddress"
                ) as string,
              },
            })
            .then((res) => {
              sessionStorage.setItem("instInfo", JSON.stringify(res.data));
            })
        : null;
    };
    getInstInfo();
  }, []);
  return (
    <center>
      <InstituteInformation
        data={
          JSON.parse(
            sessionStorage.getItem("instInfo") as string
          ) as InstituteInfo
        }
      ></InstituteInformation>
    </center>
  );
};

export default InstHome;
