require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config(); // Load from .env

module.exports = {
  solidity: "0.8.28",
  networks: {
    sepolia: {
      url: process.env.RPC_URL, // Infura Sepolia RPC from .env
      accounts: [process.env.PRIVATE_KEY], // Private key (0x-prefixed)
    },
  },
};
