import { analyticsTracker } from '../utils/analyticsTracker.js';
import '../styles/landing.css';

export class LandingPage {
    constructor(containerId) {
        this.containerId = containerId;
    }

    async render() {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        analyticsTracker.trackPageView('landing');

        container.innerHTML = `
      <div class="landing-page">
        <!-- Hero Section -->
        <section class="hero-section">
          <div class="hero-content">
            <div class="hero-badge">🌳 Web3 × Environmental Impact</div>
            <h1 class="hero-title">
              Hi there, Welcome to <span class="gradient-text">ChainTrees</span>! 👋
            </h1>
            <h3 class="hero-subtitle">
              NFT Tree Planting Platform | Blockchain for Good | Carbon Offset Tracking
            </h3>
            <p class="hero-description">
              Welcome to ChainTrees! We're a revolutionary platform combining blockchain technology 
              with real-world environmental impact. Plant digital trees as NFTs, track carbon offsets, 
              trade in our marketplace, and participate in DAO governance - all while contributing to 
              a greener future.
            </p>
            <div class="hero-actions">
              <button class="cta-primary" onclick="window.app?.loadPage('mint')">
                🌱 Start Planting
              </button>
              <button class="cta-secondary" onclick="window.app?.loadPage('marketplace')">
                🛒 Explore Marketplace
              </button>
            </div>
          </div>
          
          <div class="hero-visual">
            <div class="floating-card">
              <div class="tree-showcase">
                <div class="tree-icon">🌲</div>
                <div class="tree-info">
                  <div class="tree-name">Ancient Oak #1337</div>
                  <div class="tree-rarity legendary">Legendary</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- Stats Section -->
        <section class="stats-section">
          <h2 class="section-title">📊 Platform Stats</h2>
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-icon">🌳</div>
              <div class="stat-value">10,000+</div>
              <div class="stat-label">Trees Planted</div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">👥</div>
              <div class="stat-value">2,500+</div>
              <div class="stat-label">Active Planters</div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">💰</div>
              <div class="stat-value">50 ETH</div>
              <div class="stat-label">Trading Volume</div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">🌍</div>
              <div class="stat-value">25 Tons</div>
              <div class="stat-label">CO₂ Offset</div>
            </div>
          </div>
        </section>

        <!-- Features Section -->
        <section class="features-section">
          <h2 class="section-title">✨ What We Offer</h2>
          <div class="features-grid">
            <div class="feature-card">
              <div class="feature-icon">🎨</div>
              <h3 class="feature-title">Unique NFTs</h3>
              <p class="feature-description">
                Mint unique tree NFTs with different species, rarities, and attributes. 
                Each tree is stored on IPFS with verifiable metadata.
              </p>
            </div>
            
            <div class="feature-card">
              <div class="feature-icon">🎮</div>
              <h3 class="feature-title">Gamification</h3>
              <p class="feature-description">
                Level up your trees, complete quests, earn achievements, and climb the 
                leaderboard. Daily rewards keep you engaged!
              </p>
            </div>
            
            <div class="feature-card">
              <div class="feature-icon">🛒</div>
              <h3 class="feature-title">Marketplace</h3>
              <p class="feature-description">
                Trade trees in our vibrant marketplace. List for sale, participate in 
                auctions, or make direct offers.
              </p>
            </div>
            
            <div class="feature-card">
              <div class="feature-icon">🗳️</div>
              <h3 class="feature-title">DAO Governance</h3>
              <p class="feature-description">
                Shape the future of ChainTrees through proposals and voting. Delegate 
                your power or create proposals yourself.
              </p>
            </div>
            
            <div class="feature-card">
              <div class="feature-icon">📱</div>
              <h3 class="feature-title">Mobile-First PWA</h3>
              <p class="feature-description">
                Fully responsive design with offline support, push notifications, and 
                touch gestures for the best mobile experience.
              </p>
            </div>
            
            <div class="feature-card">
              <div class="feature-icon">🌍</div>
              <h3 class="feature-title">Real Impact</h3>
              <p class="feature-description">
                Track your carbon offset contribution and see the real-world environmental 
                impact of your digital forest.
              </p>
            </div>
          </div>
        </section>

        <!-- Tech Stack Section -->
        <section class="tech-section">
          <h2 class="section-title">🛠️ Built With</h2>
          <div class="tech-grid">
            <div class="tech-badge">
              <span class="tech-icon">⚡</span>
              <span>Vite</span>
            </div>
            <div class="tech-badge">
              <span class="tech-icon">🔗</span>
              <span>WalletConnect</span>
            </div>
            <div class="tech-badge">
              <span class="tech-icon">📦</span>
              <span>IPFS</span>
            </div>
            <div class="tech-badge">
              <span class="tech-icon">🎨</span>
              <span>Vanilla JS</span>
            </div>
            <div class="tech-badge">
              <span class="tech-icon">💎</span>
              <span>Ethereum</span>
            </div>
            <div class="tech-badge">
              <span class="tech-icon">🚀</span>
              <span>Vercel</span>
            </div>
          </div>
        </section>

        <!-- CTA Section -->
        <section class="cta-section">
          <div class="cta-content">
            <h2 class="cta-title">Ready to Make an Impact?</h2>
            <p class="cta-description">
              Join thousands of planters building a greener future through blockchain technology.
            </p>
            <button class="cta-primary large" onclick="window.app?.loadPage('mint')">
              🌱 Plant Your First Tree
            </button>
          </div>
        </section>

        <!-- Footer -->
        <footer class="landing-footer">
          <div class="footer-content">
            <div class="footer-brand">
              <div class="footer-logo">🌳 ChainTrees</div>
              <p class="footer-tagline">Building a greener future, one tree at a time.</p>
            </div>
            <div class="footer-links">
              <div class="footer-column">
                <h4>Platform</h4>
                <a href="#" onclick="window.app?.loadPage('mint')">Plant Trees</a>
                <a href="#" onclick="window.app?.loadPage('marketplace')">Marketplace</a>
                <a href="#" onclick="window.app?.loadPage('governance')">Governance</a>
              </div>
              <div class="footer-column">
                <h4>Community</h4>
                <a href="https://github.com/CasmanKaido/ChainTrees" target="_blank">GitHub</a>
                <a href="#">Discord</a>
                <a href="#">Twitter</a>
              </div>
              <div class="footer-column">
                <h4>Resources</h4>
                <a href="#">Documentation</a>
                <a href="#">Whitepaper</a>
                <a href="#">FAQ</a>
              </div>
            </div>
          </div>
          <div class="footer-bottom">
            <p>© 2025 ChainTrees • Built with 🌱 for a greener future</p>
          </div>
        </footer>
      </div>
    `;

        this.addAnimations();
    }

    addAnimations() {
        // Intersection Observer for scroll animations
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.stat-card, .feature-card, .tech-badge').forEach(el => {
            observer.observe(el);
        });
    }
}
