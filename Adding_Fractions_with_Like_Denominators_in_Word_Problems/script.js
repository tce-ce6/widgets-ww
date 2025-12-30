// Model - Data and business logic
class FractionModel {
    constructor() {
        this.questionTypes = [
            {
                text: "If one person takes NUM1/DEN of a pizza and another person takes NUM2/DEN of a pizza, how much of the pizza did they take altogether?",
                sliderLabels: ["1st pizza numerator", "2nd pizza numerator", "Denominator"],
            },
            {
                text: "The scale at the grocery store shows that the apples weigh NUM1/DEN of a pound and the pears weigh NUM2/DEN of a pound. How much do they weigh together?",
                sliderLabels: ["Apples numerator", "Pears numerator", "Denominator"],
            },
            {
                text: "NUM1/DEN of the class did their homework on time and NUM2/DEN of the class turned in their homework late. What fraction of the class finished their homework?",
                sliderLabels: ["1st homework numerator", "2nd homework numerator", "Denominator"],
            },
        ];
        this.draggedItems = { box1: null, box2: null };
        this.showSolution = false;
        this.selectedFractions = new Set();
        this.showDragMessage = true;
        this.generateNewProblem();
        this.sliderValues = {
            num1: this.num1,
            num2: this.num2,
            den: this.denominator,
        };
        this.originalValues = {
            num1: this.num1,
            num2: this.num2,
            den: this.denominator,
        };
    }

    generateNewProblem() {
        this.denominator = Math.floor(Math.random() * 10) + 3;
        this.num1 = Math.floor(Math.random() * (this.denominator - 1)) + 1;
        this.num2 = Math.floor(Math.random() * (this.denominator - 1)) + 1;
        while (this.num2 === this.num1) {
            this.num2 = Math.floor(Math.random() * (this.denominator - 1)) + 1;
        }
        this.questionType = Math.floor(Math.random() * 3);
        this.answerNum = this.num1 + this.num2;
        this.showSolution = false;
        this.sliderValues = {
            num1: this.num1,
            num2: this.num2,
            den: this.denominator,
        };
        this.originalValues = {
            num1: this.num1,
            num2: this.num2,
            den: this.denominator,
        };
        this.draggedItems = { box1: null, box2: null };
        this.selectedFractions.clear();
        this.showDragMessage = true;
        this.updateSliders();
    }

    getQuestion() {
        return this.questionTypes[this.questionType].text
            .replace("NUM1", this.sliderValues.num1)
            .replace("NUM2", this.sliderValues.num2)
            .replace(/DEN/g, this.sliderValues.den);
    }

    getSliderLabels() {
        return this.questionTypes[this.questionType].sliderLabels;
    }

    updateSliderValue(slider, value) {
        console.log("Updating slider " + slider + " to value " + value);
        this.sliderValues[slider] = parseInt(value);
        if (this.draggedItems.box1) {
            if (this.draggedItems.box1.index === 0) {
                this.draggedItems.box1.num = this.sliderValues.num1;
            } else {
                this.draggedItems.box1.num = this.sliderValues.num2;
            }
            this.draggedItems.box1.den = this.sliderValues.den;
        }
        if (this.draggedItems.box2) {
            if (this.draggedItems.box2.index === 0) {
                this.draggedItems.box2.num = this.sliderValues.num1;
            } else {
                this.draggedItems.box2.num = this.sliderValues.num2;
            }
            this.draggedItems.box2.den = this.sliderValues.den;
        }
        redraw();
    }

    updateSliders() {
        const sliderNum1 = document.getElementById("slider-num1");
        const sliderNum2 = document.getElementById("slider-num2");
        const sliderDen = document.getElementById("slider-den");
        const valueNum1 = document.getElementById("slider-value-num1");
        const valueNum2 = document.getElementById("slider-value-num2");
        const valueDen = document.getElementById("slider-value-den");
        const labels = this.getSliderLabels();
        
        const slidersContainer = document.getElementById("sliders-container");
       if (slidersContainer) {
    slidersContainer.style.pointerEvents = this.showSolution ? "auto" : "none";
    slidersContainer.style.opacity = this.showSolution ? "1" : "0.5";   
}

        
        document.getElementById("slider-label-1").textContent = labels[0];
        document.getElementById("slider-label-2").textContent = labels[1];
        document.getElementById("slider-label-3").textContent = labels[2];
        
        sliderNum1.value = this.sliderValues.num1;
        sliderNum2.value = this.sliderValues.num2;
        sliderDen.value = this.sliderValues.den;

        if (valueNum1) valueNum1.textContent = this.sliderValues.num1;
        if (valueNum2) valueNum2.textContent = this.sliderValues.num2;
        if (valueDen) valueDen.textContent = this.sliderValues.den;
    }

    getAnswerNum() {
        return this.sliderValues.num1 + this.sliderValues.num2;
    }

    setDraggedItem(boxNumber, value, index) {
        const fractionValue = { num: value.num, den: value.den, index: index };
        if (boxNumber === 1) {
            this.draggedItems.box1 = fractionValue;
        } else {
            this.draggedItems.box2 = fractionValue;
        }
        if (this.draggedItems.box1 !== null && this.draggedItems.box2 !== null) {
            this.showSolution = true;
            this.updateSliders();
        }
    }

    clearDraggedItem(boxNumber) {
        if (boxNumber === 1) {
            this.draggedItems.box1 = null;
        } else {
            this.draggedItems.box2 = null;
        }
        this.showSolution = false;
        this.updateSliders();
    }

    hideDragMessage() {
        this.showDragMessage = false;
    }
}

// View - Rendering and UI
class FractionView {
    constructor() {
        this.fractionBoxes = [];
        this.draggingItem = null;
        this.dragOffset = { x: 0, y: 0 };
        this.questionParts = [];
        this.dashOffset = 0;
    }

    drawQuestion(model) {
        fill(50);
        textAlign(LEFT);
        textSize(14);
        textWrap(WORD);
        this.parseQuestionText(model);
        this.drawQuestionWithFractions(model);
    }

    parseQuestionText(model) {
        const parts = [];
        const text = model.getQuestion();
        const fractionRegex = /(\d+)\/(\d+)/g;
        let lastIndex = 0;
        let fractionIndex = 0;
        let match;

        while ((match = fractionRegex.exec(text)) !== null) {
            if (match.index > lastIndex) {
                parts.push({
                    type: "text",
                    content: text.substring(lastIndex, match.index),
                });
            }

            parts.push({
                type: "fraction",
                numerator: parseInt(match[1]),
                denominator: parseInt(match[2]),
                originalText: match[0],
                index: fractionIndex,
                dragging: this.draggingItem === "fraction_" + fractionIndex,
                x: 0,
                y: 0,
                width: 60,
                height: 60,
                isSelected: model.selectedFractions.has(fractionIndex),
            });

            fractionIndex++;
            lastIndex = match.index + match[0].length;
        }

        if (lastIndex < text.length) {
            parts.push({
                type: "text",
                content: text.substring(lastIndex),
            });
        }

        this.questionParts = parts;
        return parts;
    }

    drawQuestionWithFractions(model) {
        let x = 20;
        let y = 30;
        let fractionCounter = 0;

        this.dashOffset = (this.dashOffset + 0.5) % 10;

        for (let part of this.questionParts) {
            if (part.type === "text") {
                const words = part.content.split(" ");
                for (let word of words) {
                    const wordWidth = textWidth(word + " ");
                    if (x + wordWidth > 560) {
                        x = 20;
                        y += 30;
                    }
                    fill(0);
                    noStroke();
                    textAlign(LEFT);
                    text(word + " ", x, y);
                    x += wordWidth;
                }
            } else if (part.type === "fraction") {
                if (x + 60 > 560) {
                    x = 20;
                    y += 40;
                }
                
                part.x = x + 30;
                part.y = y;
                part.width = 60;
                part.height = 60;

                if (part.isSelected) {
                    fill(200, 220, 255);
                    noStroke();
                    rect(x + 10, y - 18, 36, 36);
                } else {
                    fill(200, 220, 255);
                    stroke(100, 150, 255);
                    strokeWeight(1);
                    rect(x + 10, y - 18, 36, 36);
                }

                if (controller && controller.selectedFractionIndex === part.index) {
                    stroke(100, 150, 255);
                    strokeWeight(2);
                    drawingContext.setLineDash([5, 5]);
                    drawingContext.lineDashOffset = this.dashOffset;
                    rect(x + 10, y - 18, 36, 36);
                    drawingContext.setLineDash([]);
                }

                if (fractionCounter === 0) {
                    fill('#28a745');
                } else {
                    fill('#6f42c1');
                }
                noStroke();
                textAlign(CENTER);
                textSize(14);
                text(part.numerator, x + 30, y - 6);
                stroke(0);
                strokeWeight(2);
                line(x + 20, y, x + 40, y);
                noStroke();
                fill('#fd7e14');
                text(part.denominator, x + 30, y + 14);
                x += 65;
                fractionCounter++;
            }
        }
    }

    drawFractionBoxes(model) {
        const box1X = 180, box1Y = 120;
        const box2X = 280, box2Y = 120;

        stroke(100, 150, 255);
        strokeWeight(2);
        fill(model.draggedItems.box1 !== null ? 220 : 255);
        rect(box1X, box1Y, 60, 40);

        if (model.draggedItems.box1 !== null) {
            textSize(16);
            fill(model.draggedItems.box1.index === 0 ? '#28a745' : '#6f42c1');
            noStroke();
            text(model.draggedItems.box1.num, box1X + 20, box1Y + 15);
            stroke(0);
            strokeWeight(2);
            line(box1X + 16, box1Y + 20, box1X + 40, box1Y + 20);
            noStroke();
            fill('#fd7e14');
            text(model.draggedItems.box1.den, box1X + 20, box1Y + 35);
        }

        fill(50);
        textAlign(CENTER);
        textSize(20);
        text("+", box1X + 90, box1Y + 25);

        stroke(100, 150, 255);
        fill(model.draggedItems.box2 !== null ? 220 : 255);
        rect(box2X, box2Y, 60, 40);

        if (model.draggedItems.box2 !== null) {
            textSize(16);
            fill(model.draggedItems.box2.index === 0 ? '#28a745' : '#6f42c1');
            noStroke();
            text(model.draggedItems.box2.num, box2X + 30, box2Y + 15);
            stroke(0);
            strokeWeight(2);
            line(box2X + 16, box2Y + 20, box2X + 40, box2Y + 20);
            noStroke();
            fill('#fd7e14');
            text(model.draggedItems.box2.den, box2X + 30, box2Y + 35);
        }

        if (model.showSolution) {
            text("=", box2X + 80, box2Y + 25);

            stroke(100, 150, 255);
            fill(240);
            rect(box2X + 100, box2Y, 60, 40);

            noStroke();
            fill(0, 0, 0, 60);
            text(model.getAnswerNum(), box2X + 131, box2Y + 16);

            fill(66, 64, 71);
            textSize(16);
            text(model.getAnswerNum(), box2X + 130, box2Y + 15);

            stroke(0);
            strokeWeight(1);
            line(box2X + 120, box2Y + 20, box2X + 145, box2Y + 20);

            noStroke();
            fill(0, 0, 0, 60);
            text(model.sliderValues.den, box2X + 131, box2Y + 36);

            fill('#fd7e14');
            text(model.sliderValues.den, box2X + 130, box2Y + 35);
        }

        if (model.showDragMessage) {
            let time = millis() / 200;
            let bounceOffset = sin(time) * 4;
            const firstFraction = this.questionParts.find(
                (part) => part.type === "fraction" && !part.isSelected
            );
            if (firstFraction) {
                const dragTextX = firstFraction.x;
                const dragTextY = firstFraction.y + 35 + bounceOffset;
                fill(100, 100, 255);
                textSize(14);
                textAlign(CENTER);
                text(" 🡡\n  Drag to place", dragTextX, dragTextY + 30);
                noStroke();
                strokeWeight(2);
            }
        }
    }

    drawSolution(model) {
        if (!model.showSolution) return;

        const startX = 180;
        let x = startX;
        const y = 250;

        fill(0);
        textSize(14);
        textAlign(LEFT);
        text("Solution: ", x, y);
        x += textWidth("Solution: ");

        fill('#28a745');
        textSize(16);
        text(model.sliderValues.num1, x + 15, y - 8);
        stroke(0);
        strokeWeight(2);
        line(x + 8, y, x + 28, y);
        noStroke();
        fill('#fd7e14');
        text(model.sliderValues.den, x + 15, y + 15);
        x += 40;

        fill(0);
        textSize(20);
        textAlign(CENTER);
        text("+", x + 15, y + 5);
        x += 30;

        fill('#6f42c1');
        textSize(16);
        text(model.sliderValues.num2, x + 15, y - 8);
        stroke(0);
        strokeWeight(2);
        line(x + 5, y, x + 25, y);
        noStroke();
        fill('#fd7e14');
        text(model.sliderValues.den, x + 15, y + 15);
        x += 40;

        fill(0);
        textSize(20);
        textAlign(CENTER);
        text("=", x + 15, y + 5);
        x += 30;

        fill(66, 64, 71);
        textSize(16);
        text(model.getAnswerNum(), x + 15, y - 8);
        stroke(0);
        strokeWeight(2);
        line(x + 5, y, x + 25, y);
        noStroke();
        fill('#fd7e14');
        text(model.sliderValues.den, x + 15, y + 15);
        x += 40;

        if (model.getAnswerNum() === model.sliderValues.den) {
            fill(0);
            textSize(14);
            textAlign(LEFT);
            text(" = 1", x + 5, y + 5);
        }
    }

    drawDraggingFraction(model) {
        if (this.draggingItem !== null) {
            console.log("Drawing dragging fraction: " + this.draggingItem);
            let fraction;
            let fractionIndex = -1;
            if (this.draggingItem.startsWith("fraction_")) {
                fractionIndex = parseInt(this.draggingItem.split("_")[1]);
                fraction = this.questionParts.find(
                    (p) => p.type === "fraction" && p.index === fractionIndex
                );
            } else if (this.draggingItem.startsWith("box_")) {
                const boxNumber = parseInt(this.draggingItem.split("_")[1]);
                fraction = boxNumber === 1 ? model.draggedItems.box1 : model.draggedItems.box2;
                fractionIndex = fraction.index;
            }

            if (fraction) {
                push();
                translate(mouseX - this.dragOffset.x, mouseY - this.dragOffset.y);
                fill(200, 220, 255, 150);
                stroke(100, 150, 255);
                strokeWeight(1.5);
                rect(-20, -20, 40, 40, 6);
                fill(fractionIndex === 0 ? '#28a745' : '#6f42c1');
                noStroke();
                textAlign(CENTER);
                textSize(16);
                text(fraction.num || fraction.numerator, 0, -8);
                stroke(0);
                strokeWeight(2);
                line(-15, 0, 15, 0);
                noStroke();
                fill('#fd7e14');
                text(fraction.den || fraction.denominator, 0, 15);
                pop();
            } else {
                console.log("Fraction not found for dragging item");
            }
        }
    }

    getDropBox(x, y) {
        if (x >= 170 && x <= 250 && y >= 110 && y <= 210) {
            return 1;
        }
        if (x >= 270 && x <= 350 && y >= 110 && y <= 210) {
            return 2;
        }
        return null;
    }

    getDraggableItem(x, y) {
        for (let part of this.questionParts) {
            if (
                part.type === "fraction" &&
                x >= part.x - part.width / 2 &&
                x <= part.x + part.width / 2 &&
                y >= part.y - part.height / 2 &&
                y <= part.y + part.height / 2
            ) {
                return { item: "fraction_" + part.index, offsetX: x - part.x, offsetY: y - part.y };
            }
        }
        if (
            model.draggedItems.box1 &&
            x >= 170 && x <= 250 && y >= 110 && y <= 210
        ) {
            return { item: "box_1", offsetX: x - (170 + 30), offsetY: y - (110 + 20) };
        }
        if (
            model.draggedItems.box2 &&
            x >= 270 && x <= 350 && y >= 110 && y <= 210
        ) {
            return { item: "box_2", offsetX: x - (270 + 30), offsetY: y - (110 + 20) };
        }
        return null;
    }

    getOriginalPosition(numerator, denominator) {
        for (let part of this.questionParts) {
            if (
                part.type === "fraction" &&
                part.numerator === numerator &&
                part.denominator === denominator
            ) {
                return { x: part.x, y: part.y };
            }
        }
        return null;
    }

    getBoxAtPosition(x, y) {
        if (x >= 170 && x <= 250 && y >= 110 && y <= 210) {
            return { id: 1, value: model.draggedItems.box1 };
        }
        if (x >= 270 && x <= 350 && y >= 110 && y <= 210) {
            return { id: 2, value: model.draggedItems.box2 };
        }
        return null;
    }
}

// Controller - Handles user interactions
class FractionController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
        this.lastClickTime = 0;
        this.lastClickX = 0;
        this.lastClickY = 0;
        this.doubleClickThreshold = 300;
        this.selectedFractionIndex = null;
        this.startX = 0;
        this.startY = 0;
        this.startTime = 0;
        this.dragThreshold = 10;
        this.tapThresholdTime = 300;
        this.isDragging = false;
        this.setupSliderListeners();
    }

    setupSliderListeners() {
        const sliderNum1 = document.getElementById("slider-num1");
        const sliderNum2 = document.getElementById("slider-num2");
        const sliderDen = document.getElementById("slider-den");
        const valueNum1 = document.getElementById("slider-value-num1");
        const valueNum2 = document.getElementById("slider-value-num2");
        const valueDen = document.getElementById("slider-value-den");

        if (sliderNum1 && sliderNum2 && sliderDen) {
            // Mouse input event listeners
            sliderNum1.addEventListener("input", () => {
                console.log("Slider num1 changed via mouse");
                this.model.updateSliderValue("num1", sliderNum1.value);
                if (valueNum1) valueNum1.textContent = sliderNum1.value;
            });
            sliderNum2.addEventListener("input", () => {
                console.log("Slider num2 changed via mouse");
                this.model.updateSliderValue("num2", sliderNum2.value);
                if (valueNum2) valueNum2.textContent = sliderNum2.value;
            });
            sliderDen.addEventListener("input", () => {
                console.log("Slider den changed via mouse");
                this.model.updateSliderValue("den", sliderDen.value);
                if (valueDen) valueDen.textContent = sliderDen.value;
            });

            // Touch event listeners for sliders
            const handleSliderTouch = (slider, sliderName, valueElement) => {
                let isTouching = false;

                slider.addEventListener("touchstart", (e) => {
                    e.stopPropagation(); // Prevent canvas from consuming this event
                    isTouching = true;
                });

                slider.addEventListener("touchmove", (e) => {
                    if (!isTouching) return;
                    e.stopPropagation();
                    const touch = e.touches[0];
                    const rect = slider.getBoundingClientRect();
                    const touchX = touch.clientX - rect.left;
                    const width = rect.width;
                    const min = parseInt(slider.min);
                    const max = parseInt(slider.max);
                    const value = Math.round(min + (touchX / width) * (max - min));
                    slider.value = Math.max(min, Math.min(max, value));
                    this.model.updateSliderValue(sliderName, slider.value);
                    if (valueElement) valueElement.textContent = slider.value;
                    console.log(`Slider ${sliderName} changed via touch to ${slider.value}`);
                });

                slider.addEventListener("touchend", (e) => {
                    e.stopPropagation();
                    isTouching = false;
                });
            };

            handleSliderTouch(sliderNum1, "num1", valueNum1);
            handleSliderTouch(sliderNum2, "num2", valueNum2);
            handleSliderTouch(sliderDen, "den", valueDen);
        } else {
            console.error("One or more sliders not found in the DOM");
        }
    }

    handleClick(x, y) {
        console.log("Handling click/tap at (" + x + ", " + y + ")");
        const draggable = this.view.getDraggableItem(x, y);
        if (this.selectedFractionIndex !== null) {
            const box = this.view.getBoxAtPosition(x, y);
            if (box && box.value === null) {
                const fraction = this.view.questionParts.find(
                    (p) => p.type === "fraction" && p.index === this.selectedFractionIndex
                );
                if (fraction) {
                    const fractionValue = { num: fraction.numerator, den: fraction.denominator };
                    const otherBox = box.id === 1 ? this.model.draggedItems.box2 : this.model.draggedItems.box1;
                    if (otherBox && otherBox.num === fractionValue.num && otherBox.den === fractionValue.den) {
                        console.log("Duplicate fraction detected in other box, cancelling placement");
                        this.selectedFractionIndex = null;
                        return true;
                    }
                    console.log("Placing fraction " + fraction.numerator + "/" + fraction.denominator + " in box " + box.id);
                    this.model.setDraggedItem(box.id, fractionValue, this.selectedFractionIndex);
                    this.model.selectedFractions.add(this.selectedFractionIndex);
                    this.selectedFractionIndex = null;
                    return true;
                }
            }
        }

        if (draggable && draggable.item.startsWith("fraction_")) {
            const fractionIndex = parseInt(draggable.item.split("_")[1]);
            if (this.selectedFractionIndex === fractionIndex) {
                this.selectedFractionIndex = null;
            } else {
                console.log("Selecting fraction at index " + fractionIndex);
                this.selectedFractionIndex = fractionIndex;
                this.model.hideDragMessage();
            }
            return true;
        } else {
            this.selectedFractionIndex = null;
            return false;
        }
    }

    handleInteractionStart(x, y) {
        console.log("Interaction started at (" + x + ", " + y + ")");
        const currentTime = millis();
        const isDoubleClick = (currentTime - this.lastClickTime < this.doubleClickThreshold) &&
            Math.abs(x - this.lastClickX) < 5 && Math.abs(y - this.lastClickY) < 5;

        this.lastClickTime = currentTime;
        this.lastClickX = x;
        this.lastClickY = y;
        this.startX = x;
        this.startY = y;
        this.startTime = currentTime;
        this.isDragging = false;

        const box = this.view.getBoxAtPosition(x, y);
        if (isDoubleClick && box && box.value !== null) {
            console.log("Double-click/tap detected on box " + box.id + ", clearing it");
            this.model.clearDraggedItem(box.id);
            const fractionIndex = box.value.index;
            this.model.selectedFractions.delete(fractionIndex);
            console.log("After revert, selectedFractions:", Array.from(this.model.selectedFractions));
            this.selectedFractionIndex = null;
            this.view.draggingItem = null;
            return;
        }

        // Prepare for potential dragging
        const draggable = this.view.getDraggableItem(x, y);
        if (draggable) {
            this.view.draggingItem = draggable.item;
            this.view.dragOffset.x = draggable.offsetX;
            this.view.dragOffset.y = draggable.offsetY;
        }

        // Handle click/tap immediately
        this.handleClick(x, y);
    }

    handleInteractionMove(x, y) {
        if (this.view.draggingItem !== null) {
            const distMoved = dist(x, y, this.startX, this.startY);
            if (distMoved > this.dragThreshold) {
                this.isDragging = true;
                this.model.hideDragMessage();
                this.selectedFractionIndex = null;
                mouseX = x;
                mouseY = y;
            }
        }
    }

    handleInteractionEnd(x, y) {
        console.log("Interaction ended at (" + x + ", " + y + ")");
        const duration = millis() - this.startTime;

        if (this.isDragging && this.view.draggingItem !== null) {
            let fraction;
            let fromBox = null;
            let fractionIndex = -1;
            if (this.view.draggingItem.startsWith("fraction_")) {
                fractionIndex = parseInt(this.view.draggingItem.split("_")[1]);
                fraction = this.view.questionParts.find(
                    (p) => p.type === "fraction" && p.index === fractionIndex
                );
                fraction = { num: fraction.numerator, den: fraction.denominator };
            } else if (this.view.draggingItem.startsWith("box_")) {
                fromBox = parseInt(this.view.draggingItem.split("_")[1]);
                fraction = fromBox === 1 ? this.model.draggedItems.box1 : this.model.draggedItems.box2;
                fractionIndex = fraction.index;
            }

            const dropBox = this.view.getDropBox(x, y);
            const originalPos = this.view.getOriginalPosition(fraction.num, fraction.den);

            if (dropBox !== null && fromBox !== dropBox) {
                const otherBox = dropBox === 1 ? this.model.draggedItems.box2 : this.model.draggedItems.box1;
                if (otherBox && otherBox.num === fraction.num && otherBox.den === fraction.den) {
                    console.log("Duplicate fraction detected in other box, cancelling drop");
                    this.view.draggingItem = null;
                    this.isDragging = false;
                    return;
                }

                if (fromBox) {
                    console.log("Clearing box " + fromBox);
                    this.model.clearDraggedItem(fromBox);
                }

                console.log("Setting dragged item to box " + dropBox);
                this.model.setDraggedItem(dropBox, fraction, fractionIndex);
                if (this.view.draggingItem.startsWith("fraction_")) {
                    const fractionIndex = parseInt(this.view.draggingItem.split("_")[1]);
                    this.model.selectedFractions.add(fractionIndex);
                }
            } else if (originalPos && dist(x, y, originalPos.x, originalPos.y) < 30) {
                console.log("Released near original position");
                if (fromBox) {
                    this.model.clearDraggedItem(fromBox);
                    const fractionIndex = this.view.questionParts.findIndex(
                        (p) => p.type === "fraction" &&
                               p.numerator === fraction.num &&
                               p.denominator === fraction.den
                    );
                    this.model.selectedFractions.delete(fractionIndex);
                }
            } else if (fromBox) {
                console.log("Released elsewhere, clearing box");
                this.model.clearDraggedItem(fromBox);
                const fractionIndex = this.view.questionParts.findIndex(
                    (p) => p.type === "fraction" &&
                           p.numerator === fraction.num &&
                           p.denominator === fraction.den
                );
                this.model.selectedFractions.delete(fractionIndex);
            }
        }

        this.view.draggingItem = null;
        this.isDragging = false;
        this.startTime = 0;
    }

    generateNewProblem() {
        this.model.generateNewProblem();
        this.selectedFractionIndex = null;
        this.isDragging = false;
    }
}

// Global variables
let model = null;
let view = null;
let controller = null;
let canvas;

function setup() {
    try {
        canvas = createCanvas(600, 300);
        canvas.parent("sketch-container");
        model = new FractionModel();
        view = new FractionView();
        controller = new FractionController(model, view);

        const tryAnotherButton = document.getElementById("try-another-button");
        if (tryAnotherButton) {
            tryAnotherButton.addEventListener("click", generateNewProblem);
            tryAnotherButton.addEventListener("touchend", (e) => {
                e.preventDefault(); // Prevent any default behavior
                e.stopPropagation(); // Prevent canvas from consuming this event
                console.log("Try Another button tapped");
                generateNewProblem();
            });
        }
    } catch (error) {
        console.error("Error during setup: ", error);
    }
}

function draw() {
    if (!model || !view) {
        console.log("Model or view not initialized in draw");
        return;
    }
    background(250, 250, 255);
    view.drawQuestion(model);
    view.drawFractionBoxes(model);
    view.drawSolution(model);
    view.drawDraggingFraction(model);
}

function mousePressed() {
    if (controller && model && view) {
        controller.handleInteractionStart(mouseX, mouseY);
    }
}

function mouseDragged() {
    if (controller && model && view) {
        controller.handleInteractionMove(mouseX, mouseY);
    }
}

function mouseReleased() {
    if (controller && model && view) {
        controller.handleInteractionEnd(mouseX, mouseY);
    }
}

function touchStarted() {
    if (touches.length > 0 && controller && model && view) {
        const touch = touches[0];
        const x = touch.x;
        const y = touch.y;
        // Check if the touch is within the canvas
        if (x >= 0 && x <= width && y >= 0 && y <= height) {
            controller.handleInteractionStart(x, y);
            return false; // Prevent default behavior only for canvas touches
        }
    }
}

function touchMoved() {
    if (touches.length > 0 && controller && model && view) {
        const touch = touches[0];
        const x = touch.x;
        const y = touch.y;
        // Check if the touch is within the canvas
        if (x >= 0 && x <= width && y >= 0 && y <= height) {
            controller.handleInteractionMove(x, y);
            return false;
        }
    }
}

function touchEnded() {
    if (touches.length === 0 && controller && model && view) {
        // Use the last known position (mouseX, mouseY) updated during touchMoved
        const x = mouseX;
        const y = mouseY;
        // Check if the last position is within the canvas
        if (x >= 0 && x <= width && y >= 0 && y <= height) {
            controller.handleInteractionEnd(x, y);
            return false;
        }
    }
}

function generateNewProblem() {
    if (controller) {
        controller.generateNewProblem();
    }
}