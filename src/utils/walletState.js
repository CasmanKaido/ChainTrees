import { getAccount, watchAccount, disconnect, getBalance, switchChain } from '@wagmi/core'
import { wagmiConfig } from '../config/walletConfig.js'

/**
 * WalletState - Manages wallet connection state and provides utilities
 */
export class WalletState {
    constructor() {
        this.account = null
        this.isConnected = false
        this.chainId = null
        this.address = null
        this.listeners = []
        this.balanceCache = new Map()
    }

    /**
     * Get current account information
     */
    getAccount() {
        const account = getAccount(wagmiConfig)
        this.account = account
        this.isConnected = account.isConnected
        this.chainId = account.chainId
        this.address = account.address
        return account
    }

    /**
     * Watch for account changes
     */
    watchAccount(callback) {
        const unwatch = watchAccount(wagmiConfig, {
            onChange: (account) => {
                this.account = account
                this.isConnected = account.isConnected
                this.chainId = account.chainId
                this.address = account.address

                // Clear balance cache when account changes
                this.balanceCache.clear()

                callback(account)
            }
        })

        this.listeners.push(unwatch)
        return unwatch
    }

    /**
     * Disconnect wallet
     */
    async disconnect() {
        try {
            await disconnect(wagmiConfig)
            this.account = null
            this.isConnected = false
            this.chainId = null
            this.address = null
            this.balanceCache.clear()
            return true
        } catch (error) {
            console.error('Error disconnecting wallet:', error)
            throw error
        }
    }

    /**
     * Get wallet balance
     */
    async getBalance(address = null) {
        try {
            const targetAddress = address || this.address

            if (!targetAddress) {
                throw new Error('No address provided and no wallet connected')
            }

            // Check cache first
            const cacheKey = `${targetAddress}-${this.chainId}`
            if (this.balanceCache.has(cacheKey)) {
                const cached = this.balanceCache.get(cacheKey)
                // Cache for 30 seconds
                if (Date.now() - cached.timestamp < 30000) {
                    return cached.balance
                }
            }

            const balance = await getBalance(wagmiConfig, {
                address: targetAddress
            })

            // Cache the result
            this.balanceCache.set(cacheKey, {
                balance,
                timestamp: Date.now()
            })

            return balance
        } catch (error) {
            console.error('Error getting balance:', error)
            throw error
        }
    }

    /**
     * Switch to a different chain
     */
    async switchChain(chainId) {
        try {
            await switchChain(wagmiConfig, { chainId })
            this.chainId = chainId
            this.balanceCache.clear()
            return true
        } catch (error) {
            console.error('Error switching chain:', error)
            throw error
        }
    }

    /**
     * Get chain name from chain ID
     */
    getChainName(chainId = null) {
        const id = chainId || this.chainId
        const chainNames = {
            1: 'Ethereum',
            137: 'Polygon',
            42161: 'Arbitrum',
            8453: 'Base',
            11155111: 'Sepolia',
            80001: 'Mumbai',
            421614: 'Arbitrum Sepolia',
            84532: 'Base Sepolia'
        }
        return chainNames[id] || 'Unknown Network'
    }

    /**
     * Format address for display (0x1234...5678)
     */
    formatAddress(address = null, startChars = 6, endChars = 4) {
        const addr = address || this.address
        if (!addr) return ''
        return `${addr.slice(0, startChars)}...${addr.slice(-endChars)}`
    }

    /**
     * Cleanup all listeners
     */
    destroy() {
        this.listeners.forEach(unwatch => unwatch())
        this.listeners = []
        this.balanceCache.clear()
    }
}

// Create singleton instance
export const walletState = new WalletState()
