// P5.js sketch enclosed in an instance mode function

const sketch = (p) => {

    //===========================================
    // MODEL: Manages the state and data of the widget
    //===========================================
    const model = {
        // Canvas Dimensions
        canvasWidth: 900,
        canvasHeight: 500,

        // Environment Constants
        maxAltitude: 5000,
        initialTemp: 30,
        initialPressure: 1013,
        minTemp: -8.4,
        minPressure: 538.2,
        
        // Balloon State
        balloon: {
            x: 250,
            y: 440,
            baseWidth: 30,
            baseHeight: 45,
            currentWidth: 40,
            currentHeight: 65,
            redBalloonAlpha: 255,   // Opacity for the red balloon
            blueBalloonAlpha: 0,    // Opacity for the blue balloon
        },
        isDragging: false,
        balloonSVG1: null, // To hold baloon1.svg (blue)
        balloonSVG2: null, // To hold baloon2.svg (red)
        insightButtonSVG: null, // To hold btn_Insight.svg
        
        // Atmosphere state
        airMolecules: [],
        numMolecules: 2500,

        // Calculated Values
        altitude: 0,
        temperature: 30,
        pressure: 1013,

        // UI Elements
        insightsButton: { x: 535, y: 305, w: 130, h: 45, label: 'Insights', alpha: 0 },
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
            model.balloon.x = 250;
            model.balloon.y = 440;
            model.isDragging = false;
            model.isInsightsVisible = false;
            model.insightsButton.alpha = 0;
            model.airMolecules = []; // Clear previous molecules for reset

            if (model.resetButton) {
                model.resetButton.disabled = true;
            }
            
            if (model.airMolecules.length === 0) {
                const totalMolecules = model.numMolecules;
                const altitudeToY = (alt) => p.map(alt, 0, model.maxAltitude, 440, 168);

                const layers = [
                    { startAlt: 0,    endAlt: 1000, percentage: 0.45 }, // 1125 particles
                    { startAlt: 1000, endAlt: 2000, percentage: 0.25 }, // 625 particles
                    { startAlt: 2000, endAlt: 3000, percentage: 0.15 }, // 375 particles
                    { startAlt: 3000, endAlt: 4000, percentage: 0.10 }, // 250 particles
                    { startAlt: 4000, endAlt: 5000, percentage: 0.05 }  // 125 particles
                ];

                const createParticlesInLayer = (count, yMin, yMax) => {
                    for (let i = 0; i < count; i++) {
                        const yPos = p.random(yMin, yMax);
                        const xPos = p.random(105, 395);
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
            const atmosphereBottomY = 440;  // 0m position
            const atmosphereTopY = 168;     // 5000m position (where label now is)
            
            // Calculate altitude based on balloon's bottom position (balloonY)
            model.altitude = p.map(balloonY, atmosphereBottomY, atmosphereTopY, 0, model.maxAltitude);
            model.altitude = p.constrain(model.altitude, 0, model.maxAltitude);

            model.temperature = model.initialTemp - (model.altitude / 1000) * 6.4;
            const altitudeInKm = model.altitude / 1000;
        
            model.pressure = model.initialPressure * Math.pow(1 - 0.103, altitudeInKm);
            
            const normalizedAltitude = p.map(model.altitude, 0, model.maxAltitude, 0, 1);
            const growthFactor = Math.pow(normalizedAltitude, 3); 
            const startMultiplier = 1.0;
            const endMultiplier = 1.6;
            const sizeMultiplier = startMultiplier + (endMultiplier - startMultiplier) * growthFactor;
            
            model.balloon.currentWidth = model.balloon.baseWidth * sizeMultiplier;
            model.balloon.currentHeight = model.balloon.baseHeight * sizeMultiplier;
            
            const halfwayY = (atmosphereBottomY + atmosphereTopY) / 2;

            if (balloonY <= halfwayY) {
                model.balloon.redBalloonAlpha = p.map(balloonY, halfwayY, atmosphereTopY, 255, 0);
                model.balloon.blueBalloonAlpha = p.map(balloonY, halfwayY, atmosphereTopY, 0, 255);
            } else {
                model.balloon.redBalloonAlpha = 255;
                model.balloon.blueBalloonAlpha = 0;
            }
            model.balloon.redBalloonAlpha = p.constrain(model.balloon.redBalloonAlpha, 0, 255);
            model.balloon.blueBalloonAlpha = p.constrain(model.balloon.blueBalloonAlpha, 0, 255);

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
                // Constrain so balloon's top doesn't go above rectangle top
                const topLimit = 100 + model.balloon.currentHeight;
                const bottomLimit = 440;
                model.balloon.y = p.constrain(p.mouseY, topLimit, bottomLimit);
                this.updateValuesFromY(model.balloon.y);
            }
        },
        
        handleMouseReleased() {
            model.isDragging = false;
        },

        moveMolecules() {
            const moveRange = 5;
            const radius = 1.5;

            // Container geometry
            const rectX = 100, rectY = 100, rectW = 300, rectH = 340, cornerRadius = 15;

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
            if (model.bgImage) {
                p.image(model.bgImage, 0, 0, p.width, p.height);
            } else {
                p.background(220, 235, 255);
            }
        },

        drawHeaderAndFooter() {
            p.fill(28, 137, 222);
            p.noStroke();
            p.rect(p.width/2 - 250, -15, 500, 60, 20);
            p.fill(255);
            p.textSize(18);
            p.textAlign(p.CENTER, p.CENTER);
            p.textStyle(p.NORMAL);
            p.text("Altitude and Temperature – A Cool Connection", p.width / 2, 20);

            p.fill(0, 0, 139);
            p.textSize(13);
            p.textStyle(p.BOLDITALIC);
            p.text("Drag the balloon up and down.", p.width / 2, 60);
             p.textStyle(p.ITALIC);
            p.text("What changes do you observe in temperature and atmospheric pressure in relation to altitude?", p.width / 2, 80);
            
            p.fill(130);
            p.textSize(10);
            p.textAlign(p.CENTER, p.BOTTOM);
            p.text("Disclaimer: These are simplified and approximate values. Real atmospheric conditions require detailed calculations for accuracy.", p.width / 2, p.height - 10);
        },

        drawAtmosphereColumn() {
            p.fill('#4A90E2');
            p.noStroke();
            p.rect(100, 100, 300, 340, 15);

            p.noStroke();
            p.fill(66, 66, 255);
            for (let m of model.airMolecules) {
                p.ellipse(m.x, m.y, 3, 3);
            }

            // Draw altitude markers with adjusted positions
            // 0m stays at 440, 5000m moves to 168 (where it should be visually)
            p.stroke(80);
            p.strokeWeight(1);
            p.textAlign(p.LEFT, p.CENTER);
            p.textSize(12);
            p.fill(50);
            for (let i = 0; i <= 5; i++) {
                let yPos = p.map(i * 1000, 0, model.maxAltitude, 440, 168);
                p.line(405, yPos, 415, yPos);
                p.text(`${i * 1000} m`, 420, yPos);
            }
            
            p.textStyle(p.BOLD);
            p.textSize(14);
            p.fill(50);
            p.strokeWeight(0.5);
            // Position "Thin Air" at the same level as 5000m label
            p.text("Thin Air", 30, 168);
            p.text("Dense Air", 30, 440);
            p.textStyle(p.NORMAL);
        },
        
     drawBalloons() {
            p.push();
            p.imageMode(p.CENTER);

            const centerX = model.balloon.x;
            const centerY = model.balloon.y - model.balloon.currentHeight / 2;
            const currentW = model.balloon.currentWidth;
            const currentH = model.balloon.currentHeight;

            if (model.balloon.redBalloonAlpha > 0 && model.balloonSVG2) {
                p.push();
                p.tint(255, model.balloon.redBalloonAlpha);
                p.image(model.balloonSVG2, centerX, centerY, currentW, currentH);
                p.pop();
            }

            if (model.balloon.blueBalloonAlpha > 0 && model.balloonSVG1) {
                p.push();
                p.tint(255, model.balloon.blueBalloonAlpha);
                p.image(model.balloonSVG1, centerX, centerY, currentW, currentH);
                p.pop();
            }
            
            p.pop();
        },

        drawReadoutPanels() {
             const drawBox = (y, label, value, unit, valColor, valBorderColor) => {
                p.fill(255);
                p.stroke(220);
                p.strokeWeight(1);
                p.rect(535, y, 320, 55, 12);
                
                p.fill(50);
                p.noStroke();
                p.textAlign(p.LEFT, p.CENTER);
                p.textSize(15);
                p.textStyle(p.BOLD);
                p.text(label, 550, y + 28);
                
                const valBoxX = 680;
                const valBoxY = y + 10;
                const valBoxW = 165;
                const valBoxH = 35;
                const valBoxR = 8;
                
                p.fill(255, 255, 255, 100);
                p.noStroke();
                p.rect(valBoxX, valBoxY, valBoxW, valBoxH, valBoxR);
                
                p.push();
                p.stroke(valBorderColor);
                p.strokeWeight(0.5);
                p.drawingContext.setLineDash([3, 3]);
                p.noFill();
                p.rect(valBoxX, valBoxY, valBoxW, valBoxH, valBoxR);
                p.drawingContext.setLineDash([]);
                p.pop();

                p.noStroke();
                p.textAlign(p.RIGHT, p.CENTER);
                p.textSize(20);
                p.fill(valColor);
                p.text(value, valBoxX + valBoxW - 70, y + 28);

                p.textAlign(p.LEFT, p.CENTER);
                p.textSize(15);
                p.fill(valColor);
                p.text(unit, valBoxX + valBoxW - 65, y + 29);
            };

            drawBox(100, "Altitude", model.altitude.toFixed(0), "m", p.color(255, 77, 0), p.color(255, 77, 0));
            drawBox(170, "Atmospheric\nPressure", model.pressure.toFixed(0), "mbar", p.color(0, 132, 17), p.color(0, 132, 17));
            drawBox(240, "Temperature", model.temperature.toFixed(1), "°C", p.color(0, 13, 185), p.color(0, 13, 185));
        },

        drawInsights() {
            if (model.isInsightsVisible) {
                p.fill(255);
                p.stroke(220);
                p.strokeWeight(1);
                p.rect(535, 320, 320, 150, 10);

                p.fill(50);
                p.noStroke();
                p.textAlign(p.LEFT, p.TOP);
                p.textStyle(p.BOLD);
                p.textSize(12);
                p.text("Impact of Altitude on Temperature and\nAtmospheric Pressure", 545, 370, 300);
                
                p.textStyle(p.NORMAL);
                p.textSize(11);
                p.fill(80);
                p.text("• With an increase in altitude, air density decreases,\n  resulting in lower temperature and pressure.", 545, 400, 300);
                
                p.textStyle(p.NORMAL);
                p.textSize(11);
                p.fill(80);
                p.text("• With a decrease in altitude, the air density increases, resulting in higher temperature and atmospheric pressure.", 545, 430, 300);
            }
        },
        
       drawInsightsButton() {
            model.insightsButton.alpha = 255;
            
            const { x, y, w, h } = model.insightsButton;
            
            if (model.insightButtonSVG) {
                p.push();
                p.imageMode(p.CORNER);
                p.image(model.insightButtonSVG, x, y, w, h);
                p.pop();
            }
        },
    };

    //===========================================
    // P5.js Main Functions
    //===========================================
    p.preload = function() {
        model.bgImage = p.loadImage('assets/Sky_BG_02.jpg');
        model.balloonSVG1 = p.loadImage('assets/baloon1.svg');
        model.balloonSVG2 = p.loadImage('assets/baloon2.svg');
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
        controller.moveMolecules();
        controller.handleMouseInteraction();

        view.drawBackground();
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