import { CarbonChart } from '../components/CarbonChart.js'
import { ImpactCalculator } from '../components/ImpactCalculator.js'
import '../styles/impact-dashboard.css'

export class ImpactDashboard {
  constructor(containerId) {
    this.containerId = containerId
  }

  render() {
    const container = document.getElementById(this.containerId)
    if (!container) return

    container.innerHTML = `
      <div class="impact-dashboard">
        <div class="dashboard-header">
          <h1>Environmental Impact</h1>
          <p>Track the real-world difference your forest is making.</p>
        </div>

        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-icon">🌳</div>
            <div class="stat-info">
              <h3>Total Trees</h3>
              <div class="value">1,234</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">🌍</div>
            <div class="stat-info">
              <h3>Total Offset</h3>
              <div class="value">45.2t</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">👥</div>
            <div class="stat-info">
              <h3>Community Rank</h3>
              <div class="value">#42</div>
            </div>
          </div>
          <div class="stat-card">
            <div class="stat-icon">📅</div>
            <div class="stat-info">
              <h3>Active Since</h3>
              <div class="value">2024</div>
            </div>
          </div>
        </div>

        <div class="calculator-section">
          <h2>Real-World Impact</h2>
          <div id="impact-calculator"></div>
        </div>

        <div class="charts-section">
          <div class="chart-container">
            <h3>Carbon Offset Over Time</h3>
            <canvas id="offset-chart"></canvas>
          </div>
          <div class="chart-container">
            <h3>Species Distribution</h3>
            <canvas id="species-chart"></canvas>
          </div>
        </div>
      </div>
    `

    this.initComponents()
  }

  initComponents() {
    // Initialize Calculator
    const calculator = new ImpactCalculator('impact-calculator', 45200) // 45.2 tons
    calculator.render()

    // Initialize Charts
    this.renderOffsetChart()
    this.renderSpeciesChart()
  }

  renderOffsetChart() {
    const ctx = document.getElementById('offset-chart')
    if (!ctx) return

    new CarbonChart('offset-chart', 'line', {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      datasets: [
        {
          label: 'Carbon Offset (kg)',
          data: [1200, 3500, 8000, 15000, 28000, 45200],
          borderColor: '#4ade80',
          backgroundColor: 'rgba(74, 222, 128, 0.1)',
          fill: true,
          tension: 0.4
        }
      ]
    }).render()
  }

  renderSpeciesChart() {
    const ctx = document.getElementById('species-chart')
    if (!ctx) return

    new CarbonChart(
      'species-chart',
      'doughnut',
      {
        labels: ['Oak', 'Maple', 'Pine', 'Birch', 'Other'],
        datasets: [
          {
            data: [30, 20, 15, 10, 25],
            backgroundColor: ['#22c55e', '#ef4444', '#15803d', '#facc15', '#3b82f6'],
            borderWidth: 0
          }
        ]
      },
      {
        plugins: {
          legend: {
            position: 'right'
          }
        }
      }
    ).render()
  }
}
