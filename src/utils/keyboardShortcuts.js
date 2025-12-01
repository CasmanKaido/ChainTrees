export class KeyboardShortcuts {
  constructor() {
    this.shortcuts = new Map()
    this.enabled = true
    this.setupDefaultShortcuts()
    this.init()
  }

  init() {
    document.addEventListener('keydown', e => this.handleKeyPress(e))
  }

  setupDefaultShortcuts() {
    // Navigation
    this.register('ctrl+1', () => this.navigateTo('mint'), 'Go to Plant page')
    this.register('ctrl+2', () => this.navigateTo('dashboard'), 'Go to My Forest')
    this.register('ctrl+3', () => this.navigateTo('marketplace'), 'Go to Marketplace')
    this.register('ctrl+4', () => this.navigateTo('governance'), 'Go to DAO')

    // Actions
    this.register('ctrl+k', () => this.openSearch(), 'Open search')
    this.register('ctrl+/', () => this.showShortcuts(), 'Show shortcuts')
    this.register('esc', () => this.closeModals(), 'Close modals')

    // Theme
    this.register('ctrl+shift+t', () => this.toggleTheme(), 'Toggle theme')
  }

  /**
   * Register keyboard shortcut
   */
  register(combination, callback, description = '') {
    const normalized = this.normalizeCombination(combination)
    this.shortcuts.set(normalized, { callback, description })
  }

  /**
   * Unregister shortcut
   */
  unregister(combination) {
    const normalized = this.normalizeCombination(combination)
    this.shortcuts.delete(normalized)
  }

  /**
   * Handle key press
   */
  handleKeyPress(e) {
    if (!this.enabled) return

    // Don't trigger shortcuts when typing in inputs
    if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') {
      // Allow ESC in inputs
      if (e.key !== 'Escape') return
    }

    const combination = this.getCombination(e)
    const shortcut = this.shortcuts.get(combination)

    if (shortcut) {
      e.preventDefault()
      shortcut.callback(e)
    }
  }

  /**
   * Get key combination from event
   */
  getCombination(e) {
    const parts = []

    if (e.ctrlKey || e.metaKey) parts.push('ctrl')
    if (e.shiftKey) parts.push('shift')
    if (e.altKey) parts.push('alt')

    const key = e.key.toLowerCase()
    if (key !== 'control' && key !== 'shift' && key !== 'alt' && key !== 'meta') {
      parts.push(key)
    }

    return parts.join('+')
  }

  /**
   * Normalize combination string
   */
  normalizeCombination(combination) {
    return combination.toLowerCase().split('+').sort().join('+')
  }

  /**
   * Navigate to page
   */
  navigateTo(page) {
    const navBtn = document.querySelector(`[data-page="${page}"]`)
    if (navBtn) navBtn.click()
  }

  /**
   * Open search
   */
  openSearch() {
    // Implement search modal opening
    console.log('Opening search...')
  }

  /**
   * Show shortcuts help
   */
  showShortcuts() {
    const modal = document.createElement('div')
    modal.className = 'shortcuts-modal'
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10000;
    `

    const content = document.createElement('div')
    content.style.cssText = `
      background: linear-gradient(135deg, #1e293b, #0f172a);
      border-radius: 16px;
      padding: 2rem;
      max-width: 600px;
      max-height: 80vh;
      overflow-y: auto;
      color: #e2e8f0;
    `

    content.innerHTML = `
      <h2 style="margin-top: 0;">⌨️ Keyboard Shortcuts</h2>
      <div style="display: grid; gap: 0.75rem;">
        ${Array.from(this.shortcuts.entries())
          .map(
            ([combo, { description }]) => `
          <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem; background: rgba(255,255,255,0.05); border-radius: 8px;">
            <span style="color: #94a3b8;">${description}</span>
            <kbd style="background: rgba(0,0,0,0.3); padding: 0.25rem 0.5rem; border-radius: 4px; font-family: monospace; font-size: 0.9rem;">
              ${combo.replace(/\+/g, ' + ').toUpperCase()}
            </kbd>
          </div>
        `
          )
          .join('')}
      </div>
      <button onclick="this.closest('.shortcuts-modal').remove()" style="margin-top: 1.5rem; padding: 0.75rem 1.5rem; background: #3b82f6; color: white; border: none; border-radius: 8px; cursor: pointer; width: 100%;">
        Close
      </button>
    `

    modal.appendChild(content)
    document.body.appendChild(modal)

    modal.addEventListener('click', e => {
      if (e.target === modal) modal.remove()
    })
  }

  /**
   * Close all modals
   */
  closeModals() {
    document.querySelectorAll('.gift-modal.active, .shortcuts-modal').forEach(modal => {
      modal.classList.remove('active')
      if (modal.className === 'shortcuts-modal') modal.remove()
    })
  }

  /**
   * Toggle theme
   */
  toggleTheme() {
    if (window.themeManager) {
      window.themeManager.toggleDarkMode()
    }
  }

  /**
   * Enable/disable shortcuts
   */
  setEnabled(enabled) {
    this.enabled = enabled
  }

  /**
   * Get all shortcuts
   */
  getAll() {
    return Array.from(this.shortcuts.entries()).map(([combo, data]) => ({
      combination: combo,
      ...data
    }))
  }
}

export const keyboardShortcuts = new KeyboardShortcuts()
