import { marketplaceService } from '../services/marketplaceService.js'
import { walletState } from '../utils/walletState.js'

export class MarketplaceGrid {
  constructor(containerId) {
    this.containerId = containerId
    this.filters = {
      sort: 'newest',
      species: ''
    }
  }

  render() {
    const container = document.getElementById(this.containerId)
    if (!container) return

    // Generate mock listings if empty
    if (marketplaceService.getListings().length === 0) {
      this.generateMockListings()
    }

    const listings = marketplaceService.getListings(this.filters)

    container.innerHTML = `
      <div class="market-grid">
        ${listings.map(listing => this.renderCard(listing)).join('')}
      </div>
    `
  }

  renderCard(listing) {
    return `
      <div class="listing-card">
        <div class="listing-image">
          🌲
          <span class="listing-badge">Lvl ${listing.tree.level || 1}</span>
        </div>
        <div class="listing-info">
          <div class="listing-title">${listing.tree.species} Tree</div>
          <div class="listing-meta">
            <span>Seller: ${listing.seller.substr(0, 4)}...</span>
            <span>#${listing.tree.id}</span>
          </div>
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem">
            <div class="listing-price">
              ${listing.price} ETH
            </div>
            <div style="font-size:0.8rem; color:#94a3b8">
              ≈ $${(listing.price * 2000).toFixed(2)}
            </div>
          </div>
          <button class="buy-btn" onclick="window.buyListing('${listing.id}')">
            Buy Now
          </button>
        </div>
      </div>
    `
  }

  generateMockListings() {
    const species = ['Oak', 'Pine', 'Maple', 'Birch']
    for (let i = 0; i < 8; i++) {
      marketplaceService.createListing(
        {
          id: 1000 + i,
          species: species[Math.floor(Math.random() * species.length)],
          level: Math.floor(Math.random() * 10) + 1
        },
        (Math.random() * 0.5 + 0.01).toFixed(3),
        `0x${Math.random().toString(16).substr(2, 40)}`
      )
    }
  }

  updateFilters(newFilters) {
    this.filters = { ...this.filters, ...newFilters }
    this.render()
  }
}
