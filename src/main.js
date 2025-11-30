import './styles/main.css'
import './styles/wallet.css'
import './config/walletConfig.js'
import { WalletConnect } from './components/WalletConnect.js'
import { walletState } from './utils/walletState.js'

console.log('🌳 ChainTrees - Initializing...')

// Application entry point
class ChainTreesApp {
    constructor() {
        this.walletConnect = null
        this.init()
    }

    init() {
        console.log('✅ ChainTrees initialized')
        this.renderApp()
        this.initializeWallet()
    }

    renderApp() {
        const main = document.getElementById('main')
        if (main) {
            main.innerHTML = `
        <div class="app-container">
          <div class="hero-section">
            <h1 class="hero-title">🌳 ChainTrees</h1>
            <p class="hero-subtitle">Plant trees on-chain and track your environmental impact</p>
            
            <div class="wallet-section">
              <div id="wallet-connect-container"></div>
            </div>
            
            <div class="status-cards">
              <div class="status-card">
                <div class="status-icon">✅</div>
                <div class="status-content">
                  <h3>Project Initialized</h3>
                  <p>Foundation complete</p>
                </div>
              </div>
              
              <div class="status-card">
                <div class="status-icon">🔗</div>
                <div class="status-content">
                  <h3>WalletConnect Ready</h3>
                  <p>Multi-chain support</p>
                </div>
              </div>
              
              <div class="status-card">
                <div class="status-icon">🌐</div>
                <div class="status-content">
                  <h3>8 Networks</h3>
                  <p>Ethereum, Polygon, Arbitrum, Base</p>
                </div>
              </div>
            </div>
            
            <div id="wallet-status" class="wallet-status"></div>
          </div>
        </div>
      `
        }
    }

    initializeWallet() {
        // Initialize WalletConnect component
        this.walletConnect = new WalletConnect('wallet-connect-container')
        this.walletConnect.init()

        // Display current wallet status
        this.updateWalletStatus()

        // Watch for account changes
        walletState.watchAccount((account) => {
            this.updateWalletStatus()
        })
    }

    updateWalletStatus() {
        const statusEl = document.getElementById('wallet-status')
        if (!statusEl) return

        const account = walletState.getAccount()

        if (account.isConnected) {
            const chainName = walletState.getChainName(account.chainId)
            statusEl.innerHTML = `
        <div class="status-connected">
          <div class="status-indicator"></div>
          <div class="status-text">
            <strong>Connected</strong> to ${chainName}
            <br>
            <span class="status-address">${walletState.formatAddress(account.address)}</span>
          </div>
        </div>
      `
        } else {
            statusEl.innerHTML = `
        <div class="status-disconnected">
          <div class="status-text">
            Connect your wallet to get started
          </div>
        </div>
      `
        }
    }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => new ChainTreesApp())
} else {
    new ChainTreesApp()
}
