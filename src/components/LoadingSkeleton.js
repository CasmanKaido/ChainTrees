// src/components/LoadingSkeleton.js
/**
 * Simple loading skeleton component.
 * Accepts a number of rows to display and optional width/height.
 */
export class LoadingSkeleton {
    /**
     * @param {HTMLElement} container element where skeleton will be rendered
     * @param {number} rows number of skeleton rows
     * @param {object} options optional width/height per row
     */
    constructor(container, rows = 3, options = {}) {
        this.container = container;
        this.rows = rows;
        this.width = options.width || '100%';
        this.height = options.height || '1rem';
    }

    render() {
        const skeletonHTML = Array.from({ length: this.rows }).map(() =>
            `<div class="skeleton-row" style="width:${this.width};height:${this.height};"></div>`
        ).join('');
        this.container.innerHTML = `<div class="loading-skeleton">${skeletonHTML}</div>`;
    }
}
