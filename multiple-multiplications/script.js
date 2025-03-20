// MVC Pattern Implementation

// Model - Manages data and business logic
class ExponentModel {
    constructor() {
        this.base = 2;  // Default to 2
        this.exponent = 0; // Default to 0
        this.observers = [];
    }

    setBase(base) {
        this.base = Number(base);
        this.notifyObservers();
    }

    setExponent(exponent) {
        this.exponent = Number(exponent);
        this.notifyObservers();
    }

    getResult() {
        return Math.pow(this.base, this.exponent);
    }

    // Get the expanded multiplication representation (e.g., 3 × 3 × 3)
    getExpandedMultiplication() {
        if (this.exponent <= 0) return '';
        
        const base = Math.floor(this.base);
        const times = Math.floor(this.exponent);
        return Array(times).fill(base).join(' × ');
    }

    addObserver(observer) {
        this.observers.push(observer);
    }

    notifyObservers() {
        this.observers.forEach(observer => observer.update(this));
    }
}

// View - Handles displaying information to the user
class ExponentView {
    constructor() {
        this.baseSlider = document.getElementById('base-slider');
        this.exponentSlider = document.getElementById('exponent-slider');
        this.baseValue = document.getElementById('base-value');
        this.exponentValue = document.getElementById('exponent-value');
        this.baseDisplay = document.getElementById('base-display');
        this.exponentDisplay = document.getElementById('exponent-display');
        this.baseResult = document.getElementById('base-result');
        this.exponentResult = document.getElementById('exponent-result');
        this.calculationResult = document.getElementById('calculation-result');
        
        // Initialize p5.js canvas
        this.sketch = new p5(this.createSketch.bind(this), 'canvas-container');
        
        // Initialize properties for the sketch
        this.canvasSize = { width: 0, height: 0 }; // Will be set dynamically in setup
        this.diamondColor = '#00C853'; // Green color for the diamond
        
        // Handle window resize
        window.addEventListener('resize', this.handleResize.bind(this));
    }
    
    handleResize() {
        if (this.sketch) {
            const container = document.getElementById('canvas-container');
            // Get the current width of the container
            const containerWidth = container.offsetWidth;
            
            // Calculate height to maintain 9:6 aspect ratio (height = width * 6/9)
            const containerHeight = containerWidth * (6/9);
            
            this.sketch.resizeCanvas(containerWidth, containerHeight);
            this.canvasSize = { width: containerWidth, height: containerHeight };
        }
    }

    createSketch(p) {
        const view = this;
        
        p.setup = function() {
            const container = document.getElementById('canvas-container');
            const containerWidth = container.offsetWidth;
            
            // Calculate height to maintain 9:6 aspect ratio (height = width * 6/9)
            const containerHeight = containerWidth * (6/9);
            
            p.createCanvas(containerWidth, containerHeight);
            p.angleMode(p.RADIANS);
            
            view.canvasSize = { width: containerWidth, height: containerHeight };
        };
        
        p.draw = function() {
            p.background(255);
            
            if (view.model) {
                const base = Math.floor(view.model.base);
                const exponent = Math.floor(view.model.exponent);
                const result = Math.floor(view.model.getResult());
                
                if (result === 0 || exponent === 0) {
                    // For exponent 0, show a single diamond (representing 1)
                    if (exponent === 0) {
                        p.fill(view.diamondColor);
                        p.noStroke();
                        const x = view.canvasSize.width / 2;
                        const y = view.canvasSize.height / 2;
                        const size = Math.min(view.canvasSize.width, view.canvasSize.height) * 0.3; // Increase size
                        
                        p.push();
                        p.translate(x, y);
                        p.beginShape();
                        p.vertex(0, -size/2);
                        p.vertex(size/2, 0);
                        p.vertex(0, size/2);
                        p.vertex(-size/2, 0);
                        p.endShape(p.CLOSE);
                        p.pop();
                        
                        // Display count
                        p.fill(80);
                        p.textSize(16);
                        p.textAlign(p.RIGHT, p.BOTTOM);
                        p.text(`Displaying 1 diamond (${base}^${exponent} = 1)`, view.canvasSize.width - 10, view.canvasSize.height - 10);
                    }
                    return;
                }
                
                const maxDiamonds = 10000; // Limit to prevent too many diamonds
                if (result > maxDiamonds) {
                    p.fill(100);
                    p.textSize(16);
                    p.textAlign(p.CENTER, p.CENTER);
                    p.text(`Result is too large to display: ${result}`, view.canvasSize.width/2, view.canvasSize.height/2);
                    return;
                }
                
                // Generate pattern based on the base value
                let pattern = [];
                
                switch(base) {
                    case 2:
                        pattern = this.createLinePattern(base, exponent, result);
                        break;
                    case 3:
                        pattern = this.createTrianglePattern(base, exponent, result);
                        break;
                    case 4:
                        pattern = this.createSquarePattern(base, exponent, result);
                        break;
                    case 5:
                        pattern = this.createHexagonalPattern(base, exponent, result);
                        break;
                    default:
                        // Fallback for other base values
                        pattern = this.createGenericPattern(base, exponent, result);
                }
                
                // Calculate diamond size based on pattern and available space
                const maxPatternWidth = Math.max(...pattern.map(p => p.x)) - Math.min(...pattern.map(p => p.x));
                const maxPatternHeight = Math.max(...pattern.map(p => p.y)) - Math.min(...pattern.map(p => p.y));
                
                // Adjust diamond size to fit the canvas
                const diamondSize = Math.min(
                    view.canvasSize.width / (maxPatternWidth + 5),
                    view.canvasSize.height / (maxPatternHeight + 5)
                ) * 0.8; // Adjust scale factor if needed
                
                // Ensure diamonds fit within the canvas
                const maxDiamondSize = Math.min(view.canvasSize.width, view.canvasSize.height) / 10;
                const adjustedDiamondSize = Math.min(diamondSize, maxDiamondSize) * 1.2;
                
                // Find the min values to center properly
                const minX = Math.min(...pattern.map(p => p.x));
                const minY = Math.min(...pattern.map(p => p.y));
                
                // Center the pattern
                const offsetX = (view.canvasSize.width - (maxPatternWidth * adjustedDiamondSize)) / 2 - minX * adjustedDiamondSize;
                const offsetY = (view.canvasSize.height - (maxPatternHeight * adjustedDiamondSize)) / 2 - minY * adjustedDiamondSize;
                
                // Draw diamonds
                for (const point of pattern) {
                    const x = offsetX + point.x * adjustedDiamondSize;
                    const y = offsetY + point.y * adjustedDiamondSize;
                    
                    p.push();
                    p.translate(x, y);
                    p.fill(view.diamondColor);
                    p.noStroke();
                    p.beginShape();
                    p.vertex(0, -adjustedDiamondSize/3);
                    p.vertex(adjustedDiamondSize/3, 0);
                    p.vertex(0, adjustedDiamondSize/3);
                    p.vertex(-adjustedDiamondSize/3, 0);
                    p.endShape(p.CLOSE);
                    p.pop();
                }
                
                // Display the count of diamonds
                p.fill(80);
                p.textSize(Math.max(10, Math.min(12, view.canvasSize.width / 50)));
                p.textAlign(p.RIGHT, p.BOTTOM);
                p.text(`Displaying ${pattern.length} diamonds (${base}^${exponent} = ${result})`, view.canvasSize.width - 10, view.canvasSize.height - 10);
            }
        };
        
        // Linear pattern for base 2 - creates groups of 2 in a linear arrangement
        p.createLinePattern = function(base, exponent, totalDiamonds) {
            const pattern = [];
            let xOffset = 0;
            
            for (let i = 0; i < totalDiamonds; i++) {
                pattern.push({ x: xOffset, y: 0 });
                xOffset += 1.5; // Adjust gap between diamonds
            }
            
            // Ensure we have exactly the right number of diamonds
            return pattern.slice(0, totalDiamonds);
        };
        
        // Triangle pattern for base 3 - creates a Sierpinski triangle
        p.createTrianglePattern = function(base, exponent, totalDiamonds) {
            const pattern = [];
            
            // For exponent 1, show 3 points in a simple triangle
            if (exponent === 1) {
                pattern.push({ x: 0, y: 0 });    // Top
                pattern.push({ x: -1, y: 1 });   // Bottom left
                pattern.push({ x: 1, y: 1 });    // Bottom right
                return pattern;
            }


            if (exponent === 2) {
                // Exponent 2 - Balanced triangle
                pattern.push({ x: 0, y: 0 }); // Top
        
                pattern.push({ x: -1, y: 1 });
                pattern.push({ x: 1, y: 1 });
        
                pattern.push({ x: -2, y: 3 });
                pattern.push({ x: -3, y: 4});
                pattern.push({ x: -1, y:4 });
        
                pattern.push({ x: 2, y: 3 });
                pattern.push({ x: 3, y: 4});
                pattern.push({ x: 1, y: 4});
        
                return pattern;
            }


            if (exponent === 3) {
                // Exponent 2 - Balanced triangle
                pattern.push({ x: 0, y: 0 }); // Top
        
                pattern.push({ x: -1, y: 1 });
                pattern.push({ x: 1, y: 1 });
        
                pattern.push({ x: -2, y: 3 });
                pattern.push({ x: -3, y: 4});
                pattern.push({ x: -1, y:4 });
        
                pattern.push({ x: 2, y: 3 });
                pattern.push({ x: 3, y: 4});
                pattern.push({ x: 1, y: 4});


                pattern.push({ x: -4, y: 6 }); // Top
        
                pattern.push({ x: -5, y: 7 });
                pattern.push({ x: -3, y: 7 });
        
                pattern.push({ x: -6, y: 9 });
                pattern.push({ x: -7, y: 10});
                pattern.push({ x: -5, y:10 });
        
                pattern.push({ x: -2, y: 9 });
                pattern.push({ x: -3, y: 10});
                pattern.push({ x: -1, y:10 });


                pattern.push({ x: 4, y: 6 }); // Top
        
                pattern.push({ x: 5, y: 7 });
                pattern.push({ x: 3, y: 7 });

                pattern.push({ x: 2, y: 9 });
                pattern.push({ x: 3, y: 10});
                pattern.push({ x: 1, y:10 });
        
                pattern.push({ x: 6, y: 9 });
                pattern.push({ x: 7, y: 10});
                pattern.push({ x: 5, y:10 });
        
                
        
                return pattern;
            }
            if (exponent === 4) {
                // Pattern #1 - Top of the large triangle
                pattern.push({ x: 0, y: 0 }); // Top
                pattern.push({ x: -1, y: 1 }); pattern.push({ x: 1, y: 1 });
                pattern.push({ x: -2, y: 3 }); pattern.push({ x: -3, y: 4}); pattern.push({ x: -1, y:4 });
                pattern.push({ x: 2, y: 3 }); pattern.push({ x: 3, y: 4}); pattern.push({ x: 1, y: 4});
                pattern.push({ x: -4, y: 6 }); // Top
                pattern.push({ x: -5, y: 7 }); pattern.push({ x: -3, y: 7 });
                pattern.push({ x: -6, y: 9 }); pattern.push({ x: -7, y: 10}); pattern.push({ x: -5, y:10 });
                pattern.push({ x: -2, y: 9 }); pattern.push({ x: -3, y: 10}); pattern.push({ x: -1, y:10 });
                pattern.push({ x: 4, y: 6 }); // Top
                pattern.push({ x: 5, y: 7 }); pattern.push({ x: 3, y: 7 });
                pattern.push({ x: 2, y: 9 }); pattern.push({ x: 3, y: 10}); pattern.push({ x: 1, y:10 });
                pattern.push({ x: 6, y: 9 }); pattern.push({ x: 7, y: 10}); pattern.push({ x: 5, y:10 });
                
                // Pattern #2 - Bottom left of the large triangle (shifted down and left)
                const offsetX = -8;
                const offsetY = 13;
                
                pattern.push({ x: 0 + offsetX, y: 0 + offsetY }); // Top
                pattern.push({ x: -1 + offsetX, y: 1 + offsetY }); pattern.push({ x: 1 + offsetX, y: 1 + offsetY });
                pattern.push({ x: -2 + offsetX, y: 3 + offsetY }); pattern.push({ x: -3 + offsetX, y: 4 + offsetY}); pattern.push({ x: -1 + offsetX, y: 4 + offsetY });
                pattern.push({ x: 2 + offsetX, y: 3 + offsetY }); pattern.push({ x: 3 + offsetX, y: 4 + offsetY}); pattern.push({ x: 1 + offsetX, y: 4 + offsetY});
                pattern.push({ x: -4 + offsetX, y: 6 + offsetY }); // Top
                pattern.push({ x: -5 + offsetX, y: 7 + offsetY }); pattern.push({ x: -3 + offsetX, y: 7 + offsetY });
                pattern.push({ x: -6 + offsetX, y: 9 + offsetY }); pattern.push({ x: -7 + offsetX, y: 10 + offsetY}); pattern.push({ x: -5 + offsetX, y: 10 + offsetY });
                pattern.push({ x: -2 + offsetX, y: 9 + offsetY }); pattern.push({ x: -3 + offsetX, y: 10 + offsetY}); pattern.push({ x: -1 + offsetX, y: 10 + offsetY });
                pattern.push({ x: 4 + offsetX, y: 6 + offsetY }); // Top
                pattern.push({ x: 5 + offsetX, y: 7 + offsetY }); pattern.push({ x: 3 + offsetX, y: 7 + offsetY });
                pattern.push({ x: 2 + offsetX, y: 9 + offsetY }); pattern.push({ x: 3 + offsetX, y: 10 + offsetY}); pattern.push({ x: 1 + offsetX, y: 10 + offsetY });
                pattern.push({ x: 6 + offsetX, y: 9 + offsetY }); pattern.push({ x: 7 + offsetX, y: 10 + offsetY}); pattern.push({ x: 5 + offsetX, y: 10 + offsetY });
                
                // Pattern #3 - Bottom right of the large triangle (shifted down and right)
                const offsetX2 = 8;
                const offsetY2 = 13;
                
                pattern.push({ x: 0 + offsetX2, y: 0 + offsetY2 }); // Top
                pattern.push({ x: -1 + offsetX2, y: 1 + offsetY2 }); pattern.push({ x: 1 + offsetX2, y: 1 + offsetY2 });
                pattern.push({ x: -2 + offsetX2, y: 3 + offsetY2 }); pattern.push({ x: -3 + offsetX2, y: 4 + offsetY2}); pattern.push({ x: -1 + offsetX2, y: 4 + offsetY2 });
                pattern.push({ x: 2 + offsetX2, y: 3 + offsetY2 }); pattern.push({ x: 3 + offsetX2, y: 4 + offsetY2}); pattern.push({ x: 1 + offsetX2, y: 4 + offsetY2});
                pattern.push({ x: -4 + offsetX2, y: 6 + offsetY2 }); // Top
                pattern.push({ x: -5 + offsetX2, y: 7 + offsetY2 }); pattern.push({ x: -3 + offsetX2, y: 7 + offsetY2 });
                pattern.push({ x: -6 + offsetX2, y: 9 + offsetY2 }); pattern.push({ x: -7 + offsetX2, y: 10 + offsetY2}); pattern.push({ x: -5 + offsetX2, y: 10 + offsetY2 });
                pattern.push({ x: -2 + offsetX2, y: 9 + offsetY2 }); pattern.push({ x: -3 + offsetX2, y: 10 + offsetY2}); pattern.push({ x: -1 + offsetX2, y: 10 + offsetY2 });
                pattern.push({ x: 4 + offsetX2, y: 6 + offsetY2 }); // Top
                pattern.push({ x: 5 + offsetX2, y: 7 + offsetY2 }); pattern.push({ x: 3 + offsetX2, y: 7 + offsetY2 });
                pattern.push({ x: 2 + offsetX2, y: 9 + offsetY2 }); pattern.push({ x: 3 + offsetX2, y: 10 + offsetY2}); pattern.push({ x: 1 + offsetX2, y: 10 + offsetY2 });
                pattern.push({ x: 6 + offsetX2, y: 9 + offsetY2 }); pattern.push({ x: 7 + offsetX2, y: 10 + offsetY2}); pattern.push({ x: 5 + offsetX2, y: 10 + offsetY2 });
                
                return pattern;
            }
            if (exponent === 5) {
                const basePattern = [
                    { x: 0, y: 0 },
                    { x: -1, y: 1 }, { x: 1, y: 1 },
                    { x: -2, y: 3 }, { x: -3, y: 4 }, { x: -1, y: 4 },
                    { x: 2, y: 3 }, { x: 3, y: 4 }, { x: 1, y: 4 },
                    { x: -4, y: 6 },
                    { x: -5, y: 7 }, { x: -3, y: 7 },
                    { x: -6, y: 9 }, { x: -7, y: 10 }, { x: -5, y: 10 },
                    { x: -2, y: 9 }, { x: -3, y: 10 }, { x: -1, y: 10 },
                    { x: 4, y: 6 },
                    { x: 5, y: 7 }, { x: 3, y: 7 },
                    { x: 2, y: 9 }, { x: 3, y: 10 }, { x: 1, y: 10 },
                    { x: 6, y: 9 }, { x: 7, y: 10 }, { x: 5, y: 10 }
                ];

                const mainOffsets = [
                    { x: 0, y: 0 },              // Top position
                    { x: -20, y: 30 },           // Bottom left of large triangle
                    { x: 20, y: 30 }             // Bottom right of large triangle
                ];
        
                // Sub-pattern offsets within each main offset
                const subOffsets = [
                    { x: 0, y: 0 },              // Center sub-pattern
                    { x: -10, y: 15 },           // Bottom left sub-pattern
                    { x: 10, y: 15 }             // Bottom right sub-pattern
                ];
        
                mainOffsets.forEach(mainOffset => {
                    subOffsets.forEach(subOffset => {
                        basePattern.forEach(point => {
                            pattern.push({
                                x: point.x + mainOffset.x + subOffset.x,
                                y: point.y + mainOffset.y + subOffset.y
                            });
                        });
                    });
                });
                
            return pattern;
            }
            // Create a recursive Sierpinski triangle pattern
            // const createSierpinskiTriangle = (x, y, size, level) => {
            //     if (level === 1) {
            //         // Base case: Draw a triangle with 3 points
            //         pattern.push({ x, y });                        // Top
            //         pattern.push({ x: x - size, y: y + size });    // Bottom left
            //         pattern.push({ x: x + size, y: y + size });    // Bottom right
            //         return;           
            //     }
                
            //     // Recursive case: Create 3 smaller triangles
            //     const newSize = size / 2;
                
            //     // Top triangle
            //     createSierpinskiTriangle(x, y, newSize, level - 1);
                
            //     // Bottom left triangle
            //     createSierpinskiTriangle(x - newSize, y + newSize, newSize, level - 1);
                
            //     // Bottom right triangle
            //     createSierpinskiTriangle(x + newSize, y + newSize, newSize, level - 1);
            // };
            
            // // Start the Sierpinski triangle with appropriate size
            // const startSize = Math.pow(2, exponent - 1);
            // createSierpinskiTriangle(0, 0, startSize, exponent);
            
            // // Ensure we have exactly the right number of diamonds
            // return pattern.slice(0, totalDiamonds);
        };

        // Square pattern for base 4 - creates a grid-like pattern
        p.createSquarePattern = function(base, exponent, totalDiamonds) {
            const pattern = [];
            
            // For exponent 1, just show 4 points in a square
            if (exponent === 1) {
                pattern.push({ x: 0, y: 0 });    // Top left
                pattern.push({ x: 1, y: 0 });    // Top right
                pattern.push({ x: 0, y: 1 });    // Bottom left
                pattern.push({ x: 1, y: 1 });    // Bottom right
                return pattern;
            }
            

            if(exponent === 2){
                const squareSize = 2; // 2x2 square

                // Define the position of each square (top-left, top-right, bottom-left, bottom-right)
                const offsets = [
                    { x: -3, y: -3 }, // Top left
                    { x: 1, y: -3 },  // Top right
                    { x: -3, y: 1 },  // Bottom left
                    { x: 1, y: 1 }    // Bottom right
                ];
            
                // Create four 2x2 squares at the defined offsets
                offsets.forEach(offset => {
                    for (let y = 0; y < squareSize; y++) {
                        for (let x = 0; x < squareSize; x++) {
                            pattern.push({
                                x: x + offset.x,
                                y: y + offset.y
                            });
                        }
                    }
                });
                        return pattern
            }
                
            if(exponent === 3){
                const smallSquareSize = 2; // 2x2 points per smaller square
                const gapBetweenSmallSquares = 1;
                const largeSquareSize = (smallSquareSize * 2) + gapBetweenSmallSquares; // Larger square size
                console.log(largeSquareSize,    'largesquare')
                const gapBetweenLargeSquares = largeSquareSize -1; // Gap between larger squares
        
                // Define the position of each larger square (top-left, top-right, bottom-left, bottom-right)
                const offsets = [
                    { x: -gapBetweenLargeSquares, y: -gapBetweenLargeSquares }, // Top left
                    { x: gapBetweenLargeSquares, y: -gapBetweenLargeSquares },  // Top right
                    { x: -gapBetweenLargeSquares, y: gapBetweenLargeSquares },  // Bottom left
                    { x: gapBetweenLargeSquares, y: gapBetweenLargeSquares }    // Bottom right
                ];
        
                // Generate 4 larger squares
                offsets.forEach(offset => {
                    for (let row = 0; row < 2; row++) {
                        for (let col = 0; col < 2; col++) {
                            // Position of smaller square inside larger square
                            let offsetX = offset.x + col * (smallSquareSize + gapBetweenSmallSquares);
                            let offsetY = offset.y + row * (smallSquareSize + gapBetweenSmallSquares);
        
                            // Generate 2×2 points for smaller square
                            for (let y = 0; y < smallSquareSize; y++) {
                                for (let x = 0; x < smallSquareSize; x++) {
                                    pattern.push({
                                        x: offsetX + x,
                                        y: offsetY + y
                                    });
                                }
                            }
                        }
                    }
                });
        return pattern
            }


            if(exponent === 4){
                const smallSquareSize = 2;
        const gapBetweenSmallSquares = 1;
        const largeSquareSize = (smallSquareSize * 2) + gapBetweenSmallSquares;
        const gapBetweenLargeSquares = largeSquareSize - 1;
        const wholeSquareSize = (largeSquareSize * 2) + gapBetweenLargeSquares;
        const gapBetweenWholeSquares = wholeSquareSize - 5;

        // Define the position of each whole square (forming a bigger square)
        const wholeSquareOffsets = [
            { x: -gapBetweenWholeSquares, y: -gapBetweenWholeSquares }, // Top left
            { x: gapBetweenWholeSquares, y: -gapBetweenWholeSquares },  // Top right
            { x: -gapBetweenWholeSquares, y: gapBetweenWholeSquares },  // Bottom left
            { x: gapBetweenWholeSquares, y: gapBetweenWholeSquares }    // Bottom right
        ];

        wholeSquareOffsets.forEach(wholeOffset => {
            // Define the position of each larger square (inside the whole square)
            const largeSquareOffsets = [
                { x: -gapBetweenLargeSquares, y: -gapBetweenLargeSquares }, // Top left
                { x: gapBetweenLargeSquares, y: -gapBetweenLargeSquares },  // Top right
                { x: -gapBetweenLargeSquares, y: gapBetweenLargeSquares },  // Bottom left
                { x: gapBetweenLargeSquares, y: gapBetweenLargeSquares }    // Bottom right
            ];

            largeSquareOffsets.forEach(largeOffset => {
                for (let row = 0; row < 2; row++) {
                    for (let col = 0; col < 2; col++) {
                        let offsetX = wholeOffset.x + largeOffset.x + col * (smallSquareSize + gapBetweenSmallSquares);
                        let offsetY = wholeOffset.y + largeOffset.y + row * (smallSquareSize + gapBetweenSmallSquares);

                        // Generate 2×2 points for smaller square
                        for (let y = 0; y < smallSquareSize; y++) {
                            for (let x = 0; x < smallSquareSize; x++) {
                                pattern.push({
                                    x: offsetX + x,
                                    y: offsetY + y
                                });
                            }
                        }
                    }
                }
            });
        });
        return pattern
            }


            if(exponent === 5){
                const smallSquareSize = 2;
        const gapBetweenSmallSquares = 1;
        const largeSquareSize = (smallSquareSize * 2) + gapBetweenSmallSquares;
        const gapBetweenLargeSquares = largeSquareSize - 1;
        const wholeSquareSize = (largeSquareSize * 2) + gapBetweenLargeSquares;
        const gapBetweenWholeSquares = wholeSquareSize - 5;
        const biggerSquareSize = (wholeSquareSize * 2) + gapBetweenWholeSquares;
        const gapBetweenBiggerSquares = biggerSquareSize - 17;
        const superSquareSize = (biggerSquareSize * 2) + gapBetweenBiggerSquares;

        // Define the position of each bigger square (forming a super square)
        const superSquareOffsets = [
            { x: -gapBetweenBiggerSquares, y: -gapBetweenBiggerSquares }, // Top left
            { x: gapBetweenBiggerSquares, y: -gapBetweenBiggerSquares },  // Top right
            { x: -gapBetweenBiggerSquares, y: gapBetweenBiggerSquares },  // Bottom left
            { x: gapBetweenBiggerSquares, y: gapBetweenBiggerSquares }    // Bottom right
        ];

        superSquareOffsets.forEach(superOffset => {
            // Define the position of each whole square (inside the bigger square)
            const biggerSquareOffsets = [
                { x: -gapBetweenWholeSquares, y: -gapBetweenWholeSquares },
                { x: gapBetweenWholeSquares, y: -gapBetweenWholeSquares },
                { x: -gapBetweenWholeSquares, y: gapBetweenWholeSquares },
                { x: gapBetweenWholeSquares, y: gapBetweenWholeSquares }
            ];

            biggerSquareOffsets.forEach(biggerOffset => {
                // Define the position of each larger square (inside the whole square)
                const wholeSquareOffsets = [
                    { x: -gapBetweenLargeSquares, y: -gapBetweenLargeSquares },
                    { x: gapBetweenLargeSquares, y: -gapBetweenLargeSquares },
                    { x: -gapBetweenLargeSquares, y: gapBetweenLargeSquares },
                    { x: gapBetweenLargeSquares, y: gapBetweenLargeSquares }
                ];

                wholeSquareOffsets.forEach(wholeOffset => {
                    for (let row = 0; row < 2; row++) {
                        for (let col = 0; col < 2; col++) {
                            let offsetX = superOffset.x + biggerOffset.x + wholeOffset.x + col * (smallSquareSize + gapBetweenSmallSquares);
                            let offsetY = superOffset.y + biggerOffset.y + wholeOffset.y + row * (smallSquareSize + gapBetweenSmallSquares);

                            // Generate 2×2 points for smaller square
                            for (let y = 0; y < smallSquareSize; y++) {
                                for (let x = 0; x < smallSquareSize; x++) {
                                    pattern.push({
                                        x: offsetX + x,
                                        y: offsetY + y
                                    });
                                }
                            }
                        }
                    }
                });
            });
        });
        return pattern
            }
            // Create a grid pattern
            const gridSize = Math.ceil(Math.sqrt(totalDiamonds));
            for (let i = 0; i < gridSize; i++) {
                for (let j = 0; j < gridSize; j++) {
                    if (pattern.length < totalDiamonds) {
                        pattern.push({ x: i, y: j });
                    }
                }
            }
            
            // Ensure we have exactly the right number of diamonds
            return pattern.slice(0, totalDiamonds);
        };
        
        // Hexagonal pattern for base 5 - creates a hexagonal arrangement
        p.createHexagonalPattern = function(base, exponent, totalDiamonds) {
            const pattern = [];
            
            if (exponent === 1) {
                // For exponent 1, create a simple pentagon
                const radius = 2;
                for (let i = 0; i < 5; i++) {
                    const angle = (i * 2 * Math.PI / 5) - Math.PI/2;
                    pattern.push({ 
                        x: radius + Math.cos(angle) * radius,
                        y: radius + Math.sin(angle) * radius
                    });
                }
                return pattern;
            }
            
            // For higher exponents, create a recursive pattern with pentagonal symmetry
            
            // Helper function to create a pentagon of points
            const createPentagon = (centerX, centerY, radius, rotation = 0) => {
                const points = [];
                for (let i = 0; i < 5; i++) {
                    const angle = rotation + (i * 2 * Math.PI / 5) - Math.PI/2;
                    points.push({ 
                        x: centerX + Math.cos(angle) * radius,
                        y: centerY + Math.sin(angle) * radius
                    });
                }
                return points;
            };
            
            // Recursive function to generate pentagonal fractal
            const generatePentagonalFractal = (x, y, radius, level, rotation = 0) => {
                if (level === 1 || pattern.length >= totalDiamonds) {
                    // Add a pentagon of points
                    pattern.push(...createPentagon(x, y, radius, rotation));
                    return;
                }
                
                // Add center point
                pattern.push({ x, y });
                
                // Add the current pentagon
                const pentagonPoints = createPentagon(x, y, radius, rotation);
                
                // For each point in the pentagon, create a smaller pentagon
                const newRadius = radius * 0.4;
                for (const point of pentagonPoints) {
                    generatePentagonalFractal(
                        point.x, 
                        point.y, 
                        newRadius, 
                        level - 1,
                        // Rotate each level slightly for better distribution
                        rotation + Math.PI/5
                    );
                }
            };
            
            // Start the pentagonal fractal
            const centerX = 25;
            const centerY = 25;
            const startRadius = 20;
            
            generatePentagonalFractal(centerX, centerY, startRadius, exponent);
            
            // If we need more points, add concentric pentagons
            if (pattern.length < totalDiamonds) {
                let additionalRadius = startRadius * 1.5;
                while (pattern.length < totalDiamonds) {
                    pattern.push(...createPentagon(centerX, centerY, additionalRadius));
                    additionalRadius += 5;
                    
                    // Safety break
                    if (additionalRadius > 200) break;
                }
            }
            
            // Ensure we have exactly the right number of diamonds
            return pattern.slice(0, totalDiamonds);
        };
        
        // Generic pattern for other base values
        p.createGenericPattern = function(base, exponent, totalDiamonds) {
            const pattern = [];
            
            if (exponent === 1) {
                // For exponent 1, create a simple polygon with 'base' sides
                const radius = 2;
                for (let i = 0; i < base; i++) {
                    const angle = (i * 2 * Math.PI / base) - Math.PI/2;
                    pattern.push({ 
                        x: radius * 2 + Math.cos(angle) * radius,
                        y: radius * 2 + Math.sin(angle) * radius
                    });
                }
                return pattern;
            }
            
            // For higher values, use a spiral pattern that grows with the base
            const createSpiral = () => {
                const a = 0.5; // Parameter controlling spiral tightness
                const b = 0.2; // Parameter controlling spiral growth
                
                for (let i = 0; i < totalDiamonds; i++) {
                    const angle = a * i;
                    const radius = b * Math.sqrt(i);
                    pattern.push({
                        x: 25 + Math.cos(angle) * radius,
                        y: 25 + Math.sin(angle) * radius
                    });
                }
            };
            
            createSpiral();
            
            return pattern.slice(0, totalDiamonds);
        };
        
        p.windowResized = function() {
            view.handleResize();
        };
    }

    bindEvents(controller) {
        this.baseSlider.addEventListener('input', () => {
            controller.handleBaseChange(this.baseSlider.value);
        });
        
        this.exponentSlider.addEventListener('input', () => {
            controller.handleExponentChange(this.exponentSlider.value);
        });
    }

    update(model) {
        this.model = model;
        
        const base = Math.floor(model.base);
        const exponent = Math.floor(model.exponent);
        const result = Math.floor(model.getResult());
        
        // Update slider display values
        this.baseValue.textContent = base;
        this.exponentValue.textContent = exponent;
        
        // Update equation display
        this.baseDisplay.textContent = base;
        this.exponentDisplay.textContent = exponent;
        
        // Update result display
        this.baseResult.textContent = base;
        this.exponentResult.textContent = exponent;
        
        // Show expanded multiplication for exponents > 1
        if (exponent > 1) {
            this.calculationResult.textContent = `${model.getExpandedMultiplication()} = ${result}`;
        } else {
            this.calculationResult.textContent = result;
        }
        
        // The p5 sketch will update in its draw loop
    }
}

// Controller - Acts as an interface between Model and View
class ExponentController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        
        // Set up the view and model connections
        view.bindEvents(this);
        model.addObserver(view);
        
        // Initialize with default values
        model.notifyObservers();
    }

    handleBaseChange(baseValue) {
        this.model.setBase(baseValue);
    }

    handleExponentChange(exponentValue) {
        this.model.setExponent(exponentValue);
    }
}

// Initialize the application when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    const model = new ExponentModel();
    const view = new ExponentView();
    const controller = new ExponentController(model, view);
    
    // Initial resize to set the correct aspect ratio
    setTimeout(() => {
        view.handleResize();
    }, 100);
    
    // Add another resize handler after page fully loads
    window.addEventListener('load', () => {
        view.handleResize();
    });
});