import React, {
  createContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import Web3 from "web3";
import publicdata from "./files/publicdata";
import keys from "./files/keys";
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
});

interface Web3ProviderProps {
  children: ReactNode;
}

export const Web3Provider: React.FC<Web3ProviderProps> = ({ children }) => {
  const [studentContractAddress, setStudentContractAddress] =
    useState<string>("");
  const [instituteContractAddress, setInstituteContractAddress] =
    useState<string>("");
  const [web3, setWeb3] = useState<Web3 | null>(null);
  const [account, setAccount] = useState<string | undefined>(undefined);
  const [trigger, setTrigger] = useState<boolean>(false);
  useEffect(() => {
    const storedAccount = sessionStorage.getItem("account");
    const storedStud = sessionStorage.getItem("studentContractAddress");
    const storedInst = sessionStorage.getItem("instituteContractAddress");
    console.log("storedAccount", storedAccount);
    console.log("storedStud", storedStud);
    console.log("storedInst", storedInst);

    if (storedAccount) setAccount(storedAccount);
    if (storedStud) setStudentContractAddress(storedStud);
    if (storedInst) setInstituteContractAddress(storedInst);
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
    setTrigger(false);
  };

  const check = async (account: string) => {
    const web3Instance = new Web3(window.ethereum);
    const contractInstance = new web3Instance.eth.Contract(
      publicdata.abi,
      contInfo.publicdata.contractAddress
    );
    sessionStorage.removeItem("studentContractAddress");
    sessionStorage.removeItem("instituteContractAddress");
    try {
      const isMoe = await contractInstance.methods
        .ismoe()
        .call({ from: account });
      if (isMoe) {
        return { type: "moe", contAddress: "", node: "" };
      }
    } catch (err) {
      console.log(err);
    }

    try {
      const value2: string[] = await contractInstance.methods
        .getInstContractAddress(account)
        .call({ from: besu.member2.accountAddress });
      console.log("value2", value2);

      if (value2[0] !== ZERO_ADDRESS) {
        setInstituteContractAddress(value2[0]);
        sessionStorage.setItem("instituteContractAddress", value2[0]);
        return { type: "institute", contAddress: value2[0], node: value2[1] };
      }
    } catch (err) {
      console.log("Not Institute");
    }

    try {
      const value3: string[] = await contractInstance.methods
        .getStudContractAddress(account)
        .call({ from: besu.member3.accountAddress });
      console.log("value3", value3);

      if (value3[0] !== ZERO_ADDRESS) {
        setStudentContractAddress(value3[0]);
        sessionStorage.setItem("studentContractAddress", value3[0]);
        return { type: "student", contAddress: value3[0], node: value3[1] };
      }
    } catch (err) {
      console.log("Not Student");
    }

    console.log("Redirecting to REC, no other roles found, account: ");
    return { type: "rec", contAddress: "", node: "" };
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
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};
