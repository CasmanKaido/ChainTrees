// src/components/PriceHistoryChart.js
import Chart from 'chart.js/auto';

export class PriceHistoryChart {
    /**
     * @param {string} selector CSS selector where the canvas will be rendered
     * @param {Array<{date:string, price:number}>} data Historical price data
     */
    constructor(selector, data = []) {
        this.selector = selector;
        this.data = data;
    }

    setData(data) {
        this.data = data;
        if (this.chart) this.chart.update();
    }

    render() {
        const ctx = document.querySelector(this.selector).getContext('2d');
        const labels = this.data.map(d => new Date(d.date).toLocaleDateString());
        const prices = this.data.map(d => d.price);
        this.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels,
                datasets: [{
                    label: 'Price (ETH)',
                    data: prices,
                    borderColor: '#ff9800',
                    backgroundColor: 'rgba(255,152,0,0.2)',
                    tension: 0.4,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: { position: 'top' },
                    tooltip: { mode: 'index', intersect: false },
                    title: { display: true, text: 'Price History' }
                },
                scales: {
                    x: { display: true, title: { display: true, text: 'Date' } },
                    y: { display: true, title: { display: true, text: 'ETH' } }
                }
            }
        });
    }
}
