/**
 * LoadingSkeleton Component
 * Displays animated placeholder while content loads
 */

export class LoadingSkeleton {
    constructor(container, rows = 3, options = {}) {
        this.container = container
        this.rows = rows
        this.height = options.height || '20px'
        this.width = options.width || '100%'
    }

    render() {
        const skeletons = Array.from({ length: this.rows }, () =>
            `<div class="skeleton-line" style="height: ${this.height}; width: ${this.width};"></div>`
        ).join('')

        this.container.innerHTML = `
      <div class="loading-skeleton">
        ${skeletons}
      </div>
    `
    }
}
