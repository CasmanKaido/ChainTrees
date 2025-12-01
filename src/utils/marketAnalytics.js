export class MarketAnalytics {
  constructor(marketplaceService, auctionService) {
    this.marketplace = marketplaceService
    this.auctions = auctionService
  }

  /**
   * Get total volume in ETH
   */
  getTotalVolume() {
    const soldListings = this.marketplace.listings.filter(l => l.status === 'SOLD')
    const soldAuctions = this.auctions.auctions.filter(a => a.status === 'ENDED' && a.highestBidder)

    const listingVol = soldListings.reduce((acc, l) => acc + l.price, 0)
    const auctionVol = soldAuctions.reduce((acc, a) => acc + a.currentBid, 0)

    return listingVol + auctionVol
  }

  /**
   * Get floor price for a species
   */
  getFloorPrice(species) {
    const active = this.marketplace.getListings({ species, sort: 'price_asc' })
    return active.length > 0 ? active[0].price : 0
  }

  /**
   * Get average price for a species
   */
  getAveragePrice(species) {
    const sold = this.marketplace.listings.filter(
      l => l.status === 'SOLD' && (!species || l.tree.species === species)
    )

    if (sold.length === 0) return 0
    const total = sold.reduce((acc, l) => acc + l.price, 0)
    return total / sold.length
  }

  /**
   * Get recent sales
   */
  getRecentSales(limit = 5) {
    const sold = this.marketplace.listings
      .filter(l => l.status === 'SOLD')
      .sort((a, b) => new Date(b.soldAt) - new Date(a.soldAt))
      .slice(0, limit)

    return sold
  }
}
