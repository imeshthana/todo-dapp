"use client";
import styles from "./page.module.css";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Header from "../app/components/header";
import abi from "../abis/ToDoList.json";
import { contractAddress } from "../constants/constants";

export default function Home() {
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [tasks, setTasks] = useState([]);

  const accountsChanged = async () => {
    window.ethereum.on("accountsChanged", async () => {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      console.log(signer.address);
      setAccount(signer.address);
    });
  };

  const connectHandler = async () => {
    try {
      if (window.ethereum) {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        console.log(signer.address);
        setAccount(signer.address);

        await loadBlockchainData(signer);
      } else {
        console.log("Metamask not found");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const loadBlockchainData = async (signer) => {
    const contractInstance = new ethers.Contract(contractAddress, abi, signer);
    setContract(contractInstance);

    var tasks = await contractInstance.getAllTasks();
    setTasks(tasks);
  };

  useEffect(() => {
    accountsChanged();
  }, []);

  return (
    <div>
      <Header account={account} connectHandler={connectHandler} />
    </div>
  );
}
