import React, { useContext, useEffect, useState } from "react";
import { Web3Context } from "../Web3ContextProvider";

declare global {
  interface Window {
    ethereum?: any; // MetaMask's Ethereum provider
  }
}
interface Prop {
  onClick?: () => void;
}

const MetaMaskConnect = () => {
  const { trigger, setTrigger, account } = useContext(Web3Context);

  const toggleTrigger = () => {
    setTrigger((prev) => !prev);
  };

  return (
    <div>
      <button onClick={toggleTrigger}>
        Trigger is {trigger ? "ON" : "OFF"}
      </button>
      {account && (
        <div>
          <p>Connected Account: {account}</p>
        </div>
      )}
    </div>
  );
};

export default MetaMaskConnect;
