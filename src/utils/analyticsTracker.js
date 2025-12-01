export class AnalyticsTracker {
  constructor() {
    this.events = []
    this.sessionId = this.generateSessionId()
    this.sessionStart = Date.now()
    this.maxEvents = 500
  }

  generateSessionId() {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Track page view
   */
  trackPageView(pageName, metadata = {}) {
    this.trackEvent('page_view', {
      page: pageName,
      ...metadata,
      timestamp: Date.now(),
      sessionId: this.sessionId
    })
  }

  /**
   * Track user action
   */
  trackAction(action, category, metadata = {}) {
    this.trackEvent('user_action', {
      action,
      category,
      ...metadata,
      timestamp: Date.now(),
      sessionId: this.sessionId
    })
  }

  /**
   * Track conversion
   */
  trackConversion(type, value, metadata = {}) {
    this.trackEvent('conversion', {
      type,
      value,
      ...metadata,
      timestamp: Date.now(),
      sessionId: this.sessionId
    })
  }

  /**
   * Track wallet interaction
   */
  trackWalletEvent(eventType, metadata = {}) {
    this.trackEvent('wallet', {
      eventType,
      ...metadata,
      timestamp: Date.now(),
      sessionId: this.sessionId
    })
  }

  /**
   * Track NFT interaction
   */
  trackNFTEvent(eventType, treeId, metadata = {}) {
    this.trackEvent('nft', {
      eventType,
      treeId,
      ...metadata,
      timestamp: Date.now(),
      sessionId: this.sessionId
    })
  }

  /**
   * Generic event tracking
   */
  trackEvent(eventType, data) {
    const event = {
      id: `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: eventType,
      data,
      userAgent: navigator.userAgent,
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight
      }
    }

    this.events.push(event)
    this.trimEvents()

    // In production, send to analytics service
    if (process.env.NODE_ENV === 'production') {
      this.sendToAnalytics(event)
    }
  }

  /**
   * Send event to analytics service
   */
  async sendToAnalytics(event) {
    try {
      // Replace with your analytics endpoint
      // await fetch('/api/analytics', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(event)
      // });
      console.log('Analytics event:', event)
    } catch (error) {
      console.error('Failed to send analytics:', error)
    }
  }

  /**
   * Get session analytics
   */
  getSessionAnalytics() {
    const duration = Date.now() - this.sessionStart
    const pageViews = this.events.filter(e => e.type === 'page_view')
    const actions = this.events.filter(e => e.type === 'user_action')
    const conversions = this.events.filter(e => e.type === 'conversion')

    return {
      sessionId: this.sessionId,
      duration,
      pageViews: pageViews.length,
      actions: actions.length,
      conversions: conversions.length,
      totalEvents: this.events.length,
      startTime: new Date(this.sessionStart).toISOString()
    }
  }

  /**
   * Get events by type
   */
  getEventsByType(type) {
    return this.events.filter(e => e.type === type)
  }

  /**
   * Export analytics data
   */
  exportData() {
    return {
      session: this.getSessionAnalytics(),
      events: this.events
    }
  }

  /**
   * Clear events
   */
  clear() {
    this.events = []
  }

  /**
   * Trim events to max limit
   */
  trimEvents() {
    if (this.events.length > this.maxEvents) {
      this.events = this.events.slice(-this.maxEvents)
    }
  }

  /**
   * Track time on page
   */
  trackTimeOnPage(pageName) {
    const startTime = Date.now()

    return () => {
      const duration = Date.now() - startTime
      this.trackEvent('time_on_page', {
        page: pageName,
        duration,
        sessionId: this.sessionId
      })
    }
  }
}

export const analyticsTracker = new AnalyticsTracker()

// Auto-track page visibility
if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      analyticsTracker.trackEvent('page_hidden', {
        sessionId: analyticsTracker.sessionId
      })
    } else {
      analyticsTracker.trackEvent('page_visible', {
        sessionId: analyticsTracker.sessionId
      })
    }
  })
}
