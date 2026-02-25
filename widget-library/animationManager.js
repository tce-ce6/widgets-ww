/**
 * AnimationManager - Handle animations, transitions, and timing
 * Provides utilities for smooth animations and keyframe control
 * 
 * Usage:
 *   const animator = new AnimationManager();
 *   animator.animateValue(0, 100, 500, (val) => console.log(val));
 */

class AnimationManager {
    constructor() {
        this.activeAnimations = new Map();
        this.animationId = 0;
    }

    /**
     * Animate numeric value from start to end
     * @param {number} startValue - Starting value
     * @param {number} endValue - Ending value
     * @param {number} duration - Duration in ms
     * @param {Function} onChange - Callback with current value
     * @param {Function} onComplete - Callback on completion
     * @param {string} easingFn - Easing function name (see easingFunctions)
     * @returns {string} - Animation ID for cancellation
     */
    animateValue(startValue, endValue, duration, onChange, onComplete = null, easingFn = 'easeInOutQuad') {
        const animId = `anim-${++this.animationId}`;
        const easing = this.easingFunctions[easingFn] || this.easingFunctions.linear;
        const startTime = Date.now();

        const animate = () => {
            const now = Date.now();
            const elapsed = Math.min(now - startTime, duration);
            const progress = elapsed / duration;
            const easeProgress = easing(progress);
            const value = startValue + (endValue - startValue) * easeProgress;

            onChange(value);

            if (elapsed < duration) {
                const frameId = requestAnimationFrame(animate);
                this.activeAnimations.set(animId, frameId);
            } else {
                onChange(endValue);
                if (onComplete) onComplete();
                this.activeAnimations.delete(animId);
            }
        };

        const frameId = requestAnimationFrame(animate);
        this.activeAnimations.set(animId, frameId);

        return animId;
    }

    /**
     * Animate element property using CSS transitions
     * @param {HTMLElement|SVGElement} element - Element to animate
     * @param {string} property - CSS property name
     * @param {string} from - Starting value
     * @param {string} to - Ending value
     * @param {number} duration - Duration in ms
     * @param {Function} callback - Called on completion
     */
    animateProperty(element, property, from, to, duration = 300, callback = null) {
        element.style[property] = from;
        element.style.transition = `${property} ${duration}ms ease-in-out`;

        setTimeout(() => {
            element.style[property] = to;
        }, 10);

        setTimeout(() => {
            element.style.transition = '';
            if (callback) callback();
        }, duration);
    }

    /**
     * Animate multiple properties simultaneously
     * @param {HTMLElement|SVGElement} element - Element to animate
     * @param {Object} properties - {property: {from, to}}
     * @param {number} duration - Duration in ms
     * @param {Function} callback - Called on completion
     */
    animateProperties(element, properties, duration = 300, callback = null) {
        const transitionProps = Object.keys(properties).map(prop => `${prop} ${duration}ms ease-in-out`).join(', ');
        element.style.transition = transitionProps;

        // Apply from values
        Object.entries(properties).forEach(([prop, config]) => {
            element.style[prop] = config.from;
        });

        setTimeout(() => {
            // Apply to values
            Object.entries(properties).forEach(([prop, config]) => {
                element.style[prop] = config.to;
            });
        }, 10);

        setTimeout(() => {
            element.style.transition = '';
            if (callback) callback();
        }, duration);
    }

    /**
     * Fade in element
     * @param {HTMLElement} element - Element to fade in
     * @param {number} duration - Duration in ms
     * @param {Function} callback - Called on completion
     */
    fadeIn(element, duration = 300, callback = null) {
        element.style.opacity = '0';
        element.style.display = 'block';
        element.style.transition = `opacity ${duration}ms ease-in-out`;

        setTimeout(() => {
            element.style.opacity = '1';
        }, 10);

        setTimeout(() => {
            element.style.transition = '';
            if (callback) callback();
        }, duration);
    }

    /**
     * Fade out element
     * @param {HTMLElement} element - Element to fade out
     * @param {number} duration - Duration in ms
     * @param {Function} callback - Called on completion
     */
    fadeOut(element, duration = 300, callback = null) {
        element.style.transition = `opacity ${duration}ms ease-in-out`;
        element.style.opacity = '0';

        setTimeout(() => {
            element.style.display = 'none';
            element.style.transition = '';
            if (callback) callback();
        }, duration);
    }

    /**
     * Slide element in
     * @param {HTMLElement} element - Element to slide in
     * @param {string} direction - 'left', 'right', 'up', 'down'
     * @param {number} distance - Distance to slide in px
     * @param {number} duration - Duration in ms
     * @param {Function} callback - Called on completion
     */
    slideIn(element, direction = 'left', distance = 100, duration = 300, callback = null) {
        const translateMap = {
            'left': `translateX(-${distance}px)`,
            'right': `translateX(${distance}px)`,
            'up': `translateY(-${distance}px)`,
            'down': `translateY(${distance}px)`
        };

        element.style.transform = translateMap[direction];
        element.style.transition = `transform ${duration}ms ease-out`;

        setTimeout(() => {
            element.style.transform = 'translate(0, 0)';
        }, 10);

        setTimeout(() => {
            element.style.transition = '';
            if (callback) callback();
        }, duration);
    }

    /**
     * Slide element out
     * @param {HTMLElement} element - Element to slide out
     * @param {string} direction - 'left', 'right', 'up', 'down'
     * @param {number} distance - Distance to slide in px
     * @param {number} duration - Duration in ms
     * @param {Function} callback - Called on completion
     */
    slideOut(element, direction = 'left', distance = 100, duration = 300, callback = null) {
        const translateMap = {
            'left': `translateX(-${distance}px)`,
            'right': `translateX(${distance}px)`,
            'up': `translateY(-${distance}px)`,
            'down': `translateY(${distance}px)`
        };

        element.style.transition = `transform ${duration}ms ease-in`;
        element.style.transform = translateMap[direction];

        setTimeout(() => {
            element.style.transition = '';
            if (callback) callback();
        }, duration);
    }

    /**
     * Scale element
     * @param {HTMLElement|SVGElement} element - Element to scale
     * @param {number} fromScale - Starting scale (1 = normal)
     * @param {number} toScale - Ending scale
     * @param {number} duration - Duration in ms
     * @param {Function} callback - Called on completion
     */
    scale(element, fromScale = 0.5, toScale = 1, duration = 300, callback = null) {
        element.style.transform = `scale(${fromScale})`;
        element.style.transformOrigin = 'center';
        element.style.transition = `transform ${duration}ms ease-out`;

        setTimeout(() => {
            element.style.transform = `scale(${toScale})`;
        }, 10);

        setTimeout(() => {
            element.style.transition = '';
            if (callback) callback();
        }, duration);
    }

    /**
     * Rotate element
     * @param {HTMLElement|SVGElement} element - Element to rotate
     * @param {number} fromDegrees - Starting rotation
     * @param {number} toDegrees - Ending rotation
     * @param {number} duration - Duration in ms
     * @param {Function} callback - Called on completion
     */
    rotate(element, fromDegrees = 0, toDegrees = 360, duration = 1000, callback = null) {
        element.style.transform = `rotate(${fromDegrees}deg)`;
        element.style.transformOrigin = 'center';
        element.style.transition = `transform ${duration}ms linear`;

        setTimeout(() => {
            element.style.transform = `rotate(${toDegrees}deg)`;
        }, 10);

        setTimeout(() => {
            element.style.transition = '';
            if (callback) callback();
        }, duration);
    }

    /**
     * Bounce animation
     * @param {HTMLElement|SVGElement} element - Element to bounce
     * @param {number} intensity - Bounce height in px
     * @param {number} duration - Duration in ms
     * @param {Function} callback - Called on completion
     */
    bounce(element, intensity = 20, duration = 600, callback = null) {
        const animId = this.animateValue(0, intensity * 2, duration / 2, (val) => {
            const progress = 1 - Math.abs((val - intensity) / intensity);
            element.style.transform = `translateY(-${val}px)`;
        }, () => {
            element.style.transform = 'translateY(0)';
            if (callback) callback();
        }, 'easeInOutQuad');

        return animId;
    }

    /**
     * Pulse animation
     * @param {HTMLElement|SVGElement} element - Element to pulse
     * @param {number} intensity - Max pulse scale (1.2 = 20% larger)
     * @param {number} duration - Duration for one pulse in ms
     * @param {number} count - Number of pulses (0 = infinite until cancelled)
     */
    pulse(element, intensity = 1.1, duration = 400, count = 1) {
        let pulseCount = 0;

        const doPulse = () => {
            if (count > 0 && pulseCount >= count) return;

            this.scale(element, 1, intensity, duration / 2, () => {
                this.scale(element, intensity, 1, duration / 2, () => {
                    pulseCount++;
                    if (count === 0 || pulseCount < count) {
                        doPulse();
                    }
                });
            });
        };

        doPulse();
    }

    /**
     * Shake animation
     * @param {HTMLElement|SVGElement} element - Element to shake
     * @param {number} intensity - Shake distance in px
     * @param {number} duration - Total duration in ms
     * @param {Function} callback - Called on completion
     */
    shake(element, intensity = 10, duration = 400, callback = null) {
        const shakes = 8;
        const shakeInterval = duration / shakes;
        let shakeCount = 0;

        const doShake = () => {
            const offset = (shakeCount % 2 === 0 ? 1 : -1) * intensity;
            element.style.transform = `translateX(${offset}px)`;
            shakeCount++;

            if (shakeCount < shakes) {
                setTimeout(doShake, shakeInterval);
            } else {
                element.style.transform = 'translateX(0)';
                if (callback) callback();
            }
        };

        doShake();
    }

    /**
     * Cancel animation by ID
     * @param {string} animId - Animation ID from animateValue
     */
    cancel(animId) {
        const frameId = this.activeAnimations.get(animId);
        if (frameId) {
            cancelAnimationFrame(frameId);
            this.activeAnimations.delete(animId);
        }
    }

    /**
     * Cancel all active animations
     */
    cancelAll() {
        this.activeAnimations.forEach(frameId => {
            cancelAnimationFrame(frameId);
        });
        this.activeAnimations.clear();
    }

    /**
     * Easing functions
     */
    easingFunctions = {
        linear: t => t,
        easeInQuad: t => t * t,
        easeOutQuad: t => t * (2 - t),
        easeInOutQuad: t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t,
        easeInCubic: t => t * t * t,
        easeOutCubic: t => (--t) * t * t + 1,
        easeInOutCubic: t => t < 0.5 ? 4 * t * t * t : (t - 1) * (2 * (t - 2)) * (2 * (t - 2)) + 1,
        easeInQuart: t => t * t * t * t,
        easeOutQuart: t => 1 - (--t) * t * t * t,
        easeInOutQuart: t => t < 0.5 ? 8 * t * t * t * t : 1 - 8 * (--t) * t * t * t,
        easeInQuint: t => t * t * t * t * t,
        easeOutQuint: t => 1 + (--t) * t * t * t * t,
        easeInOutQuint: t => t < 0.5 ? 16 * t * t * t * t * t : 1 + 16 * (--t) * t * t * t * t,
        easeInExpo: t => t === 0 ? 0 : Math.pow(2, 10 * t - 10),
        easeOutExpo: t => t === 1 ? 1 : 1 - Math.pow(2, -10 * t),
        easeInOutExpo: t => t === 0 ? 0 : t === 1 ? 1 : t < 0.5 ? Math.pow(2, 20 * t - 10) / 2 : (2 - Math.pow(2, -20 * t + 10)) / 2,
        easeInCirc: t => t >= 1 ? t : -(Math.sqrt(1 - t * t) - 1),
        easeOutCirc: t => Math.sqrt(1 - (--t) * t),
        easeInOutCirc: t => t < 0.5 ? (Math.sqrt(1 - Math.pow(2 * t, 2)) - 1) / -2 : (Math.sqrt(1 - Math.pow(-2 * t + 2, 2)) + 1) / 2,
        easeInElastic: t => t === 0 ? 0 : t === 1 ? 1 : -Math.pow(2, 10 * t - 10) * Math.sin((t * 10 - 10.75) * ((2 * Math.PI) / 3)),
        easeOutElastic: t => t === 0 ? 0 : t === 1 ? 1 : Math.pow(2, -10 * t) * Math.sin((t * 10 - 0.75) * ((2 * Math.PI) / 3)) + 1,
        easeOutBounce: t => {
            const n1 = 7.5625;
            const d1 = 2.75;
            if (t < 1 / d1) return n1 * t * t;
            else if (t < 2 / d1) return n1 * (t -= 1.5 / d1) * t + 0.75;
            else if (t < 2.5 / d1) return n1 * (t -= 2.25 / d1) * t + 0.9375;
            else return n1 * (t -= 2.625 / d1) * t + 0.984375;
        }
    };
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnimationManager;
}
