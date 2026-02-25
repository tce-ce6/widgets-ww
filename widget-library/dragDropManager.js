/**
 * DragDropManager - Unified Drag & Drop Handler for SVG
 * Handles mouse and touch events with position tracking and snapping
 * 
 * Usage:
 *   const dragMgr = new DragDropManager(svgElement);
 *   dragMgr.makeDraggable(element, options);
 */

class DragDropManager {
    constructor(svgElement, svgUtils = null) {
        this.svg = svgElement;
        this.svgUtils = svgUtils;
        this.draggableElements = new Map();
        this.dragState = {
            isDragging: false,
            currentElement: null,
            offset: { x: 0, y: 0 },
            startPos: { x: 0, y: 0 },
            currentPos: { x: 0, y: 0 }
        };
    }

    /**
     * Get SVG point from event coordinates
     * @private
     */
    getSVGPoint(evt) {
        if (this.svgUtils) {
            return this.svgUtils.getSVGPoint(evt);
        }

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
     * Make element draggable
     * @param {SVGElement} element - Element to make draggable
     * @param {Object} options - Configuration options
     * @param {Function} options.onStart - Callback when drag starts
     * @param {Function} options.onMove - Callback during drag (receives {x, y, deltaX, deltaY})
     * @param {Function} options.onEnd - Callback when drag ends
     * @param {boolean} options.snapToGrid - Snap to grid during drag
     * @param {number} options.gridSize - Grid size if snapping
     * @param {Object} options.constraints - Bounding box {minX, maxX, minY, maxY}
     * @param {boolean} options.returnToStart - Return to original position on release
     * @param {boolean} options.trackSnapBack - Track snap-back animation
     */
    makeDraggable(element, options = {}) {
        const config = {
            onStart: options.onStart || null,
            onMove: options.onMove || null,
            onEnd: options.onEnd || null,
            snapToGrid: options.snapToGrid || false,
            gridSize: options.gridSize || 10,
            constraints: options.constraints || null,
            returnToStart: options.returnToStart || false,
            trackSnapBack: options.trackSnapBack || false
        };

        // Store original position
        const originalPos = {
            x: parseFloat(element.getAttribute('x') || 0),
            y: parseFloat(element.getAttribute('y') || 0)
        };

        this.draggableElements.set(element.id || element, {
            element,
            config,
            originalPos,
            locked: false
        });

        element.style.cursor = 'grab';

        // Mouse events
        const mouseDown = (e) => this.handleDragStart(e, element, originalPos);
        const mouseMove = (e) => this.handleDragMove(e, element, originalPos);
        const mouseUp = (e) => this.handleDragEnd(e, element, originalPos);

        element.addEventListener('mousedown', mouseDown);
        element.addEventListener('touchstart', mouseDown, { passive: false });
        document.addEventListener('mousemove', mouseMove);
        document.addEventListener('touchmove', mouseMove, { passive: false });
        document.addEventListener('mouseup', mouseUp);
        document.addEventListener('touchend', mouseUp);

        return {
            unlock: () => {
                const info = this.draggableElements.get(element.id || element);
                if (info) info.locked = false;
            },
            lock: () => {
                const info = this.draggableElements.get(element.id || element);
                if (info) info.locked = true;
            }
        };
    }

    /**
     * Handle drag start
     * @private
     */
    handleDragStart(evt, element, originalPos) {
        const info = this.draggableElements.get(element.id || element);
        if (!info || info.locked) return;

        evt.preventDefault();
        this.dragState.isDragging = true;
        this.dragState.currentElement = element;
        this.dragState.startPos = { ...originalPos };

        const svgPoint = this.getSVGPoint(evt);
        const elemPos = { x: parseFloat(element.getAttribute('x')), y: parseFloat(element.getAttribute('y')) };

        this.dragState.offset = {
            x: svgPoint.x - elemPos.x,
            y: svgPoint.y - elemPos.y
        };

        element.style.cursor = 'grabbing';

        if (info.config.onStart) {
            info.config.onStart({ x: elemPos.x, y: elemPos.y });
        }
    }

    /**
     * Handle drag move
     * @private
     */
    handleDragMove(evt, element, originalPos) {
        if (!this.dragState.isDragging || this.dragState.currentElement !== element) return;

        evt.preventDefault();
        const info = this.draggableElements.get(element.id || element);
        if (!info) return;

        const svgPoint = this.getSVGPoint(evt);
        let newX = svgPoint.x - this.dragState.offset.x;
        let newY = svgPoint.y - this.dragState.offset.y;

        // Apply grid snapping
        if (info.config.snapToGrid) {
            const gridSize = info.config.gridSize;
            newX = Math.round(newX / gridSize) * gridSize;
            newY = Math.round(newY / gridSize) * gridSize;
        }

        // Apply constraints
        if (info.config.constraints) {
            const c = info.config.constraints;
            const w = parseFloat(element.getAttribute('width') || 0);
            const h = parseFloat(element.getAttribute('height') || 0);

            if (c.minX !== undefined) newX = Math.max(newX, c.minX);
            if (c.maxX !== undefined) newX = Math.min(newX, c.maxX - w);
            if (c.minY !== undefined) newY = Math.max(newY, c.minY);
            if (c.maxY !== undefined) newY = Math.min(newY, c.maxY - h);
        }

        this.dragState.currentPos = { x: newX, y: newY };

        element.setAttribute('x', newX);
        element.setAttribute('y', newY);

        if (info.config.onMove) {
            info.config.onMove({
                x: newX,
                y: newY,
                deltaX: newX - this.dragState.startPos.x,
                deltaY: newY - this.dragState.startPos.y
            });
        }
    }

    /**
     * Handle drag end
     * @private
     */
    handleDragEnd(evt, element, originalPos) {
        if (!this.dragState.isDragging || this.dragState.currentElement !== element) return;

        const info = this.draggableElements.get(element.id || element);
        if (!info) return;

        this.dragState.isDragging = false;

        const finalPos = { ...this.dragState.currentPos };
        element.style.cursor = 'grab';

        // Return to start if configured
        if (info.config.returnToStart) {
            this.snapBack(element, originalPos, () => {
                if (info.config.onEnd) {
                    info.config.onEnd({ x: originalPos.x, y: originalPos.y, cancelled: true });
                }
            });
        } else {
            if (info.config.onEnd) {
                info.config.onEnd({ x: finalPos.x, y: finalPos.y, cancelled: false });
            }
        }

        this.dragState.currentElement = null;
    }

    /**
     * Snap element back to original position with animation
     * @param {SVGElement} element - Element to snap back
     * @param {Object} targetPos - Target position {x, y}
     * @param {Function} callback - Called when animation completes
     * @param {number} duration - Animation duration in ms
     */
    snapBack(element, targetPos, callback = null, duration = 300) {
        const currentX = parseFloat(element.getAttribute('x') || 0);
        const currentY = parseFloat(element.getAttribute('y') || 0);

        element.style.transition = `transform ${duration}ms ease-in-out`;
        element.style.transformOrigin = '0 0';

        const deltaX = targetPos.x - currentX;
        const deltaY = targetPos.y - currentY;

        setTimeout(() => {
            element.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
        }, 10);

        setTimeout(() => {
            element.style.transition = '';
            element.style.transform = '';
            element.setAttribute('x', targetPos.x);
            element.setAttribute('y', targetPos.y);

            if (callback) callback();
        }, duration);
    }

    /**
     * Lock a draggable element
     * @param {SVGElement|string} elementOrId - Element or element ID
     */
    lock(elementOrId) {
        const info = this.draggableElements.get(elementOrId);
        if (info) {
            info.locked = true;
        }
    }

    /**
     * Unlock a draggable element
     * @param {SVGElement|string} elementOrId - Element or element ID
     */
    unlock(elementOrId) {
        const info = this.draggableElements.get(elementOrId);
        if (info) {
            info.locked = false;
        }
    }

    /**
     * Get draggable info
     * @param {SVGElement|string} elementOrId - Element or element ID
     */
    getInfo(elementOrId) {
        return this.draggableElements.get(elementOrId);
    }

    /**
     * Remove draggable from element
     * @param {SVGElement} element - Element to make non-draggable
     */
    removeDraggable(element) {
        this.draggableElements.delete(element.id || element);
    }

    /**
     * Clear all draggable elements
     */
    clear() {
        this.draggableElements.clear();
        this.dragState = {
            isDragging: false,
            currentElement: null,
            offset: { x: 0, y: 0 },
            startPos: { x: 0, y: 0 },
            currentPos: { x: 0, y: 0 }
        };
    }

    /**
     * Check if currently dragging
     */
    isDragging() {
        return this.dragState.isDragging;
    }

    /**
     * Get current drag position
     */
    getCurrentPosition() {
        return { ...this.dragState.currentPos };
    }
}

if (typeof module !== 'undefined' && module.exports) {
    module.exports = DragDropManager;
}
