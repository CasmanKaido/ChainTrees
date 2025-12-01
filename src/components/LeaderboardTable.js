import { UserProfile } from './UserProfile.js'

export class LeaderboardTable {
  constructor(containerId, data) {
    this.containerId = containerId
    this.data = data
    this.sortField = 'trees'
    this.sortDirection = 'desc'
  }

  render() {
    const container = document.getElementById(this.containerId)
    if (!container) return

    // Sort data
    const sortedData = [...this.data].sort((a, b) => {
      const valA = a[this.sortField]
      const valB = b[this.sortField]
      return this.sortDirection === 'desc' ? valB - valA : valA - valB
    })

    container.innerHTML = `
      <table class="leaderboard-table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Planter</th>
            <th class="sortable" data-sort="trees">Trees ${this.getSortIcon('trees')}</th>
            <th class="sortable" data-sort="carbon">CO2 Offset ${this.getSortIcon('carbon')}</th>
            <th class="sortable" data-sort="waterCount">Watered ${this.getSortIcon('waterCount')}</th>
          </tr>
        </thead>
        <tbody>
          ${sortedData.map((user, index) => this.renderRow(user, index)).join('')}
        </tbody>
      </table>
    `

    this.attachListeners()
  }

  getSortIcon(field) {
    if (this.sortField !== field) return '↕️'
    return this.sortDirection === 'desc' ? '⬇️' : '⬆️'
  }

  renderRow(user, index) {
    const rank = index + 1
    const rankClass = rank <= 3 ? `rank-${rank}` : ''
    const rankDisplay = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : rank
    const isUser = user.isUser ? 'highlight-row' : ''

    return `
      <tr class="${isUser}" data-address="${user.address}">
        <td class="rank-cell ${rankClass}">${rankDisplay}</td>
        <td>
          <div class="user-cell">
            <div class="user-avatar">👤</div>
            <span class="user-address">${user.address.slice(0, 6)}...${user.address.slice(-4)}</span>
            ${user.badges && user.badges.length > 0 ? `<span class="user-badge">${user.badges.length} 🏅</span>` : ''}
          </div>
        </td>
        <td class="score-cell">${user.trees}</td>
        <td>${(user.carbon / 1000).toFixed(1)}kg</td>
        <td>${user.waterCount || 0}</td>
      </tr>
    `
  }

  attachListeners() {
    // Sort headers
    document.querySelectorAll('.sortable').forEach(th => {
      th.addEventListener('click', () => {
        const field = th.dataset.sort
        if (this.sortField === field) {
          this.sortDirection = this.sortDirection === 'desc' ? 'asc' : 'desc'
        } else {
          this.sortField = field
          this.sortDirection = 'desc'
        }
        this.render()
      })
    })

    // Row clicks
    document.querySelectorAll('tbody tr').forEach(tr => {
      tr.addEventListener('click', () => {
        const address = tr.dataset.address
        const user = this.data.find(u => u.address === address)
        if (user) {
          // Add rank to user object for display
          const rank = this.data.indexOf(user) + 1
          new UserProfile().render({ ...user, rank })
        }
      })
    })
  }

  updateData(newData) {
    this.data = newData
    this.render()
  }
}
