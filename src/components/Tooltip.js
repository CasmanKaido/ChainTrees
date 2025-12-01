export function Tooltip({ text, position = 'top' }) {
    return `
        <span class="tooltip tooltip-${position}">
            <span class="tooltip-text">${text}</span>
        </span>
    `;
}

export function addTooltip(element, text, position = 'top') {
    if (!element) return;

    element.classList.add('has-tooltip');
    element.setAttribute('data-tooltip', text);
    element.setAttribute('data-tooltip-position', position);
}

// Initialize tooltips on elements with data-tooltip attribute
export function initTooltips() {
    const style = document.createElement('style');
    style.textContent = `
        .has-tooltip {
            position: relative;
            cursor: help;
        }

        .has-tooltip::before {
            content: attr(data-tooltip);
            position: absolute;
            background: var(--surface-dark, #1a1a1a);
            color: white;
            padding: 8px 12px;
            border-radius: 6px;
            font-size: 13px;
            white-space: nowrap;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s;
            z-index: 1000;
        }

        .has-tooltip::after {
            content: '';
            position: absolute;
            border: 6px solid transparent;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.3s;
            z-index: 1000;
        }

        /* Top position */
        .has-tooltip[data-tooltip-position="top"]::before {
            bottom: calc(100% + 8px);
            left: 50%;
            transform: translateX(-50%);
        }

        .has-tooltip[data-tooltip-position="top"]::after {
            bottom: calc(100% + 2px);
            left: 50%;
            transform: translateX(-50%);
            border-top-color: var(--surface-dark, #1a1a1a);
        }

        /* Bottom position */
        .has-tooltip[data-tooltip-position="bottom"]::before {
            top: calc(100% + 8px);
            left: 50%;
            transform: translateX(-50%);
        }

        .has-tooltip[data-tooltip-position="bottom"]::after {
            top: calc(100% + 2px);
            left: 50%;
            transform: translateX(-50%);
            border-bottom-color: var(--surface-dark, #1a1a1a);
        }

        /* Left position */
        .has-tooltip[data-tooltip-position="left"]::before {
            right: calc(100% + 8px);
            top: 50%;
            transform: translateY(-50%);
        }

        .has-tooltip[data-tooltip-position="left"]::after {
            right: calc(100% + 2px);
            top: 50%;
            transform: translateY(-50%);
            border-left-color: var(--surface-dark, #1a1a1a);
        }

        /* Right position */
        .has-tooltip[data-tooltip-position="right"]::before {
            left: calc(100% + 8px);
            top: 50%;
            transform: translateY(-50%);
        }

        .has-tooltip[data-tooltip-position="right"]::after {
            left: calc(100% + 2px);
            top: 50%;
            transform: translateY(-50%);
            border-right-color: var(--surface-dark, #1a1a1a);
        }

        .has-tooltip:hover::before,
        .has-tooltip:hover::after {
            opacity: 1;
        }
    `;

    if (!document.querySelector('#tooltip-styles')) {
        style.id = 'tooltip-styles';
        document.head.appendChild(style);
    }
}

// Auto-initialize
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTooltips);
} else {
    initTooltips();
}
