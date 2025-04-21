
 class VennModel {
    constructor() {
        this.questions = [
            {
                question: "Select the part of Venn diagram that represents set A",
                correctSet: "A",
                correctRegions: ["region-A", "intersection"],
                hint: "Click on the entire left circle A (including its intersection with B)"
            },
            {
                question: "Select the part of Venn diagram that represents set B",
                correctSet: "B",
                correctRegions: ["region-B", "intersection"],
                hint: "Click on the entire right circle B (including its intersection with A)"
            },
            {
                question: "Select the part of Venn diagram that represents set A - B",
                correctSet: "A - B",
                correctRegions: ["region-A"],
                hint: "Click only the part of circle A that does not overlap with B"
            },
            {
                question: "Select the part of Venn diagram that represents set A'",
                correctSet: "A'",
                correctRegions: ["universal-set", "region-B"],
                excludeRegions: ["region-A", "intersection"],
                hint: "Click on everything outside circle A (the universal set and the non-overlapping part of B)"
            },
            {
                question: "Select the part of Venn diagram that represents set A ∪ B",
                correctSet: "A ∪ B",
                correctRegions: ["region-A", "region-B", "intersection"],
                hint: "Click all parts of both circles A and B"
            },
            {
                question: "Select the part of Venn diagram that represents set B'",
                correctSet: "B'",
                correctRegions: ["universal-set", "region-A"],
                excludeRegions: ["region-B", "intersection"],
                hint: "Click on everything outside circle B (the universal set and the non-overlapping part of A)"
            },
            {
                question: "Select the part of Venn diagram that represents set B - A",
                correctSet: "B - A",
                correctRegions: ["region-B"],
                hint: "Click only the part of circle B that does not overlap with A"
            },
            {
                question: "Select the part of Venn diagram that represents set A ∩ B",
                correctSet: "A ∩ B",
                correctRegions: ["intersection"],
                hint: "Click only the overlapping region between circles A and B"
             },
            // {
            //     question: "Select the part of Venn diagram that represents (A ∪ B)'",
            //     correctSet: "(A ∪ B)'",
            //     correctRegions: ["universal-set"],
            //     excludeRegions: ["region-A", "region-B", "intersection"],
            //     hint: "Click only the part of universal set that is outside both circles"
            // },
            // {
            //     question: "Select the part of Venn diagram that represents (A ∩ B)'",
            //     correctSet: "(A ∩ B)'",
            //     correctRegions: ["universal-set", "region-A", "region-B"],
            //     excludeRegions: ["intersection"],
            //     hint: "Click everything except the intersection of A and B"
            // }
        ];
        
        this.currentQuestion = 0;
        this.selectedRegions = new Set();
        this.attempts = 0;
        this.correctAnswers = 0;
        this.MAX_ATTEMPTS = 3;
    }

    getCurrentQuestion() {
        return this.questions[this.currentQuestion];
    }

    selectRegion(region) {
        if (this.selectedRegions.has(region)) {
            this.selectedRegions.delete(region);
            return false;
        } else {
            this.selectedRegions.add(region);
            return true;
        }
    }

    selectUniversalSet() {
        if (this.selectedRegions.has("universal-set")) {
            this.selectedRegions.delete("universal-set");
            return false;
        } else {
            this.selectedRegions.add("universal-set");
            return true;
        }
    }

    checkAnswer() {
        const currentQ = this.questions[this.currentQuestion];
        this.attempts++;
        
        // Check if all required regions are selected
        const hasAllRequired = currentQ.correctRegions.every(region => 
            this.selectedRegions.has(region));
        
        // Check if no excluded regions are selected
        const hasNoExcluded = !currentQ.excludeRegions || 
            currentQ.excludeRegions.every(region => 
                !this.selectedRegions.has(region));
        
        // Check if no extra regions are selected
        const hasNoExtra = Array.from(this.selectedRegions).every(region => 
            currentQ.correctRegions.includes(region));
        
        return hasAllRequired && hasNoExcluded && hasNoExtra;
    }

    nextQuestion() {
        this.currentQuestion++;
        if (this.currentQuestion >= this.questions.length) {
            this.currentQuestion = 0;
            this.correctAnswers = 0;
        }
        this.resetQuestion();
    }

    resetQuestion() {
        this.selectedRegions.clear();
        this.attempts = 0;
    }

    incrementCorrectAnswers() {
        this.correctAnswers++;
    }

    getProgress() {
        return {
            current: this.correctAnswers,
            total: this.questions.length
        };
    }

    isMaxAttemptsReached() {
        return this.attempts >= this.MAX_ATTEMPTS;
    }

    getAttempts() {
        return this.attempts;
    }
}

class VennView {
    constructor(p5Instance, isSolutionView = false) {
        this.p5 = p5Instance;
        this.isSolutionView = isSolutionView;
        this.width = 500;
        this.height = 500; // Increased height to accommodate title and counter
        this.universalSetPadding = 50;
        this.circleRadius = 80;
        
        // Colors - different for main view and solution view
        this.colors = {
            background: '#ffffff',
            unselected: '#ffffff',
            selected: this.isSolutionView ? '#4CAF50' : '#8c7ff7', // Green for solution, Purple for main
            stroke: '#000000',
            text: '#000000',
            buttonBackground: '#7367f0', // Purple button color
            buttonText: '#ffffff'
        };

        // Calculate the center of the universal set rectangle
        const universalSetWidth = this.width - 2 * this.universalSetPadding;
        const universalSetHeight = 250;
        const universalSetCenterX = this.universalSetPadding + universalSetWidth / 2;
        const universalSetCenterY = 150 + universalSetHeight / 2;
        
        // Position circles to be centered within the universal set
        const circleDistance = this.circleRadius * 0.8; // Distance between circles (reduced for better intersection)
        this.circleA = { 
            x: universalSetCenterX - circleDistance, 
            y: universalSetCenterY 
        };
        this.circleB = { 
            x: universalSetCenterX + circleDistance, 
            y: universalSetCenterY 
        };

        // Selected regions
        this.selectedRegions = new Set();
        
        // UI State
        this.correctAnswers = 1;
        this.totalQuestions = 8;
        this.currentSet = "B"; // Default set to display
        
        // Button dimensions
        this.checkButton = {
            x: 380,
            y: 200,
            width: 100,
            height: 40
        };
    }

    setup() {
        // Create a responsive canvas that adapts to container size
        const containerElement = document.getElementById(this.isSolutionView ? 'solution-diagram' : 'venn-diagram');
        const containerWidth = containerElement.offsetWidth;
        
        // For smaller screens, make canvas responsive
        if (window.innerWidth <= 800 || window.innerHeight <= 940) {
            // Set canvas size based on container width with a minimum size
            // Solution view is smaller than main view
            const sizeFactor = this.isSolutionView ? 0.8 : 1;
            this.width = Math.max(350, Math.min(500, containerWidth - 40)) * sizeFactor;
            this.height = this.width; // Keep it square
            
            // Adjust circle radius based on canvas size
            this.circleRadius = this.width / 6;
            
            // Recalculate positions for responsive layout
            const universalSetWidth = this.width - 2 * this.universalSetPadding;
            const universalSetHeight = this.width * 0.5; // Half of width
            const universalSetCenterX = this.universalSetPadding + universalSetWidth / 2;
            const universalSetCenterY = this.height * 0.3 + universalSetHeight / 2;
            
            // Position circles to be centered within the universal set
            const circleDistance = this.circleRadius * 0.8;
            this.circleA = { 
                x: universalSetCenterX - circleDistance, 
                y: universalSetCenterY 
            };
            this.circleB = { 
                x: universalSetCenterX + circleDistance, 
                y: universalSetCenterY 
            };
        }
        // For larger screens, use original fixed dimensions
        else {
            // Solution view is smaller than main view
            const sizeFactor = this.isSolutionView ? 0.8 : 1;
            this.width = 500 * sizeFactor;
            this.height = 500 * sizeFactor;
            this.circleRadius = 80 * sizeFactor;
            
            // Calculate the center of the universal set rectangle
            const universalSetWidth = this.width - 2 * this.universalSetPadding;
            const universalSetHeight = 250 * sizeFactor;
            const universalSetCenterX = this.universalSetPadding + universalSetWidth / 2;
            const universalSetCenterY = (150 + universalSetHeight / 2) * sizeFactor;
            
            // Original circle positions
            const circleDistance = this.circleRadius * 0.8;
            this.circleA = { 
                x: universalSetCenterX - circleDistance, 
                y: universalSetCenterY 
            };
            this.circleB = { 
                x: universalSetCenterX + circleDistance, 
                y: universalSetCenterY 
            };
        }
        
        this.canvas = this.p5.createCanvas(this.width, this.height);
        this.canvas.parent(this.isSolutionView ? 'solution-diagram' : 'venn-diagram');
        this.p5.textAlign(this.p5.CENTER, this.p5.CENTER);
        this.p5.strokeWeight(2);
        
        // Only add resize listener for the main view to avoid duplicate listeners
        if (!this.isSolutionView) {
            window.addEventListener('resize', this.handleResize.bind(this));
        }
    }
    
    handleResize() {
        // Debounce resize event
        if (this.resizeTimeout) clearTimeout(this.resizeTimeout);
        this.resizeTimeout = setTimeout(() => {
            const containerElement = document.getElementById(this.isSolutionView ? 'solution-diagram' : 'venn-diagram');
            const containerWidth = containerElement.offsetWidth;
            
            // Only make responsive for smaller screens
            if (window.innerWidth <= 800 || window.innerHeight <= 940) {
                // Update canvas size
                const sizeFactor = this.isSolutionView ? 0.8 : 1;
                this.width = Math.max(300, Math.min(500, containerWidth - 40)) * sizeFactor;
                this.height = this.width;
                
                // Adjust circle radius based on canvas size
                this.circleRadius = this.width / 6;
                
                // Recalculate positions
                const universalSetWidth = this.width - 2 * this.universalSetPadding;
                const universalSetHeight = this.width * 0.5;
                const universalSetCenterX = this.universalSetPadding + universalSetWidth / 2;
                const universalSetCenterY = this.height * 0.3 + universalSetHeight / 2;
                
                // Update circle positions
                const circleDistance = this.circleRadius * 0.8;
                this.circleA.x = universalSetCenterX - circleDistance;
                this.circleA.y = universalSetCenterY;
                this.circleB.x = universalSetCenterX + circleDistance;
                this.circleB.y = universalSetCenterY;
            }
            // For larger screens, use original fixed dimensions
            else {
                const sizeFactor = this.isSolutionView ? 0.8 : 1;
                this.width = 500 * sizeFactor;
                this.height = 500 * sizeFactor;
                this.circleRadius = 80 * sizeFactor;
                
                // Calculate the center of the universal set rectangle
                const universalSetWidth = this.width - 2 * this.universalSetPadding;
                const universalSetHeight = 250 * sizeFactor;
                const universalSetCenterX = this.universalSetPadding + universalSetWidth / 2;
                const universalSetCenterY = (150 + universalSetHeight / 2) * sizeFactor;
                
                // Original circle positions
                const circleDistance = this.circleRadius * 0.8;
                this.circleA.x = universalSetCenterX - circleDistance;
                this.circleA.y = universalSetCenterY;
                this.circleB.x = universalSetCenterX + circleDistance;
                this.circleB.y = universalSetCenterY;
            }
            
            // Resize canvas
            this.p5.resizeCanvas(this.width, this.height);
        }, 250);
    }

    draw() {
        this.p5.background(this.colors.background);
        
        // Skip the title text for solution view
        if (!this.isSolutionView) {
            // Adjust drawing based on screen size
            if (window.innerWidth <= 800 || window.innerHeight <= 940) {
                // Responsive drawing for small screens
                this.p5.noStroke();
                this.p5.textSize(Math.max(12, this.width / 30));
                this.p5.textAlign(this.p5.LEFT, this.p5.TOP);
                this.p5.fill(this.colors.text);
                // this.p5.text("Visualize statements about two sets of data", 20, 20);  
                // this.p5.text("written in mathematical notation with a", 20, 40);  
                // this.p5.text("Venn diagram.", 20, 60);
            } 
            else {
                // Original drawing for larger screens
                this.p5.noStroke();
                this.p5.textSize(16);
                this.p5.textAlign(this.p5.LEFT, this.p5.TOP);
                this.p5.fill(this.colors.text);
                // this.p5.text("Visualize statements about two sets of data", 20, 20);  
                // this.p5.text("written in mathematical notation with a", 20, 40);  
                // this.p5.text("Venn diagram.", 20, 60);
            }
        }
        
        // Adjust drawing based on screen size
        if (window.innerWidth <= 800 || window.innerHeight <= 940) {
            // Calculate universal set dimensions for responsive layout
            const universalSetWidth = this.width - 2 * this.universalSetPadding;
            const universalSetHeight = this.width * 0.5; // Half of width
            
            // Draw universal set (rectangle)
            this.p5.stroke(this.colors.stroke);
            this.p5.fill(this.selectedRegions.has('universal-set') ? this.colors.selected : this.colors.unselected);
            this.p5.rect(this.universalSetPadding, this.height * 0.3, 
                        universalSetWidth, 
                        universalSetHeight); // Responsive height
            
            // Draw label "U" with responsive size
            this.p5.fill(this.colors.text);
            this.p5.noStroke();
            this.p5.textSize(Math.max(16, this.width / 25));
            this.p5.text("U", this.universalSetPadding + 20, this.height * 0.3 + 26);
        } 
        else {
            // Original drawing for larger screens
            this.p5.stroke(this.colors.stroke);
            this.p5.fill(this.selectedRegions.has('universal-set') ? this.colors.selected : this.colors.unselected);
            this.p5.rect(this.universalSetPadding, this.height * 0.3, 
                        this.width - 2 * this.universalSetPadding, 
                        this.height * 0.5); // Proportional height
            
            // Draw label "U"
            this.p5.fill(this.colors.text);
            this.p5.noStroke();
            this.p5.textSize(this.width / 25);
            this.p5.text("U", this.universalSetPadding + 20, this.height * 0.3 + 20);
        }

        // Draw regions in correct order
        this.drawVennRegions();
    }

    drawVennRegions() {
        // Draw regions in layers to handle all possible selections
        this.p5.noStroke();

        // Layer 1: Draw non-intersection parts of circles if they're selected
        if (this.selectedRegions.has('region-A')) {
            this.p5.fill(this.colors.selected);
            this.drawCircleAWithoutIntersection();
        } else {
            this.p5.fill(this.colors.unselected);
            this.drawCircleAWithoutIntersection();
        }

        if (this.selectedRegions.has('region-B')) {
            this.p5.fill(this.colors.selected);
            this.drawCircleBWithoutIntersection();
        } else {
            this.p5.fill(this.colors.unselected);
            this.drawCircleBWithoutIntersection();
        }

        // Layer 2: Draw intersection
        if (this.selectedRegions.has('intersection')) {
            this.p5.fill(this.colors.selected);
        } else {
            this.p5.fill(this.colors.unselected);
        }
        this.drawIntersection();

        // Draw circle outlines
        this.p5.noFill();
        this.p5.stroke(this.colors.stroke);
        
        // Responsive stroke weight for small screens
        if (window.innerWidth <= 800 || window.innerHeight <= 940) {
            this.p5.strokeWeight(Math.max(1, this.width / 250));
        } else {
            this.p5.strokeWeight(2);
        }
        
        this.p5.circle(this.circleA.x, this.circleA.y, this.circleRadius * 2);
        this.p5.circle(this.circleB.x, this.circleB.y, this.circleRadius * 2);

        // Draw labels with appropriate text size
        this.p5.fill(this.colors.text);
        this.p5.noStroke();
        
        // Responsive text size for small screens
        if (window.innerWidth <= 800 || window.innerHeight <= 940) {
            const labelSize = Math.max(16, this.width / 25);
            this.p5.textSize(labelSize);
        } else {
            this.p5.textSize(20);
        }
        
        this.p5.text("A", this.circleA.x - this.circleRadius/2, this.circleA.y);
        this.p5.text("B", this.circleB.x + this.circleRadius/2, this.circleB.y);
    }

    drawCircleAWithoutIntersection() {
        this.p5.beginShape();
        const steps = 360;
        const stepSize = 360 / steps;

        for (let i = 0; i <= steps; i++) {
            const angle = this.p5.radians(i * stepSize);
            const x = this.circleA.x + this.circleRadius * this.p5.cos(angle);
            const y = this.circleA.y + this.circleRadius * this.p5.sin(angle);
            if (!this.isPointInCircleB(x, y)) {
                this.p5.vertex(x, y);
            }
        }
        this.p5.endShape(this.p5.CLOSE);
    }

    drawCircleBWithoutIntersection() {
        this.p5.beginShape();
        const steps = 360;
        const stepSize = 360 / steps;

        for (let i = 0; i <= steps; i++) {
            const angle = this.p5.radians(i * stepSize);
            const x = this.circleB.x + this.circleRadius * this.p5.cos(angle);
            const y = this.circleB.y + this.circleRadius * this.p5.sin(angle);
            if (!this.isPointInCircleA(x, y)) {
                this.p5.vertex(x, y);
            }
        }
        this.p5.endShape(this.p5.CLOSE);
    }

    drawIntersection() {
        // Calculate distance between circle centers
        const d = this.p5.dist(this.circleA.x, this.circleA.y, this.circleB.x, this.circleB.y);
        const r = this.circleRadius;
        
        // If circles don't overlap, nothing to draw
        if (d >= 2 * r) return;
        
        // If one circle is inside the other, handle differently
        if (d <= Math.abs(r - r)) return;
        
        // Calculate intersection points
        const a = (r * r - r * r + d * d) / (2 * d);
        const h = Math.sqrt(r * r - a * a);
        
        const p2x = this.circleA.x + a * (this.circleB.x - this.circleA.x) / d;
        const p2y = this.circleA.y + a * (this.circleB.y - this.circleA.y) / d;
        
        const intersectPoint1 = {
            x: p2x + h * (this.circleB.y - this.circleA.y) / d,
            y: p2y - h * (this.circleB.x - this.circleA.x) / d
        };
        
        const intersectPoint2 = {
            x: p2x - h * (this.circleB.y - this.circleA.y) / d,
            y: p2y + h * (this.circleB.x - this.circleA.x) / d
        };
        
        // Draw the intersection lens shape
        this.p5.beginShape();
        
        // First intersection point
        this.p5.vertex(intersectPoint1.x, intersectPoint1.y);
        
        // Arc from circle A
        const startAngleA = Math.atan2(intersectPoint1.y - this.circleA.y, intersectPoint1.x - this.circleA.x);
        const endAngleA = Math.atan2(intersectPoint2.y - this.circleA.y, intersectPoint2.x - this.circleA.x);
        
        // Ensure correct direction of arc
        let sweepAngleA = endAngleA - startAngleA;
        if (sweepAngleA < 0) sweepAngleA += 2 * Math.PI;
        
        const steps = 50;
        for (let i = 1; i <= steps; i++) {
            const t = i / steps;
            const angle = startAngleA + t * sweepAngleA;
            const x = this.circleA.x + r * Math.cos(angle);
            const y = this.circleA.y + r * Math.sin(angle);
            this.p5.vertex(x, y);
        }
        
        // Second intersection point
        this.p5.vertex(intersectPoint2.x, intersectPoint2.y);
        
        // Arc from circle B
        const startAngleB = Math.atan2(intersectPoint2.y - this.circleB.y, intersectPoint2.x - this.circleB.x);
        const endAngleB = Math.atan2(intersectPoint1.y - this.circleB.y, intersectPoint1.x - this.circleB.x);
        
        // Ensure correct direction of arc
        let sweepAngleB = endAngleB - startAngleB;
        if (sweepAngleB < 0) sweepAngleB += 2 * Math.PI;
        
        for (let i = 1; i <= steps; i++) {
            const t = i / steps;
            const angle = startAngleB + t * sweepAngleB;
            const x = this.circleB.x + r * Math.cos(angle);
            const y = this.circleB.y + r * Math.sin(angle);
            this.p5.vertex(x, y);
        }
        
        this.p5.endShape(this.p5.CLOSE);
    }

    isPointInCircleA(x, y) {
        let d = this.p5.dist(x, y, this.circleA.x, this.circleA.y);
        return d <= this.circleRadius;
    }

    isPointInCircleB(x, y) {
        let d = this.p5.dist(x, y, this.circleB.x, this.circleB.y);
        return d <= this.circleRadius;
    }

    mousePressed() {
        let mouseX = this.p5.mouseX;
        let mouseY = this.p5.mouseY;

        // Check if click is within canvas bounds
        if (mouseX < 0 || mouseX > this.width || mouseY < 0 || mouseY > this.height) {
            return null;
        }

        // Check if CHECK button was clicked
        if (this.isClickInCheckButton(mouseX, mouseY)) {
            return 'check-button';
        }

        // Check if click is in universal set
        if (this.isClickInUniversalSet(mouseX, mouseY)) {
            // If clicking outside both circles but inside universal set
            if (!this.isPointInCircleA(mouseX, mouseY) && !this.isPointInCircleB(mouseX, mouseY)) {
                return 'universal-set';
            }
        }

        // Check intersection first (since it's the most specific region)
        if (this.isPointInCircleA(mouseX, mouseY) && this.isPointInCircleB(mouseX, mouseY)) {
            return 'intersection';
        }

        // Check individual regions
        if (this.isPointInCircleA(mouseX, mouseY) && !this.isPointInCircleB(mouseX, mouseY)) {
            return 'region-A';
        }

        if (this.isPointInCircleB(mouseX, mouseY) && !this.isPointInCircleA(mouseX, mouseY)) {
            return 'region-B';
        }

        return null;
    }

    isClickInUniversalSet(x, y) {
        if (window.innerWidth <= 800 || window.innerHeight <= 940) {
            // Responsive calculation for small screens
            const universalSetHeight = this.width * 0.5;
            return x >= this.universalSetPadding && 
                   x <= this.width - this.universalSetPadding &&
                   y >= this.height * 0.3 && 
                   y <= this.height * 0.3 + universalSetHeight;
        } else {
            // Original calculation for larger screens
            return x >= this.universalSetPadding &&  
                   x <= this.width - this.universalSetPadding &&
                   y >= 150 && 
                   y <= 150 + 250;
        }
    }

    isClickInCheckButton(x, y) {
        return x >= this.checkButton.x && 
               x <= this.checkButton.x + this.checkButton.width &&
               y >= this.checkButton.y && 
               y <= this.checkButton.y + this.checkButton.height;
    }

    setSelectedRegions(regions) {
        this.selectedRegions = new Set(regions);
    }

    clearSelectedRegions() {
        this.selectedRegions.clear();
    }

    setCorrectAnswers(correct, total) {
        this.correctAnswers = correct;
        this.totalQuestions = total;
    }

    // Add a new method to update the current set question
    setCurrentSet(set) {
        this.currentSet = set;
    }
}


class VennController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.solutionView = null;
        
        // DOM elements
        this.elements = {
            question: document.getElementById('question'),
            checkButton: document.getElementById('checkButton'),
            nextButton: document.getElementById('nextButton'),
            feedback: document.getElementById('feedback'),
            hint: document.getElementById('hint'),
            progress: document.getElementById('progress'),
            solutionSection: document.getElementById('solution-section'),
            checkContainer: document.getElementById('check-container')
        };

        // Bind event handlers
        this.elements.checkButton.addEventListener('click', () => this.checkAnswer());
        this.elements.nextButton.addEventListener('click', () => this.nextQuestion());
        
        // Initialize the first question
        this.updateQuestion();
    }

    // Method to set the solution view
    setSolutionView(solutionView) {
        this.solutionView = solutionView;
    }

    handleRegionClick(region) {
        if (!region) return;
        
        const isSelected = this.model.selectRegion(region);
        this.view.setSelectedRegions(this.model.selectedRegions);
    }

    checkAnswer() {
        const isCorrect = this.model.checkAnswer();
        const attempts = this.model.getAttempts();
        
        // Update check button text
        this.elements.checkButton.textContent = `CHECK (${attempts + 1})`;
        
        if (isCorrect) {
            this.handleCorrectAnswer();
        } else {
            this.handleIncorrectAnswer();
        }
    }

    handleCorrectAnswer() {
        this.elements.feedback.textContent = " Correct!";
        this.elements.feedback.className = "correct";
        this.elements.nextButton.disabled = false;
        this.elements.checkButton.disabled = true;
        this.model.incrementCorrectAnswers();
        this.updateProgress();
        this.elements.hint.textContent = "";
        this.elements.solutionSection.classList.add("hidden");
    }

    handleIncorrectAnswer() {
        this.elements.feedback.textContent = " Try again";
        this.elements.feedback.className = "incorrect";
        
        const attempts = this.model.getAttempts();
        
        // Show hint after second attempt
        if (attempts === 2) {
            this.elements.hint.textContent = this.model.getCurrentQuestion().hint;
        }
        
        // Show solution after third attempt
        if (this.model.isMaxAttemptsReached()) {
            this.elements.checkContainer.classList.add("hidden");
            this.showCorrectSolution();
            this.elements.nextButton.disabled = false;
        }
    }

    nextQuestion() {
        this.model.nextQuestion();
        this.resetInterface();
        this.updateQuestion();
    }

    updateQuestion() {
        const currentQuestion = this.model.getCurrentQuestion();
        this.elements.question.textContent = currentQuestion.question;
        
        // Update the set notation in the Venn diagram
        this.view.setCurrentSet(currentQuestion.correctSet);
        if (this.solutionView) {
            this.solutionView.setCurrentSet(currentQuestion.correctSet);
        }
    }

    updateProgress() {
        const progress = this.model.getProgress();
        this.elements.progress.textContent = `${progress.current} of ${progress.total}`;
    }

    showCorrectSolution() {
        this.elements.solutionSection.classList.remove("hidden");
        const currentQuestion = this.model.getCurrentQuestion();
        
        // If we have a separate solution view, use it
        if (this.solutionView) {
            // Reset solution diagram
            this.solutionView.clearSelectedRegions();
            
            // Show correct regions in solution diagram
            this.solutionView.setSelectedRegions(new Set(currentQuestion.correctRegions));
        }
    }

    resetInterface() {
        // Reset view
        this.view.clearSelectedRegions();
        if (this.solutionView) {
            this.solutionView.clearSelectedRegions();
        }
        
        // Reset buttons and feedback
        this.elements.nextButton.disabled = true;
        this.elements.checkButton.disabled = false;
        this.elements.checkContainer.classList.remove("hidden");
        this.elements.checkButton.textContent = "CHECK (1)";
        this.elements.feedback.textContent = "";
        this.elements.feedback.className = "";
        this.elements.hint.textContent = "";
        this.elements.solutionSection.classList.add("hidden");
        
        // Update progress
        this.updateProgress();
    }
}






