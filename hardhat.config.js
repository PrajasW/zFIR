require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();
/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.18",
  networks:{
    sepolia: {
      url: "https://rpc.sepolia.org",
      accounts: [process.env.TEST_ACCOUNT_PK]
    }
  }
};
