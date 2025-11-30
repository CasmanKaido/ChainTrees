export class PerformanceMonitor {
    constructor() {
        this.metrics = {
            pageLoads: [],
            apiCalls: [],
            renders: [],
            errors: []
        };
        this.maxEntries = 100;
    }

    /**
     * Track page load performance
     */
    trackPageLoad(pageName) {
        if (!window.performance) return;

        const navigation = performance.getEntriesByType('navigation')[0];
        if (navigation) {
            this.metrics.pageLoads.push({
                page: pageName,
                loadTime: navigation.loadEventEnd - navigation.fetchStart,
                domReady: navigation.domContentLoadedEventEnd - navigation.fetchStart,
                timestamp: Date.now()
            });

            this.trimMetrics('pageLoads');
        }
    }

    /**
     * Track API call performance
     */
    trackApiCall(endpoint, duration, success = true) {
        this.metrics.apiCalls.push({
            endpoint,
            duration,
            success,
            timestamp: Date.now()
        });

        this.trimMetrics('apiCalls');
    }

    /**
     * Track component render time
     */
    trackRender(componentName, duration) {
        this.metrics.renders.push({
            component: componentName,
            duration,
            timestamp: Date.now()
        });

        this.trimMetrics('renders');
    }

    /**
     * Track errors
     */
    trackError(error, context = '') {
        this.metrics.errors.push({
            message: error.message || String(error),
            stack: error.stack,
            context,
            timestamp: Date.now()
        });

        this.trimMetrics('errors');
    }

    /**
     * Get performance summary
     */
    getSummary() {
        return {
            avgPageLoad: this.getAverage(this.metrics.pageLoads, 'loadTime'),
            avgApiCall: this.getAverage(this.metrics.apiCalls, 'duration'),
            avgRender: this.getAverage(this.metrics.renders, 'duration'),
            errorCount: this.metrics.errors.length,
            totalMetrics: Object.values(this.metrics).reduce((sum, arr) => sum + arr.length, 0)
        };
    }

    /**
     * Get detailed metrics
     */
    getMetrics() {
        return { ...this.metrics };
    }

    /**
     * Clear all metrics
     */
    clear() {
        this.metrics = {
            pageLoads: [],
            apiCalls: [],
            renders: [],
            errors: []
        };
    }

    /**
     * Helper: Calculate average
     */
    getAverage(array, key) {
        if (array.length === 0) return 0;
        const sum = array.reduce((acc, item) => acc + (item[key] || 0), 0);
        return Math.round(sum / array.length);
    }

    /**
     * Helper: Trim metrics to max entries
     */
    trimMetrics(type) {
        if (this.metrics[type].length > this.maxEntries) {
            this.metrics[type] = this.metrics[type].slice(-this.maxEntries);
        }
    }

    /**
     * Export metrics as JSON
     */
    export() {
        return JSON.stringify({
            summary: this.getSummary(),
            metrics: this.metrics,
            timestamp: new Date().toISOString()
        }, null, 2);
    }
}

export const performanceMonitor = new PerformanceMonitor();

// Auto-track errors
if (typeof window !== 'undefined') {
    window.addEventListener('error', (event) => {
        performanceMonitor.trackError(event.error, 'Global error handler');
    });

    window.addEventListener('unhandledrejection', (event) => {
        performanceMonitor.trackError(
            new Error(event.reason),
            'Unhandled promise rejection'
        );
    });
}
