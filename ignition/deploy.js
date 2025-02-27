const hre = require("hardhat");

async function main() {
  const ToDoList = await ethers.getContractFactory("ToDoList");
  const todolist = await ToDoList.deploy();
  await todolist.waitForDeployment();
  console.log("Contract Address", await todolist.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.log(error);
    process.exit(1);
  });
