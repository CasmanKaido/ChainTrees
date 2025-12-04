import { themeManager } from '../utils/themeManager.js';

export function DarkModeToggle() {
    const currentTheme = themeManager.getCurrentTheme();
    const isDark = currentTheme === 'dark' || currentTheme === 'midnight';

    return `
        <button 
            class="dark-mode-toggle" 
            onclick="toggleDarkMode()"
            aria-label="Toggle dark mode"
            data-tooltip="Toggle theme"
            data-tooltip-position="bottom"
        >
            <svg class="theme-icon sun-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="4" stroke="currentColor" stroke-width="2"/>
                <path d="M10 2V4M10 16V18M18 10H16M4 10H2M15.657 4.343L14.243 5.757M5.757 14.243L4.343 15.657M15.657 15.657L14.243 14.243M5.757 5.757L4.343 4.343" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
            </svg>
            <svg class="theme-icon moon-icon" width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
            </svg>
        </button>
    `;
}

window.toggleDarkMode = function () {
    const currentTheme = themeManager.getCurrentTheme();

    // Cycle through themes: light -> dark -> midnight -> forest -> light
    const themeOrder = ['light', 'dark', 'midnight', 'forest'];
    const currentIndex = themeOrder.indexOf(currentTheme);
    const nextIndex = (currentIndex + 1) % themeOrder.length;
    const nextTheme = themeOrder[nextIndex];

    themeManager.setTheme(nextTheme);

    // Update button state
    const button = document.querySelector('.dark-mode-toggle');
    if (button) {
        button.classList.toggle('dark', nextTheme !== 'light');
    }

    // Dispatch event for other components
    window.dispatchEvent(new CustomEvent('themechange', {
        detail: { theme: nextTheme }
    }));
};
