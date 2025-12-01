import Chart from 'chart.js/auto'

export class AnalyticsChart {
  constructor(containerId, config) {
    this.containerId = containerId
    this.config = config
    this.chart = null
  }

  render() {
    const ctx = document.getElementById(this.containerId)
    if (!ctx) return

    if (this.chart) {
      this.chart.destroy()
    }

    this.chart = new Chart(ctx, {
      type: this.config.type || 'line',
      data: this.config.data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false // Custom legend handled in CSS
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: {
              color: 'rgba(255, 255, 255, 0.1)'
            },
            ticks: {
              color: '#94a3b8'
            }
          },
          x: {
            grid: {
              display: false
            },
            ticks: {
              color: '#94a3b8'
            }
          }
        },
        ...this.config.options
      }
    })
  }

  update(newData) {
    if (this.chart) {
      this.chart.data = newData
      this.chart.update()
    }
  }
}
