import { StakeInterface } from '../components/StakeInterface.js'
import { walletState } from '../utils/walletState.js'
import '../styles/staking.css'

export class StakingDashboard {
  constructor(containerId) {
    this.containerId = containerId
  }

  render() {
    const container = document.getElementById(this.containerId)
    if (!container) return

    const account = walletState.getAccount()
    if (!account.isConnected) {
      this.renderConnectWallet(container)
      return
    }

    container.innerHTML = `
      <div class="staking-page">
        <div class="staking-header">
          <h1 class="staking-title">Staking Dashboard</h1>
          <p class="staking-subtitle">Stake your TREE tokens to earn rewards and boost your impact.</p>
        </div>

        <div class="staking-stats">
          <div class="staking-stat-card">
            <div class="stat-label">Total Staked</div>
            <div class="stat-value">5,420 TREE</div>
            <div class="stat-subtext">≈ $542.00</div>
          </div>
          <div class="staking-stat-card">
            <div class="stat-label">Rewards Earned</div>
            <div class="stat-value">125.5 TREE</div>
            <div class="stat-subtext">Available to claim</div>
          </div>
          <div class="staking-stat-card">
            <div class="stat-label">Current APY</div>
            <div class="stat-value">12.5%</div>
            <div class="stat-subtext">With 30d lock</div>
          </div>
        </div>

        <div id="stake-interface-container"></div>

        <div class="staking-history">
          <h3 class="mb-4">Recent Activity</h3>
          <div class="history-list">
            <!-- Mock history -->
            <div class="history-item" style="background: rgba(255,255,255,0.05); padding: 1rem; border-radius: 8px; margin-bottom: 0.5rem; display: flex; justify-content: space-between;">
              <span>Staked TREE</span>
              <span class="text-green">+500 TREE</span>
            </div>
            <div class="history-item" style="background: rgba(255,255,255,0.05); padding: 1rem; border-radius: 8px; margin-bottom: 0.5rem; display: flex; justify-content: space-between;">
              <span>Claimed Rewards</span>
              <span class="text-green">+25.5 TREE</span>
            </div>
          </div>
        </div>
      </div>
    `

    const stakeInterface = new StakeInterface('stake-interface-container', data =>
      this.handleStake(data)
    )
    stakeInterface.render()
  }

  renderConnectWallet(container) {
    container.innerHTML = `
      <div class="staking-page">
        <div class="empty-state" style="text-align: center; padding: 4rem;">
          <span style="font-size: 4rem;">💰</span>
          <h2>Connect Wallet</h2>
          <p>Connect your wallet to access the staking dashboard.</p>
        </div>
      </div>
    `
  }

  async handleStake(data) {
    if (!confirm(`Are you sure you want to stake ${data.amount} TREE for ${data.lockPeriod} days?`))
      return

    try {
      // await contractService.stake(data.amount, data.lockPeriod);
      alert('Staking successful! (Mock)')
      this.render() // Refresh
    } catch (error) {
      alert('Staking failed: ' + error.message)
    }
  }
}
