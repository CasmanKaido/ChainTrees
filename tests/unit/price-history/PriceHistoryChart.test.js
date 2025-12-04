import { describe, it, expect, beforeEach, vi } from 'vitest';
import { PriceHistoryChart } from '../../../src/components/PriceHistoryChart.js';

describe('PriceHistoryChart Component', () => {
    let chartInstance;
    let mockCtx;

    beforeEach(() => {
        // Mock canvas context
        mockCtx = {
            getContext: vi.fn(() => ({
                // Chart.js methods used by the component
                destroy: vi.fn(),
                update: vi.fn()
            }))
        };
        document.body.innerHTML = '<canvas id="price-chart"></canvas>';
        document.querySelector = vi.fn(() => mockCtx);
    });

    it('should render chart with provided data', () => {
        const data = [
            { date: '2025-01-01', price: 0.5 },
            { date: '2025-02-01', price: 0.8 },
            { date: '2025-03-01', price: 1.2 }
        ];
        chartInstance = new PriceHistoryChart('#price-chart', data);
        chartInstance.render();

        expect(document.querySelector).toHaveBeenCalledWith('#price-chart');
        expect(mockCtx.getContext).toHaveBeenCalledWith('2d');
        // Verify internal data mapping
        expect(chartInstance.data).toEqual(data);
    });

    it('should update chart when setData is called', () => {
        const initial = [{ date: '2025-01-01', price: 0.5 }];
        chartInstance = new PriceHistoryChart('#price-chart', initial);
        chartInstance.render();
        const newData = [
            { date: '2025-04-01', price: 1.5 },
            { date: '2025-05-01', price: 2.0 }
        ];
        chartInstance.setData(newData);
        expect(chartInstance.data).toEqual(newData);
        // Chart.js update should be called
        expect(chartInstance.chart.update).toBeDefined();
    });
});
