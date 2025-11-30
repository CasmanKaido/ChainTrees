import { contractService } from '../services/contractService.js'
import { walletState } from '../utils/walletState.js'

export class LeaderboardPage {
    constructor(containerId) {
        this.container = document.getElementById(containerId)
        this.stats = { totalTrees: 0, totalCarbon: 0 }
        this.leaders = []
    }

    async render() {
        if (!this.container) return

        this.renderLoading()
        await this.fetchData()
        this.renderLeaderboard()
    }

    renderLoading() {
        this.container.innerHTML = `
      <div class="leaderboard-container">
        <div class="loading-container">
          <div class="loading-spinner"></div>
          <p>Loading global statistics...</p>
        </div>
      </div>
    `
    }

    async fetchData() {
        // Fetch global stats from contract
        this.stats = await contractService.getGlobalStats()

        // Mock leaderboard data (since we can't easily query this from contract without indexing)
        // In a real app, this would come from a subgraph or backend API
        this.leaders = [
            { address: '0x71C...9A23', trees: 145, carbon: 4500, badges: ['Forest Keeper'] },
            { address: '0x3A2...B1C4', trees: 89, carbon: 2100, badges: ['Green Thumb'] },
            { address: '0x9F1...D2E1', trees: 64, carbon: 1800, badges: [] },
            { address: '0xB4C...8A91', trees: 42, carbon: 1200, badges: [] },
            { address: '0xD2E...F5A3', trees: 28, carbon: 850, badges: [] },
            { address: '0xA1B...C2D3', trees: 15, carbon: 450, badges: [] },
            { address: '0xE4F...5G6H', trees: 12, carbon: 360, badges: [] },
            { address: '0x7H8...9I0J', trees: 8, carbon: 240, badges: [] },
            { address: '0xK1L...2M3N', trees: 5, carbon: 150, badges: [] },
            { address: '0xO4P...5Q6R', trees: 3, carbon: 90, badges: [] }
        ]

        // If user is connected, try to insert them correctly (mock logic)
        const account = walletState.getAccount()
        if (account.isConnected) {
            const userTrees = await contractService.getUserTrees(account.address)
            if (userTrees.length > 0) {
                const userEntry = {
                    address: account.address,
                    trees: userTrees.length,
                    carbon: userTrees.reduce((acc, t) => acc + Number(t.carbonOffset), 0),
                    badges: ['You'],
                    isUser: true
                }
                // Add user to list and sort
                this.leaders.push(userEntry)
                this.leaders.sort((a, b) => b.trees - a.trees)
                // Keep top 10
                this.leaders = this.leaders.slice(0, 10)
            }
        }
    }

    renderLeaderboard() {
        this.container.innerHTML = `
      <div class="leaderboard-container">
        <div class="leaderboard-header">
          <h1 class="leaderboard-title">Global Impact</h1>
          <p>Top planters making a difference</p>
        </div>

        <div class="global-stats">
          <div class="global-stat-card">
            <div class="global-value">${this.stats.totalTrees.toLocaleString()}</div>
            <div class="global-label">Total Trees Planted</div>
          </div>
          <div class="global-stat-card">
            <div class="global-value">${(this.stats.totalCarbon / 1000).toFixed(1)}kg</div>
            <div class="global-label">Total CO2 Offset</div>
          </div>
          <div class="global-stat-card">
            <div class="global-value">${this.leaders.length}+</div>
            <div class="global-label">Active Planters</div>
          </div>
        </div>

        <div class="leaderboard-table-container">
          <table class="leaderboard-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Planter</th>
                <th>Trees</th>
                <th>CO2 Offset</th>
              </tr>
            </thead>
            <tbody>
              ${this.leaders.map((user, index) => this.renderRow(user, index)).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `
    }

    renderRow(user, index) {
        const rankClass = index < 3 ? `rank-${index + 1}` : ''
        const rankIcon = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : index + 1
        const isUser = user.isUser ? 'highlight-row' : ''
        const formattedAddress = user.address.length > 15 ? user.address : `${user.address.slice(0, 6)}...${user.address.slice(-4)}`

        return `
      <tr class="${isUser}">
        <td class="rank-cell ${rankClass}">${rankIcon}</td>
        <td>
          <div class="user-cell">
            <div class="user-avatar">👤</div>
            <span class="user-address">${formattedAddress}</span>
            ${user.badges.map(b => `<span class="user-badge">${b}</span>`).join('')}
          </div>
        </td>
        <td class="score-cell">${user.trees}</td>
        <td>${(user.carbon / 1000).toFixed(1)}kg</td>
      </tr>
    `
    }
}
