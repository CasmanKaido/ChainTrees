import { describe, it, expect, vi, beforeEach } from 'vitest';
import { RarityBadge } from '../../../src/components/RarityBadge.js';
import { rarityCalculator } from '../../../src/utils/rarityCalculator.js';

describe('RarityBadge Component', () => {
    let container;

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
    });

    it('renders correct tier based on score', () => {
        const attrs = [
            { trait_type: 'Species', rarity: 'legendary' },
            { trait_type: 'Leaves', rarity: 'epic' }
        ];
        // compute score manually using utility
        const score = rarityCalculator.computeScore(attrs);
        const badge = new RarityBadge(container, attrs);
        badge.render();
        const badgeEl = container.querySelector('.rarity-badge');
        expect(badgeEl).toBeTruthy();
        expect(badgeEl.textContent).toContain(`${score}%`);
        // tier class should match score range
        if (score >= 80) expect(badgeEl).toHaveClass('legendary');
        else if (score >= 60) expect(badgeEl).toHaveClass('epic');
        else if (score >= 40) expect(badgeEl).toHaveClass('rare');
        else if (score >= 20) expect(badgeEl).toHaveClass('uncommon');
        else expect(badgeEl).toHaveClass('common');
    });
});
