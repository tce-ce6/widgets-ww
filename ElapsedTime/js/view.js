class TimeView {
    constructor() {
        this.timeline = document.querySelector('.timeline');
        this.sliderHandle = document.getElementById('sliderHandle');
        this.timeBubble = document.getElementById('timeBubble');
        this.tickMarks = document.getElementById('tickMarks');
        this.timeLabels = document.getElementById('timeLabels');
        this.result = document.getElementById('result');
        this.durationSpan = document.getElementById('duration');
        this.startTimeSpan = document.getElementById('startTime');
        this.newQuestionBtn = document.getElementById('newQuestionBtn');
        
        // Hide the original time bubble above the slider
        this.timeBubble.style.display = 'none';
        
        // Create new elements for start time bubble and elapsed time bubble
        this.startTimeBubble = document.createElement('div');
        this.startTimeBubble.id = 'startTimeBubble';
        this.startTimeBubble.className = 'start-time-bubble';
        
        this.elapsedTimeBubble = document.createElement('div');
        this.elapsedTimeBubble.id = 'elapsedTimeBubble';
        this.elapsedTimeBubble.className = 'elapsed-time-bubble';
        
        // Create connection lines
        this.startTimeConnector = document.createElement('div');
        this.startTimeConnector.id = 'startTimeConnector';
        this.startTimeConnector.className = 'time-connector';
        
        this.elapsedTimeConnector = document.createElement('div');
        this.elapsedTimeConnector.id = 'elapsedTimeConnector';
        this.elapsedTimeConnector.className = 'time-connector';
        
        // Add these elements to the timeline container
        const timelineContainer = document.querySelector('.timeline-container');
        timelineContainer.appendChild(this.startTimeBubble);
        timelineContainer.appendChild(this.elapsedTimeBubble);
        timelineContainer.appendChild(this.startTimeConnector);
        timelineContainer.appendChild(this.elapsedTimeConnector);
        
        // Add the CSS for these new elements
        this.addSvgContainer();
        this.addCustomStyles();
    }
    
    addCustomStyles() {
        const styleElement = document.createElement('style');
        styleElement.textContent = `
            .start-time-bubble {
                position: absolute;
                background-color:rgb(236, 74, 46);
                color: white;
                padding: 5px 10px;
                border-radius: 15px;
                transform: translateX(-50%);
                top: 80px;  /* Changed from 50px to 20px */
                font-size: 14px;
                white-space: nowrap;
                z-index: 10;
            }
            
            .elapsed-time-bubble {
                position: absolute;
                background-color:rgb(63, 241, 101);
                color: black;
                padding: 3px 8px;
                border-radius: 12px;
                transform: translateX(-50%);
                top: 60px;  /* This is already at 10px */
                font-size: 12px;
                white-space: nowrap;
                z-index: 10;
            }
            
            .time-connector {
                position: absolute;
                width: 2px;
                background-color: #888;
                transform: translateX(-50%);
                z-index: 5;
            }
            
            /* Adjust slider handle to be more visible without the bubble */
            .slider-handle {
                width: 22px;
                height: 22px;
                top: -10px;
                z-index: 15;
                box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            }
        `;
        document.head.appendChild(styleElement);
    }

    setupTimeline(model) {
        // Clear existing marks and labels
        this.tickMarks.innerHTML = '';
        this.timeLabels.innerHTML = '';
        
        // Create tick marks for every 5 minutes (144 ticks for 12 hours)
        const totalTicks = 144; // 12 hours * 12 ticks per hour (5-minute intervals)
        
        for (let i = 0; i <= totalTicks; i++) {
            // Create tick mark
            const tick = document.createElement('div');
            tick.className = 'tick';
            
            // Every hour (12 ticks)
            if (i % 12 === 0) {
                tick.style.height = '12px';
                // Add hour label
                const label = document.createElement('div');
                label.className = 'time-label';
                label.textContent = model.getTimeForTick(i, totalTicks).split(':')[0] + ':00 ' + 
                    model.getTimeForTick(i, totalTicks).split(' ')[1];
                label.style.left = `${(i / totalTicks) * 100}%`;
                this.timeLabels.appendChild(label);
            }
            // Every 15 minutes (3 ticks)
            else if (i % 3 === 0) {
                tick.style.height = '8px';
            }
            // 5-minute ticks
            else {
                tick.style.height = '5px';
            }
            
            tick.style.left = `${(i / totalTicks) * 100}%`;
            this.tickMarks.appendChild(tick);
        }
    }

    updateQuestion(startTime, duration, model) {
        this.durationSpan.textContent = duration;
        this.startTimeSpan.textContent = startTime;
        this.result.textContent = 'Drag the slider to find the end time';
        this.result.className = 'trying';
        this.newQuestionBtn.classList.remove('available');
        this.setupTimeline(model);
        
        // Update the start time bubble position and content
        const startPosition = model.getStartPosition();
        const percentage = startPosition * 100;
        this.startTimeBubble.style.left = `${percentage}%`;
        this.startTimeBubble.textContent = startTime;
        
        // Update the connection line for start time
        this.startTimeConnector.style.left = `${percentage}%`;
        this.startTimeConnector.style.height = '80px'; // Match bubble top position
        this.startTimeConnector.style.top = '0px';
        
        // Initialize elapsed time bubble at the start position
        this.updateElapsedTime(startPosition, model);
    }

    updateSliderPosition(position) {
        const percentage = position * 100;
        this.sliderHandle.style.left = `${percentage}%`;
    }

    // Modified to update the elapsed time bubble and its connector
    updateElapsedTime(position, model) {
        // Calculate elapsed minutes based on position
        const startPosition = model.getStartPosition();
        const totalMinutesInTimeline = model.timeConfig.hoursInTimeline * model.timeConfig.minutesPerHour;
        
        // Calculate elapsed time in minutes
        let currentMinutes = Math.round(position * totalMinutesInTimeline);
        let startMinutes = Math.round(startPosition * totalMinutesInTimeline);
        let elapsedMinutes = currentMinutes - startMinutes;
        
        // Ensure we always have positive elapsed time
        elapsedMinutes = Math.max(0, elapsedMinutes);
        
        // Format elapsed time - minutes only
        const elapsedTimeText = `+${elapsedMinutes}m`;
        
        // Position the elapsed time bubble below the slider
        const percentage = position * 100;
        this.elapsedTimeBubble.style.left = `${percentage}%`;
        this.elapsedTimeBubble.textContent = elapsedTimeText;
        
        // Update the connection line for elapsed time
        this.elapsedTimeConnector.style.left = `${percentage}%`;
        this.elapsedTimeConnector.style.height = '60px'; // Match bubble top position
        this.elapsedTimeConnector.style.top = '0px';   
    }

    showResult(isCorrect) {
        if (isCorrect) {
            this.result.textContent = "Correct! You found the exact time!";
            this.result.className = 'correct-answer';
            this.newQuestionBtn.classList.add('available');
        } else {
            this.result.textContent = 'Keep trying to find the exact end time';
            this.result.className = 'trying';
            this.newQuestionBtn.classList.remove('available');
        }
    }

    addDragEventListeners(onDrag, onDrop) {
        let isDragging = false;
        let currentPosition = 0;
        
        const getPosition = (e) => {
            const rect = this.timeline.getBoundingClientRect();
            let position = (e.clientX - rect.left) / rect.width;
            position = Math.max(0, Math.min(1, position));
            return position;
        };

        const handleDrag = (e) => {
            currentPosition = getPosition(e);
            onDrag(currentPosition);
        };

        const handleDrop = () => {
            if (isDragging) {
                isDragging = false;
                document.body.style.cursor = 'default';
                onDrop(currentPosition);
            }
        };

        this.sliderHandle.addEventListener('mousedown', () => {
            isDragging = true;
            document.body.style.cursor = 'grabbing';
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                handleDrag(e);
                e.preventDefault();
            }
        });

        document.addEventListener('mouseup', handleDrop);

        // Allow clicking on timeline
        this.timeline.addEventListener('click', (e) => {
            currentPosition = getPosition(e);
            onDrag(currentPosition);
            onDrop(currentPosition);
        });
    }


    addSvgContainer() {
        // Create SVG container for arcs
        const container = document.querySelector('.timeline-container');
        this.svgContainer = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        this.svgContainer.setAttribute('class', 'time-arcs');
        this.svgContainer.setAttribute('width', '100%');
        this.svgContainer.setAttribute('height', '100');
        this.svgContainer.style.position = 'absolute';
        this.svgContainer.style.top = '0';
        this.svgContainer.style.left = '0';
        this.svgContainer.style.pointerEvents = 'none'; // Prevent interference with timeline
        container.appendChild(this.svgContainer);
        
        // Add styles for arc animations
        const styleElement = document.createElement('style');
        styleElement.textContent += `
            .time-arc {
                fill: none;
                stroke-linecap: round;
                opacity: 0;
                transform-origin: center;
            }
            
            @keyframes arcAppear {
                0% {
                    opacity: 0;
                    stroke-dashoffset: 500;
                }
                100% {
                    opacity: 0.7;
                    stroke-dashoffset: 0;
                }
            }
            
            .arc-label {
                font-size: 12px;
                font-weight: bold;
                fill: #333;
                text-anchor: middle;
                opacity: 0;
            }
            
            @keyframes labelAppear {
                0% {
                    opacity: 0;
                    transform: translateY(10px);
                }
                100% {
                    opacity: 1;
                    transform: translateY(0);
                }
            }
        `;
        document.head.appendChild(styleElement);
    }
    // Add this method to TimeView
    triggerArcAnimationIfCorrect(startMinutes, endMinutes, isCorrect) {
        console.log("Trigger arc animation called:", startMinutes, endMinutes, isCorrect);
        
        if (!isCorrect) return;
        
        // Clear any previous animations
        this.clearArcAnimations();
        
        // Calculate total duration in minutes
        const totalDuration = endMinutes - startMinutes;
        console.log("Total duration:", totalDuration);
        
        // Create a container for the animation if it doesn't exist
        const container = document.querySelector('.timeline-container');
        const animationContainer = document.createElement('div');
        animationContainer.className = 'arc-animation-container';
        animationContainer.style.position = 'absolute';
        animationContainer.style.top = '0';
        animationContainer.style.left = '0';
        animationContainer.style.width = '100%';
        animationContainer.style.height = '100px';
        animationContainer.style.pointerEvents = 'none';
        animationContainer.style.zIndex = '10';
        container.appendChild(animationContainer);
        
        // Add necessary styles
        this.addArcAnimationStyles();
        
        // Break down the duration into segments
        const segments = this.calculateTimeSegments(totalDuration);
        console.log("Time segments:", segments);
        
        // Create each arc with its own animation
        let currentStartMinutes = startMinutes;
        const totalMinutesInTimeline = 12 * 60; // 12 hours
        
        segments.forEach((segment, index) => {
            const segmentEndMinutes = currentStartMinutes + segment;
            
            // Calculate positions
            const startPos = (currentStartMinutes / totalMinutesInTimeline) * 100; // as percentage
            const endPos = (segmentEndMinutes / totalMinutesInTimeline) * 100; // as percentage
            
            // Create the arc
            setTimeout(() => {
                this.createArc(animationContainer, startPos, endPos, segment, index);
            }, index * 500); // Stagger the animations
            
            currentStartMinutes = segmentEndMinutes;
        });
    }


    showEndTimeInBubble(endTime) {
        // Update the elapsed time bubble to show the end time instead of elapsed minutes
        this.elapsedTimeBubble.textContent = endTime;
        // Optionally change the style to highlight that it's the end time
        this.elapsedTimeBubble.style.backgroundColor = rgb(63, 241, 101); // A slightly different green
        this.elapsedTimeBubble.style.fontWeight = 'bold';
    }
    
    // Helper to add required styles
    addArcAnimationStyles() {
        // Check if styles are already added
        if (document.getElementById('arc-animation-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'arc-animation-styles';
        style.textContent = `
            .time-arc {
                position: absolute;
                border-top: 5px solid;
                border-radius: 50%;
                opacity: 0;
                transform-origin: center bottom;
                z-index: 20;
            }
            
            .arc-label {
                position: absolute;
                background-color: #fff;
                border: 1px solid #ccc;
                border-radius: 10px;
                padding: 3px 8px;
                font-size: 12px;
                font-weight: bold;
                text-align: center;
                transform: translateX(-50%);
                opacity: 0;
                z-index: 21;
            }
            
            @keyframes arcFadeIn {
                0% { opacity: 0; }
                100% { opacity: 1; }
            }
            
            @keyframes labelFadeIn {
                0% { 
                    opacity: 0;
                    transform: translate(-50%, 10px);
                }
                100% { 
                    opacity: 1;
                    transform: translate(-50%, -12px);
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Clean up previous animations
    clearArcAnimations() {
        const container = document.querySelector('.arc-animation-container');
        if (container) {
            container.remove();
        }
    }
    
    // Break down time into logical segments
    calculateTimeSegments(totalMinutes) {
        const segments = [];
        
        // Logic as requested: If 60 min or less, one segment
        if (totalMinutes <= 60) {
            segments.push(totalMinutes);
            return segments;
        }
        
        // For durations > 60, break into hour chunks first
        let remaining = totalMinutes;
        
        while (remaining >= 60) {
            segments.push(60);
            remaining -= 60;
        }
        
        // Add remaining minutes if any
        if (remaining > 0) {
            segments.push(remaining);
        }
        
        return segments;
    }
    
    // Create a single arc
    createArc(container, startPercent, endPercent, durationMinutes, index) {
        // Get timeline width for calculations
        const timelineWidth = document.querySelector('.timeline').offsetWidth;
        
        // Calculate positions
        const startX = (startPercent / 100) * timelineWidth;
        const endX = (endPercent / 100) * timelineWidth;
        const width = endX - startX;
        const midX = startX + width / 2;
        
        // Arc height increases for each segment
        const arcHeight = 20 + (index * 15);
        
        // Create the arc element
        const arc = document.createElement('div');
        arc.className = 'time-arc';
        
        // Set arc position and size
        arc.style.left = `${startX}px`;
        arc.style.width = `${width}px`;
        arc.style.height = `${arcHeight * 2}px`;
        arc.style.top = `-${arcHeight}px`;
        
        // Set color based on index
        const colors = ['#FF5722', '#2196F3', '#4CAF50', '#9C27B0', '#FFC107'];
        arc.style.borderColor = colors[index % colors.length];
        
        // Add animation
        arc.style.animation = `arcFadeIn 0.5s ease-out ${index * 0.1}s forwards`;
        
        // Add the arc to the container
        container.appendChild(arc);
        
        // Create and add label
        const label = document.createElement('div');
        label.className = 'arc-label';
        label.textContent = `+${durationMinutes}m`;
        label.style.left = `${midX}px`;
        label.style.top = `-${arcHeight + 10}px`;
        label.style.animation = `labelFadeIn 0.5s ease-out ${index * 0.1 + 0.2}s forwards`;
        
        container.appendChild(label);
    }
}
// Controller class - modified to remove timeBubble update since it's no longer visible
// class TimeController {
//     constructor(model, view) {
//         this.model = model;
//         this.view = view;
//          console.log("Initializing TimeController with:", {
//             model: model,
//             view: view
//         });
//         // Set initial position and question
//         this.initializeQuestion();
        
//         // Add event listeners
//         this.view.addDragEventListeners(
//             // Drag handler - updates position and snaps to 5-minute increments
//             (position) => {
//                 const snappedPosition = this.model.snapToIncrement(position);
//                 this.updatePosition(snappedPosition, false);
//             },
//             // Drop handler - checks answer with snapped position
//             (position) => {
//                 const snappedPosition = this.model.snapToIncrement(position);
//                 this.updatePosition(snappedPosition, true);
//             }
//         );

//         // Add new question button listener
//         const newQuestionBtn = document.getElementById('newQuestionBtn');
//         newQuestionBtn.addEventListener('click', () => {
//             if (newQuestionBtn.classList.contains('available')) {
//                 this.initializeQuestion();
//             }
//         });
//     }

    

//     initializeQuestion() {
//         const question = this.model.generateNewQuestion();
//         this.view.updateQuestion(question.startTime, question.duration, this.model);
//         this.updatePosition(this.model.getStartPosition(), false);
//     }

//     updatePosition(position, checkAnswer) {
//         // Update the view

//         console.log(position,checkAnswer,'updatePosition checkAnswer');
//         this.view.updateSliderPosition(position);
        
//         // We no longer need to update the time bubble as it's hidden
//         // const currentTime = this.model.calculateTimeFromPosition(position);
//         // this.view.updateTimeBubble(currentTime);
        
//         // Update the elapsed time bubble and its connector
//         this.view.updateElapsedTime(position, this.model);
        
//         // Only check answer on drop or click
//         if (checkAnswer) {
//             const isCorrect = this.model.isCorrectAnswer(position);
//             this.view.showResult(isCorrect);
//         }
//     }
// }
