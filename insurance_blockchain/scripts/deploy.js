const { ethers } = require("hardhat");

async function main() {
  const cropInsurance = await ethers.deployContract("CropInsuranceNFT");
  await cropInsurance.waitForDeployment();
  console.log("Deployed at:", cropInsurance.target);
}

main();
