// src/components/ErrorFallback.js
export class ErrorFallback {
    constructor(container, error, resetCallback) {
        this.container = container;
        this.error = error;
        this.resetCallback = resetCallback;
    }

    render() {
        this.container.innerHTML = `
      <div class="error-fallback">
        <div class="error-icon">⚠️</div>
        <h2>Something went wrong</h2>
        <p class="error-message">${this.error.message || 'An unexpected error occurred.'}</p>
        <button id="retry-btn" class="retry-btn">Try Again</button>
      </div>
    `;

        this.container.querySelector('#retry-btn').addEventListener('click', () => {
            if (this.resetCallback) this.resetCallback();
            else window.location.reload();
        });
    }
}
