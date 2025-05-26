    
        // Model
        class NumberLineModel {
            constructor() {
                this.firstNumber = null;
                this.secondNumber = null;
                this.exactSum = null;
                this.approximateSum = null;
                this.isDragging = false;
                this.currentPhase = 'first'; // 'first', 'second', 'complete'
                this.dragPoint = { x: 0.75, y: 0 };
                
                // Animation state for first number
                this.firstAnimationComplete = false;
                this.firstArrowProgress = 0;
                this.firstLineProgress = 0;
                this.isFirstArrowAnimating = false;
                this.isFirstLineAnimating = false;
                
                // Animation state for second number
                this.secondAnimationComplete = false;
                this.secondArrowProgress = 0;
                this.secondLineProgress = 0;
                this.isSecondArrowAnimating = false;
                this.isSecondLineAnimating = false;
                
                this.currentColor = 'red'; // Add color tracking
            }

            reset() {
                this.firstNumber = null;
                this.secondNumber = null;
                this.exactSum = null;
                this.approximateSum = null;
                this.currentPhase = 'first';
                this.dragPoint = { x: 0.75, y: 0 };
                
                // Reset all animation states
                this.firstAnimationComplete = false;
                this.firstArrowProgress = 0;
                this.firstLineProgress = 0;
                this.isFirstArrowAnimating = false;
                this.isFirstLineAnimating = false;
                
                this.secondAnimationComplete = false;
                this.secondArrowProgress = 0;
                this.secondLineProgress = 0;
                this.isSecondArrowAnimating = false;
                this.isSecondLineAnimating = false;
                
                this.currentColor = 'red'; // Reset color
            }

            calculateApproximateValue(exact) {
                return Math.round(exact * 4) / 4;
            }
        }

        // View
        class NumberLineView {
            constructor(model) {
                this.model = model;
                this.setup();
            }

            setup() {
                createCanvas(800, 400).parent('canvas-container');
                this.lineY = height / 2;
                this.exactLineY = this.lineY - 150;
                this.approximateLineY = this.lineY - 50;
                
                // Set up button event listeners
                document.getElementById('secondNumberBtn').addEventListener('click', () => {
                    this.model.currentPhase = 'second';
                    this.model.currentColor = 'green';
                    this.model.dragPoint.x = 0.75; // Reset drag point for second number
                    this.updateButtonVisibility();
                });
                
                document.getElementById('tryAnotherBtn').addEventListener('click', () => {
                    this.model.reset();
                    this.model.dragPoint.x = 0.75; // Set initial drag point position
                    this.updateButtonVisibility();
                });
                
                // Initialize button visibility
                this.updateButtonVisibility();
            }

            updateButtonVisibility() {
                const secondNumberBtn = document.getElementById('secondNumberBtn');
                const tryAnotherBtn = document.getElementById('tryAnotherBtn');
                
                if (this.model.firstNumber !== null && this.model.currentPhase === 'first') {
                    secondNumberBtn.style.display = 'block';
                    tryAnotherBtn.style.display = 'none';
                } else if (this.model.currentPhase === 'complete' || this.model.secondNumber !== null) {
                    secondNumberBtn.style.display = 'none';
                    tryAnotherBtn.style.display = 'block';
                } else {
                    secondNumberBtn.style.display = 'none';
                    tryAnotherBtn.style.display = 'none';
                }
            }

            draw() {
                background(255);
                this.drawNumberLines();
                this.drawTriangleShapes();
                this.drawConnectors();
                this.drawPoints();
                this.drawValues();
            }

            drawNumberLines() {
                // Draw exact line
                stroke(0);
                line(50, this.exactLineY, 450, this.exactLineY);
                
                // Draw approximate line
                line(50, this.approximateLineY, 450, this.approximateLineY);
                
                // Draw main tick marks and numbers (keep existing ones)
                for(let i = 0; i <= 4; i++) {
                    let x = map(i/4, 0, 1, 50, 450);
                    // Draw longer, more prominent ticks for main values
                    strokeWeight(2);
                    line(x, this.exactLineY - 8, x, this.exactLineY + 8);
                    line(x, this.approximateLineY - 8, x, this.approximateLineY + 8);
                    
                    // Draw the numbers
                    textAlign(CENTER);
                    fill(0);
                    strokeWeight(1);
                    text(i/4, x, this.exactLineY + 25);
                    text(i/4, x, this.approximateLineY + 25);
                }
                
                // Draw additional minor ticks for exact line (16 subdivisions = 0.0625 increments)
                strokeWeight(1);
                for(let i = 0; i <= 16; i++) {
                    if (i % 4 !== 0) { // Skip main ticks (already drawn)
                        let x = map(i/16, 0, 1, 50, 450);
                        line(x, this.exactLineY - 5, x, this.exactLineY + 5);
                    }
                }
                
                // Draw additional minor ticks for approximate line (at 0.125 increments)
                for(let i = 0; i <= 8; i++) {
                    if (i % 2 !== 0) { // Skip main ticks (already drawn)
                        let x = map(i/8, 0, 1, 50, 450);
                        line(x, this.approximateLineY - 5, x, this.approximateLineY + 5);
                    }
                }
                
                // Reset stroke weight
                strokeWeight(1);
            }

            drawTriangleShapes() {
                // Define the segments
                const segments = [0, 0.25, 0.5, 0.75, 1];
                const spacing = (this.approximateLineY - (this.exactLineY + 450));
                
                // Draw one curve per segment with decreasing height
                for(let i = 0; i < segments.length - 1; i++) {
                    let startX = map(segments[i], 0, 1, 50, 450);
                    let endX = map(segments[i + 1], 0, 1, 50, 450);
                    let segmentWidth = endX - startX;
                    
                    // Calculate decreasing height for each segment
                    let curveHeight = spacing * (1 - (0.90)); // Decrease height by 20% each segment
                    
                    // Draw one curve in the middle of each segment
                    let x1 = startX - 3;
                    let x2 = startX + (segmentWidth / 2);
                    let x3 = endX - 10;
                    
                    stroke(128, 128, 255, 150); // Light purple color with some transparency
                    noFill();
                    beginShape();
                    vertex(x1, this.exactLineY + 60);
                    vertex(x2, this.exactLineY - curveHeight); // Changed + to - to make it point upward
                    vertex(x3, this.exactLineY + 60);
                    endShape();
                }
            }

            drawPoints() {
                // Always draw the dragging point with current color
                if (this.model.currentPhase !== 'complete') {
                    let x = map(this.model.dragPoint.x, 0, 1, 50, 450);
                    fill(this.model.currentPhase === 'first' ? 'red' : 'green');
                    noStroke();
                    circle(x, this.exactLineY, 10);
                }

                // Draw first point if it exists
                if (this.model.firstNumber !== null) {
                    let x = map(this.model.firstNumber, 0, 1, 50, 450);
                    fill('red');
                    noStroke();
                    circle(x, this.exactLineY, 10);
                    
                    // Draw its approximate point
                    let approxX = map(this.model.calculateApproximateValue(this.model.firstNumber), 0, 1, 50, 450);
                    circle(approxX, this.approximateLineY, 10);
                }
                
                // Draw second point if set
                if (this.model.secondNumber !== null) {
                    let x = map(this.model.secondNumber, 0, 1, 50, 450);
                    fill('green');
                    noStroke();
                    circle(x, this.exactLineY, 10);
                    
                    let approxX = map(this.model.calculateApproximateValue(this.model.secondNumber), 0, 1, 50, 450);
                    circle(approxX, this.approximateLineY, 10);
                }
            }

            drawConnectors() {
                // Draw first number connector if it exists
                if (this.model.firstNumber !== null) {
                    this.drawPointConnector(
                        this.model.firstNumber, 
                        'red',
                        this.model.isFirstArrowAnimating,
                        this.model.isFirstLineAnimating,
                        this.model.firstArrowProgress,
                        this.model.firstLineProgress,
                        this.model.firstAnimationComplete
                    );
                    
                    // Update animation progress for first point
                    if (this.model.isFirstArrowAnimating) {
                        this.model.firstArrowProgress += 0.05;
                        if (this.model.firstArrowProgress >= 1) {
                            this.model.firstArrowProgress = 1;
                            this.model.isFirstArrowAnimating = false;
                            this.model.isFirstLineAnimating = true; // Start line animation after arrow
                        }
                    }
                    
                    if (this.model.isFirstLineAnimating) {
                        this.model.firstLineProgress += 0.05;
                        if (this.model.firstLineProgress >= 1) {
                            this.model.firstLineProgress = 1;
                            this.model.isFirstLineAnimating = false;
                            this.model.firstAnimationComplete = true;
                        }
                    }
                }
                
                // Draw second number connector if it exists
                if (this.model.secondNumber !== null) {
                    this.drawPointConnector(
                        this.model.secondNumber, 
                        'green',
                        this.model.isSecondArrowAnimating,
                        this.model.isSecondLineAnimating,
                        this.model.secondArrowProgress,
                        this.model.secondLineProgress,
                        this.model.secondAnimationComplete
                    );
                    
                    // Update animation progress for second point
                    if (this.model.isSecondArrowAnimating) {
                        this.model.secondArrowProgress += 0.05;
                        if (this.model.secondArrowProgress >= 1) {
                            this.model.secondArrowProgress = 1;
                            this.model.isSecondArrowAnimating = false;
                            this.model.isSecondLineAnimating = true; // Start line animation after arrow
                        }
                    }
                    
                    if (this.model.isSecondLineAnimating) {
                        this.model.secondLineProgress += 0.05;
                        if (this.model.secondLineProgress >= 1) {
                            this.model.secondLineProgress = 1;
                            this.model.isSecondLineAnimating = false;
                            this.model.secondAnimationComplete = true;
                        }
                    }
                }
                
                // Draw measurement lines if needed
                if (this.model.firstAnimationComplete && !this.model.secondAnimationComplete) {
                    this.drawMeasurementLines(this.model.firstNumber, this.model.calculateApproximateValue(this.model.firstNumber));
                } else if (this.model.firstAnimationComplete && this.model.secondAnimationComplete) {
                    this.drawMeasurementLinesForTwo();
                }
            }
            
            drawPointConnector(exactValue, color, isArrowAnimating, isLineAnimating, arrowProgress, lineProgress, animationComplete) {
                let approxValue = this.model.calculateApproximateValue(exactValue);
                let exactPosX = map(exactValue, 0, 1, 50, 450);
                let approxPosX = map(approxValue, 0, 1, 50, 450);
                
                // Find which segment the point is in
                const segments = [0, 0.25, 0.5, 0.75, 1];
                let segmentIndex = 0;
                for (let i = 0; i < segments.length - 1; i++) {
                    if (exactValue >= segments[i] && exactValue <= segments[i+1]) {
                        segmentIndex = i;
                        break;
                    }
                }
                
                // Calculate triangle points for that segment
                let startX = map(segments[segmentIndex], 0, 1, 50, 450);
                let endX = map(segments[segmentIndex + 1], 0, 1, 50, 450);
                let segmentWidth = endX - startX;
                let spacing = (this.approximateLineY - (this.exactLineY + 450));
                let curveHeight = spacing * (1 - (0.90));
                
                let x1 = startX - 3;
                let x2 = startX + (segmentWidth / 2);
                let x3 = endX - 10;
                let triangleYTop = this.exactLineY - curveHeight; // Top point of triangle
                let triangleYBottom = this.exactLineY + 60; // Bottom of triangle
                
                // Determine which side to use
                let isLeftSide = exactPosX < x2;
                
                if (isArrowAnimating) {
                    // First part of animation: arrow moving
                    stroke(128, 0, 255);
                    let arrowY = lerp(this.exactLineY, this.exactLineY - 20, arrowProgress);
                } else if (isLineAnimating) {
                    // Second part of animation: dotted line
                    drawingContext.setLineDash([5, 5]);
                    stroke(color);
                    
                    if (lineProgress < 0.5) {
                        // First half of animation: drop from exact line along the triangle side
                        let progress = lineProgress * 2; // Scale to 0-1 range
                        
                        // Calculate position on the triangle edge
                        let triangleX, triangleY;
                        
                        if (isLeftSide) {
                            // Animate along the left side of the triangle
                            let edgeProgress = progress;
                            triangleX = lerp(exactPosX, x1, edgeProgress);
                            triangleY = lerp(this.exactLineY, triangleYBottom, edgeProgress);
                        } else {
                            // Animate along the right side of the triangle
                            let edgeProgress = progress;
                            triangleX = lerp(exactPosX, x3, edgeProgress);
                            triangleY = lerp(this.exactLineY, triangleYBottom, edgeProgress);
                        }
                        
                        // Draw line from exact point to triangle edge
                        line(exactPosX, this.exactLineY, triangleX, triangleY);
                    } else {
                        // Second half of animation: move along the triangle to approximate line
                        let progress = (lineProgress - 0.5) * 2; // Scale to 0-1 range
                        
                        // First, draw the completed part of the animation (exact point to triangle edge)
                        if (isLeftSide) {
                            line(exactPosX, this.exactLineY, x1, triangleYBottom);
                            
                            // Now animate from edge to approximate point
                            let edgeX = lerp(x1, approxPosX, progress);
                            let edgeY = lerp(triangleYBottom, this.approximateLineY, progress);
                            line(x1, triangleYBottom, edgeX, edgeY);
                        } else {
                            line(exactPosX, this.exactLineY, x3, triangleYBottom);
                            
                            // Now animate from edge to approximate point
                            let edgeX = lerp(x3, approxPosX, progress);
                            let edgeY = lerp(triangleYBottom, this.approximateLineY, progress);
                            line(x3, triangleYBottom, edgeX, edgeY);
                        }
                    }
                    
                    drawingContext.setLineDash([]);
                } else if (animationComplete) {
                    // Draw completed path
                    drawingContext.setLineDash([5, 5]);
                    stroke(color);
                    
                    if (isLeftSide) {
                        line(exactPosX, this.exactLineY, x1, triangleYBottom);
                        line(x1, triangleYBottom, approxPosX, this.approximateLineY);
                    } else {
                        line(exactPosX, this.exactLineY, x3, triangleYBottom);
                        line(x3, triangleYBottom, approxPosX, this.approximateLineY);
                    }
                    
                    drawingContext.setLineDash([]);
                }
            }

            drawMeasurementLinesForTwo() {
                const startY = this.approximateLineY + 80;
                const gap = 40;
                if (this.model.currentPhase === 'complete') {
                    // Draw equation labels above the lines
                    noStroke();
                    fill(0);
                    textAlign(LEFT);
                    let exactSum = this.model.firstNumber + this.model.secondNumber;
                    let approxSum = this.model.calculateApproximateValue(this.model.firstNumber) + 
                                   this.model.calculateApproximateValue(this.model.secondNumber);
                    
                    // Display exact equation above exact line
                    textSize(16);
                    text(`Exact: ${this.model.firstNumber.toFixed(2)} + ${this.model.secondNumber.toFixed(2)} = ${exactSum.toFixed(2)}`, 50, startY - 30);
                    
                    // --- EXACT MEASUREMENT LINES ---
                    // First number in red
                    stroke(255, 0, 0);
                    let firstExactX = map(this.model.firstNumber, 0, 1, 50, 450);
                    
                    line(50, startY, firstExactX, startY);
                    noStroke();
                    fill(255, 0, 0);
                    text(this.model.firstNumber.toFixed(2), (50 + firstExactX)/2, startY - 10);
                    
                    // Second number in green - continuous from first
                    stroke(0, 128, 0);
                    let secondExactEndX = firstExactX + map(this.model.secondNumber, 0, 1, 0, 450);
                    line(firstExactX, startY, secondExactEndX, startY);
                    noStroke();
                    fill(0, 128, 0);
                    text(this.model.secondNumber.toFixed(2), (firstExactX + secondExactEndX)/2, startY - 10);
                    
                    // Vertical marks for exact
                    stroke(0);
                    line(50, startY - 5, 50, startY + 5);  // Start
                    line(firstExactX, startY - 5, firstExactX, startY + 5);  // Middle
                    line(secondExactEndX, startY - 5, secondExactEndX, startY + 5);  // End
                    
                    // --- APPROXIMATE MEASUREMENT LINES ---
                    // Display approximate equation
                    noStroke();
                    fill(0);
                    textSize(16);
                    text(`Approximate: ${this.model.calculateApproximateValue(this.model.firstNumber).toFixed(2)} + ${this.model.calculateApproximateValue(this.model.secondNumber).toFixed(2)} = ${approxSum.toFixed(2)}`, 50, startY + gap - 10);
                    
                    // First approximate in red
                    stroke(255, 0, 0);
                    let firstApproxX = map(this.model.calculateApproximateValue(this.model.firstNumber), 0, 1, 50, 450);
                    line(50, startY + gap + 20, firstApproxX, startY + gap + 20);
                    noStroke();
                    fill(255, 0, 0);
                    text(this.model.calculateApproximateValue(this.model.firstNumber).toFixed(2), (50 + firstApproxX)/2, startY + gap + 10);
                    
                    // Second approximate in green - continuous from first
                    stroke(0, 128, 0);
                    let secondApproxEndX = firstApproxX + map(this.model.calculateApproximateValue(this.model.secondNumber), 0, 1, 0, 450);
                    line(firstApproxX, startY + gap  + 20, secondApproxEndX, startY + gap + 20);
                    noStroke();
                    fill(0, 128, 0);
                    text(this.model.calculateApproximateValue(this.model.secondNumber).toFixed(2), (firstApproxX + secondApproxEndX)/2, startY + gap + 10);
                    
                    // Vertical marks for approximate
                    stroke(0);
                    line(50, startY + gap + 15, 50, startY + gap + 25);  // Start
                    line(firstApproxX, startY + gap + 10, firstApproxX, startY + gap + 25);  // Middle
                    line(secondApproxEndX, startY + gap + 15, secondApproxEndX, startY + gap + 25);  // End
                    
                    // Display final equation at bottom
                    noStroke();
                    fill(0, 128, 0);
                    textSize(25);
                    text(`${this.model.firstNumber.toFixed(2)} + ${this.model.secondNumber.toFixed(2)} ≈ ${approxSum.toFixed(2)}`, 50, startY + 120);
                }
            }

            drawMeasurementLines(exactValue, approxValue) {
                const startY = this.approximateLineY + 80;
                const gap = 40;
                
                // Draw equation labels above the lines
                noStroke();
                fill(0);
                textAlign(LEFT);
                textSize(16);
                text(`Exact: ${exactValue.toFixed(2)} `, 50, startY - 30);
                
                // Draw exact measurement
                let exactX = map(exactValue, 0, 1, 50, 450);
                stroke(255, 0, 0);
                line(50, startY, exactX, startY);
                
                // Display value
                noStroke();
                fill(255, 0, 0);
                text(exactValue.toFixed(2), (50 + exactX)/2, startY - 10);
                
                // Draw vertical marks
                stroke(0);
                line(50, startY - 5, 50, startY + 5);
                line(exactX, startY - 5, exactX, startY + 5);
                
                // Display approximate equation above approximate line
                noStroke();
                fill(0);
                textSize(16);
                text(`Approximate: ${approxValue.toFixed(2)}`, 50, startY + gap - 10);
                
                // Draw approximate measurement
                let approxX = map(approxValue, 0, 1, 50, 450);
                stroke(255, 0, 0);
                line(50, startY + gap + 20, approxX, startY + gap + 20);
                
                // Display approximate value
                noStroke();
                fill(255, 0, 0);
                text(approxValue.toFixed(2), (50 + approxX)/2, startY + gap + 10);
                
                // Draw vertical marks for approximate
                stroke(0);
                line(50, startY + gap + 15, 50, startY + gap + 25);
                line(approxX, startY + gap + 15, approxX, startY + gap + 25);
            }

            drawValues() {
                // Remove corner values and only show heading
                textAlign(LEFT);
                fill(0);
                noStroke();
                textSize(13);
            }
        }

        // Controller
        class NumberLineController {
            constructor(model, view) {
                this.model = model;
                this.view = view;
                this.setupEventListeners();
            }

            setupEventListeners() {
                // Wait for canvas to be created
                setTimeout(() => {
                    const canvas = document.querySelector('canvas');
                    if (canvas) {
                        // Mouse events
                        canvas.addEventListener('mousedown', (e) => this.handleMousePressed(e));
                        canvas.addEventListener('mousemove', (e) => this.handleMouseDragged(e));
                        canvas.addEventListener('mouseup', (e) => this.handleMouseReleased(e));
                        
                        // Touch events with proper handling
                        canvas.addEventListener('touchstart', (e) => this.handleTouchStart(e), { passive: false });
                        canvas.addEventListener('touchmove', (e) => this.handleTouchMove(e), { passive: false });
                        canvas.addEventListener('touchend', (e) => this.handleTouchEnd(e), { passive: false });
                    }
                }, 100);
            }

            getEventPosition(e) {
                const canvas = e.target;
                const rect = canvas.getBoundingClientRect();
                const scaleX = canvas.width / rect.width;
                const scaleY = canvas.height / rect.height;
                
                let clientX, clientY;
                
                if (e.touches && e.touches.length > 0) {
                    // Touch event
                    clientX = e.touches[0].clientX;
                    clientY = e.touches[0].clientY;
                } else {
                    // Mouse event
                    clientX = e.clientX;
                    clientY = e.clientY;
                }
                
                return {
                    x: (clientX - rect.left) * scaleX,
                    y: (clientY - rect.top) * scaleY
                };
            }

            checkIfPointHit(pos) {
                const dragX = map(this.model.dragPoint.x, 0, 1, 50, 450);
                const dragY = this.view.exactLineY;
                const distance = Math.sqrt(Math.pow(pos.x - dragX, 2) + Math.pow(pos.y - dragY, 2));
                return distance < 20; // Increased hit area for touch
            }

            handleTouchStart(e) {
                e.preventDefault();
                const pos = this.getEventPosition(e);
                
                if (this.checkIfPointHit(pos)) {
                    this.model.isDragging = true;
                }
            }
            
            handleTouchMove(e) {
                e.preventDefault();
                
                if (this.model.isDragging) {
                    const pos = this.getEventPosition(e);
                    let x = constrain(map(pos.x, 50, 450, 0, 1), 0, 1);
                    this.model.dragPoint.x = x;
                }
            }
            
            handleTouchEnd(e) {
                e.preventDefault();
                
                if (this.model.isDragging) {
                    this.completePointPlacement();
                }
            }

            handleMousePressed(e) {
                const pos = this.getEventPosition(e);
                
                if (this.checkIfPointHit(pos)) {
                    this.model.isDragging = true;
                }
            }

            handleMouseDragged(e) {
                if (this.model.isDragging) {
                    const pos = this.getEventPosition(e);
                    let x = constrain(map(pos.x, 50, 450, 0, 1), 0, 1);
                    this.model.dragPoint.x = x;
                }
            }

            handleMouseReleased(e) {
                if (this.model.isDragging) {
                    this.completePointPlacement();
                }
            }

            completePointPlacement() {
                this.model.isDragging = false;
                let exactValue = this.model.dragPoint.x;
                
                if (this.model.currentPhase === 'first') {
                    this.model.firstNumber = exactValue;
                    // Start first number animation
                    this.model.isFirstArrowAnimating = true;
                    this.model.firstArrowProgress = 0;
                    this.model.firstLineProgress = 0;
                    // Update button visibility after setting first number
                    this.view.updateButtonVisibility();
                } else if (this.model.currentPhase === 'second') {
                    this.model.secondNumber = exactValue;
                    // Start second number animation
                    this.model.isSecondArrowAnimating = true;
                    this.model.secondArrowProgress = 0;
                    this.model.secondLineProgress = 0;
                    
                    // Calculate sum
                    this.model.exactSum = this.model.firstNumber + exactValue;
                    this.model.approximateSum = this.model.calculateApproximateValue(this.model.exactSum);
                    this.model.currentPhase = 'complete';
                    // Update button visibility after completing
                    this.view.updateButtonVisibility();
                }
            }
        }

        // Initialize the application
        let model, view, controller;

        function setup() {
            model = new NumberLineModel();
            view = new NumberLineView(model);
            controller = new NumberLineController(model, view);
        }

        function draw() {
            view.draw();
        }

        // Added this function to be accessible globally
        function updateButtonVisibility() {
            if (view) {
                view.updateButtonVisibility();
            }
        }
 