/**
 * SVGUtils - SVG Manipulation and Geometry Utilities
 * Provides common SVG operations for widget development
 * 
 * Usage:
 *   const svgUtils = new SVGUtils(svgElement);
 *   svgUtils.createImage('assets/img.svg', x, y, width, height);
 */

class SVGUtils {
    constructor(svgElement) {
        this.svg = svgElement;
        this.NS = 'http://www.w3.org/2000/svg';
        this.XLINK_NS = 'http://www.w3.org/1999/xlink';
    }

    /**
     * Get SVG point from client/touch coordinates
     * @param {MouseEvent|TouchEvent} evt - Event object
     * @returns {Object} - {x, y} coordinates in SVG space
     */
    getSVGPoint(evt) {
        const p = this.svg.createSVGPoint();
        
        if (evt.touches && evt.touches.length > 0) {
            p.x = evt.touches[0].clientX;
            p.y = evt.touches[0].clientY;
        } else {
            p.x = evt.clientX;
            p.y = evt.clientY;
        }

        const ctm = this.svg.getScreenCTM().inverse();
        return p.matrixTransform(ctm);
    }

    /**
     * Create foreignObject with image
     * @param {string} src - Image source path
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} width - Width
     * @param {number} height - Height
     * @param {string} dataId - Optional data-id attribute
     * @returns {SVGElement} - The foreignObject element
     */
    createImage(src, x, y, width, height, dataId = null) {
        const fo = document.createElementNS(this.NS, 'foreignObject');
        fo.setAttribute('x', x);
        fo.setAttribute('y', y);
        fo.setAttribute('width', width);
        fo.setAttribute('height', height);
        
        if (dataId) {
            fo.setAttribute('data-id', dataId);
        }

        const img = document.createElement('img');
        img.src = src;
        img.style.width = '100%';
        img.style.height = '100%';
        img.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml');

        fo.appendChild(img);
        this.svg.appendChild(fo);

        return fo;
    }

    /**
     * Create SVG image element (for SVG files)
     * @param {string} href - Image href
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} width - Width
     * @param {number} height - Height
     * @returns {SVGElement} - The image element
     */
    createSVGImage(href, x, y, width, height) {
        const img = document.createElementNS(this.NS, 'image');
        img.setAttributeNS(this.XLINK_NS, 'href', href);
        img.setAttribute('x', x);
        img.setAttribute('y', y);
        img.setAttribute('width', width);
        img.setAttribute('height', height);

        this.svg.appendChild(img);
        return img;
    }

    /**
     * Create text element
     * @param {string} text - Text content
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {Object} attributes - Optional attributes {fontSize, fill, id, etc}
     * @returns {SVGElement} - The text element
     */
    createText(text, x, y, attributes = {}) {
        const textEl = document.createElementNS(this.NS, 'text');
        textEl.setAttribute('x', x);
        textEl.setAttribute('y', y);
        textEl.textContent = text;

        Object.entries(attributes).forEach(([key, value]) => {
            textEl.setAttribute(key, value);
        });

        this.svg.appendChild(textEl);
        return textEl;
    }

    /**
     * Create rectangle
     * @param {number} x - X position
     * @param {number} y - Y position
     * @param {number} width - Width
     * @param {number} height - Height
     * @param {Object} attributes - Optional {fill, stroke, id, etc}
     * @returns {SVGElement} - The rect element
     */
    createRect(x, y, width, height, attributes = {}) {
        const rect = document.createElementNS(this.NS, 'rect');
        rect.setAttribute('x', x);
        rect.setAttribute('y', y);
        rect.setAttribute('width', width);
        rect.setAttribute('height', height);

        Object.entries(attributes).forEach(([key, value]) => {
            rect.setAttribute(key, value);
        });

        this.svg.appendChild(rect);
        return rect;
    }

    /**
     * Create circle
     * @param {number} cx - Center X
     * @param {number} cy - Center Y
     * @param {number} r - Radius
     * @param {Object} attributes - Optional {fill, stroke, id, etc}
     * @returns {SVGElement} - The circle element
     */
    createCircle(cx, cy, r, attributes = {}) {
        const circle = document.createElementNS(this.NS, 'circle');
        circle.setAttribute('cx', cx);
        circle.setAttribute('cy', cy);
        circle.setAttribute('r', r);

        Object.entries(attributes).forEach(([key, value]) => {
            circle.setAttribute(key, value);
        });

        this.svg.appendChild(circle);
        return circle;
    }

    /**
     * Animate element transform
     * @param {SVGElement} element - Element to animate
     * @param {number} toX - Target X position
     * @param {number} toY - Target Y position
     * @param {number} duration - Duration in ms
     * @param {Function} callback - Callback on completion
     */
    animateTransform(element, toX, toY, duration = 500, callback = null) {
        const fromX = parseFloat(element.getAttribute('x') || 0);
        const fromY = parseFloat(element.getAttribute('y') || 0);

        element.style.transition = `transform ${duration}ms ease-in-out`;
        element.style.transformOrigin = '0 0';

        const deltaX = toX - fromX;
        const deltaY = toY - fromY;

        setTimeout(() => {
            element.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
        }, 10);

        setTimeout(() => {
            element.style.transition = '';
            element.style.transform = '';
            element.setAttribute('x', toX);
            element.setAttribute('y', toY);
            if (callback) callback();
        }, duration);
    }

    /**
     * Set element opacity with transition
     * @param {SVGElement} element - Element to modify
     * @param {number} opacity - Target opacity (0-1)
     * @param {number} duration - Duration in ms
     * @param {Function} callback - Callback on completion
     */
    fadeOpacity(element, opacity, duration = 300, callback = null) {
        element.style.transition = `opacity ${duration}ms ease-in-out`;
        element.style.opacity = opacity;

        if (callback) {
            setTimeout(callback, duration);
        }
    }

    /**
     * Get element's current position
     * @param {SVGElement} element - Element to query
     * @returns {Object} - {x, y} position
     */
    getPosition(element) {
        return {
            x: parseFloat(element.getAttribute('x') || 0),
            y: parseFloat(element.getAttribute('y') || 0)
        };
    }

    /**
     * Set element position
     * @param {SVGElement} element - Element to move
     * @param {number} x - X position
     * @param {number} y - Y position
     */
    setPosition(element, x, y) {
        element.setAttribute('x', x);
        element.setAttribute('y', y);
    }

    /**
     * Get distance between two points
     * @param {Object} p1 - {x, y}
     * @param {Object} p2 - {x, y}
     * @returns {number} - Distance
     */
    distance(p1, p2) {
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    /**
     * Check if point is inside rectangle
     * @param {Object} point - {x, y}
     * @param {Object} rect - {x, y, width, height}
     * @returns {boolean}
     */
    isPointInRect(point, rect) {
        return point.x >= rect.x &&
               point.x <= rect.x + rect.width &&
               point.y >= rect.y &&
               point.y <= rect.y + rect.height;
    }

    /**
     * Check if point is inside circle
     * @param {Object} point - {x, y}
     * @param {Object} circle - {cx, cy, r}
     * @returns {boolean}
     */
    isPointInCircle(point, circle) {
        const dist = this.distance(point, { x: circle.cx, y: circle.cy });
        return dist <= circle.r;
    }

    /**
     * Clone element to create a duplicate
     * @param {SVGElement} element - Element to clone
     * @param {Object} attributes - Optional attributes to override
     * @returns {SVGElement} - Cloned element
     */
    cloneElement(element, attributes = {}) {
        const cloned = element.cloneNode(true);
        
        Object.entries(attributes).forEach(([key, value]) => {
            cloned.setAttribute(key, value);
        });

        element.parentNode.appendChild(cloned);
        return cloned;
    }

    /**
     * Remove element
     * @param {SVGElement} element - Element to remove
     */
    removeElement(element) {
        if (element && element.parentNode) {
            element.parentNode.removeChild(element);
        }
    }

    /**
     * Get bounding box of element
     * @param {SVGElement} element - Element to measure
     * @returns {Object} - {x, y, width, height}
     */
    getBBox(element) {
        try {
            const bbox = element.getBBox();
            return { x: bbox.x, y: bbox.y, width: bbox.width, height: bbox.height };
        } catch (e) {
            console.warn('Cannot get bbox:', e);
            return { x: 0, y: 0, width: 0, height: 0 };
        }
    }

    /**
     * Bring element to front (increase z-index via DOM order)
     * @param {SVGElement} element - Element to bring forward
     */
    bringToFront(element) {
        if (element.parentNode) {
            element.parentNode.appendChild(element);
        }
    }

    /**
     * Send element to back
     * @param {SVGElement} element - Element to send back
     */
    sendToBack(element) {
        if (element.parentNode) {
            element.parentNode.insertBefore(element, element.parentNode.firstChild);
        }
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = SVGUtils;
}
