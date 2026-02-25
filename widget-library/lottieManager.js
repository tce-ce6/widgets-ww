/**
 * LottieManager - Unified Lottie Animation Handler
 * Manages Lottie animation lifecycle, cleanup, and session management
 * 
 * Usage:
 *   const manager = new LottieManager();
 *   manager.playAnimation('assets/anim.json', containerElement, {loop: false, autoplay: true});
 */

class LottieManager {
    constructor() {
        this.currentLottie = null;
        this.sessionId = 0;
        this.isAvailable = typeof lottie !== 'undefined';
    }

    /**
     * Play an animation
     * @param {string} animationPath - Path to the animation JSON file
     * @param {HTMLElement} container - Container element for the animation
     * @param {Object} options - Configuration options
     * @param {boolean} options.loop - Whether to loop the animation (default: false)
     * @param {boolean} options.autoplay - Whether to autoplay (default: true)
     * @param {string} options.renderer - Renderer type: 'svg', 'canvas', 'html' (default: 'svg')
     * @param {Function} options.onComplete - Callback when animation completes (for non-looping)
     * @returns {Object|null} - The lottie instance or null if lottie unavailable
     */
    playAnimation(animationPath, container, options = {}) {
        if (!this.isAvailable) {
            console.warn('Lottie library not available');
            return null;
        }

        this.removeAnimation();

        const {
            loop = false,
            autoplay = true,
            renderer = 'svg',
            onComplete = null,
            speed = 1
        } = options;

        const session = ++this.sessionId;
        const config = {
            container,
            renderer,
            loop,
            autoplay,
            path: animationPath,
            speed
        };

        this.currentLottie = lottie.loadAnimation(config);

        if (!loop && onComplete) {
            this.currentLottie.addEventListener('complete', () => {
                if (session === this.sessionId) {
                    onComplete();
                }
            });
        }

        if (!loop && !onComplete) {
            // Auto-cleanup after completion
            this.currentLottie.addEventListener('complete', () => {
                if (session === this.sessionId) {
                    setTimeout(() => this.removeAnimation(), 100);
                }
            });
        }

        return this.currentLottie;
    }

    /**
     * Play animation in SVG foreign object (common in widgets)
     * @param {string} animationPath - Path to animation JSON
     * @param {SVGElement} svgGroup - Target SVG group/container
     * @param {Object} options - Configuration with x, y, width, height
     */
    playAnimationInSVG(animationPath, svgGroup, options = {}) {
        const {
            x = 0,
            y = 0,
            width = 1920,
            height = 1080,
            loop = false,
            autoplay = true,
            onComplete = null,
            pointerEvents = 'none',
            zIndex = 9999
        } = options;

        // Create foreignObject
        const fo = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject');
        fo.setAttribute('x', x);
        fo.setAttribute('y', y);
        fo.setAttribute('width', width.toString());
        fo.setAttribute('height', height.toString());
        fo.id = 'lottie-animation-fo-' + this.sessionId;
        fo.style.pointerEvents = pointerEvents;
        fo.style.zIndex = zIndex;

        // Create container div
        const div = document.createElement('div');
        div.id = 'lottie-animation-div-' + this.sessionId;
        div.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');
        div.style.width = '100%';
        div.style.height = '100%';
        div.style.pointerEvents = 'none';

        fo.appendChild(div);
        svgGroup.appendChild(fo);

        const wrappedOnComplete = () => {
            if (onComplete) onComplete();
            this.removeAnimation();
        };

        this.playAnimation(animationPath, div, {
            loop,
            autoplay,
            renderer: 'svg',
            onComplete: loop ? null : wrappedOnComplete
        });

        return fo;
    }

    /**
     * Remove current animation and cleanup
     */
    removeAnimation() {
        if (this.currentLottie) {
            try {
                this.currentLottie.destroy();
                this.currentLottie = null;
            } catch (e) {
                console.warn('Error destroying lottie animation:', e);
            }
        }

        // Remove all animation containers
        document.querySelectorAll('[id^="lottie-animation-fo-"]').forEach(el => el.remove());
        document.querySelectorAll('[id^="lottie-animation-div-"]').forEach(el => el.remove());
    }

    /**
     * Pause current animation
     */
    pause() {
        if (this.currentLottie && !this.currentLottie.isPaused) {
            this.currentLottie.pause();
        }
    }

    /**
     * Resume current animation
     */
    play() {
        if (this.currentLottie && this.currentLottie.isPaused) {
            this.currentLottie.play();
        }
    }

    /**
     * Set animation speed
     * @param {number} speed - Speed multiplier (1 = normal, 2 = 2x speed, 0.5 = half speed)
     */
    setSpeed(speed) {
        if (this.currentLottie) {
            this.currentLottie.setSpeed(speed);
        }
    }

    /**
     * Get current animation instance
     */
    getInstance() {
        return this.currentLottie;
    }

    /**
     * Check if animation is available
     */
    isLottieAvailable() {
        return this.isAvailable;
    }
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = LottieManager;
}
