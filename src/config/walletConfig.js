import { createAppKit } from '@reown/appkit'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import {
  mainnet,
  polygon,
  arbitrum,
  base,
  sepolia,
  polygonMumbai,
  arbitrumSepolia,
  baseSepolia
} from '@reown/appkit/networks'
import { QueryClient } from '@tanstack/react-query'

// 1. Get projectId from environment
export const projectId = import.meta.env.VITE_WALLETCONNECT_PROJECT_ID

if (!projectId) {
  throw new Error('VITE_WALLETCONNECT_PROJECT_ID is not set in .env file')
}

// 2. Configure supported networks
export const networks = [
  mainnet,
  polygon,
  arbitrum,
  base,
  sepolia,
  polygonMumbai,
  arbitrumSepolia,
  baseSepolia
]

// 3. Create Wagmi Adapter
export const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: false
})

// 4. Set up metadata
export const metadata = {
  name: 'ChainTrees',
  description: 'Plant trees on-chain and track your environmental impact',
  url: 'https://chaintrees.io',
  icons: ['https://chaintrees.io/favicon.svg']
}

// 5. Create AppKit instance
export const modal = createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata,
  features: {
    analytics: true, // Enable analytics
    email: false, // Disable email login for now
    socials: [], // No social logins for now
    emailShowWallets: true
  },
  themeMode: 'dark',
  themeVariables: {
    '--w3m-accent': '#22c55e',
    '--w3m-border-radius-master': '12px',
    '--w3m-font-family': 'Inter, sans-serif'
  }
})

// 6. Create Query Client for React Query
export const queryClient = new QueryClient()

// Export wagmi config for use in other files
export const wagmiConfig = wagmiAdapter.wagmiConfig
