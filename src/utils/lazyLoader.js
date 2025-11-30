export class LazyLoader {
    constructor() {
        this.observers = new Map();
        this.loadedImages = new Set();
    }

    /**
     * Lazy load images
     */
    observeImages(selector = 'img[data-src]') {
        const images = document.querySelectorAll(selector);

        if ('IntersectionObserver' in window) {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.loadImage(entry.target);
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                rootMargin: '50px'
            });

            images.forEach(img => observer.observe(img));
            this.observers.set(selector, observer);
        } else {
            // Fallback for browsers without IntersectionObserver
            images.forEach(img => this.loadImage(img));
        }
    }

    loadImage(img) {
        const src = img.dataset.src;
        if (!src || this.loadedImages.has(src)) return;

        img.src = src;
        img.removeAttribute('data-src');
        this.loadedImages.add(src);

        img.addEventListener('load', () => {
            img.classList.add('loaded');
        });
    }

    /**
     * Lazy load components
     */
    async loadComponent(componentPath) {
        try {
            const module = await import(componentPath);
            return module.default || module;
        } catch (error) {
            console.error(`Failed to load component: ${componentPath}`, error);
            throw error;
        }
    }

    /**
     * Preload critical resources
     */
    preloadResources(resources) {
        resources.forEach(resource => {
            const link = document.createElement('link');
            link.rel = 'preload';
            link.as = resource.type || 'script';
            link.href = resource.url;
            document.head.appendChild(link);
        });
    }

    /**
     * Disconnect all observers
     */
    disconnect() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers.clear();
    }
}

export const lazyLoader = new LazyLoader();
