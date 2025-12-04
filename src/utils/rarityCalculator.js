// src/utils/rarityCalculator.js
/**
 * Calculates rarity score for a tree NFT based on its attributes.
 * The algorithm assigns a weight to each attribute rarity tier.
 * Example tiers: common (1), uncommon (2), rare (3), epic (4), legendary (5).
 * The final score is the sum of weights normalized to a 0‑100 scale.
 */
export const rarityCalculator = {
    /**
     * Compute rarity score.
     * @param {Array<{trait_type:string, value:string, rarity:string}>} attributes
     * @returns {number} score 0‑100
     */
    computeScore(attributes) {
        if (!Array.isArray(attributes) || attributes.length === 0) return 0;
        const rarityWeights = {
            common: 1,
            uncommon: 2,
            rare: 3,
            epic: 4,
            legendary: 5
        };
        let totalWeight = 0;
        let maxPossible = 0;
        attributes.forEach(attr => {
            const weight = rarityWeights[attr.rarity?.toLowerCase()] || 1;
            totalWeight += weight;
            maxPossible += Math.max(...Object.values(rarityWeights));
        });
        const score = (totalWeight / maxPossible) * 100;
        return Math.round(score * 100) / 100; // two decimal places
    }
};
