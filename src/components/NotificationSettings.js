export class NotificationSettings {
  constructor(settings, onUpdate) {
    this.settings = settings
    this.onUpdate = onUpdate
  }

  render() {
    return `
      <div class="settings-section">
        <h2 class="section-title">
          <i class="fas fa-bell"></i> Notifications
        </h2>

        ${this.renderToggle('email_alerts', 'Email Alerts', 'Receive updates about your trees via email')}
        ${this.renderToggle('browser_push', 'Browser Push', 'Get instant notifications when watering is needed')}
        ${this.renderToggle('marketing', 'Marketing', 'Receive news about new features and events')}
      </div>
    `
  }

  renderToggle(key, label, desc) {
    const isChecked = this.settings[key] ? 'checked' : ''
    return `
      <div class="toggle-row">
        <div>
          <div class="toggle-label">${label}</div>
          <div class="toggle-desc">${desc}</div>
        </div>
        <label class="switch">
          <input type="checkbox" data-key="${key}" ${isChecked}>
          <span class="slider"></span>
        </label>
      </div>
    `
  }

  attachListeners(container) {
    const toggles = container.querySelectorAll('input[type="checkbox"]')
    toggles.forEach(toggle => {
      toggle.addEventListener('change', e => {
        this.onUpdate(e.target.dataset.key, e.target.checked)
      })
    })
  }
}
