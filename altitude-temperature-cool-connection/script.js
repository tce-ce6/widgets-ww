// P5.js sketch enclosed in an instance mode function

const sketch = (p) => {

    //===========================================
    // MODEL: Manages the state and data of the widget
    //===========================================
    const model = {
        // Canvas Dimensions - Updated to 4K resolution
        canvasWidth: 3840,
        canvasHeight: 2160,

        // Environment Constants
        maxAltitude: 5000,
        initialTemp: 30,
        initialPressure: 1013,
        minTemp: -8.4,
        minPressure: 538.2,
        
        // Balloon State - Scaled positions (2.88x)
        balloon: {
            x: 959,   // 333 * 2.88
            y: 1691,  // 587 * 2.88
            baseWidth: 300,   // 40 * 2.88
            baseHeight: 300,  // 60 * 2.88
            currentWidth: 153, // 53 * 2.88
            currentHeight: 251, // 87 * 2.88
        },
        isDragging: false,
        // balloonSVG: null, // REPLACED: No longer loading a static SVG
        balloonAnimation: null, // To hold the Lottie animation instance
        lottieCanvas: null,     // To hold the offscreen p5.Graphics for Lottie
        insightButtonSVG: null, // To hold btn_Insight.svg
        lottieBottomPadding: 0.20,
        // Atmosphere state
        airMolecules: [],
        numMolecules: 2500,

        // Calculated Values
        altitude: 0,
        temperature: 30,
        pressure: 1013,

        // UI Elements - Scaled positions (2.88x)
        insightsButton: { x: 2053, y: 1172, w: 536, h: 158, label: 'Insights', alpha: 0 }, // 713*2.88, 407*2.88, 186*2.88, 55*2.88
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
            model.balloon.x = 959;
            model.balloon.y = 1691;
            model.isDragging = false;
            model.isInsightsVisible = false;
            model.insightsButton.alpha = 0;
            model.airMolecules = []; // Clear previous molecules for reset

            if (model.resetButton) {
                model.resetButton.disabled = true;
            }
            
            if (model.airMolecules.length === 0) {
                const totalMolecules = model.numMolecules;
                const altitudeToY = (alt) => p.map(alt, 0, model.maxAltitude, 1691, 646); // 587*2.88=1691, 224*2.88=646

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
                        const xPos = p.random(403, 1518); // 140*2.88=403, 527*2.88=1518
                        model.airMolecules.push({
                            x: xPos, y: yPos, initialY: yPos,
                            vx: p.random(-0.43, 0.43), vy: p.random(-0, 0)
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
            const atmosphereBottomY = 1691;  // 587 * 2.88
            const atmosphereTopY = 646;      // 224 * 2.88
            
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
            const endMultiplier = 1.48;
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
                const topLimit = 646;   // 224 * 2.88
                const bottomLimit = 1691; // 587 * 2.88
                
                // Constrain the balloon's y-position to the defined limits
                model.balloon.y = p.constrain(p.mouseY, topLimit, bottomLimit);
                this.updateValuesFromY(model.balloon.y);
            }
        },
        
        handleMouseReleased() {
            model.isDragging = false;
        },

        // --- START: Added Touch Handlers ---

        handleTouchStarted() {
            if (p.touches.length === 0) return; // Exit if no touch data
            const touchX = p.touches[0].x;
            const touchY = p.touches[0].y;

            // 1. Check for Insights button tap
            const ib = model.insightsButton;
            const isTouchingInsights = (touchX > ib.x && touchX < ib.x + ib.w && touchY > ib.y && touchY < ib.y + ib.h);
            if (model.insightsButton.alpha > 200 && isTouchingInsights) {
                model.isInsightsVisible = !model.isInsightsVisible;
                return; // Tapped button, don't start drag
            }

            // 2. Check for balloon drag start
            let d = p.dist(touchX, touchY, model.balloon.x, model.balloon.y - model.balloon.currentHeight / 2);
            if (d < model.balloon.currentWidth / 2) {
                model.isDragging = true;
                return false; // Prevent default behavior (like page scrolling)
            }
        },

        handleTouchMoved() {
            if (model.isDragging && p.touches.length > 0) {
                const touchY = p.touches[0].y;
                // The y-coordinate corresponding to the 5000m mark
                const topLimit = 646;   // 224 * 2.88
                const bottomLimit = 1691; // 587 * 2.88
                
                // Constrain the balloon's y-position to the defined limits
                model.balloon.y = p.constrain(touchY, topLimit, bottomLimit);
                this.updateValuesFromY(model.balloon.y);
                return false; // IMPORTANT: Prevent default page scrolling
            }
        },
        
        handleTouchEnded() {
            model.isDragging = false;
        },

        // --- END: Added Touch Handlers ---

        moveMolecules() {
            const moveRange = 19; // 6.67 * 2.88
            const radius = 6;     // 2 * 2.88

            // Container geometry - Scaled (2.88x)
            const rectX = 384, rectY = 383, rectW = 1152, rectH = 1306, cornerRadius = 58; // 133*2.88, 133*2.88, 400*2.88, 453*2.88, 20*2.88

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
            p.fill(0, 0, 139);
            p.textSize(49); // 17 * 2.88
            p.textStyle(p.BOLDITALIC);
            p.text("Drag the balloon up and down.", p.width / 2.6, 230); // 80 * 2.88
            p.textStyle(p.ITALIC);
            p.text("What changes do you observe in temperature and atmospheric pressure in relation to altitude?", p.width / 4, 308); // 107 * 2.88
            
            p.fill(130);
            p.textSize(50); // 13 * 2.88
            p.textAlign(p.CENTER, p.BOTTOM);
            p.text("Disclaimer: These are simplified and approximate values. Real atmospheric conditions require detailed calculations for accuracy.", p.width / 2, p.height - 250); // -13 * 2.88
        },

        drawAtmosphereColumn() {
            p.fill('#4A90E2');
            p.noStroke();
            p.rect(384, 383, 1152, 1306, 58); // 133*2.88, 133*2.88, 400*2.88, 453*2.88, 20*2.88

            p.noStroke();
            p.fill(66, 66, 255, 120);
            for (let m of model.airMolecules) {
                p.ellipse(m.x, m.y, 12, 12); // 4 * 2.88
            }

            // Draw altitude markers - Scaled (2.88x)
            p.stroke(80);
            // p.strokeWeight(3.84); // 1.33 * 2.88
            p.textAlign(p.LEFT, p.CENTER);
            p.textSize(46); // 16 * 2.88
            p.fill(0);
            for (let i = 0; i <= 5; i++) {
                let yPos = p.map(i * 1000, 0, model.maxAltitude, 1691, 646); // 587*2.88=1691, 224*2.88=646
                p.line(1555, yPos -12, 1593, yPos - 12); // 540*2.88=1555, 553*2.88=1593
                p.text(`${i * 1000} m`, 1613, yPos -12); // 560 * 2.88
            }
            
            p.textStyle(p.BOLD);
            p.textSize(55); // 19 * 2.88
            p.fill(0);
            p.strokeWeight(0.6); // 0.67 * 2.88
            p.text("Thin Air", 115, 646); // 40*2.88=115, 224*2.88=646
            p.text("Dense Air", 80, 1655); // 40*2.88=115, 587*2.88=1691
            p.textStyle(p.NORMAL);
        },
        
        drawBalloons() {
             p.push();
             p.imageMode(p.CENTER);

            const centerX = model.balloon.x;
             const currentW = model.balloon.currentWidth;
             const currentH = model.balloon.currentHeight;
// **--- START OF FIX ---**

// 1. Calculate the padding in pixels based on the balloon's current height
            const paddingInPixels = currentH * model.lottieBottomPadding;

// 2. Adjust the center Y by ADDING the padding. This shifts the image DOWN.
            const centerY = (model.balloon.y - currentH / 2) + paddingInPixels;

// **--- END OF FIX ---**

// Draw the Lottie animation
            if (model.lottieCanvas) {
            p.image(model.lottieCanvas, centerX, centerY, currentW, currentH);
        }

    p.pop();
       },

        drawReadoutPanels() {
            const drawBox = (y, label, value, unit, valColor, valBorderColor) => {
                p.fill(255);
                p.stroke(220);
                p.strokeWeight(3.84); // 1.33 * 2.88
                p.rect(2053, y, 1230, 210, 46); // 713*2.88=2053, 427*2.88=1230, 73*2.88=210, 16*2.88=46
                
                p.fill(50);
                p.noStroke();
                p.textAlign(p.LEFT, p.CENTER);
                p.textSize(58); // 20 * 2.88
                p.textStyle(p.BOLD);
                p.text(label, 2112, y + 106); // 733*2.88=2112, 37*2.88=106
                
                const valBoxX = 2612; // 907 * 2.88
                const valBoxY = y + 37; // 13 * 2.88
                const valBoxW = 634; // 220 * 2.88
                const valBoxH = 135; // 47 * 2.88
                const valBoxR = 32; // 11 * 2.88
                
                p.fill(255, 255, 255, 100);
                p.noStroke();
                p.rect(valBoxX, valBoxY, valBoxW, valBoxH, valBoxR);
                
                p.push();
                p.stroke(valBorderColor);
                p.strokeWeight(1.92); // 0.67 * 2.88
                p.drawingContext.setLineDash([12, 12]); // 4*2.88=12
                p.noFill();
                p.rect(valBoxX, valBoxY, valBoxW, valBoxH, valBoxR);
                p.drawingContext.setLineDash([]);
                p.pop();

                p.noStroke();
                p.textAlign(p.RIGHT, p.CENTER);
                p.textSize(78); // 27 * 2.88
                p.fill(valColor);
                p.text(value, valBoxX + valBoxW - 268, y + 106); // 93*2.88=268, 37*2.88=106

                p.textAlign(p.LEFT, p.CENTER);
                p.textSize(58); // 20 * 2.88
                p.fill(valColor);
                p.text(unit, valBoxX + valBoxW - 251, y + 112); // 87*2.88=251, 39*2.88=112
            };

            drawBox(383, "Altitude", model.altitude.toFixed(0), "m", p.color(255, 77, 0), p.color(255, 77, 0)); // 133*2.88=383
            drawBox(654, "Atmospheric\nPressure", model.pressure.toFixed(0), "mbar", p.color(0, 132, 17), p.color(0, 132, 17)); // 227*2.88=654
            drawBox(921, "Temperature", model.temperature.toFixed(1), "°C", p.color(0, 13, 185), p.color(0, 13, 185)); // 320*2.88=921
        },

        drawInsights() {
        if (model.isInsightsVisible) {
            p.fill(255);
            p.stroke(220);
            p.strokeWeight(3.84); 
            p.rect(2053, 1228, 1230, 576, 37); 

            p.fill(50);
            p.noStroke();
            p.textAlign(p.LEFT, p.TOP);
            p.textStyle(p.BOLD);
            p.textSize(46); 
            p.text("Impact of Altitude on Temperature and\nAtmospheric Pressure", 2093, 1369, 1152); 
            
            p.textStyle(p.NORMAL);
            p.textSize(43); 
            p.fill(80);

            // --- Define positions for hanging indent ---
            let startX = 2093;
            let y1 = 1505;
            let y2 = 1624;
            let totalWidth = 1152;
            let indent = 45; // Adjust this value for more/less space
            
            let textX = startX + indent;
            let textWidth = totalWidth - indent;
            
            // --- Bullet 1 ---
            let text1 = "With an increase in altitude, air density decreases, resulting in lower temperature and pressure.";
            p.text("*", startX, y1); // Draw bullet
            p.text(text1, textX, y1, textWidth); // Draw indented text
            
            // --- Bullet 2 ---
            let text2 = "With a decrease in altitude, the air density increases, resulting in higher temperature and atmospheric pressure.";
            p.text("*", startX, y2); // Draw bullet
            p.text(text2, textX, y2, textWidth); // Draw indented text
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
        model.bgImage = p.loadImage('assets/Sky_BG_02.svg');
        // **MODIFIED:** Removed the static balloon SVG load
        // model.balloonSVG = p.loadImage('assets/baloon2.svg');
        model.insightButtonSVG = p.loadImage('assets/btn_Insight.svg');
    };

    p.setup = function() {
       p.pixelDensity(p.displayDensity());


        p.createCanvas(model.canvasWidth, model.canvasHeight).parent('canvas-container');
        p.smooth(); // Ensures smoothing is on
        p.drawingContext.imageSmoothingQuality = 'high';        
        // --- Lottie Initialization ---
        // 1. Create an offscreen p5.Graphics canvas for Lottie to draw on.
        // We make it larger than the max balloon size (approx 184w x 277h) for good resolution.
        const lottieWidth = 400;
        const lottieHeight = 400;
        model.lottieCanvas = p.createGraphics(lottieWidth, lottieHeight);

        // 2. Load the Lottie animation, checking if the library is loaded
        if (typeof lottie !== 'undefined') {
            model.balloonAnimation = lottie.loadAnimation({
                renderer: 'canvas',
                loop: true,
                autoplay: true,
                path: 'assets/hot_air_baloon.json', // Your specified path
                rendererSettings: {
                    canvas: model.lottieCanvas.elt, // Pass the <canvas> element from p5.Graphics
                    context: model.lottieCanvas.drawingContext, // Pass its 2D context
                    clearCanvas: true, // Lottie will clear its own canvas each frame
                    progressiveLoad: true,
                    hideOnTransparent: true,
                }
            });
        } else {
            console.error("Lottie library is not loaded. Please include it in your HTML.");
        }
        // --- End Lottie Initialization ---
        
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
        view.drawBalloons(); // This now draws the Lottie animation
        view.drawReadoutPanels();
        view.drawHeaderAndFooter();
        view.drawInsights();
        view.drawInsightsButton();
    };

    p.mousePressed = () => controller.handleMousePressed();
    p.mouseDragged = () => controller.handleMouseDragged();
    p.mouseReleased = () => controller.handleMouseReleased();

    // --- START: Added Touch Event Hooks ---
    p.touchStarted = () => controller.handleTouchStarted();
    p.touchMoved = () => controller.handleTouchMoved();
    p.touchEnded = () => controller.handleTouchEnded();
    // --- END: Added Touch Event Hooks ---
};

new p5(sketch);