import { MarketplaceListing } from '../components/MarketplaceListing.js';
import { ListTreeModal } from '../components/ListTreeModal.js';
import { walletState } from '../utils/walletState.js';
import '../styles/marketplace.css';

export class MarketplacePage {
    constructor(containerId) {
        this.containerId = containerId;
        this.listings = []; // Mock data
        this.listModal = new ListTreeModal((id, price) => this.handleList(id, price));
    }

    async render() {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        // Mock listings
        this.listings = [
            { id: 101, price: '0.05', seller: '0x123...abc', treeData: { species: 0, generationSeed: 123, growthStage: 2 } },
            { id: 102, price: '0.12', seller: '0x456...def', treeData: { species: 2, generationSeed: 456, growthStage: 3 } },
            { id: 103, price: '0.08', seller: '0x789...ghi', treeData: { species: 1, generationSeed: 789, growthStage: 1 } }
        ];

        container.innerHTML = `
      <div class="marketplace-page">
        <div class="marketplace-header">
          <div>
            <h1 class="marketplace-title">Marketplace</h1>
            <p style="color: var(--text-secondary)">Buy and sell unique trees from the community</p>
          </div>
          
          <div class="marketplace-stats">
            <div class="market-stat">
              <span class="market-stat-label">Floor Price</span>
              <span class="market-stat-value">0.05 ETH</span>
            </div>
            <div class="market-stat">
              <span class="market-stat-label">Volume</span>
              <span class="market-stat-value">12.5 ETH</span>
            </div>
            <button class="buy-btn" id="sell-tree-btn" style="width: auto; padding: 0.5rem 1.5rem;">
              Sell Tree
            </button>
          </div>
        </div>

        <div id="listings-grid" class="listings-grid">
          <!-- Listings injected here -->
        </div>
      </div>
    `;

        this.renderListings();
        this.attachListeners();
    }

    renderListings() {
        const grid = document.getElementById('listings-grid');
        if (!grid) return;

        grid.innerHTML = this.listings.map(listing => {
            const component = new MarketplaceListing(listing, (item) => this.handleBuy(item));
            return component.render();
        }).join('');

        // Attach listeners
        this.listings.forEach(listing => {
            const component = new MarketplaceListing(listing, (item) => this.handleBuy(item));
            component.attachListeners(grid);
        });
    }

    attachListeners() {
        const sellBtn = document.getElementById('sell-tree-btn');
        if (sellBtn) {
            sellBtn.addEventListener('click', () => {
                const account = walletState.getAccount();
                if (!account.isConnected) {
                    alert('Please connect your wallet first');
                    return;
                }
                // Mock user trees
                const mockTrees = [
                    { id: 1, species: 'Oak' },
                    { id: 2, species: 'Pine' }
                ];
                this.listModal.open(mockTrees);
            });
        }
    }

    async handleBuy(listing) {
        const account = walletState.getAccount();
        if (!account.isConnected) {
            alert('Please connect your wallet to buy');
            return;
        }

        if (!confirm(`Buy Tree #${listing.id} for ${listing.price} ETH?`)) return;

        try {
            // await contractService.buyTree(listing.id, listing.price);
            alert('Purchase successful! (Mock)');
            // Remove listing
            this.listings = this.listings.filter(l => l.id !== listing.id);
            this.renderListings();
        } catch (error) {
            alert('Purchase failed: ' + error.message);
        }
    }

    async handleList(treeId, price) {
        try {
            // await contractService.listTree(treeId, price);
            alert(`Tree #${treeId} listed for ${price} ETH! (Mock)`);
            // Add to listings (mock)
            this.listings.unshift({
                id: treeId,
                price: price,
                seller: walletState.getAccount().address,
                treeData: { species: 0, generationSeed: Math.random(), growthStage: 1 }
            });
            this.renderListings();
        } catch (error) {
            alert('Listing failed: ' + error.message);
        }
    }
}
