// MVC Pattern Implementation

// ===================== MODEL =====================
class Model {
    constructor() {
        this.data = {
            minValue: -2,
            maxValue: 2,
            majorTickInterval: 0.25,
            minorTicksPerMajor: 3, // Changed from 2 to 3 to have 2 minor ticks between major ticks
            currentValue: 0,
            displayFormat: 'fraction', // Default to fraction display
            userValue: 0, // Add this for the draggable purple point
            isDragging: false // Track if user is dragging the point
        };
    }
    
    // Update slider appearance method to add HTML elements for labels
    setupSlider() {
        const slider = document.getElementById('value-slider');
        if (slider) {
            // Increase the width of the slider
            slider.style.width = '300px';
            
            slider.min = "1";
            slider.max = "3";
            slider.step = "1";
            slider.value = "2"; // Start at the first position
            
            // Create slider labels container
            const sliderContainer = slider.parentElement;
            const labelsContainer = document.createElement('div');
            labelsContainer.className = 'slider-labels';
            
            // Create the three labels
            const decimalLabel = document.createElement('div');
            decimalLabel.textContent = 'Decimal';
            decimalLabel.className = 'slider-label';
            
            const properLabel = document.createElement('div');
            properLabel.innerHTML = 'Proper<br>fraction';
            properLabel.className = 'slider-label';
            
            const improperLabel = document.createElement('div');
            improperLabel.innerHTML = 'Improper<br>fraction';
            improperLabel.className = 'slider-label';
            
            // Add labels to container
            labelsContainer.appendChild(decimalLabel);
            labelsContainer.appendChild(properLabel);
            labelsContainer.appendChild(improperLabel);
            
            // Insert labels below the slider
            sliderContainer.appendChild(labelsContainer);
        }
    }
}

// ===================== VIEW =====================
class View {
    constructor() {
        // Initialize view elements
        this.p5Instance = null;
        this.slider = document.getElementById('value-slider');
        this.sliderValueDisplay = document.getElementById('slider-value');
        this.exampleButton = document.getElementById('example-btn');
        this.setupCanvas();
    }
    
    // P5.js setup and draw functions
    setupCanvas() {
        const canvasContainer = document.getElementById('canvas-container');
        const view = this;
        
        this.p5Instance = new p5(function(p) {
            p.setup = function() {
                let canvas = p.createCanvas(900, 400);
                // Make canvas background transparent
                canvas.style('background-color', 'transparent');
                p.textAlign(p.CENTER, p.CENTER);
            };
            
            // Add these mouse event functions directly to p
            p.mousePressed = function() {
                if (view.model) {
                    const data = view.model.data;
                    const margin = 50;
                    const lineY = 100;
                    const lineLength = p.width - 2 * margin;
                    const range = data.maxValue - data.minValue;
                    const pixelsPerUnit = lineLength / range;
                    
                    // Calculate x position for the user value
                    const x = margin + (data.userValue - data.minValue) * pixelsPerUnit;
                    
                    // Check if mouse is over the purple point (with some tolerance)
                    if (p.dist(p.mouseX, p.mouseY, x, lineY) < 15) {
                        data.isDragging = true;
                        return false; // Prevent default behavior
                    }
                }
                return true;
            };
            
            p.mouseDragged = function() {
                if (view.model && view.model.data.isDragging) {
                    const data = view.model.data;
                    const margin = 50;
                    const lineLength = p.width - 2 * margin;
                    const range = data.maxValue - data.minValue;
                    
                    // Calculate new value based on mouse position
                    let newX = p.constrain(p.mouseX, margin, margin + lineLength);
                    let newValue = data.minValue + (newX - margin) * (range / lineLength);
                    
                    // Snap to the nearest tick mark
                    const minorInterval = data.majorTickInterval / data.minorTicksPerMajor;
                    newValue = Math.round(newValue / minorInterval) * minorInterval;
                    
                    // Update the model with the new value
                    data.userValue = newValue;
                    
                    // Redraw the canvas
                    p.redraw();
                    return false; // Prevent default behavior
                }
                return true;
            };
            
            p.mouseReleased = function() {
                if (view.model) {
                    view.model.data.isDragging = false;
                    p.redraw();
                }
                return true;
            };
            
            p.draw = function() {
                p.clear(); // Clear without setting background color
                drawNumberLine(p, view.model.data);
                
                // Draw the purple user point
                if (view.model.data.userValue !== undefined) {
                    drawUserPoint(p, view.model.data);
                }
                
                // Draw the example point if it exists
                if (view.model.data.exampleValue !== undefined) {
                    drawExamplePoint(p, view.model.data);
                }
                
                // Draw the question point if it exists
                if (view.model.data.questionValue !== undefined) {
                    drawQuestionPoint(p, view.model.data);
                    
                    // Compare purple and brown points and show the result
                    if (view.model.data.userValue !== undefined) {
                        comparePoints(p, view.model.data);
                    }
                }
            };
            
            // Consolidated function to format numbers as fractions with different display options
            function formatNumber(value, format) {
                // Handle special cases
                if (value === 0) return "0";
                if (Number.isInteger(value) && format !== 'improper') return value.toString();
                
                const isNegative = value < 0;
                const absValue = Math.abs(value);
                
                // Format based on the requested style
                if (format === 'decimal') {
                    return value.toFixed(2);
                } else if (format === 'improper') {
                    return formatImproperFraction(absValue, isNegative);
                } else {
                    // Default: mixed/proper fraction format
                    return formatMixedFraction(absValue, isNegative);
                }
            }
            
            // Helper for improper fractions
            function formatImproperFraction(absValue, isNegative) {
                // Convert all fractions to structured objects for stacked rendering
                const fractionMap = {
                    '0.25': { numerator: 1, denominator: 4 },
                    '0.5': { numerator: 1, denominator: 2 },
                    '0.75': { numerator: 3, denominator: 4 },
                    '0.083': { numerator: 1, denominator: 12 },
                    '0.167': { numerator: 1, denominator: 6 },
                    '0.333': { numerator: 1, denominator: 3 },
                    '0.417': { numerator: 5, denominator: 12 },
                    '0.583': { numerator: 7, denominator: 12 },
                    '0.667': { numerator: 2, denominator: 3 },
                    '0.833': { numerator: 5, denominator: 6 },
                    '0.917': { numerator: 11, denominator: 12 },
                    '1.25': { numerator: 5, denominator: 4 },
                    '1.5': { numerator: 3, denominator: 2 },
                    '1.75': { numerator: 7, denominator: 4 },
                    '1.083': { numerator: 13, denominator: 12 },
                    '1.167': { numerator: 7, denominator: 6 },
                    '1.333': { numerator: 4, denominator: 3 },
                    '1.417': { numerator: 17, denominator: 12 },
                    '1.583': { numerator: 19, denominator: 12 },
                    '1.667': { numerator: 5, denominator: 3 },
                    '1.833': { numerator: 11, denominator: 6 },
                    '1.917': { numerator: 23, denominator: 12 }
                };
                
                // Check for common fractions
                for (let key in fractionMap) {
                    if (Math.abs(absValue - parseFloat(key)) < 0.001) {
                        return {
                            type: 'improperFraction',
                            isNegative: isNegative,
                            numerator: fractionMap[key].numerator,
                            denominator: fractionMap[key].denominator
                        };
                    }
                }
                
                // For other values, compute the fraction
                const precision = 100;
                let numerator = Math.round(absValue * precision);
                let denominator = precision;
                
                // Find greatest common divisor
                const gcd = findGCD(numerator, denominator);
                
                // Simplify the fraction
                numerator = Math.round(numerator / gcd);
                denominator = Math.round(denominator / gcd);
                
                return {
                    type: 'improperFraction',
                    isNegative: isNegative,
                    numerator: numerator,
                    denominator: denominator
                };
            }
            
            // Helper for mixed/proper fractions
            function formatMixedFraction(absValue, isNegative) {
                // Handle whole numbers
                if (Number.isInteger(absValue)) return (isNegative ? "-" : "") + absValue;
                
                // Map of common fractions for proper rendering
                const fractionMap = {
                    '0.25': { numerator: 1, denominator: 4 },
                    '0.5': { numerator: 1, denominator: 2 },
                    '0.75': { numerator: 3, denominator: 4 },
                    '0.083': { numerator: 1, denominator: 12 },
                    '0.167': { numerator: 1, denominator: 6 },
                    '0.333': { numerator: 1, denominator: 3 },
                    '0.417': { numerator: 5, denominator: 12 },
                    '0.583': { numerator: 7, denominator: 12 },
                    '0.667': { numerator: 2, denominator: 3 },
                    '0.833': { numerator: 5, denominator: 6 },
                    '0.917': { numerator: 11, denominator: 12 }
                };
                
                const mixedFractionMap = {
                    '1.25': { wholePart: 1, numerator: 1, denominator: 4 },
                    '1.5': { wholePart: 1, numerator: 1, denominator: 2 },
                    '1.75': { wholePart: 1, numerator: 3, denominator: 4 },
                    '1.083': { wholePart: 1, numerator: 1, denominator: 12 },
                    '1.167': { wholePart: 1, numerator: 1, denominator: 6 },
                    '1.333': { wholePart: 1, numerator: 1, denominator: 3 },
                    '1.417': { wholePart: 1, numerator: 5, denominator: 12 },
                    '1.583': { wholePart: 1, numerator: 7, denominator: 12 },
                    '1.667': { wholePart: 1, numerator: 2, denominator: 3 },
                    '1.833': { wholePart: 1, numerator: 5, denominator: 6 },
                    '1.917': { wholePart: 1, numerator: 11, denominator: 12 }
                };
                
                // Check for proper fractions
                for (let key in fractionMap) {
                    if (Math.abs(absValue - parseFloat(key)) < 0.001) {
                        return {
                            type: 'properFraction',
                            isNegative: isNegative,
                            numerator: fractionMap[key].numerator,
                            denominator: fractionMap[key].denominator
                        };
                    }
                }
                
                // Check for mixed fractions
                for (let key in mixedFractionMap) {
                    if (Math.abs(absValue - parseFloat(key)) < 0.001) {
                        return {
                            type: 'mixedFraction',
                            isNegative: isNegative,
                            wholePart: mixedFractionMap[key].wholePart,
                            numerator: mixedFractionMap[key].numerator,
                            denominator: mixedFractionMap[key].denominator
                        };
                    }
                }
                
                // For other values, convert to proper fraction
                const precision = 100;
                let numerator = Math.round(absValue * precision);
                let denominator = precision;
                
                // Find greatest common divisor
                const gcd = findGCD(numerator, denominator);
                
                // Simplify the fraction
                numerator = Math.round(numerator / gcd);
                denominator = Math.round(denominator / gcd);
                
                // Format as mixed number if needed
                if (numerator > denominator) {
                    const wholePart = Math.floor(numerator / denominator);
                    const remainder = numerator % denominator;
                    
                    if (remainder === 0) {
                        return (isNegative ? "-" : "") + wholePart;
                    } else {
                        return {
                            type: 'mixedFraction',
                            isNegative: isNegative,
                            wholePart: wholePart,
                            numerator: remainder,
                            denominator: denominator
                        };
                    }
                } else {
                    return {
                        type: 'properFraction',
                        isNegative: isNegative,
                        numerator: numerator,
                        denominator: denominator
                    };
                }
            }
            
            // Helper function to find greatest common divisor
            function findGCD(a, b) {
                return b === 0 ? a : findGCD(b, a % b);
            }
            
            // Function to compare points and display the result
            function comparePoints(p, data) {
                const { userValue, questionValue, displayFormat, questionFormat } = data;
                
                // Format purple value based on slider's display format
                let purpleValueText = formatNumber(userValue, displayFormat);
                
                // Format brown value using its original format
                let brownValueText = formatNumber(questionValue, questionFormat);
                
                // Determine comparison symbol
                let comparisonSymbol;
                if (userValue < questionValue) {
                    comparisonSymbol = "<";
                } else if (userValue > questionValue) {
                    comparisonSymbol = ">";
                } else {
                    comparisonSymbol = "=";
                }
                
                // Use larger text size for better visibility
                p.textSize(24);
                p.noStroke();
                
                // Draw purple value
                p.fill(138, 43, 226); // Purple
                drawFormattedNumber(p, purpleValueText, 380, 260);
                
                // Draw comparison symbol
                p.fill(0); // Black
                p.text(comparisonSymbol, 430, 260);
                
                // Draw brown value
                p.fill(139, 69, 19); // Brown
                drawFormattedNumber(p, brownValueText, 470, 260);
            }
            
            // Helper function to draw formatted numbers
            function drawFormattedNumber(p, formatted, x, y) {
                if (typeof formatted === 'string') {
                    p.text(formatted, x, y);
                } else if (formatted.type === 'properFraction' || formatted.type === 'improperFraction') {
                    const offset = 8;
                    p.textSize(16);
                    // Draw negative sign if present
                    if (formatted.isNegative) {
                        p.text("-", x - 5, y);
                        x += 10; // Adjust x position to account for negative sign
                    }
                    // Draw numerator and denominator
                    p.text(formatted.numerator, x, y - offset);
                    p.text(formatted.denominator, x, y + offset);
                    // Draw fraction line
                    p.stroke(0);
                    p.strokeWeight(1);
                    p.line(x - 10, y, x + 10, y);
                    p.noStroke();
                } else if (formatted.type === 'mixedFraction') {
                    p.textSize(16);
                    // Draw negative sign if present
                    if (formatted.isNegative) {
                        p.text("-", x - 5, y);
                        x += 10; // Adjust x position
                    }
                    // Draw whole part and fraction
                    p.text(formatted.wholePart, x - 10, y);
                    p.text(formatted.numerator, x + 10, y - 8);
                    p.text(formatted.denominator, x + 10, y + 8);
                    // Draw fraction line
                    p.stroke(0);
                    p.strokeWeight(1);
                    p.line(x, y, x + 20, y);
                    p.noStroke();
                }
            }
            
            // Function to draw the user's purple point
            function drawUserPoint(p, data) {
                const { minValue, maxValue, userValue, displayFormat, isDragging } = data;
                
                // Calculate positions
                const margin = 50;
                const lineY = 100;
                const lineLength = p.width - 2 * margin;
                
                // Calculate scale factor
                const range = maxValue - minValue;
                const pixelsPerUnit = lineLength / range;
                
                // Calculate x position for the user value
                const x = margin + (userValue - minValue) * pixelsPerUnit;
                
                // Draw a purple point at the user value
                p.noStroke();
                p.fill(138, 43, 226); // BlueViolet
                const pointSize = isDragging ? 15 : 12;
                p.ellipse(x, lineY, pointSize, pointSize);
                
                // Format the value based on slider's display format
                let valueText = formatNumber(userValue, displayFormat);
                
                // Draw the value above the point
                p.fill(138, 43, 226); // BlueViolet
                p.textSize(16);
                drawFormattedNumber(p, valueText, x, lineY - 30);
            }
            
            function drawNumberLine(p, data) {
                const { minValue, maxValue, majorTickInterval, minorTicksPerMajor, displayFormat } = data;
                
                // Calculate positions
                const margin = 50;
                const lineY = 100;
                const lineLength = p.width - 2 * margin;
                
                // Draw main line
                p.stroke(0);
                p.strokeWeight(2);
                p.line(margin, lineY, p.width - margin, lineY);
                
                // Calculate scale factor
                const range = maxValue - minValue;
                const pixelsPerUnit = lineLength / range;
                
                // Draw major ticks and labels
                for (let value = minValue; value <= maxValue; value += majorTickInterval) {
                    const x = margin + (value - minValue) * pixelsPerUnit;
                    
                    // Draw major tick
                    p.strokeWeight(2);
                    p.line(x, lineY - 15, x, lineY + 15);
                    
                    // Draw label
                    p.noStroke();
                    p.fill(0);
                    p.textSize(18);
                    
                    // Format the label based on slider position
                    let label = formatNumber(value, displayFormat);
                    
                    drawFormattedNumber(p, label, x, lineY + 35);
                    
                    // Draw minor ticks
                    if (value < maxValue) {
                        const minorInterval = majorTickInterval / minorTicksPerMajor;
                        for (let i = 1; i < minorTicksPerMajor; i++) {
                            const minorValue = value + i * minorInterval;
                            const minorX = margin + (minorValue - minValue) * pixelsPerUnit;
                            
                            p.strokeWeight(1);
                            p.stroke(0);
                            p.line(minorX, lineY - 8, minorX, lineY + 8);
                        }
                    }
                }
            }
            
            // Function to draw the question point
            function drawQuestionPoint(p, data) {
                const { minValue, maxValue, questionValue, questionFormat } = data;
                
                // Calculate positions
                const margin = 50;
                const lineY = 100;
                const lineLength = p.width - 2 * margin;
                
                // Calculate scale factor
                const range = maxValue - minValue;
                const pixelsPerUnit = lineLength / range;
                
                // Calculate x position for the question value
                const x = margin + (questionValue - minValue) * pixelsPerUnit;
                
                // Draw a brown point at the question value
                p.noStroke();
                p.fill(139, 69, 19); // Brown
                p.ellipse(x, lineY, 12, 12);
                
                // Use the question's own format
                let valueText = formatNumber(questionValue, questionFormat);
                
                // Draw the value above the point
                p.fill(139, 69, 19); // Brown
                p.textSize(16);
                drawFormattedNumber(p, valueText, x, lineY - 30);
            }
            
            // Function to draw the example point (unchanged since not used)
            function drawExamplePoint(p, data) {
                const { minValue, maxValue, exampleValue, exampleFormat } = data;
                
                const margin = 50;
                const lineY = 100;
                const lineLength = p.width - 2 * margin;
                const range = maxValue - minValue;
                const pixelsPerUnit = lineLength / range;
                
                const x = margin + (exampleValue - minValue) * pixelsPerUnit;
                
                p.noStroke();
                p.fill(0, 128, 0); // Green for example
                p.ellipse(x, lineY, 12, 12);
                
                let valueText = formatNumber(exampleValue, exampleFormat);
                
                p.fill(0, 128, 0);
                p.textSize(16);
                drawFormattedNumber(p, valueText, x, lineY - 30);
            }
        }, canvasContainer);
    }
    
    setModel(model) {
        this.model = model;
    }
}

// ===================== CONTROLLER =====================
class Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        
        // Connect model to view
        this.view.setModel(this.model);
        
        // Initialize controller
        this.init();
    }
    
    init() {
        // Setup slider appearance
        this.model.setupSlider();
        
        // Set initial display format
        this.model.data.displayFormat = 'fraction';
    
        this.generateUserPoint();
        this.generateQuestion();
        this.view.exampleButton.addEventListener('click', () => {
            this.generateQuestion();
            // Also generate a new random purple point when the button is clicked
            this.generateUserPoint();
        });
        
        // Add slider change event listener
        this.view.slider.addEventListener('input', (e) => {
            const sliderValue = parseInt(e.target.value);
            if (sliderValue === 1) {
                this.model.data.displayFormat = 'decimal';
            } else if (sliderValue === 3) {
                this.model.data.displayFormat = 'improper';
            } else {
                this.model.data.displayFormat = 'fraction';
            }
            // Redraw the number line with the new format
            this.view.p5Instance.redraw();
        });
    }
    
    // Helper method to generate a question
    generateQuestion() {
        // Clear any existing example
        this.model.data.exampleValue = undefined;
        
        // Generate a value that falls exactly on a tick mark (major or minor)
        const min = this.model.data.minValue;
        const max = this.model.data.maxValue;
        const majorTickInterval = this.model.data.majorTickInterval;
        const minorTicksPerMajor = this.model.data.minorTicksPerMajor;
        
        // Calculate the minor tick interval
        const minorInterval = majorTickInterval / minorTicksPerMajor;
        
        // Calculate how many minor intervals exist in the range
        const totalIntervals = Math.round((max - min) / minorInterval);
        
        // Pick a random interval
        const randomInterval = Math.floor(Math.random() * totalIntervals);
        
        // Calculate the value at that interval - this will be exactly on a tick mark
        const randomValue = min + (randomInterval * minorInterval);
        
        // Set the question value in the model
        this.model.data.questionValue = randomValue;
        
        // Assign a random display format for this question
        const formats = ['decimal', 'fraction', 'improper'];
        this.model.data.questionFormat = formats[Math.floor(Math.random() * formats.length)];
        
        // Redraw the canvas
        this.view.p5Instance.redraw();
    }
    
    // Helper method to generate a random example
    generateRandomExample() {
        // Generate a random number between minValue and maxValue
        const min = this.model.data.minValue;
        const max = this.model.data.maxValue;
        const majorTickInterval = this.model.data.majorTickInterval;
        const minorTicksPerMajor = this.model.data.minorTicksPerMajor;
        const minorInterval = majorTickInterval / minorTicksPerMajor;
        const totalIntervals = Math.round((max - min) / minorInterval);
        const randomInterval = Math.floor(Math.random() * totalIntervals);
        
        // Calculate the value at that interval - this will be exactly on a tick mark
        const randomValue = min + (randomInterval * minorInterval);
        
        // Set the example value in the model
        this.model.data.exampleValue = randomValue;
        
        // Assign a random display format for this example
        const formats = ['decimal', 'fraction', 'improper'];
        this.model.data.exampleFormat = formats[Math.floor(Math.random() * formats.length)];
        
        // Redraw the canvas
        this.view.p5Instance.redraw();
    }
    
    generateUserPoint() {
        // Generate a value that falls exactly on a tick mark (major or minor)
        const min = this.model.data.minValue;
        const max = this.model.data.maxValue;
        const majorTickInterval = this.model.data.majorTickInterval;
        const minorTicksPerMajor = this.model.data.minorTicksPerMajor;
        
        const minorInterval = majorTickInterval / minorTicksPerMajor;
        const totalIntervals = Math.round((max - min) / minorInterval);
        const randomInterval = Math.floor(Math.random() * totalIntervals);   
        const randomValue = min + (randomInterval * minorInterval);
        this.model.data.userValue = randomValue;
        const formats = ['decimal', 'fraction', 'improper'];
        this.model.data.userFormat = formats[Math.floor(Math.random() * formats.length)];
        this.view.p5Instance.redraw();
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    const model = new Model();
    const view = new View();
    const controller = new Controller(model, view);
});