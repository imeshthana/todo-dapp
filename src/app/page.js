"use client";
import styles from "./page.module.css";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import Header from "../app/components/header";
import abi from "../abis/ToDoList.json";
import { contractAddress } from "../constants/constants";

export default function Home() {
  const [account, setAccount] = useState(null);
  const [todoContractInstance, setTodoContractInstance] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState("");

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
        const contractInstance = new ethers.Contract(
          contractAddress,
          abi,
          signer
        );
        setTodoContractInstance(contractInstance);

        await loadBlockchainData(contractInstance);
      } else {
        console.log("Metamask not found");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const loadBlockchainData = async (contractInstance) => {
    var tasks = await contractInstance.getAllTasks();
    setTasks(tasks);
  };

  const addTask = async (event) => {
    event.preventDefault();
    const transaction = await todoContractInstance.addTask(task);
    await transaction.wait();
    setTask("");
    await loadBlockchainData(todoContractInstance);
  };

  const updateStatus = async (taskId) => {
    const transaction = await todoContractInstance.updateStatus(taskId);
    await transaction.wait();
    await loadBlockchainData(todoContractInstance);
  };

  const handleChange = async (event) => {
    setTask(event.target.value);
  };

  useEffect(() => {
    accountsChanged();
  }, []);

  return (
    <div>
      <Header account={account} connectHandler={connectHandler} />
      <div>
        <div className={styles.container}>
          <form className={styles.form} onSubmit={addTask}>
            <input
              type="text"
              name="task"
              placeholder="Add task here ..."
              onChange={handleChange}
              value={task}
            />
            <input type="submit" value="Add Task" />
          </form>
        </div>
        <div className={styles.container}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Task ID</th>
                <th>Task Description</th>
                <th>Task Status</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task, index) => {
                const statusValue =
                  typeof task.status === "bigint"
                    ? Number(task.status)
                    : Number(task.status);
                return (
                  <tr key={index}>
                    <td>{index}</td>
                    <td>{task.des}</td>
                    <td>{statusValue === 0 ? "Pending" : "Finished"}</td>
                    <td>
                      {statusValue === 0 ? (
                        <button
                          className={styles.button}
                          onClick={() => updateStatus(index)}
                        >
                          Click me
                        </button>
                      ) : null}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
