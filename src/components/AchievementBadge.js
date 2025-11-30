export class AchievementBadge {
    constructor(badgeData, onMint) {
        this.data = badgeData;
        this.onMint = onMint;
    }

    render() {
        const { id, name, description, icon, isUnlocked, rarity, progress, maxProgress } = this.data;
        const isMintable = progress >= maxProgress && !isUnlocked;

        return `
      <div class="badge-card ${isUnlocked ? 'unlocked' : 'locked'} rarity-${rarity.toLowerCase()}">
        <div class="badge-icon-container">
          <div class="badge-glow"></div>
          <div class="badge-icon">${icon}</div>
        </div>
        
        <h3 class="badge-name">${name}</h3>
        <p class="badge-desc">${description}</p>
        
        ${!isUnlocked ? `
          <div class="badge-progress">
            <div class="progress-bar-bg" style="height: 6px; margin-bottom: 0.5rem;">
              <div class="progress-bar-fill" style="width: ${(progress / maxProgress) * 100}%"></div>
            </div>
            <small style="color: var(--text-secondary)">${progress} / ${maxProgress}</small>
          </div>
        ` : ''}

        <div style="margin-top: 1rem;">
          ${this.renderStatus(isUnlocked, isMintable)}
        </div>
      </div>
    `;
    }

    renderStatus(isUnlocked, isMintable) {
        if (isUnlocked) {
            return '<span class="badge-status status-unlocked">Unlocked</span>';
        }

        if (isMintable) {
            return `
        <button class="mint-badge-btn" data-id="${this.data.id}">
          Mint Badge
        </button>
      `;
        }

        return '<span class="badge-status status-locked">Locked</span>';
    }

    attachListeners(container) {
        const btn = container.querySelector(`.mint-badge-btn[data-id="${this.data.id}"]`);
        if (btn) {
            btn.addEventListener('click', () => this.onMint(this.data.id));
        }
    }
}
