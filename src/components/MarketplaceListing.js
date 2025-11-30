import { treeGenerator } from '../generators/treeGenerator.js';

export class MarketplaceListing {
    constructor(listing, onBuy) {
        this.listing = listing;
        this.onBuy = onBuy;
    }

    render() {
        const { id, price, seller, treeData } = this.listing;
        const svg = treeGenerator.generateSVG(treeData.species, treeData.generationSeed, treeData.growthStage);
        const speciesName = ['Oak', 'Maple', 'Pine', 'Birch'][treeData.species] || 'Unknown';

        return `
      <div class="listing-card">
        <div class="listing-image">
          <div style="width: 120px; height: 120px;">
            ${svg}
          </div>
          <div class="listing-price-tag">
            ${price} ETH
          </div>
        </div>
        
        <div class="listing-info">
          <div class="listing-name">${speciesName} #${id}</div>
          
          <div class="listing-meta">
            <span>Seller: ${seller.substring(0, 6)}...${seller.substring(38)}</span>
            <span>Stage: ${treeGenerator.getStageName(treeData.growthStage)}</span>
          </div>
          
          <button class="buy-btn" data-id="${id}">
            Buy Now
          </button>
        </div>
      </div>
    `;
    }

    attachListeners(container) {
        const btn = container.querySelector(`.buy-btn[data-id="${this.listing.id}"]`);
        if (btn) {
            btn.addEventListener('click', () => this.onBuy(this.listing));
        }
    }
}
