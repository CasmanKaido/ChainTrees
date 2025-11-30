import Chart from 'chart.js/auto';

export class CarbonChart {
    constructor(containerId, type, data, options = {}) {
        this.containerId = containerId;
        this.type = type;
        this.data = data;
        this.options = options;
        this.chart = null;
    }

    render() {
        const canvas = document.getElementById(this.containerId);
        if (!canvas) return;

        // Destroy existing chart if any
        if (this.chart) {
            this.chart.destroy();
        }

        const defaultOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: '#94a3b8'
                    }
                }
            },
            scales: {
                y: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#94a3b8'
                    }
                },
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.1)'
                    },
                    ticks: {
                        color: '#94a3b8'
                    }
                }
            }
        };

        // Merge options
        const finalOptions = { ...defaultOptions, ...this.options };

        this.chart = new Chart(canvas, {
            type: this.type,
            data: this.data,
            options: finalOptions
        });
    }

    update(newData) {
        if (this.chart) {
            this.chart.data = newData;
            this.chart.update();
        }
    }
}
