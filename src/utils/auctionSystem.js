export class AuctionSystem {
    constructor() {
        this.storageKey = 'chaintrees_auctions';
        this.auctions = this.loadAuctions();
    }

    loadAuctions() {
        const stored = localStorage.getItem(this.storageKey);
        return stored ? JSON.parse(stored) : [];
    }

    save() {
        localStorage.setItem(this.storageKey, JSON.stringify(this.auctions));
    }

    /**
     * Create a new auction
     */
    createAuction(tree, startPrice, durationHours, seller) {
        const endTime = new Date();
        endTime.setHours(endTime.getHours() + durationHours);

        const auction = {
            id: `auction_${Date.now()}`,
            tree,
            startPrice: parseFloat(startPrice),
            currentBid: parseFloat(startPrice),
            highestBidder: null,
            seller,
            endTime: endTime.toISOString(),
            status: 'ACTIVE',
            bids: []
        };

        this.auctions.push(auction);
        this.save();
        return auction;
    }

    /**
     * Place a bid on an auction
     */
    placeBid(auctionId, bidAmount, bidder) {
        const auction = this.auctions.find(a => a.id === auctionId);
        if (!auction) throw new Error('Auction not found');
        if (auction.status !== 'ACTIVE') throw new Error('Auction ended');
        if (new Date(auction.endTime) < new Date()) throw new Error('Auction expired');
        if (bidAmount <= auction.currentBid) throw new Error('Bid too low');

        auction.currentBid = parseFloat(bidAmount);
        auction.highestBidder = bidder;
        auction.bids.push({
            bidder,
            amount: parseFloat(bidAmount),
            timestamp: new Date().toISOString()
        });

        this.save();
        return auction;
    }

    getAuctions() {
        return this.auctions.filter(a => a.status === 'ACTIVE' && new Date(a.endTime) > new Date());
    }
}

export const auctionSystem = new AuctionSystem();
