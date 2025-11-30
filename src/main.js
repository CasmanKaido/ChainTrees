import './styles/main.css'

console.log('🌳 ChainTrees - Initializing...')

// Application entry point
class ChainTreesApp {
    constructor() {
        this.init()
    }

    init() {
        console.log('✅ ChainTrees initialized')
        this.renderWelcome()
    }

    renderWelcome() {
        const main = document.getElementById('main')
        if (main) {
            main.innerHTML = `
        <div class="welcome-container">
          <h1 class="welcome-title">🌳 ChainTrees</h1>
          <p class="welcome-subtitle">Plant trees on-chain and track your environmental impact</p>
          <div class="welcome-status">
            <p>✅ Project initialized successfully!</p>
            <p>📦 Ready for Commit 1</p>
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
