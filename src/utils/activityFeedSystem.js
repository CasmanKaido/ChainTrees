export class ActivityFeedSystem {
  constructor() {
    this.storageKey = 'chaintrees_activity'
    this.activities = this.loadActivities()
  }

  loadActivities() {
    const stored = localStorage.getItem(this.storageKey)
    return stored ? JSON.parse(stored) : []
  }

  save() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.activities))
  }

  /**
   * Log a new activity
   * @param {string} type 'MINT', 'LEVEL_UP', 'ACHIEVEMENT', 'SALE'
   * @param {object} data Details about the event
   * @param {string} userAddress Address of the user who performed action
   */
  logActivity(type, data, userAddress) {
    const activity = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      type,
      data,
      userAddress,
      timestamp: new Date().toISOString(),
      likes: 0,
      likedBy: []
    }

    this.activities.unshift(activity)

    // Keep only last 100 activities
    if (this.activities.length > 100) {
      this.activities = this.activities.slice(0, 100)
    }

    this.save()
    return activity
  }

  getFeed(filterAddress = null) {
    if (filterAddress) {
      return this.activities.filter(a => a.userAddress === filterAddress)
    }
    return this.activities
  }

  likeActivity(activityId, userAddress) {
    const activity = this.activities.find(a => a.id === activityId)
    if (!activity) throw new Error('Activity not found')

    if (activity.likedBy.includes(userAddress)) {
      activity.likes--
      activity.likedBy = activity.likedBy.filter(a => a !== userAddress)
    } else {
      activity.likes++
      activity.likedBy.push(userAddress)
    }

    this.save()
    return activity
  }
}

export const activityFeedSystem = new ActivityFeedSystem()
