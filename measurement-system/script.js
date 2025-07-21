// Unit Converter using P5.js with MVC pattern
let model, view, controller;
let canvasWidth = 800;
let canvasHeight = 400;

// Initialize event handlers
document.getElementById('unitSelect').addEventListener('change', function() {
    if (model) {
        model.setUnit(this.value);
    }
});

document.getElementById('bte-secondary').addEventListener('click', function() {
    if (model) {
        model.setRandomValue();
    }
});

// P5.js sketch
function setup() {
    let canvas = createCanvas(canvasWidth, canvasHeight);
    canvas.parent('canvas-container');
    
    model = new Model();
    view = new View();
    controller = new Controller();
}

function draw() {
    background(255);
    view.render();
}

function mousePressed() {
    controller.mousePressed();
}

function mouseDragged() {
    controller.mouseDragged();
}

function mouseReleased() {
    controller.mouseReleased();
}

function touchStarted() {
    // Only handle touch if it's on the drag box
    if (controller.isTouchOnDragBox()) {
        controller.mousePressed();
        return false; // Prevent default only for drag box
    }
    // Return true to allow normal touch behavior for other elements
    return true;
}

function touchMoved() {
    if (controller.isDragging) {
        controller.mouseDragged();
        return false; // Prevent default only when dragging
    }
    return true;
}

function touchEnded() {
    if (controller.isDragging) {
        controller.mouseReleased();
        return false; // Prevent default only when dragging
    }
    return true;
}

// Model - Handles data and business logic
class Model {
    constructor() {
        this.baseValue = 3.16;
        this.currentUnit = 'meters';
        this.boxes = [
            { value: '1/1000', unit: 'km', x: 78, y: 155, width: 70, height: 70, multiplier: 0.001 },
            { value: '1/100', unit: 'hm', x: 183, y: 155, width: 70, height: 70, multiplier: 0.01 },
            { value: '1/10', unit: 'dam', x: 288, y: 155, width: 70, height: 70, multiplier: 0.1 },
            { value: '1', unit: 'm', x: 393, y: 155, width: 70, height: 70, multiplier: 1 },
            { value: '10', unit: 'dm', x: 498, y: 155, width: 70, height: 70, multiplier: 10 },
            { value: '100', unit: 'cm', x: 603, y: 155, width: 70, height: 70, multiplier: 100 },
            { value: '1000', unit: 'mm', x: 708, y: 155, width: 70, height: 70, multiplier: 1000 }
        ];
        
        this.dragBox = {
            x: 393,
            y: 155,
            width: 70,
            height: 70,
            isDragging: false,
            snapIndex: 3, // Default position (middle)
            displayValue: 3.16 // This is what will be shown in the blue box
        };
        
        this.unitSystems = {
            meters: { 
                base: 'm', 
                fullBase: 'meter',
                prefixes: ['km', 'hm', 'dam', 'm', 'dm', 'cm', 'mm'],
                fullNames: ['kilometer', 'hectometer', 'decameter', 'meter', 'decimeter', 'centimeter', 'millimeter'],
                multipliers: [0.001, 0.01, 0.1, 1, 10, 100, 1000],
                displayValues: ['1/1000', '1/100', '1/10', '1', '10', '100', '1000']
            },
            hours: {
                base: 'hr',
                fullBase: 'hour',
                prefixes: ['week', 'day', 'hr', 'min', 'sec', 'ms', 'μs'],
                fullNames: ['week', 'day', 'hour', 'minute', 'second', 'millisecond', 'microsecond'],
                multipliers: [1/168, 1/24, 1, 60, 3600, 3600000, 3600000000],
                displayValues: ['1/168', '1/24', '1', '60', '3600', '3600000', '3600000000']
            },
            pounds: {
                base: 'lb',
                fullBase: 'pound',
                prefixes: ['ton', 'cwt', 'st', 'lb', 'oz', 'dr', 'gr'],
                fullNames: ['ton', 'hundredweight', 'stone', 'pound', 'ounce', 'dram', 'grain'],
                multipliers: [1/2000, 1/100, 1/14, 1, 16, 256, 7000],
                displayValues: ['1/2000', '1/100', '1/14', '1', '16', '256', '7000']
            },
            feet: {
                base: 'ft',
                fullBase: 'foot',
                prefixes: ['mi', 'fur', 'ch', 'yd', 'ft', 'in', 'th'],
                fullNames: ['mile', 'furlong', 'chain', 'yard', 'foot', 'inch', 'thou'],
                multipliers: [1/5280, 1/660, 1/66, 1/3, 1, 12, 12000],
                displayValues: ['1/5280', '1/660', '1/66', '1/3', '1', '12', '12000']
            },
            cups: {
                base: 'cup',
                fullBase: 'cup',
                prefixes: ['gal', 'qt', 'pt', 'cup', 'fl oz', 'tbsp', 'tsp'],
                fullNames: ['gallon', 'quart', 'pint', 'cup', 'fluid ounce', 'tablespoon', 'teaspoon'],
                multipliers: [1/16, 1/4, 1/2, 1, 8, 16, 48],
                displayValues: ['1/16', '1/4', '1/2', '1', '8', '16', '48']
            },
            grams: {
                base: 'g',
                fullBase: 'gram',
                prefixes: ['kg', 'hg', 'dag', 'g', 'dg', 'cg', 'mg'],
                fullNames: ['kilogram', 'hectogram', 'decagram', 'gram', 'decigram', 'centigram', 'milligram'],
                multipliers: [0.001, 0.01, 0.1, 1, 10, 100, 1000],
                displayValues: ['1/1000', '1/100', '1/10', '1', '10', '100', '1000']
            },
            liters: {
                base: 'L',
                fullBase: 'liter',
                prefixes: ['kL', 'hL', 'daL', 'L', 'dL', 'cL', 'mL'],
                fullNames: ['kiloliter', 'hectoliter', 'decaliter', 'liter', 'deciliter', 'centiliter', 'milliliter'],
                multipliers: [0.001, 0.01, 0.1, 1, 10, 100, 1000],
                displayValues: ['1/1000', '1/100', '1/10', '1', '10', '100', '1000']
            }
        };
        
        this.updateBoxes();
        this.updateDragBoxValue();
    }
    
    setUnit(unit) {
        this.currentUnit = unit;
        this.updateBoxes();
        this.updateDragBoxValue();
    }
    
    setRandomValue() {
        this.baseValue = Math.round(Math.random() * 9.99 * 100) / 100;
        this.updateBoxes();
        this.updateDragBoxValue();
    }
    
    updateBoxes() {
        const system = this.unitSystems[this.currentUnit];
        
        for (let i = 0; i < this.boxes.length; i++) {
            this.boxes[i].unit = system.prefixes[i];
            this.boxes[i].multiplier = system.multipliers[i];
            this.boxes[i].value = system.displayValues[i];
        }
    }
    
    getActiveBox() {
        return this.boxes[this.dragBox.snapIndex];
    }
    
    updateDragBoxValue() {
        const activeBox = this.getActiveBox();
        // Fix the issue with small numbers showing as zero
        // Use a more precise format and ensure very small numbers still show their value
        const convertedValue = this.baseValue * activeBox.multiplier;
        if (Math.abs(convertedValue) < 0.01) {
            // For very small numbers, use scientific notation or more decimal places
            this.dragBox.displayValue = convertedValue.toPrecision(4);
        } else {
            // For regular numbers, use fixed format with 2 decimal places but remove trailing zeros
            this.dragBox.displayValue = (convertedValue).toFixed(4).replace(/\.?0+$/, "");
        }
    }
    
    getConversionText() {
        const activeBox = this.getActiveBox();
        const convertedValue = this.baseValue * activeBox.multiplier;
        const system = this.unitSystems[this.currentUnit];
        const baseUnit = system.fullBase;
        const activeUnitIndex = system.prefixes.indexOf(activeBox.unit);
        const activeUnitFullName = system.fullNames[activeUnitIndex];
    
        // Handle pluralization for units
        const pluralizeUnit = (unit, count) => {
            if (count === 1) return unit;
            // Special cases for irregular plurals
            if (unit === 'foot') return 'feet';
            if (unit === 'inch') return 'inches';
            // General case - add 's'
            return unit + 's';
        };
    
        // Format final converted value
        const formattedConvertedValue =
            Math.abs(convertedValue) < 0.01
                ? convertedValue.toPrecision(4)
                : convertedValue.toFixed(4).replace(/\.?0+$/, "");
    
        // Determine correct relationship for text display
        let topLine;
        if (this.currentUnit === 'hours') {
            // Special handling for time units
            const unitRelationships = {
                'week': `1 week = 168 ${pluralizeUnit(baseUnit, 168)}`,
                'day': `1 day = 24 ${pluralizeUnit(baseUnit, 24)}`,
                'hr': `1 ${baseUnit} = 1 ${baseUnit}`,
                'min': `1 ${baseUnit} = 60 ${pluralizeUnit('minute', 60)}`,
                'sec': `1 ${baseUnit} = 3600 ${pluralizeUnit('second', 3600)}`,
                'ms': `1 ${baseUnit} = 3,600,000 ${pluralizeUnit('millisecond', 3600000)}`,
                'μs': `1 ${baseUnit} = 3,600,000,000 ${pluralizeUnit('microsecond', 3600000000)}`
            };
            topLine = unitRelationships[activeBox.unit];
        } else {
            // Regular handling for other units
            if (activeBox.multiplier >= 1) {
                const relationCount = parseFloat(activeBox.value);
                topLine = `There are ${activeBox.value} ${pluralizeUnit(activeUnitFullName, relationCount)} in 1 ${baseUnit}.`;
            } else {
                const parts = activeBox.value.split('/');
                if (parts.length === 2) {
                    const relationCount = parseFloat(parts[1]);
                    topLine = `There are ${parts[1]} ${pluralizeUnit(baseUnit, relationCount)} in 1 ${activeUnitFullName}.`;
                } else {
                    const inverse = 1 / activeBox.multiplier;
                    const formatted = inverse < 0.01
                        ? inverse.toPrecision(4)
                        : inverse.toFixed(4).replace(/\.?0+$/, "");
                    const relationCount = parseFloat(formatted);
                    topLine = `There are ${formatted} ${pluralizeUnit(baseUnit, relationCount)} in 1 ${activeUnitFullName}.`;
                }
            }
        }
    
        // Pluralize based on values for the rest of the text
        const basePlural = pluralizeUnit(baseUnit, this.baseValue);
        const resultPlural = pluralizeUnit(activeUnitFullName, convertedValue);
    
        return {
            top: topLine,
            middle: `${this.baseValue} ${basePlural} × ${activeBox.value} ${activeUnitFullName}/${baseUnit} = ${formattedConvertedValue} ${resultPlural}`,
            bottom: `There are ${formattedConvertedValue} ${resultPlural} in ${this.baseValue} ${basePlural}.`,
            header: `Explore conversions of ${this.baseValue} ${basePlural}`
        };
    }
    
    snapDragBox() {
        let closestIndex = 0;
        let minDistance = Infinity;
        
        for (let i = 0; i < this.boxes.length; i++) {
            const box = this.boxes[i];
            const distance = Math.abs(this.dragBox.x - box.x);
            
            if (distance < minDistance) {
                minDistance = distance;
                closestIndex = i;
            }
        }
        
        this.dragBox.snapIndex = closestIndex;
        this.dragBox.x = this.boxes[closestIndex].x;
        this.updateDragBoxValue(); // Update the value when box snaps to a new position
    }
}

// View - Handles the display
class View {
    constructor() {
        this.titleFont = 16;
        this.boxFont = 16;
        this.resultFont = 18;
    }
    
    render() {
        this.drawBoxes();
        this.drawDragBox();
        this.drawText();
    }
    
    drawBoxes() {
        for (const box of model.boxes) {
            push();
            strokeWeight(1);
            stroke(219, 34, 134);
            strokeJoin(ROUND);
            
            // Set up the dashed line pattern
            drawingContext.setLineDash([5, 3]); // 5 pixels dash, 3 pixels space
            
            fill(252, 228, 236);
            rectMode(CENTER);
            rect(box.x, box.y, box.width, box.height, 5);
            
            // Reset dash pattern for text and other elements
            drawingContext.setLineDash([]);
            
            textAlign(CENTER, CENTER);
            textSize(this.boxFont);
            fill(219, 34, 134);
            
            // Handle fractions
            if (box.value.includes('/')) {
                const [numerator, denominator] = box.value.split('/');
                const yOffset = 10;
                const lineWidth = max(textWidth(numerator), textWidth(denominator)) + 10;
                
                text(numerator, box.x, box.y - yOffset);
                line(box.x - lineWidth/2, box.y, box.x + lineWidth/2, box.y);
                text(denominator, box.x, box.y + yOffset);
            } else {
                text(box.value, box.x, box.y);
            }
            
            textSize(this.titleFont);
            text(box.unit, box.x, box.y + 50);
            pop();
        }
    }
    
    drawDragBox() {
        push();
        stroke(100, 100, 255);
        strokeWeight(2);
        fill(150, 150, 255);
        rectMode(CENTER);
        
        // Add the border radius of 5 to match pink boxes
        rect(model.dragBox.x, model.dragBox.y, model.dragBox.width, model.dragBox.height, 5);
        
        textAlign(CENTER, CENTER);
        textSize(this.boxFont);
        fill(0, 0, 200);
        text(model.dragBox.displayValue, model.dragBox.x, model.dragBox.y);
        pop();
    }
    
    drawText() {
        const textContent = model.getConversionText();
        push();
        textAlign(LEFT);
        textSize(this.titleFont + 5);
        fill(0);
        
        

        // Get current system full name for the title
        // const currentSystemName = model.currentUnit.charAt(0).toUpperCase() + model.currentUnit.slice(1);
        text(textContent.header, 10, 50);

        // Top text
        textSize(this.titleFont);
        fill(0);
        text(textContent.top, 10, 260);

        // Middle formula
        textSize(this.resultFont);
        fill(0);
        text(textContent.middle, 10, 300);

        // Bottom result
        textSize(this.resultFont);
        fill(100, 100, 255);
        text(textContent.bottom, 10, 340);

        pop();
    }
}

// Controller - Handles user interactions
class Controller {
    constructor() {
        this.isDragging = false;
    }
    
    mousePressed() {
  const x = touches.length > 0 ? touches[0].x : mouseX;
const y = touches.length > 0 ? touches[0].y : mouseY;
const dx = x - model.dragBox.x;
const dy = y - model.dragBox.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < model.dragBox.width / 2) {
            this.isDragging = true;
        }
    }
    
    mouseDragged() {
        if (this.isDragging) {
            // Constrain horizontal movement to the boxes' horizontal line
const x = touches.length > 0 ? touches[0].x : mouseX;
model.dragBox.x = constrain(x, model.boxes[0].x, model.boxes[6].x);            
            // Find the closest box and update display value in real-time during drag
            let closestIndex = 0;
            let minDistance = Infinity;
            
            for (let i = 0; i < model.boxes.length; i++) {
                const box = model.boxes[i];
                const distance = Math.abs(model.dragBox.x - box.x);
                
                if (distance < minDistance) {
                    minDistance = distance;
                    closestIndex = i;
                }
            }
            
            if (closestIndex !== model.dragBox.snapIndex) {
                model.dragBox.snapIndex = closestIndex;
                model.updateDragBoxValue(); // Update value during drag when it moves to a new box area
            }
        }
    }
    
    mouseReleased() {
        if (this.isDragging) {
            this.isDragging = false;
            model.snapDragBox();
        }
    }
    isTouchOnDragBox() {
    if (touches.length === 0) return false;
    
    const x = touches[0].x;
    const y = touches[0].y;
    const dx = x - model.dragBox.x;
    const dy = y - model.dragBox.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    return distance < model.dragBox.width / 2;
}
}

// Initialize P5.js
new p5();