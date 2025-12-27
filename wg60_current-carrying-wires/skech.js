const leftContainer = document.getElementById('left-container');
const rightContainer = document.getElementById('right-container');
const leftButton = document.getElementById('left-btn');
const rightButton = document.getElementById('right-btn');

const switchArrow1 = document.getElementById('switch-arrow1');
const switchArrow2 = document.getElementById('switch-arrow2');

const rightArrow = document.getElementById('right-arrow'); // Display arrow for switch 2
const leftArrow = document.getElementById('left-arrow');  // Display arrow for switch 1

let leftLottieInstance = null;
let rightLottieInstance = null;

let leftPlayedOnce = false;
let rightPlayedOnce = false;

// STATE TRACKING
let isArrow1Active = false;
let isArrow2Active = false;

const PATH_BASE = './Assets/Animation/JSON/';

/**
 * Determines which file to load based on the combination of active arrows
 */
function getConditionPaths() {
    if (isArrow1Active && isArrow2Active) {
        return { left: 'Condition_03_LH.json', right: 'Condition_03_RH.json' };
    } else if (isArrow1Active) {
        return { left: 'Condition_04_LH.json', right: 'Condition_04_RH.json' };
    } else if (isArrow2Active) {
        return { left: 'Condition_02_LH.json', right: 'Condition_02_RH.json' };
    } else {
        return { left: 'Condition_01_LH.json', right: 'Condition_01_RH.json' };
    }
}

function loadLotties() {
    // Reset play states whenever files change
    leftPlayedOnce = false;
    rightPlayedOnce = false;
    leftButton.src = './Assets/off-btn.svg';
    rightButton.src = './Assets/off-btn.svg';

    if (leftLottieInstance) leftLottieInstance.destroy();
    if (rightLottieInstance) rightLottieInstance.destroy();

    const paths = getConditionPaths();
    console.log(paths.left, paths.right);
    leftLottieInstance = lottie.loadAnimation({
        container: leftContainer,
        renderer: 'svg',
        loop: false,
        autoplay: false,
        path: PATH_BASE + paths.left
    });

    rightLottieInstance = lottie.loadAnimation({
        container: rightContainer,
        renderer: 'svg',
        loop: false,
        autoplay: false,
        path: PATH_BASE + paths.right
    });

    const stopAtZero = (instance) => {
        instance.addEventListener('DOMLoaded', () => instance.goToAndStop(0, true));
    };

    stopAtZero(leftLottieInstance);
    stopAtZero(rightLottieInstance);
}

// UI UPDATES
function updateArrowVisuals() {
    leftArrow.src = isArrow1Active ? './Assets/left-arrow-btn.svg' : './Assets/right-arrow-btn.svg';
    rightArrow.src = isArrow2Active ? './Assets/left-arrow-btn.svg' : './Assets/right-arrow-btn.svg';
}

// LOGIC HELPERS
function playSingleFrame(side) {
    if (side === 'left' && !leftPlayedOnce) {
        leftPlayedOnce = true;
        playOneFrame(leftLottieInstance);
    }
    if (side === 'right' && !rightPlayedOnce) {
        rightPlayedOnce = true;
        playOneFrame(rightLottieInstance);
    }
    if (leftPlayedOnce && rightPlayedOnce) {
        playFullAnimation();
    }
}

function playOneFrame(instance) {
    const currentFrame = Math.floor(instance.currentFrame);
    instance.goToAndStop(currentFrame + 1, true);
}

function playFullAnimation() {
    leftLottieInstance.play();
    rightLottieInstance.play();
}

function reset() {
    isArrow1Active = false;
    isArrow2Active = false;
    updateArrowVisuals();
    loadLotties(); // Re-loads Condition 01
}

// INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('reset-btn').addEventListener('click', reset);

    leftButton.onclick = () => {
        leftButton.src = './Assets/on-btn.svg';
        playSingleFrame('left');
    };

    rightButton.onclick = () => {
        rightButton.src = './Assets/on-btn.svg';
        playSingleFrame('right');
    };

    switchArrow1.addEventListener('click', () => {
        isArrow1Active = !isArrow1Active; // Toggle
        updateArrowVisuals();
        loadLotties();
    });

    switchArrow2.addEventListener('click', () => {
        isArrow2Active = !isArrow2Active; // Toggle
        updateArrowVisuals();
        loadLotties();
    });

    loadLotties(); // Initial load
});