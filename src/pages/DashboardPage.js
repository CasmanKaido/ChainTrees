import { contractService } from '../services/contractService.js'
import { walletState } from '../utils/walletState.js'
import { treeGenerator } from '../generators/treeGenerator.js'

export class DashboardPage {
    constructor(containerId) {
        this.container = document.getElementById(containerId)
        this.trees = []
        this.loading = false
    }

    async render() {
        if (!this.container) return

        const account = walletState.getAccount()

        if (!account.isConnected) {
            this.renderConnectWallet()
            return
        }

        this.renderLoading()
        await this.fetchTrees(account.address)
        this.renderDashboard()
    }

    renderConnectWallet() {
        this.container.innerHTML = `
      <div class="dashboard-container">
        <div class="empty-state">
          <span class="empty-icon">👛</span>
          <h2>Connect Wallet</h2>
          <p class="empty-text">Please connect your wallet to view your forest.</p>
        </div>
      </div>
    `
    }

    renderLoading() {
        this.container.innerHTML = `
      <div class="dashboard-container">
        <div class="loading-container">
          <div class="loading-spinner"></div>
          <p>Loading your forest...</p>
        </div>
      </div>
    `
    }

    async fetchTrees(address) {
        try {
            this.trees = await contractService.getUserTrees(address)
        } catch (error) {
            console.error('Error fetching trees:', error)
            this.trees = []
        }
    }

    renderDashboard() {
        const totalCarbon = this.trees.reduce((acc, tree) => acc + Number(tree.carbonOffset), 0)

        this.container.innerHTML = `
      <div class="dashboard-container">
        <div class="dashboard-header">
          <div>
            <h1 class="dashboard-title">My Forest</h1>
            <p>Managing ${this.trees.length} trees</p>
          </div>
          
          <div class="dashboard-stats">
            <div class="stat-box">
              <span class="stat-value">${this.trees.length}</span>
              <span class="stat-label">Trees</span>
            </div>
            <div class="stat-box">
              <span class="stat-value">${(totalCarbon / 1000).toFixed(1)}kg</span>
              <span class="stat-label">CO2 Offset</span>
            </div>
          </div>
        </div>

        ${this.trees.length === 0 ? this.renderEmptyState() : this.renderGallery()}
      </div>
    `

        this.attachEventListeners()
    }

    renderEmptyState() {
        return `
      <div class="empty-state">
        <span class="empty-icon">🌱</span>
        <h2>No Trees Yet</h2>
        <p class="empty-text">Start your journey by planting your first tree.</p>
        <button class="mint-button" onclick="window.location.reload()">Go to Mint</button>
      </div>
    `
    }

    renderGallery() {
        return `
      <div class="gallery-grid">
        ${this.trees.map(tree => this.renderTreeCard(tree)).join('')}
      </div>
    `
    }

    renderTreeCard(tree) {
        const speciesNames = ['Oak', 'Maple', 'Pine', 'Birch', 'Willow', 'Cherry', 'Redwood', 'Sequoia']
        const speciesName = speciesNames[tree.species] || 'Unknown'
        const svg = treeGenerator.generateSVG(tree.species, tree.generationSeed, tree.growthStage)

        // Check if watered today (simple check, ideally check timestamp)
        const canWater = true // Logic to check 24h cooldown would go here

        return `
      <div class="tree-card">
        <div class="tree-visual">
          ${svg}
        </div>
        <div class="tree-info">
          <div class="tree-header">
            <span class="tree-species">${speciesName}</span>
            <span class="tree-id">#${tree.id}</span>
          </div>
          
          <div class="tree-details">
            <div class="detail-item">Stage: <span>${this.getStageName(tree.growthStage)}</span></div>
            <div class="detail-item">Watered: <span>${tree.waterCount}x</span></div>
            <div class="detail-item">CO2: <span>${tree.carbonOffset}g</span></div>
          </div>

          <button class="water-btn" 
            onclick="window.waterTree(${tree.id})" 
            ${!canWater ? 'disabled' : ''}>
            💧 Water Tree
          </button>
        </div>
      </div>
    `
    }

    getStageName(stage) {
        const stages = ['Sapling', 'Young', 'Mature', 'Ancient']
        return stages[stage] || 'Unknown'
    }

    attachEventListeners() {
        window.waterTree = (id) => this.handleWater(id)
    }

    async handleWater(id) {
        try {
            const btn = document.querySelector(`button[onclick="window.waterTree(${id})"]`)
            if (btn) {
                btn.disabled = true
                btn.innerHTML = '💧 Watering...'
            }

            await contractService.waterTree(id)

            // Ideally show success modal or toast
            alert('Tree watered successfully! It will grow stronger.')

            // Refresh
            this.render()
        } catch (error) {
            console.error(error)
            alert('Failed to water tree: ' + error.message)

            const btn = document.querySelector(`button[onclick="window.waterTree(${id})"]`)
            if (btn) {
                btn.disabled = false
                btn.innerHTML = '💧 Water Tree'
            }
        }
    }
}
