/**
 * ChainTrees - Main Application Entry Point
 *
 * This is the core application file that initializes all systems and manages
 * the application lifecycle.
 *
 * @version 1.0.0
 * @author ChainTrees Team
 * @license MIT
 */

// Core Components
import { WalletConnect } from './components/WalletConnect.js'
import { InstallPrompt } from './components/InstallPrompt.js'
import { applySEO } from './utils/seo.js'
import { registerServiceWorker } from './serviceWorker.js'

// Utility Systems
import { errorBoundary } from './utils/errorBoundary.js'
import { performanceMonitor } from './utils/performanceMonitor.js'
import { analyticsTracker } from './utils/analyticsTracker.js'
import { notificationSystem } from './utils/notificationSystem.js'
import { themeManager } from './utils/themeManager.js'
import { keyboardShortcuts } from './utils/keyboardShortcuts.js'
import { accessibilityManager } from './utils/accessibilityManager.js'

// Styles
import 'animate.css'
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
import './styles/social.css'
import './styles/feed.css'
import './styles/gifting.css'
import './styles/marketplace.css'
import './styles/auction.css'
import './styles/offers.css'
import './styles/governance.css'
import './styles/animations.css'
import './config/walletConfig.js'

console.log('🌳 ChainTrees v1.0.0 - Initializing...')

// Register error handler
errorBoundary.onError(error => {
  performanceMonitor.trackError(error.error || new Error(error.message), error.type)
})

// Make utilities globally available
window.themeManager = themeManager
window.notificationSystem = notificationSystem
window.analyticsTracker = analyticsTracker

/**
 * Main Application Class
 * Manages the application state, routing, and lifecycle
 */
class ChainTreesApp {
  constructor() {
    this.walletConnect = null
    this.currentPage = null
    this.version = '1.0.0'
    this.init()
  }

  /**
   * Initialize the application
   */
  init() {
    console.log('✅ ChainTrees initialized')
    this.renderLayout()
    // Apply SEO tags for the initial page
    applySEO()
    this.initializeWallet()
    this.setupNavigation()
    this.loadPage('landing') // Start with landing page

    // Make app globally available for landing page CTAs
    window.app = this

    // Track app initialization
    analyticsTracker.trackPageView('app_init')
  }

  /**
   * Render the main application layout
   */
  renderLayout() {
    const app = document.getElementById('app')
    if (app) {
      app.innerHTML = `
        <header class="app-header">
          <div class="header-content">
            <div class="logo">🌳 ChainTrees</div>
            <nav class="main-nav">
              <button class="nav-btn active" data-page="landing">Home</button>
              <button class="nav-btn" data-page="mint">Plant</button>
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
          <p>© 2025 ChainTrees • Built with 🌱 for a greener future</p>
        </footer>
      `
    }
  }

  /**
   * Initialize wallet connection
   */
  initializeWallet() {
    this.walletConnect = new WalletConnect('wallet-connect-container')
    this.walletConnect.init()
  }

  /**
   * Setup navigation event listeners
   */
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

  /**
   * Load a page dynamically
   * @param {string} pageName - The name of the page to load
   */
  async loadPage(pageName) {
    const mainContent = document.getElementById('main-content')
    mainContent.innerHTML = `<div class="loading-container"><div class="loading-spinner"></div><p>Loading ${pageName}...</p></div>`

    // Track page view
    analyticsTracker.trackPageView(pageName)
    performanceMonitor.trackPageLoad(pageName)

    try {
      if (this.currentPage && this.currentPage.destroy) this.currentPage.destroy()
      let PageClass

      // Dynamic page imports
      if (pageName === 'landing') {
        const { LandingPage } = await import('./pages/LandingPage.js')
        PageClass = LandingPage
      } else if (pageName === 'mint') {
        const { MintPage } = await import('./pages/MintPage.js')
        PageClass = MintPage
      } else if (pageName === 'marketplace') {
        const { MarketplacePage } = await import('./pages/MarketplacePage.js')
        PageClass = MarketplacePage
      } else if (pageName === 'settings') {
        const { SettingsPage } = await import('./pages/SettingsPage.js')
        PageClass = SettingsPage
      } else {
        throw new Error(`Page ${pageName} not found`)
      }

      if (PageClass) {
        this.currentPage = new PageClass('main-content')
        await this.currentPage.render()
      }
    } catch (e) {
      console.error(e)
      import('./components/ErrorFallback.js').then(({ ErrorFallback }) => {
        new ErrorFallback(mainContent, e, () => this.loadPage(pageName)).render();
      });
    }
  }
}

// Register PWA service worker using utility
registerServiceWorker();

// Initialize PWA install prompt
const installPrompt = new InstallPrompt()
installPrompt.init()

// Initialize application
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new ChainTreesApp())
} else {
  new ChainTreesApp()
}

console.log('🌳 ChainTrees v1.0.0 - Ready!')
