const leftContainer = document.getElementById('left-container');
const rightContainer = document.getElementById('right-container');
const leftButton = document.getElementById('left-btn');
const rightButton = document.getElementById('right-btn');

const switchArrow1 = document.getElementById('switch-arrow1');
const switchArrow2 = document.getElementById('switch-arrow2');

const rightArrow = document.getElementById('right-arrow'); // Display arrow for switch 2
const leftArrow = document.getElementById('left-arrow');  // Display arrow for switch 1

const rightTap = document.getElementById('right-tap');
const leftTap = document.getElementById('left-tap');

const showAnswerText = document.getElementById('showAnswerText');

let line1 = document.getElementById('line1');
let line2 = document.getElementById('line2');
let line3 = document.getElementById('line3');

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
        line1.textContent = 'When current passes in the ';
        line2.textContent = 'opposite direction, the wires ';
        line3.textContent = 'are forced apart.';
        return { left: 'Condition_03_LH.json', right: 'Condition_03_RH.json' };
    } else if (isArrow1Active) {
        line1.textContent = 'When current passes in the ';
        line2.textContent = 'same direction, the wires are ';
        line3.textContent = 'forced together.';
        return { left: 'Condition_04_LH.json', right: 'Condition_04_RH.json' };
    } else if (isArrow2Active) {
        line1.textContent = 'When current passes in the ';
        line2.textContent = 'same direction, the wires are ';
        line3.textContent = 'forced together.';
        return { left: 'Condition_02_LH.json', right: 'Condition_02_RH.json' };
    } else {
        line1.textContent = 'When current passes in the ';
        line2.textContent = 'opposite direction, the wires ';
        line3.textContent = 'are forced apart.';
        return { left: 'Condition_01_LH.json', right: 'Condition_01_RH.json' };
    }
}

function loadLotties() {
    // Reset play states whenever files change
    leftPlayedOnce = false;
    rightPlayedOnce = false;
    leftButton.src = './Assets/off-btn.svg';
    rightButton.src = './Assets/off-btn.svg';
    rightTap.style.display = 'block';
    leftTap.style.display = 'block';
    showAnswerText.style.display = 'none';

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

    rightTap.style.display = 'block';
    leftTap.style.display = 'block';
    showAnswerText.style.display = 'none';

    updateArrowVisuals();
    loadLotties(); // Re-loads Condition 01
}

// INITIALIZATION
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('reset-btn').addEventListener('click', reset);

    document.getElementById('showAnswer').addEventListener('click', () =>{
        showAnswerText.style.display = 'block';
    });

    leftButton.onclick = () => {
        leftButton.src = './Assets/on-btn.svg';
         leftTap.style.display = 'none';
        playSingleFrame('left');
    };

    rightButton.onclick = () => {
        rightButton.src = './Assets/on-btn.svg';
        rightTap.style.display = 'none';
        playSingleFrame('right');
    };

    switchArrow1.addEventListener('click', () => {
        isArrow1Active = !isArrow1Active; // Toggle
        // leftTap.style.display = 'block';
        updateArrowVisuals();
        loadLotties();
    });

    switchArrow2.addEventListener('click', () => {
        isArrow2Active = !isArrow2Active; // Toggle
        // rightTap.style.display = 'block';
        updateArrowVisuals();
        loadLotties();
    });
    reset();
    loadLotties(); // Initial load
});