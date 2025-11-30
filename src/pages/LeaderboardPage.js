import { LeaderboardTable } from '../components/LeaderboardTable.js';
import { contractService } from '../services/contractService.js';
import { walletState } from '../utils/walletState.js';
import '../styles/leaderboard.css';

export class LeaderboardPage {
  constructor(containerId) {
    this.containerId = containerId;
    this.stats = { totalTrees: 0, totalCarbon: 0, activePlanters: 0 };
    this.currentMetric = 'trees';
    this.currentTimeframe = 'all';
  }

  async render() {
    const container = document.getElementById(this.containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="leaderboard-page">
        <div class="leaderboard-header">
          <h1 class="leaderboard-title">Global Impact Leaderboard</h1>
          <p>Recognizing the top contributors to our planetary ecosystem.</p>
        </div>

        <div class="global-stats">
          <div class="global-stat-card">
            <div class="global-value" id="total-trees">...</div>
            <div class="global-label">Total Trees Planted</div>
          </div>
          <div class="global-stat-card">
            <div class="global-value" id="total-carbon">...</div>
            <div class="global-label">Total CO2 Offset</div>
          </div>
          <div class="global-stat-card">
            <div class="global-value" id="active-planters">...</div>
            <div class="global-label">Active Planters</div>
          </div>
        </div>

        <div class="leaderboard-controls">
          <div class="metric-filters">
            <button class="filter-btn active" data-metric="trees">Most Trees</button>
            <button class="filter-btn" data-metric="carbon">Highest Impact</button>
            <button class="filter-btn" data-metric="water">Most Active</button>
          </div>
          
          <div class="time-filters">
            <button class="filter-btn" data-time="weekly">Weekly</button>
            <button class="filter-btn" data-time="monthly">Monthly</button>
            <button class="filter-btn active" data-time="all">All Time</button>
          </div>
        </div>

        <div id="leaderboard-table-container" class="leaderboard-table-container">
          <div style="padding: 2rem; text-align: center; color: var(--text-secondary);">
            Loading leaderboard data...
          </div>
        </div>
      </div>
    `;

    this.attachListeners();
    await this.fetchData();
  }

  attachListeners() {
    // Metric filters
    document.querySelectorAll('.metric-filters .filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.metric-filters .filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentMetric = btn.dataset.metric;
        this.updateTable();
      });
    });

    // Time filters
    document.querySelectorAll('.time-filters .filter-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.time-filters .filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentTimeframe = btn.dataset.time;
        // In a real app, we'd fetch different data here
        this.updateTable();
      });
    });
  }

  async fetchData() {
    try {
      // Fetch global stats
      // const stats = await contractService.getGlobalStats();
      // Mock stats for now
      this.stats = {
        totalTrees: 1234,
        totalCarbon: 45200,
        activePlanters: 156
      };

      this.updateStats();

      // Mock leaderboard data
      this.leaderboardData = this.generateMockData(20);

      // Initialize table
      this.table = new LeaderboardTable('leaderboard-table-container', this.leaderboardData);
      this.table.render();

    } catch (error) {
      console.error('Error fetching leaderboard data:', error);
    }
  }

  updateStats() {
    document.getElementById('total-trees').textContent = this.stats.totalTrees.toLocaleString();
    document.getElementById('total-carbon').textContent = (this.stats.totalCarbon / 1000).toFixed(1) + 't';
    document.getElementById('active-planters').textContent = this.stats.activePlanters.toLocaleString();
  }

  updateTable() {
    // In a real app, we might sort or filter differently based on this.currentMetric
    // For now, the table component handles sorting
    if (this.table) {
      // We could update the sort field of the table programmatically
      this.table.sortField = this.currentMetric === 'water' ? 'waterCount' : this.currentMetric;
      this.table.render();
    }
  }

  generateMockData(count) {
    return Array.from({ length: count }, (_, i) => ({
      address: `0x${Math.random().toString(16).substr(2, 40)}`,
      trees: Math.floor(Math.random() * 100) + 1,
      carbon: Math.floor(Math.random() * 50000) + 1000,
      waterCount: Math.floor(Math.random() * 500),
      badges: Math.random() > 0.5 ? ['Forest Keeper', 'Green Thumb'] : [],
      isUser: i === 5 // Mock current user
    }));
  }
}
