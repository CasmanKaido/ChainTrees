require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
    solidity: {
        version: "0.8.20",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200
            }
        }
    },
    networks: {
        // Testnets
        sepolia: {
            url: process.env.VITE_INFURA_KEY
                ? `https://sepolia.infura.io/v3/${process.env.VITE_INFURA_KEY}`
                : "",
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
            chainId: 11155111
        },
        mumbai: {
            url: process.env.VITE_INFURA_KEY
                ? `https://polygon-mumbai.infura.io/v3/${process.env.VITE_INFURA_KEY}`
                : "",
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
            chainId: 80001
        },
        arbitrumSepolia: {
            url: process.env.VITE_INFURA_KEY
                ? `https://arbitrum-sepolia.infura.io/v3/${process.env.VITE_INFURA_KEY}`
                : "",
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
            chainId: 421614
        },
        baseSepolia: {
            url: "https://sepolia.base.org",
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
            chainId: 84532
        },
        // Mainnets (for future deployment)
        mainnet: {
            url: process.env.VITE_INFURA_KEY
                ? `https://mainnet.infura.io/v3/${process.env.VITE_INFURA_KEY}`
                : "",
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
            chainId: 1
        },
        polygon: {
            url: process.env.VITE_INFURA_KEY
                ? `https://polygon-mainnet.infura.io/v3/${process.env.VITE_INFURA_KEY}`
                : "",
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
            chainId: 137
        },
        arbitrum: {
            url: process.env.VITE_INFURA_KEY
                ? `https://arbitrum-mainnet.infura.io/v3/${process.env.VITE_INFURA_KEY}`
                : "",
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
            chainId: 42161
        },
        base: {
            url: "https://mainnet.base.org",
            accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
            chainId: 8453
        }
    },
    etherscan: {
        apiKey: {
            mainnet: process.env.ETHERSCAN_API_KEY || "",
            sepolia: process.env.ETHERSCAN_API_KEY || "",
            polygon: process.env.POLYGONSCAN_API_KEY || "",
            polygonMumbai: process.env.POLYGONSCAN_API_KEY || "",
            arbitrumOne: process.env.ARBISCAN_API_KEY || "",
            arbitrumSepolia: process.env.ARBISCAN_API_KEY || "",
            base: process.env.BASESCAN_API_KEY || "",
            baseSepolia: process.env.BASESCAN_API_KEY || ""
        }
    },
    paths: {
        sources: "./contracts",
        tests: "./contracts/test",
        cache: "./cache",
        artifacts: "./artifacts"
    }
};
