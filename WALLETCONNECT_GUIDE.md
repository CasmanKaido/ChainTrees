# WalletConnect & Reown SDK Quick Reference

This guide provides quick reference for implementing WalletConnect using the Reown SDK in the ChainTrees project.

---

## 🔑 Getting Your WalletConnect Project ID

1. Visit [Reown Cloud](https://cloud.reown.com)
2. Sign up or log in
3. Click "Create New Project"
4. Select "AppKit" as your product
5. Copy your Project ID
6. Add to `.env`:
   ```env
   VITE_WALLETCONNECT_PROJECT_ID=your_project_id_here
   ```

---

## 📦 Installation (Using Bun)

```bash
# Core packages
bun add @reown/appkit @reown/appkit-adapter-wagmi

# Blockchain interaction
bun add wagmi viem

# React Query (for state management)
bun add @tanstack/react-query
```

---

## ⚙️ Basic Configuration

### 1. Create Wallet Config (`src/config/walletConfig.js`)

```javascript
import { createAppKit } from '@reown/appkit'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { mainnet, polygon, arbitrum, base, sepolia, polygonMumbai } from '@reown/appkit/networks'
import { QueryClient } from '@tanstack/react-query'

// 1. Get projectId from https://cloud.reown.com
export const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID

if (!projectId) {
  throw new Error('VITE_WALLETCONNECT_PROJECT_ID is not set')
}

// 2. Set up Wagmi adapter
export const networks = [mainnet, polygon, arbitrum, base, sepolia, polygonMumbai]

export const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId
})

// 3. Create modal
export const metadata = {
  name: 'ChainTrees',
  description: 'Plant trees on-chain and track your environmental impact',
  url: 'https://chaintrees.io',
  icons: ['https://chaintrees.io/icon.png']
}

export const modal = createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata,
  features: {
    analytics: true, // Optional - enable analytics
    email: true, // Optional - enable email login
    socials: ['google', 'x', 'discord'], // Optional - social logins
    emailShowWallets: true // Optional - show wallets in email flow
  }
})

// 4. Create query client
export const queryClient = new QueryClient()
```

---

## 🎨 UI Components

### Connect Button Component

```javascript
// src/components/WalletConnect.js
export class WalletConnect {
  constructor() {
    this.button = null
    this.init()
  }

  init() {
    // Create connect button
    this.button = document.createElement('appkit-button')
    this.button.setAttribute('balance', 'show') // Show balance
    this.button.setAttribute('label', 'Connect Wallet')
    
    // Add to DOM
    const container = document.getElementById('wallet-connect-container')
    if (container) {
      container.appendChild(this.button)
    }
  }
}

// Usage in your HTML
// <div id="wallet-connect-container"></div>
```

### Network Button Component

```javascript
// src/components/NetworkButton.js
export class NetworkButton {
  constructor() {
    this.button = null
    this.init()
  }

  init() {
    // Create network button
    this.button = document.createElement('appkit-network-button')
    
    // Add to DOM
    const container = document.getElementById('network-button-container')
    if (container) {
      container.appendChild(this.button)
    }
  }
}
```

---

## 🔌 Wallet State Management

### Get Connection Status

```javascript
// src/utils/walletState.js
import { wagmiAdapter } from '../config/walletConfig.js'
import { getAccount, watchAccount } from '@wagmi/core'

export class WalletState {
  constructor() {
    this.account = null
    this.isConnected = false
    this.chainId = null
    this.listeners = []
  }

  // Get current account
  getAccount() {
    const account = getAccount(wagmiAdapter.wagmiConfig)
    this.account = account.address
    this.isConnected = account.isConnected
    this.chainId = account.chainId
    return account
  }

  // Watch for account changes
  watchAccount(callback) {
    const unwatch = watchAccount(wagmiAdapter.wagmiConfig, {
      onChange: (account) => {
        this.account = account.address
        this.isConnected = account.isConnected
        this.chainId = account.chainId
        callback(account)
      }
    })
    this.listeners.push(unwatch)
    return unwatch
  }

  // Cleanup
  destroy() {
    this.listeners.forEach(unwatch => unwatch())
    this.listeners = []
  }
}

// Usage
const walletState = new WalletState()
walletState.watchAccount((account) => {
  console.log('Account changed:', account)
  if (account.isConnected) {
    console.log('Connected to:', account.address)
    console.log('Chain ID:', account.chainId)
  } else {
    console.log('Disconnected')
  }
})
```

---

## 📝 Contract Interactions

### Read from Contract

```javascript
// src/utils/contractInteraction.js
import { readContract } from '@wagmi/core'
import { wagmiAdapter } from '../config/walletConfig.js'
import ChainTreeABI from '../contracts/abis/ChainTree.json'

export async function getTreeData(tokenId, contractAddress) {
  try {
    const result = await readContract(wagmiAdapter.wagmiConfig, {
      address: contractAddress,
      abi: ChainTreeABI,
      functionName: 'trees',
      args: [tokenId]
    })
    return result
  } catch (error) {
    console.error('Error reading tree data:', error)
    throw error
  }
}

// Usage
const treeData = await getTreeData(1, '0x...')
console.log('Tree species:', treeData.species)
```

### Write to Contract (Mint Tree)

```javascript
import { writeContract, waitForTransactionReceipt } from '@wagmi/core'
import { wagmiAdapter } from '../config/walletConfig.js'
import ChainTreeABI from '../contracts/abis/ChainTree.json'

export async function mintTree(species, contractAddress) {
  try {
    // 1. Write transaction
    const hash = await writeContract(wagmiAdapter.wagmiConfig, {
      address: contractAddress,
      abi: ChainTreeABI,
      functionName: 'mint',
      args: [species]
    })
    
    console.log('Transaction hash:', hash)
    
    // 2. Wait for confirmation
    const receipt = await waitForTransactionReceipt(wagmiAdapter.wagmiConfig, {
      hash
    })
    
    console.log('Transaction confirmed:', receipt)
    return receipt
  } catch (error) {
    console.error('Error minting tree:', error)
    throw error
  }
}

// Usage
try {
  const receipt = await mintTree('Oak', '0x...')
  console.log('Tree minted! Token ID:', receipt.logs[0].topics[3])
} catch (error) {
  console.error('Minting failed:', error.message)
}
```

---

## 🎧 Event Listeners

### Listen to Contract Events

```javascript
// src/utils/eventListeners.js
import { watchContractEvent } from '@wagmi/core'
import { wagmiAdapter } from '../config/walletConfig.js'
import ChainTreeABI from '../contracts/abis/ChainTree.json'

export function watchTreeMinted(contractAddress, callback) {
  const unwatch = watchContractEvent(wagmiAdapter.wagmiConfig, {
    address: contractAddress,
    abi: ChainTreeABI,
    eventName: 'TreeMinted',
    onLogs: (logs) => {
      logs.forEach(log => {
        const { owner, tokenId, species } = log.args
        callback({ owner, tokenId, species })
      })
    }
  })
  
  return unwatch // Call this to stop watching
}

// Usage
const unwatch = watchTreeMinted('0x...', (event) => {
  console.log('New tree minted!')
  console.log('Owner:', event.owner)
  console.log('Token ID:', event.tokenId)
  console.log('Species:', event.species)
})

// Stop watching when done
// unwatch()
```

---

## 🌐 Network Switching

### Switch to Specific Chain

```javascript
import { switchChain } from '@wagmi/core'
import { wagmiAdapter } from '../config/walletConfig.js'
import { polygon } from '@reown/appkit/networks'

export async function switchToPolygon() {
  try {
    await switchChain(wagmiAdapter.wagmiConfig, {
      chainId: polygon.id
    })
    console.log('Switched to Polygon')
  } catch (error) {
    console.error('Error switching chain:', error)
    throw error
  }
}
```

---

## 💰 Get Balance

```javascript
import { getBalance } from '@wagmi/core'
import { wagmiAdapter } from '../config/walletConfig.js'

export async function getUserBalance(address) {
  try {
    const balance = await getBalance(wagmiAdapter.wagmiConfig, {
      address
    })
    
    return {
      value: balance.value, // BigInt
      decimals: balance.decimals,
      formatted: balance.formatted, // String like "1.5"
      symbol: balance.symbol // "ETH", "MATIC", etc.
    }
  } catch (error) {
    console.error('Error getting balance:', error)
    throw error
  }
}

// Usage
const balance = await getUserBalance('0x...')
console.log(`Balance: ${balance.formatted} ${balance.symbol}`)
```

---

## 🔐 Sign Messages

```javascript
import { signMessage } from '@wagmi/core'
import { wagmiAdapter } from '../config/walletConfig.js'

export async function signLoginMessage(address) {
  try {
    const message = `Sign this message to authenticate with ChainTrees.\n\nAddress: ${address}\nTimestamp: ${Date.now()}`
    
    const signature = await signMessage(wagmiAdapter.wagmiConfig, {
      message
    })
    
    return { message, signature }
  } catch (error) {
    console.error('Error signing message:', error)
    throw error
  }
}
```

---

## 🎨 Customizing the Modal

### Custom Theme

```javascript
import { createAppKit } from '@reown/appkit'

const modal = createAppKit({
  // ... other config
  themeMode: 'dark', // 'light' or 'dark'
  themeVariables: {
    '--w3m-accent': '#22c55e', // Primary green color
    '--w3m-border-radius-master': '8px',
    '--w3m-font-family': 'Inter, sans-serif'
  }
})
```

---

## 🚨 Error Handling

### Common Errors and Solutions

```javascript
export function handleWalletError(error) {
  if (error.code === 4001) {
    // User rejected the request
    return 'Transaction cancelled by user'
  } else if (error.code === -32002) {
    // Request already pending
    return 'Please check your wallet for pending requests'
  } else if (error.message.includes('insufficient funds')) {
    return 'Insufficient funds for transaction'
  } else if (error.message.includes('gas')) {
    return 'Gas estimation failed. Please try again'
  } else {
    return `Transaction failed: ${error.message}`
  }
}

// Usage
try {
  await mintTree('Oak', '0x...')
} catch (error) {
  const userMessage = handleWalletError(error)
  alert(userMessage)
}
```

---

## 📱 Responsive Design

### Mobile-Optimized Connection

```javascript
// Detect mobile and adjust modal behavior
const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent)

const modal = createAppKit({
  // ... other config
  featuredWalletIds: isMobile 
    ? [
        'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96', // MetaMask
        '4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0', // Trust Wallet
      ]
    : [
        'c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96', // MetaMask
        '1ae92b26df02f0abca6304df07debccd18262fdf5fe82daa81593582dac9a369', // Rainbow
      ]
})
```

---

## 🧪 Testing

### Mock Wallet for Testing

```javascript
// tests/mocks/mockWallet.js
export const mockWallet = {
  address: '0x1234567890123456789012345678901234567890',
  chainId: 1,
  isConnected: true
}

export function mockGetAccount() {
  return mockWallet
}

// Usage in tests
import { mockGetAccount } from './mocks/mockWallet'

test('should display connected wallet', () => {
  const account = mockGetAccount()
  expect(account.isConnected).toBe(true)
  expect(account.address).toBe('0x1234567890123456789012345678901234567890')
})
```

---

## 📚 Additional Resources

- **Reown Docs**: https://docs.reown.com/
- **AppKit Docs**: https://docs.reown.com/appkit/overview
- **Wagmi Docs**: https://wagmi.sh/
- **Viem Docs**: https://viem.sh/
- **Example Apps**: https://github.com/reown-com/appkit-examples

---

## 🆘 Troubleshooting

### Issue: "Project ID not found"
**Solution**: Make sure you've set `VITE_WALLETCONNECT_PROJECT_ID` in your `.env` file

### Issue: "Network not supported"
**Solution**: Add the network to your `networks` array in `walletConfig.js`

### Issue: "Transaction fails with no error"
**Solution**: Check gas limits and ensure wallet has enough native token for gas

### Issue: "Modal doesn't appear"
**Solution**: Ensure you've imported the CSS: `import '@reown/appkit/dist/index.css'`

---

**Happy coding! 🚀**
