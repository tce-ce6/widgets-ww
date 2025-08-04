
        // Global variables
        let paper;
        let allFolds = []; // Stores all visible crease lines
        let foldHistory = []; // Tracks the sequence of folds made
        let verticalFoldCount = 0;
        let horizontalFoldCount = 0;
        let showLabels = false; // Variable to control label visibility
        let currentUnfoldType = null;
        // Animation state
        let isAnimating = false;
        let animationProgress = 0;
        let startDim = {};
        let targetDim = {};
        let animationType = null; // Tracks the type of animation: 'h-fold', 'v-fold', 'unfold'

        const MIN_DIMENSION = 10;
        const MAX_VERTICAL_FOLDS = 2;
        const MAX_HORIZONTAL_FOLDS = 2;
        let showQuestions = false;
        const questions = [
            "1. How can you create two parallel lines by folding the paper?",
            "2. How many right angles are formed when you make two perpendicular folds?",
            "3. What do you notice about the distances between multiple parallel folds?"
        ];
        
        function drawQuestions() {
            if (!showQuestions) return;
            
            push();
            textSize(14);
            textAlign(LEFT, TOP);
            fill(0);
            noStroke();
            
            const x = width - 310; // Position at top-right
            const y = 20;
            const w = 290;
            const h = 180; // Increased height
            
            // Draw question box
            fill(255, 255, 245, 230);
            stroke(180);
            strokeWeight(1);
            rect(x, y, w, h, 8);
            
            // Draw title
            fill(30, 30, 150);
            textStyle(BOLD);
            text("Discussion Questions:", x + 15, y + 15);
            
            // Draw questions
            textStyle(NORMAL);
            fill(0);
            const lineHeight = 18;
            let textY = y + 40;
            for (let i = 0; i < questions.length; i++) {
                const words = questions[i].split(' ');
                let line = '';
                for (let j = 0; j < words.length; j++) {
                    const testLine = line + words[j] + ' ';
                    if (textWidth(testLine) > w - 30) { // Check if line exceeds box width
                        text(line, x + 15, textY);
                        line = words[j] + ' ';
                        textY += lineHeight;
                    } else {
                        line = testLine;
                    }
                }
                text(line, x + 15, textY); // Draw remaining line
                textY += lineHeight;
            }
            pop();
        }
        
        // Add this function to toggle questions
        function toggleQuestions() {
            showQuestions = !showQuestions;
            const btn = document.getElementById('questions-btn');
            btn.textContent = showQuestions ? "Hide Questions" : "Reflect";
        }
        
        /**
         * Represents a single crease line on the paper.
         */
        class Crease {
            constructor(x1, y1, x2, y2) {
                this.x1 = x1; this.y1 = y1; this.x2 = x2; this.y2 = y2;
            }
            equals(other) {
                return this.x1 === other.x1 && this.y1 === other.y1 && this.x2 === other.x2 && this.y2 === other.y2;
            }
            draw() {
                push();
                stroke(50, 50, 50, 150);
                strokeWeight(1.5);
                drawingContext.setLineDash([4, 2]);
                line(this.x1, this.y1, this.x2, this.y2);
                drawingContext.setLineDash([]);
                pop();
            }
        }

        /**
         * Represents the interactive piece of paper.
         */
        class Paper {
            constructor(x, y, w, h) {
                this.originalX = x; this.originalY = y; this.originalW = w; this.originalH = h;
                this.x = x; this.y = y; this.w = w; this.h = h;
            }
            draw() {
                push();
                fill(255, 253, 248);
                stroke(150);
                strokeWeight(2);
                rect(this.x, this.y, this.w, this.h);
                pop();
            }
            reset() {
                this.x = this.originalX; this.y = this.originalY;
                this.w = this.originalW; this.h = this.originalH;
            }
        }

        /**
         * p5.js setup function, runs once at the start.
         */
        function setup() {
            let canvas = createCanvas(800, 500);
            canvas.parent('canvas');

            let paperW = 300;
            let paperH = 300;
            let paperX = (width - paperW) / 2;
            let paperY = (height - paperH) / 2;
            paper = new Paper(paperX, paperY, paperW, paperH);
            
            updateButtons();
        }

        function performUnfold() {
            if (isAnimating || foldHistory.length === 0) return;

            const lastFold = foldHistory.pop();
            currentUnfoldType = lastFold.type; // Set unfold type
            
            if (lastFold.type === 'vertical') {
                verticalFoldCount--;
            } else if (lastFold.type === 'horizontal') {
                horizontalFoldCount--;
            }

            addCreaseForFold(lastFold);
            animationType = 'unfold';
            startAnimation();
            targetDim = lastFold.from;
        }

        /**
         * p5.js draw function, runs continuously.
         */
        function draw() {
            background(235, 245, 255);

            if (isAnimating) {
                animationProgress = min(1, animationProgress + 0.011);
                let easedProgress = easeInOut(animationProgress);

                if (animationType === 'h-fold') {
                    drawHorizontalFoldAnimation(easedProgress);
                } else if (animationType === 'v-fold') {
                    drawVerticalFoldAnimation(easedProgress);
                }
                else if (animationType === 'unfold'){
                    if (currentUnfoldType === 'horizontal') {
                        drawHorizontalUnfoldAnimation(easedProgress);
                    } else if (currentUnfoldType === 'vertical') {
                        drawVerticalUnfoldAnimation(easedProgress);
                    }
                } else {
                    paper.x = lerp(startDim.x, targetDim.x, easedProgress);
                    paper.y = lerp(startDim.y, targetDim.y, easedProgress);
                    paper.w = lerp(startDim.w, targetDim.w, easedProgress);
                    paper.h = lerp(startDim.h, targetDim.h, easedProgress);
                    paper.draw();
                }

                if (animationProgress >= 1) {
                    isAnimating = false;
                    animationType = null;
                    paper.x = targetDim.x; paper.y = targetDim.y;
                    paper.w = targetDim.w; paper.h = targetDim.h;
                    currentUnfoldType = null;  // Reset unfold type
                    updateButtons();
                }
            } else {
                paper.draw();
            }

            // When not animating, draw creases and labels normally.
            // During animation, this is handled by the specific animation functions.
            if (!isAnimating) {
                push();
                drawingContext.beginPath();
                drawingContext.rect(paper.x, paper.y, paper.w, paper.h);
                drawingContext.clip();
                for (let fold of allFolds) {
                    fold.draw();
                }
                pop();

                if (showLabels) {
                    drawMarkings();
                }
            }
            
            // Draw questions on top of everything
            drawQuestions();
            
            // Draw legend on top-left corner
            if (showLabels) {
                drawLegend();
            }
        }
        
        /**
         * Draws the legend in the top-left corner
         */
        function drawLegend() {
            const hasHorizontalFolds = allFolds.some(f => f.y1 === f.y2);
            const hasVerticalFolds = allFolds.some(f => f.x1 === f.x2);
            
            if (!hasHorizontalFolds && !hasVerticalFolds) return;
            
            push();
            const legendX = 20;
            const legendY = 20;
            const boxWidth = 150;
            const boxHeight = hasHorizontalFolds && hasVerticalFolds ? 70 : 40;
            const padding = 10;
            
            // Draw legend background
            fill(255, 255, 255, 200);
            stroke(180);
            strokeWeight(1);
            rect(legendX, legendY, boxWidth, boxHeight, 5);
            
            textSize(12);
            textAlign(LEFT, CENTER);
            noStroke();
            
            // Draw parallel legend
            if (hasHorizontalFolds) {
                fill(0, 150, 0, 200);
                const yPos = legendY + padding;
                // Draw parallel indicator
                stroke(0, 150, 0, 200);
                strokeWeight(1.5);
                // line(legendX + padding, yPos, legendX + padding + 30, yPos);
                // Draw arrowheads
                strokeWeight(2);
               line(legendX + padding + 25, yPos + 5, legendX + padding + 30, yPos + 10);
                line(legendX + padding + 25, yPos + 15, legendX + padding + 30, yPos + 10);
                // Draw text
                noStroke();
                fill(0);
                text("Parallel Lines", legendX + padding + 40, yPos + 10);
            }
            
            // Draw perpendicular legend
            if (hasHorizontalFolds && hasVerticalFolds) {
                fill(200, 0, 0, 200);
                const yPos = legendY + padding + 25;
                // Draw perpendicular indicator
                stroke(200, 0, 0, 200);
                strokeWeight(1.5);
                noFill();
                rect(legendX + padding + 12, yPos - 6 + 15, 8, 8);
                // Draw text
                noStroke();
                fill(0);
                text("Perpendicular (90°)", legendX + padding + 30, yPos + 15);
            }
            pop();
        }

        /**
         * Draws the 3D unfolding animation for a horizontal fold (reversing top-down fold).
         */
        function drawHorizontalUnfoldAnimation(progress) {
            const theta = (1 - progress) * PI;
            const flapH = targetDim.h / 2;
            const foldLineY = targetDim.y + flapH;

            // Calculate perspective shift
            const perspective = sin(theta) * 0.05;
            const p_leftX = targetDim.x + targetDim.w * perspective;
            const p_rightX = targetDim.x + targetDim.w - targetDim.w * perspective;
            const p_width = p_rightX - p_leftX;

            // Calculate moving edge position
            const movingEdgeY = foldLineY - flapH * cos(theta);

            // Draw stationary part (bottom half)
            push();
            fill(255, 253, 248);
            stroke(150);
            strokeWeight(2);
            rect(targetDim.x, foldLineY, targetDim.w, flapH);
            pop();

            // Draw moving part (top flap)
            push();
            const shade = map(sin(theta), 0, 1, 255, 220, true);
            fill(shade, shade, shade - 5);
            stroke(150);
            strokeWeight(2);
            beginShape();
            vertex(targetDim.x, foldLineY);
            vertex(targetDim.x + targetDim.w, foldLineY);
            vertex(p_rightX, movingEdgeY);
            vertex(p_leftX, movingEdgeY);
            endShape(CLOSE);
            pop();

            // Draw creases on stationary part
            push();
            drawingContext.beginPath();
            drawingContext.rect(targetDim.x, foldLineY, targetDim.w, flapH);
            drawingContext.clip();
            for (const fold of allFolds) {
                fold.draw();
            }
            pop();

            // Draw creases on moving part
            push();
            stroke(50, 50, 50, 150);
            strokeWeight(1.5);
            drawingContext.setLineDash([4, 2]);
            for (const fold of allFolds) {
                if (fold.x1 === fold.x2) { // Vertical crease
                    const x = fold.x1;
                    if (x >= targetDim.x && x <= targetDim.x + targetDim.w) {
                        const x_new = p_leftX + ((x - targetDim.x) / targetDim.w) * p_width;
                        line(x_new, movingEdgeY, x, foldLineY);
                    }
                } else { // Horizontal crease
                    const y = fold.y1;
                    if (y >= targetDim.y && y < foldLineY) {
                        const y_new = foldLineY - (foldLineY - y) * cos(theta);
                        line(p_leftX, y_new, p_rightX, y_new);
                    }
                }
            }
            drawingContext.setLineDash([]);
            pop();

            // Draw markings if enabled
            if (showLabels) {
                push();
                drawingContext.beginPath();
                drawingContext.rect(targetDim.x, foldLineY, targetDim.w, flapH);
                drawingContext.moveTo(targetDim.x, foldLineY);
                drawingContext.lineTo(targetDim.x + targetDim.w, foldLineY);
                drawingContext.lineTo(p_rightX, movingEdgeY);
                drawingContext.lineTo(p_leftX, movingEdgeY);
                drawingContext.closePath();
                drawingContext.clip();
                drawMarkings();
                pop();
            }
        }

        /**
         * Draws the 3D unfolding animation for a vertical fold (reversing left-over-right fold).
         */
        function drawVerticalUnfoldAnimation(progress) {
            const theta = (1 - progress) * PI;
            const flapW = targetDim.w / 2;
            const foldLineX = targetDim.x + flapW;

            // Calculate perspective shift
            const perspective = sin(theta) * 0.05;
            const p_topY = targetDim.y + targetDim.h * perspective;
            const p_bottomY = targetDim.y + targetDim.h - targetDim.h * perspective;
            const p_height = p_bottomY - p_topY;

            // Calculate moving edge position
            const movingEdgeX = foldLineX - flapW * cos(theta);

            // Draw stationary part (right half)
            push();
            fill(255, 253, 248);
            stroke(150);
            strokeWeight(2);
            rect(foldLineX, targetDim.y, flapW, targetDim.h);
            pop();

            // Draw moving part (left flap)
            push();
            const shade = map(sin(theta), 0, 1, 255, 220, true);
            fill(shade, shade, shade - 5);
            stroke(150);
            strokeWeight(2);
            beginShape();
            vertex(movingEdgeX, p_topY);
            vertex(foldLineX, targetDim.y);
            vertex(foldLineX, targetDim.y + targetDim.h);
            vertex(movingEdgeX, p_bottomY);
            endShape(CLOSE);
            pop();

            // Draw creases on stationary part
            push();
            drawingContext.beginPath();
            drawingContext.rect(foldLineX, targetDim.y, flapW, targetDim.h);
            drawingContext.clip();
            for (const fold of allFolds) {
                fold.draw();
            }
            pop();

            // Draw creases on moving part
            push();
            stroke(50, 50, 50, 150);
            strokeWeight(1.5);
            drawingContext.setLineDash([4, 2]);
            for (const fold of allFolds) {
                if (fold.y1 === fold.y2) { // Horizontal crease
                    const y = fold.y1;
                    if (y >= targetDim.y && y <= targetDim.y + targetDim.h) {
                        const y_new = p_topY + ((y - targetDim.y) / targetDim.h) * p_height;
                        line(movingEdgeX, y_new, foldLineX, y);
                    }
                } else { // Vertical crease
                    const x = fold.x1;
                    if (x >= targetDim.x && x < foldLineX) {
                        const x_new = foldLineX - (foldLineX - x) * cos(theta);
                        line(x_new, p_topY, x_new, p_bottomY);
                    }
                }
            }
            drawingContext.setLineDash([]);
            pop();

            // Draw markings if enabled
            if (showLabels) {
                push();
                drawingContext.beginPath();
                drawingContext.rect(foldLineX, targetDim.y, flapW, targetDim.h);
                drawingContext.moveTo(movingEdgeX, p_topY);
                drawingContext.lineTo(foldLineX, targetDim.y);
                drawingContext.lineTo(foldLineX, targetDim.y + targetDim.h);
                drawingContext.lineTo(movingEdgeX, p_bottomY);
                drawingContext.closePath();
                drawingContext.clip();
                drawMarkings();
                pop();
            }
        }

        /**
         * Draws the 3D folding animation for a horizontal fold (top down).
         */
        function drawHorizontalFoldAnimation(progress) {
            const theta = progress * PI;
            const flapH = startDim.h / 2;
            const foldLineY = startDim.y + flapH;

            // Geometry
            const stationary = { x: startDim.x, y: foldLineY, w: startDim.w, h: flapH };
            const movingEdgeY = foldLineY - flapH * cos(theta);
            const perspective = sin(theta) * 0.05;
            const p_topX = startDim.x + startDim.w * perspective;
            const p_topW = startDim.w * (1 - perspective * 2);

            // Draw paper parts
            push();
            fill(255, 253, 248);
            stroke(150);
            strokeWeight(2);
            rect(stationary.x, stationary.y, stationary.w, stationary.h);
            const shade = map(sin(theta), 0, 1, 255, 220, true);
            fill(shade, shade, shade - 5);
            quad(startDim.x, foldLineY, startDim.x + startDim.w, foldLineY, p_topX + p_topW, movingEdgeY, p_topX, movingEdgeY);
            pop();
            
            // --- Draw Creases ---
            // 1. On stationary part (bottom half)
            push();
            drawingContext.beginPath();
            rect(stationary.x, stationary.y, stationary.w, stationary.h);
            drawingContext.clip();
            for (const fold of allFolds) {
                fold.draw();
            }
            pop();

            // 2. On folding part (top half)
            push();
            stroke(50, 50, 50, 150);
            strokeWeight(1.5);
            drawingContext.setLineDash([4, 2]);
            for (const fold of allFolds) {
                if (fold.x1 === fold.x2) { // Vertical crease
                    const x = fold.x1;
                    if (x >= startDim.x && x <= startDim.x + startDim.w) {
                        const x_new = p_topX + ((x - startDim.x) / startDim.w) * p_topW;
                        line(x_new, movingEdgeY, x, foldLineY);
                    }
                } else { // Horizontal crease
                    const y = fold.y1;
                    if (y >= startDim.y && y < foldLineY) {
                        const y_new = foldLineY - (foldLineY - y) * cos(theta);
                        line(p_topX, y_new, p_topX + p_topW, y_new);
                    }
                }
            }
            drawingContext.setLineDash([]);
            pop();

            // --- Draw Markings ---
            if (showLabels) {
                push();
                drawingContext.beginPath();
                // Create a clipping path from the combined shape of the paper
                drawingContext.rect(stationary.x, stationary.y, stationary.w, stationary.h);
                drawingContext.moveTo(startDim.x, foldLineY);
                drawingContext.lineTo(startDim.x + startDim.w, foldLineY);
                drawingContext.lineTo(p_topX + p_topW, movingEdgeY);
                drawingContext.lineTo(p_topX, movingEdgeY);
                drawingContext.closePath();
                drawingContext.clip();
                // Draw the markings, which will now be correctly clipped
                drawMarkings();
                pop();
            }
        }

        /**
         * Draws the 3D folding animation for a vertical fold (left over right).
         */
        function drawVerticalFoldAnimation(progress) {
            const theta = progress * PI;
            const flapW = startDim.w / 2;
            const foldLineX = startDim.x + flapW;

            // Geometry
            const stationary = { x: foldLineX, y: startDim.y, w: flapW, h: startDim.h };
            const movingEdgeX = foldLineX - flapW * cos(theta);
            const perspective = sin(theta) * 0.05;
            const p_topY = startDim.y + startDim.h * perspective;
            const p_topH = startDim.h * (1 - perspective * 2);
            
            // Draw paper parts
            push();
            fill(255, 253, 248);
            stroke(150);
            strokeWeight(2);
            rect(stationary.x, stationary.y, stationary.w, stationary.h);
            const shade = map(sin(theta), 0, 1, 255, 220, true);
            fill(shade, shade, shade - 5);
            quad(movingEdgeX, p_topY, foldLineX, startDim.y, foldLineX, startDim.y + startDim.h, movingEdgeX, p_topY + p_topH);
            pop();
            
            // --- Draw Creases ---
            // 1. On stationary part (right half)
            push();
            drawingContext.beginPath();
            rect(stationary.x, stationary.y, stationary.w, stationary.h);
            drawingContext.clip();
            for (const fold of allFolds) {
                fold.draw();
            }
            pop();

            // 2. On folding part (left half)
            push();
            stroke(50, 50, 50, 150);
            strokeWeight(1.5);
            drawingContext.setLineDash([4, 2]);
            for (const fold of allFolds) {
                if (fold.y1 === fold.y2) { // Horizontal crease
                    const y = fold.y1;
                    if (y >= startDim.y && y <= startDim.y + startDim.h) {
                        const y_new = p_topY + ((y - startDim.y) / startDim.h) * p_topH;
                        line(movingEdgeX, y_new, foldLineX, y);
                    }
                } else { // Vertical crease
                    const x = fold.x1;
                    if (x >= startDim.x && x < foldLineX) {
                        const x_new = foldLineX - (foldLineX - x) * cos(theta);
                        line(x_new, p_topY, x_new, p_topY + p_topH);
                    }
                }
            }
            drawingContext.setLineDash([]);
            pop();

            // --- Draw Markings ---
            if (showLabels) {
                push();
                drawingContext.beginPath();
                // Create a clipping path from the combined shape of the paper
                drawingContext.rect(stationary.x, stationary.y, stationary.w, stationary.h);
                drawingContext.moveTo(movingEdgeX, p_topY);
                drawingContext.lineTo(foldLineX, startDim.y);
                drawingContext.lineTo(foldLineX, startDim.y + startDim.h);
                drawingContext.lineTo(movingEdgeX, p_topY + p_topH);
                drawingContext.closePath();
                drawingContext.clip();
                // Draw the markings, which will now be correctly clipped
                drawMarkings();
                pop();
            }
        }

        /**
         * Folds the paper horizontally (downward).
         */
        function performHorizontalFold() {
            if (isAnimating || paper.h < MIN_DIMENSION || horizontalFoldCount >= MAX_HORIZONTAL_FOLDS) return;
            
            animationType = 'h-fold';
            startAnimation();
            const from = { x: paper.x, y: paper.y, w: paper.w, h: paper.h };
            targetDim = { ...from, y: from.y + from.h / 2, h: from.h / 2 };
            foldHistory.push({ type: 'horizontal', from: from });
            horizontalFoldCount++;
        }

        /**
         * Folds the paper vertically (right to left).
         */
        function performVerticalFold() {
            if (isAnimating || paper.w < MIN_DIMENSION || verticalFoldCount >= MAX_VERTICAL_FOLDS) return;

            animationType = 'v-fold';
            startAnimation();
            const from = { x: paper.x, y: paper.y, w: paper.w, h: paper.h };
            targetDim = { ...from, x: from.x + from.w / 2, w: from.w / 2 };
            foldHistory.push({ type: 'vertical', from: from });
            verticalFoldCount++; 
        }

        /**
         * Adds a crease line based on the fold being undone.
         */
        function addCreaseForFold(fold) {
            const { from } = fold;
            let creasesToAdd = [];

            if (fold.type === 'horizontal') {
                const y_center = paper.originalY + paper.originalH / 2;
                const crease_y = from.y + from.h / 2;
                creasesToAdd.push(new Crease(paper.originalX, crease_y, paper.originalX + paper.originalW, crease_y));
                
                if (abs(crease_y - y_center) > 1) { 
                    const distance = crease_y - y_center;
                    const symmetrical_y = y_center - distance;
                    creasesToAdd.push(new Crease(paper.originalX, symmetrical_y, paper.originalX + paper.originalW, symmetrical_y));
                }
            } else { // vertical
                const x_center = paper.originalX + paper.originalW / 2;
                const crease_x = from.x + from.w / 2;
                creasesToAdd.push(new Crease(crease_x, paper.originalY, crease_x, paper.originalY + paper.originalH));
                
                if (abs(crease_x - x_center) > 1) {
                    const distance = crease_x - x_center;
                    const symmetrical_x = x_center - distance;
                    creasesToAdd.push(new Crease(symmetrical_x, paper.originalY, symmetrical_x, paper.originalY + paper.originalH));
                }
            }

            creasesToAdd.forEach(newCrease => {
                if (!allFolds.some(f => f.equals(newCrease))) {
                    allFolds.push(newCrease);
                }
            });
        }

        /**
         * Initializes an animation.
         */
        function startAnimation() {
            isAnimating = true;
            animationProgress = 0;
            startDim = { x: paper.x, y: paper.y, w: paper.w, h: paper.h };
            updateButtons();
        }

        /**
         * Enables or disables buttons based on the current state.
         */
        function updateButtons() {
            document.getElementById('h-fold-btn').disabled = isAnimating || paper.h < MIN_DIMENSION || horizontalFoldCount >= MAX_HORIZONTAL_FOLDS;
            document.getElementById('v-fold-btn').disabled = isAnimating || paper.w < MIN_DIMENSION || verticalFoldCount >= MAX_VERTICAL_FOLDS;
            document.getElementById('unfold-btn').disabled = isAnimating || foldHistory.length === 0;
            document.getElementById('reset-btn').disabled = isAnimating;
        }

        /**
         * Resets the entire simulation.
         */
        function resetPaper() {
            isAnimating = false;
            animationType = null;
            allFolds = [];
            foldHistory = [];
            verticalFoldCount = 0;
            horizontalFoldCount = 0;
            paper.reset();
            updateButtons();
        }

        /**
         * Toggles the visibility of the markings.
         */
        function toggleLabels() {
            showLabels = document.getElementById('showLabels').checked;
        }

        /**
         * Draws the perpendicular and parallel markings on the paper.
         */
        function drawMarkings() {
            if (allFolds.length < 1) return;
            
            const hasHorizontalFolds = allFolds.some(f => f.y1 === f.y2);
            const hasVerticalFolds = allFolds.some(f => f.x1 === f.x2);

            // --- Draw 90° Angle Indicators at Visible Intersections ---
            if (hasHorizontalFolds && hasVerticalFolds) {
                const allVerticalFolds = allFolds.filter(f => f.x1 === f.x2);
                const allHorizontalFolds = allFolds.filter(f => f.y1 === f.y2);

                for (const vFold of allVerticalFolds) {
                    for (const hFold of allHorizontalFolds) {
                        const intersectionX = vFold.x1;
                        const intersectionY = hFold.y1;

                        if (intersectionX >= paper.x - 1 && intersectionX <= paper.x + paper.w + 1 &&
                            intersectionY >= paper.y - 1 && intersectionY <= paper.y + paper.h + 1) {
                            
                            push();
                            stroke(200, 0, 0, 200);
                            strokeWeight(1.5);
                            noFill();
                            
                            rect(intersectionX + 2, intersectionY + 2, 8, 8);
                            pop();
                        }
                    }
                }
            }

            // --- Draw Parallel Line Indicators on Visible Segments ---
            if (hasHorizontalFolds) {
                const allHorizontalFolds = allFolds.filter(f => f.y1 === f.y2);
                const verticalCreases = allFolds.filter(f => f.x1 === f.x2);

                for (const hFold of allHorizontalFolds) {
                    const y = hFold.y1;
                    
                    if (y > paper.y && y < paper.y + paper.h) {
                        
                        let segmentDividers = [paper.x];
                        
                        for(const vCrease of verticalCreases) {
                            if(vCrease.x1 > paper.x && vCrease.x1 < paper.x + paper.w) {
                                segmentDividers.push(vCrease.x1);
                            }
                        }
                        
                        segmentDividers.push(paper.x + paper.w);
                        segmentDividers = [...new Set(segmentDividers)].sort((a, b) => a - b);
                        
                        for (let i = 0; i < segmentDividers.length - 1; i++) {
                            const startX = segmentDividers[i];
                            const endX = segmentDividers[i+1];
                            const midX = (startX + endX) / 2;

                            if (endX - startX > 10) { 
                                push();
                                stroke(0, 200, 0, 200); // Green color
                                strokeWeight(2);
                                noFill();
                                
                                // Draw an arrowhead symbol '>'
                                line(midX - 5, y - 5, midX + 5, y); // Top line of arrow
                                line(midX - 5, y + 5, midX + 5, y); // Bottom line of arrow
                                pop();
                            }
                        }
                    }
                }
            }
        }

        /**
         * Easing function for smooth animation.
         */
        function easeInOut(t) {
            return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        }
   