import { contractService } from '../services/contractService.js'
import { walletState } from '../utils/walletState.js'
import { treeGenerator } from '../generators/treeGenerator.js'

export class RewardsPage {
  constructor(containerId) {
    this.container = document.getElementById(containerId)
    this.tokenBalance = 0
    this.stakedTrees = []
    this.unstakedTrees = []
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
    this.renderRewards()
  }

  renderConnectWallet() {
    this.container.innerHTML = `
      <div class="rewards-container">
        <div class="empty-state">
          <span class="empty-icon">👛</span>
          <h2>Connect Wallet</h2>
          <p class="empty-text">Connect your wallet to access staking and rewards.</p>
        </div>
      </div>
    `
  }

  renderLoading() {
    this.container.innerHTML = `
      <div class="rewards-container">
        <div class="loading-container">
          <div class="loading-spinner"></div>
          <p>Loading rewards data...</p>
        </div>
      </div>
    `
  }

  async fetchData(address) {
    try {
      // 1. Get Token Balance
      this.tokenBalance = await contractService.getRewardBalance(address)

      // 2. Get Staked Trees
      this.stakedTrees = await contractService.getStakedTrees(address)

      // 3. Get Unstaked Trees (Available to stake)
      // We filter out trees that are already staked from the user's total trees
      // Note: In a real app, the contract might handle this differently,
      // but here getUserTrees returns trees owned by the user (in wallet).
      // Staked trees are owned by the Reward contract, so getUserTrees won't return them.
      this.unstakedTrees = await contractService.getUserTrees(address)
    } catch (error) {
      console.error('Error fetching rewards data:', error)
    }
  }

  renderRewards() {
    this.container.innerHTML = `
      <div class="rewards-container">
        <div class="rewards-header">
          <h1 class="rewards-title">Staking & Rewards</h1>
          <p>Stake your trees to earn TREE tokens</p>
        </div>

        <!-- Token Balance -->
        <div class="balance-card">
          <div class="token-amount">
            ${this.formatBalance(this.tokenBalance)}
            <span class="token-symbol">TREE</span>
          </div>
          <p>Available Balance</p>
        </div>

        <!-- Staked Trees Section -->
        <div class="staking-section">
          <h2 class="section-title">🌱 Staked Trees (${this.stakedTrees.length})</h2>
          ${
            this.stakedTrees.length === 0
              ? '<p class="empty-text">No trees staked yet.</p>'
              : `<div class="staking-grid">
                ${this.stakedTrees.map(tree => this.renderStakedCard(tree)).join('')}
               </div>`
          }
        </div>

        <!-- Available to Stake Section -->
        <div class="staking-section">
          <h2 class="section-title">🌳 Available to Stake (${this.unstakedTrees.length})</h2>
          ${
            this.unstakedTrees.length === 0
              ? '<p class="empty-text">No trees available to stake.</p>'
              : `<div class="staking-grid">
                ${this.unstakedTrees.map(tree => this.renderUnstakedCard(tree)).join('')}
               </div>`
          }
        </div>
      </div>
    `

    this.attachEventListeners()
  }

  renderStakedCard(tree) {
    const svg = treeGenerator.generateSVG(tree.species, tree.generationSeed, tree.growthStage)
    const pendingReward = this.formatBalance(tree.pendingReward)

    return `
      <div class="stake-card">
        <div class="stake-visual">${svg}</div>
        <div class="stake-info">
          <div class="stake-header">
            <strong>Tree #${tree.id}</strong>
            <span class="stat-badge">Staked</span>
          </div>
          
          <div class="stake-reward">
            <span class="reward-label">Pending Reward</span>
            <span class="reward-value">+${pendingReward} TREE</span>
          </div>

          <button class="action-btn btn-claim" onclick="window.claimReward(${tree.id})">
            Claim Rewards
          </button>
          <button class="action-btn btn-unstake" onclick="window.unstakeTree(${tree.id})">
            Unstake
          </button>
        </div>
      </div>
    `
  }

  renderUnstakedCard(tree) {
    const svg = treeGenerator.generateSVG(tree.species, tree.generationSeed, tree.growthStage)

    return `
      <div class="stake-card">
        <div class="stake-visual">${svg}</div>
        <div class="stake-info">
          <div class="stake-header">
            <strong>Tree #${tree.id}</strong>
            <span class="stat-badge">Available</span>
          </div>
          <p class="tree-desc">Stake to earn rewards based on CO2 offset.</p>
          <button class="action-btn btn-stake" onclick="window.stakeTree(${tree.id})">
            Stake Tree
          </button>
        </div>
      </div>
    `
  }

  formatBalance(amount) {
    // Assuming 18 decimals, simplified for display
    return (Number(amount) / 1e18).toFixed(2)
  }

  attachEventListeners() {
    window.stakeTree = id => this.handleStake(id)
    window.unstakeTree = id => this.handleUnstake(id)
    window.claimReward = id => this.handleClaim(id)
  }

  async handleStake(id) {
    if (!confirm('Staking requires 2 transactions: Approve and Stake. Continue?')) return

    try {
      await contractService.stakeTree(id)
      alert('Tree staked successfully!')
      this.render()
    } catch (error) {
      console.error(error)
      alert('Staking failed: ' + error.message)
    }
  }

  async handleUnstake(id) {
    try {
      await contractService.unstakeTree(id)
      alert('Tree unstaked successfully!')
      this.render()
    } catch (error) {
      console.error(error)
      alert('Unstaking failed: ' + error.message)
    }
  }

  async handleClaim(id) {
    try {
      await contractService.claimReward(id)
      alert('Rewards claimed successfully!')
      this.render()
    } catch (error) {
      console.error(error)
      alert('Claiming failed: ' + error.message)
    }
  }
}
