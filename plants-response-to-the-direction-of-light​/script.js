// script.js
 
/**
 * LottieSVGAnimation Class
 * Manages loading and controlling a Lottie animation within an SVG <foreignObject>.
 */
class LottieSVGAnimation {
    // Set loop and autoplay defaults to false for controlled segment playback.
    constructor(containerId, jsonPath, loop = false, autoplay = false) {
        this.containerId = containerId;
        this.jsonPath = jsonPath;
        this.loop = loop;
        this.autoplay = autoplay;
        this.animation = null;
    }
 
    init() {
        const container = document.getElementById(this.containerId);
 
        if (!container) {
            console.error(`Container with ID "${this.containerId}" not found.`);
            return;
        }
 
        // Create a <foreignObject> to host the Lottie animation inside the SVG group
        const foreignObject = document.createElementNS("http://www.w3.org/2000/svg", "foreignObject");
        // Ensure width/height are either dynamic ("100%") or match your SVG/Group dimensions
          foreignObject.setAttribute("width", "730");
        foreignObject.setAttribute("height", "730");
        foreignObject.setAttribute("transform", "translate(530, 332)");
       
        // Inner div for animation
        const div = document.createElement("div");
        div.setAttribute("id", `${this.containerId}-lottie`);
        div.style.width = "100%";
        div.style.height = "100%";
 
        foreignObject.appendChild(div);
        container.appendChild(foreignObject);
 
        // Load Lottie animation
        this.animation = lottie.loadAnimation({
            container: div,
            renderer: 'svg',
            loop: this.loop,
            autoplay: this.autoplay,
            path: this.jsonPath,
        });
 
        this.animation.addEventListener('DOMLoaded', () => {
            console.log(`Lottie animation loaded inside #${this.containerId}`);
        });
    }
 
    /**
     * Plays a specific segment of the Lottie animation.
     * @param {number} startFrame - The frame number to start the playback from.
     * @param {number} endFrame - The frame number to end the playback at.
     */
    playSegment(startFrame, endFrame) {
        if (this.animation) {
            // The segments parameter is an array like [startFrame, endFrame].
            // 'true' as the second argument (forceFlag) immediately starts the new segment.
            this.animation.playSegments([startFrame, endFrame], true);
        }
    }
}
 
// ----------------------------------------------------------------------
 
// --- Implementation Logic (Revised for Staged Playback) ---
 
document.addEventListener('DOMContentLoaded', () => {
 
   
    // 1. Initialize the Lottie animation.
    const animationContainerId = 'plant-animation';
    const plantAnim = new LottieSVGAnimation(animationContainerId, './pot-animation.json');
    plantAnim.init();
 
    // New state variables for controlled playback
    // currentPosition is the visual state of the animation (Starts at '2')
    let currentPosition = '2';
    // stagedSegment stores the segment to play when 'play-btn' is clicked
    let stagedSegment = null;
    // Get the play button
    const playButton = document.getElementById('play-btn');
    if (!playButton) {
        console.error("The 'play-btn' element was not found.");
        return;
    }
    // Initially hide the play button
    playButton.style.display = 'none';
 
 
    // 2. Define ALL 9 frame segments for state transitions.
     const segments = {
    // Idle/Current state segments (Not used in this staged logic, but kept for reference)
    'segment-11': [0, 600],     // Position 1 Idle Loop
    'segment-22': "",   // Position 2 Idle Loop
    'segment-33': [1400, 2000],  // Position 3 Idle Loop

    // Transition segments from Position 1
    'segment-12': [180, 0],  // Transition 1 -> 2
    'segment-13': [180, 540],  // Transition 1 -> 3

    // Transition segments from Position 2
    'segment-21': [0, 180],  // Transition 2 -> 1
    'segment-23': [440, 540],  // Transition 2 -> 3
    
    // Transition segments from Position 3
    'segment-31': [540, 180],  // Transition 3 -> 1
    'segment-32': [540, 440]   // Transition 3 -> 2
  };
 
    // --- NEW FUNCTION TO UPDATE INSTRUCTION TEXT ---
 
    /**
     * Updates the text content of the tap-instruction div based on the current position.
     * @param {string} position - The current active position ('1', '2', or '3').
     */
    function updateInstructionText(position) {
        const instructionElement = document.getElementById('tap-instruction');
        if (!instructionElement) return;
 
        let newText = '';
        switch (position) {
            case '1':
                // When clicked on position-1 (current state is 1), suggest 2 or 3
                newText = 'Tap between any of the position 2 and position 3 to move the light source';
                break;
            case '2':
                // When clicked on position-2 (current state is 2) or default, suggest 1 or 3
                newText = 'Tap between any of the position 1 and position 3 to move the light source';
                break;
            case '3':
                // When clicked on position-3 (current state is 3), suggest 1 or 2
                newText = 'Tap between any of the position 1 and position 2 to move the light source';
                break;
            default:
                newText = 'Tap to select a new light source position'; // Fallback text
        }
        instructionElement.textContent = newText;
    }
 
    // --- END NEW FUNCTION ---
 
    // ======================================================================
    // === NEW FUNCTION FOR SEQUENTIAL DATE UPDATE ==========================
    // ======================================================================
 
    /**
     * Updates the date-txt element sequentially (1 Day -> 2 Day -> 3 Day -> 4 Day)
     * with a 500ms delay between each change.
     */
    function sequentialDateUpdate() {
    const dateTxtElement = document.getElementById('date-txt');
    if (!dateTxtElement) {
        console.warn("Element with ID 'date-txt' not found for sequential update.");
        return;
    }
 
    const delayMilliseconds = 1500;
   
    // 💥 FIX: Explicitly set the starting text to '1 Day'
    dateTxtElement.textContent = '1 Day';
    console.log("date-txt reset to '1 Day'.");
   
    // --- Stage 1: 1 Day -> 2 Day (after 1500ms) ---
    setTimeout(() => {
        if (dateTxtElement) {
            dateTxtElement.textContent = '2 Day';
            console.log("date-txt updated to '2 Day'.");
        }
    }, delayMilliseconds);
 
    // --- Stage 2: 2 Day -> 3 Day (after 3000ms total) ---
    setTimeout(() => {
        if (dateTxtElement) {
            dateTxtElement.textContent = '3 Day';
            console.log("date-txt updated to '3 Day'.");
        }
    }, delayMilliseconds * 2);
 
    // --- Stage 3: 3 Day -> 4 Day (after 4500ms total) ---
    setTimeout(() => {
        if (dateTxtElement) {
            dateTxtElement.textContent = '4 Day';
            console.log("date-txt updated to '4 Day'.");
        }
    }, delayMilliseconds * 3);
}
 
    // ======================================================================
    // ======================================================================
 
    // 3. Function to stage the segment when a position button is clicked.
    function handleSegmentClick(event) {
        const destinationId = event.currentTarget.id.replace('position-', '');
        console.log(`Position ${destinationId} clicked.`);
        // Check if clicking the current position (optional: you can ignore or handle idle loop)
        if (destinationId === currentPosition) {
            console.log(`Already at Position ${currentPosition}.`);
            document.getElementById('beam-img1').style.display = 'none';
            document.getElementById('beam-img3').style.display = 'none';
            document.getElementById('beam-img2').style.display = 'block';
            document.getElementById('bulb-1').classList.remove('active');
            document.getElementById('bulb-3').classList.remove('active');
            document.getElementById('bulb-2').classList.add('active');
            document.getElementById('position-1').classList.remove('active');
            document.getElementById('position-3').classList.remove('active');
            document.getElementById('position-2').classList.add('active');
            // If you want to allow re-staging the current idle loop, you can stage it here.
            // For transitions, we prevent setting the same position as the destination.
            stagedSegment = null; // Clear any previous staging
            playButton.style.display = 'none';
           
            // --- UPDATE TEXT ON CLICKING CURRENT POSITION (Position 2 is default) ---
            updateInstructionText(currentPosition);
            // ------------------------------------------------------------------------
           
            return;
        }
 
        if(destinationId == 1){
            document.getElementById('beam-img2').style.display = 'none';
            document.getElementById('beam-img3').style.display = 'none';
            document.getElementById('beam-img1').style.display = 'block';
            document.getElementById('bulb-2').classList.remove('active');
            document.getElementById('bulb-3').classList.remove('active');
            document.getElementById('bulb-1').classList.add('active');
            document.getElementById('position-2').classList.remove('active');
            document.getElementById('position-3').classList.remove('active');
            document.getElementById('position-1').classList.add('active');
        }else if(destinationId == 2){
            document.getElementById('beam-img1').style.display = 'none';
            document.getElementById('beam-img3').style.display = 'none';
            document.getElementById('beam-img2').style.display = 'block';
            document.getElementById('bulb-1').classList.remove('active');
            document.getElementById('bulb-3').classList.remove('active');
            document.getElementById('bulb-2').classList.add('active');
            document.getElementById('position-1').classList.remove('active');
            document.getElementById('position-3').classList.remove('active');
            document.getElementById('position-2').classList.add('active');
        }else if(destinationId == 3){
            document.getElementById('beam-img1').style.display = 'none';
            document.getElementById('beam-img2').style.display = 'none';
            document.getElementById('beam-img3').style.display = 'block';
            document.getElementById('bulb-1').classList.remove('active');
            document.getElementById('bulb-2').classList.remove('active');
            document.getElementById('bulb-3').classList.add('active');
            document.getElementById('position-1').classList.remove('active');
            document.getElementById('position-2').classList.remove('active');
            document.getElementById('position-3').classList.add('active');
        }
 
        // Determine the segment name (e.g., 'segment-23').
        const segmentName = `segment-${currentPosition}${destinationId}`;
        const frames = segments[segmentName];
 
        if (frames) {
            // 1. Stage the segment frames and the final position.
            stagedSegment = {
                frames: frames,
                destination: destinationId
            };
           
            // 2. Show the play button.
            playButton.style.display = 'block';
            console.log(`Transition ${currentPosition} -> ${destinationId} staged. Click 'Play' to execute.`);
           
            // --- The instruction text changes to reflect the *staged* destination ---
            updateInstructionText(destinationId);
            // ----------------------------------------------------------------------
           
        } else {
            console.error(`Segment not defined for transition: ${segmentName}`);
            stagedSegment = null;
            playButton.style.display = 'none';
        }
    }
   
    // 4. Function to play the staged segment when the "play-btn" is clicked.
    function handlePlayClick() {
        if (!stagedSegment) {
            console.warn("No segment has been staged. Please select a position.");
            return;
        }
       
        const [startFrame, endFrame] = stagedSegment.frames;
        const destinationId = stagedSegment.destination;
       
        // 1. Play the segment.
        console.log(`Playing staged transition to Position ${destinationId} [${startFrame}, ${endFrame}]`);
        plantAnim.playSegment(startFrame, endFrame);
       
        // 2. Update the state.
        currentPosition = destinationId;
 
        // 3. Trigger the new sequential date update
        sequentialDateUpdate();
       
        // 4. Reset staging and hide the play button.
        stagedSegment = null;
        playButton.style.display = 'none';
 
        // Optional: Add the 'complete' listener back if you want an idle loop
        /*
        plantAnim.animation.addEventListener('complete', function onComplete() {
            const idleSegmentName = `segment-${currentPosition}${currentPosition}`;
            const idleFrames = segments[idleSegmentName];
            if (idleFrames) {
                plantAnim.playSegment(...idleFrames);
            }
            plantAnim.animation.removeEventListener('complete', onComplete);
        });
        */
    }
 
    // 5. Attach click event listeners.
    document.getElementById('position-1')?.addEventListener('click', handleSegmentClick);
    document.getElementById('position-2')?.addEventListener('click', handleSegmentClick);
    document.getElementById('position-3')?.addEventListener('click', handleSegmentClick);
   
    // Attach the new listener for the play button
    playButton.addEventListener('click', handlePlayClick);
   
    // 6. Set the initial default instruction text (for currentPosition = '2')
    updateInstructionText(currentPosition);
});