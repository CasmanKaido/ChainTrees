// src/pages/CollectionStats.js
import { Chart } from 'chart.js/auto';
import { rarityCalculator } from '../utils/rarityCalculator.js';

export class CollectionStats {
    /**
     * @param {HTMLElement} container element where the stats will be rendered
     * @param {Array<Object>} listings array of marketplace listings
     */
    constructor(container, listings = []) {
        this.container = container;
        this.listings = listings;
    }

    /** Compute aggregated stats */
    computeStats() {
        const total = this.listings.length;
        const floorPrice = Math.min(...this.listings.map(l => parseFloat(l.price)) || 0;
        const avgPrice = this.listings.reduce((sum, l) => sum + parseFloat(l.price), 0) / (total || 1);
        const volume = this.listings.reduce((sum, l) => sum + parseFloat(l.price), 0);
        const rarityScores = this.listings.map(l => rarityCalculator.computeScore(l.attributes || []));
        const avgRarity = rarityScores.reduce((s, v) => s + v, 0) / (rarityScores.length || 1);
        return { total, floorPrice, avgPrice, volume, avgRarity };
    }

    render() {
        const { total, floorPrice, avgPrice, volume, avgRarity } = this.computeStats();
        this.container.innerHTML = `
      <section class="collection-stats">
        <h2>Collection Statistics</h2>
        <div class="stats-grid">
          <div class="stat-item"><strong>Total NFTs</strong><span>${total}</span></div>
          <div class="stat-item"><strong>Floor Price (ETH)</strong><span>${floorPrice.toFixed(3)}</span></div>
          <div class="stat-item"><strong>Average Price (ETH)</strong><span>${avgPrice.toFixed(3)}</span></div>
          <div class="stat-item"><strong>24h Volume (ETH)</strong><span>${volume.toFixed(3)}</span></div>
          <div class="stat-item"><strong>Avg Rarity Score</strong><span>${avgRarity.toFixed(1)}</span></div>
        </div>
        <canvas id="price-history-chart" width="400" height="200"></canvas>
      </section>
    `;
        this.renderPriceHistoryChart();
    }

    renderPriceHistoryChart() {
        const ctx = this.container.querySelector('#price-history-chart').getContext('2d');
        const priceByDate = {};
        this.listings.forEach(l => {
            const date = new Date(l.listed).toLocaleDateString();
            priceByDate[date] = (priceByDate[date] || 0) + parseFloat(l.price);
        });
        const labels = Object.keys(priceByDate);
        const data = Object.values(priceByDate);
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels,
                datasets: [{
                    label: 'Daily Volume (ETH)',
                    data,
                    backgroundColor: 'rgba(33,150,243,0.6)'
                }]
            },
            options: {
                responsive: true,
                plugins: { legend: { position: 'top' } }
            }
        });
    }
}
