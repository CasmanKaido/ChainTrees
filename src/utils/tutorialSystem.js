export class TutorialSystem {
  constructor() {
    this.tutorials = new Map()
    this.currentTutorial = null
    this.currentStep = 0
    this.completed = this.loadCompleted()
    this.overlay = null
  }

  loadCompleted() {
    const stored = localStorage.getItem('tutorials_completed')
    return stored ? JSON.parse(stored) : []
  }

  saveCompleted() {
    localStorage.setItem('tutorials_completed', JSON.stringify(this.completed))
  }

  /**
   * Register tutorial
   */
  register(id, steps) {
    this.tutorials.set(id, {
      id,
      steps,
      completed: this.completed.includes(id)
    })
  }

  /**
   * Start tutorial
   */
  start(id) {
    const tutorial = this.tutorials.get(id)
    if (!tutorial) {
      console.warn(`Tutorial ${id} not found`)
      return
    }

    if (tutorial.completed) {
      if (!confirm("You've already completed this tutorial. Start again?")) {
        return
      }
    }

    this.currentTutorial = id
    this.currentStep = 0
    this.createOverlay()
    this.showStep(0)
  }

  /**
   * Create overlay
   */
  createOverlay() {
    if (this.overlay) return

    this.overlay = document.createElement('div')
    this.overlay.className = 'tutorial-overlay'
    this.overlay.innerHTML = `
      <div class="tutorial-spotlight"></div>
      <div class="tutorial-tooltip">
        <div class="tutorial-content">
          <div class="tutorial-header">
            <span class="tutorial-step-indicator"></span>
            <button class="tutorial-close">×</button>
          </div>
          <h3 class="tutorial-title"></h3>
          <p class="tutorial-description"></p>
          <div class="tutorial-actions">
            <button class="tutorial-btn tutorial-prev">← Previous</button>
            <button class="tutorial-btn tutorial-next">Next →</button>
            <button class="tutorial-btn tutorial-finish">Finish</button>
          </div>
        </div>
      </div>
    `

    const style = document.createElement('style')
    style.textContent = `
      .tutorial-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 10001;
        pointer-events: none;
      }
      .tutorial-spotlight {
        position: absolute;
        border: 2px solid #10b981;
        border-radius: 8px;
        box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.7);
        transition: all 0.3s ease;
        pointer-events: none;
      }
      .tutorial-tooltip {
        position: absolute;
        max-width: 400px;
        pointer-events: all;
        animation: tooltipFadeIn 0.3s ease;
      }
      .tutorial-content {
        background: linear-gradient(135deg, #1e293b, #0f172a);
        border: 1px solid #10b981;
        border-radius: 12px;
        padding: 1.5rem;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
      }
      .tutorial-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;
      }
      .tutorial-step-indicator {
        color: #10b981;
        font-weight: 700;
        font-size: 0.9rem;
      }
      .tutorial-close {
        background: none;
        border: none;
        color: #94a3b8;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0;
        line-height: 1;
      }
      .tutorial-close:hover {
        color: #e2e8f0;
      }
      .tutorial-title {
        color: #e2e8f0;
        margin: 0 0 0.5rem 0;
        font-size: 1.25rem;
      }
      .tutorial-description {
        color: #94a3b8;
        margin: 0 0 1.5rem 0;
        line-height: 1.6;
      }
      .tutorial-actions {
        display: flex;
        gap: 0.5rem;
      }
      .tutorial-btn {
        flex: 1;
        padding: 0.75rem;
        border: none;
        border-radius: 8px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
      }
      .tutorial-prev {
        background: rgba(255, 255, 255, 0.05);
        color: #94a3b8;
      }
      .tutorial-next, .tutorial-finish {
        background: #10b981;
        color: white;
      }
      .tutorial-btn:hover {
        transform: translateY(-2px);
      }
      .tutorial-btn:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
      @keyframes tooltipFadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
    `

    document.head.appendChild(style)
    document.body.appendChild(this.overlay)

    // Event listeners
    this.overlay.querySelector('.tutorial-close').addEventListener('click', () => this.end())
    this.overlay
      .querySelector('.tutorial-prev')
      .addEventListener('click', () => this.previousStep())
    this.overlay.querySelector('.tutorial-next').addEventListener('click', () => this.nextStep())
    this.overlay.querySelector('.tutorial-finish').addEventListener('click', () => this.complete())
  }

  /**
   * Show step
   */
  showStep(stepIndex) {
    const tutorial = this.tutorials.get(this.currentTutorial)
    if (!tutorial || !tutorial.steps[stepIndex]) return

    const step = tutorial.steps[stepIndex]
    this.currentStep = stepIndex

    // Update tooltip content
    const tooltip = this.overlay.querySelector('.tutorial-tooltip')
    tooltip.querySelector('.tutorial-step-indicator').textContent =
      `Step ${stepIndex + 1} of ${tutorial.steps.length}`
    tooltip.querySelector('.tutorial-title').textContent = step.title
    tooltip.querySelector('.tutorial-description').textContent = step.description

    // Update buttons
    const prevBtn = tooltip.querySelector('.tutorial-prev')
    const nextBtn = tooltip.querySelector('.tutorial-next')
    const finishBtn = tooltip.querySelector('.tutorial-finish')

    prevBtn.disabled = stepIndex === 0
    nextBtn.style.display = stepIndex < tutorial.steps.length - 1 ? 'block' : 'none'
    finishBtn.style.display = stepIndex === tutorial.steps.length - 1 ? 'block' : 'none'

    // Position spotlight and tooltip
    if (step.element) {
      const element = document.querySelector(step.element)
      if (element) {
        this.highlightElement(element, step.position || 'bottom')
      }
    }

    // Execute step action
    if (step.action) {
      step.action()
    }
  }

  /**
   * Highlight element
   */
  highlightElement(element, tooltipPosition) {
    const rect = element.getBoundingClientRect()
    const spotlight = this.overlay.querySelector('.tutorial-spotlight')
    const tooltip = this.overlay.querySelector('.tutorial-tooltip')

    // Position spotlight
    spotlight.style.top = `${rect.top - 4}px`
    spotlight.style.left = `${rect.left - 4}px`
    spotlight.style.width = `${rect.width + 8}px`
    spotlight.style.height = `${rect.height + 8}px`

    // Position tooltip
    const tooltipRect = tooltip.getBoundingClientRect()
    let top, left

    switch (tooltipPosition) {
      case 'top':
        top = rect.top - tooltipRect.height - 20
        left = rect.left + (rect.width - tooltipRect.width) / 2
        break
      case 'bottom':
        top = rect.bottom + 20
        left = rect.left + (rect.width - tooltipRect.width) / 2
        break
      case 'left':
        top = rect.top + (rect.height - tooltipRect.height) / 2
        left = rect.left - tooltipRect.width - 20
        break
      case 'right':
        top = rect.top + (rect.height - tooltipRect.height) / 2
        left = rect.right + 20
        break
      default:
        top = rect.bottom + 20
        left = rect.left
    }

    tooltip.style.top = `${Math.max(10, top)}px`
    tooltip.style.left = `${Math.max(10, Math.min(window.innerWidth - tooltipRect.width - 10, left))}px`
  }

  /**
   * Next step
   */
  nextStep() {
    const tutorial = this.tutorials.get(this.currentTutorial)
    if (this.currentStep < tutorial.steps.length - 1) {
      this.showStep(this.currentStep + 1)
    }
  }

  /**
   * Previous step
   */
  previousStep() {
    if (this.currentStep > 0) {
      this.showStep(this.currentStep - 1)
    }
  }

  /**
   * Complete tutorial
   */
  complete() {
    if (!this.completed.includes(this.currentTutorial)) {
      this.completed.push(this.currentTutorial)
      this.saveCompleted()
    }

    const tutorial = this.tutorials.get(this.currentTutorial)
    tutorial.completed = true

    this.end()
  }

  /**
   * End tutorial
   */
  end() {
    if (this.overlay) {
      this.overlay.remove()
      this.overlay = null
    }
    this.currentTutorial = null
    this.currentStep = 0
  }

  /**
   * Reset tutorial
   */
  reset(id) {
    this.completed = this.completed.filter(t => t !== id)
    this.saveCompleted()

    const tutorial = this.tutorials.get(id)
    if (tutorial) {
      tutorial.completed = false
    }
  }

  /**
   * Check if tutorial is completed
   */
  isCompleted(id) {
    return this.completed.includes(id)
  }
}

export const tutorialSystem = new TutorialSystem()

// Register default tutorials
tutorialSystem.register('first-plant', [
  {
    title: 'Welcome to ChainTrees!',
    description: "Let's plant your first tree NFT. Click here to get started.",
    element: '.nav-btn[data-page="mint"]',
    position: 'bottom'
  },
  {
    title: 'Choose Your Tree',
    description: 'Select a tree species and rarity. Each combination creates a unique NFT!',
    element: '#tree-species-select',
    position: 'bottom'
  },
  {
    title: 'Mint Your Tree',
    description:
      "Click the mint button to create your tree NFT. You'll need to confirm the transaction in your wallet.",
    element: '.mint-btn',
    position: 'top'
  }
])
