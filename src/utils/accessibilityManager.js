export class AccessibilityManager {
    constructor() {
        this.settings = this.loadSettings();
        this.applySettings();
        this.setupARIA();
    }

    loadSettings() {
        const stored = localStorage.getItem('accessibility_settings');
        return stored ? JSON.parse(stored) : {
            highContrast: false,
            largeText: false,
            reduceMotion: false,
            screenReaderMode: false,
            keyboardNavigation: true
        };
    }

    saveSettings() {
        localStorage.setItem('accessibility_settings', JSON.stringify(this.settings));
    }

    /**
     * Apply accessibility settings
     */
    applySettings() {
        const root = document.documentElement;

        // High contrast
        if (this.settings.highContrast) {
            root.classList.add('high-contrast');
        } else {
            root.classList.remove('high-contrast');
        }

        // Large text
        if (this.settings.largeText) {
            root.style.fontSize = '120%';
        } else {
            root.style.fontSize = '';
        }

        // Reduce motion
        if (this.settings.reduceMotion) {
            root.classList.add('reduce-motion');
        } else {
            root.classList.remove('reduce-motion');
        }

        // Screen reader mode
        if (this.settings.screenReaderMode) {
            this.enhanceForScreenReaders();
        }

        this.saveSettings();
    }

    /**
     * Setup ARIA attributes
     */
    setupARIA() {
        // Add role attributes
        document.querySelectorAll('nav').forEach(nav => {
            if (!nav.getAttribute('role')) {
                nav.setAttribute('role', 'navigation');
            }
        });

        document.querySelectorAll('button').forEach(btn => {
            if (!btn.getAttribute('aria-label') && !btn.textContent.trim()) {
                btn.setAttribute('aria-label', 'Button');
            }
        });

        // Add aria-live regions
        const notificationContainer = document.getElementById('notification-container');
        if (notificationContainer) {
            notificationContainer.setAttribute('aria-live', 'polite');
            notificationContainer.setAttribute('aria-atomic', 'true');
        }
    }

    /**
     * Enhance for screen readers
     */
    enhanceForScreenReaders() {
        // Add skip links
        if (!document.getElementById('skip-to-main')) {
            const skipLink = document.createElement('a');
            skipLink.id = 'skip-to-main';
            skipLink.href = '#main-content';
            skipLink.textContent = 'Skip to main content';
            skipLink.style.cssText = `
        position: absolute;
        left: -9999px;
        z-index: 999;
        padding: 1em;
        background-color: black;
        color: white;
        text-decoration: none;
      `;
            skipLink.addEventListener('focus', () => {
                skipLink.style.left = '0';
            });
            skipLink.addEventListener('blur', () => {
                skipLink.style.left = '-9999px';
            });
            document.body.insertBefore(skipLink, document.body.firstChild);
        }

        // Announce page changes
        this.createLiveRegion();
    }

    /**
     * Create ARIA live region for announcements
     */
    createLiveRegion() {
        if (!document.getElementById('aria-live-region')) {
            const liveRegion = document.createElement('div');
            liveRegion.id = 'aria-live-region';
            liveRegion.setAttribute('aria-live', 'assertive');
            liveRegion.setAttribute('aria-atomic', 'true');
            liveRegion.style.cssText = `
        position: absolute;
        left: -9999px;
        width: 1px;
        height: 1px;
        overflow: hidden;
      `;
            document.body.appendChild(liveRegion);
        }
    }

    /**
     * Announce message to screen readers
     */
    announce(message) {
        const liveRegion = document.getElementById('aria-live-region');
        if (liveRegion) {
            liveRegion.textContent = message;
            setTimeout(() => {
                liveRegion.textContent = '';
            }, 1000);
        }
    }

    /**
     * Toggle setting
     */
    toggle(setting) {
        if (this.settings.hasOwnProperty(setting)) {
            this.settings[setting] = !this.settings[setting];
            this.applySettings();
            return this.settings[setting];
        }
        return false;
    }

    /**
     * Get current settings
     */
    getSettings() {
        return { ...this.settings };
    }

    /**
     * Detect system preferences
     */
    detectSystemPreferences() {
        // Detect reduced motion preference
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            this.settings.reduceMotion = true;
        }

        // Detect high contrast preference
        if (window.matchMedia('(prefers-contrast: high)').matches) {
            this.settings.highContrast = true;
        }

        this.applySettings();
    }

    /**
     * Add focus visible styles
     */
    addFocusStyles() {
        const style = document.createElement('style');
        style.textContent = `
      .high-contrast {
        --color-primary: #00ff00;
        --color-background: #000000;
        --color-text: #ffffff;
        --color-border: #ffffff;
      }

      .reduce-motion * {
        animation-duration: 0.01ms !important;
        animation-iteration-count: 1 !important;
        transition-duration: 0.01ms !important;
      }

      *:focus-visible {
        outline: 3px solid var(--color-primary, #3b82f6);
        outline-offset: 2px;
      }

      button:focus-visible,
      a:focus-visible,
      input:focus-visible,
      select:focus-visible,
      textarea:focus-visible {
        outline: 3px solid var(--color-primary, #3b82f6);
        outline-offset: 2px;
      }
    `;
        document.head.appendChild(style);
    }
}

export const accessibilityManager = new AccessibilityManager();

// Auto-detect system preferences
accessibilityManager.detectSystemPreferences();
accessibilityManager.addFocusStyles();
