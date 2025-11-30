import { contractService } from '../services/contractService.js'
import { walletState } from '../utils/walletState.js'

export class AchievementsPage {
    constructor(containerId) {
        this.container = document.getElementById(containerId)
        this.achievements = []
        this.badges = [
            { id: 1, name: 'First Seed', description: 'Plant your first tree', icon: '🌱' },
            { id: 2, name: 'Forest Keeper', description: 'Own 5 or more trees', icon: '🌲' },
            { id: 3, name: 'Green Thumb', description: 'Water your trees 10 times', icon: '💧' },
            { id: 4, name: 'Carbon Neutral', description: 'Offset 1 ton of CO2', icon: '🌍' },
            { id: 5, name: 'Ancient Guardian', description: 'Grow a tree to Ancient stage', icon: '🧙‍♂️' }
        ]
    }

    async render() {
        if (!this.container) return

        const account = walletState.getAccount()

        if (!account.isConnected) {
            this.renderConnectWallet()
            return
        }

        this.renderLoading()
        await this.fetchData(account.address)
        this.renderAchievements()
    }

    renderConnectWallet() {
        this.container.innerHTML = `
      <div class="achievements-container">
        <div class="empty-state">
          <span class="empty-icon">🏆</span>
          <h2>Connect Wallet</h2>
          <p class="empty-text">Connect your wallet to view your achievements.</p>
        </div>
      </div>
    `
    }

    renderLoading() {
        this.container.innerHTML = `
      <div class="achievements-container">
        <div class="loading-container">
          <div class="loading-spinner"></div>
          <p>Loading achievements...</p>
        </div>
      </div>
    `
    }

    async fetchData(address) {
        try {
            const userBadges = await contractService.getAchievements(address)

            // Merge static data with on-chain data
            this.achievements = this.badges.map(badge => {
                const userBadge = userBadges.find(b => b.id === badge.id)
                return {
                    ...badge,
                    isUnlocked: userBadge ? userBadge.isUnlocked : false,
                    balance: userBadge ? userBadge.balance : 0
                }
            })
        } catch (error) {
            console.error('Error fetching achievements:', error)
        }
    }

    renderAchievements() {
        const unlockedCount = this.achievements.filter(a => a.isUnlocked).length
        const totalCount = this.achievements.length
        const progress = (unlockedCount / totalCount) * 100

        this.container.innerHTML = `
      <div class="achievements-container">
        <div class="achievements-header">
          <h1 class="achievements-title">Achievements</h1>
          <p>Track your milestones and earn badges</p>
        </div>

        <div class="progress-container">
          <div class="progress-header">
            <span>Progress</span>
            <span>${unlockedCount}/${totalCount} Unlocked</span>
          </div>
          <div class="progress-bar-bg">
            <div class="progress-bar-fill" style="width: ${progress}%"></div>
          </div>
        </div>

        <div class="achievements-grid">
          ${this.achievements.map(badge => this.renderBadgeCard(badge)).join('')}
        </div>
      </div>
    `

        this.attachEventListeners()
    }

    renderBadgeCard(badge) {
        const statusClass = badge.isUnlocked ? 'unlocked' : 'locked'
        const statusText = badge.isUnlocked ? 'Unlocked' : 'Locked'
        const statusLabelClass = badge.isUnlocked ? 'status-unlocked' : 'status-locked'

        return `
      <div class="badge-card ${statusClass}">
        <div class="badge-icon">${badge.icon}</div>
        <h3 class="badge-name">${badge.name}</h3>
        <p class="badge-desc">${badge.description}</p>
        <span class="badge-status ${statusLabelClass}">${statusText}</span>
        
        ${!badge.isUnlocked ? `
          <button class="mint-badge-btn" onclick="window.mintBadge(${badge.id})">
            Mint Badge
          </button>
        ` : ''}
      </div>
    `
    }

    attachEventListeners() {
        window.mintBadge = (id) => this.handleMint(id)
    }

    async handleMint(id) {
        // In a real app, we would verify eligibility here or on-chain
        if (!confirm('Are you sure you want to mint this badge? (Gas fees apply)')) return

        try {
            await contractService.mintBadge(id)
            alert('Badge minted successfully!')
            this.render()
        } catch (error) {
            console.error(error)
            alert('Minting failed: ' + error.message)
        }
    }
}
