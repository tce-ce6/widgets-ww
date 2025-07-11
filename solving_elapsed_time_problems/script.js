
        // Global variables
        let model, view, controller;
        let canvas;

        // TimeModel class
        class TimeModel {
            constructor() {
                this.timeConfig = {
                    minStartHour: 1,
                    maxStartHour: 7,
                    minDuration: 30,
                    maxDuration: 180,
                    minuteStep: 5,
                    hoursInTimeline: 12,
                    minutesPerHour: 60,
                    timelineStartHour: 1
                };
            }

            generateNewQuestion() {
                const startHour = Math.floor(Math.random() * 
                    (this.timeConfig.maxStartHour - this.timeConfig.minStartHour + 1)) + 
                    this.timeConfig.minStartHour;
                
                const minuteSteps = this.timeConfig.minutesPerHour / this.timeConfig.minuteStep;
                const startMinute = (Math.floor(Math.random() * minuteSteps)) * this.timeConfig.minuteStep;
                
                this.startTime = `${startHour}:${startMinute.toString().padStart(2, '0')} PM`;
                
                const durationSteps = Math.floor((this.timeConfig.maxDuration - this.timeConfig.minDuration) / 
                    this.timeConfig.minuteStep);
                this.durationMinutes = (Math.floor(Math.random() * (durationSteps + 1)) * 
                    this.timeConfig.minuteStep) + this.timeConfig.minDuration;
                
                const [time, period] = this.startTime.split(' ');
                const [hours, minutes] = time.split(':').map(Number);
                
                this.startTimeMinutes = (hours - this.timeConfig.timelineStartHour) * this.timeConfig.minutesPerHour + minutes;
                this.endTimeMinutes = this.startTimeMinutes + this.durationMinutes;
                
                this.exactEndTime = this.calculateExactEndTime();
                
                return {
                    startTime: this.startTime,
                    duration: this.durationMinutes,
                    endTime: this.exactEndTime
                };
            }

            calculateExactEndTime() {
                const totalMinutes = this.startTimeMinutes + this.durationMinutes;
                const hours = Math.floor(totalMinutes / this.timeConfig.minutesPerHour) + this.timeConfig.timelineStartHour;
                const minutes = totalMinutes % this.timeConfig.minutesPerHour;
                let period = 'PM';
                let adjustedHours = hours;

                if (hours >= 12) {
                    if (hours > 12) adjustedHours = hours - 12;
                    if (hours >= 24) {
                        period = 'AM';
                        if (adjustedHours > 12) adjustedHours -= 12;
                    }
                }
                if (adjustedHours === 0) adjustedHours = 12;

                return `${adjustedHours}:${minutes.toString().padStart(2, '0')} ${period}`;
            }

            calculateTimeFromPosition(position) {
                let totalMinutes = position * (this.timeConfig.hoursInTimeline * this.timeConfig.minutesPerHour);
                totalMinutes = Math.round(totalMinutes / this.timeConfig.minuteStep) * this.timeConfig.minuteStep;
                
                let hours = Math.floor(totalMinutes / this.timeConfig.minutesPerHour) + this.timeConfig.timelineStartHour;
                const minutes = totalMinutes % this.timeConfig.minutesPerHour;
                let period = 'PM';

                if (hours >= 12) {
                    if (hours > 12) hours -= 12;
                    if (hours >= 24) {
                        period = 'AM';
                        if (hours > 12) hours -= 12;
                    }
                }
                if (hours === 0) hours = 12;

                return `${hours}:${minutes.toString().padStart(2, '0')} ${period}`;
            }

            isCorrectAnswer(position) {
                const totalMinutesInTimeline = this.timeConfig.hoursInTimeline * this.timeConfig.minutesPerHour;
                let selectedMinutes = Math.round(position * totalMinutesInTimeline);
                selectedMinutes = Math.round(selectedMinutes / this.timeConfig.minuteStep) * this.timeConfig.minuteStep;
                return selectedMinutes === this.endTimeMinutes;
            }

            getStartPosition() {
                return this.startTimeMinutes / (this.timeConfig.hoursInTimeline * this.timeConfig.minutesPerHour);
            }

            getEndPosition() {
                return this.endTimeMinutes / (this.timeConfig.hoursInTimeline * this.timeConfig.minutesPerHour);
            }

            snapToIncrement(position) {
                const totalMinutesInTimeline = this.timeConfig.hoursInTimeline * this.timeConfig.minutesPerHour;
                let minutes = position * totalMinutesInTimeline;
                minutes = Math.round(minutes / this.timeConfig.minuteStep) * this.timeConfig.minuteStep;
                return minutes / totalMinutesInTimeline;
            }

            getTimeForTick(tickIndex, totalTicks) {
                const minutesPerTick = (this.timeConfig.hoursInTimeline * this.timeConfig.minutesPerHour) / totalTicks;
                const totalMinutes = tickIndex * minutesPerTick;
                const hours = Math.floor(totalMinutes / this.timeConfig.minutesPerHour) + this.timeConfig.timelineStartHour;
                const minutes = Math.round(totalMinutes % this.timeConfig.minutesPerHour);
                let period = 'PM';
                let adjustedHours = hours;

                if (hours >= 12) {
                    if (hours > 12) adjustedHours = hours - 12;
                    if (hours >= 12) {
                        period = 'AM';
                        if (adjustedHours > 12) adjustedHours -= 12;
                    }
                }
                if (adjustedHours === 0) adjustedHours = 12;

                return `${adjustedHours}:${minutes.toString().padStart(2, '0')} ${period}`;
            }
        }

        // TimeView class
        class TimeView {
            constructor() {
                this.timelineY = 200;
                this.timelineStartX = 50;
                this.timelineEndX = 750;
                this.timelineLength = this.timelineEndX - this.timelineStartX;
                this.sliderPosition = 0;
                this.isDragging = false;
                this.onCorrectAnswer = false;
                this.arcs = [];
                this.arcAnimationTime = 0;
                this.showingEndTime = false;
                this.resultMessage = 'Drag the slider to find the end time';
                this.resultClass = 'trying';
            }

            setup() {
                // No font loading, use default
            }

            draw() {
                background(245);
                
                // Draw question
                this.drawQuestion();
                
                // Draw timeline
                this.drawTimeline();
                
                // Draw tick marks and labels
                this.drawTickMarks();
                
                // Draw time bubbles
                this.drawTimeBubbles();
                
                // Draw slider handle
                this.drawSliderHandle();
                
                // Draw arcs if any
                this.drawArcs();
                
                // Draw result
                this.drawResult();
            }

            drawQuestion() {
                if (!model) return;
                fill(0);
                textAlign(CENTER, CENTER);
                textSize(15);
                text(`Sam spent ${model.durationMinutes} minutes working.`, 400, 50);
                text(`Started at ${model.startTime}, when did he finish?`, 400, 70);
            }

            drawTimeline() {
                stroke(0);
                strokeWeight(1);
                line(this.timelineStartX, this.timelineY, this.timelineEndX, this.timelineY);
            }

            drawTickMarks() {
                const totalTicks = 144; // 12 hours * 12 ticks per hour
                
                for (let i = 0; i <= totalTicks; i++) {
                    const x = this.timelineStartX + (i / totalTicks) * this.timelineLength;
                    let tickHeight = 5;
                    
                    // Hour marks
                    if (i % 12 === 0) {
                        tickHeight = 12;
                        // Draw hour labels
                        fill(75); // Lightened from 0 (black) to 75 (dark gray)
                        textAlign(CENTER, TOP);
                        textSize(10); // Increased from 9 for better rendering
                        const timeLabel = model.getTimeForTick(i, totalTicks);
                        const hourLabel = timeLabel.split(':')[0] + ':00 ' + timeLabel.split(' ')[1];
                        text(hourLabel, x, this.timelineY + 22); // Moved down from 20 to avoid overlap
                    }
                    // 15-minute marks
                    else if (i % 3 === 0) {
                        tickHeight = 8;
                    }
                    
                    // Draw tick mark
                    stroke(0);
                    strokeWeight(1);
                    line(x, this.timelineY - tickHeight/2, x, this.timelineY + tickHeight/2);
                }
            }

            drawTimeBubbles() {
                if (!model) return;
                
                // Start time bubble
                const startPos = model.getStartPosition();
                const startX = this.timelineStartX + startPos * this.timelineLength;
                
                // Draw connection line
                stroke(136, 136, 136);
                strokeWeight(2);
                line(startX, this.timelineY - 50, startX, this.timelineY - 10);
                
                // Draw start time bubble
                fill(236, 74, 46);
                noStroke();
                rect(startX - 40, this.timelineY - 80, 80, 25, 15);
                
                fill(255);
                textAlign(CENTER, CENTER);
                textSize(11);
                text(model.startTime, startX, this.timelineY - 67);
                
                // Elapsed time bubble
                const currentX = this.timelineStartX + this.sliderPosition * this.timelineLength;
                
                // Draw connection line
                stroke(136, 136, 136);
                strokeWeight(2);
                line(currentX, this.timelineY - 30, currentX, this.timelineY - 10);
                
                // Calculate elapsed time
                const elapsedMinutes = this.calculateElapsedTime();
                
                // Draw elapsed time bubble
                fill(63, 241, 101);
                noStroke();
                rect(currentX - 30, this.timelineY - 50, 60, 20, 12);
                
                fill(0);
                textAlign(CENTER, CENTER);
                textSize(9);
                if (this.showingEndTime) {
                    text(model.exactEndTime, currentX, this.timelineY - 40);
                } else {
                    text(`+${elapsedMinutes}m`, currentX, this.timelineY - 40);
                }
            }

            calculateElapsedTime() {
                if (!model) return 0;
                
                const startPosition = model.getStartPosition();
                const totalMinutesInTimeline = model.timeConfig.hoursInTimeline * model.timeConfig.minutesPerHour;
                
                let currentMinutes = Math.round(this.sliderPosition * totalMinutesInTimeline);
                let startMinutes = Math.round(startPosition * totalMinutesInTimeline);
                let elapsedMinutes = currentMinutes - startMinutes;
                
                return Math.max(0, elapsedMinutes);
            }

            drawSliderHandle() {
                const x = this.timelineStartX + this.sliderPosition * this.timelineLength;
                
                // Handle
                fill(63, 241, 101);
                noStroke();
                circle(x, this.timelineY, 22);
                
                // Add shadow effect
                fill(0, 0, 0, 50);
                circle(x + 1, this.timelineY + 1, 22);
                fill(63, 241, 101);
                circle(x, this.timelineY, 22);
            }

            drawArcs() {
                if (this.arcs.length === 0) return;
                
                this.arcs.forEach((arc, index) => {
                    if (millis() > arc.startTime) {
                        const elapsed = millis() - arc.startTime;
                        const progress = Math.min(elapsed / 500, 1); // 500ms animation
                        
                        // Calculate positions
                        const startX = this.timelineStartX + arc.startPos * this.timelineLength;
                        const endX = this.timelineStartX + arc.endPos * this.timelineLength;
                        const width = endX - startX;
                        const centerX = startX + width / 2;
                        const height = 30 + index * 20;
                        
                        // Draw arc
                        stroke(arc.color);
                        strokeWeight(4);
                        fill(255, 255, 255, 0);
                        
                        // Animate arc appearance
                        const alpha = progress * 255;
                        stroke(red(arc.color), green(arc.color), blue(arc.color), alpha);
                        
                        // Draw arc as bezier curve
                        noFill();
                        bezier(startX, this.timelineY - 10, 
                               startX, this.timelineY - height,
                               endX, this.timelineY - height,
                               endX, this.timelineY - 10);
                        
                        // Draw label
                        if (progress > 0.5) {
                            fill(0, 0, 0, (progress - 0.5) * 2 * 255);
                            noStroke();
                            rect(centerX - 25, this.timelineY - height - 20, 50, 20, 10);
                            
                            fill(255, 255, 255, (progress - 0.5) * 2 * 255);
                            textAlign(CENTER, CENTER);
                            textSize(9);
                            text(`+${arc.duration}m`, centerX, this.timelineY - height - 10);
                        }
                    }
                });
            }

            drawResult() {
                fill(this.resultClass === 'correct' ? color(76, 175, 80) : color(102, 102, 102));
                textAlign(CENTER, CENTER);
                textSize(11);
                if (this.resultClass === 'correct') {
                    push();
                    translate(400, 310);
                    scale(1 + 0.1 * sin(millis() / 200));
                    text(this.resultMessage, 0, 0);
                    pop();
                } else {
                    text(this.resultMessage, 400, 310);
                }
            }

            updateQuestion(startTime, duration) {
                this.resultMessage = 'Drag the slider to find the end time';
                this.resultClass = 'trying';
                this.clearArcs();
                this.showingEndTime = false;
            }

            showResult(message, className) {
                this.resultMessage = message;
                this.resultClass = className;
            }

            updateSliderPosition(position) {
                this.sliderPosition = position;
            }

            isMouseOverSlider() {
                const sliderX = this.timelineStartX + this.sliderPosition * this.timelineLength;
                const distance = dist(mouseX, mouseY, sliderX, this.timelineY);
                return distance <= 15;
            }

            getPositionFromMouse() {
                const x = constrain(mouseX, this.timelineStartX, this.timelineEndX);
                return (x - this.timelineStartX) / this.timelineLength;
            }

            triggerArcAnimation(startMinutes, endMinutes) {
                this.onCorrectAnswer = true;
                this.showingEndTime = true;
                
                const totalDuration = endMinutes - startMinutes;
                const segments = this.calculateTimeSegments(totalDuration);
                
                this.arcs = [];
                let currentStartMinutes = startMinutes;
                const totalMinutesInTimeline = 12 * 60;
                
                const colors = [
                    color(255, 87, 34),
                    color(33, 150, 243),
                    color(76, 175, 80),
                    color(156, 39, 176),
                    color(255, 193, 7)
                ];
                
                segments.forEach((segment, index) => {
                    const segmentEndMinutes = currentStartMinutes + segment;
                    const startPos = currentStartMinutes / totalMinutesInTimeline;
                    const endPos = segmentEndMinutes / totalMinutesInTimeline;
                    
                    this.arcs.push({
                        startPos: startPos,
                        endPos: endPos,
                        duration: segment,
                        color: colors[index % colors.length],
                        startTime: millis() + index * 500
                    });
                    
                    currentStartMinutes = segmentEndMinutes;
                });
            }

            calculateTimeSegments(totalMinutes) {
                const segments = [];
                
                if (totalMinutes <= 60) {
                    segments.push(totalMinutes);
                    return segments;
                }
                
                let remaining = totalMinutes;
                
                while (remaining >= 60) {
                    segments.push(60);
                    remaining -= 60;
                }
                
                if (remaining > 0) {
                    segments.push(remaining);
                }
                
                return segments;
            }

            clearArcs() {
                this.arcs = [];
                this.onCorrectAnswer = false;
            }
        }

        // TimeController class
        class TimeController {
            constructor(model, view) {
                console.log('TimeController constructor - model:', model, 'view:', view);
                this.model = model;
                this.view = view;
                if (!this.view || typeof this.view.updateSliderPosition !== 'function') {
                    console.error('View is not properly initialized or missing updateSliderPosition');
                    return;
                }
                this.initializeQuestion();
                this.setupEventListeners();
            }

            initializeQuestion() {
                console.log('Initializing question');
                const question = this.model.generateNewQuestion();
                this.view.updateQuestion(question.startTime, question.duration);
                this.updatePosition(this.model.getStartPosition(), false);
            }

            updatePosition(position, checkAnswer) {
                if (!this.view || typeof this.view.updateSliderPosition !== 'function') {
                    console.error('Cannot update position: view is not initialized or missing updateSliderPosition');
                    return;
                }
                this.view.updateSliderPosition(position);
                
                if (checkAnswer) {
                    const isCorrect = this.model.isCorrectAnswer(position);
                    
                    if (isCorrect) {
                        this.view.showResult("Correct! You found the exact time!", 'correct');
                        const startMinutes = this.model.startTimeMinutes;
                        const endMinutes = this.model.endTimeMinutes;
                        this.view.triggerArcAnimation(startMinutes, endMinutes);
                    } else {
                        this.view.showResult('Keep trying to find the end time', 'trying');
                    }
                }
            }

            setupEventListeners() {
                const newQuestionBtn = document.getElementById('newQuestionBtn');
                newQuestionBtn.addEventListener('click', () => {
                    console.log('New question button clicked');
                    this.view.clearArcs();
                    this.initializeQuestion();
                });
            }

            handleMousePressed() {
                if (!this.view) {
                    console.error('Cannot handle mouse pressed: view is not initialized');
                    return;
                }
                if (this.view.onCorrectAnswer) return;
                
                if (this.view.isMouseOverSlider()) {
                    this.view.isDragging = true;
                    return;
                }
                
                // Click on timeline
                if (mouseY > this.view.timelineY - 20 && mouseY < this.view.timelineY + 20 &&
                    mouseX > this.view.timelineStartX && mouseX < this.view.timelineEndX) {
                    const position = this.view.getPositionFromMouse();
                    const snappedPosition = this.model.snapToIncrement(position);
                    this.updatePosition(snappedPosition, true);
                }
            }

            handleMouseDragged() {
                if (!this.view) {
                    console.error('Cannot handle mouse dragged: view is not initialized');
                    return;
                }
                if (this.view.isDragging && !this.view.onCorrectAnswer) {
                    const position = this.view.getPositionFromMouse();
                    const snappedPosition = this.model.snapToIncrement(position);
                    this.updatePosition(snappedPosition, false);
                }
            }

            handleMouseReleased() {
                if (!this.view) {
                    console.error('Cannot handle mouse released: view is not initialized');
                    return;
                }
                if (this.view.isDragging && !this.view.onCorrectAnswer) {
                    this.view.isDragging = false;
                    const position = this.view.getPositionFromMouse();
                    const snappedPosition = this.model.snapToIncrement(position);
                    this.updatePosition(snappedPosition, true);
                }
            }
        }

        // P5.js setup and draw functions
        function setup() {
            console.log('Starting setup');
            canvas = createCanvas(800, 400);
            pixelDensity(1); // Optimize for high-DPI displays
            canvas.parent('p5-container');
            
            // Initialize MVC components
            console.log('Creating model');
            model = new TimeModel();
            console.log('Creating view');
            view = new TimeView();
            console.log('Creating controller');
            controller = new TimeController(model, view);
            console.log('Controller created:', controller);
            
            if (view && typeof view.setup === 'function') {
                view.setup();
            } else {
                console.error('View is not initialized or missing setup method');
            }
            console.log('Setup complete');
        }

        function draw() {
            if (view && typeof view.draw === 'function') {
                view.draw();
            } else {
                console.error('View is not initialized or missing draw method');
            }
        }

        function mousePressed() {
            if (controller && typeof controller.handleMousePressed === 'function') {
                controller.handleMousePressed();
            } else {
                console.error('Controller is not initialized or missing handleMousePressed');
            }
        }

        function mouseDragged() {
            if (controller && typeof controller.handleMouseDragged === 'function') {
                controller.handleMouseDragged();
            } else {
                console.error('Controller is not initialized or missing handleMouseDragged');
            }
        }

        function mouseReleased() {
            if (controller && typeof controller.handleMouseReleased === 'function') {
                controller.handleMouseReleased();
            } else {
                console.error('Controller is not initialized or missing handleMouseReleased');
            }
        }

        // Touch support for mobile
        function touchStarted() {
            if (controller && typeof controller.handleMousePressed === 'function') {
                controller.handleMousePressed();
            } else {
                console.error('Controller is not initialized or missing handleMousePressed');
            }
            return false;
        }

        function touchMoved() {
            if (controller && typeof controller.handleMouseDragged === 'function') {
                controller.handleMouseDragged();
            } else {
                console.error('Controller is not initialized or missing handleMouseDragged');
            }
            return false;
        }

        function touchEnded() {
            if (controller && typeof controller.handleMouseReleased === 'function') {
                controller.handleMouseReleased();
            } else {
                console.error('Controller is not initialized or missing handleMouseReleased');
            }
            return false;
        }
