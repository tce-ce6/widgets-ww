const leftContainer = document.getElementById('left-container');
const rightContainer = document.getElementById('right-container');
const leftButton = document.getElementById('left-btn');
const rightButton = document.getElementById('right-btn');

const switchArrow1 = document.getElementById('switch-arrow1');
const switchArrow2 = document.getElementById('switch-arrow2');

const rightArrow = document.getElementById('right-arrow');
const leftArrow = document.getElementById('left-arrow');

let leftLottieInstance = null;
let rightLottieInstance = null;

let leftPlayedOnce = false;
let rightPlayedOnce = false;

const PATH_BASE = './Assets/Animation/JSON/';

function loadInitialLottie() {

  // destroy old instances
  if (leftLottieInstance) leftLottieInstance.destroy();
  if (rightLottieInstance) rightLottieInstance.destroy();

  // LEFT LOTTIE
  leftLottieInstance = lottie.loadAnimation({
    container: leftContainer,
    renderer: 'svg',
    loop: false,
    autoplay: false,
    path: PATH_BASE + 'Condition_01_LH.json'
  });

  // RIGHT LOTTIE
  rightLottieInstance = lottie.loadAnimation({
    container: rightContainer,
    renderer: 'svg',
    loop: false,
    autoplay: false,
    path: PATH_BASE + 'Condition_01_RH.json'
  });

  // stop both at frame 0
  leftLottieInstance.addEventListener('DOMLoaded', () => {
    leftLottieInstance.goToAndStop(0, true);
  });

  rightLottieInstance.addEventListener('DOMLoaded', () => {
    rightLottieInstance.goToAndStop(0, true);
  });

  // BUTTON EVENTS
  leftButton.onclick = () =>{
    leftButton.src = './Assets/on-btn.svg';
   playSingleFrame('left');
  }
  rightButton.onclick = () => {
    rightButton.src = './Assets/on-btn.svg';
    playSingleFrame('right');
  }

}

/**
 * Play only 1 frame for left or right
 */
function playSingleFrame(side) {

  if (side === 'left' && !leftPlayedOnce) {
    leftPlayedOnce = true;
    playOneFrame(leftLottieInstance);
  }

  if (side === 'right' && !rightPlayedOnce) {
    rightPlayedOnce = true;
    playOneFrame(rightLottieInstance);
  }

  // if both have played once → play full animation
  if (leftPlayedOnce && rightPlayedOnce) {
    playFullAnimation();
  }
}

/**
 * Play exactly 1 frame
 */
function playOneFrame(instance) {
  const currentFrame = Math.floor(instance.currentFrame);
  instance.goToAndStop(currentFrame + 1, true);
}

/**
 * Play both animations fully
 */
function playFullAnimation() {
  leftLottieInstance.play();
  rightLottieInstance.play();
}

/**
 * RESET
 */
function reset() {
  leftPlayedOnce = false;
  rightPlayedOnce = false;

  leftButton.src = './Assets/off-btn.svg';
  rightButton.src = './Assets/off-btn.svg';

  leftArrow.src = './Assets/right-arrow-btn.svg';
  rightArrow.src = './Assets/right-arrow-btn.svg';

  leftLottieInstance.goToAndStop(0, true);
  rightLottieInstance.goToAndStop(0, true);
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('reset-btn').addEventListener('click', reset);

  switchArrow1.addEventListener('click', () => {
    leftArrow.src = './Assets/left-arrow-btn.svg';

  });

  switchArrow2.addEventListener('click', () => {
    rightArrow.src = './Assets/left-arrow-btn.svg';

  });
  loadInitialLottie();
});
