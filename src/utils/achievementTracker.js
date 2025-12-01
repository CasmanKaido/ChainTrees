export class AchievementTracker {
  constructor() {
    this.stats = {
      treesPlanted: 0,
      totalWatering: 0,
      totalCarbon: 0,
      maxTreeStage: 'Sapling'
    }
  }

  updateStats(newStats) {
    this.stats = { ...this.stats, ...newStats }
    this.checkAchievements()
  }

  checkAchievements() {
    // Logic to check if new achievements are unlocked locally
    // This would typically trigger a notification
    // For now, it's a placeholder for future logic
  }

  getBadgeProgress(badgeId) {
    switch (badgeId) {
      case 1: // First Seed
        return { current: this.stats.treesPlanted, max: 1 }
      case 2: // Forest Keeper
        return { current: this.stats.treesPlanted, max: 5 }
      case 3: // Green Thumb
        return { current: this.stats.totalWatering, max: 10 }
      case 4: // Carbon Neutral
        return { current: this.stats.totalCarbon, max: 1000 }
      case 5: // Ancient Guardian
        return { current: this.stats.maxTreeStage === 'Ancient' ? 1 : 0, max: 1 }
      default:
        return { current: 0, max: 1 }
    }
  }
}

export const achievementTracker = new AchievementTracker()
