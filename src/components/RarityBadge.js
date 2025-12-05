/**
 * RarityBadge Component
 * Displays rarity information for NFT attributes
 */

export class RarityBadge {
    constructor(container, attributes = []) {
        this.container = container
        this.attributes = attributes
    }

    getRarityClass(rarity) {
        const rarityMap = {
            common: 'rarity-common',
            uncommon: 'rarity-uncommon',
            rare: 'rarity-rare',
            epic: 'rarity-epic',
            legendary: 'rarity-legendary'
        }
        return rarityMap[rarity?.toLowerCase()] || 'rarity-common'
    }

    render() {
        const badges = this.attributes.map(attr => `
      <div class="rarity-badge ${this.getRarityClass(attr.rarity)}">
        <span class="badge-trait">${attr.trait_type}</span>
        <span class="badge-rarity">${attr.rarity || 'common'}</span>
      </div>
    `).join('')

        this.container.innerHTML = `
      <div class="rarity-badges">
        ${badges}
      </div>
    `
    }
}
