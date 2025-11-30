import { auctionSystem } from '../utils/auctionSystem.js';

export class AuctionGrid {
    constructor(containerId) {
        this.containerId = containerId;
        this.timers = [];
    }

    render() {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        // Generate mock auctions if empty
        if (auctionSystem.getAuctions().length === 0) {
            this.generateMockAuctions();
        }

        const auctions = auctionSystem.getAuctions();

        container.innerHTML = `
      <h2 style="margin:2rem 0 1rem; color:#fbbf24">🔥 Live Auctions</h2>
      <div class="market-grid">
        ${auctions.map(auction => this.renderCard(auction)).join('')}
      </div>
    `;

        this.startTimers(auctions);
    }

    renderCard(auction) {
        return `
      <div class="listing-card auction-card" id="auction-${auction.id}">
        <div class="auction-timer" data-end="${auction.endTime}">
          Loading...
        </div>
        <div class="listing-image">
          🌳
          <span class="listing-badge">Lvl ${auction.tree.level}</span>
        </div>
        <div class="listing-info">
          <div class="listing-title">${auction.tree.species} (Rare)</div>
          
          <div class="auction-bid-area">
            <div>
              <div class="current-bid-label">Current Bid</div>
              <div class="current-bid-value">${auction.currentBid} ETH</div>
              <div style="font-size:0.8rem; color:#94a3b8">
                by ${auction.highestBidder ? auction.highestBidder.substr(0, 6) + '...' : 'None'}
              </div>
            </div>

            <div class="bid-input-group">
              <input type="number" step="0.01" class="bid-input" placeholder="Bid..." id="bid-input-${auction.id}">
              <button class="place-bid-btn" onclick="window.placeBid('${auction.id}')">Bid</button>
            </div>

            <div class="bid-history">
              ${auction.bids.slice().reverse().map(bid => `
                <div class="bid-row">
                  <span>${bid.bidder.substr(0, 6)}...</span>
                  <span>${bid.amount} ETH</span>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
    }

    startTimers(auctions) {
        // Clear old timers
        this.timers.forEach(clearInterval);
        this.timers = [];

        auctions.forEach(auction => {
            const element = document.querySelector(`#auction-${auction.id} .auction-timer`);
            if (!element) return;

            const update = () => {
                const now = new Date();
                const end = new Date(auction.endTime);
                const diff = end - now;

                if (diff <= 0) {
                    element.textContent = 'ENDED';
                    return;
                }

                const h = Math.floor(diff / (1000 * 60 * 60));
                const m = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                const s = Math.floor((diff % (1000 * 60)) / 1000);

                element.textContent = `${h}h ${m}m ${s}s`;
            };

            update();
            this.timers.push(setInterval(update, 1000));
        });
    }

    generateMockAuctions() {
        const species = ['Golden Oak', 'Crystal Pine', 'Ancient Willow'];
        for (let i = 0; i < 3; i++) {
            auctionSystem.createAuction(
                {
                    id: 5000 + i,
                    species: species[i],
                    level: 10
                },
                (Math.random() * 2 + 1).toFixed(2),
                24, // 24 hours
                `0x${Math.random().toString(16).substr(2, 40)}`
            );
        }
    }
}
