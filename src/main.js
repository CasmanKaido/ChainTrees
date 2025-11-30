import { WalletConnect } from './components/WalletConnect.js'
import { InstallPrompt } from './components/InstallPrompt.js';
import './styles/main.css'
import './styles/layout.css'
import './styles/mobile.css'
import './styles/polish.css'
import './styles/wallet.css'
import './styles/mint.css'
import './styles/dashboard.css'
import './styles/leaderboard.css'
import './styles/rewards.css'
import './styles/achievements.css'
import './styles/metadata.css'
import './styles/gamification.css'
import './styles/daily-rewards.css'
import './styles/quests.css'
import './config/walletConfig.js'

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
    this.setupNavigation()
    this.loadPage('mint')
  }

  renderLayout() {
    const app = document.getElementById('app')
    if (app) {
      app.innerHTML = `
        <header class="app-header">
          <div class="header-content">
            <div class="logo">🌳 ChainTrees</div>
            <nav class="main-nav">
              <button class="nav-btn active" data-page="mint">Plant</button>
              <button class="nav-btn" data-page="dashboard">My Forest</button>
              <button class="nav-btn" data-page="rewards">Rewards</button>
              <button class="nav-btn" data-page="achievements">Badges</button>
              <button class="nav-btn" data-page="metadata">IPFS</button>
              <button class="nav-btn" data-page="leaderboard">Leaderboard</button>
              <button class="nav-btn" data-page="gallery">Gallery</button>
              <button class="nav-btn" data-page="impact">Impact</button>
              <button class="nav-btn" data-page="staking">Staking</button>
              <button class="nav-btn" data-page="marketplace">Market</button>
              <button class="nav-btn" data-page="governance">DAO</button>
              <button class="nav-btn" data-page="education">Learn</button>
              <button class="nav-btn" data-page="analytics">📊</button>
              <button class="nav-btn" data-page="settings">⚙️</button>
            </nav>
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

  setupNavigation() {
    const navBtns = document.querySelectorAll('.nav-btn')
    navBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        navBtns.forEach(b => b.classList.remove('active'))
        btn.classList.add('active')
        this.loadPage(btn.dataset.page)
      })
    })
  }

  // Minimal loadPage – static import of MintPage only
  async loadPage(pageName) {
    const mainContent = document.getElementById('main-content')
    mainContent.innerHTML = `<div class="loading-container"><div class="loading-spinner"></div><p>Loading ${pageName}...</p></div>`
    try {
      if (this.currentPage && this.currentPage.destroy) this.currentPage.destroy()
      let PageClass
      if (pageName === 'mint') {
        const { MintPage } = await import('./pages/MintPage.js')
        PageClass = MintPage
      } else {
        // fallback – just show a placeholder
        mainContent.innerHTML = `<p>Page "${pageName}" not available in this test build.</p>`
        return
      }
      this.currentPage = new PageClass('main-content')
      await this.currentPage.render()
    } catch (e) {
      console.error(e)
    }
  }
}

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(r => console.log('SW registered:', r))
      .catch(err => console.log('SW registration failed:', err))
  })
}

const installPrompt = new InstallPrompt()
installPrompt.init()

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new ChainTreesApp())
} else {
  new ChainTreesApp()
}
