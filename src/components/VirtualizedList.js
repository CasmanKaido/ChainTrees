// src/components/VirtualizedList.js
/**
 * Simple virtualized list component using IntersectionObserver.
 * It renders only visible items plus a buffer to improve performance on large lists.
 */
export class VirtualizedList {
    /**
     * @param {HTMLElement} container element where the list will be rendered
     * @param {Array<any>} items array of data items
     * @param {function(any): HTMLElement} renderItem function that returns an element for a single item
     * @param {number} itemHeight estimated height of each item in pixels
     * @param {number} buffer number of extra items rendered above and below the viewport
     */
    constructor({ container, items = [], renderItem, itemHeight = 80, buffer = 5 }) {
        this.container = container;
        this.items = items;
        this.renderItem = renderItem;
        this.itemHeight = itemHeight;
        this.buffer = buffer;
        this.scrollTop = 0;
        this.viewportHeight = this.container.clientHeight;
        this.totalHeight = this.items.length * this.itemHeight;
        this.spacer = document.createElement('div');
        this.spacer.style.height = `${this.totalHeight}px`;
        this.container.appendChild(this.spacer);
        this.visibleContainer = document.createElement('div');
        this.visibleContainer.style.position = 'absolute';
        this.visibleContainer.style.top = '0';
        this.container.appendChild(this.visibleContainer);
        this._onScroll = this._onScroll.bind(this);
        this.container.addEventListener('scroll', this._onScroll);
        this._render();
    }

    _onScroll() {
        this.scrollTop = this.container.scrollTop;
        this._render();
    }

    _render() {
        const startIdx = Math.max(0, Math.floor(this.scrollTop / this.itemHeight) - this.buffer);
        const endIdx = Math.min(
            this.items.length,
            Math.ceil((this.scrollTop + this.viewportHeight) / this.itemHeight) + this.buffer
        );
        // Clear previous
        this.visibleContainer.innerHTML = '';
        // Position container
        const offsetY = startIdx * this.itemHeight;
        this.visibleContainer.style.transform = `translateY(${offsetY}px)`;
        // Render visible items
        for (let i = startIdx; i < endIdx; i++) {
            const el = this.renderItem(this.items[i], i);
            this.visibleContainer.appendChild(el);
        }
    }

    destroy() {
        this.container.removeEventListener('scroll', this._onScroll);
        this.container.innerHTML = '';
    }
}
