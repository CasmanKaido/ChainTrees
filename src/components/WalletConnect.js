import { modal } from '../config/walletConfig.js'
import { walletState } from '../utils/walletState.js'

/**
 * WalletConnect Component
 * Handles wallet connection UI and state
 */
export class WalletConnect {
  constructor(containerId = 'wallet-connect-container') {
    this.containerId = containerId
    this.container = null
    this.connectButton = null
    this.walletInfo = null
    this.isInitialized = false
  }

  /**
   * Initialize the wallet connect component
   */
  init() {
    if (this.isInitialized) return

    this.container = document.getElementById(this.containerId)
    if (!this.container) {
      console.error(`Container with id "${this.containerId}" not found`)
      return
    }

    this.render()
    this.setupListeners()
    this.isInitialized = true

    console.log('✅ WalletConnect component initialized')
  }

  /**
   * Render the component
   */
  render() {
    const account = walletState.getAccount()

    this.container.innerHTML = `
      <div class="wallet-connect">
        ${account.isConnected ? this.renderConnected(account) : this.renderDisconnected()}
      </div>
    `

    this.attachEventListeners()
  }

  /**
   * Render disconnected state
   */
  renderDisconnected() {
    return `
      <button class="wallet-connect-button" id="connect-wallet-btn">
        <svg class="wallet-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"></path>
          <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"></path>
          <path d="M18 12a2 2 0 0 0 0 4h4v-4Z"></path>
        </svg>
        <span>Connect Wallet</span>
      </button>
    `
  }

  /**
   * Render connected state
   */
  renderConnected(account) {
    const chainName = walletState.getChainName(account.chainId)
    const formattedAddress = walletState.formatAddress(account.address)

    return `
      <div class="wallet-connected">
        <div class="wallet-info">
          <div class="chain-badge">${chainName}</div>
          <div class="wallet-address">${formattedAddress}</div>
        </div>
        <button class="wallet-button" id="wallet-menu-btn">
          <svg class="wallet-icon-small" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"></circle>
            <path d="M12 16v-4"></path>
            <path d="M12 8h.01"></path>
          </svg>
        </button>
        <button class="disconnect-button" id="disconnect-btn">
          <svg class="disconnect-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
        </button>
      </div>
    `
  }

  /**
   * Attach event listeners to buttons
   */
  attachEventListeners() {
    const connectBtn = document.getElementById('connect-wallet-btn')
    const disconnectBtn = document.getElementById('disconnect-btn')
    const menuBtn = document.getElementById('wallet-menu-btn')

    if (connectBtn) {
      connectBtn.addEventListener('click', () => this.openModal())
    }

    if (disconnectBtn) {
      disconnectBtn.addEventListener('click', () => this.disconnect())
    }

    if (menuBtn) {
      menuBtn.addEventListener('click', () => this.openModal())
    }
  }

  /**
   * Open WalletConnect modal
   */
  openModal() {
    modal.open()
  }

  /**
   * Disconnect wallet
   */
  async disconnect() {
    try {
      await walletState.disconnect()
      this.render()
      this.showNotification('Wallet disconnected', 'success')
    } catch (error) {
      console.error('Error disconnecting:', error)
      this.showNotification('Failed to disconnect wallet', 'error')
    }
  }

  /**
   * Setup wallet state listeners
   */
  setupListeners() {
    walletState.watchAccount(account => {
      console.log('Account changed:', account)
      this.render()

      if (account.isConnected) {
        this.showNotification(
          `Connected to ${walletState.getChainName(account.chainId)}`,
          'success'
        )
        this.loadBalance(account.address)
      }
    })
  }

  /**
   * Load and display wallet balance
   */
  async loadBalance(address) {
    try {
      const balance = await walletState.getBalance(address)
      console.log('Balance:', balance.formatted, balance.symbol)

      // You can update UI with balance here if needed
      // For now, just log it
    } catch (error) {
      console.error('Error loading balance:', error)
    }
  }

  /**
   * Show notification
   */
  showNotification(message, type = 'info') {
    const notification = document.createElement('div')
    notification.className = `notification notification-${type}`
    notification.textContent = message

    document.body.appendChild(notification)

    // Trigger animation
    setTimeout(() => notification.classList.add('show'), 10)

    // Remove after 3 seconds
    setTimeout(() => {
      notification.classList.remove('show')
      setTimeout(() => notification.remove(), 300)
    }, 3000)
  }

  /**
   * Cleanup
   */
  destroy() {
    walletState.destroy()
    this.isInitialized = false
  }
}
