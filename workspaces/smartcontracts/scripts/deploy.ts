import { ethers } from "hardhat";
import fs from "fs";
import path from "path";

async function main() {
  const Dispatch = await ethers.getContractFactory("Dispatch");
  const dispatch = await Dispatch.deploy();

  await dispatch.deployed();

  const Test = await ethers.getContractFactory("Test");
  const test = await Test.deploy();

  await test.deployed();

  fs.writeFileSync(
    path.join(__dirname, "..", "addresses.json"),
    JSON.stringify({ dispatch: dispatch.address, test: test.address }, null, 2)
  );
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
