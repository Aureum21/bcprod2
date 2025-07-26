import { useEffect, useState } from "react";
import InstituteInformation, {
  type InstituteInfo,
} from "../../components/InstituteInformation";
import axios from "axios";
import InstInfoSkeleton from "../../components/InstInfoSkeleton";

const InstHome = () => {
  const [instInfo, setInstInfo] = useState<InstituteInfo | null>(null);
  useEffect(() => {
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
            console.log("res.data", res.data);
            setInstInfo(res.data);
            sessionStorage.setItem("instInfo", JSON.stringify(res.data));
          })
      : null;
  }, []);
  return (
    <center>
      {JSON.parse(sessionStorage.getItem("instInfo") as string) ? (
        <InstituteInformation
          data={
            JSON.parse(
              sessionStorage.getItem("instInfo") as string
            ) as InstituteInfo
          }
        />
      ) : (
        <InstInfoSkeleton />
      )}
    </center>
  );
};

export default InstHome;
