import { dailyLoginSystem } from './dailyLoginSystem.js'
import { STREAK_BONUSES } from './gamificationConstants.js'

export class StreakSystem {
  /**
   * Get current streak count
   */
  getStreak() {
    return dailyLoginSystem.getData().streak
  }

  /**
   * Get current XP multiplier based on streak
   */
  getMultiplier() {
    const streak = this.getStreak()
    let multiplier = 1.0

    // Find highest applicable multiplier
    const thresholds = Object.keys(STREAK_BONUSES)
      .map(Number)
      .sort((a, b) => b - a)

    for (const threshold of thresholds) {
      if (streak >= threshold) {
        multiplier = STREAK_BONUSES[threshold]
        break
      }
    }

    return multiplier
  }

  /**
   * Check if streak is at risk (no login for > 24h)
   */
  isAtRisk() {
    const data = dailyLoginSystem.getData()
    const lastClaim = new Date(data.lastClaimDate)
    const now = new Date()
    const hoursSinceClaim = (now - lastClaim) / (1000 * 60 * 60)

    return hoursSinceClaim > 24 && hoursSinceClaim < 48
  }

  /**
   * Buy a streak freeze (Mock implementation)
   * In real app, this would deduct tokens
   */
  buyFreeze() {
    console.log('Streak freeze purchased!')
    // Logic to set 'freezeActive' flag in storage
    return true
  }
}

export const streakSystem = new StreakSystem()
