const hre = require('hardhat')

const reportNumber = 4;
const contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";
const contractABI = require('../artifacts/contracts/zFIR.sol/zFIR.json')["abi"];
async function main() {
    const accounts = await hre.ethers.getSigners();
    const providers = hre.ethers.getDefaultProvider();
    const contract = new hre.ethers.Contract(contractAddress,contractABI,accounts[0]);
    const tx = await contract.verify(reportNumber);

    console.log(`transaction hash : ${await tx.hash}`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
