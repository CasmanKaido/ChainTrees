import { readContract, writeContract, waitForTransactionReceipt } from '@wagmi/core'
import { wagmiConfig } from '../config/walletConfig.js'
import { getContractAddress, ABIS } from '../config/contracts.js'
import { walletState } from '../utils/walletState.js'

export class ContractService {
    constructor() {
        this.chainId = null
    }

    getChainId() {
        const account = walletState.getAccount()
        return account.chainId
    }

    getAddress(contractName) {
        const chainId = this.getChainId()
        if (!chainId) throw new Error('Wallet not connected')
        return getContractAddress(chainId, contractName)
    }

    async mintTree(species, tokenURI) {
        try {
            const chainId = this.getChainId()
            const address = this.getAddress('ChainTree')

            console.log(`Minting tree on chain ${chainId} at ${address}`)

            const hash = await writeContract(wagmiConfig, {
                address,
                abi: ABIS.ChainTree,
                functionName: 'mintTree',
                args: [species, tokenURI],
                value: 0n // Free mint for now
            })

            console.log('Transaction hash:', hash)
            return hash
        } catch (error) {
            console.error('Error minting tree:', error)
            throw error
        }
    }

    async waitForTransaction(hash) {
        return await waitForTransactionReceipt(wagmiConfig, { hash })
    }

    async getTreeData(tokenId) {
        try {
            const address = this.getAddress('ChainTree')
            const data = await readContract(wagmiConfig, {
                address,
                abi: ABIS.ChainTree,
                functionName: 'getTreeData',
                args: [tokenId]
            })
            return data
        } catch (error) {
            console.error('Error fetching tree data:', error)
            throw error
        }
    }

    async getTotalSupply() {
        try {
            const address = this.getAddress('ChainTree')
            const supply = await readContract(wagmiConfig, {
                address,
                abi: ABIS.ChainTree,
                functionName: 'totalSupply'
            })
            return Number(supply)
        } catch (error) {
            console.error('Error fetching total supply:', error)
            return 0
        }
    }

    async getGlobalStats() {
        try {
            const address = this.getAddress('ChainTree')

            const [totalSupply, totalCarbon] = await Promise.all([
                readContract(wagmiConfig, {
                    address,
                    abi: ABIS.ChainTree,
                    functionName: 'totalSupply'
                }),
                readContract(wagmiConfig, {
                    address,
                    abi: ABIS.ChainTree,
                    functionName: 'totalCarbonOffset'
                })
            ])

            return {
                totalTrees: Number(totalSupply),
                totalCarbon: Number(totalCarbon)
            }
        } catch (error) {
            console.error('Error fetching global stats:', error)
            return { totalTrees: 0, totalCarbon: 0 }
        }
    }

    async getUserTrees(address) {
        try {
            const contractAddress = this.getAddress('ChainTree')

            // 1. Get token IDs owned by user
            const tokenIds = await readContract(wagmiConfig, {
                address: contractAddress,
                abi: ABIS.ChainTree,
                functionName: 'getTreesByOwner',
                args: [address]
            })

            // 2. Fetch data for each tree
            const trees = await Promise.all(
                tokenIds.map(async (id) => {
                    const data = await this.getTreeData(id)
                    return {
                        id: Number(id),
                        ...data
                    }
                })
            )

            return trees
        } catch (error) {
            console.error('Error fetching user trees:', error)
            return []
        }
    }

    async waterTree(tokenId) {
        try {
            const address = this.getAddress('ChainTree')
            console.log(`Watering tree ${tokenId}`)

            const hash = await writeContract(wagmiConfig, {
                address,
                abi: ABIS.ChainTree,
                functionName: 'waterTree',
                args: [tokenId]
            })

            return hash
        } catch (error) {
            console.error('Error watering tree:', error)
            throw error
        }
    }

    // --- Staking & Rewards ---

    async stakeTree(tokenId) {
        try {
            const rewardAddress = this.getAddress('RewardSystem')
            const treeAddress = this.getAddress('ChainTree')

            // 1. Approve transfer first
            console.log(`Approving transfer for tree ${tokenId}`)
            const approveHash = await writeContract(wagmiConfig, {
                address: treeAddress,
                abi: ABIS.ChainTree,
                functionName: 'approve',
                args: [rewardAddress, tokenId]
            })
            await this.waitForTransaction(approveHash)

            // 2. Stake
            console.log(`Staking tree ${tokenId}`)
            const hash = await writeContract(wagmiConfig, {
                address: rewardAddress,
                abi: ABIS.RewardSystem,
                functionName: 'stake',
                args: [tokenId]
            })

            return hash
        } catch (error) {
            console.error('Error staking tree:', error)
            throw error
        }
    }

    async unstakeTree(tokenId) {
        try {
            const address = this.getAddress('RewardSystem')
            const hash = await writeContract(wagmiConfig, {
                address,
                abi: ABIS.RewardSystem,
                functionName: 'unstake',
                args: [tokenId]
            })
            return hash
        } catch (error) {
            console.error('Error unstaking tree:', error)
            throw error
        }
    }

    async claimReward(tokenId) {
        try {
            const address = this.getAddress('RewardSystem')
            const hash = await writeContract(wagmiConfig, {
                address,
                abi: ABIS.RewardSystem,
                functionName: 'claimReward',
                args: [tokenId]
            })
            return hash
        } catch (error) {
            console.error('Error claiming reward:', error)
            throw error
        }
    }

    async getStakedTrees(address) {
        try {
            const rewardAddress = this.getAddress('RewardSystem')

            // Get staked token IDs
            const tokenIds = await readContract(wagmiConfig, {
                address: rewardAddress,
                abi: ABIS.RewardSystem,
                functionName: 'getStakedTokens',
                args: [address]
            })

            // Fetch data for each staked tree
            const trees = await Promise.all(
                tokenIds.map(async (id) => {
                    const data = await this.getTreeData(id)
                    const reward = await readContract(wagmiConfig, {
                        address: rewardAddress,
                        abi: ABIS.RewardSystem,
                        functionName: 'calculateReward',
                        args: [id]
                    })

                    return {
                        id: Number(id),
                        pendingReward: Number(reward),
                        ...data
                    }
                })
            )

            return trees
        } catch (error) {
            console.error('Error fetching staked trees:', error)
            return []
        }
    }

    async getRewardBalance(address) {
        try {
            const tokenAddress = this.getAddress('TreeToken')
            const balance = await readContract(wagmiConfig, {
                address: tokenAddress,
                abi: ABIS.TreeToken,
                functionName: 'balanceOf',
                args: [address]
            })
            return Number(balance)
        } catch (error) {
            console.error('Error fetching token balance:', error)
            return 0
        }
    }
}

export const contractService = new ContractService()
