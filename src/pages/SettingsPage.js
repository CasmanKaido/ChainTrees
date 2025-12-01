import { ProfileForm } from '../components/ProfileForm.js'
import { NotificationSettings } from '../components/NotificationSettings.js'
import { walletState } from '../utils/walletState.js'
import '../styles/settings.css'

export class SettingsPage {
  constructor(containerId) {
    this.containerId = containerId
    // Mock initial data
    this.userData = {
      username: 'EcoWarrior',
      email: 'eco@example.com',
      bio: 'Planting trees for a better tomorrow.',
      avatar: '🌳'
    }
    this.notificationSettings = {
      email_alerts: true,
      browser_push: false,
      marketing: true
    }
  }

  render() {
    const container = document.getElementById(this.containerId)
    if (!container) return

    const account = walletState.getAccount()
    if (!account.isConnected) {
      this.renderConnectWallet(container)
      return
    }

    container.innerHTML = `
      <div class="settings-page">
        <div class="settings-header">
          <h1 class="settings-title">Settings</h1>
          <p style="color: var(--text-secondary)">Manage your account preferences</p>
        </div>

        <div id="profile-form-container"></div>
        <div id="notification-settings-container"></div>

        <div class="settings-section danger-zone">
          <h2 class="section-title danger-title">
            <i class="fas fa-exclamation-triangle"></i> Danger Zone
          </h2>
          <p style="margin-bottom: 1.5rem; color: var(--text-secondary);">
            Once you delete your account, there is no going back. Please be certain.
          </p>
          <button class="delete-btn" id="delete-account-btn">Delete Account</button>
        </div>
      </div>
    `

    this.renderComponents()
    this.attachListeners()
  }

  renderConnectWallet(container) {
    container.innerHTML = `
      <div class="settings-page">
        <div class="empty-state" style="text-align: center; padding: 4rem;">
          <span style="font-size: 4rem;">⚙️</span>
          <h2>Connect Wallet</h2>
          <p>Connect your wallet to access settings.</p>
        </div>
      </div>
    `
  }

  renderComponents() {
    const profileContainer = document.getElementById('profile-form-container')
    const notifContainer = document.getElementById('notification-settings-container')

    if (profileContainer) {
      const profileForm = new ProfileForm(this.userData, data => this.handleSaveProfile(data))
      profileContainer.innerHTML = profileForm.render()
      profileForm.attachListeners(profileContainer)
    }

    if (notifContainer) {
      const notifSettings = new NotificationSettings(this.notificationSettings, (key, val) =>
        this.handleUpdateNotif(key, val)
      )
      notifContainer.innerHTML = notifSettings.render()
      notifSettings.attachListeners(notifContainer)
    }
  }

  attachListeners() {
    const deleteBtn = document.getElementById('delete-account-btn')
    if (deleteBtn) {
      deleteBtn.addEventListener('click', () => this.handleDeleteAccount())
    }
  }

  async handleSaveProfile(data) {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      this.userData = { ...this.userData, ...data }
      alert('Profile updated successfully!')
    } catch (error) {
      alert('Failed to update profile')
    }
  }

  async handleUpdateNotif(key, value) {
    this.notificationSettings[key] = value
    console.log(`Updated ${key} to ${value}`)
    // Auto-save logic would go here
  }

  async handleDeleteAccount() {
    if (confirm('Are you absolutely sure? This action cannot be undone.')) {
      alert('Account deletion request submitted.')
      // Logic to wipe data
    }
  }
}
