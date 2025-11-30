import ChainTreeABI from '../contracts/abis/ChainTree.json'
import TreeTokenABI from '../contracts/abis/TreeToken.json'
import RewardSystemABI from '../contracts/abis/RewardSystem.json'
import AchievementsABI from '../contracts/abis/Achievements.json'

// Contract Addresses
// REPLACE THESE WITH REAL ADDRESSES AFTER DEPLOYMENT
export const CONTRACT_ADDRESSES = {
    // Localhost / Testnet Placeholders
    11155111: { // Sepolia
        ChainTree: "0x0000000000000000000000000000000000000000",
        TreeToken: "0x0000000000000000000000000000000000000000",
        RewardSystem: "0x0000000000000000000000000000000000000000",
        Achievements: "0x0000000000000000000000000000000000000000"
    },
    80001: { // Mumbai
        ChainTree: "0x0000000000000000000000000000000000000000",
        TreeToken: "0x0000000000000000000000000000000000000000",
        RewardSystem: "0x0000000000000000000000000000000000000000",
        Achievements: "0x0000000000000000000000000000000000000000"
    },
    // Default to empty strings for other networks
    default: {
        ChainTree: "",
        TreeToken: "",
        RewardSystem: "",
        Achievements: ""
    }
}

// Export ABIs
export const ABIS = {
    ChainTree: ChainTreeABI,
    TreeToken: TreeTokenABI,
    RewardSystem: RewardSystemABI,
    Achievements: AchievementsABI
}

// Helper to get contract address for current chain
export const getContractAddress = (chainId, contractName) => {
    if (CONTRACT_ADDRESSES[chainId] && CONTRACT_ADDRESSES[chainId][contractName]) {
        return CONTRACT_ADDRESSES[chainId][contractName]
    }
    return CONTRACT_ADDRESSES.default[contractName]
}
