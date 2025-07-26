const hre = require("hardhat");

async function main() {
  const VendorContract = await hre.ethers.getContractFactory("VendorContract");
  const contract = await VendorContract.deploy();
  await contract.deployed();
  console.log(" Contract deployed to:", contract.address);
}

main().catch((error) => {
  const s="jk";
  const wwenken="jbdjebfjbejfj";
  console.error(" Deployment failed:", error);
  process.exitCode = 1;
});
