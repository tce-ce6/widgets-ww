// Model
class PointsModel {
    constructor() {
        console.log('PointsModel: Initializing');
        this.points = [];
        this.selectedPoints = [];
        this.triangle = null;
    }

    generateRandomPoints() {
        console.log('PointsModel: Generating random points');
        this.points = [];
        const usedCoords = new Set();

        while (this.points.length < 4) {
            const x = Math.floor(Math.random() * 8) - 4;
            const y = Math.floor(Math.random() * 8) - 4;
            const coordKey = `${x},${y}`;

            if (!usedCoords.has(coordKey)) {
                usedCoords.add(coordKey);
                this.points.push([x, y]);
                console.log(`PointsModel: Added point [${x}, ${y}]`);
            }
        }
        console.log('PointsModel: Generated points:', this.points);
    }

    selectPoint(point) {
        console.log('PointsModel: Selecting point:', point);
        if (this.selectedPoints.length < 2 && !this.selectedPoints.includes(point)) {
            this.selectedPoints.push(point);
            console.log('PointsModel: Point selected, total selected:', this.selectedPoints.length);
            return true;
        }
        console.log('PointsModel: Point selection rejected');
        return false;
    }

    clearSelection() {
        console.log('PointsModel: Clearing selection');
        this.selectedPoints = [];
        this.triangle = null;
    }

    calculateDistance() {
        console.log('PointsModel: Calculating distance');
        if (this.selectedPoints.length !== 2) {
            console.log('PointsModel: Not enough points selected');
            return null;
        }

        const [x1, y1] = this.selectedPoints[0];
        const [x2, y2] = this.selectedPoints[1];

        const dx = x2 - x1;
        const dy = y2 - y1;
        const distance = Math.sqrt(dx * dx + dy * dy);
        console.log(`PointsModel: Distance calculated: ${distance}`);
        return distance;
    }
}

// View
class GraphView {
    constructor(board) {
        console.log('GraphView: Initializing');
        this.board = board;
        this.pointObjects = [];
        this.triangleObjects = [];
    }

    drawPoints(points, clickHandler) {
        console.log('GraphView: Drawing points:', points);
        this.clearPoints();
        this.pointObjects = points.map((coords, index) => {
            console.log(`GraphView: Creating point ${index}:`, coords);
            const point = this.board.create('point', coords, {
                name: String.fromCharCode(65 + index),
                size: 4,
                face: 'o',
                fillColor: '#3498db',
                strokeColor: '#2980b9'
            });
            point.on('up', () => clickHandler(coords));
            return point;
        });
    }

    drawTriangle(pointA, pointB) {
        console.log('GraphView: Drawing triangle', { pointA, pointB });
        this.clearTriangle();
        
        // Create point C for right triangle
        const [x1, y1] = pointA;
        const [x2, y2] = pointB;
        const pointC = [x2, y1];
        console.log('GraphView: Created point C:', pointC);

        // Draw the right triangle
        this.triangleObjects = [
            this.board.create('segment', [pointA, pointB], { strokeColor: '#e74c3c', strokeWidth: 2 }),
            this.board.create('segment', [pointA, pointC], { strokeColor: '#3498db', strokeWidth: 2 }),
            this.board.create('segment', [pointC, pointB], { strokeColor: '#2ecc71', strokeWidth: 2 })
        ];
        console.log('GraphView: Created triangle segments');

        // Add only the measurement labels
        this.triangleObjects.push(
            this.board.create('text', [
                (x1 + x2) / 2, y1 + 0.2,
                () => `${Math.abs(x2 - x1).toFixed(2)}`
            ], { fontSize: 14, anchorX: 'middle', anchorY: 'top' }),
            this.board.create('text', [
                x2 - 0.2, (y1 + y2) / 2,
                () => `${Math.abs(y2 - y1).toFixed(2)}`
            ], { fontSize: 14, anchorX: 'right', anchorY: 'middle' }),
            this.board.create('text', [
                (x1 + x2) / 2 - 0.2, (y1 + y2) / 2 + 0.2,
                () => `${Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1)).toFixed(2)}`
            ], { fontSize: 14, anchorX: 'right', anchorY: 'bottom' })
        );
        console.log('GraphView: Added measurement labels');
    }

    clearPoints() {
        console.log('GraphView: Clearing points');
        this.pointObjects.forEach(point => this.board.removeObject(point));
        this.pointObjects = [];
    }

    clearTriangle() {
        console.log('GraphView: Clearing triangle');
        this.triangleObjects.forEach(obj => this.board.removeObject(obj));
        this.triangleObjects = [];
    }

    updateCoordinates(pointA, pointB) {
        console.log('GraphView: Updating coordinates', { pointA, pointB });
        if (pointA && pointB) {
            document.getElementById('pointA').textContent = `(${pointA[0]}, ${pointA[1]})`;
            document.getElementById('pointB').textContent = `(${pointB[0]}, ${pointB[1]})`;
            const distance = Math.sqrt(
                Math.pow(pointB[0] - pointA[0], 2) + 
                Math.pow(pointB[1] - pointA[1], 2)
            );
            document.getElementById('distance').textContent = distance.toFixed(2);
            console.log('GraphView: Updated coordinates and distance:', distance.toFixed(2));
        }
    }
}

// Controller
class GraphController {
    constructor(model, view) {
        console.log('GraphController: Initializing');
        this.model = model;
        this.view = view;
        this.init();
    }

    init() {
        console.log('GraphController: Initializing controller');
        this.model.generateRandomPoints();
        this.view.drawPoints(this.model.points, (point) => this.handlePointClick(point));
        this.setupDragAndDrop();
    }

    handlePointClick(point) {
        console.log('GraphController: Handling point click:', point);
        if (this.model.selectPoint(point)) {
            if (this.model.selectedPoints.length === 2) {
                console.log('GraphController: Two points selected, drawing triangle');
                this.view.drawTriangle(
                    this.model.selectedPoints[0],
                    this.model.selectedPoints[1]
                );
                this.view.updateCoordinates(
                    this.model.selectedPoints[0],
                    this.model.selectedPoints[1]
                );
            }
        }
    }

    setupDragAndDrop() {
        console.log('GraphController: Setting up drag and drop');
        const dragBoxes = document.querySelectorAll('.drag-box');
        dragBoxes.forEach(box => {
            box.draggable = true;
            box.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', box.id);
            });
        });

        const equation = document.querySelector('.equation');
        equation.addEventListener('dragover', (e) => e.preventDefault());
        equation.addEventListener('drop', (e) => {
            e.preventDefault();
            const id = e.dataTransfer.getData('text/plain');
            const element = document.getElementById(id);
            if (element) {
                const target = e.target.closest('.drag-box') || e.target;
                if (target.classList.contains('drag-box')) {
                    const parent = target.parentNode;
                    const elements = Array.from(parent.children);
                    const targetIndex = elements.indexOf(target);
                    const currentIndex = elements.indexOf(element);
                    
                    if (targetIndex !== -1 && currentIndex !== -1) {
                        if (targetIndex > currentIndex) {
                            target.parentNode.insertBefore(element, target.nextSibling);
                        } else {
                            target.parentNode.insertBefore(element, target);
                        }
                    }
                }
            }
        });
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('Application: DOM Content Loaded');
    // Create JSXGraph board
    const board = JXG.JSXGraph.initBoard('jxgbox', {
        boundingbox: [-5, 5, 5, -5],
        axis: true,
        grid: true,
        showCopyright: false,
        showNavigation: false,
        // Hide axis labels
        defaultAxes: {
            x: {
                name: 'x',
                withLabel: false,
                ticks: {
                    drawLabels: false
                }
            },
            y: {
                name: 'y',
                withLabel: false,
                ticks: {
                    drawLabels: false
                }
            }
        }
    });

    // Points and state variables
    let pointObjects = [];
    let selectedPoints = [];
    let pointA = null;
    let pointB = null;
    let pointC = null;
    let triangleObjects = [];
    let triangleLabels = [];

    // Generate random points not on axes and not collinear
    function createRandomPoints() {
        console.log('Application: Creating random points');
        // Clear previous points and selections
        clearBoard();
        
        pointObjects = [];
        selectedPoints = [];
        pointA = null;
        pointB = null;
        pointC = null;
        
        const usedX = new Set();
        const usedY = new Set();
        const points = [];
        const minDistance = 3; // Minimum distance between points (3 grid lines)
        
        // Create 4 random points with unique coordinates
        let attempts = 0;
        const maxAttempts = 150; // Prevent infinite loops
        
        while (pointObjects.length < 4 && attempts < maxAttempts) {
            attempts++;
            
            // Generate unique X coordinate (avoiding x=0 axis)
            let randomX;
            do {
                randomX = Math.floor(Math.random() * 9) - 4; // Between -4 and 4
            } while (usedX.has(randomX) || randomX === 0);
            
            // Generate unique Y coordinate (avoiding y=0 axis)
            let randomY;
            do {
                randomY = Math.floor(Math.random() * 9) - 4; // Between -4 and 4
            } while (usedY.has(randomY) || randomY === 0);
            
            // Check distance from existing points
            let tooClose = false;
            for (const point of points) {
                const distance = Math.sqrt(
                    Math.pow(point.x - randomX, 2) + 
                    Math.pow(point.y - randomY, 2)
                );
                if (distance < minDistance) {
                    tooClose = true;
                    break;
                }
            }
            
            if (tooClose) {
                continue; // Skip this point and try again
            }
            
            // Add to used sets and points array
            usedX.add(randomX);
            usedY.add(randomY);
            points.push({ x: randomX, y: randomY });
            
            // Create JSXGraph point
            const point = board.create('point', [randomX, randomY], {
                name: '',
                size: 4,
                face: 'o',
                fillColor: '#6c63ff',
                strokeColor: '#3498db',
                fixed: true  // Disable dragging
            });
            
            // Add click event
            point.on('up', function() {
                selectPoint(this);
            });
            
            pointObjects.push(point);
        }
        
        // If we didn't get enough points, try again with a smaller minimum distance
        if (pointObjects.length < 4) {
            console.log('Application: Could not generate 4 points with minimum distance of 3, retrying with distance of 2');
            clearBoard();
            return createRandomPointsWithSmallDistance();
        }
        
        // Check if points are collinear
        if (arePointsCollinear(pointObjects)) {
            // If points are collinear, try again
            clearBoard();
            console.log('Application: Points were collinear, regenerating');
            return createRandomPoints();
        }
        
        console.log('Application: Generated points with minimum distance:', minDistance);
    }
    
    // Fallback function with smaller minimum distance
    function createRandomPointsWithSmallDistance() {
        console.log('Application: Using fallback point generation with smaller distance');
        clearBoard();
        
        pointObjects = [];
        selectedPoints = [];
        pointA = null;
        pointB = null;
        pointC = null;
        
        const usedX = new Set();
        const usedY = new Set();
        const points = [];
        const minDistance = 2; // Smaller minimum distance as fallback
        
        // Create 4 random points with unique coordinates
        let attempts = 0;
        const maxAttempts = 200;
        
        while (pointObjects.length < 4 && attempts < maxAttempts) {
            attempts++;
            
            // Generate unique X coordinate (avoiding x=0 axis)
            let randomX;
            do {
                randomX = Math.floor(Math.random() * 9) - 4; // Between -4 and 4
            } while (usedX.has(randomX) || randomX === 0);
            
            // Generate unique Y coordinate (avoiding y=0 axis)
            let randomY;
            do {
                randomY = Math.floor(Math.random() * 9) - 4; // Between -4 and 4
            } while (usedY.has(randomY) || randomY === 0);
            
            // Check distance from existing points
            let tooClose = false;
            for (const point of points) {
                const distance = Math.sqrt(
                    Math.pow(point.x - randomX, 2) + 
                    Math.pow(point.y - randomY, 2)
                );
                if (distance < minDistance) {
                    tooClose = true;
                    break;
                }
            }
            
            if (tooClose) {
                continue; // Skip this point and try again
            }
            
            // Add to used sets and points array
            usedX.add(randomX);
            usedY.add(randomY);
            points.push({ x: randomX, y: randomY });
            
            // Create JSXGraph point
            const point = board.create('point', [randomX, randomY], {
                name: '',
                size: 4,
                face: 'o',
                fillColor: '#6c63ff',
                strokeColor: '#3498db',
                fixed: true  // Disable dragging
            });
            
            // Add click event
            point.on('up', function() {
                selectPoint(this);
            });
            
            pointObjects.push(point);
        }
        
        // Check if points are collinear
        if (arePointsCollinear(pointObjects)) {
            // If points are collinear, try again
            clearBoard();
            console.log('Application: Points were collinear, regenerating');
            return createRandomPointsWithSmallDistance();
        }
        
        console.log('Application: Generated points with fallback minimum distance:', minDistance);
    }
    
    // Clear the board
    function clearBoard() {
        console.log('Application: Clearing board');
        // Remove all points and triangle objects
        if (pointObjects.length > 0) {
            pointObjects.forEach(point => {
                board.removeObject(point);
            });
            pointObjects = [];
        }
        
        clearTriangle();
    }
    
    // Check if points are collinear
    function arePointsCollinear(points) {
        console.log('Application: Checking if points are collinear');
        if (points.length < 3) return false;
        
        // Check if any three points form a straight line
        for (let i = 0; i < points.length - 2; i++) {
            for (let j = i + 1; j < points.length - 1; j++) {
                for (let k = j + 1; k < points.length; k++) {
                    const p1 = points[i];
                    const p2 = points[j];
                    const p3 = points[k];
                    
                    // Calculate area of triangle
                    const area = Math.abs(
                        (p1.X() * (p2.Y() - p3.Y()) +
                         p2.X() * (p3.Y() - p1.Y()) +
                         p3.X() * (p1.Y() - p2.Y())) / 2
                    );
                    
                    // If area is very close to 0, points are collinear
                    if (area < 0.001) return true;
                }
            }
        }
        
        return false;
    }
    
    // Select a point
    function selectPoint(point) {
        console.log('Application: Point selected:', point);
        if (selectedPoints.length >= 2) return;
        
        // Check if point is already selected
        for (const p of selectedPoints) {
            if (p.id === point.id) return;
        }
        
        // Add to selected points
        selectedPoints.push(point);
        
        // Update point appearance
        point.setAttribute({
            fillColor: '#d63384',
            strokeColor: '#d63384'
        });
        
        if (selectedPoints.length === 1) {
            // First point selected
            pointA = point;
            pointA.setAttribute({
                name: 'A (x₁,y₁)',
                fillColor: '#d63384',
                strokeColor: '#d63384',
                withLabel: true,
                label: { position: 'rt', offset: [5, -5] },
                fixed: true // Keep it fixed
            });
            
            // Add coordinate label
            // const coordA = board.create('text', [
            //     function() { return pointA.X() + 0.3; },
            //     function() { return pointA.Y(); },
            //     '(x₁,y₁)'
            // ], {
            //     fontSize: 12,
            //     color: '#d63384',
            //     // cssClass: 'JXGtext'
            // });
            
            // triangleLabels.push(coordA);
            document.getElementById('pointsInfo').innerHTML = '<h2>Point A selected. Select another point.</h2>';
        } else {
            // Second point selected
            pointB = point;
            pointB.setAttribute({
                name: 'B (x₂,y₂)',
                fillColor: '#d63384',
                strokeColor: '#d63384',
                withLabel: true,
                label: { position: 'rt', offset: [5, -5] },
                fixed: true // Keep it fixed
            });
            
            // Add coordinate label
            // const coordB = board.create('text', [
            //     function() { return pointB.X() + 0.3; },
            //     function() { return pointB.Y(); },
            //     '(x₂,y₂)'
            // ], {
            //     fontSize: 12,
            //     color: '#d63384',
            //     cssClass: 'JXGtext'
            // });
            
            // triangleLabels.push(coordB);
            
            // Clear detailed coordinates from header
            document.getElementById('pointsInfo').innerHTML = '<h2>Distance between points A and B</h2>';
            createTriangle();
        }
    }
    let isPointAHigher = false;
    // Create the triangle
    function createTriangle() {
        console.log('Application: Creating triangle');
        if (!pointA || !pointB) return;
        
        // Determine which point is at the top of the triangle
        isPointAHigher = pointA.Y() > pointB.Y();
        console.log(`Application: Point ${isPointAHigher ? 'A' : 'B'} is higher on the Y-axis`);
        
        // Create point C at the right angle
        pointC = board.create('point', [pointB.X(), pointA.Y()], {
            name: 'C (x2,y1)',
            visible: true,
            withLabel: true,
            label: { position: 'rt', offset: [5, -5] },
            fillColor: '#666',
            strokeColor: '#666',
            size: 3,
            fixed: true  // Disable dragging
        });
        
        // Create the triangle lines
        const lineAC = board.create('segment', [pointA, pointC], {
            strokeColor: '#3b82f6',
            strokeWidth: 2,
            fixed: true  // Disable dragging
        });
        
        const lineBC = board.create('segment', [pointB, pointC], {
            strokeColor: '#3b82f6',
            strokeWidth: 2,
            fixed: true  // Disable dragging
        });
        
        const lineAB = board.create('segment', [pointA, pointB], {
            strokeColor: '#d63384',
            strokeWidth: 2,
            fixed: true  // Disable dragging
        });
        
        triangleObjects = [pointC, lineAC, lineBC, lineAB];
        
        // Create draggable labels
        createDraggableLabels();
        
        // Show the formula section
        document.getElementById('formula').style.display = 'block';
        document.getElementById('resetBtn').style.display = 'none';
    }
    
    // Clear the triangle
    function clearTriangle() {
        console.log('Application: Clearing triangle');
        // Remove triangle objects
        if (triangleObjects.length > 0) {
            triangleObjects.forEach(obj => {
                board.removeObject(obj);
            });
            triangleObjects = [];
        }
        
        // Remove triangle labels
        if (triangleLabels.length > 0) {
            triangleLabels.forEach(obj => {
                board.removeObject(obj);
            });
            triangleLabels = [];
        }
        
        // Remove DOM elements for draggable labels
        const existingLabels = document.querySelectorAll('.triangle-side');
        existingLabels.forEach(el => el.remove());
    }
    
    // Create draggable labels
    function createDraggableLabels() {
        console.log('Application: Creating draggable labels');
        // Create container for draggable labels if it doesn't exist
        if (!document.getElementById('triangle-labels')) {
            const container = document.createElement('div');
            container.id = 'triangle-labels';
            container.style.position = 'absolute';
            container.style.top = '0';
            container.style.left = '0';
            container.style.pointerEvents = 'none';
            container.style.width = '100%';
            container.style.height = '100%';
            document.querySelector('.graph-container').appendChild(container);
        }
        
        const container = document.getElementById('triangle-labels');
        container.innerHTML = ''; // Clear previous labels
        
        // Calculate label positions in JSXGraph coordinates
        const xA = pointA.X();
        const yA = pointA.Y();
        const xB = pointB.X();
        const yB = pointB.Y();
        const xC = pointC.X();
        const yC = pointC.Y();
        
        // Get board dimensions and conversion factors
        const boardWidth = board.canvasWidth;
        const boardHeight = board.canvasHeight;
        const boardBound = board.getBoundingBox();
        
        // Improved conversion functions with better accuracy
        function toPixelX(x) {
            return (x - boardBound[0]) * boardWidth / (boardBound[2] - boardBound[0]);
        }
        
        function toPixelY(y) {
            return (boardBound[1] - y) * boardHeight / (boardBound[1] - boardBound[3]);
        }
        
        // Create HTML elements for draggable labels with improved positioning
        
        // Hypotenuse label (d)
        const dLabel = document.createElement('div');
        dLabel.id = 'd-side-label';
        dLabel.className = 'triangle-side';
        dLabel.textContent = 'd';
        dLabel.dataset.formula = 'd';
        dLabel.style.position = 'absolute';
        console.log(isPointAHigher,"isPointAHigher");
        if(isPointAHigher) {
            dLabel.style.left = `${toPixelX((xA + xB) / 2) + 40}px`;
            dLabel.style.top = `${toPixelY((yA + yB) / 2) + 50}px`;
        } else {
            dLabel.style.left = `${toPixelX((xA + xB) / 2) - 10}px`;
            dLabel.style.top = `${toPixelY((yA + yB) / 2) + 40}px`;
        }
        dLabel.style.color = '#d63384';
        dLabel.style.width = '20px';
        dLabel.style.textAlign = 'center';
        dLabel.style.pointerEvents = 'auto';
        dLabel.style.cursor = 'grab';
        dLabel.style.zIndex = '100';
        dLabel.setAttribute('draggable', 'true');
        container.appendChild(dLabel);
        
        // Horizontal side label (x₂-x₁)
        const xLabel = document.createElement('div');
        xLabel.id = 'x-side-label';
        xLabel.className = 'triangle-side';
        xLabel.textContent = 'x₂-x₁';
        xLabel.dataset.formula = 'x2-x1';
        xLabel.style.position = 'absolute';
        if(isPointAHigher) {
            xLabel.style.left = `${toPixelX((xA + xC) / 2) - 2}px`;
            xLabel.style.top = `${toPixelY(yA) + 50}px`;
        } else {
            xLabel.style.left = `${toPixelX((xA + xC) / 2) - 2}px`;
            xLabel.style.top = `${toPixelY(yA) + 90}px`;
        }
        xLabel.style.color = '#3b82f6';
        xLabel.style.width = '50px';
        xLabel.style.textAlign = 'center';
        xLabel.style.pointerEvents = 'auto';
        xLabel.style.cursor = 'grab';
        xLabel.style.zIndex = '100';
        xLabel.setAttribute('draggable', 'true');
        container.appendChild(xLabel);
        
        // Vertical side label (y₂-y₁)
        const yLabel = document.createElement('div');
        yLabel.id = 'y-side-label';
        yLabel.className = 'triangle-side';
        yLabel.textContent = 'y₂-y₁';
        yLabel.dataset.formula = 'y2-y1';
        yLabel.style.position = 'absolute';
        if(isPointAHigher) {
            yLabel.style.left = `${toPixelX(xC) - 35}px`;
            yLabel.style.top = `${toPixelY((yC + yB) / 2) + 70}px`;
        } else {
            yLabel.style.left = `${toPixelX(xC) + 25}px`;
            yLabel.style.top = `${toPixelY((yC + yB) / 2) + 70}px`;
        }
        yLabel.style.color = '#3b82f6';
        yLabel.style.width = '50px';
        yLabel.style.textAlign = 'center';
        yLabel.style.pointerEvents = 'auto';
        yLabel.style.cursor = 'grab';
        yLabel.style.zIndex = '100';
        yLabel.setAttribute('draggable', 'true');
        container.appendChild(yLabel);
        
        // Setup drag events for the labels
        setupDragForLabels();
        
        // Add a resize event listener to update positions when the window changes size
        window.addEventListener('resize', updateLabelPositions);
    }
    
    function updateLabelPositions() {
        console.log('Application: Updating label positions');
        if (!pointA || !pointB || !pointC) return;
        
        const boardWidth = board.canvasWidth;
        const boardHeight = board.canvasHeight;
        const boardBound = board.getBoundingBox();
        
        function toPixelX(x) {
            return (x - boardBound[0]) * boardWidth / (boardBound[2] - boardBound[0]);
        }
        
        function toPixelY(y) {
            return (boardBound[1] - y) * boardHeight / (boardBound[1] - boardBound[3]);
        }
        
        // Get label elements
        const dLabel = document.getElementById('d-side-label');
        const xLabel = document.getElementById('x-side-label');
        const yLabel = document.getElementById('y-side-label');
        
        if (dLabel && xLabel && yLabel) {
            const xA = pointA.X();
            const yA = pointA.Y();
            const xB = pointB.X();
            const yB = pointB.Y();
            const xC = pointC.X();
            const yC = pointC.Y();
            
            // Update positions
            dLabel.style.left = `${toPixelX((xA + xB) / 2) - 10}px`;
            dLabel.style.top = `${toPixelY((yA + yB) / 2) - 10}px`;
            
            xLabel.style.left = `${toPixelX((xA + xC) / 2) - 25}px`;
            xLabel.style.top = `${toPixelY(yA) + 5}px`;
            
            yLabel.style.left = `${toPixelX(xC) + 5}px`;
            yLabel.style.top = `${toPixelY((yC + yB) / 2) - 10}px`;
        }
    }

    // Setup drag events for the triangle side labels
    function setupDragForLabels() {
        console.log('Application: Setting up drag for labels');
        const labels = document.querySelectorAll('.triangle-side');
        const dropTargets = document.querySelectorAll('.blank-box');
        // Touch support for labels
labels.forEach(label => {
    label.addEventListener('touchstart', function(e) {
        if (label.classList.contains('used')) return;
    
        const touch = e.touches[0];
    
        // Prevent scrolling unless user is near screen edge (for back gesture)
        const edgeMargin = 30; // px from edge where we allow back gesture
        const isNearLeftEdge = touch.clientX < edgeMargin;
        const isNearRightEdge = touch.clientX > window.innerWidth - edgeMargin;
    
        if (!isNearLeftEdge && !isNearRightEdge) {
            e.preventDefault(); // Only block scrolling if not near edges
        }
    
        const ghost = label.cloneNode(true);
        ghost.style.position = 'absolute';
        ghost.style.pointerEvents = 'none';
        ghost.style.opacity = '0.8';
        ghost.style.zIndex = '1000';
        ghost.classList.add('dragging');
        ghost.id = 'ghost-drag';
        document.body.appendChild(ghost);
    
        label.dataset.touchDragging = 'true';
        label.dataset.ghostId = ghost.id;
    
        ghost.style.left = `${touch.clientX}px`;
        ghost.style.top = `${touch.clientY}px`;
    
        function moveAt(touch) {
            // console.log(touch.clientX,"This is ghost widht at moveAt", );
            ghost.style.left = `${touch.clientX - ghost.offsetWidth/2}px`;
            ghost.style.top = `${touch.clientY - ghost.offsetHeight/2}px`;
        }
    
        function onTouchMove(ev) {
            ev.preventDefault(); // block scroll while dragging
            const moveTouch = ev.touches[0];
            moveAt(moveTouch);
        }
    
        function onTouchEnd(ev) {
            document.removeEventListener('touchmove', onTouchMove, { passive: false });
            document.removeEventListener('touchend', onTouchEnd);
    
            const ghostEl = document.getElementById(label.dataset.ghostId);
            if (ghostEl) ghostEl.remove();
    
            label.dataset.touchDragging = 'false';
    
            const endTouch = ev.changedTouches[0];
            const dropTarget = document.elementFromPoint(endTouch.clientX, endTouch.clientY);
    
            if (dropTarget && dropTarget.classList.contains('blank-box')) {
                const formula = label.dataset.formula;
                const index = [...dropTargets].indexOf(dropTarget);
    
                if (formula === 'd' && index !== 0) {
                    dropTarget.classList.add('invalid');
                    setTimeout(() => dropTarget.classList.remove('invalid'), 800);
                    return;
                }
    
                if (dropTarget.textContent) {
                    const previousSourceId = dropTarget.dataset.sourceId;
                    if (previousSourceId) {
                        const previousSource = document.getElementById(previousSourceId);
                        if (previousSource) previousSource.classList.remove('used');
                    }
                }
    
                dropTarget.textContent = label.textContent;
                dropTarget.dataset.formula = formula;
                dropTarget.dataset.sourceId = label.id;
                dropTarget.setAttribute('draggable', 'true');
    
                label.classList.add('used');
                checkSolution();
            }
        }
    
        document.addEventListener('touchmove', onTouchMove, { passive: false });
        document.addEventListener('touchend', onTouchEnd);
    });
    
});

// Touch support for drop targets (double-tap to clear)
dropTargets.forEach((box) => {
    let lastTap = 0;
    box.addEventListener('touchend', function(e) {
        const now = new Date().getTime();
        const tapLength = now - lastTap;
        if (tapLength < 300 && tapLength > 0) {
            // Double-tap detected
            if (this.textContent) {
                const sourceId = this.dataset.sourceId;
                const source = document.getElementById(sourceId);

                this.textContent = '';
                this.dataset.formula = '';
                this.dataset.sourceId = '';
                this.classList.remove('valid');
                this.classList.remove('invalid');
                this.setAttribute('draggable', 'false');

                if (source) {
                    source.classList.remove('used');
                }

                checkSolution();
            }
        }
        lastTap = now;
    });
});

        labels.forEach(label => {
            label.addEventListener('dragstart', function(e) {
                e.dataTransfer.setData('text/plain', this.textContent);
                e.dataTransfer.setData('formula', this.dataset.formula);
                e.dataTransfer.setData('source-id', this.id);
                this.classList.add('dragging');
            });
            
            label.addEventListener('dragend', function() {
                this.classList.remove('dragging');
            });
        });
        
        // Set up drop targets (formula boxes)
        dropTargets.forEach((box, index) => {
            box.addEventListener('dragover', function(e) {
                const formula = e.dataTransfer.types.includes('formula') ? 
                               e.dataTransfer.getData('formula') : '';
                
                // Only allow d in the first box
                if (formula === 'd' && index !== 0) {
                    // Don't allow d in boxes other than the first
                    this.classList.add('invalid');
                    this.classList.remove('highlight');
                    e.preventDefault();
                    return;
                }
                            
                // Check if this would be the correct position
                let isCorrectPosition = false;
                
                // "d" belongs in first box
                if (index === 0 && formula === 'd') {
                    isCorrectPosition = true;
                } 
                // "x2-x1" belongs in second box
                else if (index === 1 && formula === 'x2-x1') {
                    isCorrectPosition = true;
                }
                // "y2-y1" belongs in third box
                else if (index === 2 && formula === 'y2-y1') {
                    isCorrectPosition = true;
                }
                
                // Always allow drop but with different visual feedback
                e.preventDefault();
                if (isCorrectPosition) {
                    this.classList.add('highlight');
                    this.classList.remove('invalid');
                } else {
                    // Show that this isn't the ideal position but still allow drop
                    this.classList.add('invalid');
                    this.classList.remove('highlight');
                }
            });
            
            box.addEventListener('dragleave', function() {
                this.classList.remove('highlight');
                this.classList.remove('invalid');
            });
            
            box.addEventListener('drop', function(e) {
                e.preventDefault();
                this.classList.remove('highlight');
                this.classList.remove('invalid');
                
                const data = e.dataTransfer.getData('text/plain');
                const formula = e.dataTransfer.getData('formula');
                const sourceId = e.dataTransfer.getData('source-id');
                const source = document.getElementById(sourceId);
                
                // Do not allow 'd' in any box other than the first one
                if (formula === 'd' && index !== 0) {
                    // Show rejection feedback
                    this.classList.add('invalid');
                    setTimeout(() => {
                        this.classList.remove('invalid');
                    }, 800);
                    return;
                }
                
                // If there was already content in this box, free it up
                if (this.textContent) {
                    const previousSourceId = this.dataset.sourceId;
                    if (previousSourceId) {
                        const previousSource = document.getElementById(previousSourceId);
                        if (previousSource) {
                            previousSource.classList.remove('used');
                        }
                    }
                }
                
                // Always accept the drop, but with different styling
                this.textContent = data;
                this.dataset.formula = formula;
                this.dataset.sourceId = sourceId;
                
                if (source) {
                    source.classList.add('used');
                }
                
                // Make this box draggable now that it has content
                this.setAttribute('draggable', 'true');
                
                // Check solution after each drop
                checkSolution();
            });
            
            // Make the boxes themselves draggable when they have content
            box.addEventListener('dragstart', function(e) {
                if (!this.textContent) {
                    e.preventDefault();
                    return;
                }
                
                e.dataTransfer.setData('text/plain', this.textContent);
                e.dataTransfer.setData('formula', this.dataset.formula);
                e.dataTransfer.setData('source-id', this.dataset.sourceId);
                e.dataTransfer.setData('from-box', 'true');
                e.dataTransfer.setData('box-id', this.id);
                
                this.classList.add('dragging');
            });
            
            box.addEventListener('dragend', function() {
                this.classList.remove('dragging');
                
                // If this was moved to another box, clear this one
                const boxId = this.id;
                const allBoxesWithSameSourceId = document.querySelectorAll(`.blank-box[data-source-id="${this.dataset.sourceId}"]`);
                
                // If there's more than one box with the same source ID, clear this one
                if (allBoxesWithSameSourceId.length > 1) {
                    for (const otherBox of allBoxesWithSameSourceId) {
                        if (otherBox.id !== boxId) {
                            // Another box now has this value, so clear this one
                            this.textContent = '';
                            this.dataset.formula = '';
                            this.dataset.sourceId = '';
                            this.classList.remove('valid');
                            this.classList.remove('invalid');
                            this.setAttribute('draggable', 'false');
                            break;
                        }
                    }
                }
            });
            
            // Double-click to clear box
            box.addEventListener('dblclick', function() {
                if (this.textContent) {
                    const sourceId = this.dataset.sourceId;
                    const source = document.getElementById(sourceId);
                    
                    // Clear the box
                    this.textContent = '';
                    this.dataset.formula = '';
                    this.dataset.sourceId = '';
                    this.classList.remove('valid');
                    this.classList.remove('invalid');
                    this.setAttribute('draggable', 'false');
                    
                    // Reset the source label
                    if (source) {
                        source.classList.remove('used');
                    }
                    
                    // Check solution again in case it was previously complete
                    checkSolution();
                }
            });
        });
    }
    
    // Function to check if the solution is correct
    function checkSolution() {
        console.log('Application: Checking solution');
        const blank1 = document.getElementById('blank1');
        const blank2 = document.getElementById('blank2');
        const blank3 = document.getElementById('blank3');
        const fullSolution = document.getElementById('fullSolution');
        
        // Clear any existing content in the solution div
        fullSolution.innerHTML = '';
        fullSolution.innerText = '';
        
        // Hide the solution container until we know it's correct
        fullSolution.style.display = 'none';
        
        // Check if all blanks are filled
        if (blank1.textContent && blank2.textContent && blank3.textContent) {
            // Check if d is in the first position
            const dInFirstPosition = blank1.dataset.formula === "d";
            
            // Check if x2-x1 and y2-y1 are in the other two positions (in any order)
            const xDiffAndYDiffInRemainingPositions = 
                (blank2.dataset.formula === "x2-x1" && blank3.dataset.formula === "y2-y1") ||
                (blank2.dataset.formula === "y2-y1" && blank3.dataset.formula === "x2-x1");
            
            // Solution is correct if d is in first position and x2-x1 and y2-y1 are in other positions
            if (dInFirstPosition && xDiffAndYDiffInRemainingPositions) {
                console.log('Application: Solution is correct, showing solution');
                
                // Show the full solution container
                fullSolution.style.display = 'block';
                
                // Determine the order of terms based on which one is in the second position
                const firstTerm = blank2.dataset.formula === "x2-x1" ? "(x₂ - x₁)" : "(y₂ - y₁)";
                const secondTerm = blank2.dataset.formula === "x2-x1" ? "(y₂ - y₁)" : "(x₂ - x₁)";
                
                // Create equations with MathJax
                const equations = [
                    { tex: `d^2 = ${firstTerm}^2 + ${secondTerm}^2`, color: '#000' },
                    { tex: `\\sqrt{d^2} = \\sqrt{${firstTerm}^2 + ${secondTerm}^2}`, color: '#000' },
                    { tex: `d = \\sqrt{${firstTerm}^2 + ${secondTerm}^2}`, color: '#000' }
                ];
                
                // Add equations
                equations.forEach((eq) => {
                    const p = document.createElement('p');
                    p.classList.add('equation-p');
                    p.style.color = eq.color;
                    
                    // Fix MathJax implementation
                    const mathSpan = document.createElement('span');
                    mathSpan.className = 'math';
                    mathSpan.innerHTML = '\\(' + eq.tex + '\\)';
                    p.appendChild(mathSpan);
                    
                    fullSolution.appendChild(p);
                });
                
                // Render the equations with MathJax
                if (window.MathJax) {
                    MathJax.typesetPromise && MathJax.typesetPromise();
                    MathJax.typeset && MathJax.typeset();
                }
                
                // Add success styling to all boxes
                blank1.classList.add('valid');
                blank1.classList.remove('invalid');
                blank2.classList.add('valid');
                blank2.classList.remove('invalid');
                blank3.classList.add('valid');
                blank3.classList.remove('invalid');
                
                // Show the reset button
                document.getElementById('resetBtn').style.display = 'block';
            } else {
                // Hide solution if it was previously shown but is now incorrect
                fullSolution.style.display = 'none';
                
                // Update validation styling for each box
                if (blank1.dataset.formula === "d") {
                    blank1.classList.add('valid');
                    blank1.classList.remove('invalid');
                } else {
                    blank1.classList.add('invalid');
                    blank1.classList.remove('valid');
                }
                
                if (blank2.dataset.formula === "x2-x1" || blank2.dataset.formula === "y2-y1") {
                    blank2.classList.add('valid');
                    blank2.classList.remove('invalid');
                } else {
                    blank2.classList.add('invalid');
                    blank2.classList.remove('valid');
                }
                
                if (blank3.dataset.formula === "y2-y1" || blank3.dataset.formula === "x2-x1") {
                    blank3.classList.add('valid');
                    blank3.classList.remove('invalid');
                } else {
                    blank3.classList.add('invalid');
                    blank3.classList.remove('valid');
                }
            }
        } else {
            // Hide the solution if not all boxes are filled
            fullSolution.style.display = 'none';
            
            // Update validation for partially filled boxes
            if (blank1.textContent) {
                if (blank1.dataset.formula === "d") {
                    blank1.classList.add('valid');
                    blank1.classList.remove('invalid');
                } else {
                    blank1.classList.add('invalid');
                    blank1.classList.remove('valid');
                }
            }
            
            if (blank2.textContent) {
                if (blank2.dataset.formula === "x2-x1" || blank2.dataset.formula === "y2-y1") {
                    blank2.classList.add('valid');
                    blank2.classList.remove('invalid');
                } else {
                    blank2.classList.add('invalid');
                    blank2.classList.remove('valid');
                }
            }
            
            if (blank3.textContent) {
                if (blank3.dataset.formula === "y2-y1" || blank3.dataset.formula === "x2-x1") {
                    blank3.classList.add('valid');
                    blank3.classList.remove('invalid');
                } else {
                    blank3.classList.add('invalid');
                    blank3.classList.remove('valid');
                }
            }
        }
    }
    
    // Reset button handler
    document.getElementById('resetBtn').addEventListener('click', function() {
        console.log('Application: Reset button clicked');
        // Reset state
        pointA = null;
        pointB = null;
        pointC = null;
        selectedPoints = [];
        
        // Hide UI elements
        document.getElementById('formula').style.display = 'none';
        document.getElementById('resetBtn').style.display = 'none';
        document.getElementById('fullSolution').style.display = 'none';
        
        // Clear triangle elements and labels
        clearTriangle();
        
        // Clear formula boxes
        document.querySelectorAll('.blank-box').forEach(box => {
            box.textContent = '';
            box.dataset.formula = '';
            box.dataset.sourceId = '';
            box.classList.remove('valid');
            box.classList.remove('invalid');
        });
        
        // Reset info
        document.getElementById('pointsInfo').innerHTML = '<h2>Click on two points to start</h2>';
        
        // Generate new points
        createRandomPoints();
    });
    
    // Initialize
    console.log('Application: Starting initialization');
    createRandomPoints();
    console.log('Application: Initialization complete');
}); 