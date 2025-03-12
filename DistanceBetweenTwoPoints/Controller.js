// Controller.js
class GraphController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.draggingElement = null;
        this.initialize();
    }

    initialize() {
        // Draw initial grid
        this.view.drawGrid();
        
        // Generate random points
        this.model.generateRandomPoints();
        
        // Render points
        this.view.renderPoints(this.model.points, this.model.selectedPoints);
        
        // Setup empty formula boxes
        this.view.setupFormula();
        
        // Add event listener for canvas clicks to add points
        this.view.canvas.addEventListener('click', this.handleCanvasClick.bind(this));
        
        // Add event listener for point selection
        this.view.container.addEventListener('click', this.handlePointClick.bind(this));
        
        // Add event listeners for formula drag and drop
        this.view.container.addEventListener('mousedown', this.handleDragStart.bind(this));
        document.addEventListener('mousemove', this.handleDragMove.bind(this));
        document.addEventListener('mouseup', this.handleDragEnd.bind(this));
        
        // Add reset button functionality
        const resetButton = document.getElementById('reset-button');
        if (resetButton) {
            resetButton.addEventListener('click', this.reset.bind(this));
        }
    }

    handleCanvasClick(event) {
        const rect = this.view.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        
        const gridCoords = this.view.toGridCoords(x, y);
        
        // Check if we clicked near an existing point
        for (const point of this.model.points) {
            const screenCoords = this.view.toScreenCoords(point.x, point.y);
            const distance = Math.sqrt(
                Math.pow(x - screenCoords.x, 2) + 
                Math.pow(y - screenCoords.y, 2)
            );
            
            if (distance < 15) {
                return; // Don't add a new point if we're near an existing one
            }
        }
        
        const newPoint = this.model.addPoint(
            Math.round(gridCoords.x), 
            Math.round(gridCoords.y)
        );
        
        if (newPoint) {
            this.view.renderPoints(this.model.points, this.model.selectedPoints);
        }
    }

    handlePointClick(event) {
        if (!event.target.classList.contains('point')) return;
        
        const id = parseInt(event.target.dataset.id);
        const changed = this.model.selectPoint(id);
        
        if (changed) {
            this.view.renderPoints(this.model.points, this.model.selectedPoints);
            
            if (this.model.selectedPoints.length === 2) {
                const trianglePoint = this.model.getRightTrianglePoint();
                this.model.getDistance(); // Calculate distance values
                
                this.view.renderTriangle(
                    this.model.selectedPoints[0],
                    this.model.selectedPoints[1],
                    trianglePoint
                );
                
                this.view.setupFormula(); // Reset formula boxes
            } else {
                this.view.clearAll();
                this.view.renderPoints(this.model.points, this.model.selectedPoints);
            }
        }
    }

    handleDragStart(event) {
        if (!event.target.classList.contains('formula-source')) return;
        
        this.draggingElement = event.target;
        this.draggingElement.classList.add('dragging');
        
        // Create a clone for dragging
        const clone = this.draggingElement.cloneNode(true);
        clone.id = 'drag-clone';
        clone.style.position = 'absolute';
        clone.style.left = `${event.clientX}px`;
        clone.style.top = `${event.clientY}px`;
        clone.style.pointerEvents = 'none';
        clone.style.opacity = '0.8';
        document.body.appendChild(clone);
    }

    handleDragMove(event) {
        if (!this.draggingElement) return;
        
        const clone = document.getElementById('drag-clone');
        if (clone) {
            clone.style.left = `${event.clientX}px`;
            clone.style.top = `${event.clientY}px`;
        }
        
        // Highlight droppable targets
        const formulaBoxes = document.querySelectorAll('.formula-box');
        formulaBoxes.forEach(box => {
            const rect = box.getBoundingClientRect();
            if (event.clientX >= rect.left && event.clientX <= rect.right &&
                event.clientY >= rect.top && event.clientY <= rect.bottom) {
                box.classList.add('highlight');
            } else {
                box.classList.remove('highlight');
            }
        });
    }

    handleDragEnd(event) {
        if (!this.draggingElement) return;
        
        // Check if dropped on a formula box
        const formulaBoxes = document.querySelectorAll('.formula-box');
        let dropped = false;
        
        formulaBoxes.forEach(box => {
            const rect = box.getBoundingClientRect();
            if (event.clientX >= rect.left && event.clientX <= rect.right &&
                event.clientY >= rect.top && event.clientY <= rect.bottom) {
                
                // Set the value in the box
                const value = this.draggingElement.dataset.value;
                box.textContent = value;
                box.classList.remove('empty');
                box.classList.remove('highlight');
                dropped = true;
            } else {
                box.classList.remove('highlight');
            }
        });
        
        // Remove the drag clone
        const clone = document.getElementById('drag-clone');
        if (clone) {
            clone.remove();
        }
        
        this.draggingElement.classList.remove('dragging');
        this.draggingElement = null;
    }

    reset() {
        this.model.generateRandomPoints();
        this.view.clearAll();
        this.view.drawGrid();
        this.view.renderPoints(this.model.points, this.model.selectedPoints);
    }
}

// Export for use in other files
if (typeof module !== 'undefined') {
    module.exports = { GraphController };
}