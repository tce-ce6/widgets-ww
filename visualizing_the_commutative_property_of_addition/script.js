// Model - Handles data and business logic
class Model {
    // Model class constructor with proper transitionPoints
    // In Model class constructor:
    constructor() {
        this.data = {
            slider1: { x: 50, y: 100, value: 1, isDragging: false },
            slider2: { x: 320, y: 100, value: 1, isDragging: false },
            slider3: {  value: 1,isDragging:false }
        };
        this.totalSteps = 15;
        this.totalSteps3 = 440;
        this.stepSize = 230 / (this.totalSteps - 1);
        this.stepSize3 = 440 / (this.totalSteps3 - 1);
        this.animatedBalls = [];  
        this.animationSpeed = 0.2;
        this.prevProgress = 0;
        this.forwardSpeed = 0.15;
        this.backwardSpeed = 0.25;
        this.easingFactor = 0.15;
        // Add phase tracking
        this.currentPhase = 0; // 0: start, 1: pink to jar1, 2: purple to jar1, 3: purple to jar2, 4: pink to jar2
        // Add direction tracking
        this.isMovingBackward = false;
        
        // Transition points for animation phases
        this.transitionPoints = {
            forward: {
                pinkToJar1: 100,    // 22.7% (slightly earlier)
                purpleToJar1: 220,  // 50%
                purpleToJar2: 340    // 77.3% (slightly later)
            },
            backward: {
                pinkFromJar2: 320,  // 72.7% 
                purpleFromJar2: 200, // 45.5%
                purpleFromJar1: 80   // 18.2%
            }
        };
    }

    // In the updateSliderValue method, modify the phase transition points:
    // Fixed updateSliderValue method
    updateSliderValue(slider, mouseX) {
        const relativeX = mouseX - slider.x;
        let newValue;
        
        if (slider === this.data.slider3) {
            const oldValue = slider.value;
            // For 440 steps, each step is exactly 1 pixel
            newValue = Math.round(relativeX) + 1;
            newValue = Math.max(1, Math.min(this.totalSteps3, newValue));
            
            // Reset everything when slider returns to start
            if (newValue === 1) {
                this.animatedBalls = [];
                this.currentPhase = 0;
                this.isMovingBackward = false;
            }
            
            // Track slider direction
            this.isMovingBackward = newValue < oldValue;
            
            // Update current phase based on slider position
            const progress = newValue / this.totalSteps3;
            const oldPhase = this.currentPhase;
            
            // Define specific transition points (in pixels)
            const transitionPoints = {
                phase1End: 110,    // 25% of 440
                phase2End: 220,    // 50% of 440
                phase3End: 330     // 75% of 440
            };

            // Update current phase based on exact slider position
            if (newValue <= transitionPoints.phase1End) {
                this.currentPhase = 1;
            } else if (newValue <= transitionPoints.phase2End) {
                this.currentPhase = 2;
            } else if (newValue <= transitionPoints.phase3End) {
                this.currentPhase = 3;
            } else {
                this.currentPhase = 4;
            }
            
            // If phase changed, handle ball resets properly
            if (oldPhase !== this.currentPhase) {
                // Only create copies when moving forward
                if (!this.isMovingBackward) {
                    if (this.currentPhase === 3) {
                        // Create copies of purple balls for jar2 movement
                        const purpleBalls = this.animatedBalls.filter(ball => ball.color === '#6A5ACD');
                        
                        purpleBalls.forEach(ball => {
                            // Create a copy of each purple ball for jar2
                            const copyBall = {
                                x: ball.originalX,
                                y: ball.originalY,
                                originalX: ball.originalX,
                                originalY: ball.originalY,
                                color: ball.color,
                                order: ball.order,
                                inJar1: false,
                                inJar2: false,
                                isJar2Copy: true
                            };
                            this.animatedBalls.push(copyBall);
                        });
                    } else if (this.currentPhase === 4) {
                        // Create copies of pink balls for jar2 movement
                        const pinkBalls = this.animatedBalls.filter(ball => ball.color === '#FF1493' && !ball.isJar2Copy);
                        
                        pinkBalls.forEach(ball => {
                            // Create a copy of each pink ball for jar2
                            const copyBall = {
                                x: ball.originalX,
                                y: ball.originalY,
                                originalX: ball.originalX,
                                originalY: ball.originalY,
                                color: ball.color,
                                order: ball.order,
                                inJar1: false,
                                inJar2: false,
                                isJar2Copy: true
                            };
                            this.animatedBalls.push(copyBall);
                        });
                    }
                } 
                // When moving backward, remove copies as needed
                else {
                    if (oldPhase === 4 && this.currentPhase === 3) {
                        // Remove pink ball copies when moving from phase 4 to 3
                        this.animatedBalls = this.animatedBalls.filter(ball => 
                            !(ball.color === '#FF1493' && ball.isJar2Copy));
                    } else if (oldPhase === 3 && this.currentPhase === 2) {
                        // Remove purple ball copies when moving from phase 3 to 2
                        this.animatedBalls = this.animatedBalls.filter(ball => 
                            !(ball.color === '#6A5ACD' && ball.isJar2Copy));
                    }
                }
            }
            
            return newValue;
        }
        
        // Reset slider3 and animated balls when slider1 or slider2 changes
        this.data.slider3.value = 1;
        this.currentPhase = 0;
        this.animatedBalls = [];
        this.prevProgress = 0;
        this.isMovingBackward = false;
        
        newValue = Math.round(relativeX / this.stepSize) + 1;
        return Math.max(1, Math.min(this.totalSteps, newValue));
    }

    initializeAnimatedBalls() {
        this.animatedBalls = [];
        // Add pink balls
        for(let i = 0; i < this.data.slider1.value; i++) {
            let row = i < 8 ? 0 : 1;
            let col = i < 8 ? i : i - 8;
            let xPos = this.data.slider1.x + (col * 27);
            let yPos = this.data.slider1.y + 50 + (row * 27);
            
            this.animatedBalls.push({
                x: xPos,
                y: yPos,
                originalX: xPos,
                originalY: yPos,
                color: '#FF1493',
                order: i,
                inJar1: false,
                inJar2: false
            });
        }
        // Add purple balls
        for(let i = 0; i < this.data.slider2.value; i++) {
            let row = i < 8 ? 0 : 1;
            let col = i < 8 ? i : i - 8;
            let xPos = this.data.slider2.x + (col * 27);
            let yPos = this.data.slider2.y + 50 + (row * 27);
            
            this.animatedBalls.push({
                x: xPos,
                y: yPos,
                originalX: xPos,
                originalY: yPos,
                color: '#6A5ACD',
                order: i + this.data.slider1.value,
                inJar1: false,
                inJar2: false
            });
        }
    }

    updateBallPositions() {
        const progress = this.data.slider3.value / this.totalSteps3;
        const jar1X = this.data.slider1.x + 30;
        const jar1Y = this.data.slider1.y + 150;
        const jar2X = this.data.slider2.x + 30;
        const jar2Y = this.data.slider2.y + 150;
        
        // Only process balls if we have them initialized
        if (this.animatedBalls.length === 0) return;
    
        // Process each ball based on current phase
        this.animatedBalls.forEach((ball) => {
            const isPinkBall = ball.color === '#FF1493';
            
            // Initialize target position
            let targetX = ball.originalX;
            let targetY = ball.originalY;
    
            // In updateBallPositions method, modify the phase 1 and phase 2 sections:
            // Phase 1: Pink balls to jar1 (0-0.25)
            if (this.currentPhase === 1) {
                if (isPinkBall && !ball.isJar2Copy) {
                    if (this.isMovingBackward) {
                        // Only return pink balls when progress is below 20% (after purple balls have returned)
                        if (progress < 0.2) {
                            targetX = ball.originalX;
                            targetY = ball.originalY;
                            ball.inJar1 = false;
                        } else {
                            // Keep pink balls in jar1 until purple balls have fully returned
                            const pinkIndex = ball.order;
                            const pinkRow = Math.floor(pinkIndex / 5);
                            const pinkCol = pinkIndex % 5;
                            
                            targetX = jar1X + 5 + (pinkCol * 25);
                            targetY = jar1Y + 180 - (pinkRow * 25);
                        }
                    } else {
                        // Calculate position for pink balls in jar1
                        const pinkIndex = ball.order;
                        const pinkRow = Math.floor(pinkIndex / 5);
                        const pinkCol = pinkIndex % 5;
                        
                        targetX = jar1X + 5 + (pinkCol * 25);
                        targetY = jar1Y + 180 - (pinkRow * 25);
                        ball.inJar1 = true;
                    }
                }
            }
            // Phase 2: Purple balls to jar1 (0.25-0.5)
            else if (this.currentPhase === 2) {
                if (isPinkBall && ball.inJar1 && !ball.isJar2Copy) {
                    if (this.isMovingBackward) {
                        // Keep pink balls in jar1 until progress drops below 20%
                        if (progress < 0.2) {
                            targetX = ball.originalX;
                            targetY = ball.originalY;
                            ball.inJar1 = false;
                        } else {
                            const pinkIndex = ball.order;
                            const pinkRow = Math.floor(pinkIndex / 5);
                            const pinkCol = pinkIndex % 5;
                            
                            targetX = jar1X + 5 + (pinkCol * 25);
                            targetY = jar1Y + 180 - (pinkRow * 25);
                        }
                    } else {
                        // Keep pink balls in jar1
                        const pinkIndex = ball.order;
                        const pinkRow = Math.floor(pinkIndex / 5);
                        const pinkCol = pinkIndex % 5;
                        
                        targetX = jar1X + 5 + (pinkCol * 25);
                        targetY = jar1Y + 180 - (pinkRow * 25);
                    }
                } else if (!isPinkBall && !ball.isJar2Copy) {
                    // Calculate position for purple balls in jar1 (on top of pink balls)
                    const purpleIndex = ball.order - this.data.slider1.value;
                    const totalIndex = this.data.slider1.value + purpleIndex;
                    const purpleRow = Math.floor(totalIndex / 5);
                    const purpleCol = totalIndex % 5;
                    
                    targetX = jar1X + 5 + (purpleCol * 25);
                    targetY = jar1Y + 180 - (purpleRow * 25);
                    ball.inJar1 = true;
                }
            }
            // Phase 3: Purple balls to jar2 (0.5-0.75)
            else if (this.currentPhase === 3) {
                if ((isPinkBall && ball.inJar1) || (!isPinkBall && ball.inJar1)) {
                    // Keep all balls in jar1 in their positions
                    if (isPinkBall) {
                        const pinkIndex = ball.order;
                        const pinkRow = Math.floor(pinkIndex / 5);
                        const pinkCol = pinkIndex % 5;
                        
                        targetX = jar1X + 5 + (pinkCol * 25);
                        targetY = jar1Y + 180 - (pinkRow * 25);
                    } else {
                        // Only show original purple balls in jar1 if they haven't been copied yet
                        if (!ball.isJar2Copy) {
                            const purpleIndex = ball.order - this.data.slider1.value;
                            const totalIndex = this.data.slider1.value + purpleIndex;
                            const purpleRow = Math.floor(totalIndex / 5);
                            const purpleCol = totalIndex % 5;
                            
                            targetX = jar1X + 5 + (purpleCol * 25);
                            targetY = jar1Y + 180 - (purpleRow * 25);
                            ball.inJar1 = true;
                        } else {
                            ball.inJar1 = false; // Mark copied purple balls as not in jar1
                        }
                    }
                } else if (!isPinkBall && ball.isJar2Copy) {
                    // For jar2 purple balls
                    if (this.isMovingBackward) {
                        // When moving backward, return to original position
                        targetX = ball.originalX;
                        targetY = ball.originalY;
                        ball.inJar2 = false;
                    } else {
                        // When moving forward, animate purple balls into jar2
                        const purpleIndex = ball.order - this.data.slider1.value;
                        const purpleRow = Math.floor(purpleIndex / 5);
                        const purpleCol = purpleIndex % 5;
                        
                        targetX = jar2X + 5 + (purpleCol * 25);
                        targetY = jar2Y + 180 - (purpleRow * 25);
                        ball.inJar2 = true;
                    }
                }
            }
            // Phase 4: Pink balls to jar2 (0.75-1.0)
            else if (this.currentPhase === 4) {
                if ((isPinkBall && ball.inJar1) || (!isPinkBall && ball.inJar1)) {
                    // Keep all balls in jar1 in their positions
                    if (isPinkBall) {
                        const pinkIndex = ball.order;
                        const pinkRow = Math.floor(pinkIndex / 5);
                        const pinkCol = pinkIndex % 5;
                        
                        targetX = jar1X + 5 + (pinkCol * 25);
                        targetY = jar1Y + 180 - (pinkRow * 25);
                    } else {
                        const purpleIndex = ball.order - this.data.slider1.value;
                        const totalIndex = this.data.slider1.value + purpleIndex;
                        const purpleRow = Math.floor(totalIndex / 5);
                        const purpleCol = totalIndex % 5;
                        
                        targetX = jar1X + 5 + (purpleCol * 25);
                        targetY = jar1Y + 180 - (purpleRow * 25);
                    }
                } else if (!isPinkBall && ball.isJar2Copy && ball.inJar2) {
                    // Keep purple balls in jar2
                    const purpleIndex = ball.order - this.data.slider1.value;
                    const purpleRow = Math.floor(purpleIndex / 5);
                    const purpleCol = purpleIndex % 5;
                    
                    targetX = jar2X + 5 + (purpleCol * 25);
                    targetY = jar2Y + 180 - (purpleRow * 25);
                } else if (isPinkBall && ball.isJar2Copy) {
                    // For jar2 pink balls
                    if (this.isMovingBackward) {
                        // When moving backward, return to original position
                        targetX = ball.originalX;
                        targetY = ball.originalY;
                        ball.inJar2 = false;
                    } else {
                        // When moving forward, animate pink balls into jar2
                        const pinkIndex = ball.order;
                        const totalIndex = this.data.slider2.value + pinkIndex;
                        const pinkRow = Math.floor(totalIndex / 5);
                        const pinkCol = totalIndex % 5;
                        
                        targetX = jar2X + 5 + (pinkCol * 25);
                        targetY = jar2Y + 180 - (pinkRow * 25);
                        ball.inJar2 = true;
                    }
                }
            }
    
            // Enhanced smooth animation with velocity-based movement
            const dx = targetX - ball.x;
            const dy = targetY - ball.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            // Dynamic speed based on direction and dragging state
            let currentSpeed;
            if (this.data.slider3.isDragging) {
                // Use logarithmic easing for smoother dragging
                currentSpeed = Math.min(0.6, Math.max(0.05, 0.1 * Math.log(distance + 1)));
            } else {
                currentSpeed = this.isMovingBackward ? this.backwardSpeed : this.forwardSpeed;
            }
            
            // Apply easing function for smoother movement
            if (distance > 0.5) {
                const easing = this.easingFactor * currentSpeed*1.5;
                ball.x += dx * easing;
                ball.y += dy * easing;
            } else {
                // Snap to target when very close
                ball.x = targetX;
                ball.y = targetY;
            }
            
            this.drawBall(ball.x, ball.y, ball.color);
        });
    }

    isAnimationComplete() {
        return this.data.slider3.value === this.totalSteps3 &&
            this.animatedBalls.every(ball => {
                const dx = ball.x - (ball.inJar2 
                    ? this.data.slider2.x + 30 + 5 + (ball.order % 5) * 25
                    : this.data.slider1.x + 30 + 5 + (ball.order % 5) * 25
                );
                const dy = ball.y - (ball.inJar2 
                    ? this.data.slider2.y + 150 + 180 - (Math.floor(ball.order / 5) * 25)
                    : this.data.slider1.y + 150 + 180 - (Math.floor(ball.order / 5) * 25)
                );
                return Math.abs(dx) < 1 && Math.abs(dy) < 1;
            });
    }
    
        
    drawBall(x, y, color) {
        if (color === '#FF1493') {
            // White background and border
            noStroke();
            fill(255, 255, 255);
            circle(x, y, 20);
            
            stroke('#FF1493');
            strokeWeight(1);
            noFill();
            circle(x, y, 20);
            
            // Pink polka dots pattern
            noStroke();
            fill('#FF1493');
            
            // Draw background dots in pairs
            let bgDotSize = 4;
            // Top pair
            circle(x - 3, y - 7, bgDotSize);
            circle(x + 3, y - 7, bgDotSize);
            // Bottom pair
            circle(x - 3, y + 7, bgDotSize);
            circle(x + 3, y + 7, bgDotSize);
            // Left pair
            circle(x - 7, y - 3, bgDotSize);
            circle(x - 7, y + 3, bgDotSize);
            // Right pair
            circle(x + 7, y - 3, bgDotSize);
            circle(x + 7, y + 3, bgDotSize);
            
            // Draw kite shape dots in front
            let kiteDotSize = 4.5;
            circle(x, y - 3.5, kiteDotSize);  // Top
            circle(x + 3.5, y, kiteDotSize);  // Right
            circle(x, y + 3.5, kiteDotSize);  // Bottom
            circle(x - 3.5, y, kiteDotSize);  // Left
        } else {
            // Purple balls
            noStroke();
            fill(color);
            circle(x, y, 20);
        }
    }
}

// View - Handles all the visual elements and p5.js canvas
class View {
    constructor() {
        this.setup();
        this.sliderWidth = 230;
        this.sliderHeight = 5;
        this.ballSize = 20;  // Reduced from 23 to 20
        this.ballSpacing = 25;
    }

    setup() {
        // p5.js setup function
        window.setup = () => {
            const canvas = createCanvas(900, 500);
            canvas.parent('canvas-container');
            canvas.style('border-radius', '4px');  // Optional: adds slightly rounded corners
        };

        // p5.js draw function
        // Fixed background color in View class
        window.draw = () => {
            background("#ffffff"); // Removed extra 'f'
            this.render();
        };
    }
    
    render() {
        noStroke();


        fill('#FF1493');
        textWrap(WORD);
        textSize(20);
        textAlign(LEFT);
        fill(0);  // Black color for text
        
        let wrapWidthHeader = 800; // Set the width you want for wrapping
        text(
          'Visualizing the Commutative Property of Addition.',
          this.model.data.slider1.x,
          this.model.data.slider1.y - 90,
          wrapWidthHeader
        );
        // Draw first slider group
        fill('#FF1493');
        textWrap(WORD);
        textSize(16);
        textAlign(LEFT);
        fill(0);  // Black color for text
        
        let wrapWidth = 800; // Set the width you want for wrapping
        text(
          'Explore the commutative property of addition. Arrange marbles into jars to visualize and model an addition equation.',
          this.model.data.slider1.x,
          this.model.data.slider1.y - 60,
          wrapWidth
        );
        

        // Add text for pink balls count
        textSize(20);
        textAlign(LEFT);
        fill(0);  // Black color for text
        text('Pink Marbles : ', this.model.data.slider1.x, this.model.data.slider1.y + 20);
        fill('#FF1493');  // Pink color for number
        text(this.model.data.slider1.value, this.model.data.slider1.x + 130, this.model.data.slider1.y + 20);
        
        rect(this.model.data.slider1.x, this.model.data.slider1.y + 380, 
             this.sliderWidth, this.sliderHeight, 5);
        
        // Draw balls for first slider
            for(let i = 0; i < this.model.data.slider1.value; i++) {
            let row = i < 8 ? 0 : 1;  // Changed from 8 to 6
            let col = i < 8 ? i : i - 8;  // Changed from 8 to 6
            let ballX = this.model.data.slider1.x + (col * 27);  // Increased from 25 to 35
            let ballY = this.model.data.slider1.y + 50 + (row * 27);  // Increased from 25 to 35
            this.model.drawBall(ballX, ballY, '#FF1493');
        }
        
        // Draw slider handle 1
        let x1 = this.model.data.slider1.x + (this.model.data.slider1.value - 1) * this.model.stepSize;
        let y1 = this.model.data.slider1.y + this.sliderHeight/2 + 380;
        noStroke();
        fill(255, 20, 147, 100);
        circle(x1, y1, 25);
        fill('#FF1493');
        stroke(0);
        strokeWeight(2);
        circle(x1, y1, 15);

        // Draw second slider group
        noStroke();
        
        // Add text for purple balls count
        textSize(20);
        textAlign(LEFT);
        fill(0);  // Black color for text
        text('Purple Marbles : ', this.model.data.slider2.x, this.model.data.slider2.y + 20);
        fill('#6A5ACD');  // Purple color for number
        text(this.model.data.slider2.value, this.model.data.slider2.x + 150, this.model.data.slider2.y + 20);
        
        fill('#6A5ACD');
        rect(this.model.data.slider2.x, this.model.data.slider2.y+ 380, 
             this.sliderWidth, this.sliderHeight , 5);
        
        // Draw balls for second slider
        for(let i = 0; i < this.model.data.slider2.value; i++) {
            let row = i < 8 ? 0 : 1;  // Changed from 8 to 6
            let col = i < 8 ? i : i - 8;  // Changed from 8 to 6
            let ballX = this.model.data.slider2.x + (col * 27);  // Increased from 25 to 35
            let ballY = this.model.data.slider2.y + 50 + (row * 27);  // Increased from 25 to 35
            
            noStroke();
            fill('#6A5ACD');
            circle(ballX, ballY, this.ballSize);
        }
        
        // Draw slider handle 2
        let x2 = this.model.data.slider2.x + (this.model.data.slider2.value - 1) * this.model.stepSize;
        let y2 = this.model.data.slider2.y + this.sliderHeight/2 + 380;
        noStroke();
        fill(106, 90, 205, 100);
        circle(x2, y2, 25);
        fill('#6A5ACD');
        stroke(0);
        strokeWeight(2);
        circle(x2, y2, 15);

        this.model.updateBallPositions();  // Change from this.updateBallPositions()

        // Draw jar for first slider
        noFill();
        stroke('#1b998b');
        strokeWeight(3);
        let jar1X = this.model.data.slider1.x + 30;  // Shifted left from 50 to 30
        let jar1Y = this.model.data.slider1.y + 150;
        
        // Draw jar 1 body
        beginShape();
        vertex(jar1X, jar1Y - 3);  // Top left (moved right)
        vertex(jar1X + 110, jar1Y - 3);  // Top right (moved left)
        bezierVertex(jar1X + 122, jar1Y + 5, jar1X + 128, jar1Y + 10, jar1X + 130, jar1Y + 20);  // Smoother right curve
        vertex(jar1X + 130, jar1Y + 180);  // Body right (narrower)
        bezierVertex(jar1X + 130, jar1Y + 200,  // Right curve control point
                    jar1X + 90, jar1Y + 200,    // Right corner (adjusted)
                    jar1X + 65, jar1Y + 200);   // End of curve
        vertex(jar1X + 45, jar1Y + 200);     // Bottom flat
        bezierVertex(jar1X + 20, jar1Y + 200,  // Start of left curve
                    jar1X - 20, jar1Y + 200,   // Left corner (narrower)
                    jar1X - 20, jar1Y + 170);  // Left curve control point
        vertex(jar1X - 20, jar1Y + 170);  // Left curve control point
        vertex(jar1X - 20, jar1Y + 20);  // Body left
        bezierVertex(jar1X - 18, jar1Y + 12, jar1X - 8, jar1Y + 5, jar1X, jar1Y - 3);  // Smoother left curve
        endShape();

        // Draw lid 1 with curved edges - adjusted to match slimmer jar
        rect(jar1X, jar1Y - 20, 110, 17, 5);  // Narrower lid
        
        // Define jar2X and jar2Y before using them
        let jar2X = this.model.data.slider2.x + 30;
        let jar2Y = this.model.data.slider2.y + 150;
        
        // Draw jar 2 body
        beginShape();
        vertex(jar2X, jar2Y - 3);  // Top left (moved right)
        vertex(jar2X + 110, jar2Y - 3);  // Top right (moved left)
        bezierVertex(jar2X + 122, jar2Y + 5, jar2X + 128, jar2Y + 10, jar2X + 130, jar2Y + 20);  // Smoother right curve
        vertex(jar2X + 130, jar2Y + 170);  // Body right (narrower)
        bezierVertex(jar2X + 130, jar2Y + 200,  // Right curve control point
                    jar2X + 90, jar2Y + 200,    // Right corner (adjusted)
                    jar2X + 65, jar2Y + 200);   // End of curve
        vertex(jar2X + 45, jar2Y + 200);     // Bottom flat
        bezierVertex(jar2X + 20, jar2Y + 200,  // Start of left curve
                    jar2X - 20, jar2Y + 200,   // Left corner (narrower)
                    jar2X - 20, jar2Y + 170);  // Left curve control point
        vertex(jar2X - 20, jar2Y + 170);  // Left curve control point
        vertex(jar2X - 20, jar2Y + 20);  // Body left
        bezierVertex(jar2X - 18, jar2Y + 12, jar2X - 8, jar2Y + 5, jar2X, jar2Y - 3);  // Smoother left curve
        endShape();

        // Draw lid 2 with curved edges
        rect(jar2X, jar2Y - 20, 110, 17, 5);  // Narrower lid

        // Add instruction text and slider at the bottom
        noStroke();
        textSize(20);
        textAlign(LEFT);
        fill(0);
        text("Slide to put the marbles in the jars.", width/18, 560);
        
        // Draw bottom purple slider
        fill('#6A5ACD');
        rect(370, 555, 440, this.sliderHeight, 5);  // Changed width to match stepSize3 calculation
        
        // Draw slider handle at current position
        let bottomSliderX = this.model.data.slider3.x + (this.model.data.slider3.value - 1) * this.model.stepSize3;
        let bottomSliderY = this.model.data.slider3.y + this.sliderHeight/2;
        noStroke();
        fill(106, 90, 205, 100);
        circle(bottomSliderX, bottomSliderY, 25);
        fill('#6A5ACD');
        stroke(0);
        strokeWeight(2);
        circle(bottomSliderX, bottomSliderY, 15);

        textSize(24);
textAlign(CENTER);
fill(0); // Black color for text
let jar1PinkCount = this.model.animatedBalls.filter(ball => 
    ball.inJar1 && ball.color === '#FF1493' && !ball.isJar2Copy
).length;

let jar1PurpleCount = this.model.animatedBalls.filter(ball => 
    ball.inJar1 && ball.color === '#6A5ACD' && !ball.isJar2Copy
).length;

// console.log(document.querySelector(".sectors-slider").value,"This is to check the curr value of the slider")
    // All your count display code goes here (jar1 + jar2 equations)
   const sliderValue = document.getElementById("slider3").value
    if(sliderValue == 440){
        

if (jar1PinkCount > 0) {
    textSize(24);
    textAlign(CENTER);
    noStroke();
    
    // Pink count
    fill('#FF1493');
    text(jar1PinkCount, jar1X + 530, jar1Y + 80);
    
    // Black + sign
    fill(0);
    text("+", jar1X + 550, jar1Y + 80 );

    fill('#6A5ACD');
    text(jar1PurpleCount, jar1X + 570, jar1Y + 80);

    fill(0);
    text("=", jar1X + 590, jar1Y + 80 );
}
let jar2PurpleCount = this.model.animatedBalls.filter(ball => 
    ball.inJar2 && ball.color === '#6A5ACD'
).length;
let jar2PinkCount = this.model.animatedBalls.filter(ball => 
    ball.inJar2 && ball.color === '#FF1493'
).length;

if (jar2PurpleCount > 0 || jar2PinkCount > 0) {
    textSize(24);
    textAlign(CENTER);
    noStroke();
    
    // Purple count (b)
    fill('#6A5ACD');
    text(jar2PurpleCount, jar2X + 340, jar2Y + 80);
    
    // Black + sign
    fill(0);
    text("+", jar2X + 360, jar2Y + 80);
    
    // Pink count (a)
    fill('#FF1493');
    text(jar2PinkCount, jar2X + 380, jar2Y + 80);
}
// Calculate counts
}

    }
}

// Controller - Handles user input and updates model/view
class Controller {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.view.model = model;
        this.model.view = view;
        this.setupEventListeners();
    }

    setupEventListeners() {
        // HTML slider event listener for slider3
        const htmlSlider = document.getElementById('slider3');
       
            
        // htmlSlider1.addEventListener('input', (e) => {
        //     const newValue = parseInt(e.target.value);
        //     const oldValue = this.model.data.slider1.value;
        //     this.model.data.slider1.value = newValue;
            
        //     // Reset animations and slider3
        //     this.model.data.slider3.value = 1;
        //     this.model.animatedBalls = [];
        //     this.model.currentPhase = 0;
        //     document.getElementById('slider3').value = 1;
        
        //     redraw();
        // });
        
        // htmlSlider2.addEventListener('input', (e) => {
        //     const newValue = parseInt(e.target.value);
        //     const oldValue = this.model.data.slider2.value;
        //     this.model.data.slider2.value = newValue;
            
        //     // Reset animations and slider3
        //     this.model.data.slider3.value = 1;
        //     this.model.animatedBalls = [];
        //     this.model.currentPhase = 0;
        //     document.getElementById('slider3').value = 1;
        
        //     redraw();
        // });

        htmlSlider.addEventListener('mousedown', function (e) {
            const thumbWidth = 20; // Approximate thumb width (can vary by browser)
            const sliderRect = htmlSlider.getBoundingClientRect();
        
            // Calculate thumb position
            const range = htmlSlider.max - htmlSlider.min;
            const thumbPosition = ((htmlSlider.value - htmlSlider.min) / range) * sliderRect.width + sliderRect.left;
        
            // If click is outside the thumb area, prevent it
            if (Math.abs(e.clientX - thumbPosition) > thumbWidth / 2) {
              e.preventDefault();
            }
          });
        
        if (htmlSlider) {
            htmlSlider.addEventListener('input', (e) => {
                const newValue = parseInt(e.target.value);
                
                const oldValue = this.model.data.slider3.value;
                
                // Update model values
                this.model.data.slider3.value = newValue;
                this.model.isMovingBackward = newValue < oldValue;
                
                // Update phase based on slider position
                if (newValue <= 110) this.model.currentPhase = 1;
                else if (newValue <= 220) this.model.currentPhase = 2;
                else if (newValue <= 330) this.model.currentPhase = 3;
                else this.model.currentPhase = 4;

                // Initialize balls if needed
                if (this.model.animatedBalls.length === 0) {
                    this.model.initializeAnimatedBalls();
                }
                
                // Handle phase transitions
                this.handlePhaseTransitions(oldValue, newValue);
                
                redraw();
            });





            // Touch support for slider3
            htmlSlider.addEventListener('touchstart', (e) => {
                e.preventDefault(); // prevent scrolling
                htmlSlider.dataset.touching = "true";
            });
            
            htmlSlider.addEventListener('touchmove', (e) => {
                if (htmlSlider.dataset.touching !== "true") return;
                e.preventDefault(); // prevent scrolling
            
                const touch = e.touches[0];
                const rect = htmlSlider.getBoundingClientRect();
                const percent = (touch.clientX - rect.left) / rect.width;
                const value = Math.round(percent * (htmlSlider.max - htmlSlider.min)) + parseInt(htmlSlider.min);
                
                htmlSlider.value = value <= 440 ? value : 440; // Clamp to max value

                const newValue = Math.max(1, Math.min(parseInt(htmlSlider.max), value));
                const oldValue = this.model.data.slider3.value;
            
                this.model.data.slider3.value = newValue;
                this.model.isMovingBackward = newValue < oldValue;
            
                if (newValue <= 110) this.model.currentPhase = 1;
                else if (newValue <= 220) this.model.currentPhase = 2;
                else if (newValue <= 330) this.model.currentPhase = 3;
                else this.model.currentPhase = 4;
            
                if (this.model.animatedBalls.length === 0) {
                    this.model.initializeAnimatedBalls();
                }
            
                this.handlePhaseTransitions(oldValue, newValue);
                redraw();
            });
            
            htmlSlider.addEventListener('touchend', () => {
                htmlSlider.dataset.touching = "false";
            });
            
        }
        
        // Mouse event handlers
        window.mousePressed = () => {
            this.checkSliderClick(this.model.data.slider1);
            this.checkSliderClick(this.model.data.slider2);
        };

        window.mouseReleased = () => {
            this.model.data.slider1.isDragging = false;
            this.model.data.slider2.isDragging = false;
        };

        // In Controller class, modify the mouseDragged handler:
        window.mouseDragged = () => {
            if (this.model.data.slider1.isDragging) {
                const oldValue = this.model.data.slider1.value;
                this.model.data.slider1.value = this.model.updateSliderValue(this.model.data.slider1, mouseX);
                
                // Reset slider3 if value actually changed
                if (oldValue !== this.model.data.slider1.value) {
                    this.model.data.slider3.value = 1;
                    this.model.animatedBalls = [];
                    this.model.currentPhase = 0;
                }
                redraw();
            }
            if (this.model.data.slider2.isDragging) {
                const oldValue = this.model.data.slider2.value;
                this.model.data.slider2.value = this.model.updateSliderValue(this.model.data.slider2, mouseX);
                
                // Reset slider3 if value actually changed
                if (oldValue !== this.model.data.slider2.value) {
                    this.model.data.slider3.value = 1;
                    this.model.animatedBalls = [];
                    this.model.currentPhase = 0;
                }
                redraw();
            }
        };

  // Touch event handlers
        window.touchStarted = () => {
            this.checkSliderTouch(this.model.data.slider1);
            this.checkSliderTouch(this.model.data.slider2);
            return false; // Prevent default
        };
        
        window.touchMoved = () => {
            if (this.model.data.slider1.isDragging) {
                const oldValue = this.model.data.slider1.value;
                this.model.data.slider1.value = this.model.updateSliderValue(this.model.data.slider1, touches[0].x);
                if (oldValue !== this.model.data.slider1.value) {
                    this.model.data.slider3.value = 1;
                    this.model.animatedBalls = [];
                    this.model.currentPhase = 0;
                }
                redraw();
            }
            if (this.model.data.slider2.isDragging) {
                const oldValue = this.model.data.slider2.value;
                this.model.data.slider2.value = this.model.updateSliderValue(this.model.data.slider2, touches[0].x);
                if (oldValue !== this.model.data.slider2.value) {
                    this.model.data.slider3.value = 1;
                    this.model.animatedBalls = [];
                    this.model.currentPhase = 0;
                }
                redraw();
            }
            return false; // Prevent default
        };
        
        window.touchEnded = () => {
            this.model.data.slider1.isDragging = false;
            this.model.data.slider2.isDragging = false;
            return false;
    };


        // Also update the HTML slider to stay in sync
        if (htmlSlider) {
            // Reset HTML slider when slider1 or slider2 changes
            if (this.model.data.slider1.isDragging || this.model.data.slider2.isDragging) {
                // Reset model state
                this.model.data.slider3.value = 1;
                this.model.data.slider3.isDragging = false;
                this.model.animatedBalls = [];
                this.model.currentPhase = 0;
                this.model.isMovingBackward = false;
                
                // Reset HTML slider and trigger change
                htmlSlider.value = 1;
                htmlSlider.dispatchEvent(new Event('change'));
                
                // Force immediate redraw
                redraw();
            } else {
                // Normal sync - update HTML slider to match model
                htmlSlider.value = this.model.data.slider3.value;
            }
        }
    }


    checkSliderTouch(slider) {
        const touchX = touches[0].x;
        const touchY = touches[0].y;
        const handleX = slider.x + (slider.value - 1) * (slider === this.model.data.slider3 ? this.model.stepSize3 : this.model.stepSize);
        const handleY = slider.y + this.view.sliderHeight / 2 + 380;
    
        if (touchX >= slider.x && touchX <= slider.x + (slider === this.model.data.slider3 ? 440 : this.view.sliderWidth) &&
            Math.abs(touchY - handleY) < 25) {
            slider.isDragging = true;
            slider.value = this.model.updateSliderValue(slider, touchX);
            this.model.data.slider3.value = 1;
            document.getElementById('slider3').value = 1;
        }
    }
    

    checkSliderClick(slider) {
        const handleX = slider.x + (slider.value - 1) * (slider === this.model.data.slider3 ? this.model.stepSize3 : this.model.stepSize);
        const handleY = slider.y + this.view.sliderHeight/2 + 380;
        
        if (mouseX >= slider.x && mouseX <= slider.x + (slider === this.model.data.slider3 ? 440 : this.view.sliderWidth) &&
            Math.abs(mouseY - handleY) < 15) {
            slider.isDragging = true;
            slider.value = this.model.updateSliderValue(slider, mouseX);
            this.model.data.slider3.value = 1
            document.getElementById('slider3').value = 1
        }
    }

    handlePhaseTransitions(oldValue, newValue) {
        // Only create copies when moving forward
        if (!this.model.isMovingBackward) {
            if (oldValue <= 220 && newValue > 220) {
                // Phase 3 transition - create purple ball copies
                const purpleBalls = this.model.animatedBalls.filter(ball => 
                    ball.color === '#6A5ACD' && !ball.isJar2Copy);
                
                purpleBalls.forEach(ball => {
                    if (!this.model.animatedBalls.some(b => 
                        b.order === ball.order && b.isJar2Copy)) {
                        this.model.animatedBalls.push({
                            ...ball,
                            isJar2Copy: true,
                            inJar1: false,
                            inJar2: false
                        });
                    }
                });
            }
            else if (oldValue <= 330 && newValue > 330) {
                // Phase 4 transition - create pink ball copies
                const pinkBalls = this.model.animatedBalls.filter(ball => 
                    ball.color === '#FF1493' && !ball.isJar2Copy);
                
                pinkBalls.forEach(ball => {
                    if (!this.model.animatedBalls.some(b => 
                        b.order === ball.order && b.isJar2Copy)) {
                        this.model.animatedBalls.push({
                            ...ball,
                            isJar2Copy: true,
                            inJar1: false,
                            inJar2: false
                        });
                    }
                });
            }
        }
    }
}

// Initialize the application
const app = new Controller(new Model(), new View());
