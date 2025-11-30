export class AnimationController {
    constructor() {
        this.animations = new Map();
        this.rafId = null;
        this.isRunning = false;
    }

    /**
     * Register an animation
     */
    register(id, animationFn, options = {}) {
        const {
            duration = 1000,
            easing = 'easeInOut',
            loop = false,
            autoStart = true
        } = options;

        const animation = {
            id,
            fn: animationFn,
            duration,
            easing: this.getEasingFunction(easing),
            loop,
            startTime: null,
            isActive: false
        };

        this.animations.set(id, animation);

        if (autoStart) {
            this.start(id);
        }

        return id;
    }

    /**
     * Start animation
     */
    start(id) {
        const animation = this.animations.get(id);
        if (!animation) return;

        animation.startTime = performance.now();
        animation.isActive = true;

        if (!this.isRunning) {
            this.isRunning = true;
            this.tick();
        }
    }

    /**
     * Stop animation
     */
    stop(id) {
        const animation = this.animations.get(id);
        if (animation) {
            animation.isActive = false;
        }

        // Stop RAF if no animations are active
        if (!Array.from(this.animations.values()).some(a => a.isActive)) {
            this.isRunning = false;
            if (this.rafId) {
                cancelAnimationFrame(this.rafId);
                this.rafId = null;
            }
        }
    }

    /**
     * Animation loop
     */
    tick() {
        const now = performance.now();

        this.animations.forEach((animation, id) => {
            if (!animation.isActive) return;

            const elapsed = now - animation.startTime;
            const progress = Math.min(elapsed / animation.duration, 1);
            const easedProgress = animation.easing(progress);

            animation.fn(easedProgress);

            if (progress >= 1) {
                if (animation.loop) {
                    animation.startTime = now;
                } else {
                    this.stop(id);
                }
            }
        });

        if (this.isRunning) {
            this.rafId = requestAnimationFrame(() => this.tick());
        }
    }

    /**
     * Get easing function
     */
    getEasingFunction(name) {
        const easings = {
            linear: t => t,
            easeIn: t => t * t,
            easeOut: t => t * (2 - t),
            easeInOut: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
            easeInCubic: t => t * t * t,
            easeOutCubic: t => (--t) * t * t + 1,
            easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * t - 2) * (2 * t - 2) + 1,
            bounce: t => {
                const n1 = 7.5625;
                const d1 = 2.75;
                if (t < 1 / d1) return n1 * t * t;
                if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75;
                if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;
                return n1 * (t -= 2.625 / d1) * t + 0.984375;
            }
        };

        return easings[name] || easings.easeInOut;
    }

    /**
     * Animate element property
     */
    animateElement(element, property, from, to, options = {}) {
        const id = `${element.id || 'element'}_${property}_${Date.now()}`;

        return this.register(id, (progress) => {
            const value = from + (to - from) * progress;

            if (property === 'opacity' || property === 'scale') {
                element.style[property] = value;
            } else if (property === 'translateX' || property === 'translateY') {
                const axis = property.replace('translate', '');
                element.style.transform = `translate${axis}(${value}px)`;
            } else {
                element.style[property] = `${value}px`;
            }
        }, options);
    }

    /**
     * Fade in element
     */
    fadeIn(element, duration = 300) {
        element.style.opacity = '0';
        return this.animateElement(element, 'opacity', 0, 1, { duration });
    }

    /**
     * Fade out element
     */
    fadeOut(element, duration = 300) {
        return this.animateElement(element, 'opacity', 1, 0, { duration });
    }

    /**
     * Slide in element
     */
    slideIn(element, direction = 'left', duration = 300) {
        const from = direction === 'left' ? -100 : 100;
        const property = direction === 'left' || direction === 'right' ? 'translateX' : 'translateY';
        return this.animateElement(element, property, from, 0, { duration });
    }

    /**
     * Remove animation
     */
    remove(id) {
        this.stop(id);
        this.animations.delete(id);
    }

    /**
     * Clear all animations
     */
    clear() {
        this.animations.forEach((_, id) => this.stop(id));
        this.animations.clear();
    }

    /**
     * Pause all animations
     */
    pauseAll() {
        this.isRunning = false;
        if (this.rafId) {
            cancelAnimationFrame(this.rafId);
            this.rafId = null;
        }
    }

    /**
     * Resume all animations
     */
    resumeAll() {
        if (!this.isRunning && this.animations.size > 0) {
            this.isRunning = true;
            this.tick();
        }
    }
}

export const animationController = new AnimationController();
