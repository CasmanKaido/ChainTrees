/**
 * Accessibility Utility
 * Manages focus, announcements, and ARIA attributes.
 */
export const a11y = {
    /**
     * Announce a message to screen readers via a live region.
     * @param {string} message - The message to announce.
     * @param {string} [politeness='polite'] - 'polite' or 'assertive'.
     */
    announce(message, politeness = 'polite') {
        const announcer = document.getElementById('a11y-announcer') || this._createAnnouncer();
        announcer.setAttribute('aria-live', politeness);
        announcer.textContent = message;
        // Clear after delay to allow re-announcement of same message
        setTimeout(() => { announcer.textContent = ''; }, 3000);
    },

    _createAnnouncer() {
        const el = document.createElement('div');
        el.id = 'a11y-announcer';
        el.className = 'sr-only';
        el.style.position = 'absolute';
        el.style.width = '1px';
        el.style.height = '1px';
        el.style.padding = '0';
        el.style.margin = '-1px';
        el.style.overflow = 'hidden';
        el.style.clip = 'rect(0, 0, 0, 0)';
        el.style.whiteSpace = 'nowrap';
        el.style.border = '0';
        document.body.appendChild(el);
        return el;
    },

    /**
     * Trap focus within a container (e.g., modal).
     * @param {HTMLElement} container - The container element.
     */
    trapFocus(container) {
        const focusableElements = container.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        container.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        lastElement.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        firstElement.focus();
                        e.preventDefault();
                    }
                }
            }
        });

        // Focus first element initially
        if (firstElement) firstElement.focus();
    }
};
