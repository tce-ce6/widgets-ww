// P5.js sketch enclosed in an instance mode function

const sketch = (p) => {

    //===========================================
    // MODEL: Manages the state and data of the widget
    //===========================================
    const model = {
        // Canvas Dimensions - Updated to higher resolution
        canvasWidth: 1200,
        canvasHeight: 700,

        // Environment Constants
        maxAltitude: 5000,
        initialTemp: 30,
        initialPressure: 1013,
        minTemp: -8.4,
        minPressure: 538.2,
        
        // Balloon State - Scaled positions
        balloon: {
            x: 333,  // 250 * 1.333
            y: 587,  // 440 * 1.333
            baseWidth: 40,  // 30 * 1.333
            baseHeight: 60, // 45 * 1.333
            currentWidth: 53,  // 40 * 1.333
            currentHeight: 87, // 65 * 1.333
        },
        isDragging: false,
        balloonSVG: null, // To hold baloon2.svg
        insightButtonSVG: null, // To hold btn_Insight.svg
        
        // Atmosphere state
        airMolecules: [],
        numMolecules: 2500,

        // Calculated Values
        altitude: 0,
        temperature: 30,
        pressure: 1013,

        // UI Elements - Scaled positions
        insightsButton: { x: 713, y: 407, w: 186, h: 55, label: 'Insights', alpha: 0 }, // 535*1.333, 305*1.333, 130*1.333, 45*1.333
        isInsightsHovered: false,
        isInsightsVisible: false,
        bgImage: null,
        resetButton: null, // Reference to the reset button element
        
        // Colors
        colorRed: null,
        colorBlue: null,
    };

    //===========================================
    // CONTROLLER: Handles user input and updates the model
    //===========================================
    const controller = {
        initialize() {
            model.balloon.x = 333;
            model.balloon.y = 587;
            model.isDragging = false;
            model.isInsightsVisible = false;
            model.insightsButton.alpha = 0;
            model.airMolecules = []; // Clear previous molecules for reset

            if (model.resetButton) {
                model.resetButton.disabled = true;
            }
            
            if (model.airMolecules.length === 0) {
                const totalMolecules = model.numMolecules;
                const altitudeToY = (alt) => p.map(alt, 0, model.maxAltitude, 587, 224); // 440*1.333=587, 168*1.333=224

                const layers = [
                    { startAlt: 0,    endAlt: 1000, percentage: 0.45 }, // 1125 particles
                    { startAlt: 1000, endAlt: 2000, percentage: 0.25 }, // 625 particles
                    { startAlt: 2000, endAlt: 3000, percentage: 0.15 }, // 375 particles
                    { startAlt: 3000, endAlt: 4000, percentage: 0.10 }, // 250 particles
                    { startAlt: 4000, endAlt: 5000, percentage: 0.05 },
                    { startAlt: 5000, endAlt: 6000, percentage: 0.05 },  // 125 particles
                ];

                const createParticlesInLayer = (count, yMin, yMax) => {
                    for (let i = 0; i < count; i++) {
                        const yPos = p.random(yMin, yMax);
                        const xPos = p.random(140, 527); // 105*1.333=140, 395*1.333=527
                        model.airMolecules.push({
                            x: xPos, y: yPos, initialY: yPos,
                            vx: p.random(-0.15, 0.15), vy: p.random(-0.15, 0.15)
                        });
                    }
                };
                
                for (const layer of layers) {
                    const numToCreate = Math.floor(totalMolecules * layer.percentage);
                    const yMax = altitudeToY(layer.startAlt); 
                    const yMin = altitudeToY(layer.endAlt);   
                    createParticlesInLayer(numToCreate, yMin, yMax);
                }
            }

            this.updateValuesFromY(model.balloon.y);
        },

       updateValuesFromY(balloonY) {
            const atmosphereBottomY = 587;  // 0m position (440 * 1.333)
            const atmosphereTopY = 224;     // 5000m position (168 * 1.333)
            
            // Calculate altitude based on balloon's bottom position (balloonY)
            model.altitude = p.map(balloonY, atmosphereBottomY, atmosphereTopY, 0, model.maxAltitude);
            model.altitude = p.constrain(model.altitude, 0, model.maxAltitude);

            model.temperature = model.initialTemp - (model.altitude / 1000) * 6.4;
            const altitudeInKm = model.altitude / 1000;
        
            model.pressure = model.initialPressure * Math.pow(1 - 0.103, altitudeInKm);
            
            // Calculate balloon size based on altitude
            const normalizedAltitude = p.map(model.altitude, 0, model.maxAltitude, 0, 1);
            const growthFactor = Math.pow(normalizedAltitude, 3); 
            const startMultiplier = 1.0;
            const endMultiplier = 1.6;
           const sizeMultiplier = p.map(model.altitude, 0, model.maxAltitude, startMultiplier, endMultiplier);
            
            model.balloon.currentWidth = model.balloon.baseWidth * sizeMultiplier;
            model.balloon.currentHeight = model.balloon.baseHeight * sizeMultiplier;

            if (model.resetButton) {
               model.resetButton.disabled = !(model.altitude > 0);
            }
        },
        
        handleMouseInteraction() {
            const ib = model.insightsButton;
            model.isInsightsHovered = false;
            if (model.insightsButton.alpha > 200) {
                model.isInsightsHovered = (p.mouseX > ib.x && p.mouseX < ib.x + ib.w && p.mouseY > ib.y && p.mouseY < ib.y + ib.h);
            }
            
            if (model.isInsightsHovered || model.isDragging) {
                p.cursor(p.HAND);
            } else {
                let d = p.dist(p.mouseX, p.mouseY, model.balloon.x, model.balloon.y - model.balloon.currentHeight / 2);
                p.cursor(d < model.balloon.currentWidth / 2 ? p.HAND : p.ARROW);
            }
        },

        handleMousePressed() {
            if (model.isInsightsHovered) {
                model.isInsightsVisible = !model.isInsightsVisible;
                return;
            }

            let d = p.dist(p.mouseX, p.mouseY, model.balloon.x, model.balloon.y - model.balloon.currentHeight / 2);
            if (d < model.balloon.currentWidth / 2) {
                model.isDragging = true;
            }
        },
        
        handleMouseDragged() {
            if (model.isDragging) {
                // The y-coordinate corresponding to the 5000m mark
                const topLimit = 224;  // 168 * 1.333
                const bottomLimit = 587; // 440 * 1.333
                
                // Constrain the balloon's y-position to the defined limits
                model.balloon.y = p.constrain(p.mouseY, topLimit, bottomLimit);
                this.updateValuesFromY(model.balloon.y);
            }
        },
        
        handleMouseReleased() {
            model.isDragging = false;
        },

        moveMolecules() {
            const moveRange = 6.67; // 5 * 1.333
            const radius = 2; // 1.5 * 1.333

            // Container geometry - Scaled
            const rectX = 133, rectY = 133, rectW = 400, rectH = 453, cornerRadius = 20; // 100*1.333, 100*1.333, 300*1.333, 340*1.333, 15*1.333

            // Define boundaries of the inner rectangle and the corner squares
            const leftInner = rectX + cornerRadius;
            const rightInner = rectX + rectW - cornerRadius;
            const topInner = rectY + cornerRadius;
            const bottomInner = rectY + rectH - cornerRadius;

            for (let m of model.airMolecules) {
                // Update position based on velocity
                m.x += m.vx;
                m.y += m.vy;

                // 1. Apply local Y-axis "wobble" constraint first.
                const localTop = m.initialY - moveRange;
                const localBottom = m.initialY + moveRange;
                if (m.y < localTop) { m.y = localTop; m.vy *= -1; }
                if (m.y > localBottom) { m.y = localBottom; m.vy *= -1; }

                // 2. Determine the particle's region and apply container collision logic.
                if (m.x > leftInner && m.x < rightInner) { // In the Central Vertical Column
                    if (m.y < rectY + radius) { m.y = rectY + radius; m.vy *= -1; }
                    if (m.y > rectY + rectH - radius) { m.y = rectY + rectH - radius; m.vy *= -1; }
                } else if (m.y > topInner && m.y < bottomInner) { // In the Middle Horizontal Rows
                    if (m.x < rectX + radius) { m.x = rectX + radius; m.vx *= -1; }
                    if (m.x > rectX + rectW - radius) { m.x = rectX + rectW - radius; m.vx *= -1; }
                } else { // In one of the four Corner Regions
                    let cornerCenterX, cornerCenterY;

                    if (m.x <= leftInner && m.y <= topInner) { // Top-Left
                        cornerCenterX = leftInner; cornerCenterY = topInner;
                    } else if (m.x >= rightInner && m.y <= topInner) { // Top-Right
                        cornerCenterX = rightInner; cornerCenterY = topInner;
                    } else if (m.x <= leftInner && m.y >= bottomInner) { // Bottom-Left
                        cornerCenterX = leftInner; cornerCenterY = bottomInner;
                    } else if (m.x >= rightInner && m.y >= bottomInner) { // Bottom-Right
                        cornerCenterX = rightInner; cornerCenterY = bottomInner;
                    }

                    if (cornerCenterX) {
                        let dx = m.x - cornerCenterX;
                        let dy = m.y - cornerCenterY;
                        let dist = Math.sqrt(dx * dx + dy * dy);
                        
                        if (dist > cornerRadius - radius) {
                            const normalX = dx / dist;
                            const normalY = dy / dist;
                            
                            const dotProduct = m.vx * normalX + m.vy * normalY;
                            m.vx -= 2 * dotProduct * normalX;
                            m.vy -= 2 * dotProduct * normalY;

                            m.x = cornerCenterX + normalX * (cornerRadius - radius);
                            m.y = cornerCenterY + normalY * (cornerRadius - radius);
                        }
                    }
                }
            }
        }
    };

    //===========================================
    // VIEW: Handles all the drawing to the canvas
    //===========================================
    const view = {
        drawBackground() {
            p.clear();
        },

        drawHeaderAndFooter() {
            // p.fill(28, 137, 222);
            // p.noStroke();
            // p.rect(p.width/2 - 333, -20, 667, 80, 27); // 250*1.333=333, -15*1.333=-20, 500*1.333=667, 60*1.333=80, 20*1.333=27
            // p.fill(255);
            // p.textSize(24); // 18 * 1.333
            // p.textAlign(p.CENTER, p.CENTER);
            // p.textStyle(p.NORMAL);
            // p.text("Altitude and Temperature – A Cool Connection", p.width / 2, 27); // 20 * 1.333

            p.fill(0, 0, 139);
            p.textSize(17); // 13 * 1.333
            p.textStyle(p.BOLDITALIC);
            p.text("Drag the balloon up and down.", p.width / 2.6, 80); // 60 * 1.333
            p.textStyle(p.ITALIC);
            p.text("What changes do you observe in temperature and atmospheric pressure in relation to altitude?", p.width / 4, 107); // 80 * 1.333
            
            p.fill(130);
            p.textSize(13); // 10 * 1.333
            p.textAlign(p.CENTER, p.BOTTOM);
            p.text("Disclaimer: These are simplified and approximate values. Real atmospheric conditions require detailed calculations for accuracy.", p.width / 2, p.height - 13); // -10 * 1.333
        },

        drawAtmosphereColumn() {
            p.fill('#4A90E2');
            p.noStroke();
            p.rect(133, 133, 400, 453, 20); // 100*1.333, 100*1.333, 300*1.333, 340*1.333, 15*1.333

            p.noStroke();
            p.fill(66, 66, 255, 120);
            for (let m of model.airMolecules) {
                p.ellipse(m.x, m.y, 4, 4); // 3 * 1.333
            }

            // Draw altitude markers - Scaled
            p.stroke(80);
            p.strokeWeight(1.33); // 1 * 1.333
            p.textAlign(p.LEFT, p.CENTER);
            p.textSize(16); // 12 * 1.333
            p.fill(50);
            for (let i = 0; i <= 5; i++) {
                let yPos = p.map(i * 1000, 0, model.maxAltitude, 587, 224); // 440*1.333=587, 168*1.333=224
                p.line(540, yPos, 553, yPos); // 405*1.333=540, 415*1.333=553
                p.text(`${i * 1000} m`, 560, yPos); // 420 * 1.333
            }
            
            p.textStyle(p.BOLD);
            p.textSize(19); // 14 * 1.333
            p.fill(50);
            p.strokeWeight(0.67); // 0.5 * 1.333
            p.text("Thin Air", 40, 224); // 30*1.333=40, 168*1.333=224
            p.text("Dense Air", 40, 587); // 30*1.333=40, 440*1.333=587
            p.textStyle(p.NORMAL);
        },
        
       drawBalloons() {
            p.push();
            p.imageMode(p.CENTER);

            const centerX = model.balloon.x;
            const centerY = model.balloon.y - model.balloon.currentHeight / 2;
            const currentW = model.balloon.currentWidth;
            const currentH = model.balloon.currentHeight;

            // Draw the single balloon if the SVG is loaded
            if (model.balloonSVG) {
                p.image(model.balloonSVG, centerX, centerY, currentW, currentH);
            }
            
            p.pop();
        },

        drawReadoutPanels() {
             const drawBox = (y, label, value, unit, valColor, valBorderColor) => {
                p.fill(255);
                p.stroke(220);
                p.strokeWeight(1.33); // 1 * 1.333
                p.rect(713, y, 427, 73, 16); // 535*1.333=713, 320*1.333=427, 55*1.333=73, 12*1.333=16
                
                p.fill(50);
                p.noStroke();
                p.textAlign(p.LEFT, p.CENTER);
                p.textSize(20); // 15 * 1.333
                p.textStyle(p.BOLD);
                p.text(label, 733, y + 37); // 550*1.333=733, 28*1.333=37
                
                const valBoxX = 907; // 680 * 1.333
                const valBoxY = y + 13; // 10 * 1.333
                const valBoxW = 220; // 165 * 1.333
                const valBoxH = 47; // 35 * 1.333
                const valBoxR = 11; // 8 * 1.333
                
                p.fill(255, 255, 255, 100);
                p.noStroke();
                p.rect(valBoxX, valBoxY, valBoxW, valBoxH, valBoxR);
                
                p.push();
                p.stroke(valBorderColor);
                p.strokeWeight(0.67); // 0.5 * 1.333
                p.drawingContext.setLineDash([4, 4]); // 3*1.333=4
                p.noFill();
                p.rect(valBoxX, valBoxY, valBoxW, valBoxH, valBoxR);
                p.drawingContext.setLineDash([]);
                p.pop();

                p.noStroke();
                p.textAlign(p.RIGHT, p.CENTER);
                p.textSize(27); // 20 * 1.333
                p.fill(valColor);
                p.text(value, valBoxX + valBoxW - 93, y + 37); // 70*1.333=93, 28*1.333=37

                p.textAlign(p.LEFT, p.CENTER);
                p.textSize(20); // 15 * 1.333
                p.fill(valColor);
                p.text(unit, valBoxX + valBoxW - 87, y + 39); // 65*1.333=87, 29*1.333=39
            };

            drawBox(133, "Altitude", model.altitude.toFixed(0), "m", p.color(255, 77, 0), p.color(255, 77, 0)); // 100*1.333=133
            drawBox(227, "Atmospheric\nPressure", model.pressure.toFixed(0), "mbar", p.color(0, 132, 17), p.color(0, 132, 17)); // 170*1.333=227
            drawBox(320, "Temperature", model.temperature.toFixed(1), "°C", p.color(0, 13, 185), p.color(0, 13, 185)); // 240*1.333=320
        },

        drawInsights() {
            if (model.isInsightsVisible) {
                p.fill(255);
                p.stroke(220);
                p.strokeWeight(1.33); // 1 * 1.333
                p.rect(713, 427, 427, 200, 13); // 535*1.333=713, 320*1.333=427, 320*1.333=427, 150*1.333=200, 10*1.333=13

                p.fill(50);
                p.noStroke();
                p.textAlign(p.LEFT, p.TOP);
                p.textStyle(p.BOLD);
                p.textSize(16); // 12 * 1.333
                p.text("Impact of Altitude on Temperature and\nAtmospheric Pressure", 727, 493, 400); // 545*1.333=727, 370*1.333=493, 300*1.333=400
                
                p.textStyle(p.NORMAL);
                p.textSize(15); // 11 * 1.333
                p.fill(80);
                p.text("• With an increase in altitude, air density decreases,\n  resulting in lower temperature and pressure.", 727, 533, 400); // 545*1.333=727, 400*1.333=533, 300*1.333=400
                
                p.textStyle(p.NORMAL);
                p.textSize(15); // 11 * 1.333
                p.fill(80);
                p.text("• With a decrease in altitude, the air density increases, resulting in higher temperature and atmospheric pressure.", 727, 573, 400); // 545*1.333=727, 430*1.333=573, 300*1.333=400
            }
        },
        
        drawInsightsButton() {
            model.insightsButton.alpha = 255;
            
            const { x, y, w, h } = model.insightsButton;
            
            if (model.insightButtonSVG) {
                p.push();
                p.imageMode(p.CORNER);
                p.image(model.insightButtonSVG, x, y, w, h );
                p.pop();
            }
        },
    };

    //===========================================
    // P5.js Main Functions
    //===========================================
    p.preload = function() {
        model.bgImage = p.loadImage('assets/Sky_BG_02.jpg');
        model.balloonSVG = p.loadImage('assets/baloon2.svg'); // Only load one balloon
        model.insightButtonSVG = p.loadImage('assets/btn_Insight.svg');
    };

    p.setup = function() {
        p.createCanvas(model.canvasWidth, model.canvasHeight).parent('canvas-container');
        
        model.resetButton = document.getElementById('resetButton');
        if (model.resetButton) {
            model.resetButton.addEventListener('click', () => {
                controller.initialize();
            });
        }
        
        controller.initialize();
    };

    p.draw = function() {
        view.drawBackground();
        controller.moveMolecules();
        controller.handleMouseInteraction();
        
        view.drawAtmosphereColumn();
        view.drawBalloons();
        view.drawReadoutPanels();
        view.drawHeaderAndFooter();
        view.drawInsights();
        view.drawInsightsButton();
    };

    p.mousePressed = () => controller.handleMousePressed();
    p.mouseDragged = () => controller.handleMouseDragged();
    p.mouseReleased = () => controller.handleMouseReleased();
};

new p5(sketch);