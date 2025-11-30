import './styles/main.css'
import './styles/layout.css'
import './styles/wallet.css'
import './styles/mint.css'
import './config/walletConfig.js'
import { WalletConnect } from './components/WalletConnect.js'
import { walletState } from './utils/walletState.js'
import { MintPage } from './pages/MintPage.js'

console.log('🌳 ChainTrees - Initializing...')

class ChainTreesApp {
  constructor() {
    this.walletConnect = null
    this.currentPage = null
    this.init()
  }

  init() {
    console.log('✅ ChainTrees initialized')
    this.renderLayout()
    this.initializeWallet()
    this.loadPage('mint')
  }

  renderLayout() {
    const app = document.getElementById('app')
    if (app) {
      app.innerHTML = `
        <header class="app-header">
          <div class="header-content">
            <div class="logo">🌳 ChainTrees</div>
            <div id="wallet-connect-container"></div>
          </div>
        </header>
        
        <main id="main-content"></main>
        
        <footer class="app-footer">
          <p>© 2025 ChainTrees • Built for impact</p>
        </footer>
      `
    }
  }

  initializeWallet() {
    this.walletConnect = new WalletConnect('wallet-connect-container')
    this.walletConnect.init()
  }

  loadPage(pageName) {
    const mainContent = document.getElementById('main-content')

    if (pageName === 'mint') {
      this.currentPage = new MintPage('main-content')
      this.currentPage.render()
    }
  }
}

// Initialize app when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new ChainTreesApp())
} else {
  new ChainTreesApp()
}
