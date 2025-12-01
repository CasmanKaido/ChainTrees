export class ErrorBoundary {
  constructor() {
    this.errorHandlers = []
    this.setupGlobalHandlers()
  }

  /**
   * Setup global error handlers
   */
  setupGlobalHandlers() {
    // Catch synchronous errors
    window.addEventListener('error', event => {
      this.handleError({
        type: 'runtime',
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error
      })
    })

    // Catch promise rejections
    window.addEventListener('unhandledrejection', event => {
      this.handleError({
        type: 'promise',
        message: event.reason?.message || String(event.reason),
        error: event.reason
      })
    })
  }

  /**
   * Handle error
   */
  handleError(errorInfo) {
    console.error('Error caught:', errorInfo)

    // Call registered handlers
    this.errorHandlers.forEach(handler => {
      try {
        handler(errorInfo)
      } catch (e) {
        console.error('Error in error handler:', e)
      }
    })

    // Show user-friendly error message
    this.showErrorUI(errorInfo)
  }

  /**
   * Register error handler
   */
  onError(handler) {
    this.errorHandlers.push(handler)
  }

  /**
   * Show error UI
   */
  showErrorUI(errorInfo) {
    // Check if error modal already exists
    let modal = document.getElementById('error-boundary-modal')

    if (!modal) {
      modal = document.createElement('div')
      modal.id = 'error-boundary-modal'
      modal.className = 'error-modal'
      document.body.appendChild(modal)
    }

    modal.innerHTML = `
      <div class="error-modal-content">
        <div class="error-icon">⚠️</div>
        <h2>Oops! Something went wrong</h2>
        <p class="error-message">${this.sanitizeMessage(errorInfo.message)}</p>
        <div class="error-actions">
          <button class="error-btn primary" onclick="window.location.reload()">
            Reload Page
          </button>
          <button class="error-btn secondary" onclick="document.getElementById('error-boundary-modal').remove()">
            Dismiss
          </button>
        </div>
        ${
          process.env.NODE_ENV === 'development'
            ? `
          <details class="error-details">
            <summary>Technical Details</summary>
            <pre>${JSON.stringify(errorInfo, null, 2)}</pre>
          </details>
        `
            : ''
        }
      </div>
    `

    modal.classList.add('active')

    // Add styles if not already present
    if (!document.getElementById('error-boundary-styles')) {
      const style = document.createElement('style')
      style.id = 'error-boundary-styles'
      style.textContent = `
        .error-modal {
          display: none;
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(0, 0, 0, 0.8);
          z-index: 10000;
          align-items: center;
          justify-content: center;
        }
        .error-modal.active {
          display: flex;
        }
        .error-modal-content {
          background: linear-gradient(135deg, #1e293b, #0f172a);
          border: 1px solid rgba(239, 68, 68, 0.3);
          border-radius: 16px;
          padding: 2rem;
          max-width: 500px;
          text-align: center;
          color: #e2e8f0;
        }
        .error-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }
        .error-message {
          color: #94a3b8;
          margin: 1rem 0;
        }
        .error-actions {
          display: flex;
          gap: 1rem;
          margin-top: 1.5rem;
          justify-content: center;
        }
        .error-btn {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 8px;
          font-weight: 600;
          cursor: pointer;
          transition: transform 0.2s;
        }
        .error-btn:hover {
          transform: translateY(-2px);
        }
        .error-btn.primary {
          background: #ef4444;
          color: white;
        }
        .error-btn.secondary {
          background: rgba(255, 255, 255, 0.1);
          color: #e2e8f0;
        }
        .error-details {
          margin-top: 1.5rem;
          text-align: left;
        }
        .error-details pre {
          background: rgba(0, 0, 0, 0.3);
          padding: 1rem;
          border-radius: 8px;
          overflow-x: auto;
          font-size: 0.85rem;
        }
      `
      document.head.appendChild(style)
    }
  }

  /**
   * Sanitize error message
   */
  sanitizeMessage(message) {
    if (!message) return 'An unexpected error occurred'
    // Remove sensitive info, stack traces, etc.
    return message.split('\n')[0].substring(0, 200)
  }

  /**
   * Wrap async function with error handling
   */
  async wrap(fn, context = 'async operation') {
    try {
      return await fn()
    } catch (error) {
      this.handleError({
        type: 'wrapped',
        message: error.message,
        context,
        error
      })
      throw error
    }
  }
}

export const errorBoundary = new ErrorBoundary()
