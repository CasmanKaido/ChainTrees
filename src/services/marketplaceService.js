export class MarketplaceService {
  constructor() {
    this.storageKey = 'chaintrees_market_listings'
    this.listings = this.loadListings()
  }

  loadListings() {
    const stored = localStorage.getItem(this.storageKey)
    return stored ? JSON.parse(stored) : []
  }

  save() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.listings))
  }

  /**
   * Create a new listing
   * @param {object} tree Tree data
   * @param {number} price Price in ETH
   * @param {string} seller Seller address
   */
  createListing(tree, price, seller) {
    const listing = {
      id: `listing_${Date.now()}`,
      tree,
      price: parseFloat(price),
      seller,
      createdAt: new Date().toISOString(),
      status: 'ACTIVE' // ACTIVE, SOLD, CANCELLED
    }

    this.listings.push(listing)
    this.save()
    return listing
  }

  /**
   * Cancel a listing
   */
  cancelListing(listingId, seller) {
    const listing = this.listings.find(l => l.id === listingId)
    if (!listing) throw new Error('Listing not found')
    if (listing.seller !== seller) throw new Error('Unauthorized')

    listing.status = 'CANCELLED'
    this.save()
  }

  /**
   * Buy a listing
   */
  buyListing(listingId, buyer) {
    const listing = this.listings.find(l => l.id === listingId)
    if (!listing) throw new Error('Listing not found')
    if (listing.status !== 'ACTIVE') throw new Error('Listing not active')

    listing.status = 'SOLD'
    listing.buyer = buyer
    listing.soldAt = new Date().toISOString()

    this.save()
    return listing
  }

  getListings(filter = {}) {
    let result = this.listings.filter(l => l.status === 'ACTIVE')

    if (filter.minPrice) result = result.filter(l => l.price >= filter.minPrice)
    if (filter.maxPrice) result = result.filter(l => l.price <= filter.maxPrice)
    if (filter.species) result = result.filter(l => l.tree.species === filter.species)

    if (filter.sort === 'price_asc') result.sort((a, b) => a.price - b.price)
    if (filter.sort === 'price_desc') result.sort((a, b) => b.price - a.price)
    if (filter.sort === 'newest')
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))

    return result
  }
}

export const marketplaceService = new MarketplaceService()
