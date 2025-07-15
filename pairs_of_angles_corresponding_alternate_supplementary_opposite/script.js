(function () {
    // ===== MODEL =====
    class MathExpressionModel {
        constructor() {
            this.numbers = [];
            this.expression = [null, null, null, null];
            this.currentEquation = null;
            this.usedNumbers = [];
            this.result = null;
            this.calculationSteps = '';
            this.isComplete = false;
            this.equations = [
                {
                    template: ['(', 0, '+', 1, ')', '×', 2, '^', 3],
                    positions: [0, 1, 2, 3],
                    calculate: (nums) => (nums[0] + nums[1]) * Math.pow(nums[2], nums[3]),
                    display: (nums) => `(${nums[0]} + ${nums[1]}) × ${nums[2]}^${nums[3]}`,
                    steps: (nums) => {
                        const sum = nums[0] + nums[1];
                        const power = Math.pow(nums[2], nums[3]);
                        const result = sum * power;
                        return `(${nums[0]} + ${nums[1]}) × ${nums[2]}^${nums[3]} = ${sum} × ${power} = ${result.toFixed(2)}`;
                    }
                },
                {
                    template: [0, '^', 1, '+', 2, '×', 3],
                    positions: [0, 1, 2, 3],
                    calculate: (nums) => Math.pow(nums[0], nums[1]) + (nums[2] * nums[3]),
                    display: (nums) => `${nums[0]}^${nums[1]} + ${nums[2]} × ${nums[3]}`,
                    steps: (nums) => {
                        const power = Math.pow(nums[0], nums[1]);
                        const product = nums[2] * nums[3];
                        const result = power + product;
                        return `${nums[0]}^${nums[1]} + ${nums[2]} × ${nums[3]} = ${power} + ${product} = ${result.toFixed(2)}`;
                    }
                },
                {
                    template: [0, '×', 1, '+', 2, '^', 3],
                    positions: [0, 1, 2, 3],
                    calculate: (nums) => (nums[0] * nums[1]) + Math.pow(nums[2], nums[3]),
                    display: (nums) => `${nums[0]} × ${nums[1]} + ${nums[2]}^${nums[3]}`,
                    steps: (nums) => {
                        const product = nums[0] * nums[1];
                        const power = Math.pow(nums[2], nums[3]);
                        const result = product + power;
                        return `${nums[0]} × ${nums[1]} + ${nums[2]}^${nums[3]} = ${product} + ${power} = ${result.toFixed(2)}`;
                    }
                },
                {
                    template: ['(', 0, '×', 1, ')', '^', 2, '+', 3],
                    positions: [0, 1, 2, 3],
                    calculate: (nums) => Math.pow(nums[0] * nums[1], nums[2]) + nums[3],
                    display: (nums) => `(${nums[0]} × ${nums[1]})^${nums[2]} + ${nums[3]}`,
                    steps: (nums) => {
                        const product = nums[0] * nums[1];
                        const power = Math.pow(product, nums[2]);
                        const result = power + nums[3];
                        return `(${nums[0]} × ${nums[1]})^${nums[2]} + ${nums[3]} = ${product}^${nums[2]} + ${nums[3]} = ${power} + ${nums[3]} = ${result.toFixed(2)}`;
                    }
                },
                {
                    template: [0, '^', 1, '×', 2, '+', 3],
                    positions: [0, 1, 2, 3],
                    calculate: (nums) => Math.pow(nums[0], nums[1]) * nums[2] + nums[3],
                    display: (nums) => `${nums[0]}^${nums[1]} × ${nums[2]} + ${nums[3]}`,
                    steps: (nums) => {
                        const power = Math.pow(nums[0], nums[1]);
                        const product = power * nums[2];
                        const result = product + nums[3];
                        return `${nums[0]}^${nums[1]} × ${nums[2]} + ${nums[3]} = ${power} × ${nums[2]} + ${nums[3]} = ${product} + ${nums[3]} = ${result.toFixed(2)}`;
                    }
                },
                {
                    template: [0, '+', 1, '^', 2, '×', 3],
                    positions: [0, 1, 2, 3],
                    calculate: (nums) => nums[0] + Math.pow(nums[1], nums[2]) * nums[3],
                    display: (nums) => `${nums[0]} + ${nums[1]}^${nums[2]} × ${nums[3]}`,
                    steps: (nums) => {
                        const power = Math.pow(nums[1], nums[2]);
                        const product = power * nums[3];
                        const result = nums[0] + product;
                        return `${nums[0]} + ${nums[1]}^${nums[2]} × ${nums[3]} = ${nums[0]} + ${power} × ${nums[3]} = ${nums[0]} + ${product} = ${result.toFixed(2)}`;
                    }
                }
            ];
        }

        generateRandomNumbers() {
            this.numbers = [];
            const usedNums = new Set();
            while (this.numbers.length < 6) {
                const num = Math.floor(Math.random() * 6) + 1;
                if (!usedNums.has(num)) {
                    this.numbers.push(num);
                    usedNums.add(num);
                }
            }
            this.currentEquation = this.equations[Math.floor(Math.random() * this.equations.length)];
            this.reset();
        }

        reset() {
            this.expression = [null, null, null, null];
            this.usedNumbers = [];
            this.result = null;
            this.calculationSteps = '';
            this.isComplete = false;
        }

        canPlaceNumber(number) {
            return !this.usedNumbers.includes(number);
        }

        placeNumber(number, position) {
            if (this.canPlaceNumber(number) && position >= 0 && position < 4) {
                const prevIndex = this.expression.indexOf(number);
                if (prevIndex !== -1) this.expression[prevIndex] = null;
                const existingNumber = this.expression[position];
                if (existingNumber !== null) {
                    const usedIndex = this.usedNumbers.indexOf(existingNumber);
                    if (usedIndex !== -1) this.usedNumbers.splice(usedIndex, 1);
                }
                this.expression[position] = number;
                if (!this.usedNumbers.includes(number)) this.usedNumbers.push(number);
                this.checkCompletion();
                return true;
            }
            return false;
        }

        removeNumber(position) {
            if (position >= 0 && position < 4 && this.expression[position] !== null) {
                const number = this.expression[position];
                this.expression[position] = null;
                const usedIndex = this.usedNumbers.indexOf(number);
                if (usedIndex !== -1) this.usedNumbers.splice(usedIndex, 1);
                this.isComplete = false;
                this.result = null;
                this.calculationSteps = '';
            }
        }

        checkCompletion() {
            this.isComplete = this.expression.every(num => num !== null);
            if (this.isComplete) this.calculateResult();
        }

        calculateResult() {
            if (!this.isComplete || !this.currentEquation) return;
            try {
                this.result = this.currentEquation.calculate(this.expression);
                this.calculationSteps = this.currentEquation.steps(this.expression);
            } catch (error) {
                this.result = 'Error';
                this.calculationSteps = 'Calculation error';
            }
        }

        getAvailableNumbers() {
            return this.numbers.filter(num => !this.usedNumbers.includes(num));
        }

        getLargestPossibleValue() {
            if (this.numbers.length === 0 || !this.currentEquation) return 0;
            let maxValue = -Infinity;
            const nums = this.numbers;
            for (let i = 0; i < nums.length; i++) {
                for (let j = 0; j < nums.length; j++) {
                    for (let k = 0; k < nums.length; k++) {
                        for (let l = 0; l < nums.length; l++) {
                            if (i !== j && j !== k && k !== l && i !== k && i !== l && j !== l) {
                                try {
                                    const value = this.currentEquation.calculate([nums[i], nums[j], nums[k], nums[l]]);
                                    if (value > maxValue && isFinite(value)) maxValue = value;
                                } catch (error) {}
                            }
                        }
                    }
                }
            }
            return maxValue;
        }

        getCurrentEquationTemplate() {
            return this.currentEquation ? this.currentEquation.template : [];
        }
    }

    // ===== VIEW =====
    class MathExpressionView {
        constructor(p) {
            this.p = p;
            this.dropZones = [];
            this.numbers = [];
        }

        render() {
            this.p.background(245);
            this.p.textAlign(this.p.CENTER, this.p.CENTER);
            this.p.textSize(18);
            this.p.fill(55, 65, 81);
            this.p.text('Build an expression with the largest value.', 450, 30);

            // Render numbers
            this.numbers.forEach((num, i) => {
                const gap = 67;
                const startX = this.p.width / 2 - ((this.numbers.length - 1) * gap) / 2;
                let x = startX + i * gap;
                let y = 70;
                const boxSize = 55;
                this.p.fill(num.used ? [243, 244, 246] : num.dragging ? [199, 210, 254] : [224, 231, 255]);
                this.p.stroke(num.used ? [209, 213, 219] : num.dragging ? [124, 58, 237] : [199, 210, 254]);
                this.p.strokeWeight(2);
                this.p.rect(x - boxSize / 2, y - boxSize / 2, boxSize, boxSize, 8);
                this.p.fill(55, 48, 163);
                this.p.noStroke();
                this.p.textSize(20);
                this.p.text(num.value, x, y + 2); // Small offset to center vertically
            });

            // Render expression
            let y = 180;
            const zoneGap = 85;
            const startZoneX = this.p.width / 2 - ((this.dropZones.length - 1) * zoneGap) / 2;
            this.dropZones.forEach((zone, i) => {
                let x = startZoneX + i * zoneGap;
                const zoneSize = 70;
                this.p.fill(zone.filled ? [224, 231, 255] : zone.dragOver ? [243, 232, 255] : [250, 245, 255]);
                this.p.stroke(zone.filled ? [124, 58, 237] : zone.dragOver ? [124, 58, 237] : [168, 85, 247]);
                this.p.strokeWeight(zone.filled ? 2 : 3);
                this.p.rect(x - zoneSize / 2, y - zoneSize / 2, zoneSize, zoneSize, 8);
                if (zone.filled) {
                    this.p.fill(55, 48, 163);
                    this.p.noStroke();
                    this.p.textSize(20);
                    this.p.text(zone.value, x, y + 2); // Small offset to center vertically
                }
            });

            // Render operators and symbols
            let template = window.model.getCurrentEquationTemplate();
            let xOffset = 0;
            for (let i = 0; i < template.length; i++) {
                if (typeof template[i] !== 'number') {
                    xOffset += i > 0 && typeof template[i-1] === 'number' ? zoneGap : 0;
                    let x = startZoneX + (xOffset - 1.5) * zoneGap;
                    this.p.textSize(template[i] === '^' ? 20 : template[i] === '(' || template[i] === ')' ? 32 : 28);
                    this.p.fill(55, 65, 81);
                    this.p.noStroke();
                    this.p.text(template[i], x, 180);
                    if (template[i] === '^') xOffset -= 0.5;
                }
            }

            // Render result
            if (window.model.isComplete && window.model.result !== null) {
                this.p.textSize(16);
                this.p.fill(55, 65, 81);
                this.p.text(window.model.calculationSteps, 450, 320, 800, 60);
                this.p.textSize(18);
                this.p.text(`Largest value found = ${window.model.result.toFixed(2)}`, 450, 380);
            }
        }

        updateDragState(numIndex, dragging) {
            this.numbers[numIndex].dragging = dragging;
        }

        updateDropZoneState(zoneIndex, dragOver, filled, value) {
            this.dropZones[zoneIndex].dragOver = dragOver;
            this.dropZones[zoneIndex].filled = filled;
            this.dropZones[zoneIndex].value = value;
        }
    }

    // ===== CONTROLLER =====
    class MathExpressionController {
        constructor(p) {
            this.p = p;
            window.model = new MathExpressionModel();
            this.view = new MathExpressionView(p);
            this.draggedNumber = null;
            this.draggedIndex = null;
            window.controller = this;

            this.p.setup = () => this.setup();
            this.p.draw = () => this.draw();
            this.p.mousePressed = () => this.mousePressed();
            this.p.mouseDragged = () => this.mouseDragged();
            this.p.mouseReleased = () => this.mouseReleased();

            this.initializeGame();
        }

        setup() {
            const canvas = this.p.createCanvas(900, 500);
            canvas.parent('canvas-container'); // Append canvas to the container
            // this.p.noCursor(); // Comment out for debugging if needed
            if (!this.p.canvas) {
                console.error('Canvas failed to initialize at ', new Date().toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }));
            }
        }

        draw() {
            this.view.render();
        }

        initializeGame() {
            window.model.generateRandomNumbers();
            this.updateView();
        }

        updateView() {
            let numbers = window.model.numbers.map((n, i) => ({ value: n, used: window.model.usedNumbers.includes(n), dragging: false }));
            this.view.numbers = numbers;
            let template = window.model.getCurrentEquationTemplate();
            this.view.dropZones = template.map((item, i) => typeof item === 'number' ? { dragOver: false, filled: window.model.expression[i] !== null, value: window.model.expression[i] } : null).filter(Boolean);
        }

        mousePressed() {
            if (this.p.mouseY > 70 && this.p.mouseY < 125) {
                let index = Math.floor((this.p.mouseX - (this.p.width / 2 - ((this.view.numbers.length - 1) * 67) / 2)) / 67);
                if (index >= 0 && index < this.view.numbers.length && !this.view.numbers[index].used) {
                    this.draggedNumber = this.view.numbers[index].value;
                    this.draggedIndex = index;
                    this.view.updateDragState(index, true);
                }
            }
        }

        mouseDragged() {
            if (this.draggedNumber !== null) {
                let zoneIndex = this.getDropZoneIndex();
                if (zoneIndex !== -1) {
                    this.view.updateDropZoneState(zoneIndex, true, false, null);
                } else {
                    this.view.dropZones.forEach((zone, i) => {
                        if (zone.dragOver) this.view.updateDropZoneState(i, false, zone.filled, zone.value);
                    });
                }
            }
        }

        mouseReleased() {
            if (this.draggedNumber !== null) {
                let zoneIndex = this.getDropZoneIndex();
                if (zoneIndex !== -1 && window.model.placeNumber(this.draggedNumber, zoneIndex)) {
                    this.view.updateDropZoneState(zoneIndex, false, true, this.draggedNumber);
                } else {
                    this.view.updateDragState(this.draggedIndex, false);
                }
                this.draggedNumber = null;
                this.draggedIndex = null;
                this.updateView();
            }
        }

        getDropZoneIndex() {
            if (this.p.mouseY > 180 && this.p.mouseY < 250) {
                let index = Math.floor((this.p.mouseX - (this.p.width / 2 - ((this.view.dropZones.length - 1) * 85) / 2)) / 85);
                if (index >= 0 && index < this.view.dropZones.length) return index;
            }
            return -1;
        }

        startOver() {
            window.model.reset();
            this.updateView();
        }

        newQuestion() {
            window.model.generateRandomNumbers();
            this.updateView();
        }
    }

    // Initialize p5.js
    new p5();
})();