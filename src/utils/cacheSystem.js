export class CacheSystem {
  constructor() {
    this.memoryCache = new Map()
    this.cachePrefix = 'chaintrees_cache_'
    this.defaultTTL = 5 * 60 * 1000 // 5 minutes
  }

  /**
   * Set item in cache (both memory and localStorage)
   */
  set(key, value, ttl = this.defaultTTL) {
    const cacheItem = {
      value,
      timestamp: Date.now(),
      ttl
    }

    // Memory cache
    this.memoryCache.set(key, cacheItem)

    // Persistent cache
    try {
      localStorage.setItem(this.cachePrefix + key, JSON.stringify(cacheItem))
    } catch (e) {
      console.warn('Cache localStorage full:', e)
      this.clearExpired()
    }
  }

  /**
   * Get item from cache
   */
  get(key) {
    // Try memory cache first
    let item = this.memoryCache.get(key)

    // Fall back to localStorage
    if (!item) {
      try {
        const stored = localStorage.getItem(this.cachePrefix + key)
        if (stored) {
          item = JSON.parse(stored)
          // Restore to memory cache
          this.memoryCache.set(key, item)
        }
      } catch (e) {
        console.warn('Cache read error:', e)
        return null
      }
    }

    if (!item) return null

    // Check if expired
    if (Date.now() - item.timestamp > item.ttl) {
      this.delete(key)
      return null
    }

    return item.value
  }

  /**
   * Delete item from cache
   */
  delete(key) {
    this.memoryCache.delete(key)
    localStorage.removeItem(this.cachePrefix + key)
  }

  /**
   * Clear all cache
   */
  clear() {
    this.memoryCache.clear()

    // Clear localStorage cache items
    const keys = Object.keys(localStorage)
    keys.forEach(key => {
      if (key.startsWith(this.cachePrefix)) {
        localStorage.removeItem(key)
      }
    })
  }

  /**
   * Clear expired items
   */
  clearExpired() {
    const now = Date.now()

    // Memory cache
    for (const [key, item] of this.memoryCache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.memoryCache.delete(key)
      }
    }

    // localStorage cache
    const keys = Object.keys(localStorage)
    keys.forEach(key => {
      if (key.startsWith(this.cachePrefix)) {
        try {
          const item = JSON.parse(localStorage.getItem(key))
          if (now - item.timestamp > item.ttl) {
            localStorage.removeItem(key)
          }
        } catch (e) {
          localStorage.removeItem(key)
        }
      }
    })
  }

  /**
   * Get cache stats
   */
  getStats() {
    return {
      memorySize: this.memoryCache.size,
      localStorageSize: Object.keys(localStorage).filter(k => k.startsWith(this.cachePrefix)).length
    }
  }
}

export const cacheSystem = new CacheSystem()
