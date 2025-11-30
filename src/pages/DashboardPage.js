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
    const stageName = treeGenerator.getStageName(tree.growthStage)

    // Calculate watering cooldown (24 hours)
    const now = Math.floor(Date.now() / 1000)
    const lastWatered = Number(tree.lastWatered || 0)
    const cooldownPeriod = 24 * 60 * 60 // 24 hours in seconds
    const timeSinceWatered = now - lastWatered
    const canWater = timeSinceWatered >= cooldownPeriod || lastWatered === 0
    const timeRemaining = canWater ? 0 : cooldownPeriod - timeSinceWatered

    // Calculate growth progress (water count to next stage)
    const watersNeeded = [5, 10, 15] // Waters needed to reach next stage
    const currentStageWaters = tree.waterCount
    let progressPercent = 0
    let nextStageWaters = 0

    if (tree.growthStage < 3) {
      const baseWaters = watersNeeded.slice(0, tree.growthStage).reduce((a, b) => a + b, 0)
      const watersIntoStage = currentStageWaters - baseWaters
      nextStageWaters = watersNeeded[tree.growthStage]
      progressPercent = Math.min((watersIntoStage / nextStageWaters) * 100, 100)
    } else {
      progressPercent = 100 // Ancient - fully grown
    }

    return `
      <div class="tree-card" data-tree-id="${tree.id}">
        <div class="tree-visual">
          ${svg}
          ${tree.growthStage === 3 ? '<div class="ancient-badge">⭐ Ancient</div>' : ''}
        </div>
        <div class="tree-info">
          <div class="tree-header">
            <span class="tree-species">${speciesName}</span>
            <span class="tree-id">#${tree.id}</span>
          </div>
          
          <div class="tree-stage-info">
            <div class="stage-badge stage-${tree.growthStage}">${stageName}</div>
            ${tree.growthStage < 3 ? `
              <div class="growth-progress">
                <div class="progress-label">
                  <span>Growth</span>
                  <span>${Math.floor(progressPercent)}%</span>
                </div>
                <div class="progress-bar-bg">
                  <div class="progress-bar-fill" style="width: ${progressPercent}%"></div>
                </div>
                <div class="progress-hint">${currentStageWaters % nextStageWaters}/${nextStageWaters} waters to next stage</div>
              </div>
            ` : '<div class="fully-grown">🌟 Fully Grown</div>'}
          </div>
          
          <div class="tree-details">
            <div class="detail-item">
              <span class="detail-icon">💧</span>
              <span>Watered ${tree.waterCount}x</span>
            </div>
            <div class="detail-item">
              <span class="detail-icon">🌍</span>
              <span>${tree.carbonOffset}g CO2</span>
            </div>
          </div>

          ${canWater ? `
            <button class="water-btn" onclick="window.waterTree(${tree.id})">
              💧 Water Tree
            </button>
          ` : `
            <button class="water-btn disabled" disabled>
              ⏱️ Cooldown: <span class="cooldown-timer" data-remaining="${timeRemaining}">${this.formatTime(timeRemaining)}</span>
            </button>
          `}
        </div>
      </div>
    `
  }

  formatTime(seconds) {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  getStageName(stage) {
    // Use treeGenerator's method for consistency
    return treeGenerator.getStageName(stage)
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
