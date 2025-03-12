class TimeModel {
    constructor() {
        this.timeConfig = {
            minStartHour: 1,
            maxStartHour: 9,
            minDuration: 30,
            maxDuration: 180,
            minuteStep: 5, // 5-minute increments
            hoursInTimeline: 12,
            minutesPerHour: 60,
            timelineStartHour: 1 // Timeline always starts at 1 PM
        };
        this.generateNewQuestion();
    }

    generateNewQuestion() {
        // Generate random start time between minStartHour and maxStartHour PM
        const startHour = Math.floor(Math.random() * 
            (this.timeConfig.maxStartHour - this.timeConfig.minStartHour + 1)) + 
            this.timeConfig.minStartHour;
        
        // Generate minutes in steps of 5
        const minuteSteps = this.timeConfig.minutesPerHour / this.timeConfig.minuteStep;
        const startMinute = (Math.floor(Math.random() * minuteSteps)) * this.timeConfig.minuteStep;
        
        this.startTime = `${startHour}:${startMinute.toString().padStart(2, '0')} PM`;
        
        // Generate random duration in steps of 5 minutes
        const durationSteps = Math.floor((this.timeConfig.maxDuration - this.timeConfig.minDuration) / 
            this.timeConfig.minuteStep);
        this.durationMinutes = (Math.floor(Math.random() * (durationSteps + 1)) * 
            this.timeConfig.minuteStep) + this.timeConfig.minDuration;
        
        // Convert start time to minutes since timeline start (1 PM)
        const [time, period] = this.startTime.split(' ');
        const [hours, minutes] = time.split(':').map(Number);
        this.startTimeMinutes = (hours - this.timeConfig.timelineStartHour) * this.timeConfig.minutesPerHour + minutes;
        
        // Calculate end time in minutes
        this.endTimeMinutes = this.startTimeMinutes + this.durationMinutes;
        
        // Calculate the exact end time for display
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
        // Convert position (0-1) to minutes since timeline start
        let totalMinutes = position * (this.timeConfig.hoursInTimeline * this.timeConfig.minutesPerHour);
        
        // Round to nearest 5-minute increment
        totalMinutes = Math.round(totalMinutes / this.timeConfig.minuteStep) * this.timeConfig.minuteStep;
        
        // Calculate hours since timeline start (1 PM)
        let hours = Math.floor(totalMinutes / this.timeConfig.minutesPerHour) + this.timeConfig.timelineStartHour;
        const minutes = totalMinutes % this.timeConfig.minutesPerHour;
        let period = 'PM';

        // Handle time conversion
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

    // Helper method to snap position to 5-minute increments
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
            if (hours >= 24) {
                period = 'AM';
                if (adjustedHours > 12) adjustedHours -= 12;
            }
        }
        if (adjustedHours === 0) adjustedHours = 12;

        return `${adjustedHours}:${minutes.toString().padStart(2, '0')} ${period}`;
    }
} 