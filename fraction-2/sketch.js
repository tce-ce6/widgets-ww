let num1 = 2, den1 = 4;
let num2 = 1, den2 = 3;
let gridSize;
let padding;
let progress = 0;
let totalWidth;

// Define color strings first
const colorValues = {
    firstFraction: '#4A90E2',  // Blue
    secondFraction: '#E57373', // Pink
    overlap: '#800080',        // Purple
    grid: '#000000',          // Black
    background: '#FFFFFF'      // White
};

let colors;

function setup() {
    createResponsiveCanvas();
    setupColors();
    setupControls();
    noLoop();
    
    // Handle window resize
    window.addEventListener('resize', debounce(() => {
        createResponsiveCanvas();
        redraw();
    }, 250));
}

function createResponsiveCanvas() {
    // Get container width
    const container = document.getElementById('canvas-container');
    const containerWidth = container.offsetWidth;
    const containerHeight = container.offsetHeight;
    
    // Calculate dimensions maintaining aspect ratio
    totalWidth = min(containerWidth - 20, 1200); // 20px padding
    const desiredHeight = totalWidth * 0.5; // Desired aspect ratio
    const actualHeight = min(desiredHeight, containerHeight - 20);
    
    // Adjust grid and padding based on canvas size
    padding = totalWidth * 0.05;
    gridSize = (totalWidth - 4 * padding) / 3;
    
    // Create canvas
    const canvas = createCanvas(totalWidth, actualHeight);
    canvas.parent('canvas-container');
}

function setupColors() {
    colors = {
        firstFraction: color(colorValues.firstFraction),
        secondFraction: color(colorValues.secondFraction),
        overlap: color(colorValues.overlap),
        grid: colorValues.grid,
        background: colorValues.background
    };
}

// Debounce helper function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function setupControls() {
    const slider = document.getElementById('progressSlider');
    if (slider) {
        slider.addEventListener('input', () => {
            progress = slider.value / 100;
            redraw();
        });
    }

    const newFractionsBtn = document.querySelector('.new-fractions-btn');
    if (newFractionsBtn) {
        newFractionsBtn.addEventListener('click', generateNewFractions);
    }

    // const fullscreenBtn = document.querySelector('.fullscreen-btn');
    // fullscreenBtn.addEventListener('click', () => {
    //     const canvasContainer = document.getElementById('canvas-container');
    //     if (!document.fullscreenElement) {
    //         canvasContainer.requestFullscreen().catch(err => {
    //             console.log(`Error attempting to enable fullscreen: ${err.message}`);
    //         });
    //     } else {
    //         document.exitFullscreen();
    //     }
    // });
}

function generateNewFractions() {
    const denominators = [2, 3, 4, 5, 6, 7, 8, 9, 10];
    den1 = random(denominators);
    den2 = random(denominators);
    num1 = floor(random(1, den1));
    num2 = floor(random(1, den2));

    progress = 0;
    document.getElementById('progressSlider').value = 0;

    redraw();
}

function draw() {
    background(colors.background);
    
    // Scale text and line weights based on canvas size
    const textScale = totalWidth / 1200;
    const baseTextSize = 20 * textScale;
    const symbolTextSize = 24 * textScale;
    const lineWeight = max(1, 2 * textScale);
    
    // Draw equations at the top with more spacing
    push();
    textSize(baseTextSize);
    textAlign(CENTER, CENTER);
    const equationY = padding * 0.5;
    
    // Calculate x positions for better alignment with grids
    const firstX = padding + gridSize/2;
    const secondX = padding + gridSize + padding + gridSize/2;
    const resultX = padding + 2 * (gridSize + padding) + gridSize/2;
    
    // Draw fractions aligned with their respective grids with increased spacing
    drawFraction(num1, den1, firstX, equationY, lineWeight, 20);
    drawFraction(num2, den2, secondX, equationY, lineWeight, 20);
    drawFraction(num1 * num2, den1 * den2, resultX, equationY, lineWeight, 20);
    
    // Draw operation symbols aligned with spaces between grids
    textSize(baseTextSize);
    const mulX = padding + gridSize + padding/2;
    const eqX = padding + 2 * gridSize + padding + padding/2;
    text('×', mulX, equationY);
    text('=', eqX, equationY);
    pop();

    push();
    textSize(symbolTextSize);
    textAlign(CENTER, CENTER);
    const symbolY = padding * 1.5 + gridSize/2;
    
    // Draw operation symbols aligned with spaces between grids
    text('×', padding + gridSize + padding/2, symbolY);
    text('=', padding + 2 * gridSize + padding + padding/2, symbolY);
    pop();

    push();
    translate(padding, padding * 1.5);
    strokeWeight(lineWeight);

    // Always draw the base grids
    drawBaseGrid(0, 0);
    drawBaseGrid(gridSize + padding, 0);
    drawBaseGrid(2 * (gridSize + padding), 0);

    // Always draw the static first and second grids
    push();
    translate(0, 0);
    drawFilledCells(num1, den1, true, colors.firstFraction);
    pop();

    push();
    translate(gridSize + padding, 0);
    drawFilledCells(num2, den2, false, colors.secondFraction);
    pop();

    if (progress <= 0.4) {
        // First phase: Move copy of first grid to result position
        const moveProgress = progress / 0.4;
        push();
        translate(lerp(0, 2 * (gridSize + padding), moveProgress), 0);
        const copyColor = color(red(colors.firstFraction), green(colors.firstFraction), blue(colors.firstFraction), 150);
        drawFilledCells(num1, den1, true, copyColor);
        pop();

    } else if (progress <= 0.8) {
        // Second phase: First copy at result, move copy of second grid
        const moveProgress = (progress - 0.4) / 0.4;
        
        // Static copy of first grid at result
        push();
        translate(2 * (gridSize + padding), 0);
        drawFilledCells(num1, den1, true, colors.firstFraction);
        pop();

        // Moving copy of second grid
        push();
        translate(lerp(gridSize + padding, 2 * (gridSize + padding), moveProgress), 0);
        const copyColor = color(red(colors.secondFraction), green(colors.secondFraction), blue(colors.secondFraction), 150);
        drawFilledCells(num2, den2, false, copyColor);
        pop();

    } else {
        // Final phase: Show multiplication result
        const blendProgress = (progress - 0.8) / 0.2;
        push();
        translate(2 * (gridSize + padding), 0);

        noStroke();
        const cellWidth = gridSize / den2;
        const cellHeight = gridSize / den1;

        // Draw non-overlapping cells from first grid
        for (let i = 0; i < num1; i++) {
            for (let j = 0; j < den2; j++) {
                if (j >= num2) {
                    fill(colors.firstFraction);
                    rect(j * cellWidth, i * cellHeight, cellWidth, cellHeight);
                }
            }
        }

        // Draw non-overlapping cells from second grid
        for (let i = 0; i < den1; i++) {
            for (let j = 0; j < num2; j++) {
                if (i >= num1) {
                    fill(colors.secondFraction);
                    rect(j * cellWidth, i * cellHeight, cellWidth, cellHeight);
                }
            }
        }

        // Draw overlapping cells with blending and numbers
        let count = 1;
        for (let i = 0; i < num1; i++) {
            for (let j = 0; j < num2; j++) {
                const baseColor = lerpColor(colors.firstFraction, colors.secondFraction, 0.5);
                const finalColor = lerpColor(baseColor, colors.overlap, blendProgress);
                fill(finalColor);
                rect(j * cellWidth, i * cellHeight, cellWidth, cellHeight);
                
                // Add numbers only when animation is complete (progress >= 0.98)
                if (progress >= 0.98) {
                    fill(255); // White text
                    textAlign(CENTER, CENTER);
                    textSize(min(cellWidth, cellHeight) * 0.4); // Larger size for inside numbers
                    text(count, j * cellWidth + cellWidth/2, i * cellHeight + cellHeight/2);
                    count++;
                }
            }
        }

        // Draw row numbers (1 to den1) on the left side
        if (progress >= 0.98) {
            textAlign(RIGHT, CENTER);
            textSize(min(cellWidth, cellHeight) * 0.2); // Reduced from 0.25 to 0.2
            fill(0); // Black text
            for (let i = 0; i < den1; i++) {
                text(i + 1, -10, i * cellHeight + cellHeight/2); // Increased left spacing
            }
        }

        // Draw column numbers (1 to den2) on the top
        if (progress >= 0.98) {
            textAlign(CENTER, BOTTOM);
            for (let j = 0; j < den2; j++) {
                text(j + 1, j * cellWidth + cellWidth/2, -10); // Increased top spacing
            }
        }

        // Redraw grid lines on top
        drawGridLines();
        pop();
    }

    pop();
}

function drawBaseGrid(x, y) {
    push();
    translate(x, y);
    drawGridLines();
    pop();
}

function drawGridLines() {
    const lineWeight = max(1, 2 * (totalWidth / 1200));
    stroke(colors.grid);
    strokeWeight(lineWeight);
    noFill();

    // Draw outer square
    rect(0, 0, gridSize, gridSize);

    // Draw all vertical lines
    const cellWidth = gridSize / den2;
    for (let i = 1; i < den2; i++) {
        line(i * cellWidth, 0, i * cellWidth, gridSize);
    }

    // Draw all horizontal lines
    const cellHeight = gridSize / den1;
    for (let i = 1; i < den1; i++) {
        line(0, i * cellHeight, gridSize, i * cellHeight);
    }
}

function drawFilledCells(num, den, isHorizontal, fillColor) {
    noStroke();
    fill(fillColor);

    if (isHorizontal) {
        // Fill horizontal cells
        const cellHeight = gridSize / den;
        for (let i = 0; i < num; i++) {
            rect(0, i * cellHeight, gridSize, cellHeight);
        }
    } else {
        // Fill vertical cells
        const cellWidth = gridSize / den;
        for (let i = 0; i < num; i++) {
            rect(i * cellWidth, 0, cellWidth, gridSize);
        }
    }

    // Draw grid lines on top of the filled cells
    drawGridLines();
}

// Helper function to draw a fraction with adjustable spacing
function drawFraction(numerator, denominator, x, y, lineWeight, spacing) {
    const lineWidth = 25 * (totalWidth / 1200);
    
    textStyle(BOLD);
    
    // Draw numerator with increased spacing
    text(numerator, x, y - spacing);
    
    // Draw fraction line
    stroke(0);
    strokeWeight(lineWeight);
    line(x - lineWidth/2, y, x + lineWidth/2, y);
    noStroke();
    
    // Draw denominator with increased spacing
    text(denominator, x, y + spacing);
    
    textStyle(NORMAL);
}

// New function to draw grid numbers
function drawGridNumbers(x, y, num, den, isHorizontal) {
    push();
    translate(x, y);
    textAlign(CENTER, BOTTOM);
    textSize(min(gridSize/den/2, 16));
    fill(0);
    noStroke();
    
    if (isHorizontal) {
        // Numbers for horizontal sections
        const cellHeight = gridSize / den;
        for (let i = 0; i < num; i++) {
            text(i + 1, gridSize/2, (i + 1) * cellHeight);
        }
    } else {
        // Numbers for vertical sections
        const cellWidth = gridSize / den;
        for (let i = 0; i < num; i++) {
            text(i + 1, (i + 0.5) * cellWidth, 0);
        }
    }
    pop();
}