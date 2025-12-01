export class TouchGestureHandler {
  constructor() {
    this.touchStartX = 0
    this.touchStartY = 0
    this.touchEndX = 0
    this.touchEndY = 0
    this.minSwipeDistance = 50
    this.handlers = {
      swipeLeft: [],
      swipeRight: [],
      swipeUp: [],
      swipeDown: [],
      tap: [],
      doubleTap: [],
      longPress: []
    }
    this.lastTap = 0
    this.longPressTimer = null
  }

  /**
   * Initialize touch handlers on element
   */
  init(element) {
    element.addEventListener('touchstart', e => this.handleTouchStart(e), { passive: true })
    element.addEventListener('touchmove', e => this.handleTouchMove(e), { passive: true })
    element.addEventListener('touchend', e => this.handleTouchEnd(e), { passive: true })
  }

  handleTouchStart(e) {
    this.touchStartX = e.changedTouches[0].screenX
    this.touchStartY = e.changedTouches[0].screenY

    // Long press detection
    this.longPressTimer = setTimeout(() => {
      this.trigger('longPress', { x: this.touchStartX, y: this.touchStartY })
    }, 500)
  }

  handleTouchMove(e) {
    // Cancel long press if user moves finger
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer)
      this.longPressTimer = null
    }
  }

  handleTouchEnd(e) {
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer)
      this.longPressTimer = null
    }

    this.touchEndX = e.changedTouches[0].screenX
    this.touchEndY = e.changedTouches[0].screenY

    this.handleGesture()
  }

  handleGesture() {
    const deltaX = this.touchEndX - this.touchStartX
    const deltaY = this.touchEndY - this.touchStartY
    const absDeltaX = Math.abs(deltaX)
    const absDeltaY = Math.abs(deltaY)

    // Detect tap
    if (absDeltaX < 10 && absDeltaY < 10) {
      const now = Date.now()
      if (now - this.lastTap < 300) {
        this.trigger('doubleTap', { x: this.touchEndX, y: this.touchEndY })
      } else {
        this.trigger('tap', { x: this.touchEndX, y: this.touchEndY })
      }
      this.lastTap = now
      return
    }

    // Detect swipe
    if (absDeltaX > this.minSwipeDistance || absDeltaY > this.minSwipeDistance) {
      if (absDeltaX > absDeltaY) {
        // Horizontal swipe
        if (deltaX > 0) {
          this.trigger('swipeRight', { distance: deltaX })
        } else {
          this.trigger('swipeLeft', { distance: Math.abs(deltaX) })
        }
      } else {
        // Vertical swipe
        if (deltaY > 0) {
          this.trigger('swipeDown', { distance: deltaY })
        } else {
          this.trigger('swipeUp', { distance: Math.abs(deltaY) })
        }
      }
    }
  }

  /**
   * Register gesture handler
   */
  on(gesture, callback) {
    if (this.handlers[gesture]) {
      this.handlers[gesture].push(callback)
    }
  }

  /**
   * Trigger gesture handlers
   */
  trigger(gesture, data) {
    if (this.handlers[gesture]) {
      this.handlers[gesture].forEach(callback => callback(data))
    }
  }

  /**
   * Remove all handlers
   */
  destroy() {
    Object.keys(this.handlers).forEach(key => {
      this.handlers[key] = []
    })
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer)
    }
  }
}

export const touchGestureHandler = new TouchGestureHandler()
