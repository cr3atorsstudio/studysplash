/** @type import('hardhat/config').HardhatUserConfig */
import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-etherscan";

require("dotenv").config();

const config: HardhatUserConfig = {
  solidity: "0.8.13",
  networks: {
    hardhat: {},
    sepolia: {
      url: `https://sepolia.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts: [process.env.PRIVATE_KEY ?? ""],
    },
    mainnet: {
      url: `https://mainnet.infura.io/v3/${process.env.INFURA_API_KEY}`,
      accounts: [process.env.PRIVATE_KEY ?? ""],
    },
    scroll: {
      url: `https://sepolia-rpc.scroll.io`,
      accounts: [process.env.PRIVATE_KEY ?? ""],
      gas: 50000000,
    },
    base_goerli: {
      url: "https://goerli.base.org",
      accounts: [process.env.PRIVATE_KEY ?? ""],
    },
    gnosis: {
      url: "https://rpc.gnosischain.com",
      accounts: [process.env.PRIVATE_KEY ?? ""],
    },
    chiado: {
      url: "https://rpc.chiadochain.net",
      gasPrice: 1000000000,
      accounts: [process.env.PRIVATE_KEY ?? ""],
    },
  },
  defaultNetwork: "hardhat",
  etherscan: {
    apiKey: {
      scrollSepolia: "abc",
      baseGoerli: `${process.env.ETHERSCAN_API_KEY}`,
      chiado: `${process.env.GNOSISS_API_KEY}`,
      gnosis: `${process.env.GNOSISS_API_KEY}`,
    },
    customChains: [
      {
        network: "chiado",
        chainId: 10200,
        urls: {
          //Blockscout
          apiURL: "https://gnosis-chiado.blockscout.com/api",
          browserURL: "https://blockscout.com/gnosis/chiado",
        },
      },
      {
        network: "gnosis",
        chainId: 100,
        urls: {
          // 3) Select to what explorer verify the contracts
          // Gnosisscan
          apiURL: "https://api.gnosisscan.io/api",
          browserURL: "https://gnosisscan.io/",
          // Blockscout
          //apiURL: "https://blockscout.com/xdai/mainnet/api",
          //browserURL: "https://blockscout.com/xdai/mainnet",
        },
      },
      {
        network: "scrollSepolia",
        chainId: 534351,
        urls: {
          apiURL: "https://sepolia-blockscout.scroll.io/api",
          browserURL: "https://sepolia-blockscout.scroll.io/",
        },
      },
      {
        network: "baseGoerli",
        chainId: 84531,
        urls: {
          apiURL: "https://api-goerli.basescan.org/api",
          browserURL: "https://goerli.basescan.org",
        },
      },
    ],
  },
  paths: {
    sources: "./src",
  },
};

export default config;
