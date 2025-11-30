import { AnalyticsChart } from '../components/AnalyticsChart.js';
import { DateRangePicker } from '../components/DateRangePicker.js';
import { walletState } from '../utils/walletState.js';
import '../styles/analytics.css';

export class AnalyticsPage {
    constructor(containerId) {
        this.containerId = containerId;
        this.datePicker = new DateRangePicker((range) => this.handleRangeChange(range));
        this.charts = {};
    }

    render() {
        const container = document.getElementById(this.containerId);
        if (!container) return;

        const account = walletState.getAccount();
        if (!account.isConnected) {
            this.renderConnectWallet(container);
            return;
        }

        container.innerHTML = `
      <div class="analytics-page">
        <div class="analytics-header">
          <div>
            <h1 class="analytics-title">Analytics</h1>
            <p style="color: var(--text-secondary)">Track your environmental impact and growth</p>
          </div>
          
          <div class="analytics-controls">
            <div id="date-picker-wrapper"></div>
            <button class="export-btn" id="export-report-btn">
              <i class="fas fa-download"></i> Export Report
            </button>
          </div>
        </div>

        <div class="stats-summary">
          <div class="summary-card">
            <div class="summary-label">Total Carbon Offset</div>
            <div class="summary-value">2.4 Tons</div>
            <div class="trend-indicator trend-up">
              <i class="fas fa-arrow-up"></i> 12% vs last month
            </div>
          </div>
          <div class="summary-card">
            <div class="summary-label">Trees Planted</div>
            <div class="summary-value">45</div>
            <div class="trend-indicator trend-up">
              <i class="fas fa-arrow-up"></i> 5 new this month
            </div>
          </div>
          <div class="summary-card">
            <div class="summary-label">Token Earnings</div>
            <div class="summary-value">1,250 TREE</div>
            <div class="trend-indicator trend-up">
              <i class="fas fa-arrow-up"></i> 8% APY
            </div>
          </div>
        </div>

        <div class="charts-grid">
          <div class="chart-card">
            <div class="chart-header">
              <div class="chart-title">Carbon Offset Growth</div>
              <div class="chart-legend">
                <div class="legend-item">
                  <div class="legend-dot" style="background: #0ea5e9"></div>
                  <span>Your Offset</span>
                </div>
              </div>
            </div>
            <div class="chart-container">
              <canvas id="carbon-chart"></canvas>
            </div>
          </div>

          <div class="chart-card">
            <div class="chart-header">
              <div class="chart-title">Token Rewards</div>
              <div class="chart-legend">
                <div class="legend-item">
                  <div class="legend-dot" style="background: #10b981"></div>
                  <span>Staking</span>
                </div>
                <div class="legend-item">
                  <div class="legend-dot" style="background: #8b5cf6"></div>
                  <span>Quizzes</span>
                </div>
              </div>
            </div>
            <div class="chart-container">
              <canvas id="rewards-chart"></canvas>
            </div>
          </div>
        </div>
      </div>
    `;

        // Render Date Picker
        const dateWrapper = document.getElementById('date-picker-wrapper');
        dateWrapper.innerHTML = this.datePicker.render();
        this.datePicker.attachListeners(dateWrapper);

        // Initialize Charts
        this.initCharts();
        this.attachListeners();
    }

    renderConnectWallet(container) {
        container.innerHTML = `
      <div class="analytics-page">
        <div class="empty-state" style="text-align: center; padding: 4rem;">
          <span style="font-size: 4rem;">📊</span>
          <h2>Connect Wallet</h2>
          <p>Connect your wallet to view your analytics.</p>
        </div>
      </div>
    `;
    }

    initCharts() {
        // Carbon Chart
        this.charts.carbon = new AnalyticsChart('carbon-chart', {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Carbon Offset (kg)',
                    data: [100, 250, 400, 600, 850, 1200],
                    borderColor: '#0ea5e9',
                    backgroundColor: 'rgba(14, 165, 233, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            }
        });
        this.charts.carbon.render();

        // Rewards Chart
        this.charts.rewards = new AnalyticsChart('rewards-chart', {
            type: 'bar',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [
                    {
                        label: 'Staking',
                        data: [50, 60, 75, 80, 95, 110],
                        backgroundColor: '#10b981',
                        borderRadius: 4
                    },
                    {
                        label: 'Quizzes',
                        data: [20, 30, 25, 40, 35, 50],
                        backgroundColor: '#8b5cf6',
                        borderRadius: 4
                    }
                ]
            },
            options: {
                scales: {
                    x: { stacked: true },
                    y: { stacked: true }
                }
            }
        });
        this.charts.rewards.render();
    }

    handleRangeChange(range) {
        console.log(`Date range changed to: ${range}`);
        // Mock data update
        const multiplier = range === '7d' ? 0.2 : range === '90d' ? 2 : 1;

        this.charts.carbon.update({
            labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
            datasets: [{
                label: 'Carbon Offset (kg)',
                data: [100, 200, 300, 400].map(v => v * multiplier),
                borderColor: '#0ea5e9',
                backgroundColor: 'rgba(14, 165, 233, 0.1)',
                fill: true,
                tension: 0.4
            }]
        });
    }

    attachListeners() {
        const exportBtn = document.getElementById('export-report-btn');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => {
                alert('Generating report... (Mock download started)');
            });
        }
    }
}
