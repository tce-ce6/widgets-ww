SCENARIOS = {
  "sets": [
    {
      "set": 1,
      "places": [
        {
          "place": "School",
          "direction": "East",
          "dialogue": "The sun rises in the east, and that’s the way I head off to school each morning! My school is east of my house. Can you help me find it?"
        },
        {
          "place": "Hospital",
          "direction": "North",
          "dialogue": "Once, an ambulance rushed past my house heading north to the hospital. The hospital is north of my house. Can you help me find it?"
        },
        {
          "place": "Park",
          "direction": "South",
          "dialogue": "When I want to play on the swings, I head south to the park. The park is south of my house. Can you help me find it?"
        },
        {
          "place": "Supermarket",
          "direction": "West",
          "dialogue": "On shopping day, Mum and I head west to the supermarket. It’s west of my house. Can you help me find it?"
        }
      ]
    },
    {
      "set": 2,
      "places": [
        {
          "place": "School",
          "direction": "South",
          "dialogue": "When I set out for school, I walk south from my house. My school is south of home. Can you help me find it?"
        },
        {
          "place": "Hospital",
          "direction": "East",
          "dialogue": "If someone ever feels unwell, we hurry east to the hospital. It’s east of my house. Can you help me find it?"
        },
        {
          "place": "Park",
          "direction": "West",
          "dialogue": "On sunny evenings, we all go west to the park to play. The park is west of my house. Can you help me find it?"
        },
        {
          "place": "Supermarket",
          "direction": "North",
          "dialogue": "Mum and I walk north to buy fresh fruits and vegetables. The supermarket is north of my house. Can you help me find it?"
        }
      ]
    },
    {
      "set": 3,
      "places": [
        {
          "place": "School",
          "direction": "West",
          "dialogue": "Every morning I pick up my backpack and walk west to school. My school is west of my house. Can you help me find it?"
        },
        {
          "place": "Hospital",
          "direction": "South",
          "dialogue": "I saw a doctor’s van drive south towards the hospital. The hospital is south of my house. Can you help me find it?"
        },
        {
          "place": "Park",
          "direction": "North",
          "dialogue": "After school, my friends and I run north to the park to play. The park is north of my house. Can you help me find it?"
        },
        {
          "place": "Supermarket",
          "direction": "East",
          "dialogue": "When we need groceries, we go east to the supermarket. It’s east of my house. Can you help me find it?"
        }
      ]
    },
    {
      "set": 4,
      "places": [
        {
          "place": "School",
          "direction": "North",
          "dialogue": "Every morning, I leave my house with my backpack and walk to school. I remember it’s north of my house. Can you help me find it?"
        },
        {
          "place": "Hospital",
          "direction": "West",
          "dialogue": "Yesterday, I saw an ambulance drive west to the hospital. The hospital is west of my house. Can you help me find it?"
        },
        {
          "place": "Park",
          "direction": "East",
          "dialogue": "After school, I love meeting my friends at the park. The park is east of my house. Can you help me find it?"
        },
        {
          "place": "Supermarket",
          "direction": "South",
          "dialogue": "Mum asked me to help buy fruits and vegetables. The supermarket is south of my house. Can you help me find it?"
        }
      ]
    }
  ]
}

function playLottie() {
  const container = document.querySelector('#confetti-lottie div');

  if (!container) {
    console.warn('Confetti Lottie container not found');
    return;
  }

  const animationPath = './assets/json/confetti.json';

  // Clear previous animation
  container.innerHTML = '';
  container.style.display = 'block';

  const anim = lottie.loadAnimation({
    container: container,
    renderer: 'svg',
    loop: true,
    autoplay: true,
    path: animationPath,
    rendererSettings: {
      hideOnTransparent: false,
      preserveAspectRatio: 'xMidYMid meet'
    }
  });

  // Ensure totalFrames is available
  anim.addEventListener('DOMLoaded', () => {
    anim.addEventListener('complete', () => {
      anim.goToAndStop(anim.totalFrames - 1, true);
    });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const svg = document.querySelector('#map-wrapper svg');
  const introPage = document.getElementById('intro-page');
  const gamePage = document.getElementById('game-page');
  const playButton = document.getElementById('play-btn');
  const playAgainButton = document.getElementById('play-again');
  const landingText = document.getElementById('landing-text');
  const finalText = document.getElementById('final-text');
  const resetButton = document.getElementById('reset-btn');
  const confettiLottie = document.getElementById('confetti-lottie');
  const dialogueText = document.getElementById('dialogue-text');
  const correctFeedback = document.getElementById('feedback-correct');
  const successFeedbackText = document.getElementById('success-feedback-text');
  const incorrectFeedback = document.getElementById('feedback-incorrect');
  const incorrectCloseButton = document.getElementById('wrong-cross');
  const correctCloseButton = document.getElementById('shopping-cross');

  if (!svg || !playButton || !gamePage) return;

  const placeElements = {
    School: document.getElementById('school-icon'),
    Hospital: document.getElementById('hospital-icon'),
    Park: document.getElementById('park-icon'),
    Supermarket: document.getElementById('supermarket-icon')
  };
  const destinationElements = {
    North: document.getElementById('north-place'),
    East: document.getElementById('east-place'),
    South: document.getElementById('south-place'),
    West: document.getElementById('west-place')
  };
  const placeImages = {
    School: './assets/school.svg',
    Hospital: './assets/hospital.svg',
    Park: './assets/park.svg',
    Supermarket: './assets/supermarket.svg'
  };
  const successMessages = {
    School: 'Great Job! Now Ria knows the way to school.',
    Hospital: 'Excellent! Now Ria knows where to go if someone needs help.',
    Park: 'Well Done! Now Ria knows where the fun begins.',
    Supermarket: 'Fantastic! Now Ria can help Mum with the shopping.'
  };
  const dropPositions = document.getElementById('drop-positions');
  const svgNamespace = 'http://www.w3.org/2000/svg';
  const dragImageSize = 150;

  let setIndex = 0;
  let stepIndex = 0;
  let activeDrag = null;
  let feedbackTimer = null;
  let incorrectFeedbackOpen = false;
  let correctFeedbackOpen = false;

  const setDisplay = (element, visible) => {
    if (!element) return;
    const display = visible ? 'block' : 'none';
    element.setAttribute('display', display);
    element.style.display = display;
  };
  const setResetEnabled = (enabled) => {
    if (!resetButton) return;
    resetButton.style.opacity = enabled ? '1' : '.4';
    resetButton.style.pointerEvents = enabled ? 'auto' : 'none';
    resetButton.style.cursor = enabled ? 'pointer' : 'default';
  };
  const feedbackLottieAnimations = {};
  const playFeedbackLottie = (type) => {
    if (typeof lottie === 'undefined') return;

    const config = {
      success: { selector: '#success-lottie div', path: './assets/json/correct-star.json' },
      incorrect: { selector: '#incorrect-lottie div', path: './assets/json/emoji-incorrect.json' }
    }[type];
    const container = config && document.querySelector(config.selector);
    if (!container) return;

    feedbackLottieAnimations[type]?.destroy();
    container.innerHTML = '';
    container.style.width = '100%';
    container.style.height = '100%';
    feedbackLottieAnimations[type] = lottie.loadAnimation({
      container,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: config.path,
      rendererSettings: { preserveAspectRatio: 'xMidYMid meet' }
    });
  };
  const stopFeedbackLottie = (type) => feedbackLottieAnimations[type]?.stop();
  const currentStep = () => SCENARIOS.sets[setIndex].places[stepIndex];
  const svgPoint = (event) => {
    const point = svg.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    return point.matrixTransform(svg.getScreenCTM().inverse());
  };
  const hideFeedback = () => {
    clearTimeout(feedbackTimer);
    incorrectFeedbackOpen = false;
    correctFeedbackOpen = false;
    setDisplay(correctFeedback, false);
    setDisplay(incorrectFeedback, false);
    stopFeedbackLottie('success');
    stopFeedbackLottie('incorrect');
  };
  const showFeedback = (correct) => {
    hideFeedback();
    if (correct && successFeedbackText) {
      successFeedbackText.textContent = successMessages[currentStep().place];
    }
    setDisplay(correct ? correctFeedback : incorrectFeedback, true);
    playFeedbackLottie(correct ? 'success' : 'incorrect');
  };

  const updateAvailability = () => {
    const step = currentStep();
    Object.entries(placeElements).forEach(([place, element]) => {
      if (!element) return;
      const available = place === step.place;
      element.style.opacity = available ? '1' : '.28';
      element.style.pointerEvents = available ? 'auto' : 'none';
      element.style.cursor = available ? 'grab' : 'default';
    });
    Object.entries(destinationElements).forEach(([direction, element]) => {
      if (!element) return;
      element.style.opacity = '1';
      element.style.pointerEvents = 'auto';
    });
    if (dialogueText) dialogueText.textContent = step.dialogue;
  };

  const resetGame = (resetSetIndex = true) => {
    hideFeedback();
    if (resetSetIndex) setIndex = 0;
    stepIndex = 0;
    activeDrag = null;
    setResetEnabled(false);
    dropPositions?.querySelectorAll('.placed-place-image').forEach((image) => image.remove());
    Object.values(placeElements).forEach((element) => {
      if (!element) return;
      element.removeAttribute('transform');
      element.style.display = '';
    });
    updateAvailability();
  };

  const placeAtDestination = (image, destination) => {
    const targetBox = destination.getBBox();
    const size = Math.min(targetBox.width, targetBox.height) * .82;
    image.setAttribute('x', targetBox.x + (targetBox.width - size) / 2);
    image.setAttribute('y', targetBox.y + (targetBox.height - size) / 2);
    image.setAttribute('width', size);
    image.setAttribute('height', size);
    image.style.pointerEvents = 'none';
  };

  const continueAfterCorrect = () => {
    if (!correctFeedbackOpen) return;
    hideFeedback();
    stepIndex += 1;
    if (stepIndex === SCENARIOS.sets[setIndex].places.length) {
      setDisplay(gamePage, false);
      setDisplay(introPage, true);
      setDisplay(landingText, false);
      setDisplay(playButton, false);
      setDisplay(finalText, true);
      setDisplay(playAgainButton, true);
      setDisplay(confettiLottie, true);
      playLottie();
      return;
    }
    updateAvailability();
  };

  const moveDrag = (event) => {
    if (!activeDrag) return;
    const point = svgPoint(event);
    const { image } = activeDrag;
    image.setAttribute('x', point.x - dragImageSize / 2);
    image.setAttribute('y', point.y - dragImageSize / 2);
  };

  const startDrag = (event, place, element) => {
    if (place !== currentStep().place || activeDrag || incorrectFeedbackOpen) return;
    event.preventDefault();
    const image = document.createElementNS(svgNamespace, 'image');
    image.classList.add('placed-place-image');
    image.setAttribute('href', placeImages[place]);
    image.setAttribute('width', dragImageSize);
    image.setAttribute('height', dragImageSize);
    image.setAttribute('preserveAspectRatio', 'xMidYMid meet');
    image.style.pointerEvents = 'none';
    dropPositions?.appendChild(image);
    activeDrag = { element, image };
    element.style.cursor = 'grabbing';
    element.setPointerCapture?.(event.pointerId);
    moveDrag(event);
  };

  const finishDrag = (event) => {
    if (!activeDrag) return;
    const drag = activeDrag;
    activeDrag = null;
    const point = svgPoint(event);
    const droppedDirection = Object.entries(destinationElements).find(([, element]) => {
      const box = element.getBBox();
      return point.x >= box.x && point.x <= box.x + box.width && point.y >= box.y && point.y <= box.y + box.height;
    })?.[0];
    const correct = droppedDirection === currentStep().direction;

    if (!correct) {
      drag.image.remove();
      drag.element.style.cursor = 'grab';
      showFeedback(false);
      incorrectFeedbackOpen = true;
      return;
    }

    placeAtDestination(drag.image, destinationElements[droppedDirection]);
    drag.element.style.opacity = '.28';
    drag.element.style.pointerEvents = 'none';
    drag.element.style.cursor = 'default';
    if (currentStep().place === 'School') setResetEnabled(true);
    showFeedback(true);
    correctFeedbackOpen = true;
    feedbackTimer = setTimeout(continueAfterCorrect, 120000);
  };

  Object.entries(placeElements).forEach(([place, element]) => {
    element?.addEventListener('pointerdown', (event) => startDrag(event, place, element));
  });
  svg.addEventListener('pointermove', moveDrag);
  svg.addEventListener('pointerup', finishDrag);
  svg.addEventListener('pointercancel', finishDrag);
  incorrectCloseButton?.addEventListener('click', hideFeedback);
  correctCloseButton?.addEventListener('click', continueAfterCorrect);
  resetButton?.addEventListener('click', resetGame);

  const startGame = (nextSet = false) => {
    setDisplay(introPage, false);
    setDisplay(gamePage, true);
    setDisplay(landingText, true);
    setDisplay(playButton, true);
    setDisplay(finalText, false);
    setDisplay(playAgainButton, false);
    setDisplay(confettiLottie, false);
    if (nextSet) setIndex = (setIndex + 1) % SCENARIOS.sets.length;
    resetGame(!nextSet);
  };

  setResetEnabled(false);
  playButton.addEventListener('click', startGame);
  playAgainButton?.addEventListener('click', () => startGame(true));
});
