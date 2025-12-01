export class NotificationSystem {
  constructor() {
    this.notifications = []
    this.maxNotifications = 50
    this.container = null
    this.createContainer()
  }

  createContainer() {
    if (typeof document === 'undefined') return

    this.container = document.createElement('div')
    this.container.id = 'notification-container'
    this.container.className = 'notification-container'

    const style = document.createElement('style')
    style.textContent = `
      .notification-container {
        position: fixed;
        top: 80px;
        right: 20px;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        max-width: 400px;
      }
      .notification {
        background: linear-gradient(135deg, #1e293b, #0f172a);
        border-left: 4px solid;
        border-radius: 8px;
        padding: 1rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);
        animation: slideInRight 0.3s ease-out;
        display: flex;
        align-items: start;
        gap: 0.75rem;
      }
      .notification.success { border-color: #10b981; }
      .notification.error { border-color: #ef4444; }
      .notification.warning { border-color: #f59e0b; }
      .notification.info { border-color: #3b82f6; }
      .notification-icon {
        font-size: 1.5rem;
        flex-shrink: 0;
      }
      .notification-content {
        flex: 1;
      }
      .notification-title {
        font-weight: 700;
        color: #e2e8f0;
        margin-bottom: 0.25rem;
      }
      .notification-message {
        font-size: 0.9rem;
        color: #94a3b8;
      }
      .notification-close {
        background: none;
        border: none;
        color: #64748b;
        cursor: pointer;
        font-size: 1.25rem;
        padding: 0;
        line-height: 1;
      }
      .notification-close:hover {
        color: #e2e8f0;
      }
      @keyframes slideInRight {
        from {
          transform: translateX(400px);
          opacity: 0;
        }
        to {
          transform: translateX(0);
          opacity: 1;
        }
      }
      @keyframes slideOutRight {
        from {
          transform: translateX(0);
          opacity: 1;
        }
        to {
          transform: translateX(400px);
          opacity: 0;
        }
      }
      @media (max-width: 768px) {
        .notification-container {
          left: 20px;
          right: 20px;
          max-width: none;
        }
      }
    `

    document.head.appendChild(style)
    document.body.appendChild(this.container)
  }

  /**
   * Show notification
   */
  show(message, options = {}) {
    const {
      type = 'info',
      title = '',
      duration = 5000,
      persistent = false,
      action = null
    } = options

    const notification = {
      id: `notif_${Date.now()}`,
      type,
      title,
      message,
      timestamp: Date.now()
    }

    this.notifications.push(notification)
    this.trimNotifications()

    const element = this.createNotificationElement(notification, duration, persistent, action)
    this.container.appendChild(element)

    if (!persistent && duration > 0) {
      setTimeout(() => this.dismiss(notification.id), duration)
    }

    return notification.id
  }

  createNotificationElement(notification, duration, persistent, action) {
    const element = document.createElement('div')
    element.className = `notification ${notification.type}`
    element.id = notification.id

    const icons = {
      success: '✅',
      error: '❌',
      warning: '⚠️',
      info: 'ℹ️'
    }

    element.innerHTML = `
      <div class="notification-icon">${icons[notification.type]}</div>
      <div class="notification-content">
        ${notification.title ? `<div class="notification-title">${notification.title}</div>` : ''}
        <div class="notification-message">${notification.message}</div>
        ${action ? `<button class="notification-action" style="margin-top:0.5rem; padding:0.25rem 0.75rem; background:#3b82f6; color:white; border:none; border-radius:4px; cursor:pointer;">${action.label}</button>` : ''}
      </div>
      <button class="notification-close">×</button>
    `

    element.querySelector('.notification-close').addEventListener('click', () => {
      this.dismiss(notification.id)
    })

    if (action) {
      element.querySelector('.notification-action').addEventListener('click', () => {
        action.callback()
        this.dismiss(notification.id)
      })
    }

    return element
  }

  /**
   * Dismiss notification
   */
  dismiss(id) {
    const element = document.getElementById(id)
    if (element) {
      element.style.animation = 'slideOutRight 0.3s ease-out'
      setTimeout(() => element.remove(), 300)
    }

    this.notifications = this.notifications.filter(n => n.id !== id)
  }

  /**
   * Show success notification
   */
  success(message, title = 'Success') {
    return this.show(message, { type: 'success', title })
  }

  /**
   * Show error notification
   */
  error(message, title = 'Error') {
    return this.show(message, { type: 'error', title, duration: 7000 })
  }

  /**
   * Show warning notification
   */
  warning(message, title = 'Warning') {
    return this.show(message, { type: 'warning', title })
  }

  /**
   * Show info notification
   */
  info(message, title = '') {
    return this.show(message, { type: 'info', title })
  }

  /**
   * Clear all notifications
   */
  clearAll() {
    this.notifications.forEach(n => this.dismiss(n.id))
  }

  trimNotifications() {
    if (this.notifications.length > this.maxNotifications) {
      const toRemove = this.notifications.slice(
        0,
        this.notifications.length - this.maxNotifications
      )
      toRemove.forEach(n => this.dismiss(n.id))
    }
  }
}

export const notificationSystem = new NotificationSystem()
