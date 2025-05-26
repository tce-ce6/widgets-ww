// Utility function to check if a number is odd or even
function checkOddEven(number) {
    if (typeof number !== 'number' || !Number.isInteger(number)) {
        throw new Error('Input must be an integer');
    }
    return number % 2 === 0 ? 'Even' : 'Odd';
}

// <!-- view.js -->
class PythagoreanView {
constructor() {
    // Get triangle elements
    this.triangleDisplay = document.getElementById('triangle-display');
    
    // Get drop box elements
    this.dropBoxA = document.getElementById('drop-a');
    this.dropBoxB = document.getElementById('drop-b');
    this.dropBoxC = document.getElementById('drop-c');
    
    // Get button elements
    this.checkButton = document.getElementById('check-button');
    this.notRightButton = document.getElementById('not-right-button');
    this.newProblemButton = document.getElementById('new-problem-button');
    
    // Get result and feedback elements
    this.calculationResult = document.getElementById('calculation-result');
    this.calculationResult.style.display = 'none'; // Hide initially
    this.feedbackElement = document.getElementById('feedback');
    this.correctCountElement = document.getElementById('correct-count');
    
    // Get hint elements
    this.hintContainer = document.getElementById('hint-container');
    this.hintText = document.getElementById('hint-text');
    this.triesLeftElement = document.getElementById('tries-left');
    this.tryAgainElement = document.getElementById('try-again');
    
    // Side label references (will be created in drawTriangle)
    this.sideALabel = null;
    this.sideBLabel = null;
    this.sideCLabel = null;
    
    // p5.js sketch reference
    this.p5sketch = null;
    
    // Initialize try again click handler
    this.tryAgainElement.addEventListener('click', () => {
        if (this.onTryAgain) {
            this.onTryAgain();
        }
    });
}

drawTriangle(sideA, sideB, sideC) {
    // Clear previous triangle
    this.triangleDisplay.innerHTML = '';
    
    // Store sides for p5 sketch to use
    this.currentSideA = sideA;
    this.currentSideB = sideB;
    this.currentSideC = sideC;
    
    // Parse numeric values for calculations
    this.numericSideA = this.parseNumericValue(sideA);
    this.numericSideB = this.parseNumericValue(sideB);
    this.numericSideC = this.parseNumericValue(sideC);
    
    // Create a p5.js sketch
    this.createP5Sketch();
    
    // We'll create and position the labels after the p5 sketch initializes
    // This is done via callback now to ensure coordinates are available
}

// Parse a value that might be a square root expression
parseNumericValue(value) {
    if (typeof value === 'number') {
        return value;
    }
    
    if (typeof value === 'string' && value.includes('√')) {
        const rootValue = parseInt(value.replace('√', ''));
        return Math.sqrt(rootValue);
    }
    
    return parseFloat(value);
}

createP5Sketch() {
    const that = this;
    
    // Create a new p5 sketch in instance mode
    this.p5sketch = new p5(function(p) {
        // Canvas dimensions - increased even more for better visibility
        const canvasWidth = 350;
        const canvasHeight = 280;
        
        // Triangle vertices
        let x1, y1, x2, y2, x3, y3;
        
        // Side lengths for right angle marker sizing
        let abLength, acLength, bcLength;
        
        // Whether to show the right angle symbol
        let showRightAngle = false;
        
        // Right angle position
        let rightAnglePosition;
        
        p.setup = function() {
            const canvas = p.createCanvas(canvasWidth, canvasHeight);
            canvas.parent(that.triangleDisplay);
            
            // Create triangle based on side lengths
            calculateTriangleVertices();
            
            // Create the side labels after calculating vertices
            that.createSideLabels(that.currentSideA, that.currentSideB, that.currentSideC);
        };
        
        p.draw = function() {
            p.clear();
            
            // Draw triangle with purple outline
            p.stroke('#6f42c1');
            p.strokeWeight(3);
            p.noFill();
            p.triangle(x1, y1, x2, y2, x3, y3);
            
            // Draw right angle marker if enabled
           // Draw right angle marker if enabled
if (showRightAngle && rightAnglePosition > 0) {
    console.log("Drawing right angle marker at position", rightAnglePosition);
    
    // Create a traditional right angle square marker
    p.stroke('#20c997'); // Teal color
    p.strokeWeight(2); // Thinner lines for the symbol
    p.noFill();
    // p.fill('rgba(32, 201, 151, 0.3)'); // No fill for cleaner look
    // Draw right angle marker based on position
    
    
    // Size for the right angle marker (proportional to triangle size)
    const minSide = Math.min(abLength, acLength, bcLength);
    const size = Math.max(minSide * 0.15, 15); 
   // At least 15px, max 15% of smallest side
    rightAnglePosition = 1;
    // Calculate unit vectors along each side of the triangle at the right angle
    if (rightAnglePosition === 1) { // Right angle at vertex A (bottom left)
        // Calculate unit vectors from A to B and A to C
        const abUnitVec = {
            x: (x2 - x1) / abLength,
            y: (y2 - y1) / abLength
        };
        const acUnitVec = {
            x: (x3 - x1) / acLength,
            y: (y3 - y1) / acLength 
        };
        
        // Draw the right angle square marker INSIDE the triangle
        p.beginShape();
        // Start at the point along AC vector
        p.vertex(x1 + acUnitVec.x * size, y1 + acUnitVec.y * size);
        // Draw to the corner point
        p.vertex(x1 + acUnitVec.x * size + abUnitVec.x * size, 
                 y1 + acUnitVec.y * size + abUnitVec.y * size);
        // Draw to the point along AB vector
        p.vertex(x1 + abUnitVec.x * size, y1 + abUnitVec.y * size);
    p.endShape(); 
    } 
    else if (rightAnglePosition === 2) { // Right angle at vertex B (bottom right)
        // Calculate unit vectors from B to A and B to C
        const baUnitVec = {
            x: (x1 - x2) / abLength,
            y: (y1 - y2) / abLength
        };
        const bcUnitVec = {
            x: (x3 - x2) / bcLength,
            y: (y3 - y2) / bcLength
        };
        
        // Draw the right angle square marker INSIDE the triangle
        p.beginShape();
        p.vertex(x2, y2); // Start at vertex B
        p.vertex(x2 + baUnitVec.x * size, y2 + baUnitVec.y * size); // Move along BA
        p.vertex(x2 + baUnitVec.x * size + bcUnitVec.x * size, 
                y2 + baUnitVec.y * size + bcUnitVec.y * size); // Move parallel to BC
        p.vertex(x2 + bcUnitVec.x * size, y2 + bcUnitVec.y * size); // Move along BC
        p.endShape(p.CLOSE);
    } 
    else if (rightAnglePosition === 3) { // Right angle at vertex C (top)
        // Calculate unit vectors from C to A and C to B
        const caUnitVec = {
            x: (x1 - x3) / acLength,
            y: (y1 - y3) / acLength
        };
        const cbUnitVec = {
            x: (x2 - x3) / bcLength,
            y: (y2 - y3) / bcLength
        };
        
        // Draw the right angle square marker INSIDE the triangle
        p.beginShape();
        p.vertex(x3, y3); // Start at vertex C
        p.vertex(x3 + caUnitVec.x * size, y3 + caUnitVec.y * size); // Move along CA
        p.vertex(x3 + caUnitVec.x * size + cbUnitVec.x * size, 
                y3 + caUnitVec.y * size + cbUnitVec.y * size); // Move parallel to CB
        p.vertex(x3 + cbUnitVec.x * size, y3 + cbUnitVec.y * size); // Move along CB
        p.endShape(p.CLOSE);
    }
}
        };
        
        // Method to calculate triangle vertices based on side lengths
        function calculateTriangleVertices() {
            // Get the numeric sides
            const a = that.numericSideA;
            const b = that.numericSideB;
            const c = that.numericSideC;
            
            console.log("Triangle sides for calculation:", a, b, c);
            
            // Check if triangle is valid using triangle inequality theorem
            const isValidTriangle = (a + b > c) && (a + c > b) && (b + c > a);
            
            if (!isValidTriangle) {
                console.warn("Invalid triangle: sides do not satisfy triangle inequality");
                // Create a default triangle as fallback
                x1 = 50;
                y1 = canvasHeight - 50;
                x2 = canvasWidth - 50;
                y2 = canvasHeight - 50;
                x3 = canvasWidth / 2;
                y3 = 50;
                rightAnglePosition = 0;
                return;
            }
            
            // Scale down the sides to fit in our canvas
            const maxSide = Math.max(a, b, c);
            // Use a larger scale factor to make the triangle bigger
            const scaleFactor = Math.min(canvasWidth, canvasHeight) * 0.7 / maxSide; 
            
            const scaledA = a * scaleFactor;
            const scaledB = b * scaleFactor;
            const scaledC = c * scaleFactor;
            
            // Set base position - center of the canvas with padding
            const centerX = canvasWidth / 2;
            const centerY = canvasHeight / 2; // Center vertically
            
            // Determine if it's a right triangle and which angle is right (if any)
            // Using Pythagorean theorem with a small tolerance for floating point errors
            const tolerance = 0.001 * maxSide * maxSide;
            const isRightAtA = Math.abs(b*b + c*c - a*a) < tolerance;
            const isRightAtB = Math.abs(a*a + c*c - b*b) < tolerance;
            const isRightAtC = Math.abs(a*a + b*b - c*c) < tolerance;
            
            const isRightTriangle = isRightAtA || isRightAtB || isRightAtC;
            console.log("Is right triangle:", isRightTriangle);
            console.log("Right angle positions - A:", isRightAtA, "B:", isRightAtB, "C:", isRightAtC);
            console.log("Triangle sides:", a, b, c);
            console.log("Pythagorean check: ", a*a, "+", b*b, "=", a*a+b*b, "vs c²=", c*c);
            
            // For right triangles, use exact geometry to ensure a perfect right angle
            if (isRightAtC) {
                // C has the right angle - construct a perfect right angle at C
                console.log("Drawing right triangle with right angle at C (top vertex)");
                
                // Position bottom side horizontally for clarity
                x1 = centerX - scaledA/2; // Left point of base
                y1 = centerY + 50; // Base is below center
                x2 = x1 + scaledA; // Right point of base (exact length A)
                y2 = y1; // Keep base horizontal
                x3 = x1; // Top vertex is directly above left base point
                y3 = y1 - scaledB; // Exactly height B up
                
                rightAnglePosition = 3; // C is at vertex 3 (top)
            } else if (isRightAtA) {
                // A has the right angle - construct a perfect right angle at A
                console.log("Drawing right triangle with right angle at A (bottom left)");
                
                // Position with right angle at bottom left
                x1 = centerX - scaledC/2; // Position A at left
                y1 = centerY + 50; // Position A below center
                x2 = x1 + scaledC; // B is exactly C units to the right
                y2 = y1; // B is at same height as A (horizontal)
                x3 = x1; // C is directly above A
                y3 = y1 - scaledB; // C is exactly B units up
                
                rightAnglePosition = 1; // A is at vertex 1 (bottom left)
            } else if (isRightAtB) {
                // B has the right angle - construct a perfect right angle at B
                console.log("Drawing right triangle with right angle at B (bottom right)");
                
                // Position with right angle at bottom right
                x1 = centerX - scaledC/2; // Position A at left
                y1 = centerY + 50; // Position A below center
                x2 = x1 + scaledC; // B is exactly C units to the right
                y2 = y1; // B is at same height as A (horizontal)
                x3 = x2; // C is directly above B
                y3 = y2 - scaledA; // C is exactly A units up
                
                rightAnglePosition = 2; // B is at vertex 2 (bottom right)
            } else {
                // Not a right triangle, use law of cosines to calculate angles
                console.log("Drawing non-right triangle");
                
                const cosA = (b*b + c*c - a*a) / (2 * b * c);
                const angleA = Math.acos(cosA);
                
                // Create triangle using two sides and the included angle
                x1 = centerX - scaledC/2;
                y1 = centerY + 40;
                x2 = x1 + scaledC;
                y2 = y1;
                // Use law of cosines to find the third vertex
                x3 = x1 + scaledB * Math.cos(angleA);
                y3 = y1 - scaledB * Math.sin(angleA);
                
                rightAnglePosition = 0; // No right angle
            }
            
            // Calculate side lengths for marker sizing - make these available at sketch level
            abLength = Math.sqrt((x2-x1)*(x2-x1) + (y2-y1)*(y2-y1));
            acLength = Math.sqrt((x3-x1)*(x3-x1) + (y3-y1)*(y3-y1));
            bcLength = Math.sqrt((x3-x2)*(x3-x2) + (y3-y2)*(y3-y2));
            
            console.log("Triangle side lengths in pixels:", abLength, acLength, bcLength);
            console.log("Right angle position:", rightAnglePosition);
            
            // Store triangle coordinates for label positioning
            that.triangleCoords = {
                x1, y1, x2, y2, x3, y3,
                canvasWidth, canvasHeight, 
                sideA: that.currentSideA,
                sideB: that.currentSideB,
                sideC: that.currentSideC,
                abLength, acLength, bcLength,
                rightAnglePosition
            };
        }
        
        // Define these functions directly on the p5sketch object instead
        p.showRightAngleMarker = function() {
            console.log("P5 Sketch: Showing right angle marker, position:", rightAnglePosition);
            showRightAngle = true;
            
            // Log triangle info for debugging
            console.log("Triangle vertices:", {x1, y1, x2, y2, x3, y3});
            console.log("Triangle side lengths:", {abLength, acLength, bcLength});
            
            p.redraw(); // Force redraw to show marker immediately
        };
        
        p.hideRightAngleMarker = function() {
            console.log("P5 Sketch: Hiding right angle marker");
            showRightAngle = false;
            p.redraw(); // Force redraw to hide marker immediately
        };
    });
}

createSideLabels(sideA, sideB, sideC) {
    // Wait until triangle coordinates are available
    if (!this.triangleCoords) {
        setTimeout(() => this.createSideLabels(sideA, sideB, sideC), 50);
        return;
    }
    
    // Create containers for the side labels (to make them draggable)
    const { x1, y1, x2, y2, x3, y3, canvasWidth, canvasHeight } = this.triangleCoords;
    
    // Remove previous labels if they exist
    if (this.sideALabel) this.sideALabel.remove();
    if (this.sideBLabel) this.sideBLabel.remove();
    if (this.sideCLabel) this.sideCLabel.remove();
    
    // Calculate vectors for sides
    const vectorAB = { x: x2 - x1, y: y2 - y1 };
    const vectorAC = { x: x3 - x1, y: y3 - y1 };
    const vectorBC = { x: x3 - x2, y: y3 - y2 };
    
    // Calculate side lengths (in pixels) for proportional offset
    const abLength = Math.sqrt(vectorAB.x * vectorAB.x + vectorAB.y * vectorAB.y);
    const acLength = Math.sqrt(vectorAC.x * vectorAC.x + vectorAC.y * vectorAC.y);
    const bcLength = Math.sqrt(vectorBC.x * vectorBC.x + vectorBC.y * vectorBC.y);
    
    // Calculate normalized perpendicular vectors (unit vectors)
    const abPerp = { x: -vectorAB.y / abLength, y: vectorAB.x / abLength };
    const acPerp = { x: -vectorAC.y / acLength, y: vectorAC.x / acLength };
    const bcPerp = { x: vectorBC.y / bcLength, y: -vectorBC.x / bcLength };
    
    // Distance to offset labels away from the sides (proportional to triangle size)
    const triangleSize = Math.min(abLength, acLength, bcLength);
    const offsetDistance = triangleSize * 0.6; // Increased from 0.4 to 0.6
    const minOffset = 70; // Increased from 50 to 70 pixels
    const offset = Math.max(offsetDistance, minOffset);
    
    // Analyze triangle orientation for better label placement
    const isBottomFlat = Math.abs(y1 - y2) < 10; // If bottom side is relatively flat
    const isLeftSideVertical = Math.abs(x1 - x3) < 10; // If left side is relatively vertical
    const isRightSideVertical = Math.abs(x2 - x3) < 10; // If right side is relatively vertical
    
    // Bottom side (AB/C) midpoint with smart offset
    let midAB = { 
        x: (x1 + x2) / 2,
        y: (y1 + y2) / 2 + offset * 1.1 // Always push bottom label down more
    };
    
    // Make sure bottom label is below the triangle
    if (midAB.y < Math.max(y1, y2, y3)) {
        midAB.y = Math.max(y1, y2, y3) + offset * 0.6;
    }
    
    // Left side (AC/B) midpoint with smart offset
    let midAC = {
        x: (x1 + x3) / 2 - offset * 0.9, // Push left label more to the left
        y: (y1 + y3) / 2
    };
    
    // Make sure left label is to the left of the triangle
    if (midAC.x > Math.min(x1, x2, x3)) {
        midAC.x = Math.min(x1, x2, x3) - offset * 0.6;
    }
    
    // Right side (BC/A) midpoint with smart offset
    let midBC = {
        x: (x2 + x3) / 2 + offset * 0.9, // Push right label more to the right
        y: (y2 + y3) / 2
    };
    
    // Make sure right label is to the right of the triangle
    if (midBC.x < Math.max(x1, x2, x3)) {
        midBC.x = Math.max(x1, x2, x3) + offset * 0.6;
    }
    
    // Adjust vertical positions to avoid label overlap
    // If the triangle is nearly equilateral, adjust the vertical positions
    const avgHeight = (midAC.y + midBC.y) / 2;
    if (Math.abs(midAC.y - midBC.y) < 30) {
        midAC.y = avgHeight - 30;
        midBC.y = avgHeight + 30;
    }
    
    // Bottom side (sideC)
    const bottomLabel = document.createElement('div');
    bottomLabel.className = 'side-label';
    bottomLabel.classList.add('value-box');
    bottomLabel.setAttribute('draggable', 'true');
    bottomLabel.setAttribute('id', 'side-c');
    bottomLabel.style.position = 'absolute';
    bottomLabel.style.left = `${midAB.x}px`;
    bottomLabel.style.top = `${midAB.y - 30}px`;
    bottomLabel.style.transform = 'translate(-50%, -50%)';
    bottomLabel.textContent = sideC;
    
    // Left side (sideA)
    const leftLabel = document.createElement('div');
    leftLabel.className = 'side-label';
    leftLabel.classList.add('value-box');
    leftLabel.setAttribute('draggable', 'true');
    leftLabel.setAttribute('id', 'side-a');
    leftLabel.style.position = 'absolute';
    leftLabel.style.left = `${midAC.x + 20}px`;
    leftLabel.style.top = `${midAC.y}px`;
    leftLabel.style.transform = 'translate(-50%, -50%)';
    leftLabel.textContent = sideA;
    
    // Right side (sideB)
    const rightLabel = document.createElement('div');
    rightLabel.className = 'side-label';
    rightLabel.classList.add('value-box');
    rightLabel.setAttribute('draggable', 'true');
    rightLabel.setAttribute('id', 'side-b');
    rightLabel.style.position = 'absolute';
    rightLabel.style.left = `${midBC.x}px`;
    rightLabel.style.top = `${midBC.y - 30}px`;
    rightLabel.style.transform = 'translate(-50%, -50%)';
    rightLabel.textContent = sideB;
    
    // Add labels to the display
    this.triangleDisplay.appendChild(bottomLabel);
    this.triangleDisplay.appendChild(leftLabel);
    this.triangleDisplay.appendChild(rightLabel);
    
    // Store references to the labels
    this.sideALabel = leftLabel;
    this.sideBLabel = rightLabel;
    this.sideCLabel = bottomLabel;
    
    // Initialize drag-and-drop functionality
    this.initDragAndDrop();
}

initDragAndDrop() {
    const draggableElements = [this.sideALabel, this.sideBLabel, this.sideCLabel].filter(el => el !== null);
    const dropTargets = [this.dropBoxA, this.dropBoxB, this.dropBoxC];
    
    // Track touch dragging state
    let touchDragElement = null;
    let touchDragData = null;
    let touchDragSourceId = null;
    let touchDragSourceType = null;
    let touchDragOriginalTriangleId = null;
    
    // Touch ghost element
    let ghostElement = null;



    // Track selected side label
    let selectedLabel = null;
    const highlightDropTargets = () => {
        dropTargets.forEach(target => {
            target.classList.add('select-highlight');
        });
    };
    const removeHighlightDropTargets = () => {
        dropTargets.forEach(target => {
            target.classList.remove('select-highlight');
        });
    };
    

// Enable click-to-select on triangle side labels
// draggableElements.forEach(label => {
//     label.addEventListener('click', () => {
//         // Only allow selection if not already used
//         if (label.getAttribute('draggable') === 'true') {
//             // Deselect previous
//             if (selectedLabel && selectedLabel !== label) {
//                 selectedLabel.classList.remove('selected-label');
//             }

//             // Toggle selection
//             if (selectedLabel === label) {
//                 selectedLabel.classList.remove('selected-label');
//                 selectedLabel = null;
//             } else {
//                 label.classList.add('selected-label');
//                 selectedLabel = label;
//             }
//         }
//     });
// });

// // Handle clicking a drop target to place the selected label
// dropTargets.forEach(dropTarget => {
//     dropTarget.addEventListener('click', () => {
//         if (selectedLabel) {
//             const data = selectedLabel.textContent;
//             const sourceId = selectedLabel.id;
//             const sourceType = 'triangle';

//             handleDrop(dropTarget, data, sourceId, sourceType);

//             // Clear selection
//             selectedLabel.classList.remove('selected-label');
//             selectedLabel = null;
//         }
//     });
// });

// Enable click or tap-to-select on triangle side labels
draggableElements.forEach(label => {
    const selectLabel = () => {
        if (label.getAttribute('draggable') === 'true') {
            if (selectedLabel && selectedLabel !== label) {
                selectedLabel.classList.remove('selected-label');
            }

            // Toggle selection
            if (selectedLabel === label) {
                selectedLabel.classList.remove('selected-label');
                selectedLabel = null;
                removeHighlightDropTargets();
            } else {
                label.classList.add('selected-label');
                selectedLabel = label;
                highlightDropTargets();
            }
        }

    
    };

    label.addEventListener('click', selectLabel);
    label.addEventListener('touchend', (e) => {
        e.preventDefault();
        selectLabel();
    });
});

// Handle click or tap to place selected value into a drop box
dropTargets.forEach(dropTarget => {
    const placeSelectedLabel = () => {
        if (selectedLabel) {
            const data = selectedLabel.textContent;
            const sourceId = selectedLabel.id;
            const sourceType = 'triangle';

            handleDrop(dropTarget, data, sourceId, sourceType);

            selectedLabel.classList.remove('selected-label');
            selectedLabel = null;
            removeHighlightDropTargets();
        }
    };

    dropTarget.addEventListener('click', placeSelectedLabel);
    dropTarget.addEventListener('touchend', (e) => {
        e.preventDefault();
        placeSelectedLabel();
    });
});



    
    // Create indicator for correct/incorrect equation
    if (!this.equationIndicator) {
        this.equationIndicator = document.createElement('div');
        this.equationIndicator.className = 'equation-indicator';
        this.equationIndicator.style.position = 'absolute';
        this.equationIndicator.style.left = '5%';
        this.equationIndicator.style.bottom = '2%';
        this.equationIndicator.style.transform = 'translateY(-50%)';
        this.equationIndicator.style.fontSize = '220%';
        this.equationIndicator.style.fontWeight = 'bold';
        
        // Add the indicator to the formula container
        const formulaElement = document.querySelector('.formula');
        if (formulaElement) {
            formulaElement.style.position = 'relative';
            formulaElement.appendChild(this.equationIndicator);
        }
    }
    
    // Create and position ghost element for touch dragging
    const createGhostElement = (element, x, y) => {
        // Remove any existing ghost
        removeGhostElement();
        
        // Create ghost element
        ghostElement = document.createElement('div');
        ghostElement.className = 'drag-ghost';
        ghostElement.textContent = element.textContent;
        
        // Copy relevant styles from the original element
        const computedStyle = window.getComputedStyle(element);
        ghostElement.style.backgroundColor = computedStyle.backgroundColor;
        ghostElement.style.color = computedStyle.color;
        ghostElement.style.padding = computedStyle.padding;
        ghostElement.style.border = computedStyle.border;
        ghostElement.style.borderRadius = computedStyle.borderRadius;
        ghostElement.style.fontSize = computedStyle.fontSize;
        ghostElement.style.fontWeight = computedStyle.fontWeight;
        ghostElement.style.width = element.offsetWidth + 'px';
        ghostElement.style.textAlign = 'center';
        
        // Position absolutely with fixed styles
        ghostElement.style.position = 'fixed';
        ghostElement.style.zIndex = '9999';
        ghostElement.style.pointerEvents = 'none'; // Don't interfere with touch events
        ghostElement.style.opacity = '0.8';
        ghostElement.style.boxShadow = '0 4px 10px rgba(0,0,0,0.3)';
        
        // Position at touch point with offset so finger doesn't obscure it
        updateGhostPosition(x, y);
        
        // Add to document body
        document.body.appendChild(ghostElement);








    };
    
    // Update ghost element position
    const updateGhostPosition = (x, y) => {
        if (!ghostElement) return;
        
        // Position above the finger by default
        ghostElement.style.left = (x - 30) + 'px';
        ghostElement.style.top = (y - 20) + 'px'; // Position above finger
    };
    
    // Remove ghost element
    const removeGhostElement = () => {
        if (ghostElement && ghostElement.parentNode) {
            ghostElement.parentNode.removeChild(ghostElement);
            ghostElement = null;
        }
    };
    
    // Helper function to handle start of drag (mouse or touch)
    const handleDragStart = (element, dataTransfer = null, isTouchEvent = false, touchX = 0, touchY = 0) => {
        // Store data about the dragged element
        const data = element.textContent;
        const sourceId = element.id;
        const sourceType = element.classList.contains('drop-box') ? 'box' : 'triangle';
        
        if (dataTransfer) {
            // For mouse events with dataTransfer
            dataTransfer.setData('text/plain', data);
            dataTransfer.setData('source-id', sourceId);
            dataTransfer.setData('source-type', sourceType);
            
            // For box-to-box drags, track original triangle ID
            if (sourceType === 'box') {
                const originalTriangleId = element.getAttribute('data-source-id');
                if (originalTriangleId) {
                    dataTransfer.setData('original-triangle-id', originalTriangleId);
                }
            }
        } else if (isTouchEvent) {
            // For touch events, store in global variables
            touchDragData = data;
            touchDragSourceId = sourceId;
            touchDragSourceType = sourceType;
            touchDragElement = element;
            
            if (sourceType === 'box') {
                touchDragOriginalTriangleId = element.getAttribute('data-source-id');
            }
            
            // Create ghost element for touch dragging
            createGhostElement(element, touchX, touchY);
        }
        
        element.classList.add('dragging');
        
        // Show dragging effect and remove background
        setTimeout(() => {
            element.style.opacity = '0.4';
            if (sourceType === 'triangle') {
                element.style.backgroundColor = 'transparent';
                element.style.borderColor = 'transparent';
            }
        }, 0);
    };
    
    // Helper function to handle end of drag (mouse or touch)
    const handleDragEnd = (element, sourceType) => {
        element.classList.remove('dragging');
        element.style.opacity = '1';
        
        if (sourceType === 'triangle') {
            // Only reapply background if it wasn't dropped in a drop box
            const dropBoxElements = Array.from(document.querySelectorAll('.drop-box'));
            const wasDropped = dropBoxElements.some(box => 
                box.getAttribute('data-source-id') === element.id && 
                box.getAttribute('data-filled') === 'true');
            
            if (!wasDropped) {
                // Reapply background if not dropped in a drop box
                element.style.backgroundColor = '#e9ecef';
                element.style.borderColor = '#ced4da';
            }
        }
        
        // Remove ghost element
        removeGhostElement();
        
        // Reset touch dragging state
        touchDragElement = null;
        touchDragData = null;
        touchDragSourceId = null;
        touchDragSourceType = null;
        touchDragOriginalTriangleId = null;
    };
    
    // Helper function to handle drop
    const handleDrop = (dropTarget, data, sourceId, sourceType, originalTriangleId = null) => {
        // If this is a box-to-box drag and the target is already filled
        if (sourceType === 'box' && 
            sourceId !== dropTarget.id && 
            dropTarget.getAttribute('data-filled') === 'true') {
            
            console.log("Box-to-box replacement scenario");
            
            // Get the source box
            const sourceBox = document.getElementById(sourceId);
            if (!sourceBox) {
                console.error("Source box not found");
                return;
            }
            
            // Get information about the target box's current value
            const targetValue = dropTarget.textContent;
            const targetOriginalTriangleId = dropTarget.getAttribute('data-source-id');
            
            // Get information about the source box
            const originalSourceTriangleId = sourceBox.getAttribute('data-source-id') || originalTriangleId;
            
            // Return the displaced value to its original triangle side
            if (targetOriginalTriangleId) {
                const triangleSide = document.getElementById(targetOriginalTriangleId);
                if (triangleSide) {
                    // Restore the triangle side
                    triangleSide.setAttribute('draggable', 'true');
                    triangleSide.style.cursor = 'grab';
                    triangleSide.style.opacity = '1';
                    triangleSide.classList.remove('used');
                    triangleSide.style.backgroundColor = '#e9ecef';
                    triangleSide.style.borderColor = '#ced4da';
                    
                    // Visual confirmation of return
                    triangleSide.classList.add('pulse');
                    setTimeout(() => {
                        triangleSide.classList.remove('pulse');
                    }, 800);
                }
            }
            
            // Clear the source box
            sourceBox.textContent = '';
            sourceBox.classList.remove('filled');
            sourceBox.removeAttribute('data-filled');
            sourceBox.removeAttribute('data-source-id');
            sourceBox.removeAttribute('data-value');
            
            // Notify controller about clearing the source
            if (this.onClear) {
                const sourcePosition = sourceId.replace('drop-', '');
                this.onClear(sourcePosition);
            }
            
            // Fill the target box with the dragged value
            dropTarget.textContent = data;
            dropTarget.setAttribute('data-value', data);
            dropTarget.setAttribute('data-filled', 'true');
            
            // Use the original triangle side ID from the source box
            if (originalSourceTriangleId) {
                dropTarget.setAttribute('data-source-id', originalSourceTriangleId);
            }
            
            // Notify controller about the target box update
            if (this.onDrop) {
                const targetPosition = dropTarget.id.replace('drop-', '');
                const isComplete = this.onDrop(targetPosition, data);
                
                // If all boxes are filled, check if the user wants to show hint
                if (isComplete && this.onCheckComplete) {
                    this.onCheckComplete();
                }
            }
            
            // Visual feedback for successful move
            dropTarget.classList.add('pulse');
            setTimeout(() => {
                dropTarget.classList.remove('pulse');
            }, 800);
            
            return;
        }
        
        // Don't allow dropping if already filled with a different value
        if (dropTarget.getAttribute('data-filled') === 'true' && 
            dropTarget.getAttribute('data-source-id') !== sourceId) {
            console.log("Target already filled with different value - drop rejected");
            return;
        }

        // If the source is another drop box, clear the source box
        if (sourceType === 'box' && sourceId !== dropTarget.id) {
            const sourceBox = document.getElementById(sourceId);
            if (sourceBox) {
                // Get original source triangle ID before clearing
                const originalSourceTriangleId = sourceBox.getAttribute('data-source-id') || originalTriangleId;
                
                // Clear the source drop box
                sourceBox.textContent = '';
                sourceBox.classList.remove('filled');
                sourceBox.removeAttribute('data-filled');
                sourceBox.removeAttribute('data-source-id');
                sourceBox.removeAttribute('data-value');
                
                // Notify controller about clearing the source
                if (this.onClear) {
                    const sourcePosition = sourceId.replace('drop-', '');
                    this.onClear(sourcePosition);
                }
                
                // Use the original triangle side ID when filling the target
                if (originalSourceTriangleId) {
                    dropTarget.setAttribute('data-source-id', originalSourceTriangleId);
                }
            }
        } else {
            // If coming directly from triangle, use the source ID from the triangle
            dropTarget.setAttribute('data-source-id', sourceId);
        }
        
        // Fill the drop target
        dropTarget.textContent = data;
        dropTarget.classList.add('filled');
        dropTarget.setAttribute('data-filled', 'true');
        dropTarget.setAttribute('data-value', data);
        
        // If dropped from a triangle side, make the triangle side non-draggable
        if (sourceType === 'triangle') {
            const originalTriangle = document.getElementById(sourceId);
            if (originalTriangle) {
                originalTriangle.setAttribute('draggable', 'false');
                originalTriangle.style.cursor = 'default';
                originalTriangle.style.opacity = '0.5';
                originalTriangle.classList.add('used');
            }
        }
        
        // Trigger the controller event
        if (this.onDrop) {
            const isComplete = this.onDrop(dropTarget.id.replace('drop-', ''), data);
            
            // If all boxes are filled, check if the user wants to show hint
            if (isComplete && this.onCheckComplete) {
                this.onCheckComplete();
            }
        }
        
        // Visual feedback for successful drop
        dropTarget.classList.add('pulse');
        setTimeout(() => {
            dropTarget.classList.remove('pulse');
        }, 800);
    };
    
    // Helper function to handle returning a value to its triangle
    const handleReturnToTriangle = (triangleLabel, dropBoxId) => {
        const dropBox = document.getElementById(dropBoxId);
        if (dropBox) {
            // Clear the drop box
            dropBox.textContent = '';
            dropBox.classList.remove('filled');
            dropBox.removeAttribute('data-filled');
            dropBox.removeAttribute('data-source-id');
            dropBox.removeAttribute('data-value');
            
            // Notify controller
            const position = dropBoxId.replace('drop-', '');
            if (this.onClear) {
                this.onClear(position);
            }
            
            // Reapply background when dropped back to triangle
            triangleLabel.style.backgroundColor = '#e9ecef';
            triangleLabel.style.borderColor = '#ced4da';
            
            // Make triangle side draggable again
            triangleLabel.setAttribute('draggable', 'true');
            triangleLabel.style.cursor = 'grab';
            triangleLabel.style.opacity = '1';
            triangleLabel.classList.remove('used');
            
            // Visual confirmation that the value returned
            triangleLabel.classList.add('pulse');
            setTimeout(() => {
                triangleLabel.classList.remove('pulse');
            }, 800);
        }
    };
    
    // Make all triangle sides draggable with visual effects
    draggableElements.forEach(element => {
        // Make it more obvious these are draggable
        element.style.cursor = 'grab';
        
        // Mouse events
        element.addEventListener('dragstart', (e) => {
            handleDragStart(element, e.dataTransfer);
        });
        
        element.addEventListener('dragend', () => {
            handleDragEnd(element, 'triangle');
        });
        
        // Touch events
        element.addEventListener('touchstart', (e) => {
            if (element.getAttribute('draggable') === 'false') return;
            
            const touch = e.touches[0];
            handleDragStart(element, null, true, touch.clientX, touch.clientY);
            e.preventDefault(); // Prevent default only for touchstart
        }, { passive: false });
        
        element.addEventListener('touchmove', (e) => {
            if (!touchDragElement) return;
            e.preventDefault(); // Prevent scrolling during drag
            
            const touch = e.touches[0];
            // Update ghost element position
            updateGhostPosition(touch.clientX, touch.clientY);
            
            const elementsAtPoint = document.elementsFromPoint(touch.clientX, touch.clientY);
            
            // Highlight drop targets under finger
            dropTargets.forEach(target => {
                if (elementsAtPoint.includes(target)) {
                    target.classList.add('highlight');
                } else {
                    target.classList.remove('highlight');
                }
            });
            
            // Highlight triangle labels for returning values
            if (touchDragSourceType === 'box') {
                draggableElements.forEach(triangleLabel => {
                    if (elementsAtPoint.includes(triangleLabel) && 
                        triangleLabel.id === touchDragOriginalTriangleId) {
                        triangleLabel.classList.add('highlight');
                    } else {
                        triangleLabel.classList.remove('highlight');
                    }
                });
            }
        }, { passive: false });
        
        element.addEventListener('touchend', (e) => {
            if (!touchDragElement) return;
            
            const touch = e.changedTouches[0];
            const elementsAtPoint = document.elementsFromPoint(touch.clientX, touch.clientY);
            
            // Check if we're over any drop target
            for (const target of dropTargets) {
                if (elementsAtPoint.includes(target)) {
                    // Similar to drop event
                    handleDrop(target, touchDragData, touchDragSourceId, touchDragSourceType, touchDragOriginalTriangleId);
                    break;
                }
            }
            
            // Remove all highlights
            document.querySelectorAll('.highlight').forEach(el => el.classList.remove('highlight'));
            
            handleDragEnd(element, 'triangle');
        });
        
        // Add hover effects
        element.addEventListener('mouseover', () => {
            element.style.boxShadow = '0 0 8px rgba(0, 123, 255, 0.7)';
        });
        
        element.addEventListener('mouseout', () => {
            element.style.boxShadow = 'none';
        });
    });
    
    // Make all drop boxes draggable (when they contain values)
    dropTargets.forEach(dropTarget => {
        dropTarget.setAttribute('draggable', 'true');
        
        // Mouse events
        dropTarget.addEventListener('dragstart', (e) => {
            // Only allow dragging if the box has a value
            if (dropTarget.getAttribute('data-filled') !== 'true') {
                e.preventDefault();
                return;
            }
            
            handleDragStart(dropTarget, e.dataTransfer);
        });
        
        dropTarget.addEventListener('dragend', () => {
            handleDragEnd(dropTarget, 'box');
        });
        
        // Touch events
        dropTarget.addEventListener('touchstart', (e) => {
            // Only allow dragging if the box has a value
            if (dropTarget.getAttribute('data-filled') !== 'true') {
                return;
            }
            
            const touch = e.touches[0];
            handleDragStart(dropTarget, null, true, touch.clientX, touch.clientY);
            e.preventDefault(); // Prevent scrolling when starting drag
        }, { passive: false });
        
        dropTarget.addEventListener('touchmove', (e) => {
            if (!touchDragElement) return;
            e.preventDefault(); // Prevent scrolling during drag
            
            const touch = e.touches[0];
            // Update ghost element position
            updateGhostPosition(touch.clientX, touch.clientY);
            
            const elementsAtPoint = document.elementsFromPoint(touch.clientX, touch.clientY);
            
            // Highlight drop targets under finger
            dropTargets.forEach(target => {
                if (elementsAtPoint.includes(target)) {
                    target.classList.add('highlight');
                } else {
                    target.classList.remove('highlight');
                }
            });
            
            // Highlight triangle labels for returning values
            if (touchDragSourceType === 'box') {
                draggableElements.forEach(triangleLabel => {
                    if (elementsAtPoint.includes(triangleLabel) && 
                        triangleLabel.id === touchDragOriginalTriangleId) {
                        triangleLabel.classList.add('highlight');
                    } else {
                        triangleLabel.classList.remove('highlight');
                    }
                });
            }
        }, { passive: false });
        
        dropTarget.addEventListener('touchend', (e) => {
            if (!touchDragElement) return;
            
            const touch = e.changedTouches[0];
            const elementsAtPoint = document.elementsFromPoint(touch.clientX, touch.clientY);
            
            // Check if touch ended over another drop target
            let droppedOnTarget = false;
            for (const target of dropTargets) {
                if (elementsAtPoint.includes(target) && target !== touchDragElement) {
                    // Similar to drop event
                    handleDrop(target, touchDragData, touchDragSourceId, touchDragSourceType, touchDragOriginalTriangleId);
                    droppedOnTarget = true;
                    break;
                }
            }
            
            // Check if we're returning to original triangle side
            if (!droppedOnTarget && touchDragSourceType === 'box') {
                for (const triangle of draggableElements) {
                    if (elementsAtPoint.includes(triangle) && 
                        triangle.id === touchDragOriginalTriangleId) {
                        // Similar to drop on triangle
                        handleReturnToTriangle(triangle, touchDragSourceId);
                        break;
                    }
                }
            }
            
            // Remove all highlights
            document.querySelectorAll('.highlight').forEach(el => el.classList.remove('highlight'));
            
            handleDragEnd(dropTarget, 'box');
        });
        
        // Add hover effects for filled boxes
        dropTarget.addEventListener('mouseover', () => {
            if (dropTarget.getAttribute('data-filled') === 'true') {
                dropTarget.style.cursor = 'grab';
                dropTarget.style.boxShadow = '0 0 8px rgba(0, 123, 255, 0.7)';
            }
        });
        
        dropTarget.addEventListener('mouseout', () => {
            dropTarget.style.boxShadow = 'none';
        });
        
        // Double tap detection for touch devices
        let lastTap = 0;
        dropTarget.addEventListener('touchend', (e) => {
            const currentTime = new Date().getTime();
            const tapLength = currentTime - lastTap;
            
            if (tapLength < 500 && tapLength > 0) {
                // Double tap detected
                if (dropTarget.getAttribute('data-filled') === 'true') {
                    const originalTriangleId = dropTarget.getAttribute('data-source-id');
                    
                    // Find the original triangle element
                    const originalTriangle = document.getElementById(originalTriangleId);
                    
                    // Clear the drop box
                    dropTarget.textContent = '';
                    dropTarget.classList.remove('filled');
                    dropTarget.removeAttribute('data-filled');
                    dropTarget.removeAttribute('data-source-id');
                    dropTarget.removeAttribute('data-value');
                    
                    // Highlight the original triangle element and reapply background
                    if (originalTriangle) {
                        originalTriangle.style.backgroundColor = '#e9ecef';
                        originalTriangle.style.borderColor = '#ced4da';
                        
                        // Make triangle side draggable again
                        originalTriangle.setAttribute('draggable', 'true');
                        originalTriangle.style.cursor = 'grab';
                        originalTriangle.style.opacity = '1';
                        originalTriangle.classList.remove('used');
                        
                        originalTriangle.classList.add('pulse');
                        setTimeout(() => {
                            originalTriangle.classList.remove('pulse');
                        }, 800);
                    }
                    
                    // Notify controller
                    if (this.onClear) {
                        this.onClear(dropTarget.id.replace('drop-', ''));
                    }
                }
                e.preventDefault();
            }
            lastTap = currentTime;
        });
    });
    
    // Configure triangle labels as drop targets (for returning from boxes)
    draggableElements.forEach(triangleLabel => {
        // Mouse events
        triangleLabel.addEventListener('dragover', (e) => {
            // We can't use getData during dragover, so we check if the right type is being transferred
            if (e.dataTransfer.types.includes('original-triangle-id')) {
                e.preventDefault();  // Allow drop
                triangleLabel.classList.add('highlight');
            }
        });
        
        triangleLabel.addEventListener('dragleave', () => {
            triangleLabel.classList.remove('highlight');
        });
        
        triangleLabel.addEventListener('drop', (e) => {
            e.preventDefault();
            triangleLabel.classList.remove('highlight');
            
            const originalTriangleId = e.dataTransfer.getData('original-triangle-id');
            const sourceId = e.dataTransfer.getData('source-id');
            const sourceType = e.dataTransfer.getData('source-type');
            
            // Only allow drops if this is the original triangle side
            if (sourceType === 'box' && originalTriangleId === triangleLabel.id) {
                handleReturnToTriangle(triangleLabel, sourceId);
            }
        });
    });
    
    // Configure drop boxes as targets for triangle sides
    dropTargets.forEach(dropTarget => {
        // Mouse events
        dropTarget.addEventListener('dragover', (e) => {
            e.preventDefault();  // Allow the drop
            dropTarget.classList.add('highlight');
        });
        
        dropTarget.addEventListener('dragleave', () => {
            dropTarget.classList.remove('highlight');
        });
        
        dropTarget.addEventListener('drop', (e) => {
            e.preventDefault();
            dropTarget.classList.remove('highlight');
            
            const data = e.dataTransfer.getData('text/plain');
            const sourceId = e.dataTransfer.getData('source-id');
            const sourceType = e.dataTransfer.getData('source-type');
            const originalTriangleId = e.dataTransfer.getData('original-triangle-id') || null;
            
            handleDrop(dropTarget, data, sourceId, sourceType, originalTriangleId);
        });
        
        // Double-click to return value to triangle
        dropTarget.addEventListener('dblclick', () => {
            if (dropTarget.getAttribute('data-filled') === 'true') {
                const originalTriangleId = dropTarget.getAttribute('data-source-id');
                
                // Find the original triangle element
                const originalTriangle = document.getElementById(originalTriangleId);
                
                // Clear the drop box
                dropTarget.textContent = '';
                dropTarget.classList.remove('filled');
                dropTarget.removeAttribute('data-filled');
                dropTarget.removeAttribute('data-source-id');
                dropTarget.removeAttribute('data-value');
                
                // Highlight the original triangle element and reapply background
                if (originalTriangle) {
                    originalTriangle.style.backgroundColor = '#e9ecef';
                    originalTriangle.style.borderColor = '#ced4da';
                    
                    // Make triangle side draggable again
                    originalTriangle.setAttribute('draggable', 'true');
                    originalTriangle.style.cursor = 'grab';
                    originalTriangle.style.opacity = '1';
                    originalTriangle.classList.remove('used');
                    
                    originalTriangle.classList.add('pulse');
                    setTimeout(() => {
                        originalTriangle.classList.remove('pulse');
                    }, 800);
                }
                
                // Notify controller
                if (this.onClear) {
                    this.onClear(dropTarget.id.replace('drop-', ''));
                }
            }
        });
    });
    
    // Add touch-specific CSS for better touch UX
    const style = document.createElement('style');
    style.textContent = `
        @media (pointer: coarse) {
            .drop-box, [draggable=true] {
                -webkit-tap-highlight-color: rgba(0, 123, 255, 0.2);
            }
            .dragging {
                transform: scale(1.1);
                transition: transform 0.2s;
            }
        }
        
        .drag-ghost {
            background-color: #f8f9fa;
            border: 2px solid #007bff;
            border-radius: 4px;
            padding: 4px 8px;
            transition: all 0.1s ease;
            animation: ghost-pulse 1.5s infinite;
        }
        
        @keyframes ghost-pulse {
            0% { box-shadow: 0 0 0 rgba(0, 123, 255, 0.4); }
            50% { box-shadow: 0 0 10px rgba(0, 123, 255, 0.7); }
            100% { box-shadow: 0 0 0 rgba(0, 123, 255, 0.4); }
        }
        
        .highlight {
            outline: 2px solid #007bff;
            box-shadow: 0 0 8px rgba(0, 123, 255, 0.7);
        }
        
        .pulse {
            animation: pulse-animation 0.8s ease-in-out;
        }
        
        @keyframes pulse-animation {
            0% { transform: scale(1); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }
    `;
    document.head.appendChild(style);
}

// Set up callback for drag and drop events
setOnDrop(callback) {
    this.onDrop = callback;
}

// Set up callback for clearing drop targets
setOnClear(callback) {
    this.onClear = callback;
}

// Set up callback for button clicks
setOnCheck(callback) {
    this.checkButton.addEventListener('click', callback);
}

setOnNotRight(callback) {
    this.notRightButton.addEventListener('click', callback);
}

setOnNewProblem(callback) {
    this.newProblemButton.addEventListener('click', callback);

    
}

// Set up callback for try again button
setOnTryAgain(callback) {
    this.onTryAgain = callback;
}

// Set up callback for when all boxes are filled
setOnCheckComplete(callback) {
    this.onCheckComplete = callback;
}

// Show calculation steps
showCalculation(steps) {
    this.calculationResult.style.display = 'block';
    this.calculationResult.innerHTML = '';
    steps.forEach(step => {
        const stepElement = document.createElement('div');
        stepElement.textContent = step;
        this.calculationResult.appendChild(stepElement);
    });
}

// Show feedback
showFeedback(isCorrect, message) {
    console.log(message);
    this.feedbackElement.textContent = message || (isCorrect ? 'Correct!' : 'Incorrect. Try again!');
    this.feedbackElement.style.color = isCorrect ? '#2b8a3e' : '#c92a2a';
    this.feedbackElement.style.textAlign = 'center';
    // Highlight the correct button
    if (isCorrect) {
        if (message.includes('This is a right triangle')) {
            this.checkButton.classList.add('correct');
            this.notRightButton.classList.remove('correct');
        } else {
            this.notRightButton.classList.add('correct');
            this.checkButton.classList.remove('correct');
        }
    } else {
        this.checkButton.classList.remove('correct');
        this.notRightButton.classList.remove('correct');
    }
}

// Clear feedback
clearFeedback() {
    this.feedbackElement.textContent = '';
    this.checkButton.classList.remove('correct');
    this.notRightButton.classList.remove('correct');
}

// Clear calculation
clearCalculation() {
    this.calculationResult.innerHTML = '';
    this.calculationResult.style.display = 'none';
}

// Update correct count
updateCorrectCount(count) {
    this.correctCountElement.textContent = count;
}

// Show hint section
showHint(triesLeft) {
    this.hintContainer.classList.add('visible');
    this.triesLeftElement.textContent = triesLeft;
}

// Hide hint section
hideHint() {
    this.hintContainer.classList.remove('visible');
}

// Reset UI for a new problem
// Reset UI for a new problem
resetUI() {
    console.log("Resetting UI for new problem");
    
    // Hide right angle marker
    this.hideRightAngleMarker();
    
    // Hide equation indicator
    this.hideEquationIndicator();
    
    // Clear drop boxes
    [this.dropBoxA, this.dropBoxB, this.dropBoxC].forEach(box => {
        box.textContent = '';
        box.classList.remove('filled');
        box.removeAttribute('data-filled');
        box.removeAttribute('data-source-id');
        box.removeAttribute('data-value');
        
        // Ensure drop boxes are draggable and interactive
        box.setAttribute('draggable', 'true');
        box.style.cursor = 'move';
        box.style.pointerEvents = 'auto';
    });
    
    // Reset triangle sides to be draggable if they exist
    const triangleSides = [this.sideALabel, this.sideBLabel, this.sideCLabel];
    triangleSides.forEach(side => {
        if (side) {
            side.setAttribute('draggable', 'true');
            side.style.cursor = 'grab';
            side.style.opacity = '1';
            side.classList.remove('used');
            side.style.backgroundColor = '#e9ecef';
            side.style.borderColor = '#ced4da';
            side.style.pointerEvents = 'auto';
        }
    });
    
    // Re-enable answer buttons
    this.checkButton.disabled = false;
    this.notRightButton.disabled = false;
    this.checkButton.style.opacity = '1';
    this.notRightButton.style.opacity = '1';
    this.checkButton.style.cursor = 'pointer';
    this.notRightButton.style.cursor = 'pointer';
    
    // Clear feedback and calculation
    this.clearFeedback();
    this.clearCalculation();
    
    // Hide hint
    this.hideHint();
}


// Enable the New Problem button
enableNewProblemButton() {
    this.newProblemButton.disabled = false;
    this.newProblemButton.style.opacity = '1';
    this.newProblemButton.style.cursor = 'pointer';
}

// Disable the New Problem button
disableNewProblemButton() {
    this.newProblemButton.disabled = true;
    this.newProblemButton.style.opacity = '0.5';
    this.newProblemButton.style.cursor = 'not-allowed';
}

// Add methods to show/hide the equation indicator
showEquationCorrect() {
    if (this.equationIndicator) {
        this.equationIndicator.textContent = '✓';
        this.equationIndicator.style.color = '#2b8a3e'; // Green color
        this.equationIndicator.style.display = 'block';
    }
}

showEquationIncorrect() {
    if (this.equationIndicator) {
        this.equationIndicator.textContent = '✗';
        this.equationIndicator.style.color = '#c92a2a'; // Red color
        this.equationIndicator.style.display = 'block';
    }
}

hideEquationIndicator() {
    if (this.equationIndicator) {
        this.equationIndicator.style.display = 'none';
    }
}

// Method to show right angle marker when correct
showRightAngleMarker() {
    console.log("View: Showing right angle marker");
    if (this.p5sketch && this.p5sketch.showRightAngleMarker) {
        this.p5sketch.showRightAngleMarker();
    } else {
        console.error("p5sketch or showRightAngleMarker method not available:", this.p5sketch);
    }
}

// Method to hide right angle marker
hideRightAngleMarker() {
    console.log("View: Hiding right angle marker");
    if (this.p5sketch && this.p5sketch.hideRightAngleMarker) {
        this.p5sketch.hideRightAngleMarker();
    } else {
        console.error("p5sketch or hideRightAngleMarker method not available:", this.p5sketch);
    }
}

// Method to disable dragging of triangle side labels
disableDragging() {
    const triangleSides = [this.sideALabel, this.sideBLabel, this.sideCLabel];
    triangleSides.forEach(side => {
        if (side) {
            side.setAttribute('draggable', 'false');
            side.style.cursor = 'default';
            side.style.pointerEvents = 'none'; // Prevent all interactions
        }
    });
    
    // Also disable drop zones
    const dropBoxes = [this.dropBoxA, this.dropBoxB, this.dropBoxC];
    dropBoxes.forEach(box => {
        box.setAttribute('draggable', 'false');
        box.style.cursor = 'default';
        box.style.pointerEvents = 'none'; // Prevent all interactions
    });
}

// Method to disable answer buttons
disableAnswerButtons() {
    this.checkButton.disabled = true;
    this.notRightButton.disabled = true;
    this.checkButton.style.opacity = '0.5';
    this.notRightButton.style.opacity = '0.5';
    this.checkButton.style.cursor = 'not-allowed';
    this.notRightButton.style.cursor = 'not-allowed';
}


// Add this method to the PythagoreanView class
createInstructionalHeadings() {
    // Create heading for triangle side labels
    const triangleHeading = document.createElement('div');
    triangleHeading.className = 'instruction-heading triangle-instruction';
    triangleHeading.innerHTML = '← Drag to place';
    triangleHeading.style.position = 'absolute';
    triangleHeading.style.fontSize = '16px';
    triangleHeading.style.color = '#6f42c1'; // Purple color to match triangle
    triangleHeading.style.fontWeight = '500';
    triangleHeading.style.pointerEvents = 'none';
    triangleHeading.style.zIndex = '10';
    triangleHeading.style.whiteSpace = 'nowrap'; // Prevent text wrapping
    
    // Position it near the triangle (will be adjusted after triangle is drawn)
    triangleHeading.style.left = '60%';
    triangleHeading.style.top = '40%';
    
    // Add to triangle display container
    this.triangleDisplay.appendChild(triangleHeading);
    this.triangleInstruction = triangleHeading;
    
    
}

// Update createSideLabels method to position the triangle instruction better
createSideLabels(sideA, sideB, sideC) {
    // Wait until triangle coordinates are available
    if (!this.triangleCoords) {
        setTimeout(() => this.createSideLabels(sideA, sideB, sideC), 50);
        return;
    }
    
    // Create containers for the side labels (to make them draggable)
    const { x1, y1, x2, y2, x3, y3, canvasWidth, canvasHeight } = this.triangleCoords;
    
    // Remove previous labels if they exist
    if (this.sideALabel) this.sideALabel.remove();
    if (this.sideBLabel) this.sideBLabel.remove();
    if (this.sideCLabel) this.sideCLabel.remove();
    
    // Calculate vectors for sides
    const vectorAB = { x: x2 - x1, y: y2 - y1 };
    const vectorAC = { x: x3 - x1, y: y3 - y1 };
    const vectorBC = { x: x3 - x2, y: y3 - y2 };
    
    // Calculate side lengths (in pixels) for proportional offset
    const abLength = Math.sqrt(vectorAB.x * vectorAB.x + vectorAB.y * vectorAB.y);
    const acLength = Math.sqrt(vectorAC.x * vectorAC.x + vectorAC.y * vectorAC.y);
    const bcLength = Math.sqrt(vectorBC.x * vectorBC.x + vectorBC.y * vectorBC.y);
    
    // Calculate normalized perpendicular vectors (unit vectors)
    const abPerp = { x: -vectorAB.y / abLength, y: vectorAB.x / abLength };
    const acPerp = { x: -vectorAC.y / acLength, y: vectorAC.x / acLength };
    const bcPerp = { x: vectorBC.y / bcLength, y: -vectorBC.x / bcLength };
    
    // Distance to offset labels away from the sides (proportional to triangle size)
    const triangleSize = Math.min(abLength, acLength, bcLength);
    const offsetDistance = triangleSize * 0.6; // Increased from 0.4 to 0.6
    const minOffset = 70; // Increased from 50 to 70 pixels
    const offset = Math.max(offsetDistance, minOffset);
    
    // Analyze triangle orientation for better label placement
    const isBottomFlat = Math.abs(y1 - y2) < 10; // If bottom side is relatively flat
    const isLeftSideVertical = Math.abs(x1 - x3) < 10; // If left side is relatively vertical
    const isRightSideVertical = Math.abs(x2 - x3) < 10; // If right side is relatively vertical
    
    // Bottom side (AB/C) midpoint with smart offset
    let midAB = { 
        x: (x1 + x2) / 2,
        y: (y1 + y2) / 2 + offset * 1.1 // Always push bottom label down more
    };
    
    // Make sure bottom label is below the triangle
    if (midAB.y < Math.max(y1, y2, y3)) {
        midAB.y = Math.max(y1, y2, y3) + offset * 0.6;
    }
    
    // Left side (AC/B) midpoint with smart offset
    let midAC = {
        x: (x1 + x3) / 2 - offset * 0.9, // Push left label more to the left
        y: (y1 + y3) / 2
    };
    
    // Make sure left label is to the left of the triangle
    if (midAC.x > Math.min(x1, x2, x3)) {
        midAC.x = Math.min(x1, x2, x3) - offset * 0.6;
    }
    
    // Right side (BC/A) midpoint with smart offset
    let midBC = {
        x: (x2 + x3) / 2 + offset * 0.9, // Push right label more to the right
        y: (y2 + y3) / 2
    };
    
    // Make sure right label is to the right of the triangle
    if (midBC.x < Math.max(x1, x2, x3)) {
        midBC.x = Math.max(x1, x2, x3) + offset * 0.6;
    }
    
    // Adjust vertical positions to avoid label overlap
    // If the triangle is nearly equilateral, adjust the vertical positions
    const avgHeight = (midAC.y + midBC.y) / 2;
    if (Math.abs(midAC.y - midBC.y) < 30) {
        midAC.y = avgHeight - 30;
        midBC.y = avgHeight + 30;
    }
    
    // Bottom side (sideC)
    const bottomLabel = document.createElement('div');
    bottomLabel.className = 'side-label';
    bottomLabel.classList.add('value-box');
    bottomLabel.setAttribute('draggable', 'true');
    bottomLabel.setAttribute('id', 'side-c');
    bottomLabel.style.position = 'absolute';
    bottomLabel.style.left = `${midAB.x}px`;
    bottomLabel.style.top = `${midAB.y - 30}px`;
    bottomLabel.style.transform = 'translate(-50%, -50%)';
    bottomLabel.textContent = sideC;
    
    // Left side (sideA)
    const leftLabel = document.createElement('div');
    leftLabel.className = 'side-label';
    leftLabel.classList.add('value-box');
    leftLabel.setAttribute('draggable', 'true');
    leftLabel.setAttribute('id', 'side-a');
    leftLabel.style.position = 'absolute';
    leftLabel.style.left = `${midAC.x + 20}px`;
    leftLabel.style.top = `${midAC.y}px`;
    leftLabel.style.transform = 'translate(-50%, -50%)';
    leftLabel.textContent = sideA;
    
    // Right side (sideB)
    const rightLabel = document.createElement('div');
    rightLabel.className = 'side-label';
    rightLabel.classList.add('value-box');
    rightLabel.setAttribute('draggable', 'true');
    rightLabel.setAttribute('id', 'side-b');
    rightLabel.style.position = 'absolute';
    rightLabel.style.left = `${midBC.x}px`;
    rightLabel.style.top = `${midBC.y - 30}px`;
    rightLabel.style.transform = 'translate(-50%, -50%)';
    rightLabel.textContent = sideB;
    
    // Add labels to the display
    this.triangleDisplay.appendChild(bottomLabel);
    this.triangleDisplay.appendChild(leftLabel);
    this.triangleDisplay.appendChild(rightLabel);
    
    // Store references to the labels
    this.sideALabel = leftLabel;
    this.sideBLabel = rightLabel;
    this.sideCLabel = bottomLabel;
    
    // Position the triangle instruction near the rightmost label
if (this.triangleInstruction && this.sideCLabel) {
  const rect = this.sideCLabel.getBoundingClientRect();
  const containerRect = this.triangleDisplay.getBoundingClientRect();

  const offsetX = rect.left - containerRect.left;
  const offsetY = rect.top - containerRect.top;

  this.triangleInstruction.style.position = 'absolute';
  this.triangleInstruction.style.left = `${offsetX + 60}px`;  // Right side of sideC label
  this.triangleInstruction.style.top = `${offsetY}px`;         // Aligned vertically
  this.triangleInstruction.style.transform = 'translate(-50%, -50%)';
  this.triangleInstruction.setAttribute('id', 'triangle-instruction');
}

// After triangle and labels are drawn:
this.positionTriangleInstruction();

// Reposition on window resize
window.addEventListener('resize', () => {
  this.positionTriangleInstruction();
});

    
    // Initialize drag-and-drop functionality
    this.initDragAndDrop();
}
positionTriangleInstruction() {
  if (this.triangleInstruction && this.sideCLabel && this.triangleDisplay) {
    const rect = this.sideCLabel.getBoundingClientRect();
    const containerRect = this.triangleDisplay.getBoundingClientRect();

    const offsetX = rect.left - containerRect.left;
    const offsetY = rect.top - containerRect.top;

    this.triangleInstruction.style.position = 'absolute';
    this.triangleInstruction.style.left = `${offsetX + 60}px`;  // Right of sideC
    this.triangleInstruction.style.top = `${offsetY}px`;
    this.triangleInstruction.style.transform = 'translate(-50%, -50%)';
    this.triangleInstruction.setAttribute('id', 'triangle-instruction');
  }
}



// Update createSideLabels method to position the triangle instruction better
// createSideLabels(sideA, sideB, sideC) {
//     // Wait until triangle coordinates are available
//     if (!this.triangleCoords) {
//         setTimeout(() => this.createSideLabels(sideA, sideB, sideC), 50);
//         return;
//     }
    
//     // Create containers for the side labels (to make them draggable)
//     const { x1, y1, x2, y2, x3, y3, canvasWidth, canvasHeight } = this.triangleCoords;
    
//     // Remove previous labels if they exist
//     if (this.sideALabel) this.sideALabel.remove();
//     if (this.sideBLabel) this.sideBLabel.remove();
//     if (this.sideCLabel) this.sideCLabel.remove();
    
//     // Calculate vectors for sides
//     const vectorAB = { x: x2 - x1, y: y2 - y1 };
//     const vectorAC = { x: x3 - x1, y: y3 - y1 };
//     const vectorBC = { x: x3 - x2, y: y3 - y2 };
    
//     // Calculate side lengths (in pixels) for proportional offset
//     const abLength = Math.sqrt(vectorAB.x * vectorAB.x + vectorAB.y * vectorAB.y);
//     const acLength = Math.sqrt(vectorAC.x * vectorAC.x + vectorAC.y * vectorAC.y);
//     const bcLength = Math.sqrt(vectorBC.x * vectorBC.x + vectorBC.y * vectorBC.y);
    
//     // Calculate normalized perpendicular vectors (unit vectors)
//     const abPerp = { x: -vectorAB.y / abLength, y: vectorAB.x / abLength };
//     const acPerp = { x: -vectorAC.y / acLength, y: vectorAC.x / acLength };
//     const bcPerp = { x: vectorBC.y / bcLength, y: -vectorBC.x / bcLength };
    
//     // Distance to offset labels away from the sides (proportional to triangle size)
//     const triangleSize = Math.min(abLength, acLength, bcLength);
//     const offsetDistance = triangleSize * 0.6; // Increased from 0.4 to 0.6
//     const minOffset = 70; // Increased from 50 to 70 pixels
//     const offset = Math.max(offsetDistance, minOffset);
    
//     // Analyze triangle orientation for better label placement
//     const isBottomFlat = Math.abs(y1 - y2) < 10; // If bottom side is relatively flat
//     const isLeftSideVertical = Math.abs(x1 - x3) < 10; // If left side is relatively vertical
//     const isRightSideVertical = Math.abs(x2 - x3) < 10; // If right side is relatively vertical
    
//     // Bottom side (AB/C) midpoint with smart offset
//     let midAB = { 
//         x: (x1 + x2) / 2,
//         y: (y1 + y2) / 2 + offset * 1.1 // Always push bottom label down more
//     };
    
//     // Make sure bottom label is below the triangle
//     if (midAB.y < Math.max(y1, y2, y3)) {
//         midAB.y = Math.max(y1, y2, y3) + offset * 0.6;
//     }
    
//     // Left side (AC/B) midpoint with smart offset
//     let midAC = {
//         x: (x1 + x3) / 2 - offset * 0.9, // Push left label more to the left
//         y: (y1 + y3) / 2
//     };
    
//     // Make sure left label is to the left of the triangle
//     if (midAC.x > Math.min(x1, x2, x3)) {
//         midAC.x = Math.min(x1, x2, x3) - offset * 0.6;
//     }
    
//     // Right side (BC/A) midpoint with smart offset
//     let midBC = {
//         x: (x2 + x3) / 2 + offset * 0.9, // Push right label more to the right
//         y: (y2 + y3) / 2
//     };
    
//     // Make sure right label is to the right of the triangle
//     if (midBC.x < Math.max(x1, x2, x3)) {
//         midBC.x = Math.max(x1, x2, x3) + offset * 0.6;
//     }
    
//     // Adjust vertical positions to avoid label overlap
//     // If the triangle is nearly equilateral, adjust the vertical positions
//     const avgHeight = (midAC.y + midBC.y) / 2;
//     if (Math.abs(midAC.y - midBC.y) < 30) {
//         midAC.y = avgHeight - 30;
//         midBC.y = avgHeight + 30;
//     }
    
//     // Bottom side (sideC)
//     const bottomLabel = document.createElement('div');
//     bottomLabel.className = 'side-label';
//     bottomLabel.classList.add('value-box');
//     bottomLabel.setAttribute('draggable', 'true');
//     bottomLabel.setAttribute('id', 'side-c');
//     bottomLabel.style.position = 'absolute';
//     bottomLabel.style.left = `${midAB.x}px`;
//     bottomLabel.style.top = `${midAB.y - 30}px`;
//     bottomLabel.style.transform = 'translate(-50%, -50%)';
//     bottomLabel.textContent = sideC;
    
//     // Left side (sideA)
//     const leftLabel = document.createElement('div');
//     leftLabel.className = 'side-label';
//     leftLabel.classList.add('value-box');
//     leftLabel.setAttribute('draggable', 'true');
//     leftLabel.setAttribute('id', 'side-a');
//     leftLabel.style.position = 'absolute';
//     leftLabel.style.left = `${midAC.x + 20}px`;
//     leftLabel.style.top = `${midAC.y}px`;
//     leftLabel.style.transform = 'translate(-50%, -50%)';
//     leftLabel.textContent = sideA;
    
//     // Right side (sideB)
//     const rightLabel = document.createElement('div');
//     rightLabel.className = 'side-label';
//     rightLabel.classList.add('value-box');
//     rightLabel.setAttribute('draggable', 'true');
//     rightLabel.setAttribute('id', 'side-b');
//     rightLabel.style.position = 'absolute';
//     rightLabel.style.left = `${midBC.x}px`;
//     rightLabel.style.top = `${midBC.y - 30}px`;
//     rightLabel.style.transform = 'translate(-50%, -50%)';
//     rightLabel.textContent = sideB;
    
//     // Add labels to the display
//     this.triangleDisplay.appendChild(bottomLabel);
//     this.triangleDisplay.appendChild(leftLabel);
//     this.triangleDisplay.appendChild(rightLabel);
    
//     // Store references to the labels
//     this.sideALabel = leftLabel;
//     this.sideBLabel = rightLabel;
//     this.sideCLabel = bottomLabel;
    
//     // Position the triangle instruction near the rightmost label
//     if (this.triangleInstruction) {
//         const rightmostX = Math.max(midAC.x, midBC.x, midAB.x);
//         this.triangleInstruction.style.left = `${rightmostX + 60}px`;
//         this.triangleInstruction.style.top = `${Math.min(midAC.y, midBC.y, midAB.y)}px`;
//     }
    
//     // Initialize drag-and-drop functionality
//     this.initDragAndDrop();
// }

createSideLabels(sideA, sideB, sideC) {
    // Wait until triangle coordinates are available
    if (!this.triangleCoords) {
        setTimeout(() => this.createSideLabels(sideA, sideB, sideC), 50);
        return;
    }
    
    // Create containers for the side labels (to make them draggable)
    const { x1, y1, x2, y2, x3, y3, canvasWidth, canvasHeight } = this.triangleCoords;
    
    // Remove previous labels if they exist
    if (this.sideALabel) this.sideALabel.remove();
    if (this.sideBLabel) this.sideBLabel.remove();
    if (this.sideCLabel) this.sideCLabel.remove();
    
    // Calculate vectors for sides
    const vectorAB = { x: x2 - x1, y: y2 - y1 };
    const vectorAC = { x: x3 - x1, y: y3 - y1 };
    const vectorBC = { x: x3 - x2, y: y3 - y2 };
    
    // Calculate side lengths (in pixels) for proportional offset
    const abLength = Math.sqrt(vectorAB.x * vectorAB.x + vectorAB.y * vectorAB.y);
    const acLength = Math.sqrt(vectorAC.x * vectorAC.x + vectorAC.y * vectorAC.y);
    const bcLength = Math.sqrt(vectorBC.x * vectorBC.x + vectorBC.y * vectorBC.y);
    
    // Calculate normalized perpendicular vectors (unit vectors)
    const abPerp = { x: -vectorAB.y / abLength, y: vectorAB.x / abLength };
    const acPerp = { x: -vectorAC.y / acLength, y: vectorAC.x / acLength };
    const bcPerp = { x: vectorBC.y / bcLength, y: -vectorBC.x / bcLength };
    
    // Distance to offset labels away from the sides (proportional to triangle size)
    const triangleSize = Math.min(abLength, acLength, bcLength);
    const offsetDistance = triangleSize * 0.6; // Increased from 0.4 to 0.6
    const minOffset = 70; // Increased from 50 to 70 pixels
    const offset = Math.max(offsetDistance, minOffset);
    
    // Analyze triangle orientation for better label placement
    const isBottomFlat = Math.abs(y1 - y2) < 10; // If bottom side is relatively flat
    const isLeftSideVertical = Math.abs(x1 - x3) < 10; // If left side is relatively vertical
    const isRightSideVertical = Math.abs(x2 - x3) < 10; // If right side is relatively vertical
    
    // Bottom side (AB/C) midpoint with smart offset
    let midAB = { 
        x: (x1 + x2) / 2,
        y: (y1 + y2) / 2 + offset * 1.1 // Always push bottom label down more
    };
    
    // Make sure bottom label is below the triangle
    if (midAB.y < Math.max(y1, y2, y3)) {
        midAB.y = Math.max(y1, y2, y3) + offset * 0.6;
    }
    
    // Left side (AC/B) midpoint with smart offset
    let midAC = {
        x: (x1 + x3) / 2 - offset * 0.9, // Push left label more to the left
        y: (y1 + y3) / 2
    };
    
    // Make sure left label is to the left of the triangle
    if (midAC.x > Math.min(x1, x2, x3)) {
        midAC.x = Math.min(x1, x2, x3) - offset * 0.6;
    }
    
    // Right side (BC/A) midpoint with smart offset
    let midBC = {
        x: (x2 + x3) / 2 + offset * 0.9, // Push right label more to the right
        y: (y2 + y3) / 2
    };
    
    // Make sure right label is to the right of the triangle
    if (midBC.x < Math.max(x1, x2, x3)) {
        midBC.x = Math.max(x1, x2, x3) + offset * 0.6;
    }
    
    // Adjust vertical positions to avoid label overlap
    // If the triangle is nearly equilateral, adjust the vertical positions
    const avgHeight = (midAC.y + midBC.y) / 2;
    if (Math.abs(midAC.y - midBC.y) < 30) {
        midAC.y = avgHeight - 30;
        midBC.y = avgHeight + 30;
    }
    
    // Bottom side (sideC)
    const bottomLabel = document.createElement('div');
    bottomLabel.className = 'side-label';
    bottomLabel.classList.add('value-box');
    bottomLabel.setAttribute('draggable', 'true');
    bottomLabel.setAttribute('id', 'side-c');
    bottomLabel.style.position = 'absolute';
    bottomLabel.style.left = `${midAB.x}px`;
    bottomLabel.style.top = `${midAB.y - 30}px`;
    bottomLabel.style.transform = 'translate(-50%, -50%)';
    bottomLabel.textContent = sideC;
    
    // Left side (sideA)
    const leftLabel = document.createElement('div');
    leftLabel.className = 'side-label';
    leftLabel.classList.add('value-box');
    leftLabel.setAttribute('draggable', 'true');
    leftLabel.setAttribute('id', 'side-a');
    leftLabel.style.position = 'absolute';
    leftLabel.style.left = `${midAC.x + 20}px`;
    leftLabel.style.top = `${midAC.y}px`;
    leftLabel.style.transform = 'translate(-50%, -50%)';
    leftLabel.textContent = sideA;
    
    // Right side (sideB)
    const rightLabel = document.createElement('div');
    rightLabel.className = 'side-label';
    rightLabel.classList.add('value-box');
    rightLabel.setAttribute('draggable', 'true');
    rightLabel.setAttribute('id', 'side-b');
    rightLabel.style.position = 'absolute';
    rightLabel.style.left = `${midBC.x}px`;
    rightLabel.style.top = `${midBC.y - 30}px`;
    rightLabel.style.transform = 'translate(-50%, -50%)';
    rightLabel.textContent = sideB;
    
    // Add labels to the display
    this.triangleDisplay.appendChild(bottomLabel);
    this.triangleDisplay.appendChild(leftLabel);
    this.triangleDisplay.appendChild(rightLabel);
    
    // Store references to the labels
    this.sideALabel = leftLabel;
    this.sideBLabel = rightLabel;
    this.sideCLabel = bottomLabel;
    
    // Position the triangle instruction near the rightmost label
    if (this.triangleInstruction) {
        const rightmostX = Math.max(midAC.x, midBC.x, midAB.x);
        this.triangleInstruction.style.left = `${rightmostX + 60}px`;
        this.triangleInstruction.style.top = `${Math.min(midAC.y, midBC.y, midAB.y)}px`;
    }
    
    // Initialize drag-and-drop functionality
    this.initDragAndDrop();
}


// Update drawTriangle method to create instructional headings
// drawTriangle(sideA, sideB, sideC) {
//     // Clear previous triangle
//     this.triangleDisplay.innerHTML = '';
    
//     // Store sides for p5 sketch to use
//     this.currentSideA = sideA;
//     this.currentSideB = sideB;
//     this.currentSideC = sideC;
    
//     // Parse numeric values for calculations
//     this.numericSideA = this.parseNumericValue(sideA);
//     this.numericSideB = this.parseNumericValue(sideB);
//     this.numericSideC = this.parseNumericValue(sideC);
    
//     // Create instructional headings
//     this.createInstructionalHeadings();
    
//     // Create a p5.js sketch
//     this.createP5Sketch();
    
//     // We'll create and position the labels after the p5 sketch initializes
//     // This is done via callback now to ensure coordinates are available
// }

/*************  ✨ Windsurf Command 🌟  *************/
drawTriangle(sideA, sideB, sideC) {
    // Clear previous triangle
    this.triangleDisplay.innerHTML = '';
    
    // Store sides for p5 sketch to use
    this.currentSideA = sideA;
    this.currentSideB = sideB;
    this.currentSideC = sideC;
    
    // Parse numeric values for calculations
    this.numericSideA = this.parseNumericValue(sideA);
    this.numericSideB = this.parseNumericValue(sideB);
    this.numericSideC = this.parseNumericValue(sideC);
    
    // Create instructional headings
    this.createInstructionalHeadings();
    
    // Disable instructional headings when drag starts
    document.addEventListener('dragstart', function() {
        if (this.triangleInstruction) {
            this.triangleInstruction.style.display = 'none';
        }
    }.bind(this));

    // click touch select triangle side the triangleinstruction hide
    document.addEventListener('click', function() {
        if (this.triangleInstruction) {
            this.triangleInstruction.style.display = 'none';
        }
    }.bind(this));

    document.addEventListener('touchstart', function() {
        if (this.triangleInstruction) {
            this.triangleInstruction.style.display = 'none';
        }
    }.bind(this));

    // newproblem button the triangleinstruction show
    // document.getElementById('').addEventListener('click', function() {
    //     if (this.triangleInstruction) {
    //         this.triangleInstruction.style.display = 'none';
    //     }
    // }.bind(this));
    

    

   
    
    // Create a p5.js sketch
    this.createP5Sketch();
    
    // We'll create and position the labels after the p5 sketch initializes
    // This is done via callback now to ensure coordinates are available
}
/*******  d6746877-88cd-489c-9b22-164db247aa68  *******/

// Update resetUI method to handle instruction headings
// resetUI() {
//     console.log("Resetting UI for new problem");
    
//     // Hide right angle marker
//     this.hideRightAngleMarker();
    
//     // Hide equation indicator
//     this.hideEquationIndicator();
    
//     // Show instruction headings again for new problem
//     if (this.triangleInstruction) {
//         this.triangleInstruction.style.display = 'block';
//     }
//     if (this.dropBoxInstruction) {
//         this.dropBoxInstruction.style.display = 'block';
//     }
    
//     // Clear drop boxes
//     [this.dropBoxA, this.dropBoxB, this.dropBoxC].forEach(box => {
//         box.textContent = '';
//         box.classList.remove('filled');
//         box.removeAttribute('data-filled');
//         box.removeAttribute('data-source-id');
//         box.removeAttribute('data-value');
        
//         // Ensure drop boxes are draggable and interactive
//         box.setAttribute('draggable', 'true');
//         box.style.cursor = 'move';
//         box.style.pointerEvents = 'auto';
//     });
    
//     // Reset triangle sides to be draggable if they exist
//     const triangleSides = [this.sideALabel, this.sideBLabel, this.sideCLabel];
//     triangleSides.forEach(side => {
//         if (side) {
//             side.setAttribute('draggable', 'true');
//             side.style.cursor = 'grab';
//             side.style.opacity = '1';
//             side.classList.remove('used');
//             side.style.backgroundColor = '#e9ecef';
//             side.style.borderColor = '#ced4da';
//             side.style.pointerEvents = 'auto';
//         }
//     });
    
//     // Re-enable answer buttons
//     this.checkButton.disabled = false;
//     this.notRightButton.disabled = false;
//     this.checkButton.style.opacity = '1';
//     this.notRightButton.style.opacity = '1';
//     this.checkButton.style.cursor = 'pointer';
//     this.notRightButton.style.cursor = 'pointer';
    
//     // Clear feedback and calculation
//     this.clearFeedback();
//     this.clearCalculation();
    
//     // Hide hint
//     this.hideHint();
// }

resetUI() {
    console.log("Resetting UI for new problem");
    
    // Hide right angle marker
    this.hideRightAngleMarker();
    
    // Hide equation indicator
    this.hideEquationIndicator();
    
    // Show instruction headings again for new problem
    if (this.triangleInstruction) {
        this.triangleInstruction.style.display = 'block';
    }
   
    
    // Clear drop boxes
    [this.dropBoxA, this.dropBoxB, this.dropBoxC].forEach(box => {
        box.textContent = '';
        box.classList.remove('filled');
        box.removeAttribute('data-filled');
        box.removeAttribute('data-source-id');
        box.removeAttribute('data-value');
        
        // Ensure drop boxes are draggable and interactive
        box.setAttribute('draggable', 'true');
        box.style.cursor = 'move';
        box.style.pointerEvents = 'auto';
    });
    
    // Reset triangle sides to be draggable if they exist
    const triangleSides = [this.sideALabel, this.sideBLabel, this.sideCLabel];
    triangleSides.forEach(side => {
        if (side) {
            side.setAttribute('draggable', 'true');
            side.style.cursor = 'grab';
            side.style.opacity = '1';
            side.classList.remove('used');
            side.style.backgroundColor = '#e9ecef';
            side.style.borderColor = '#ced4da';
            side.style.pointerEvents = 'auto';
        }
    });
    
  


    // Re-enable answer buttons
    this.checkButton.disabled = false;
    this.notRightButton.disabled = false;
    this.checkButton.style.opacity = '1';
    this.notRightButton.style.opacity = '1';
    this.checkButton.style.cursor = 'pointer';
    this.notRightButton.style.cursor = 'pointer';
    
    // Clear feedback and calculation
    this.clearFeedback();
    this.clearCalculation();
    
    // Hide hint
    this.hideHint();
}

// Update disableDragging method to hide instructions when dragging is disabled
// disableDragging() {
//     const triangleSides = [this.sideALabel, this.sideBLabel, this.sideCLabel];
//     triangleSides.forEach(side => {
//         if (side) {
//             side.setAttribute('draggable', 'false');
//             side.style.cursor = 'default';
//             side.style.pointerEvents = 'none'; // Prevent all interactions
//         }
//     });
    
//     // Also disable drop zones
//     const dropBoxes = [this.dropBoxA, this.dropBoxB, this.dropBoxC];
//     dropBoxes.forEach(box => {
//         box.setAttribute('draggable', 'false');
//         box.style.cursor = 'default';
//         box.style.pointerEvents = 'none'; // Prevent all interactions
//     });
    
//     // Hide instruction headings when dragging is disabled
//     if (this.triangleInstruction) {
//         this.triangleInstruction.style.display = 'none';
//     }
//     if (this.dropBoxInstruction) {
//         this.dropBoxInstruction.style.display = 'none';
//     }
// }

disableDragging() {
    const triangleSides = [this.sideALabel, this.sideBLabel, this.sideCLabel];
    triangleSides.forEach(side => {
        if (side) {
            side.setAttribute('draggable', 'false');
            side.style.cursor = 'default';
            side.style.pointerEvents = 'none'; // Prevent all interactions
        }
    });
    
    // Also disable drop zones
    const dropBoxes = [this.dropBoxA, this.dropBoxB, this.dropBoxC];
    dropBoxes.forEach(box => {
        box.setAttribute('draggable', 'false');
        box.style.cursor = 'default';
        box.style.pointerEvents = 'none'; // Prevent all interactions
    });
    
    // Hide instruction headings when dragging is disabled
    if (this.triangleInstruction) {
        this.triangleInstruction.style.display = 'block';
    }
   
}

}


// End of view.js

document.addEventListener('DOMContentLoaded', () => {
// Create model
const model = new PythagoreanModel();

// Create view
const view = new PythagoreanView();

// Create controller
const controller = new PythagoreanController(model, view);
});



/**
* Model for the Pythagorean Theorem Checker
* Handles data storage and business logic
*/
class PythagoreanModel {
constructor() {
    this.reset();
    this.correctCount = 0;
}

reset() {
    // Generate triangle sides
    this.generateRandomTriangle();
    
    // Track which values have been placed where
    this.placedValues = {
        a: null,
        b: null,
        c: null
    };
    
    this.isComplete = false;
    this.isRightTriangle = false;
    this.calculationSteps = [];
    this.triesLeft = 1; // Number of tries before showing the answer
    this.showingHint = false;
}

generateRandomTriangle() {
    // Create random triangle sides
    // We'll use Pythagorean triples with some randomization to ensure we have both right and non-right triangles
    
    // Option 1: Create a right triangle using a Pythagorean triple
    const pythagoreanTriples = [
        [3, 4, 5],
        [5, 12, 13],
        [8, 15, 17],
        [7, 24, 25],
        [9, 40, 41]
    ];
    
    // Option 2: Create a non-right triangle by modifying a Pythagorean triple
    const rightTriangle = Math.random() < 0.5; // 50% chance of a right triangle
    
    let sides;
    if (rightTriangle) {
        // Select a Pythagorean triple
        sides = pythagoreanTriples[Math.floor(Math.random() * pythagoreanTriples.length)];
        this.isRightTriangle = true;
    } else {
        // Select a Pythagorean triple and modify one side to make it not a right triangle
        sides = [...pythagoreanTriples[Math.floor(Math.random() * pythagoreanTriples.length)]];
        // Randomly add or subtract a small amount to one of the sides
        const sideToModify = Math.floor(Math.random() * 3);
        sides[sideToModify] += Math.random() < 0.5 ? 1 : -1;
        this.isRightTriangle = false;
    }
    
    // Scale up the sides to make them larger
    const scale = Math.floor(Math.random() * 3) + 1; // Scale by 1, 2, or 3
    sides = sides.map(side => side * scale);
    
    // Randomly decide which side is which (a, b, c)
    // For education purposes, let's make sure c is always the hypotenuse (the longest side)
    sides.sort((a, b) => a - b);
    
    // Assign sides to the model
    this.sideA = sides[0];
    this.sideB = sides[1];
    this.sideC = sides[2];
    
    // Optionally make one of the sides a square root for more interesting problems
    if (Math.random() < 0.3) { // 30% chance of having a square root
        const sideToModify = Math.floor(Math.random() * 2); // Only modify a or b, not c
        const squareValue = sides[sideToModify] ** 2;
        if (sideToModify === 0) {
            this.sideA = `√${squareValue}`;
            this.originalSideA = sides[0];
        } else {
            this.sideB = `√${squareValue}`;
            this.originalSideB = sides[1];
        }
    }
}

placeValue(position, value) {
    this.placedValues[position] = value;
    this.isComplete = this.placedValues.a !== null && 
                      this.placedValues.b !== null && 
                      this.placedValues.c !== null;
    
    if (this.isComplete) {
        this.checkSolution();
    }
    
    return this.isComplete;
}

removeValue(position) {
    this.placedValues[position] = null;
    this.isComplete = false;
    this.calculationSteps = [];
}

checkSolution() {
    const a = this.placedValues.a;
    const b = this.placedValues.b;
    const c = this.placedValues.c;
    
    // Handle square root values
    let aValue = typeof a === 'string' && a.includes('√') ? 
        Math.sqrt(parseInt(a.replace('√', ''))) : parseInt(a);
    let bValue = typeof b === 'string' && b.includes('√') ? 
        Math.sqrt(parseInt(b.replace('√', ''))) : parseInt(b);
    let cValue = typeof c === 'string' && c.includes('√') ? 
        Math.sqrt(parseInt(c.replace('√', ''))) : parseInt(c);
    
    // Calculate the squared values
    const aSquared = aValue ** 2;
    const bSquared = bValue ** 2;
    const cSquared = cValue ** 2;
    
    // Calculate the left and right sides of the equation
    const leftSide = aSquared + bSquared;
    const rightSide = cSquared;
    
    // Store calculation steps for display
    this.calculationSteps = [
        `${aValue}² + ${bValue}² ≟ ${cValue}²`,
        `${aSquared} + ${bSquared} ≟ ${rightSide}`,
        `${leftSide} ${Math.abs(leftSide - rightSide) < 0.00001 ? '=' : '≠'} ${rightSide}`
    ];
    
    // Check if it's a right triangle (allowing for small rounding errors)
    this.isRightTriangle = Math.abs(leftSide - rightSide) < 0.00001;
    
    return this.isRightTriangle;
}

useHint() {
    if (this.triesLeft > 0) {
        this.triesLeft--;
        this.showingHint = true;
        return true;
    }
    return false;
}

hasTriesLeft() {
    return this.triesLeft > 0;
}

getTriesLeft() {
    return this.triesLeft;
}

isShowingHint() {
    return this.showingHint;
}

incrementCorrectCount() {
    this.correctCount++;
    return this.correctCount;
}

resetCorrectCount() {
    this.correctCount = 0;
    return this.correctCount;
}

// Get the correct sides for the triangle
getCorrectSides() {
    return {
        a: this.sideA,
        b: this.sideB,
        c: this.sideC
    };
}

// Check if the hypotenuse (longest side) is correctly placed on the right side
isHypotenuseCorrectlyPlaced() {
    // Not complete yet, so we can't check placement
    if (!this.isComplete) {
        return true;
    }
    
    // Get the triangle sides and determine the longest one
    let sideAValue = this.sideA;
    let sideBValue = this.sideB;
    let sideCValue = this.sideC;
    
    // Handle square root values
    if (typeof sideAValue === 'string' && sideAValue.includes('√')) {
        sideAValue = Math.sqrt(parseInt(sideAValue.replace('√', '')));
    } else {
        sideAValue = parseInt(sideAValue);
    }
    
    if (typeof sideBValue === 'string' && sideBValue.includes('√')) {
        sideBValue = Math.sqrt(parseInt(sideBValue.replace('√', '')));
    } else {
        sideBValue = parseInt(sideBValue);
    }
    
    if (typeof sideCValue === 'string' && sideCValue.includes('√')) {
        sideCValue = Math.sqrt(parseInt(sideCValue.replace('√', '')));
    } else {
        sideCValue = parseInt(sideCValue);
    }
    
    // The longest side should be on the right (c position)
    const longestSide = Math.max(sideAValue, sideBValue, sideCValue);
    
    // Get the value placed in position c
    let placedCValue = this.placedValues.c;
    if (typeof placedCValue === 'string' && placedCValue.includes('√')) {
        placedCValue = Math.sqrt(parseInt(placedCValue.replace('√', '')));
    } else {
        placedCValue = parseInt(placedCValue);
    }
    
    // Check if the longest side is correctly placed on the right
    return placedCValue === longestSide;
}
}

/**
* Controller for the Pythagorean Theorem Checker
* Connects the Model and View, handles user interactions
*/
class PythagoreanController {
constructor(model, view) {
    this.model = model;
    this.view = view;
    
    // Set up event handlers
    this.view.setOnDrop((position, value) => this.handleDrop(position, value));
    this.view.setOnClear((position) => this.handleClear(position));
    this.view.setOnCheck(() => this.handleCheck());
    this.view.setOnNotRight(() => this.handleNotRight());
    this.view.setOnNewProblem(() => this.startNewProblem());
    this.view.setOnCheckComplete(() => this.checkAnswerPlacement());
    this.view.setOnTryAgain(() => this.handleTryAgain());
    
    
    // Initialize the first problem
    this.startNewProblem();
}

startNewProblem() {
    // Reset the model
    this.model.reset();
    
    // Reset the view
    this.view.resetUI();
    
    // Draw the triangle with the new side values
    this.view.drawTriangle(
        this.model.sideA,
        this.model.sideB,
        this.model.sideC
    );

    // Disable the new problem button until correct answer is chosen
    this.view.disableNewProblemButton();
    
    // Hide equation indicator for new problem
    this.view.hideEquationIndicator();
    
    // Hide right angle marker for new problem
    this.view.hideRightAngleMarker();
    
    // Re-enable dragging functionality
    this.enableDraggingAndButtons();
}

handleDrop(position, value) {
    // Update the model with the placed value
    const isComplete = this.model.placeValue(position, value);
    
    // If all values are placed, show calculation steps
    if (isComplete) {
        this.view.showCalculation(this.model.calculationSteps);
    }
    
    return isComplete;
}

handleClear(position) {
    // Update the model when a value is removed
    this.model.removeValue(position);
    
    // Clear calculation display
    this.view.clearCalculation();
    
    // Hide hint if it was showing
    if (this.model.isShowingHint()) {
        this.view.hideHint();
    }
}

checkAnswerPlacement() {
    // Check if all values are placed correctly
    if (this.model.isComplete) {
        // First check if the hypotenuse is on the right side
        if (!this.model.isHypotenuseCorrectlyPlaced()) {
            this.model.useHint();
            this.view.showHint(this.model.getTriesLeft());
            // Show hint specifically for incorrect longest length placement
            this.view.hintText.textContent = "The two legs go on the left side. The longest length goes on the right side.";
            return;
        }
        // Remove the general hint display here - we only want specific hints
    }
}

handleTryAgain() {
    // Clear all drop boxes and reset for another try
    this.view.resetUI();
    
    // No need to reset the model completely, just clear placed values
    this.model.placedValues = {
        a: null,
        b: null,
        c: null
    };
    this.model.isComplete = false;
    this.model.calculationSteps = [];
}

handleCheck() {
    // User thinks it's a right triangle
    if (!this.model.isComplete) {
        this.view.showFeedback(false, "Please place all values first!");
        return;
    }
    
    // First check if the hypotenuse is correctly placed
    if (!this.model.isHypotenuseCorrectlyPlaced()) {
        // Show hint for incorrect longest length placement
        this.model.useHint();
        this.view.showHint(this.model.getTriesLeft());
        this.view.hintText.textContent = "The two legs go on the left side. The longest length goes on the right side.";
        this.view.clearFeedback();
        this.view.hideEquationIndicator(); // Hide indicator when placement is wrong
        this.view.hideRightAngleMarker(); // Hide right angle marker when placement is wrong
        return;
    }
    
    const isCorrect = this.model.isRightTriangle === true;
    
    // Always hide the marker first to ensure clean state
    this.view.hideRightAngleMarker();
    
    this.view.showFeedback(isCorrect, isCorrect ? 
        "Correct! This is a right triangle." : 
        "Incorrect. This is not a right triangle.");
    
    // Show appropriate indicator
    if (isCorrect) {
        this.view.showEquationCorrect();
        
        // Show right angle marker for correct identification of right triangle
        console.log("Controller: Showing right angle marker in handleCheck");
        this.view.showRightAngleMarker();
        
        const newCount = this.model.incrementCorrectCount();
        this.view.updateCorrectCount(newCount);
        this.view.enableNewProblemButton();
        this.view.hideHint(); // Hide any existing hints when correct
        
        // Disable dragging and answer buttons after correct answer
        this.view.disableDragging();
        this.view.disableAnswerButtons();
    } else {
        this.view.showEquationIncorrect();
        // DO NOT show right angle marker here either
        // Remove this code that was showing the marker incorrectly:
        // setTimeout(() => {
        //     this.view.showRightAngleMarker();
        // }, 100);
        
        // Show hint about Pythagorean theorem when wrong answer is chosen
        this.model.useHint();
        this.view.showHint(this.model.getTriesLeft());
        this.view.hintText.textContent = "It is a right triangle if and only if the sum of the squares of the legs are equal to the square of the longest side.";
    }
}

handleNotRight() {
    // User thinks it's not a right triangle
    if (!this.model.isComplete) {
        this.view.showFeedback(false, "Please place all values first!");
        return;
    }
    
    // First check if the hypotenuse is correctly placed
    if (!this.model.isHypotenuseCorrectlyPlaced()) {
        // Show hint for incorrect longest length placement
        this.model.useHint();
        this.view.showHint(this.model.getTriesLeft());
        this.view.hintText.textContent = "The two legs go on the left side. The longest length goes on the right side.";
        this.view.clearFeedback();
        this.view.hideEquationIndicator(); // Hide indicator when placement is wrong
        this.view.hideRightAngleMarker(); // Hide right angle marker when placement is wrong
        return;
    }
    
    const isCorrect = this.model.isRightTriangle === false;
    
    // Always hide the marker first to ensure clean state
    this.view.hideRightAngleMarker();
    
    this.view.showFeedback(isCorrect, isCorrect ? 
        "Correct! This is not a right triangle." : 
        "Incorrect. This is actually a right triangle.");
    
    // Show appropriate indicator
    if (isCorrect) {
        this.view.showEquationCorrect();
        // For non-right triangles, don't show the right angle marker
        this.view.hideRightAngleMarker();
        
        const newCount = this.model.incrementCorrectCount();
        this.view.updateCorrectCount(newCount);
        this.view.enableNewProblemButton();
        this.view.hideHint(); // Hide any existing hints when correct
        
        // Disable dragging and answer buttons after correct answer
        this.view.disableDragging();
        this.view.disableAnswerButtons();
    } else {
        this.view.showEquationIncorrect();
        // DO NOT show right angle marker here either
        // Remove this code that was showing the marker incorrectly:
        // setTimeout(() => {
        //     this.view.showRightAngleMarker();
        // }, 100);
        
        // Show hint about Pythagorean theorem when wrong answer is chosen
        this.model.useHint();
        this.view.showHint(this.model.getTriesLeft());
        this.view.hintText.textContent = "It is a right triangle if and only if the sum of the squares of the legs are equal to the square of the longest side.";
    }
}

// Add this new method to the PythagoreanController class
enableDraggingAndButtons() {
    // Re-enable drag and drop interactions
    const triangleSides = [this.view.sideALabel, this.view.sideBLabel, this.view.sideCLabel];
    triangleSides.forEach(side => {
        if (side) {
            side.setAttribute('draggable', 'true');
            side.style.cursor = 'grab';
            side.style.pointerEvents = 'auto';
        }
    });
    
    // Re-enable drop zones
    const dropBoxes = [this.view.dropBoxA, this.view.dropBoxB, this.view.dropBoxC];
    dropBoxes.forEach(box => {
        box.setAttribute('draggable', 'true');
        box.style.cursor = 'move';
        box.style.pointerEvents = 'auto';
    });
    
    // Re-enable answer buttons
    this.view.checkButton.disabled = false;
    this.view.notRightButton.disabled = false;
    this.view.checkButton.style.opacity = '1';
    this.view.notRightButton.style.opacity = '1';
    this.view.checkButton.style.cursor = 'pointer';
    this.view.notRightButton.style.cursor = 'pointer';
}
}
