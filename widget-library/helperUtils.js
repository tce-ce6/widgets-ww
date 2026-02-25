/**
 * HelperUtils - Common utility functions for widgets
 * Shuffle, validation, data management, caching, etc
 * 
 * Usage:
 *   HelperUtils.shuffle(array);
 *   HelperUtils.debounce(func, 300);
 */

class HelperUtils {
    /**
     * Fisher-Yates shuffle algorithm
     * Shuffles array in place AND returns new array
     * @param {Array} array - Array to shuffle
     * @param {boolean} inPlace - Shuffle in place or create copy (default: false)
     * @returns {Array} - Shuffled array
     */
    static shuffle(array, inPlace = false) {
        const arr = inPlace ? array : [...array];

        for (let i = arr.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }

        return arr;
    }

    /**
     * Shuffle array ensuring no element stays in original position (hard shuffle)
     * @param {Array} array - Array to shuffle
     * @param {number} maxAttempts - Max attempts to find valid shuffle
     * @returns {Array|null} - Shuffled array or null if impossible
     */
    static shuffleHard(array, maxAttempts = 100) {
        const original = array.map((item, idx) => ({ item, originalIndex: idx }));
        let shuffled;
        let valid = false;
        let attempts = 0;

        while (!valid && attempts < maxAttempts) {
            shuffled = this.shuffle([...original]);
            valid = shuffled.every((curr, idx) => curr.originalIndex !== original[idx].originalIndex);
            attempts++;
        }

        return valid ? shuffled.map(x => x.item) : null;
    }

    /**
     * Shuffle array by specific positions
     * @param {Array} items - Items to shuffle
     * @param {Array} positions - Position objects with x, y properties
     * @param {Function} prevPositionGetter - Function to get previous position
     * @returns {Array} - Shuffled positions
     */
    static shufflePositions(items, positions, prevPositionGetter) {
        let shuffled;
        let valid = false;
        let attempts = 0;

        while (!valid && attempts < 100) {
            shuffled = this.shuffle([...positions]);
            valid = items.every((item, i) => {
                const prev = prevPositionGetter(item);
                const newPos = shuffled[i];
                return prev.x !== newPos.x || prev.y !== newPos.y;
            });
            attempts++;
        }

        return valid ? shuffled : this.shuffle(positions);
    }

    /**
     * Debounce function calls
     * @param {Function} func - Function to debounce
     * @param {number} delay - Delay in ms
     * @returns {Function} - Debounced function
     */
    static debounce(func, delay = 300) {
        let timeoutId;

        return function (...args) {
            clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                func.apply(this, args);
            }, delay);
        };
    }

    /**
     * Throttle function calls
     * @param {Function} func - Function to throttle
     * @param {number} limit - Minimum time between calls in ms
     * @returns {Function} - Throttled function
     */
    static throttle(func, limit = 300) {
        let inThrottle;

        return function (...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }

    /**
     * Load JSON data from file
     * @param {string} path - Path to JSON file
     * @returns {Promise<Object>} - Parsed JSON data
     */
    static async loadJSON(path) {
        try {
            const response = await fetch(path);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Error loading JSON from ${path}:`, error);
            throw error;
        }
    }

    /**
     * Load multiple JSON files
     * @param {Array<string>} paths - Array of file paths
     * @returns {Promise<Array>} - Array of parsed data
     */
    static async loadJSONMultiple(paths) {
        return Promise.all(paths.map(path => this.loadJSON(path)));
    }

    /**
     * Cache fetch results
     * @returns {Object} - Cache object with methods
     */
    static createCache() {
        const cache = new Map();

        return {
            get: (key) => cache.get(key),
            set: (key, value, ttl = null) => {
                cache.set(key, value);
                if (ttl) {
                    setTimeout(() => cache.delete(key), ttl);
                }
            },
            has: (key) => cache.has(key),
            delete: (key) => cache.delete(key),
            clear: () => cache.clear(),
            size: () => cache.size
        };
    }

    /**
     * Deep clone object
     * @param {*} obj - Object to clone
     * @returns {*} - Cloned object
     */
    static deepClone(obj) {
        if (obj === null || typeof obj !== 'object') return obj;
        if (obj instanceof Date) return new Date(obj);
        if (obj instanceof Array) return obj.map(item => this.deepClone(item));
        if (obj instanceof Object) {
            const cloned = {};
            for (const key in obj) {
                if (obj.hasOwnProperty(key)) {
                    cloned[key] = this.deepClone(obj[key]);
                }
            }
            return cloned;
        }
    }

    /**
     * Validate email
     * @param {string} email - Email to validate
     * @returns {boolean}
     */
    static isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    /**
     * Validate URL
     * @param {string} url - URL to validate
     * @returns {boolean}
     */
    static isValidURL(url) {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    }

    /**
     * Get query parameters from URL
     * @param {string} url - URL to parse (default: current URL)
     * @returns {Object} - Query parameters as key-value pairs
     */
    static getQueryParams(url = window.location.href) {
        const urlObj = new URL(url);
        const params = {};
        urlObj.searchParams.forEach((value, key) => {
            params[key] = value;
        });
        return params;
    }

    /**
     * Format number with commas
     * @param {number} num - Number to format
     * @returns {string}
     */
    static formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    /**
     * Convert seconds to time string (HH:MM:SS)
     * @param {number} seconds - Total seconds
     * @returns {string}
     */
    static secondsToTime(seconds) {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = Math.floor(seconds % 60);

        return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }

    /**
     * Generate random ID
     * @param {string} prefix - Optional prefix
     * @returns {string}
     */
    static generateId(prefix = '') {
        return prefix + Math.random().toString(36).substr(2, 9);
    }

    /**
     * Generate random color
     * @returns {string} - Random hex color
     */
    static randomColor() {
        return '#' + Math.floor(Math.random() * 16777215).toString(16);
    }

    /**
     * Get random item from array
     * @param {Array} array - Array to pick from
     * @returns {*}
     */
    static random(array) {
        return array[Math.floor(Math.random() * array.length)];
    }

    /**
     * Wait for condition to be true
     * @param {Function} condition - Function returning boolean
     * @param {number} maxWait - Max wait time in ms
     * @param {number} checkInterval - Check interval in ms
     * @returns {Promise<boolean>}
     */
    static waitFor(condition, maxWait = 5000, checkInterval = 100) {
        return new Promise((resolve, reject) => {
            const startTime = Date.now();
            const checkCond = () => {
                if (condition()) {
                    resolve(true);
                } else if (Date.now() - startTime > maxWait) {
                    reject(new Error('Timeout waiting for condition'));
                } else {
                    setTimeout(checkCond, checkInterval);
                }
            };
            checkCond();
        });
    }

    /**
     * Delay execution
     * @param {number} ms - Delay in milliseconds
     * @returns {Promise}
     */
    static delay(ms = 1000) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /**
     * Check if browser supports feature
     * @param {string} feature - Feature name ('touch', 'webgl', 'geolocation', etc)
     * @returns {boolean}
     */
    static supportsFeature(feature) {
        const features = {
            'touch': () => 'ontouchstart' in window,
            'webgl': () => !!document.createElement('canvas').getContext('webgl'),
            'geolocation': () => 'geolocation' in navigator,
            'localStorage': () => 'localStorage' in window,
            'serviceWorker': () => 'serviceWorker' in navigator,
            'deviceOrientation': () => 'DeviceOrientationEvent' in window,
            'vibration': () => 'vibrate' in navigator,
            'clipboard': () => 'clipboard' in navigator
        };

        return features[feature] ? features[feature]() : false;
    }

    /**
     * Get device/browser info
     * @returns {Object}
     */
    static getDeviceInfo() {
        const ua = navigator.userAgent;
        return {
            isMobile: /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua),
            isTablet: /iPad|Android/i.test(ua),
            isDesktop: !/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua),
            browser: ua.includes('Chrome') ? 'Chrome' : ua.includes('Firefox') ? 'Firefox' : ua.includes('Safari') ? 'Safari' : 'Other',
            os: ua.includes('Windows') ? 'Windows' : ua.includes('Mac') ? 'macOS' : ua.includes('Linux') ? 'Linux' : 'Other'
        };
    }

    /**
     * Retry async operation
     * @param {Function} asyncFn - Async function to retry
     * @param {number} maxRetries - Maximum retry attempts
     * @param {number} delay - Delay between retries in ms
     * @returns {Promise}
     */
    static async retry(asyncFn, maxRetries = 3, delay = 1000) {
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            try {
                return await asyncFn();
            } catch (error) {
                if (attempt === maxRetries) throw error;
                await this.delay(delay * attempt);
            }
        }
    }

    /**
     * Batch array into chunks
     * @param {Array} array - Array to batch
     * @param {number} size - Chunk size
     * @returns {Array<Array>}
     */
    static chunk(array, size = 10) {
        const chunks = [];
        for (let i = 0; i < array.length; i += size) {
            chunks.push(array.slice(i, i + size));
        }
        return chunks;
    }

    /**
     * Flatten nested array
     * @param {Array} array - Array to flatten
     * @param {number} depth - Depth to flatten (default: Infinity)
     * @returns {Array}
     */
    static flatten(array, depth = Infinity) {
        if (depth <= 0) return array;
        return array.reduce((flat, item) => {
            return flat.concat(Array.isArray(item) ? this.flatten(item, depth - 1) : item);
        }, []);
    }

    /**
     * Group array by key
     * @param {Array} array - Array to group
     * @param {Function|string} keyFn - Function to get key or property name
     * @returns {Object}
     */
    static groupBy(array, keyFn) {
        return array.reduce((groups, item) => {
            const key = typeof keyFn === 'function' ? keyFn(item) : item[keyFn];
            groups[key] = groups[key] || [];
            groups[key].push(item);
            return groups;
        }, {});
    }

    /**
     * Sort array of objects by key
     * @param {Array} array - Array to sort
     * @param {string} key - Key to sort by
     * @param {boolean} ascending - Sort ascending or descending
     * @returns {Array}
     */
    static sortBy(array, key, ascending = true) {
        return [...array].sort((a, b) => {
            const aVal = a[key];
            const bVal = b[key];
            const result = aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
            return ascending ? result : -result;
        });
    }

    /**
     * Remove duplicates from array
     * @param {Array} array - Array to deduplicate
     * @param {Function} keyFn - Optional key function for complex comparisons
     * @returns {Array}
     */
    static unique(array, keyFn = null) {
        if (!keyFn) {
            return [...new Set(array)];
        }

        const seen = new Set();
        return array.filter(item => {
            const key = keyFn(item);
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
        });
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = HelperUtils;
}
