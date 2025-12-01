export class PushNotificationManager {
  constructor() {
    this.subscription = null
    this.isSupported = 'Notification' in window && 'serviceWorker' in navigator
  }

  /**
   * Request notification permission
   */
  async requestPermission() {
    if (!this.isSupported) {
      throw new Error('Notifications not supported')
    }

    const permission = await Notification.requestPermission()
    return permission === 'granted'
  }

  /**
   * Subscribe to push notifications
   */
  async subscribe() {
    if (!this.isSupported) return null

    try {
      const registration = await navigator.serviceWorker.ready

      // Check if already subscribed
      this.subscription = await registration.pushManager.getSubscription()

      if (!this.subscription) {
        // Subscribe to push
        this.subscription = await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: this.urlBase64ToUint8Array(
            // Replace with your VAPID public key
            'BEl62iUYgUivxIkv69yViEuiBIa-Ib37J8xQmrEcxawtiq0e4vdTCNiZpNb7jUGN'
          )
        })
      }

      return this.subscription
    } catch (error) {
      console.error('Push subscription failed:', error)
      return null
    }
  }

  /**
   * Unsubscribe from push notifications
   */
  async unsubscribe() {
    if (this.subscription) {
      await this.subscription.unsubscribe()
      this.subscription = null
    }
  }

  /**
   * Show local notification
   */
  async showNotification(title, options = {}) {
    if (!this.isSupported) return

    const permission = await Notification.requestPermission()
    if (permission !== 'granted') return

    const registration = await navigator.serviceWorker.ready

    await registration.showNotification(title, {
      body: options.body || '',
      icon: options.icon || '/icon-192.png',
      badge: options.badge || '/icon-96.png',
      tag: options.tag || 'default',
      requireInteraction: options.requireInteraction || false,
      actions: options.actions || [],
      data: options.data || {}
    })
  }

  /**
   * Schedule notification
   */
  scheduleNotification(title, options, delay) {
    setTimeout(() => {
      this.showNotification(title, options)
    }, delay)
  }

  /**
   * Helper: Convert VAPID key
   */
  urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/')

    const rawData = window.atob(base64)
    const outputArray = new Uint8Array(rawData.length)

    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i)
    }
    return outputArray
  }

  /**
   * Get notification permission status
   */
  getPermissionStatus() {
    if (!this.isSupported) return 'unsupported'
    return Notification.permission
  }

  /**
   * Check if subscribed
   */
  isSubscribed() {
    return this.subscription !== null
  }
}

export const pushNotificationManager = new PushNotificationManager()
