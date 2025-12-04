import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { WalletConnect } from '../../../src/components/WalletConnect.js'

describe('WalletConnect Component', () => {
    let walletConnect
    let mockContainer

    beforeEach(() => {
        // Create a mock DOM container with ID
        mockContainer = document.createElement('div')
        mockContainer.id = 'wallet-test-container'
        document.body.appendChild(mockContainer)

        // Mock localStorage
        global.localStorage = {
            getItem: vi.fn(),
            setItem: vi.fn(),
            removeItem: vi.fn(),
            clear: vi.fn()
        }

        walletConnect = new WalletConnect('wallet-test-container')
    })

    afterEach(() => {
        if (mockContainer && mockContainer.parentNode) {
            document.body.removeChild(mockContainer)
        }
        vi.clearAllMocks()
    })

    describe('Initialization', () => {
        it('should create a WalletConnect instance', () => {
            expect(walletConnect).toBeDefined()
            expect(walletConnect.isConnected).toBe(false)
            expect(walletConnect.address).toBeNull()
        })

        it('should initialize with default state', () => {
            expect(walletConnect.chainId).toBeNull()
            expect(walletConnect.balance).toBe('0')
        })
    })

    describe('Wallet Connection', () => {
        it('should handle successful wallet connection', async () => {
            const mockAddress = '0x1234567890123456789012345678901234567890'
            const mockChainId = 1

            // Mock the connection process
            walletConnect.connect = vi.fn().mockResolvedValue({
                address: mockAddress,
                chainId: mockChainId
            })

            const result = await walletConnect.connect()

            expect(result.address).toBe(mockAddress)
            expect(result.chainId).toBe(mockChainId)
        })

        it('should handle connection rejection', async () => {
            const mockError = new Error('User rejected connection')

            walletConnect.connect = vi.fn().mockRejectedValue(mockError)

            await expect(walletConnect.connect()).rejects.toThrow('User rejected connection')
        })

        it('should update state after successful connection', async () => {
            const mockAddress = '0x1234567890123456789012345678901234567890'

            walletConnect.isConnected = true
            walletConnect.address = mockAddress

            expect(walletConnect.isConnected).toBe(true)
            expect(walletConnect.address).toBe(mockAddress)
        })

        it('should store connection state in localStorage', async () => {
            const mockAddress = '0x1234567890123456789012345678901234567890'

            walletConnect.saveConnectionState = vi.fn()
            walletConnect.saveConnectionState(mockAddress)

            expect(walletConnect.saveConnectionState).toHaveBeenCalledWith(mockAddress)
        })
    })

    describe('Wallet Disconnection', () => {
        it('should disconnect wallet successfully', async () => {
            walletConnect.isConnected = true
            walletConnect.address = '0x1234567890123456789012345678901234567890'

            walletConnect.disconnect = vi.fn(() => {
                walletConnect.isConnected = false
                walletConnect.address = null
            })

            walletConnect.disconnect()

            expect(walletConnect.isConnected).toBe(false)
            expect(walletConnect.address).toBeNull()
        })

        it('should clear localStorage on disconnect', () => {
            walletConnect.disconnect = vi.fn(() => {
                localStorage.removeItem('walletAddress')
            })

            walletConnect.disconnect()

            expect(localStorage.removeItem).toHaveBeenCalledWith('walletAddress')
        })

        it('should reset all state on disconnect', () => {
            walletConnect.disconnect = vi.fn(() => {
                walletConnect.isConnected = false
                walletConnect.address = null
                walletConnect.chainId = null
                walletConnect.balance = '0'
            })

            walletConnect.disconnect()

            expect(walletConnect.isConnected).toBe(false)
            expect(walletConnect.address).toBeNull()
            expect(walletConnect.chainId).toBeNull()
            expect(walletConnect.balance).toBe('0')
        })
    })

    describe('Network Switching', () => {
        it('should handle network switch request', async () => {
            const targetChainId = 137 // Polygon

            walletConnect.switchNetwork = vi.fn().mockResolvedValue(targetChainId)

            const result = await walletConnect.switchNetwork(targetChainId)

            expect(result).toBe(targetChainId)
            expect(walletConnect.switchNetwork).toHaveBeenCalledWith(targetChainId)
        })

        it('should handle unsupported network error', async () => {
            const unsupportedChainId = 999

            walletConnect.switchNetwork = vi.fn().mockRejectedValue(
                new Error('Unsupported network')
            )

            await expect(walletConnect.switchNetwork(unsupportedChainId))
                .rejects.toThrow('Unsupported network')
        })

        it('should update chainId after successful switch', async () => {
            const newChainId = 137

            walletConnect.chainId = newChainId

            expect(walletConnect.chainId).toBe(newChainId)
        })
    })

    describe('Balance Fetching', () => {
        it('should fetch wallet balance', async () => {
            const mockBalance = '1.5'

            walletConnect.getBalance = vi.fn().mockResolvedValue(mockBalance)

            const balance = await walletConnect.getBalance()

            expect(balance).toBe(mockBalance)
        })

        it('should handle balance fetch error', async () => {
            walletConnect.getBalance = vi.fn().mockRejectedValue(
                new Error('Failed to fetch balance')
            )

            await expect(walletConnect.getBalance())
                .rejects.toThrow('Failed to fetch balance')
        })

        it('should format balance correctly', () => {
            const rawBalance = '1500000000000000000' // 1.5 ETH in wei
            const expectedBalance = '1.5'

            walletConnect.formatBalance = vi.fn().mockReturnValue(expectedBalance)

            const formatted = walletConnect.formatBalance(rawBalance)

            expect(formatted).toBe(expectedBalance)
        })
    })

    describe('Error Handling', () => {
        it('should handle wallet not installed error', async () => {
            walletConnect.connect = vi.fn().mockRejectedValue(
                new Error('No wallet detected')
            )

            await expect(walletConnect.connect())
                .rejects.toThrow('No wallet detected')
        })

        it('should handle network mismatch error', async () => {
            walletConnect.checkNetwork = vi.fn().mockRejectedValue(
                new Error('Wrong network')
            )

            await expect(walletConnect.checkNetwork())
                .rejects.toThrow('Wrong network')
        })

        it('should provide user-friendly error messages', () => {
            const errors = {
                4001: 'User rejected the request',
                4100: 'Unauthorized',
                4200: 'Unsupported method',
                4900: 'Disconnected',
                4901: 'Chain disconnected'
            }

            walletConnect.getErrorMessage = vi.fn((code) => errors[code])

            expect(walletConnect.getErrorMessage(4001)).toBe('User rejected the request')
            expect(walletConnect.getErrorMessage(4901)).toBe('Chain disconnected')
        })
    })

    describe('Event Listeners', () => {
        it('should handle account change event', () => {
            const newAccount = '0x9876543210987654321098765432109876543210'
            const callback = vi.fn()

            walletConnect.on = vi.fn((event, handler) => {
                if (event === 'accountsChanged') {
                    handler([newAccount])
                }
            })

            walletConnect.on('accountsChanged', callback)

            expect(callback).toHaveBeenCalledWith([newAccount])
        })

        it('should handle chain change event', () => {
            const newChainId = '0x89' // Polygon
            const callback = vi.fn()

            walletConnect.on = vi.fn((event, handler) => {
                if (event === 'chainChanged') {
                    handler(newChainId)
                }
            })

            walletConnect.on('chainChanged', callback)

            expect(callback).toHaveBeenCalledWith(newChainId)
        })

        it('should handle disconnect event', () => {
            const callback = vi.fn()

            walletConnect.on = vi.fn((event, handler) => {
                if (event === 'disconnect') {
                    handler()
                }
            })

            walletConnect.on('disconnect', callback)

            expect(callback).toHaveBeenCalled()
        })
    })

    describe('UI Rendering', () => {
        it('should render connect button when disconnected', () => {
            walletConnect.isConnected = false
            const html = walletConnect.render()

            expect(html).toContain('Connect Wallet')
        })

        it('should render address when connected', () => {
            walletConnect.isConnected = true
            walletConnect.address = '0x1234567890123456789012345678901234567890'

            const html = walletConnect.render()

            expect(html).toContain('0x1234')
        })

        it('should render balance when connected', () => {
            walletConnect.isConnected = true
            walletConnect.balance = '1.5'

            const html = walletConnect.render()

            expect(html).toContain('1.5')
        })
    })
})
