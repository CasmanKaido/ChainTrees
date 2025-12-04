// src/serviceWorker.js
/**
 * Registers a service worker for offline support and caching.
 * Should be called from the main entry point (e.g., index.js).
 */
export function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/service-worker.js')
                .then(reg => console.log('✅ ServiceWorker registered', reg.scope))
                .catch(err => console.error('❌ ServiceWorker registration failed', err));
        });
    }
}
