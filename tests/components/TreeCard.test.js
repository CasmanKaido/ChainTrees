import { describe, it, expect, vi } from 'vitest';
import { TreeCard } from '../../src/components/TreeCard.js';

describe('TreeCard', () => {
    const mockTree = {
        id: 1,
        species: 0, // Oak
        growthStage: 1, // Sapling
        waterCount: 5,
        carbonOffset: 10,
        generationSeed: 123
    };

    it('should render tree details correctly', () => {
        const component = new TreeCard(mockTree);
        const html = component.render();

        expect(html).toContain('Oak');
        expect(html).toContain('#1');
        expect(html).toContain('10g CO2');
    });

    it('should handle water button click', () => {
        // Mock window.waterTree
        window.waterTree = vi.fn();

        const component = new TreeCard(mockTree);
        document.body.innerHTML = component.render();

        // Simulate finding the button (in a real DOM environment)
        // Since we're just testing string generation here, we check if the onclick attribute is present
        expect(document.body.innerHTML).toContain('onclick="window.waterTree(1)"');
    });
});
