import { marketplaceService } from '../services/marketplaceService.js'
import { MarketplaceGrid } from '../components/MarketplaceGrid.js'
import { AuctionGrid } from '../components/AuctionGrid.js'
import { MarketStats } from '../components/MarketStats.js'
import { auctionSystem } from '../utils/auctionSystem.js'

export class MarketplacePage {
  constructor(containerId) {
    this.containerId = containerId
    this.grid = new MarketplaceGrid('market-listings-container')
    this.auctionGrid = new AuctionGrid('auction-listings-container')
    this.stats = new MarketStats('market-stats-container')
  }

  async render() {
    const container = document.getElementById(this.containerId)
    if (!container) return

    container.innerHTML = `
      <div class="market-container">
        <div class="market-header">
          <div>
            <h1 style="margin:0; font-size:2rem; background:linear-gradient(45deg, #10b981, #3b82f6); -webkit-background-clip:text; -webkit-text-fill-color:transparent;">
              NFT Marketplace
            </h1>
            <p style="color:#94a3b8; margin-top:0.5rem">Buy, sell, and trade unique digital trees.</p>
          </div>
          <button class="add-btn" onclick="window.openCreateListing()">
            + Create Listing
          </button>
        </div>

        <div id="market-stats-container"></div>

        <div id="auction-listings-container"></div>

        <h2 style="margin:2rem 0 1rem; color:#e2e8f0">🌲 Standard Listings</h2>

        <div class="market-filters">
          <div class="filter-group">
            <span style="color:#94a3b8">Sort by:</span>
            <select class="filter-select" id="market-sort">
              <option value="newest">Newest</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>
          
          <div class="filter-group">
            <span style="color:#94a3b8">Species:</span>
            <select class="filter-select" id="market-species">
              <option value="">All Species</option>
              <option value="Oak">Oak</option>
              <option value="Pine">Pine</option>
              <option value="Maple">Maple</option>
              <option value="Birch">Birch</option>
            </select>
          </div>
        </div>

        <div id="market-listings-container"></div>
      </div>
    `

    this.stats.render()
    this.auctionGrid.render()
    this.grid.render()
    this.attachListeners()
  }

  attachListeners() {
    document.getElementById('market-sort').addEventListener('change', e => {
      this.grid.updateFilters({ sort: e.target.value })
    })

    document.getElementById('market-species').addEventListener('change', e => {
      this.grid.updateFilters({ species: e.target.value })
    })

    // Global buy handler
    window.buyListing = async listingId => {
      if (confirm('Confirm purchase? This will deduct ETH from your wallet.')) {
        try {
          await marketplaceService.buyListing(listingId, '0xUserWallet')
          alert('Purchase successful! 🌳')
          this.grid.render()
        } catch (e) {
          alert(e.message)
        }
      }
    }

    // Global bid handler
    window.placeBid = async auctionId => {
      const input = document.getElementById(`bid-input-${auctionId}`)
      const amount = input.value

      if (!amount) return alert('Enter bid amount')

      try {
        await auctionSystem.placeBid(auctionId, amount, '0xUserWallet')
        alert('Bid placed successfully! 🔥')
        this.auctionGrid.render()
      } catch (e) {
        alert(e.message)
      }
    }

    // Global create handler (placeholder)
    window.openCreateListing = () => {
      alert('Select a tree from "My Forest" to list it for sale.')
    }
  }
}
