import { questManager } from '../utils/questManager.js'

export class QuestLog {
  constructor(containerId) {
    this.containerId = containerId
    this.currentTab = 'daily'
  }

  render() {
    const container = document.getElementById(this.containerId)
    if (!container) return

    container.innerHTML = `
      <div class="quest-log-container">
        <div class="quest-header">
          <div class="quest-title">
            <span>📜</span> Quest Log
          </div>
          <div class="quest-tabs">
            <button class="quest-tab ${this.currentTab === 'daily' ? 'active' : ''}" data-tab="daily">Daily</button>
            <button class="quest-tab ${this.currentTab === 'weekly' ? 'active' : ''}" data-tab="weekly">Weekly</button>
            <button class="quest-tab ${this.currentTab === 'lifetime' ? 'active' : ''}" data-tab="lifetime">Lifetime</button>
          </div>
        </div>
        <div class="quest-list" id="quest-list-content">
          <!-- Quests injected here -->
        </div>
      </div>
    `

    this.renderQuests()
    this.attachListeners()
  }

  renderQuests() {
    const list = document.getElementById('quest-list-content')
    if (!list) return

    const quests = questManager.getQuests(this.currentTab)

    if (quests.length === 0) {
      list.innerHTML = `<div style="text-align:center; color:#64748b; padding:2rem;">No active quests</div>`
      return
    }

    list.innerHTML = quests
      .map(quest => {
        const percent = Math.min(100, Math.floor((quest.progress / quest.target) * 100))
        const isClaimable = quest.completed && !quest.claimed

        return `
        <div class="quest-item ${quest.completed ? 'completed' : ''}">
          <div class="quest-icon">
            ${quest.completed ? '✅' : '⚔️'}
          </div>
          <div class="quest-info">
            <div class="quest-name">${quest.title}</div>
            <div class="quest-desc">${quest.description}</div>
            <div class="quest-rewards">
              <span class="quest-reward-badge">✨ ${quest.reward.xp} XP</span>
              ${quest.reward.tokens ? `<span class="quest-reward-badge">🪙 ${quest.reward.tokens} TREE</span>` : ''}
            </div>
            <div class="quest-progress-bar">
              <div class="quest-progress-fill" style="width: ${percent}%"></div>
            </div>
            <div class="quest-progress-text">${quest.progress} / ${quest.target}</div>
          </div>
          <div class="quest-action">
            ${
              isClaimable
                ? `<button class="claim-quest-btn" onclick="window.claimQuest('${quest.id}')">Claim</button>`
                : quest.claimed
                  ? `<button class="claim-quest-btn" disabled>Claimed</button>`
                  : `<button class="claim-quest-btn" disabled>${percent}%</button>`
            }
          </div>
        </div>
      `
      })
      .join('')
  }

  attachListeners() {
    // Tab switching
    const tabs = document.querySelectorAll('.quest-tab')
    tabs.forEach(tab => {
      tab.addEventListener('click', () => {
        this.currentTab = tab.dataset.tab
        this.render()
      })
    })

    // Global claim handler
    window.claimQuest = questId => {
      try {
        const reward = questManager.claimReward(questId)
        alert(`Claimed: ${reward.xp} XP and ${reward.tokens || 0} Tokens!`)
        this.renderQuests()
        // Trigger global XP update event here if needed
      } catch (e) {
        console.error(e)
      }
    }
  }
}
