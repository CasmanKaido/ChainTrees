export class BadgeShowcase {
  constructor(containerId, badges) {
    this.containerId = containerId
    this.badges = badges
  }

  render() {
    const container = document.getElementById(this.containerId)
    if (!container) return

    const unlockedBadges = this.badges.filter(b => b.isUnlocked)

    if (unlockedBadges.length === 0) {
      container.innerHTML = `
        <div class="text-center text-secondary">
          <p>No badges unlocked yet. Start planting to earn your first badge!</p>
        </div>
      `
      return
    }

    // Sort by rarity (Legendary -> Common)
    const rarityOrder = { Legendary: 4, Epic: 3, Rare: 2, Common: 1 }
    unlockedBadges.sort((a, b) => rarityOrder[b.rarity] - rarityOrder[a.rarity])

    // Take top 5
    const topBadges = unlockedBadges.slice(0, 5)

    container.innerHTML = `
      <div class="showcase-section">
        <h2 class="text-center mb-4">Trophy Case</h2>
        <div class="showcase-grid">
          ${topBadges
            .map(
              badge => `
            <div class="showcase-item rarity-${badge.rarity.toLowerCase()}">
              ${badge.icon}
              <div class="showcase-tooltip">${badge.name}</div>
            </div>
          `
            )
            .join('')}
        </div>
      </div>
    `
  }
}
