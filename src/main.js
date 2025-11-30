import { MintPage } from './pages/MintPage.js'
import { DashboardPage } from './pages/DashboardPage.js'
import { LeaderboardPage } from './pages/LeaderboardPage.js'
import { RewardsPage } from './pages/RewardsPage.js'
import { AchievementsPage } from './pages/AchievementsPage.js'
import { MetadataPage } from './pages/MetadataPage.js'
import { GalleryPage } from './pages/GalleryPage.js'
import { WalletConnect } from './components/WalletConnect.js'
import './styles/main.css'
import './styles/layout.css'
import './styles/wallet.css'
import './styles/mint.css'
import './styles/dashboard.css'
import './styles/leaderboard.css'
import './styles/rewards.css'
import './styles/achievements.css'
import './styles/metadata.css'
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
        // Update active state
        navBtns.forEach(b => b.classList.remove('active'))
        btn.classList.add('active')

        // Load page
        this.loadPage(btn.dataset.page)
      })
    })
  }

  loadPage(pageName) {
    const mainContent = document.getElementById('main-content')

    // Cleanup current page if needed

    if (pageName === 'mint') {
      this.currentPage = new MintPage('main-content')
      this.currentPage.render()
    } else if (pageName === 'dashboard') {
      this.currentPage = new DashboardPage('main-content')
      this.currentPage.render()
    } else if (pageName === 'leaderboard') {
      this.currentPage = new LeaderboardPage('main-content')
      this.currentPage.render()
    } else if (pageName === 'rewards') {
      this.currentPage = new RewardsPage('main-content')
      this.currentPage.render()
    } else if (pageName === 'achievements') {
      this.currentPage = new AchievementsPage('main-content')
      this.currentPage.render()
    } else if (pageName === 'metadata') {
      this.currentPage = new MetadataPage('main-content')
      this.currentPage.render()
    } else if (pageName === 'gallery') {
      this.currentPage = new GalleryPage('main-content')
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
