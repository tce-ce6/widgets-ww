

const container = document.getElementById('lottie-container');
const leftButton = document.getElementById('left-btn');
const rightButton = document.getElementById('right-btn');


const lottieInstance = null;

const PATH_BASE = './Assets/Animation/JSON';

/**
 * Loads the Lottie animation and sets it to Frame 0
 */
function loadInitialLottie() {
    // Check if container exists
    if (!container) {
        console.error("Lottie container not found.");
        return;
    }

    // Destroy previous instance if it exists
    if (lottieInstance) {
        lottieLeft.destroy();
        lottieRight.destroy();
    }

    // Load Instance
    lottieInstance = lottie.loadAnimation({
        container: container,
        renderer: 'svg',
        loop: false,
        autoplay: false,
        path: PATH_BASE + 'Condition_01.json'
    });

    // Event: Once loaded, stop at frame 0
    lottieInstance.addEventListener('DOMLoaded', () => {
        lottieInstance.goToAndStop(0, true);
        console.log("Animation loaded at frame 0");
    });

    // Error handling for file paths
    lottieInstance.addEventListener('data_failed', () => {
        console.error("Failed to load Lottie JSON at:", animationPath);
    });

    // Setup Interaction
    container.onclick = handleSwitchToggle;
}

function reset(){

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