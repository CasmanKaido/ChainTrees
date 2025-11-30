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
            // Note: totalSupply might not be in the ABI if using Counters internally without public getter
            // But we added it in our contract
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
}

export const contractService = new ContractService()
