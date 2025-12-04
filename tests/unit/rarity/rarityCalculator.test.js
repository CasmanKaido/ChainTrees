import { describe, it, expect } from 'vitest';
import { rarityCalculator } from '../../../src/utils/rarityCalculator.js';

describe('rarityCalculator', () => {
    it('should compute 0 for empty attributes', () => {
        expect(rarityCalculator.computeScore([])).toBe(0);
    });

    it('should compute correct score for mixed rarities', () => {
        const attrs = [
            { trait_type: 'Species', value: 'Oak', rarity: 'common' },
            { trait_type: 'Leaves', value: 'Golden', rarity: 'legendary' },
            { trait_type: 'Height', value: 'Tall', rarity: 'rare' }
        ];
        // weights: 1 + 5 + 3 = 9, max per attr =5, maxPossible=15, score=9/15*100=60
        expect(rarityCalculator.computeScore(attrs)).toBe(60);
    });

    it('should handle unknown rarity as common', () => {
        const attrs = [
            { trait_type: 'Color', value: 'Green', rarity: 'unknown' }
        ];
        expect(rarityCalculator.computeScore(attrs)).toBe(20); // weight 1 of max 5 => 20%
    });
});
