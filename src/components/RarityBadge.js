// src/components/RarityBadge.js
import { rarityCalculator } from '../utils/rarityCalculator.js';
import './RarityBadge.css';

/**
 * RarityBadge displays a visual badge based on NFT attributes.
 * It calculates a rarity score (0‑100) and maps it to a color tier.
 */
export class RarityBadge {
    /**
     * @param {HTMLElement} container element where the badge will be rendered
     * @param {Array<Object>} attributes NFT attribute list
     */
    constructor(container, attributes = []) {
        this.container = container;
        this.attributes = attributes;
    }

    getTier(score) {
        if (score >= 80) return 'legendary';
        if (score >= 60) return 'epic';
        if (score >= 40) return 'rare';
        if (score >= 20) return 'uncommon';
        return 'common';
    }

    render() {
        const score = rarityCalculator.computeScore(this.attributes);
        const tier = this.getTier(score);
        this.container.innerHTML = `
      <div class="rarity-badge ${tier}">
        <span class="score">${score}%</span>
        <span class="tier">${tier.toUpperCase()}</span>
      </div>
    `;
    }
}
