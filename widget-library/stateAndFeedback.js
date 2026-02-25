/**
 * StateManager - Centralized State Management for Widgets
 * Manages widget state with event emission and observers
 * 
 * Usage:
 *   const state = new StateManager();
 *   state.set('isAnimating', true);
 *   state.subscribe('isAnimating', (newVal, oldVal) => console.log(newVal));
 */

class StateManager {
    constructor() {
        this.state = {};
        this.observers = {};
        this.history = [];
        this.maxHistory = 50;
    }

    /**
     * Set state value
     * @param {string} key - State key
     * @param {*} value - New value
     * @param {boolean} trackHistory - Track this change in history
     */
    set(key, value, trackHistory = true) {
        const oldValue = this.state[key];

        // Don't update if value hasn't changed
        if (oldValue === value) return;

        this.state[key] = value;

        if (trackHistory) {
            this.history.push({ key, oldValue, newValue: value, timestamp: Date.now() });
            if (this.history.length > this.maxHistory) {
                this.history.shift();
            }
        }

        // Notify observers
        if (this.observers[key]) {
            this.observers[key].forEach(callback => {
                try {
                    callback(value, oldValue);
                } catch (e) {
                    console.error(`Error in observer for '${key}':`, e);
                }
            });
        }
    }

    /**
     * Get state value
     * @param {string} key - State key
     * @param {*} defaultValue - Default if key doesn't exist
     * @returns {*}
     */
    get(key, defaultValue = undefined) {
        return this.state.hasOwnProperty(key) ? this.state[key] : defaultValue;
    }

    /**
     * Check if state value exists
     * @param {string} key - State key
     * @returns {boolean}
     */
    has(key) {
        return this.state.hasOwnProperty(key);
    }

    /**
     * Subscribe to state changes
     * @param {string} key - State key to observe
     * @param {Function} callback - Called with (newValue, oldValue)
     * @returns {Function} - Unsubscribe function
     */
    subscribe(key, callback) {
        if (!this.observers[key]) {
            this.observers[key] = [];
        }

        this.observers[key].push(callback);

        // Return unsubscribe function
        return () => {
            const index = this.observers[key].indexOf(callback);
            if (index > -1) {
                this.observers[key].splice(index, 1);
            }
        };
    }

    /**
     * Subscribe once to a state change
     * @param {string} key - State key
     * @param {Function} callback - Called once with (newValue, oldValue)
     */
    subscribeOnce(key, callback) {
        const unsubscribe = this.subscribe(key, (newVal, oldVal) => {
            callback(newVal, oldVal);
            unsubscribe();
        });
        return unsubscribe;
    }

    /**
     * Toggle boolean state
     * @param {string} key - State key
     * @returns {boolean} - New value
     */
    toggle(key) {
        const current = this.get(key, false);
        this.set(key, !current);
        return !current;
    }

    /**
     * Increment numeric state
     * @param {string} key - State key
     * @param {number} amount - Amount to increment (default: 1)
     * @returns {number} - New value
     */
    increment(key, amount = 1) {
        const current = this.get(key, 0);
        const newValue = current + amount;
        this.set(key, newValue);
        return newValue;
    }

    /**
     * Decrement numeric state
     * @param {string} key - State key
     * @param {number} amount - Amount to decrement (default: 1)
     * @returns {number} - New value
     */
    decrement(key, amount = 1) {
        return this.increment(key, -amount);
    }

    /**
     * Reset state to initial value or empty
     * @param {string} key - State key
     * @param {*} initialValue - Value to reset to
     */
    reset(key, initialValue = undefined) {
        this.set(key, initialValue);
    }

    /**
     * Clear all state
     */
    clear() {
        this.state = {};
        this.observers = {};
        this.history = [];
    }

    /**
     * Get all state as object
     * @returns {Object}
     */
    getAll() {
        return { ...this.state };
    }

    /**
     * Set multiple state values at once
     * @param {Object} updates - Key-value pairs to update
     */
    setMultiple(updates) {
        Object.entries(updates).forEach(([key, value]) => {
            this.set(key, value);
        });
    }

    /**
     * Get state change history
     * @returns {Array}
     */
    getHistory() {
        return [...this.history];
    }

    /**
     * Batch state updates (single notification)
     * @param {Function} updatesFn - Function that calls set() multiple times
     */
    batch(updatesFn) {
        // Simple implementation - could be enhanced with proper batching
        updatesFn();
    }

    /**
     * Create a snapshot of current state
     * @returns {Object}
     */
    snapshot() {
        return { ...this.state };
    }

    /**
     * Restore state from snapshot
     * @param {Object} snapshot - State snapshot
     */
    restore(snapshot) {
        Object.entries(snapshot).forEach(([key, value]) => {
            this.set(key, value);
        });
    }
}

/**
 * FeedbackManager - Unified Feedback & Modal Management
 * Handles modals, notifications, and visual feedback
 * 
 * Usage:
 *   const feedback = new FeedbackManager();
 *   feedback.showModal('success', 'message', 'assets/icon.svg');
 */

class FeedbackManager {
    constructor() {
        this.activeModals = new Map();
        this.feedbackElements = new Map();
    }

    /**
     * Show modal with feedback
     * @param {string} type - 'success', 'error', 'warning', 'info'
     * @param {string} message - Feedback message
     * @param {string} iconPath - Optional path to icon/animation asset
     * @param {Object} options - {duration, callback, centered, backdrop}
     */
    showFeedback(type, message, iconPath = null, options = {}) {
        const {
            duration = 3000,
            callback = null,
            className = '',
            customHTML = false
        } = options;

        // Create feedback element
        const feedbackId = `feedback-${Date.now()}`;
        const feedback = document.createElement('div');
        feedback.id = feedbackId;
        feedback.className = `widget-feedback widget-feedback-${type} ${className}`;
        feedback.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            z-index: 10000;
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 4px 20px rgba(0,0,0,0.15);
            text-align: center;
            min-width: 200px;
        `;

        if (customHTML) {
            feedback.innerHTML = message;
        } else {
            // Generate standard feedback HTML
            const colorMap = {
                success: '#10b981',
                error: '#ef4444',
                warning: '#f59e0b',
                info: '#3b82f6'
            };

            feedback.innerHTML = `
                <div style="color: ${colorMap[type] || '#666'}; font-weight: bold; margin-bottom: 8px;">
                    ${type.toUpperCase()}
                </div>
                <div style="color: #333; font-size: 14px;">
                    ${message}
                </div>
            `;
        }

        document.body.appendChild(feedback);
        this.feedbackElements.set(feedbackId, feedback);

        // Auto-hide
        if (duration > 0) {
            setTimeout(() => {
                this.hideFeedback(feedbackId, callback);
            }, duration);
        }

        return feedbackId;
    }

    /**
     * Hide feedback element
     * @param {string} feedbackId - ID of feedback element
     * @param {Function} callback - Called after hidden
     */
    hideFeedback(feedbackId, callback = null) {
        const feedback = this.feedbackElements.get(feedbackId);
        if (feedback) {
            feedback.style.opacity = '0';
            feedback.style.transition = 'opacity 300ms ease-out';

            setTimeout(() => {
                if (feedback.parentNode) {
                    feedback.parentNode.removeChild(feedback);
                }
                this.feedbackElements.delete(feedbackId);
                if (callback) callback();
            }, 300);
        }
    }

    /**
     * Create and show modal dialog
     * @param {Object} options - Configuration
     * @param {string} options.title - Modal title
     * @param {string} options.content - Modal content (HTML)
     * @param {Object} options.buttons - {label: callback} pairs
     * @param {Function} options.onClose - Called when modal closes
     * @param {boolean} options.backdrop - Show backdrop (default: true)
     * @returns {string} - Modal ID
     */
    showModal(options = {}) {
        const {
            title = 'Dialog',
            content = '',
            buttons = {},
            onClose = null,
            backdrop = true,
            centered = true
        } = options;

        const modalId = `modal-${Date.now()}`;

        // Create backdrop
        if (backdrop) {
            const bg = document.createElement('div');
            bg.id = `${modalId}-backdrop`;
            bg.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.5);
                z-index: 9998;
            `;
            document.body.appendChild(bg);
        }

        // Create modal
        const modal = document.createElement('div');
        modal.id = modalId;
        modal.className = 'widget-modal';
        modal.style.cssText = `
            position: fixed;
            ${centered ? 'top: 50%; left: 50%; transform: translate(-50%, -50%);' : 'top: 20px; left: 50%; transform: translateX(-50%);'}
            z-index: 9999;
            background: white;
            border-radius: 12px;
            box-shadow: 0 20px 60px rgba(0,0,0,0.3);
            min-width: 300px;
            max-width: 90%;
            max-height: 90vh;
            overflow: auto;
            padding: 0;
        `;

        // Modal header
        const header = document.createElement('div');
        header.style.cssText = `
            padding: 20px;
            border-bottom: 1px solid #e5e7eb;
            font-size: 18px;
            font-weight: bold;
            color: #111;
        `;
        header.textContent = title;
        modal.appendChild(header);

        // Modal content
        const contentDiv = document.createElement('div');
        contentDiv.style.cssText = `
            padding: 20px;
            color: #333;
            line-height: 1.5;
        `;
        contentDiv.innerHTML = content;
        modal.appendChild(contentDiv);

        // Modal footer with buttons
        if (Object.keys(buttons).length > 0) {
            const footer = document.createElement('div');
            footer.style.cssText = `
                padding: 15px 20px;
                border-top: 1px solid #e5e7eb;
                display: flex;
                justify-content: flex-end;
                gap: 10px;
            `;

            Object.entries(buttons).forEach(([label, callback]) => {
                const btn = document.createElement('button');
                btn.textContent = label;
                btn.style.cssText = `
                    padding: 8px 16px;
                    border: 1px solid #d1d5db;
                    border-radius: 6px;
                    background: #f3f4f6;
                    cursor: pointer;
                    font-size: 14px;
                    transition: background 0.2s;
                `;
                btn.addEventListener('mouseenter', () => btn.style.background = '#e5e7eb');
                btn.addEventListener('mouseleave', () => btn.style.background = '#f3f4f6');
                btn.addEventListener('click', () => {
                    if (callback) callback();
                    this.closeModal(modalId, onClose);
                });

                footer.appendChild(btn);
            });

            modal.appendChild(footer);
        }

        document.body.appendChild(modal);
        this.activeModals.set(modalId, { modal, backdrop, onClose });

        return modalId;
    }

    /**
     * Close modal
     * @param {string} modalId - Modal ID to close
     * @param {Function} callback - Called after closed
     */
    closeModal(modalId, callback = null) {
        const modalData = this.activeModals.get(modalId);
        if (!modalData) return;

        const { modal, backdrop } = modalData;

        modal.style.opacity = '0';
        modal.style.transition = 'opacity 300ms ease-out';

        setTimeout(() => {
            if (modal.parentNode) modal.parentNode.removeChild(modal);

            if (backdrop) {
                const bg = document.getElementById(`${modalId}-backdrop`);
                if (bg && bg.parentNode) bg.parentNode.removeChild(bg);
            }

            this.activeModals.delete(modalId);

            if (callback) callback();
        }, 300);
    }

    /**
     * Close all modals
     */
    closeAll() {
        Array.from(this.activeModals.keys()).forEach(id => {
            this.closeModal(id);
        });
    }

    /**
     * Show loading indicator
     * @param {string} message - Loading message
     * @returns {string} - Indicator ID
     */
    showLoading(message = 'Loading...') {
        return this.showFeedback('info', `
            <div style="display: flex; align-items: center; gap: 10px; justify-content: center;">
                <div style="width: 20px; height: 20px; border: 3px solid #e5e7eb; border-top-color: #3b82f6; border-radius: 50%; animation: spin 1s linear infinite;"></div>
                <span>${message}</span>
            </div>
        `, null, { duration: 0, customHTML: true });
    }

    /**
     * Show blinking/pulsing element
     * @param {SVGElement|HTMLElement} element - Element to blink
     * @param {boolean} enable - Enable/disable blinking
     */
    setBlink(element, enable = true) {
        if (enable) {
            element.classList.add('widget-blinking');
            element.style.animation = 'widget-blink 0.6s infinite';
        } else {
            element.classList.remove('widget-blinking');
            element.style.animation = '';
        }
    }
}

// Add global styles for animations
if (typeof document !== 'undefined' && !document.getElementById('widget-feedback-styles')) {
    const style = document.createElement('style');
    style.id = 'widget-feedback-styles';
    style.textContent = `
        @keyframes spin {
            to { transform: rotate(360deg); }
        }
        @keyframes widget-blink {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
        }
        .widget-blinking {
            animation: widget-blink 0.6s infinite;
        }
    `;
    document.head.appendChild(style);
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { StateManager, FeedbackManager };
}
