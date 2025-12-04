import { describe, it, expect, beforeEach } from 'vitest';
import { LoadingSkeleton } from '../../../src/components/LoadingSkeleton.js';

describe('LoadingSkeleton Component', () => {
    let container;

    beforeEach(() => {
        container = document.createElement('div');
        document.body.appendChild(container);
    });

    it('renders correct number of rows with default options', () => {
        const skeleton = new LoadingSkeleton(container, 4);
        skeleton.render();
        const rows = container.querySelectorAll('.skeleton-row');
        expect(rows.length).toBe(4);
        rows.forEach(row => {
            expect(row.style.width).toBe('100%');
            expect(row.style.height).toBe('1rem');
        });
    });

    it('applies custom width and height', () => {
        const skeleton = new LoadingSkeleton(container, 2, { width: '80%', height: '2rem' });
        skeleton.render();
        const rows = container.querySelectorAll('.skeleton-row');
        expect(rows.length).toBe(2);
        rows.forEach(row => {
            expect(row.style.width).toBe('80%');
            expect(row.style.height).toBe('2rem');
        });
    });
});
