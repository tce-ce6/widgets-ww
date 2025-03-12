/**
 * View for the Pythagorean Theorem Checker
 * Handles all UI rendering and DOM interactions
 */
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
        
        // Draw SVG triangle
        const svgNS = "http://www.w3.org/2000/svg";
        const svg = document.createElementNS(svgNS, "svg");
        svg.setAttribute("width", "100%");
        svg.setAttribute("height", "100%");
        svg.setAttribute("viewBox", "0 0 300 200");
        
        // Create triangle polygon
        const triangle = document.createElementNS(svgNS, "polygon");
        triangle.setAttribute("points", "50,150 250,150 125,50");
        triangle.setAttribute("fill", "none");
        triangle.setAttribute("stroke", "#6f42c1");
        triangle.setAttribute("stroke-width", "3");
        
        // Add triangle to SVG
        svg.appendChild(triangle);
        
        // Add side labels - make them draggable
        // Bottom side (sideC)
        const bottomLabel = document.createElement('div');
        bottomLabel.className = 'side-label';
        bottomLabel.classList.add('value-box');
        bottomLabel.setAttribute('draggable', 'true');
        bottomLabel.setAttribute('id', 'side-c');
        bottomLabel.style.bottom = '0';
        bottomLabel.style.left = '50%';
        bottomLabel.style.transform = 'translateX(-50%)';
        bottomLabel.textContent = sideC;
        
        // Left side (sideA)
        const leftLabel = document.createElement('div');
        leftLabel.className = 'side-label';
        leftLabel.classList.add('value-box');
        leftLabel.setAttribute('draggable', 'true');
        leftLabel.setAttribute('id', 'side-a');
        leftLabel.style.top = '50%';
        leftLabel.style.left = '15%';
        leftLabel.style.transform = 'translateY(-50%)';
        leftLabel.textContent = sideA;
        
        // Right side (sideB)
        const rightLabel = document.createElement('div');
        rightLabel.className = 'side-label';
        rightLabel.classList.add('value-box');
        rightLabel.setAttribute('draggable', 'true');
        rightLabel.setAttribute('id', 'side-b');
        rightLabel.style.top = '50%';
        rightLabel.style.right = '15%';
        rightLabel.style.transform = 'translateY(-50%)';
        rightLabel.textContent = sideB;
        
        // Add right angle marker if needed (for educational purposes)
        const rightAngleMarker = document.createElementNS(svgNS, "path");
        rightAngleMarker.setAttribute("d", "M70,130 L90,130 L90,110");
        rightAngleMarker.setAttribute("fill", "none");
        rightAngleMarker.setAttribute("stroke", "#20c997");
        rightAngleMarker.setAttribute("stroke-width", "2");
        
        // Add SVG and labels to the display
        this.triangleDisplay.appendChild(svg);
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
        
        // Make all triangle sides draggable with visual effects
        draggableElements.forEach(element => {
            // Make it more obvious these are draggable
            element.style.cursor = 'grab';
            
            element.addEventListener('dragstart', (e) => {
                // Store data about the dragged element
                e.dataTransfer.setData('text/plain', element.textContent);
                e.dataTransfer.setData('source-id', element.id);
                e.dataTransfer.setData('source-type', 'triangle');
                element.classList.add('dragging');
                
                // Show dragging effect
                setTimeout(() => {
                    element.style.opacity = '0.4';
                }, 0);
            });
            
            element.addEventListener('dragend', () => {
                element.classList.remove('dragging');
                element.style.opacity = '1';
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
            
            dropTarget.addEventListener('dragstart', (e) => {
                // Only allow dragging if the box has a value
                if (dropTarget.getAttribute('data-filled') !== 'true') {
                    e.preventDefault();
                    return;
                }
                
                // Store the data needed for bidirectional dragging
                e.dataTransfer.setData('text/plain', dropTarget.textContent);
                e.dataTransfer.setData('source-id', dropTarget.id);
                e.dataTransfer.setData('source-type', 'box');
                e.dataTransfer.setData('original-triangle-id', dropTarget.getAttribute('data-source-id'));
                dropTarget.classList.add('dragging');
                
                // Show dragging effect
                setTimeout(() => {
                    dropTarget.style.opacity = '0.4';
                }, 0);
            });
            
            dropTarget.addEventListener('dragend', () => {
                dropTarget.classList.remove('dragging');
                dropTarget.style.opacity = '1';
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
        });
        
        // Configure triangle labels as drop targets (for returning from boxes)
        draggableElements.forEach(triangleLabel => {
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
                    // Find the drop box element and clear it
                    const dropBox = document.getElementById(sourceId);
                    
                    if (dropBox) {
                        // Clear the drop box
                        dropBox.textContent = '';
                        dropBox.classList.remove('filled');
                        dropBox.removeAttribute('data-filled');
                        dropBox.removeAttribute('data-source-id');
                        dropBox.removeAttribute('data-value');
                        
                        // Notify controller
                        const position = sourceId.replace('drop-', '');
                        if (this.onClear) {
                            this.onClear(position);
                        }
                        
                        // Visual confirmation that the value returned
                        triangleLabel.classList.add('pulse');
                        setTimeout(() => {
                            triangleLabel.classList.remove('pulse');
                        }, 800);
                    }
                }
            });
        });
        
        // Configure drop boxes as targets for triangle sides
        dropTargets.forEach(dropTarget => {
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
                
                // Don't allow dropping if already filled with a different value
                if (dropTarget.getAttribute('data-filled') === 'true' && 
                    dropTarget.getAttribute('data-source-id') !== sourceId) {
                    return;
                }
                
                // Fill the drop target
                dropTarget.textContent = data;
                dropTarget.classList.add('filled');
                dropTarget.setAttribute('data-filled', 'true');
                dropTarget.setAttribute('data-source-id', sourceId);
                dropTarget.setAttribute('data-value', data);
                
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
                    
                    // Highlight the original triangle element
                    if (originalTriangle) {
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
        this.calculationResult.innerHTML = '';
        steps.forEach(step => {
            const stepElement = document.createElement('div');
            stepElement.textContent = step;
            this.calculationResult.appendChild(stepElement);
        });
    }
    
    // Show feedback
    showFeedback(isCorrect, message) {
        this.feedbackElement.textContent = message || (isCorrect ? 'Correct!' : 'Incorrect. Try again!');
        this.feedbackElement.style.color = isCorrect ? '#2b8a3e' : '#c92a2a';
        
        // Highlight the correct button
        if (isCorrect) {
            if (message.includes('right triangle')) {
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
    resetUI() {
        // Clear drop boxes
        [this.dropBoxA, this.dropBoxB, this.dropBoxC].forEach(box => {
            box.textContent = '';
            box.classList.remove('filled');
            box.removeAttribute('data-filled');
            box.removeAttribute('data-source-id');
            box.removeAttribute('data-value');
        });
        
        // Clear feedback and calculation
        this.clearFeedback();
        this.clearCalculation();
        
        // Hide hint
        this.hideHint();
    }
}
