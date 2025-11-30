export class ResponsiveManager {
    constructor() {
        this.breakpoints = {
            mobile: 768,
            tablet: 1024,
            desktop: 1440
        };
        this.currentDevice = this.detectDevice();
        this.listeners = [];
        this.setupListeners();
    }

    setupListeners() {
        window.addEventListener('resize', () => {
            const newDevice = this.detectDevice();
            if (newDevice !== this.currentDevice) {
                this.currentDevice = newDevice;
                this.notifyListeners(newDevice);
            }
        });

        // Detect orientation changes
        window.addEventListener('orientationchange', () => {
            setTimeout(() => {
                this.notifyListeners(this.currentDevice);
            }, 100);
        });
    }

    detectDevice() {
        const width = window.innerWidth;
        if (width < this.breakpoints.mobile) return 'mobile';
        if (width < this.breakpoints.tablet) return 'tablet';
        return 'desktop';
    }

    isMobile() {
        return this.currentDevice === 'mobile';
    }

    isTablet() {
        return this.currentDevice === 'tablet';
    }

    isDesktop() {
        return this.currentDevice === 'desktop';
    }

    getOrientation() {
        return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
    }

    /**
     * Register device change listener
     */
    onChange(callback) {
        this.listeners.push(callback);
    }

    notifyListeners(device) {
        this.listeners.forEach(callback => callback(device));
    }

    /**
     * Apply responsive classes to body
     */
    applyResponsiveClasses() {
        document.body.classList.remove('mobile', 'tablet', 'desktop');
        document.body.classList.add(this.currentDevice);

        document.body.classList.remove('portrait', 'landscape');
        document.body.classList.add(this.getOrientation());
    }

    /**
     * Get viewport dimensions
     */
    getViewport() {
        return {
            width: window.innerWidth,
            height: window.innerHeight,
            device: this.currentDevice,
            orientation: this.getOrientation()
        };
    }

    /**
     * Check if touch device
     */
    isTouchDevice() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }

    /**
     * Get device pixel ratio
     */
    getPixelRatio() {
        return window.devicePixelRatio || 1;
    }

    /**
     * Optimize images for device
     */
    getOptimizedImageSize(baseSize) {
        const ratio = this.getPixelRatio();
        const device = this.currentDevice;

        let multiplier = 1;
        if (device === 'mobile') multiplier = 0.5;
        else if (device === 'tablet') multiplier = 0.75;

        return Math.round(baseSize * multiplier * ratio);
    }
}

export const responsiveManager = new ResponsiveManager();

// Auto-apply responsive classes
responsiveManager.applyResponsiveClasses();
responsiveManager.onChange(() => {
    responsiveManager.applyResponsiveClasses();
});
