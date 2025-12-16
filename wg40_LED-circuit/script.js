


let container = document.getElementById('switch-lottie');
let flipLED = document.getElementById('flip-LED');
let flipBulb = document.getElementById('flip-bulb');
let bulbGreenSign = document.getElementById('bulb-green-sign');
let bulbRedSign = document.getElementById('bulb-red-sign');
let LEDGreenSign = document.getElementById('LED-green-sign');
let LEDRedSign = document.getElementById('LED-red-sign');
let bulbPlusSign = document.getElementById('bulb-plus-sign');
let bulbMinusSign = document.getElementById('bulb-minus-sign');

let currentLottieInstance = null

let currentBuldSign = false;
let currentLEDSign = false;

const ANIMATION_PATH_BASE = './Assets/Lottie-animation/';

/* Loads the Lottie animation for the current word and sets it to the initial state (Frame 0).
 */
function loadInitialLottie() {
    // const container = document.getElementById(LOTTIE_CONTAINER_ID);
    if (!container) {
        console.error(`Lottie container with ID "${LOTTIE_CONTAINER_ID}" not found.`);
        return;
    }

    // 1. Destroy previous instance
    if (currentLottieInstance) {
        currentLottieInstance.destroy();
        currentLottieInstance = null;
    }

    // 2. Find file path
    const fileName = "Switch_on_off.json";
    if (!fileName) {
        console.warn(`No Lottie file found for the word: ${word}`);
        // Optionally, hide the container if no animation exists
        container.innerHTML = '';
        return;
    }
    const animationPath = ANIMATION_PATH_BASE + fileName;
    console.log("animationPath",animationPath );
    // 3. Create the animation instance
    currentLottieInstance = lottie.loadAnimation({
        container: container,
        renderer: 'svg',
        loop: false,
        autoplay: false, // Start paused
        path: animationPath
    });

    // 4. Go to frame 0 immediately upon loading to show the initial state (the image)
    currentLottieInstance.addEventListener('DOMLoaded', () => {
        requestAnimationFrame(() => {
            currentLottieInstance.goToAndStop(0, true);
        });
    });

    container.onclick = playLottieAnimation;
    // To handle touch devices, you might also want to add a 'touchstart' listener
    container.ontouchstart = (event) => {
        event.preventDefault(); // Prevents double firing with click on some devices
        playLottieAnimation();
    };
}

/**
 * Starts playing the Lottie animation. (Replaces showFinalImage visual logic)
 */
function playLottieAnimation() {
    if (currentLottieInstance) {
        // Ensure it starts from the beginning and play!
        currentLottieInstance.goToAndStop(0, true);
        currentLottieInstance.play();
        // setTimeout(() => {
        //     instructionText.textContent = "ऑडियो प्ले करें और सही वर्ण चुनकर शब्द बनाएँ।";
        //     soundIcon.style.display = 'block';
        //     afterContainer.style.display = 'block';
        //     lottieObject.setAttribute('x', 300);
        //     container.classList.add('no-touch');
        //     showAnswerBtn.disabled = false;
        // }, 2000)
    }
}

loadInitialLottie();

flipLED.addEventListener('click', () => {
    console.log("LED");
    if (!currentLEDSign) {
        LEDGreenSign.style.fill = "#FF4C4C";
        LEDRedSign.style.fill = "#47D847";
        currentLEDSign = true;
    }
    else{
        LEDGreenSign.style.fill = "#47D847";
        LEDRedSign.style.fill = "#FF4C4C";
        currentLEDSign = false;
    }
});

flipBulb.addEventListener('click', () => {
    console.log("bulb");
    if (!currentBuldSign) {
        bulbGreenSign.style.fill = "#FF4C4C";
        bulbRedSign.style.fill = "#47D847";
        currentBuldSign = true;
    }
    else {
        bulbGreenSign.style.fill = "#47D847";
        bulbRedSign.style.fill = "#FF4C4C";
        currentBuldSign = false;
    }
});