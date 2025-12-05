/**
 * Service Worker Registration
 * Handles registration and updates for Progressive Web App capabilities
 */

export function registerServiceWorker() {
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker
                .register('/service-worker.js')
                .then((registration) => {
                    console.log('SW registered: ', registration)

                    // Check for updates
                    registration.onupdatefound = () => {
                        const installingWorker = registration.installing
                        if (installingWorker == null) {
                            return
                        }
                        installingWorker.onstatechange = () => {
                            if (installingWorker.state === 'installed') {
                                if (navigator.serviceWorker.controller) {
                                    console.log('New content is available; please refresh.')
                                    // Execute callback if provided in future
                                } else {
                                    console.log('Content is cached for offline use.')
                                }
                            }
                        }
                    }
                })
                .catch((registrationError) => {
                    console.log('SW registration failed: ', registrationError)
                })
        })
    }
}

export function unregister() {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready
            .then((registration) => {
                registration.unregister()
            })
            .catch((error) => {
                console.error(error.message)
            })
    }
}
