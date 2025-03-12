// View.js
class GraphView {
    constructor() {
        this.canvas = document.getElementById('graph');
        this.ctx = this.canvas.getContext('2d');
        this.container = document.getElementById('graph-container');
        this.formulaBoxes = document.querySelectorAll('.formula-box');
        this.scale = 30; // pixels per unit
        this.origin = { x: this.canvas.width / 2, y: this.canvas.height / 2 };
        
        // DOM elements for points and lines
        this.pointElements = [];
        this.lineElements = {
            hypotenuse: null,
            horizontal: null,
            vertical: null
        };
        this.coordinatesElements = [];
        this.dragHandles = [];
        
        // Formula source elements (to be dragged from)
        this.formulaSources = [];
    }

    drawGrid() {
        const width = this.canvas.width;
        const height = this.canvas.height;
        
        this.ctx.clearRect(0, 0, width, height);
        
        // Draw grid lines
        this.ctx.strokeStyle = '#e0e0e0';
        this.ctx.lineWidth = 1;
        
        // Vertical lines
        for (let x = 0; x <= width; x += this.scale) {
            this.ctx.beginPath();
            this.ctx.moveTo(x, 0);
            this.ctx.lineTo(x, height);
            this.ctx.stroke();
        }
        
        // Horizontal lines
        for (let y = 0; y <= height; y += this.scale) {
            this.ctx.beginPath();
            this.ctx.moveTo(0, y);
            this.ctx.lineTo(width, y);
            this.ctx.stroke();
        }
        
        // Draw axes
        this.ctx.strokeStyle = '#000';
        this.ctx.lineWidth = 2;
        
        // x-axis
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.origin.y);
        this.ctx.lineTo(width, this.origin.y);
        this.ctx.stroke();
        
        // y-axis
        this.ctx.beginPath();
        this.ctx.moveTo(this.origin.x, 0);
        this.ctx.lineTo(this.origin.x, height);
        this.ctx.stroke();
        
        // Draw axis labels
        this.ctx.fillStyle = '#000';
        this.ctx.font = '16px Arial';
        this.ctx.fillText('x', width - 15, this.origin.y - 5);
        this.ctx.fillText('y', this.origin.x + 5, 15);
    }

    toScreenCoords(x, y) {
        return {
            x: this.origin.x + x * this.scale,
            y: this.origin.y - y * this.scale
        };
    }

    toGridCoords(screenX, screenY) {
        return {
            x: (screenX - this.origin.x) / this.scale,
            y: (this.origin.y - screenY) / this.scale
        };
    }

    renderPoints(points, selectedPoints) {
        // Remove all existing point elements
        this.pointElements.forEach(el => el.remove());
        this.pointElements = [];
        
        this.coordinatesElements.forEach(el => el.remove());
        this.coordinatesElements = [];
        
        // Create new point elements
        points.forEach(point => {
            const { x: screenX, y: screenY } = this.toScreenCoords(point.x, point.y);
            
            const pointEl = document.createElement('div');
            pointEl.className = 'point';
            if (selectedPoints.includes(point)) {
                pointEl.classList.add('selected');
            }
            pointEl.style.left = `${screenX}px`;
            pointEl.style.top = `${screenY}px`;
            pointEl.dataset.id = point.id;
            
            this.container.appendChild(pointEl);
            this.pointElements.push(pointEl);
            
            // Add coordinate label
            const coordEl = document.createElement('div');
            coordEl.className = 'coordinates';
            coordEl.textContent = `(${point.x}, ${point.y})`;
            coordEl.style.left = `${screenX + 10}px`;
            coordEl.style.top = `${screenY - 10}px`;
            
            this.container.appendChild(coordEl);
            this.coordinatesElements.push(coordEl);
        });
    }

    renderTriangle(pointA, pointB, trianglePoint) {
        // Remove existing lines
        Object.values(this.lineElements).forEach(el => el && el.remove());
        this.lineElements = {
            hypotenuse: null,
            horizontal: null,
            vertical: null
        };
        
        this.dragHandles.forEach(el => el.remove());
        this.dragHandles = [];
        
        this.formulaSources.forEach(el => el.remove());
        this.formulaSources = [];
        
        if (!pointA || !pointB) return;
        
        const screenA = this.toScreenCoords(pointA.x, pointA.y);
        const screenB = this.toScreenCoords(pointB.x, pointB.y);
        const screenC = this.toScreenCoords(trianglePoint.x, trianglePoint.y);
        
        // Draw hypotenuse (direct line between points)
        const hypotenuse = document.createElement('div');
        hypotenuse.className = 'line';
        
        const length = Math.sqrt(
            Math.pow(screenB.x - screenA.x, 2) + 
            Math.pow(screenB.y - screenA.y, 2)
        );
        
        const angle = Math.atan2(screenB.y - screenA.y, screenB.x - screenA.x);
        
        hypotenuse.style.width = `${length}px`;
        hypotenuse.style.left = `${screenA.x}px`;
        hypotenuse.style.top = `${screenA.y}px`;
        hypotenuse.style.transform = `rotate(${angle}rad)`;
        
        this.container.appendChild(hypotenuse);
        this.lineElements.hypotenuse = hypotenuse;
        
        // Draw horizontal line
        const horizontal = document.createElement('div');
        horizontal.className = 'horizontal-line';
        
        const horizontalLength = Math.abs(screenC.x - screenA.x);
        
        horizontal.style.width = `${horizontalLength}px`;
        horizontal.style.left = `${Math.min(screenA.x, screenC.x)}px`;
        horizontal.style.top = `${screenA.y}px`;
        
        this.container.appendChild(horizontal);
        this.lineElements.horizontal = horizontal;
        
        // Draw vertical line
        const vertical = document.createElement('div');
        vertical.className = 'vertical-line';
        
        const verticalLength = Math.abs(screenC.y - screenB.y);
        
        vertical.style.height = `${verticalLength}px`;
        vertical.style.left = `${screenC.x}px`;
        vertical.style.top = `${Math.min(screenC.y, screenB.y)}px`;
        
        this.container.appendChild(vertical);
        this.lineElements.vertical = vertical;
        
        // Add draggable sources for formula values
        const dx = pointB.x - pointA.x;
        const dy = pointB.y - pointA.y;
        
        // Horizontal (dx) source
        const dxSource = document.createElement('div');
        dxSource.className = 'formula-source';
        dxSource.textContent = `${dx}`;
        dxSource.dataset.value = dx;
        dxSource.dataset.type = 'dx';
        dxSource.style.left = `${(screenA.x + screenC.x) / 2}px`;
        dxSource.style.top = `${screenA.y + 25}px`;
        this.container.appendChild(dxSource);
        this.formulaSources.push(dxSource);
        
        // Vertical (dy) source
        const dySource = document.createElement('div');
        dySource.className = 'formula-source';
        dySource.textContent = `${dy}`;
        dySource.dataset.value = dy;
        dySource.dataset.type = 'dy';
        dySource.style.left = `${screenC.x + 25}px`;
        dySource.style.top = `${(screenC.y + screenB.y) / 2}px`;
        this.container.appendChild(dySource);
        this.formulaSources.push(dySource);
        
        // Hypotenuse (d) source
        const dSource = document.createElement('div');
        dSource.className = 'formula-source';
        dSource.textContent = `d`;
        dSource.dataset.value = Math.sqrt(dx * dx + dy * dy);
        dSource.dataset.type = 'd';
        dSource.style.left = `${(screenA.x + screenB.x) / 2 - 20}px`;
        dSource.style.top = `${(screenA.y + screenB.y) / 2 - 20}px`;
        this.container.appendChild(dSource);
        this.formulaSources.push(dSource);
    }

    setupFormula() {
        // Clear any existing content in the formula boxes
        this.formulaBoxes.forEach(box => {
            box.textContent = '';
            box.classList.add('empty');
        });
    }

    updateFormulaBox(boxId, value) {
        const box = document.getElementById(boxId);
        if (box) {
            box.textContent = value;
            box.classList.remove('empty');
        }
    }

    clearAll() {
        this.pointElements.forEach(el => el.remove());
        this.pointElements = [];
        
        this.coordinatesElements.forEach(el => el.remove());
        this.coordinatesElements = [];
        
        Object.values(this.lineElements).forEach(el => el && el.remove());
        this.lineElements = {
            hypotenuse: null,
            horizontal: null,
            vertical: null
        };
        
        this.dragHandles.forEach(el => el.remove());
        this.dragHandles = [];
        
        this.formulaSources.forEach(el => el.remove());
        this.formulaSources = [];
        
        // Reset formula boxes
        this.formulaBoxes.forEach(box => {
            box.textContent = '';
            box.classList.add('empty');
        });
    }
}

// Export for use in other files
if (typeof module !== 'undefined') {
    module.exports = { GraphView };
}