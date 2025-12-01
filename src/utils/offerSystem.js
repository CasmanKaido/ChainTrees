export class OfferSystem {
  constructor() {
    this.storageKey = 'chaintrees_offers'
    this.offers = this.loadOffers()
  }

  loadOffers() {
    const stored = localStorage.getItem(this.storageKey)
    return stored ? JSON.parse(stored) : []
  }

  save() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.offers))
  }

  /**
   * Make an offer on any tree (even if not listed)
   */
  makeOffer(treeId, amount, bidder) {
    const offer = {
      id: `offer_${Date.now()}`,
      treeId,
      amount: parseFloat(amount),
      bidder,
      createdAt: new Date().toISOString(),
      status: 'PENDING' // PENDING, ACCEPTED, REJECTED, CANCELLED
    }

    this.offers.push(offer)
    this.save()
    return offer
  }

  /**
   * Accept an offer
   */
  acceptOffer(offerId, seller) {
    const offer = this.offers.find(o => o.id === offerId)
    if (!offer) throw new Error('Offer not found')
    if (offer.status !== 'PENDING') throw new Error('Offer not active')

    // In real app, verify seller owns treeId

    offer.status = 'ACCEPTED'
    offer.acceptedAt = new Date().toISOString()
    this.save()
    return offer
  }

  /**
   * Reject an offer
   */
  rejectOffer(offerId, seller) {
    const offer = this.offers.find(o => o.id === offerId)
    if (!offer) throw new Error('Offer not found')

    offer.status = 'REJECTED'
    this.save()
  }

  getOffersForTree(treeId) {
    return this.offers.filter(o => o.treeId === treeId && o.status === 'PENDING')
  }

  getOffersFromUser(userAddress) {
    return this.offers.filter(o => o.bidder === userAddress)
  }
}

export const offerSystem = new OfferSystem()
