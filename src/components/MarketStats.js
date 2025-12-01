import { marketplaceService } from '../services/marketplaceService.js'
import { auctionSystem } from '../utils/auctionSystem.js'
import { MarketAnalytics } from '../utils/marketAnalytics.js'

export class MarketStats {
  constructor(containerId) {
    this.containerId = containerId
    this.analytics = new MarketAnalytics(marketplaceService, auctionSystem)
  }

  render() {
    const container = document.getElementById(this.containerId)
    if (!container) return

    const volume = this.analytics.getTotalVolume().toFixed(2)
    const floorOak = this.analytics.getFloorPrice('Oak').toFixed(3)
    const floorPine = this.analytics.getFloorPrice('Pine').toFixed(3)
    const avgPrice = this.analytics.getAveragePrice().toFixed(3)

    container.innerHTML = `
      <div class="profile-stats-grid" style="margin-bottom:2rem">
        <div class="stat-box">
          <div class="stat-value">Ξ ${volume}</div>
          <div class="stat-label">Total Volume</div>
        </div>
        <div class="stat-box">
          <div class="stat-value">Ξ ${floorOak}</div>
          <div class="stat-label">Oak Floor</div>
        </div>
        <div class="stat-box">
          <div class="stat-value">Ξ ${floorPine}</div>
          <div class="stat-label">Pine Floor</div>
        </div>
        <div class="stat-box">
          <div class="stat-value">Ξ ${avgPrice}</div>
          <div class="stat-label">Avg Price</div>
        </div>
      </div>
    `
  }
}
