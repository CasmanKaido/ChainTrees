import ChainTreeABI from '../contracts/abis/ChainTree.json'
import TreeTokenABI from '../contracts/abis/TreeToken.json'
import RewardSystemABI from '../contracts/abis/RewardSystem.json'
import AchievementsABI from '../contracts/abis/Achievements.json'

// Contract Addresses
// Updated with deployed addresses
export const CONTRACT_ADDRESSES = {
  // Sepolia
  11155111: {
    ChainTree: '0x0000000000000000000000000000000000000000',
    TreeToken: '0x0000000000000000000000000000000000000000',
    RewardSystem: '0x0000000000000000000000000000000000000000',
    Achievements: '0x0000000000000000000000000000000000000000'
  },
  // Mumbai
  80001: {
    ChainTree: '0x0000000000000000000000000000000000000000',
    TreeToken: '0x0000000000000000000000000000000000000000',
    RewardSystem: '0x0000000000000000000000000000000000000000',
    Achievements: '0x0000000000000000000000000000000000000000'
  },
  // Base Sepolia (Testnet - Deployed 2025-11-29)
  84532: {
    ChainTree: '0xADbe79538107df6cC8cE28C8faf0DB7397f3CD89',
    TreeToken: '0x5a95d4A11b975e4d0E518a38b388302c433dC5cE',
    RewardSystem: '0x280298D01194142B42463A9A69fB4e91490BC581',
    Achievements: '0xfEBDD786A1Ba3CF8345FEbbFeEd2017429080F6b'
  },
  // Base Mainnet (PRODUCTION - Deployed via Remix)
  8453: {
    ChainTree: '0xA15D1368905aCc892C1E7939d5ec94CA64719981',
    TreeToken: '0x06B68c3c42f98a5ee87876d9128574EDFda32bD9',
    RewardSystem: '0xFFD32443218A03079cb00a7aC31eA97DBCE7aB75',
    Achievements: '0x6A93104f5705b3A1ca6FDbd6fe056d2b4B20693e'
  },
  // Default to empty strings for other networks
  default: {
    ChainTree: '',
    TreeToken: '',
    RewardSystem: '',
    Achievements: ''
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
