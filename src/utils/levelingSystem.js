import { LEVEL_THRESHOLDS, LEVEL_TITLES } from './gamificationConstants.js'

export class LevelingSystem {
  constructor() {
    this.currentXP = 0
  }

  /**
   * Calculate level based on total XP
   * @param {number} xp Total experience points
   * @returns {number} Current level (1-based)
   */
  getLevel(xp) {
    for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
      if (xp >= LEVEL_THRESHOLDS[i]) {
        return i + 1
      }
    }
    return 1
  }

  /**
   * Get XP required for next level
   * @param {number} level Current level
   * @returns {number} XP threshold for next level
   */
  getNextLevelXP(level) {
    if (level >= LEVEL_THRESHOLDS.length) return Infinity
    return LEVEL_THRESHOLDS[level]
  }

  /**
   * Get progress percentage to next level
   * @param {number} xp Total XP
   * @returns {number} Percentage (0-100)
   */
  getProgress(xp) {
    const level = this.getLevel(xp)
    if (level >= LEVEL_THRESHOLDS.length) return 100

    const currentLevelXP = LEVEL_THRESHOLDS[level - 1]
    const nextLevelXP = LEVEL_THRESHOLDS[level]

    const xpInLevel = xp - currentLevelXP
    const xpNeeded = nextLevelXP - currentLevelXP

    return Math.floor((xpInLevel / xpNeeded) * 100)
  }

  /**
   * Get title for current level
   * @param {number} level Current level
   * @returns {string} Title string
   */
  getTitle(level) {
    return LEVEL_TITLES[level] || 'Unknown Wanderer'
  }

  /**
   * Add XP to user and check for level up
   * @param {number} amount XP amount to add
   * @returns {object} Result { newLevel, leveledUp }
   */
  addXP(amount) {
    this.currentXP += amount
    const oldLevel = this.getLevel(this.currentXP - amount)
    const newLevel = this.getLevel(this.currentXP)

    if (newLevel > oldLevel) {
      // Dispatch level up event
      window.dispatchEvent(
        new CustomEvent('levelup', {
          detail: { level: newLevel, title: this.getTitle(newLevel) }
        })
      )
    }

    return { newLevel, leveledUp: newLevel > oldLevel }
  }
}

export const levelingSystem = new LevelingSystem()
