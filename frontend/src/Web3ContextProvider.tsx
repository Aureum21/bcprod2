import React, {
  createContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import Web3 from "web3";
import publicdata from "./files/publicdata";
import keys from "./files/keys";
import axios from "axios";
const contInfo = keys.contractInformations;
const besu = keys.besu;
interface UserData {
  type: string;
  contAddress: string;
  node: string;
}
const ZERO_ADDRESS = "0x0000000000000000000000000000000000000000";

interface Web3ContextType {
  trigger: boolean;
  setTrigger: React.Dispatch<React.SetStateAction<boolean>>;
  account?: string | undefined;
  connect: () => Promise<string | undefined>;
  check: (account: string) => Promise<UserData>;
  studentContractAddress: string;
  instituteContractAddress: string;
  employerContractAddress: string;
  getStatus: (account: string) => Promise<void>;
}

export const Web3Context = createContext<Web3ContextType>({
  trigger: false,
  setTrigger: () => {},
  account: undefined,
  connect: async () => undefined,
  check: async () => {
    return { type: "", contAddress: "", node: "" };
  },
  studentContractAddress: "",
  instituteContractAddress: "",
  employerContractAddress: "",
  getStatus: async (account: string) => {},
});

interface Web3ProviderProps {
  children: ReactNode;
}
type InstDetails = [boolean, string, string];
export const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
  const [studentContractAddress, setStudentContractAddress] =
    useState<string>("");
  const [instituteContractAddress, setInstituteContractAddress] =
    useState<string>("");
  const [employerContractAddress, setEmployerContractAddress] =
    useState<string>("");
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [account, setAccount] = useState<string | undefined>(undefined);
  const [trigger, setTrigger] = useState<boolean>(false);
  useEffect(() => {
    const storedAccount = sessionStorage.getItem("account");
    const storedStud = sessionStorage.getItem("studentContractAddress");
    const storedInst = sessionStorage.getItem("instituteContractAddress");
    const storedEmp = sessionStorage.getItem("employerContractAddress");
    console.log("storedAccount", storedAccount);
    console.log("storedStud", storedStud);
    console.log("storedInst", storedInst);
    console.log("storedEmp", storedEmp);

    if (storedAccount) setAccount(storedAccount);
    if (storedStud) setStudentContractAddress(storedStud);
    if (storedInst) setInstituteContractAddress(storedInst);
    if (storedEmp) setEmployerContractAddress(storedEmp);
  }, []);

  const connect = async () => {
    logout();
    if (window.ethereum) {
      const web3Instance = new Web3(window.ethereum);
      setWeb3(web3Instance);

      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccount(accounts[0]);
      sessionStorage.setItem("account", accounts[0]);
      return accounts[0];
    } else {
      alert("Please install MetaMask");
      return undefined;
    }
  };
  const logout = () => {
    sessionStorage.clear();
    setAccount(undefined);
    setStudentContractAddress("");
    setInstituteContractAddress("");
    setEmployerContractAddress("");
    setTrigger(false);
  };

  const check = async (account: string) => {
    const { data } = await axios.get("http://localhost:5000/checkAccount", {
      params: { account },
    });
    console.log("moe", data.moe);
    console.log("instAddress", data.instAddress);
    // console.log("studAddress", data.studAddress);
    console.log("employerAddress", data.employerAddress);
    const web3Instance = new Web3(window.ethereum);
    const contractInstance = new web3Instance.eth.Contract(
      publicdata.abi,
      contInfo.publicdata.contractAddress
    );
    sessionStorage.removeItem("studentContractAddress");
    sessionStorage.removeItem("instituteContractAddress");
    sessionStorage.removeItem("employerContractAddress");
    try {
      if (data.moe) {
        sessionStorage.setItem("type", "moe");
        console.log("isMoe", data.moe);
        return { type: "moe", contAddress: "", node: "" };
      }
    } catch (err) {
      console.log(err);
    }

    try {
      if (
        data.instAddress[0].length > 0 &&
        data.instAddress[0][0] !== ZERO_ADDRESS
      ) {
        setInstituteContractAddress(data.instAddress[0][0]);
        console.log("setInstituteContractAddress", data.instAddress[0][0]);
        sessionStorage.setItem(
          "instituteContractAddress",
          data.instAddress[0][0]
        );
        sessionStorage.setItem(
          "pendingContractAddress",
          data.instAddress[0][1]
        );
        sessionStorage.setItem("type", "institute");
        return {
          type: "institute",
          contAddress: data.instAddress[0][0],
          node: data.instAddress[1],
        };
      }
    } catch (err) {
      console.log("Not Institute");
    }

    try {
      if (data.studAddress[0] !== ZERO_ADDRESS) {
        setStudentContractAddress(data.studAddress[0]);
        sessionStorage.setItem("studentContractAddress", data.studAddress[0]);
        sessionStorage.setItem("type", "student");
        return {
          type: "student",
          contAddress: data.studAddress[0],
          node: data.studAddress[1],
        };
      }
    } catch (err) {
      console.log("Not Student");
    }

    try {
      if (data.employerAddress[0] !== ZERO_ADDRESS) {
        setEmployerContractAddress(data.employerAddress[0]);
        sessionStorage.setItem(
          "employerContractAddress",
          data.employerAddress[0]
        );
        sessionStorage.setItem("type", "employer");
        return {
          type: "employer",
          contAddress: data.employerAddress[0],
          node: data.employerAddress[1],
        };
      }
    } catch (err) {
      console.log("Not Employer");
    }

    console.log("Redirecting to REC, no other roles found, account: ");
    return { type: "rec", contAddress: "", node: "" };
  };
  const getStatus = async (account: string) => {
    const web3Instance = new Web3(window.ethereum);
    const contractInstance = new web3Instance.eth.Contract(
      publicdata.abi,
      contInfo.publicdata.contractAddress
    );

    if (sessionStorage.getItem("type") === "student") {
      const result = await contractInstance.methods
        .getStudDetails(account)
        .call({ from: besu.member3.accountAddress });

      console.log("studStatus", result);

      // Ensure it's an array before destructuring
      if (Array.isArray(result)) {
        const [isVerified, registrationDate, verificationDate] = result;
        // use them as needed
        sessionStorage.setItem(
          "Status",
          JSON.stringify({ isVerified, registrationDate, verificationDate })
        );
      } else {
        console.error("getStudDetails did not return an array:", result);
      }
    } else {
      const result: string[] = await contractInstance.methods
        .getInstDetails(account)
        .call({ from: besu.member2.accountAddress });

      console.log("instituteStatus", result);
      const isVerified = result[0];
      const registrationDate = result[1];
      const verificationDate = result[2];
      sessionStorage.setItem(
        "Status",
        JSON.stringify({ isVerified, registrationDate, verificationDate })
      );
    }
  };

  return (
    <Web3Context.Provider
      value={{
        trigger,
        setTrigger,
        account,
        connect,
        check,
        studentContractAddress,
        instituteContractAddress,
        employerContractAddress,
        getStatus,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};
