const hre = require('hardhat')

const _citizen = '0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199';

const contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";
const contractABI = require('../artifacts/contracts/zFIR.sol/zFIR.json')["abi"];
async function main() {
    const accounts = await hre.ethers.getSigners();
    const providers = hre.ethers.getDefaultProvider();
    const contract = new hre.ethers.Contract(contractAddress,contractABI,accounts[19]);
    const tx = await contract.fileReport(hre.ethers.toBigInt("410210"),"she ded");
    console.log(`transaction hash : ${await tx.hash}`)
}   

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
