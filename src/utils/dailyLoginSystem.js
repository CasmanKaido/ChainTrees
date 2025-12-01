import { DAILY_REWARDS } from './gamificationConstants.js'

export class DailyLoginSystem {
  constructor() {
    this.storageKey = 'chaintrees_daily_login'
  }

  /**
   * Check if user can claim daily reward
   * @returns {boolean} True if claimable
   */
  canClaim() {
    const data = this.getData()
    const lastClaim = new Date(data.lastClaimDate)
    const now = new Date()

    // Check if last claim was on a different day
    return lastClaim.toDateString() !== now.toDateString()
  }

  /**
   * Claim daily reward
   * @returns {object} Reward data { day, amount, streak }
   */
  claim() {
    if (!this.canClaim()) {
      throw new Error('Already claimed today')
    }

    const data = this.getData()
    const now = new Date()
    const lastClaim = new Date(data.lastClaimDate)

    // Check streak (if last claim was yesterday)
    const isConsecutive = now - lastClaim < 48 * 60 * 60 * 1000 // Within 48 hours roughly

    let currentDay = isConsecutive ? data.currentDay + 1 : 1
    if (currentDay > 7) currentDay = 1 // Reset after 7 days

    const rewardAmount = DAILY_REWARDS[currentDay - 1]

    this.saveData({
      lastClaimDate: now.toISOString(),
      currentDay: currentDay,
      streak: isConsecutive ? data.streak + 1 : 1
    })

    return {
      day: currentDay,
      amount: rewardAmount,
      streak: isConsecutive ? data.streak + 1 : 1
    }
  }

  /**
   * Get current login state
   */
  getData() {
    const stored = localStorage.getItem(this.storageKey)
    return stored
      ? JSON.parse(stored)
      : {
          lastClaimDate: 0,
          currentDay: 0,
          streak: 0
        }
  }

  saveData(data) {
    localStorage.setItem(this.storageKey, JSON.stringify(data))
  }
}

export const dailyLoginSystem = new DailyLoginSystem()
