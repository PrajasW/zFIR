const hre = require('hardhat')

const _citizen = '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC';

const contractAddress = "0x5fbdb2315678afecb367f032d93f642f64180aa3";
const contractABI = require('../artifacts/contracts/zFIR.sol/zFIR.json')["abi"];
async function main() {
    const accounts = await hre.ethers.getSigners();
    const providers = hre.ethers.getDefaultProvider();
    const contract = new hre.ethers.Contract(contractAddress,contractABI,accounts[0]);
    const tx = await contract.addCitizen(_citizen);
    console.log(`transaction hash : ${await tx.hash}`)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
