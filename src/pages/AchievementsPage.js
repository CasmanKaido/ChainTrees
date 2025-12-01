import { AchievementBadge } from '../components/AchievementBadge.js'
import { BadgeShowcase } from '../components/BadgeShowcase.js'
import { achievementTracker } from '../utils/achievementTracker.js'
import { contractService } from '../services/contractService.js'
import { walletState } from '../utils/walletState.js'
import '../styles/achievements.css'

export class AchievementsPage {
  constructor(containerId) {
    this.containerId = containerId
    this.badges = [
      {
        id: 1,
        name: 'First Seed',
        description: 'Plant your first tree',
        icon: '🌱',
        rarity: 'Common'
      },
      {
        id: 2,
        name: 'Forest Keeper',
        description: 'Own 5 or more trees',
        icon: '🌲',
        rarity: 'Rare'
      },
      {
        id: 3,
        name: 'Green Thumb',
        description: 'Water your trees 10 times',
        icon: '💧',
        rarity: 'Common'
      },
      {
        id: 4,
        name: 'Carbon Neutral',
        description: 'Offset 1 ton of CO2',
        icon: '🌍',
        rarity: 'Epic'
      },
      {
        id: 5,
        name: 'Ancient Guardian',
        description: 'Grow a tree to Ancient stage',
        icon: '🧙‍♂️',
        rarity: 'Legendary'
      }
    ]
  }

  async render() {
    const container = document.getElementById(this.containerId)
    if (!container) return

    const account = walletState.getAccount()
    if (!account.isConnected) {
      this.renderConnectWallet(container)
      return
    }

    container.innerHTML = `
      <div class="achievements-page">
        <div class="achievements-header">
          <h1 class="achievements-title">Achievements</h1>
          <p>Track your milestones and earn badges</p>
        </div>

        <div id="badge-showcase"></div>

        <div class="progress-section">
          <div class="progress-header">
            <span>Total Progress</span>
            <span id="progress-text">0/0 Unlocked</span>
          </div>
          <div class="progress-bar-bg">
            <div id="total-progress-bar" class="progress-bar-fill" style="width: 0%"></div>
          </div>
        </div>

        <div id="achievements-grid" class="achievements-grid">
          <div class="loading-spinner"></div>
        </div>
      </div>
    `

    await this.fetchData(account.address)
  }

  renderConnectWallet(container) {
    container.innerHTML = `
      <div class="achievements-page">
        <div class="empty-state" style="text-align: center; padding: 4rem;">
          <span style="font-size: 4rem;">🏆</span>
          <h2>Connect Wallet</h2>
          <p>Connect your wallet to view your achievements.</p>
        </div>
      </div>
    `
  }

  async fetchData(address) {
    try {
      // Fetch user stats to update tracker
      // const userTrees = await contractService.getUserTrees(address);
      // achievementTracker.updateStats({ treesPlanted: userTrees.length, ... });

      // Mock data for now
      achievementTracker.updateStats({
        treesPlanted: 3,
        totalWatering: 15,
        totalCarbon: 500,
        maxTreeStage: 'Young'
      })

      // Map badges with progress
      const badgeData = this.badges.map(badge => {
        const progress = achievementTracker.getBadgeProgress(badge.id)
        const isUnlocked = progress.current >= progress.max // Simplified logic, in real app check contract

        return {
          ...badge,
          progress: progress.current,
          maxProgress: progress.max,
          isUnlocked
        }
      })

      this.renderBadges(badgeData)
      this.renderShowcase(badgeData)
      this.updateTotalProgress(badgeData)
    } catch (error) {
      console.error('Error fetching achievements:', error)
    }
  }

  renderBadges(badgeData) {
    const grid = document.getElementById('achievements-grid')
    if (!grid) return

    grid.innerHTML = badgeData
      .map(badge => {
        const component = new AchievementBadge(badge, id => this.mintBadge(id))
        return component.render()
      })
      .join('')

    // Attach listeners
    badgeData.forEach(badge => {
      const component = new AchievementBadge(badge, id => this.mintBadge(id))
      component.attachListeners(grid)
    })
  }

  renderShowcase(badgeData) {
    new BadgeShowcase('badge-showcase', badgeData).render()
  }

  updateTotalProgress(badgeData) {
    const unlocked = badgeData.filter(b => b.isUnlocked).length
    const total = badgeData.length
    const percent = (unlocked / total) * 100

    document.getElementById('progress-text').textContent = `${unlocked}/${total} Unlocked`
    document.getElementById('total-progress-bar').style.width = `${percent}%`
  }

  async mintBadge(id) {
    if (!confirm('Are you sure you want to mint this badge? (Gas fees apply)')) return

    try {
      // await contractService.mintBadge(id);
      alert('Badge minted successfully! (Mock)')
      this.render() // Refresh
    } catch (error) {
      alert('Minting failed: ' + error.message)
    }
  }
}
