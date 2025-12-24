// 1. Element Selectors
const container1 = document.getElementById('switch-lottie');
const container2 = document.getElementById('current-lottie');
const container3 = document.getElementById('half-current-lottie');
const flipLED = document.getElementById('flip-LED');
const flipBulb = document.getElementById('flip-bulb');
const onBulb = document.getElementById('on-bulb');
const offBulb = document.getElementById('off-bulb');
const onLED = document.getElementById('on-led');
const offLED = document.getElementById('off-led');

const bulbGreenSign = document.getElementById('bulb-green-sign');
const bulbRedSign = document.getElementById('bulb-red-sign');
const LEDGreenSign = document.getElementById('LED-green-sign');
const LEDRedSign = document.getElementById('LED-red-sign');
const bulbPlusMinus = document.getElementById('bulb-plus-minus');
const bulbMinusPlus = document.getElementById('bulb-minus-plus');
const LEDPlusMinus = document.getElementById('led-plus-minus');
const LEDMinusPlus = document.getElementById('led-minus-plus');

const flipBulbImg = document.getElementById('flip-bulb-img');
const flipLEDImg = document.getElementById('flip-LED-img');
const LEDStick = document.getElementById('LED-stick-img');
// 2. State Variables
let switchLottieInstance = null;
let currentFlowLottie = null;
let halfFlowLottie = null;
let isSwitchOn = false;
let currentBulbSign = false; // Fixed typo 'Buld' to 'Bulb'
let currentLEDSign = false;
let LEDSign = false;

const PATH_BASE = './Assets/Lottie-animation/';

/**
 * Loads the Lottie animation and sets it to Frame 0
 */
function loadInitialLottie() {
    // Check if container exists
    if (!container1) {
        console.error("Lottie container '#switch-lottie' not found.");
        return;
    }

    // Destroy previous instance if it exists
    if (switchLottieInstance) {
        switchLottieInstance.destroy();
    }

    // Load Instance
    switchLottieInstance = lottie.loadAnimation({
        container: container1,
        renderer: 'svg',
        loop: false,
        autoplay: false,
        path: PATH_BASE + 'Switch_on_off.json'
    });

    currentFlowLottie = lottie.loadAnimation({
        container: container2,
        renderer: 'svg',
        loop: true,
        autoplay: false,
        path: PATH_BASE + 'current_flow_A.json'
    });

    halfFlowLottie = lottie.loadAnimation({
        container: container3,
        renderer: 'svg',
        loop: true,
        autoplay: false,
        path: PATH_BASE + 'current_flow_A2.json'
    });

    // Event: Once loaded, stop at frame 0
    switchLottieInstance.addEventListener('DOMLoaded', () => {
        switchLottieInstance.goToAndStop(0, true);
        console.log("Animation loaded at frame 0");
    });

    // Error handling for file paths
    switchLottieInstance.addEventListener('data_failed', () => {
        console.error("Failed to load Lottie JSON at:", animationPath);
    });

    // Setup Interaction
    container1.onclick = handleSwitchToggle;
}

/**
 * Handles the 2-segment logic
 * Segment 1 (ON): Frames 0 to 30 (adjust based on your JSON)
 * Segment 2 (OFF): Frames 30 to 60 (adjust based on your JSON)
 */
function handleSwitchToggle() {
    if (!switchLottieInstance || !currentFlowLottie) return;

    if (!isSwitchOn) {
        // --- ACTION: TURN ON ---
        // Play first segment (e.g., frame 0 to 30)
        switchLottieInstance.playSegments([0, 10], true);

        // Play secondary animation (from start)
        if (LEDSign) {
            halfFlowLottie.goToAndPlay(0, true);
            setTimeout(() => {
                onBulb.style.display = 'block';
                offBulb.style.display = 'none';
                container3.classList.remove('hidden'); // Make it visible
                currentFlowLottie.goToAndPlay(0, true);          // Start animation
                flipBulb.style.opacity = "0.3";
                flipBulb.style.pointerEvents = "none";
    
                flipLED.style.opacity = "0.3";
                flipLED.style.pointerEvents = "none";
            }, 300)
            LEDSign = true;
        }
        else {
            currentFlowLottie.goToAndPlay(0, true);
            showAndPlayCurrentFlow();

            setTimeout(() => {
                flipBulb.style.opacity = "0.3";
                flipBulb.style.pointerEvents = "none";
    
                flipLED.style.opacity = "0.3";
                flipLED.style.pointerEvents = "none";
            }, 300);
        }

        isSwitchOn = true;
    } else {
        // --- ACTION: TURN OFF ---
        // Play second segment (e.g., frame 30 to 60)
        switchLottieInstance.playSegments([10, 30], true);

        hideCurrentFlow();

        setTimeout(() => {
            flipBulb.style.opacity = "1";
        flipBulb.style.pointerEvents = "auto";

        flipLED.style.opacity = "1";
        flipLED.style.pointerEvents = "auto";
        }, 300);

        isSwitchOn = false;
    }
}

function showAndPlayCurrentFlow() {
    setTimeout(() => {
        onBulb.style.display = 'block';
        offBulb.style.display = 'none';
        offLED.style.display = 'none';
        onLED.style.display = 'block';
        container2.classList.remove('hidden'); // Make it visible
        currentFlowLottie.goToAndPlay(0, true);          // Start animation
        LEDStick.src = './Assets/Images/bulb/on-anode-cathode.svg';

    }, 300)
}

function hideCurrentFlow() {
    setTimeout(() => {
        offBulb.style.display = 'block';
        onBulb.style.display = 'none';
        offLED.style.display = 'block';
        onLED.style.display = 'none';
        container2.classList.add('hidden');    // Hide it
        container3.classList.add('hidden');    // Hide it
        currentFlowLottie.stop();                        // Stop animation
        if (!currentLEDSign) {
            LEDStick.src = './Assets/Images/bulb/off-anode-cathode.svg';

        } else {
            LEDStick.src = './Assets/Images/bulb/off-cathode-anode.svg';

        }
    }, 200);
}

// 3. UI Interaction Listeners
flipLED.addEventListener('click', () => {
    if (!currentLEDSign) {
        LEDGreenSign.style.fill = "#FF4C4C";
        LEDRedSign.style.fill = "#47D847";
        LEDPlusMinus.style.display = 'none';
        LEDMinusPlus.style.display = 'block';
        currentLEDSign = true;
        LEDSign = true;
        flipLEDImg.src = './Assets/Images/bulb/left-flip.svg';
        LEDStick.src = './Assets/Images/bulb/off-cathode-anode.svg';
    } else {
        LEDGreenSign.style.fill = "#47D847";
        LEDRedSign.style.fill = "#FF4C4C";
        LEDPlusMinus.style.display = 'block';
        LEDMinusPlus.style.display = 'none';
        currentLEDSign = false;
        LEDSign = false;
        flipLEDImg.src = './Assets/Images/bulb/right-flip.svg';
        LEDStick.src = './Assets/Images/bulb/off-anode-cathode.svg';
    }
});

flipBulb.addEventListener('click', () => {
    if (!currentBulbSign) {
        bulbGreenSign.style.fill = "#FF4C4C";
        bulbRedSign.style.fill = "#47D847";
        bulbPlusMinus.style.display = 'none';
        bulbMinusPlus.style.display = 'block';
        currentBulbSign = true;
        flipBulbImg.src = './Assets/Images/bulb/left-flip.svg';
    } else {
        bulbGreenSign.style.fill = "#47D847";
        bulbRedSign.style.fill = "#FF4C4C";
        bulbPlusMinus.style.display = 'block';
        bulbMinusPlus.style.display = 'none';
        currentBulbSign = false;
        flipBulbImg.src = './Assets/Images/bulb/right-flip.svg';
    }
});

function reset() {
    container2.classList.add('hidden');
    container3.classList.add('hidden');
    offBulb.style.display = 'block';
    onBulb.style.display = 'none';
    offLED.style.display = 'block';
    onLED.style.display = 'none';

    bulbPlusMinus.style.display = 'block';
    bulbMinusPlus.style.display = 'none';
    LEDPlusMinus.style.display = 'block';
    LEDMinusPlus.style.display = 'none';

    flipBulb.style.opacity = "1";
    flipBulb.style.pointerEvents = "auto";

    flipLED.style.opacity = "1";
    flipLED.style.pointerEvents = "auto";
    LEDStick.src = './Assets/Images/bulb/off-anode-cathode.svg';

    flipBulbImg.src = './Assets/Images/bulb/right-flip.svg';
    flipLEDImg.src = './Assets/Images/bulb/right-flip.svg';

    if (switchLottieInstance) {
        // Force the animation back to the very first frame (OFF state)
        switchLottieInstance.goToAndStop(0, true);
    }

    // Reset your tracking variable so the next click plays the ON segment
    isSwitchOn = false;

    // Reset signs if applicable
    currentBulbSign = false;
    currentLEDSign = false;
    LEDSign = false;
    // Reset Sign colors/fills to default
    if(bulbGreenSign) bulbGreenSign.style.fill = "#47D847";
    if(bulbRedSign) bulbRedSign.style.fill = "#FF4C4C";

    if (LEDGreenSign) LEDGreenSign.style.fill = "#47D847";
    if (LEDRedSign) LEDRedSign.style.fill = "#FF4C4C";
}

document.addEventListener('DOMContentLoaded', function () {

    let resetBtn = document.getElementById('reset-btn');
    resetBtn.addEventListener('click', () => {
        reset();
    });

    // 4. Initialize
    loadInitialLottie();
    reset();
});