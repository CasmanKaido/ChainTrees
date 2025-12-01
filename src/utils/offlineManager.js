export class OfflineManager {
  constructor() {
    this.isOnline = navigator.onLine
    this.queue = this.loadQueue()
    this.setupListeners()
  }

  setupListeners() {
    window.addEventListener('online', () => this.handleOnline())
    window.addEventListener('offline', () => this.handleOffline())
  }

  handleOnline() {
    this.isOnline = true
    console.log('🌐 Back online')
    this.showNotification('You are back online!', 'success')
    this.processQueue()
  }

  handleOffline() {
    this.isOnline = false
    console.log('📵 Offline mode')
    this.showNotification('You are offline. Some features may be limited.', 'warning')
  }

  /**
   * Queue action for later execution
   */
  queueAction(action) {
    this.queue.push({
      id: `action_${Date.now()}`,
      ...action,
      timestamp: new Date().toISOString()
    })
    this.saveQueue()
  }

  /**
   * Process queued actions
   */
  async processQueue() {
    if (!this.isOnline || this.queue.length === 0) return

    console.log(`Processing ${this.queue.length} queued actions...`)
    const processed = []

    for (const action of this.queue) {
      try {
        await this.executeAction(action)
        processed.push(action.id)
      } catch (error) {
        console.error('Failed to process action:', error)
        // Keep in queue for retry
      }
    }

    // Remove processed actions
    this.queue = this.queue.filter(a => !processed.includes(a.id))
    this.saveQueue()

    if (processed.length > 0) {
      this.showNotification(`Synced ${processed.length} actions`, 'success')
    }
  }

  async executeAction(action) {
    // Execute the queued action
    // This would call the appropriate service method
    console.log('Executing action:', action)
    // Placeholder - actual implementation would depend on action type
  }

  loadQueue() {
    const stored = localStorage.getItem('offline_queue')
    return stored ? JSON.parse(stored) : []
  }

  saveQueue() {
    localStorage.setItem('offline_queue', JSON.stringify(this.queue))
  }

  showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div')
    notification.className = `offline-notification ${type}`
    notification.textContent = message

    // Add styles if not present
    if (!document.getElementById('offline-notification-styles')) {
      const style = document.createElement('style')
      style.id = 'offline-notification-styles'
      style.textContent = `
        .offline-notification {
          position: fixed;
          top: 20px;
          right: 20px;
          padding: 1rem 1.5rem;
          border-radius: 8px;
          color: white;
          font-weight: 600;
          z-index: 9999;
          animation: slideIn 0.3s ease-out;
        }
        .offline-notification.success {
          background: #10b981;
        }
        .offline-notification.warning {
          background: #f59e0b;
        }
        .offline-notification.info {
          background: #3b82f6;
        }
        @keyframes slideIn {
          from {
            transform: translateX(400px);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
      `
      document.head.appendChild(style)
    }

    document.body.appendChild(notification)

    // Auto-remove after 3 seconds
    setTimeout(() => {
      notification.style.animation = 'slideIn 0.3s ease-out reverse'
      setTimeout(() => notification.remove(), 300)
    }, 3000)
  }

  getStatus() {
    return {
      isOnline: this.isOnline,
      queuedActions: this.queue.length
    }
  }
}

export const offlineManager = new OfflineManager()
