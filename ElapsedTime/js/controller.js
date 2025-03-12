class TimeController {
    constructor(model, view) {
        this.model = model;
        this.view = view;
         console.log("Initializing TimeController with:", {
            model: model,
            view: view
        });
        // Set initial position and question
        this.initializeQuestion();
        
        // Add event listeners
        this.view.addDragEventListeners(
            // Drag handler - updates position and snaps to 5-minute increments
            (position) => {
                const snappedPosition = this.model.snapToIncrement(position);
                this.updatePosition(snappedPosition, false);
            },
            // Drop handler - checks answer with snapped position
            (position) => {
                const snappedPosition = this.model.snapToIncrement(position);
                this.updatePosition(snappedPosition, true);
            }
        );

        // Add new question button listener
        const newQuestionBtn = document.getElementById('newQuestionBtn');
        newQuestionBtn.addEventListener('click', () => {
            if (newQuestionBtn.classList.contains('available')) {
                this.view.clearArcAnimations();
                this.initializeQuestion();
            }
        });
    }

    handleSliderRelease() {
        const position = parseInt(this.slider.value, 10);
        const isCorrect = this.model.isCorrectAnswer(position);
        
        if (isCorrect) {
            const startX = this.model.startTimeInMinutes;
            const endX = this.model.calculateTimeFromPosition(position);
            console.log("Triggering animation with:", startX, endX, isCorrect);

            this.view.triggerArcAnimationIfCorrect(startX, endX, isCorrect);
        }
        console.log("Slider released at position:", this.slider.value);

    }

    initializeQuestion() {
        const question = this.model.generateNewQuestion();
        this.view.updateQuestion(question.startTime, question.duration, this.model);
        this.updatePosition(this.model.getStartPosition(), false);
    }

  

    // updatePosition(position, checkAnswer) {
    //     // Update the view
    //     this.view.updateSliderPosition(position);
        
    //     // Calculate and display the current time
    //     const currentTime = this.model.calculateTimeFromPosition(position);
    //     this.view.updateTimeBubble(currentTime);
        
    //     // Only check answer on drop or click
    //     if (checkAnswer) {
    //         const isCorrect = this.model.isCorrectAnswer(position);
    //         this.view.showResult(isCorrect);
    //     }
    // }
    updatePosition(position, checkAnswer) {
        // Update the view
        this.view.updateSliderPosition(position);
        
        // Update the elapsed time bubble and its connector
        this.view.updateElapsedTime(position, this.model);
        
        // Only check answer on drop or click
        if (checkAnswer) {
            const isCorrect = this.model.isCorrectAnswer(position);
            this.view.showResult(isCorrect);
            
            // If correct, trigger the arc animation and update the bubble to show end time
            if (isCorrect) {
                console.log("correct answer");
                const startMinutes = this.model.startTimeMinutes;
                const endMinutes = this.model.endTimeMinutes;
                // Pass the exact end time to the view
                this.view.triggerArcAnimationIfCorrect(startMinutes, endMinutes, isCorrect);
                // Update the bubble to show the exact end time instead of elapsed time
                this.view.showEndTimeInBubble(this.model.exactEndTime);
            }
        }
    }


    //  updatePosition(position, checkAnswer) {
    //     // Update the view

    //     console.log(position,checkAnswer,'updatePosition checkAnswer');
    //     this.view.updateSliderPosition(position);
        
    //     // We no longer need to update the time bubble as it's hidden
    //     // const currentTime = this.model.calculateTimeFromPosition(position);
    //     // this.view.updateTimeBubble(currentTime);
        
    //     // Update the elapsed time bubble and its connector
    //     this.view.updateElapsedTime(position, this.model);
        
    //     // Only check answer on drop or click
    //     if (checkAnswer) {
    //         const isCorrect = this.model.isCorrectAnswer(position);
    //         this.view.showResult(isCorrect);
    //     }
    // }
} 