export class ThemeManager {
    constructor() {
        this.themes = {
            dark: {
                name: 'Dark Forest',
                colors: {
                    primary: '#10b981',
                    secondary: '#3b82f6',
                    background: '#0f172a',
                    surface: '#1e293b',
                    text: '#e2e8f0',
                    textSecondary: '#94a3b8',
                    border: 'rgba(255, 255, 255, 0.1)',
                    error: '#ef4444',
                    warning: '#f59e0b',
                    success: '#10b981'
                }
            },
            light: {
                name: 'Bright Meadow',
                colors: {
                    primary: '#059669',
                    secondary: '#2563eb',
                    background: '#f8fafc',
                    surface: '#ffffff',
                    text: '#1e293b',
                    textSecondary: '#64748b',
                    border: 'rgba(0, 0, 0, 0.1)',
                    error: '#dc2626',
                    warning: '#d97706',
                    success: '#059669'
                }
            },
            autumn: {
                name: 'Autumn Leaves',
                colors: {
                    primary: '#f59e0b',
                    secondary: '#dc2626',
                    background: '#1c1917',
                    surface: '#292524',
                    text: '#fef3c7',
                    textSecondary: '#d6d3d1',
                    border: 'rgba(251, 191, 36, 0.2)',
                    error: '#dc2626',
                    warning: '#f59e0b',
                    success: '#84cc16'
                }
            },
            ocean: {
                name: 'Deep Ocean',
                colors: {
                    primary: '#06b6d4',
                    secondary: '#3b82f6',
                    background: '#0c4a6e',
                    surface: '#075985',
                    text: '#e0f2fe',
                    textSecondary: '#bae6fd',
                    border: 'rgba(6, 182, 212, 0.3)',
                    error: '#f43f5e',
                    warning: '#fbbf24',
                    success: '#10b981'
                }
            }
        };

        this.currentTheme = this.loadTheme();
        this.applyTheme(this.currentTheme);
    }

    loadTheme() {
        const saved = localStorage.getItem('chaintrees_theme');
        return saved || 'dark';
    }

    saveTheme(themeName) {
        localStorage.setItem('chaintrees_theme', themeName);
    }

    /**
     * Apply theme to document
     */
    applyTheme(themeName) {
        if (!this.themes[themeName]) {
            console.warn(`Theme "${themeName}" not found`);
            return;
        }

        this.currentTheme = themeName;
        this.saveTheme(themeName);

        const theme = this.themes[themeName];
        const root = document.documentElement;

        // Apply CSS variables
        Object.entries(theme.colors).forEach(([key, value]) => {
            root.style.setProperty(`--color-${key}`, value);
        });

        // Add theme class to body
        document.body.className = document.body.className
            .split(' ')
            .filter(c => !c.startsWith('theme-'))
            .concat(`theme-${themeName}`)
            .join(' ');

        // Dispatch theme change event
        window.dispatchEvent(new CustomEvent('themechange', {
            detail: { theme: themeName }
        }));
    }

    /**
     * Get current theme
     */
    getCurrentTheme() {
        return this.currentTheme;
    }

    /**
     * Get theme colors
     */
    getThemeColors(themeName = this.currentTheme) {
        return this.themes[themeName]?.colors || {};
    }

    /**
     * Get all available themes
     */
    getAvailableThemes() {
        return Object.entries(this.themes).map(([key, theme]) => ({
            id: key,
            name: theme.name,
            colors: theme.colors
        }));
    }

    /**
     * Toggle between light and dark
     */
    toggleDarkMode() {
        const newTheme = this.currentTheme === 'dark' ? 'light' : 'dark';
        this.applyTheme(newTheme);
    }

    /**
     * Auto-detect system preference
     */
    detectSystemPreference() {
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            return 'dark';
        }
        return 'light';
    }

    /**
     * Listen to system preference changes
     */
    watchSystemPreference() {
        if (window.matchMedia) {
            const darkModeQuery = window.matchMedia('(prefers-color-scheme: dark)');
            darkModeQuery.addEventListener('change', (e) => {
                const newTheme = e.matches ? 'dark' : 'light';
                this.applyTheme(newTheme);
            });
        }
    }

    /**
     * Create custom theme
     */
    createCustomTheme(name, colors) {
        this.themes[name] = {
            name,
            colors: { ...this.themes.dark.colors, ...colors }
        };
    }
}

export const themeManager = new ThemeManager();
