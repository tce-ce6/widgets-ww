// Model - Handles data and business logic
class TemperatureModel {
    constructor() {
        this.isCelsius = Math.random() < 0.5;
        
        if (this.isCelsius) {
            let valid = false;
            while (!valid) {
                this.celsius = Math.floor(Math.random() * 36); // 0 to 35
                const maxFahrenheit = this.celsiusToFahrenheit(this.celsius * 2);
                if (maxFahrenheit >= 25 && maxFahrenheit <= 110) {
                    valid = true;
                    this.fahrenheit = this.celsiusToFahrenheit(this.celsius);
                }
            }
        } else {
            let valid = false;
            while (!valid) {
                this.fahrenheit = Math.floor(Math.random() * 41) + 35; // 45 to 85
                const minCelsius = this.fahrenheitToCelsius(this.fahrenheit - 40);
                if (minCelsius >= -5 && minCelsius <= 45) {
                    valid = true;
                    this.celsius = this.fahrenheitToCelsius(this.fahrenheit);
                }
            }
        }
    }
    
    celsiusToFahrenheit(celsius) {
        return (celsius * 9/5) + 32;
    }
    
    fahrenheitToCelsius(fahrenheit) {
        return (fahrenheit - 32) * 5/9;
    }
}

// View - Handles the UI
class TemperatureView {
    // In the constructor, add a method to constrain values
    constructor(model) {
        this.model = model;
        this.showRoundedCalculation = false;
        this.roundedValue = 0;
        this.showBlueMarking = false;
        this.showPinkMarking = false;
        this.activeButton = null;
        this.currentSubtract = 32;  
        this.currentMultiplier = 5/9;
        this.currentAdd = 32;      // Default addition value for Celsius to Fahrenheit
        this.firstButtonActive = null;
        this.secondButtonActive = null;
        this.showInstruction = true;
        this.instructionY = 0;
this.instructionVelocity = -8;
this.instructionBaseY = 470;  // original Y offset
this.bouncing = true;         // control flag


        // Initialize p5.js sketch
        new p5(this.sketch.bind(this), 'canvas-container');

        this.setupEventListerners()

    }

   
    
    sketch(p) {
        const self = this;
        
        p.setup = function() {
            let canvas = p.createCanvas(900, 600);
           // canvas.style('border', '1px solid #808080');
            canvas.parent('canvas-container');
            canvas.style('display', 'block');
            canvas.style('margin', '0 auto');
        };
        
        p.draw = function() {
            p.background(255);
            self.drawThermometer(p);
            self.drawTryAnotherButton(p);
        };
        
        p.mousePressed = function() {
            self.checkButtonClicks(p);
            self.checkTryAnotherButtonClick(p); 
        };
    }
    

    setupEventListerners() {
        let tryAnotherButton = document.getElementById('try-another');


        
        tryAnotherButton.addEventListener('click', () => {
            console.log("Try Another button clicked!"); 
            this.resetState();
            this.model = new TemperatureModel();
            
        });


    }
    // Add method to check for button clicks
    checkButtonClicks(p) {
        const rightSideX = p.width * 0.30;
        const textY = 100;
        const x = rightSideX + 200;
        const y = this.model.isCelsius? textY + 250 : textY + 250;
        const buttonSize = 30;
        const buttonSpacing = 10;
        
        // Check first up arrow button - only if not already active
        if (this.firstButtonActive !== 'up' && 
            p.mouseX > x && p.mouseX < x + buttonSize && 
            p.mouseY > y && p.mouseY < y + buttonSize) {
            


                // hide headuing
                this.showInstruction = false;
            if (!this.model.isCelsius) {
                this.showRoundedCalculation = true;
                this.showBlueMarking = true;
                this.currentSubtract = 40;
                this.roundedValue = ((this.model.fahrenheit - 40) * this.currentMultiplier).toFixed(1);
                this.activeButton = 'firstUp';
                this.firstButtonActive = this.firstButtonActive === 'up' ? null : 'up';
            } else {
                this.showRoundedCalculation = true;
                this.showPinkMarking = true;
                this.currentMultiplier = 2;
                this.roundedValue = ((this.model.celsius * 2) + 32).toFixed(1);
                this.activeButton = 'firstUp';
                this.firstButtonActive = this.firstButtonActive === 'up' ? null : 'up';
            }
        }
        
        // Check first down arrow button - only if not already active
        else if (this.firstButtonActive !== 'down' && 
            p.mouseX > x && p.mouseX < x + buttonSize && 
            p.mouseY > y + buttonSize + buttonSpacing + 30 && 
            p.mouseY < y + buttonSize + buttonSpacing + 30 + buttonSize) {
            
                //hide heading
                this.showInstruction = false;
            if (!this.model.isCelsius) {
                this.showRoundedCalculation = true;
                this.showBlueMarking = true;
                this.currentSubtract = 30;
                this.roundedValue = ((this.model.fahrenheit - 30) * this.currentMultiplier).toFixed(1);
                this.activeButton = 'firstDown';
                this.firstButtonActive = this.firstButtonActive === 'down' ? null : 'down';
            } else {
                this.showRoundedCalculation = true;
                this.showPinkMarking = true;
                this.currentMultiplier = 1;
                this.roundedValue = ((this.model.celsius * 1) + 32).toFixed(1);
                this.activeButton = 'firstDown';
                this.firstButtonActive = this.firstButtonActive === 'down' ? null : 'down';
            }
        }
        
        // Check second up arrow button - only if not already active
        else if (this.secondButtonActive !== 'up' && 
            p.mouseX > x + buttonSize + buttonSpacing && 
            p.mouseX < x + buttonSize + buttonSpacing + buttonSize && 
            p.mouseY > y && p.mouseY < y + buttonSize) {
            

                // hide heading 
                this.showInstruction = false;
            if (!this.model.isCelsius) {
                this.showRoundedCalculation = true;
                this.showBlueMarking = true;
                this.currentMultiplier = 1;
                this.roundedValue = ((this.model.fahrenheit - this.currentSubtract) * 1).toFixed(1);
                this.activeButton = 'secondUp';
                this.secondButtonActive = this.secondButtonActive === 'up' ? null : 'up';
            } else {
                this.showRoundedCalculation = true;
                this.showPinkMarking = true;
                this.currentAdd = 40;
                this.roundedValue = ((this.model.celsius * this.currentMultiplier) + 40).toFixed(1);
                this.activeButton = 'secondUp';
                this.secondButtonActive = this.secondButtonActive === 'up' ? null : 'up';
            }
        }
        
        // Check second down arrow button - only if not already active
        else if (this.secondButtonActive !== 'down' && 
            p.mouseX > x + buttonSize + buttonSpacing && 
            p.mouseX < x + buttonSize + buttonSpacing + buttonSize && 
            p.mouseY > y + buttonSize + buttonSpacing + 30 && 
            p.mouseY < y + buttonSize + buttonSpacing + 30 + buttonSize) {
            

                 // hide heading 
                this.showInstruction = false;
            if (!this.model.isCelsius) {
                this.showRoundedCalculation = true;
                this.showBlueMarking = true;
                this.currentMultiplier = 0.5;
                this.roundedValue = ((this.model.fahrenheit - this.currentSubtract) * 0.5).toFixed(1);
                this.activeButton = 'secondDown';
                this.secondButtonActive = this.secondButtonActive === 'down' ? null : 'down';
            } else {
                this.showRoundedCalculation = true;
                this.showPinkMarking = true;
                this.currentAdd = 30;
                this.roundedValue = ((this.model.celsius * this.currentMultiplier) + 30).toFixed(1);
                this.activeButton = 'secondDown';
                this.secondButtonActive = this.secondButtonActive === 'down' ? null : 'down';
            }
        }
    }
    drawTryAnotherButton(p) {
        const buttonWidth = 150;
        const buttonHeight = 40;
        const x = p.width - buttonWidth - 20; 
        const y = p.height - buttonHeight - 20;
        const purpleColor = p.color(102, 51, 204); // Purple color
        
        // // Draw button
        // p.noStroke(0);
        // p.fill(purpleColor);
        // p.rect(x, y, buttonWidth, buttonHeight, 3); 
        
        // // Draw text
        // p.fill(255);
        // p.textAlign(p.CENTER, p.CENTER);
        // p.textSize(14);

        // p.text("TRY ANOTHER", x + buttonWidth/2, y + buttonHeight/2);
    }
    
    // Add method to check if Try Another button is clicked
    checkTryAnotherButtonClick(p) {
        const buttonWidth = 150;
        const buttonHeight = 40;
        const x = p.width - buttonWidth - 20;
        const y = p.height - buttonHeight - 20;
        
        if (p.mouseX > x && p.mouseX < x + buttonWidth && 
            p.mouseY > y && p.mouseY < y + buttonHeight) {
            // Generate a new problem
            this.resetState();
            this.model = new TemperatureModel();
        }
    }
    
    // Add method to reset state when generating a new problem
    resetState() {
        this.showRoundedCalculation = false;
        this.roundedValue = 0;
        this.showBlueMarking = false;
        this.showPinkMarking = false;
        this.activeButton = null;
        this.currentSubtract = 32;  
        this.currentMultiplier = 5/9;
        this.currentAdd = 32;
        this.firstButtonActive = null;
        this.secondButtonActive = null;
        this.showInstruction = true;
    }
    drawThermometer(p) {
        // Set up dimensions and positions
        const thermometerHeight = 550;
        const bulbRadius = 30;
        const stemWidth = 38;
        const startY = 5;
        const topCurveRadius = stemWidth/2;
        
        // Position thermometer on the left side instead of center
        const thermometerX = p.width / 6;
        
        // Draw thermometer outline with thicker lines
        p.stroke(0);
        p.strokeWeight(4);
        p.fill(255);
        
        // Draw the stem with curved top
        // Left side of stem
        p.beginShape();
        p.vertex(thermometerX - stemWidth/2, startY + topCurveRadius); // Start below the curve
        p.vertex(thermometerX - stemWidth/2, startY + thermometerHeight - bulbRadius+7); // Bottom left - reduced by 5 pixels
        p.endShape();
        
        // Right side of stem
        p.beginShape();
        p.vertex(thermometerX + stemWidth/2, startY + topCurveRadius); // Start below the curve
        p.vertex(thermometerX + stemWidth/2, startY + thermometerHeight - bulbRadius+7); // Bottom right
        p.endShape();
        
        // Top curved part
        p.arc(thermometerX, startY + topCurveRadius, stemWidth, stemWidth, -p.PI, 0);
        
        // Fill the stem based on temperature if it's Fahrenheit
        if (!this.model.isCelsius) {
            // Calculate the height of the fill based on the Fahrenheit value
            const celsius = this.model.celsius;
            const fillHeight = this.mapTemperature(celsius, -5, 45, startY + thermometerHeight - bulbRadius - 10, startY + 20);
            
            // Fill the left half of the stem with pink - shifted more inward on x-axis
            p.noStroke();
            p.fill(255, 105, 180); // Pink color
            p.rect(thermometerX - stemWidth/2 + 12, fillHeight, stemWidth/2 - 12, 
                    (startY+10 + thermometerHeight - bulbRadius + 20) - fillHeight);
                    
            // Add blue marking if button was clicked
            if (this.showBlueMarking) {
            // Calculate the height for the rounded value
            const roundedCelsius = parseFloat(this.roundedValue);
            // Fix the mapping to match the Celsius scale
            const blueHeight = this.mapTemperature(roundedCelsius, -5, 45, startY + thermometerHeight - bulbRadius - 10, startY + 20);
            
            // Draw blue marking on right side of stem
            p.fill(0, 0, 255); // Blue color
            p.rect(thermometerX+0.1, blueHeight, stemWidth/2 - 12, 
                    (startY+10 + thermometerHeight - bulbRadius + 20) - blueHeight);
        }
        }
        
        // In the drawThermometer method, add code to show pink marking for Celsius to Fahrenheit
        else if (this.model.isCelsius) {
        // Calculate the height of the fill based on the Celsius value
        const celsius = this.model.celsius;
        const blueHeight = this.mapTemperature(celsius, -5, 45, startY + thermometerHeight - bulbRadius - 10, startY + 20);
        
        // Fill the right half of the stem with blue
        p.noStroke();
        p.fill(0, 0, 255); // Blue color
        p.rect(thermometerX + 0.1, blueHeight, stemWidth/2 - 12, 
                (startY+10 + thermometerHeight - bulbRadius + 20) - blueHeight);
                
        // Add pink marking if button was clicked
        if (this.showPinkMarking) {
            // Calculate the height for the rounded value
            const roundedFahrenheit = parseFloat(this.roundedValue);
            const fahrenheitInCelsius = (roundedFahrenheit - 32) * 5/9;
            // Fix the mapping to match the Fahrenheit scale
            const pinkHeight = this.mapTemperature(fahrenheitInCelsius, -5, 45, startY + thermometerHeight - bulbRadius - 10, startY + 20);
            
            // Draw pink marking on left side of stem
            p.fill(255, 105, 180); // Pink color
            p.rect(thermometerX - stemWidth/2 + 12, pinkHeight, stemWidth/2 - 12, 
                    (startY+10 + thermometerHeight - bulbRadius + 20) - pinkHeight);
        }
        }
        
        // Fill left half of bulb with pink
        p.noStroke();
        p.fill(255, 105, 180); // Pink color
        p.arc(thermometerX, startY + thermometerHeight, bulbRadius * 1.5, bulbRadius * 1.5, p.PI/2, 3*p.PI/2, p.CHORD);
        
        // Fill right half of bulb with blue
        p.fill(0, 0, 255); // Blue color
        p.arc(thermometerX, startY + thermometerHeight, bulbRadius * 1.5, bulbRadius * 1.5, -p.PI/2, p.PI/2, p.CHORD);
        
        // Redraw the bulb outline
        p.noFill();
        p.stroke(0);
        p.strokeWeight(4);
        p.arc(thermometerX, startY + thermometerHeight, bulbRadius * 2, bulbRadius * 2, -0.9, p.PI+7.2);
        
        // Draw the temperature markings - Celsius on right
        this.drawCelsiusScale(p, thermometerX + stemWidth/2, startY, thermometerHeight - bulbRadius);
        
        // Draw the temperature markings - Fahrenheit on left
        this.drawFahrenheitScale(p, thermometerX - stemWidth/2, startY, thermometerHeight - bulbRadius);
        
        // Draw the labels at the bottom
        p.textSize(16);
        p.textAlign(p.CENTER);
        p.fill(255, 105, 180);
        p.textStyle(p.BOLD);
        p.text("°F", thermometerX - 50, startY-30 + thermometerHeight + bulbRadius + 10);
        p.fill(0, 0, 255);
        p.text("°C", thermometerX + 50, startY-30 + thermometerHeight + bulbRadius + 10);
        
        // Display the temperature value on the right side of the canvas
        this.displayTemperatureValue(p);
    }
    
        displayTemperatureValue(p) {
        const rightSideX = p.width * 0.30;
        const textY = 100;
        
        p.fill(0);
        p.noStroke();
        p.textAlign(p.LEFT);
        p.textSize(20);
        
        if (this.model.isCelsius) {
            // Make the title bold by using a larger text size and/or a different font weight
            p.textStyle(p.BOLD);
      //      p.text("Estimating Temperature Conversion Between Celsius and Fahrenheit.", rightSideX-35, textY-60);
            p.textStyle(p.NORMAL);
            p.textSize(15)
            p.text("Learn to quickly estimate temperature conversions between Celsius and Fahrenheit in this activity.",rightSideX-30, textY-30)
            p.textSize(20)
            p.text("Estimate the values in the temperature conversion formula to estimate", rightSideX, textY+30);
            p.fill(0, 0, 255); // Blue color for Celsius
            p.text(`${this.model.celsius}°`, rightSideX, textY + 60);
            p.fill(0);
            p.text("Celsius in Fahrenheit.", rightSideX + 32, textY + 60);
             
            p.text("\n\n\n\nThe conversion formula is: \n\n Fahrenheit temp=(°C × 9/5) + 32 ", rightSideX, textY + 80);
            p.text("=(",rightSideX+153, textY + 200);
            p.fill(0, 0, 255);
            p.text(`${this.model.celsius}`, rightSideX+172, textY + 200);
            p.fill(0); 
            p.text("× 9/5) + 32 ", rightSideX+195, textY + 200)
            // Add up and down arrow buttons in purple
            this.drawArrowButtons(p, rightSideX + 200, textY + 250);
            
          if (this.showInstruction) {
    // Animate bounce
    if (this.bouncing) {
        this.instructionVelocity += 0.5; // gravity
        this.instructionY += this.instructionVelocity;

        if (this.instructionY >= 0) {
            this.instructionY = 0;
            this.instructionVelocity *= -0.6; // bounce and dampen
            if (Math.abs(this.instructionVelocity) < 1) {
                this.bouncing = false; // stop bouncing when almost settled
            }
        }
    }

    p.fill('#604deb'); // Purple
    p.textSize(22);
    p.textStyle(p.BOLD);
    p.text(
        "Use the arrow button to round constant values up or down",
        rightSideX + 250,
        textY + this.instructionBaseY + this.instructionY
    );
}

            

          
        } else {
            p.textStyle(p.BOLD);
        //    p.text("Estimating Temperature Conversion Between Celsius and Fahrenheit.", rightSideX-35, textY-60);
            p.textStyle(p.NORMAL);
            p.textSize(15)
            p.text("Learn to quickly estimate temperature conversions between Celsius and Fahrenheit in this activity.",rightSideX-30, textY-30)
            p.textSize(20)
            
            p.text("Estimate the values in the temperature conversion formula to estimate", rightSideX, textY+30);
            p.fill(255, 105, 180); // Pink color for Fahrenheit
            p.text(`${this.model.fahrenheit}° `, rightSideX, textY + 60);
            p.fill(0);
            p.text("Fahrenheit in Celsius.", rightSideX + 40, textY + 60);
            p.fill(0);
            p.text("\n\n\n\nThe conversion formula is: \n\n Celsius temp=(F - 32) × 5/9 ", rightSideX, textY + 80);
            p.text("=(",rightSideX+121, textY + 200)
            p.fill(255, 105, 180);
            p.text(`${this.model.fahrenheit}`,rightSideX+140, textY + 200)
            p.fill(0);
            p.text("- 32) × 5/9", rightSideX+170, textY + 200);
            
            // Add up and down arrow buttons in purple
            this.drawArrowButtons(p, rightSideX + 200, textY + 250);
        // Only show "hello world" if showHelloWorld is true
          if (this.showInstruction) {
    // Animate bounce
    if (this.bouncing) {
        this.instructionVelocity += 0.5; // gravity
        this.instructionY += this.instructionVelocity;

        if (this.instructionY >= 0) {
            this.instructionY = 0;
            this.instructionVelocity *= -0.6; // bounce and dampen
            if (Math.abs(this.instructionVelocity) < 1) {
                this.bouncing = false; // stop bouncing when almost settled
            }
        }
    }

    p.fill('#604deb'); // Purple
    p.textSize(22);
    p.textStyle(p.BOLD);
    p.text(
        "Use the arrow button to round constant values up or down",
        rightSideX + 250,
        textY + this.instructionBaseY + this.instructionY
    );
}

          
        }
    }
    
    // Helper method to draw the arrow buttons
    drawArrowButtons(p, x, y) {
        const buttonSize = 30;
        const buttonSpacing = 10;
        const purpleColor = p.color(102, 51, 204); // Purple color
        const grayColor = p.color(180, 180, 180); // Gray color for inactive buttons
        
        // Draw two up arrow buttons
        p.stroke(0);
        p.strokeWeight(1);
        
        // First up arrow button - gray if it's active
        p.fill(this.firstButtonActive === 'up' ? grayColor : purpleColor);
        p.rect(x, y, buttonSize, buttonSize, 5);
        p.fill(255);
        p.noStroke();
        p.beginShape();
        p.vertex(x + buttonSize/2, y + buttonSize/4);
        p.vertex(x + 3*buttonSize/4, y + 3*buttonSize/4);
        p.vertex(x + buttonSize/4, y + 3*buttonSize/4);
        p.endShape(p.CLOSE);
        
        // Second up arrow button - gray if it's active
        p.fill(this.secondButtonActive === 'up' ? grayColor : purpleColor);
        p.stroke(0);
        p.rect(x + buttonSize + buttonSpacing, y, buttonSize, buttonSize, 5);
        p.fill(255);
        p.noStroke();
        p.beginShape();
        p.vertex(x + buttonSize + buttonSpacing + buttonSize/2, y + buttonSize/4);
        p.vertex(x + buttonSize + buttonSpacing + 3*buttonSize/4, y + 3*buttonSize/4);
        p.vertex(x + buttonSize + buttonSpacing + buttonSize/4, y + 3*buttonSize/4);
        p.endShape(p.CLOSE);
        
        // Add the equation with similarity symbol between up and down buttons
        p.textAlign(p.CENTER);
        p.textSize(20);
        p.fill(0);
        
        // Formula display section
        if (this.model.isCelsius) {
            // Show the current formula with the current values
            
            p.text(`= (`, x - 10, y + buttonSize + buttonSpacing/2 + 15);
            p.fill(0, 0, 255); // Blue color for Celsius value
            p.text(`${this.model.celsius}`, x + 12, y + buttonSize + buttonSpacing/2 + 15);
            p.fill(0);
            p.text(` × ${this.currentMultiplier === 2 ? '2' : this.currentMultiplier === 1 ? '1' : '9/5'}) + ${this.currentAdd}`, 
                   x + 75, y + buttonSize + buttonSpacing/2 + 15);
            
            p.fill(0); // Black color for equals sign
            
            // Only show Fahrenheit result if a button has been pressed
            if (this.showRoundedCalculation) {
                p.text(` = `, x + 140, y + buttonSize + buttonSpacing/2 + 15);
                p.fill(255, 105, 180); // Pink color for Fahrenheit result
                p.text(`${this.roundedValue}°F`, x + 180, y + buttonSize + buttonSpacing/2 + 15);
            }
        } else {
            if (this.showRoundedCalculation) {
                // Show the current formula with the current values
                
                p.text(`= (`,x-60, y + buttonSize + buttonSpacing/2 + 15);
                p.fill(255, 105, 180);
                p.text(`${this.model.fahrenheit}`, x-30, y + buttonSize + buttonSpacing/2 + 15);
                p.fill(0);
                p.text(`- ${this.currentSubtract})`,x + 10, y + buttonSize + buttonSpacing/2 + 15);
                p.text(`× ${this.currentMultiplier === 1 ? '1' : this.currentMultiplier === 0.5 ? '1/2' : '5/9'}`,x + 68, y + buttonSize + buttonSpacing/2 + 15);
                
                p.fill(0); // Black color for equals sign
                p.text(` = `, x+100, y + buttonSize + buttonSpacing/2 + 15);
                p.fill(0, 0, 255); // Blue color for Celsius result
                p.text(`${this.roundedValue}°C`, x + 150, y + buttonSize + buttonSpacing/2 + 15);
            } else {
                // Highlight the Fahrenheit value in pink
                p.text(`= (`, x - 60, y + buttonSize + buttonSpacing/2 + 15);
                p.fill(255, 105, 180); // Pink color for Fahrenheit
                p.text(`${this.model.fahrenheit}`, x - 30, y + buttonSize + buttonSpacing/2 + 15);
                p.fill(0);
                p.text(` - 32) × 5/9`, x + 35, y + buttonSize + buttonSpacing/2 + 15);
            }
        }
        
        // Draw two down arrow buttons
        p.stroke(0);
        
        // First down arrow button - gray if down is active
        p.fill(this.firstButtonActive === 'down' ? grayColor : purpleColor);
        p.rect(x, y + buttonSize + buttonSpacing + 30, buttonSize, buttonSize, 5);
        p.fill(255);
        p.noStroke();
        p.beginShape();
        p.vertex(x + buttonSize/2, y + buttonSize + buttonSpacing + 30 + 3*buttonSize/4);
        p.vertex(x + 3*buttonSize/4, y + buttonSize + buttonSpacing + 30 + buttonSize/4);
        p.vertex(x + buttonSize/4, y + buttonSize + buttonSpacing + 30 + buttonSize/4);
        p.endShape(p.CLOSE);
        
        // Second down arrow button - gray if down is active
        p.fill(this.secondButtonActive === 'down' ? grayColor : purpleColor);
        p.stroke(0);
        p.rect(x + buttonSize + buttonSpacing, y + buttonSize + buttonSpacing + 30, buttonSize, buttonSize, 5);
        p.fill(255);
        p.noStroke();
        p.beginShape();
        p.vertex(x + buttonSize + buttonSpacing + buttonSize/2, y + buttonSize + buttonSpacing + 30 + 3*buttonSize/4);
        p.vertex(x + buttonSize + buttonSpacing + 3*buttonSize/4, y + buttonSize + buttonSpacing + 30 + buttonSize/4);
        p.vertex(x + buttonSize + buttonSpacing + buttonSize/4, y + buttonSize + buttonSpacing + 30 + buttonSize/4);
        p.endShape(p.CLOSE);
    }
    
    drawCelsiusScale(p, x, startY, height) {
        p.textAlign(p.LEFT, p.CENTER);
        p.textSize(12);
        
        // Draw the markings directly on the stem
        for (let temp = -5; temp <= 45; temp += 5) {
            // Adjusted mapping to make scale more compact
            const y = this.mapTemperature(temp, -5, 45, startY + height - 10, startY + 20);
            
            // Draw tick mark directly on the stem
            p.stroke(0);
            p.strokeWeight(2);
            
            // Longer marks for multiples of 10
            if (temp % 10 === 0) {
                p.line(x, y, x + 30, y);
                
                // Draw temperature text
                p.noStroke();
                p.fill(0);
                p.textSize(14);
                p.text(temp, x + 35, y);
            } else {
                // Shorter marks for multiples of 5
                p.line(x, y, x + 20, y);
            }
        }
    }
    
    drawFahrenheitScale(p, x, startY, height) {
        p.textAlign(p.RIGHT, p.CENTER);
        p.textSize(12);
        
        // Draw the markings directly on the stem
        for (let temp = 25; temp <= 110; temp += 5) {
            const celsius = this.model.fahrenheitToCelsius(temp);
            // Adjusted mapping to make scale more compact
            const y = this.mapTemperature(celsius, -5, 45, startY + height - 10, startY + 20);
            
            // Draw tick mark directly on the stem
            p.stroke(0);
            p.strokeWeight(2);
            
            // Longer marks for multiples of 10
            if (temp % 10 === 0) {
                p.line(x - 30, y, x, y);
                
                // Draw temperature text
                p.noStroke();
                p.fill(0);
                p.textSize(14);
                p.text(temp, x - 35, y);
            } else {
                // Shorter marks for multiples of 5
                p.line(x - 15, y, x, y);
            }
        }
    }
    
    mapTemperature(value, start1, stop1, start2, stop2) {
        return p5.prototype.map(value, start1, stop1, start2, stop2);
    }
}

// Controller - Handles user input
class TemperatureController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        // Set up event listeners
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', () => {
    const model = new TemperatureModel();
    const view = new TemperatureView(model);
    const controller = new TemperatureController(model, view);
});