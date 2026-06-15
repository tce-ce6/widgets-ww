RHYMEDATA = {
  "group_1": [
    { "answer": ["bright", "night"], "distractor_1": ["bright", "built", "nest", "tap", "fair"], "distractor_2": ["night", "nice", "drank", "drawer", "flour"] },
    { "answer": ["fair", "share"], "distractor_1": ["fair", "brick", "drip", "forest", "mother"], "distractor_2": ["share", "grade", "motor", "foot", "orange"] },
    { "answer": ["drip", "trip"], "distractor_1": ["drip", "moment", "cry", "fully", "monkey"], "distractor_2": ["trip", "lion", "crib", "leg", "red"] },
    { "answer": ["leg", "peg"], "distractor_1": ["leg", "gnat", "neck", "eyes", "fly"], "distractor_2": ["peg", "feet", "hands", "rose", "lily"] },
    { "answer": ["fly", "sly"], "distractor_1": ["fly", "heavy", "tall", "sad", "kitten"], "distractor_2": ["sly", "fox", "hen", "happy", "story"] },
    { "answer": ["kitten", "mitten"], "distractor_1": ["kitten", "kennel", "hungry", "humble", "hollow"], "distractor_2": ["mitten", "helpful", "statue", "dream", "power"] },
    { "answer": ["dream", "stream"], "distractor_1": ["dream", "stomach", "struggle", "balloon", "family"], "distractor_2": ["stream", "monster", "garden", "fitted", "rain"] },
    { "answer": ["balloon", "moon"], "distractor_1": ["balloon", "kettle", "kicking", "hungry", "stamp"], "distractor_2": ["moon", "stubborn", "follow", "drive", "built"] },
    { "answer": ["stamp", "lamp"], "distractor_1": ["stamp", "power", "hollow", "tall", "angry"], "distractor_2": ["lamp", "hands", "orange", "tiger", "hen"] },
    { "answer": ["power", "flower"], "distractor_1": ["power", "butter", "flute", "kitchen", "room"], "distractor_2": ["flower", "bread", "drank", "nice", "lion"] }
  ],
  "group_2": [
    { "answer": ["butter", "mutter"], "distractor_1": ["butter", "bumpy", "bright", "follow", "dress"], "distractor_2": ["mutter", "bring", "drive", "shoulder", "red"] },
    { "answer": ["follow", "hollow"], "distractor_1": ["follow", "angry", "horse", "story", "stubborn"], "distractor_2": ["hollow", "humble", "monkey", "fussy", "sad"] },
    { "answer": ["humble", "mumble"], "distractor_1": ["humble", "goggle", "morning", "fancy", "flour"], "distractor_2": ["mumble", "gentle", "drum", "dress", "funny"] },
    { "answer": ["dress", "mess"], "distractor_1": ["dress", "days", "brought", "peep", "fuss"], "distractor_2": ["mess", "forest", "mountain", "bundle", "kicking"] },
    { "answer": ["mountain", "stain"], "distractor_1": ["mountain", "butter", "trouble", "hump", "kind"], "distractor_2": ["stain", "peace", "yard", "home", "gentle"] },
    { "answer": ["trouble", "bubble"], "distractor_1": ["trouble", "bundle", "brittle", "flowy", "face"], "distractor_2": ["bubble", "goat", "punch", "humble", "short"] },
    { "answer": ["goat", "moat"], "distractor_1": ["goat", "sunny", "brought", "sad", "joy"], "distractor_2": ["moat", "rub", "lamp", "crouch", "fussy"] },
    { "answer": ["sunny", "funny"], "distractor_1": ["sunny", "pitch", "celebrate", "monkey", "robber"], "distractor_2": ["funny", "simple", "power", "night", "glance"] },
    { "answer": ["glance", "dance"], "distractor_1": ["glance", "fort", "octopus", "rough", "tinkling"], "distractor_2": ["dance", "rubber", "bumpy", "gentle", "great"] },
    { "answer": ["tinkling", "sprinkling"], "distractor_1": ["tinkling", "parrot", "glance", "bread", "trouble"], "distractor_2": ["sprinkling", "butter", "melting", "truly", "fangs"] }
  ],
  "group_3": [
    { "answer": ["parrot", "carrot"], "distractor_1": ["parrot", "animal", "picture", "game", "hiding"], "distractor_2": ["carrot", "shuffle", "great", "flip", "light"] },
    // { "answer": ["flip", "slip"], "distractor_1": ["flip", "guess", "choose", "sound", "card"], "distractor_2": ["slip", "lamp", "gentle", "night", "tray"] },
    { "answer": ["tray", "play"], "distractor_1": ["tray", "honey", "gentle", "mat", "moat"], "distractor_2": ["play", "fang", "happy", "card", "sound"] },
    { "answer": ["honey", "money"], "distractor_1": ["honey", "might", "flip", "animal", "jungle"], "distractor_2": ["money", "click", "bread", "trouble", "feet"] },
    { "answer": ["might", "fight"], "distractor_1": ["might", "hide", "celebrate", "picture", "choose"], "distractor_2": ["fight", "show", "flash", "thunder", "umbrella"] },
    { "answer": ["thunder", "wonder"], "distractor_1": ["thunder", "stair", "happy", "tremble", "might"], "distractor_2": ["wonder", "running", "balloon", "night", "guess"] },
    { "answer": ["running", "cunning"], "distractor_1": ["running", "celebrate", "thrilling", "chopping", "trouble"], "distractor_2": ["cunning", "tumble", "grass", "blubber", "crush"] },
    { "answer": ["tumble", "stumble"], "distractor_1": ["tumble", "hurrying", "slotted", "animal", "safari"], "distractor_2": ["stumble", "train", "adventure", "umbrella", "click"] },
    { "answer": ["hurrying", "worrying"], "distractor_1": ["hurrying", "sorrow", "crash", "jumble", "orchestra"], "distractor_2": ["worrying", "different", "shuffle", "interact", "peace"] },
    { "answer": ["sorrow", "tomorrow"], "distractor_1": ["sorrow", "ready", "effortless", "football", "stadium"], "distractor_2": ["tomorrow", "field", "alligator", "temperature", "bread"] },
    { "answer": ["effortless", "fearless"], "distractor_1": ["effortless", "stumble", "flying", "graceful", "happiness"], "distractor_2": ["fearless", "cricket", "tournament", "bright", "rubber"] }
  ]
};

const animMap = new Map();
let selectedCardClones = [];

function playSound(soundName) {
  const audio = new Audio(`./assets/audio/${soundName}.mp3`);
  audio.play().catch(err => console.log(`Failed to play audio: ${soundName}`, err));
}

function getRhymeCardFromEventTarget(el) {
  return el.closest('#distractor-1 > g') || el.closest('#distractor-2 > g');
}

function playLottie(card) {
  const section = card.dataset.section;
  const animationPath = section === 'd1' ? './assets/anim/bubble-green.json' : './assets/anim/bubble-blue.json';
  const container = card.querySelector('.lottie-container');

  if (!container) {
    console.warn(`Container not found`);
    return;
  }

  // Clear previous animation
  container.innerHTML = '';
  container.style.display = 'block';

  const anim = lottie.loadAnimation({
    container: container,
    renderer: 'svg',
    loop: false,
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

function loadAllLotties() {
  const d1Cards = Array.from(document.querySelectorAll('#distractor-1 > g'));
  const d2Cards = Array.from(document.querySelectorAll('#distractor-2 > g'));

  d1Cards.forEach((card) => {
    const container = card.querySelector('.lottie-container');
    if (container && !animMap.has(container)) {
      const animationPath = './assets/anim/bubble-green.json';
      const anim = lottie.loadAnimation({
        container: container,
        renderer: 'svg',
        loop: false,
        autoplay: false,
        path: animationPath,
        rendererSettings: {
          hideOnTransparent: false,
          preserveAspectRatio: 'xMidYMid meet'
        }
      });
      animMap.set(container, anim);
    }
  });

  d2Cards.forEach((card) => {
    const container = card.querySelector('.lottie-container');
    if (container && !animMap.has(container)) {
      const animationPath = './assets/anim/bubble-blue.json';
      const anim = lottie.loadAnimation({
        container: container,
        renderer: 'svg',
        loop: false,
        autoplay: false,
        path: animationPath,
        rendererSettings: {
          hideOnTransparent: false,
          preserveAspectRatio: 'xMidYMid meet'
        }
      });
      animMap.set(container, anim);
    }
  });
}

function playLoadedLottie(card) {
  const container = card.querySelector('.lottie-container');
  if (!container) {
    console.warn(`Container not found`);
    return;
  }

  const anim = animMap.get(container);
  if (anim) {
    container.style.display = 'block';
    container.style.visibility = 'visible';
    setCardWordVisible(card, false);
    const onComplete = () => {
      anim.goToAndStop(anim.totalFrames - 1, true);
      setCardWordVisible(card, false);
    };
    anim.addEventListener('complete', onComplete, { once: true });
    anim.play();
  } else {
    setCardWordVisible(card, false);
  }
}

function playTryAgainLottie() {
  // Find a container to play try-again lottie, perhaps the first distractor-1 card's container
  const container = document.querySelector('.try-again-lottie');

  if (!container) {
    console.warn(`Try-again container not found`);
    return;
  }

  playSound('try-again');

  // Clear previous animation
  container.innerHTML = '';
  container.style.display = 'block';

  const anim = lottie.loadAnimation({
    container: container,
    renderer: 'svg',
    loop: false,
    autoplay: true,
    path: './assets/anim/try-again.json',
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

function playCongratulationLottie(animationPath = './assets/anim/thumbs.json') {
  // Find a container to play congratulation lottie, perhaps the first distractor-1 card's container
  const container = document.querySelector('.congratulations-lottie');

  if (!container) {
    console.warn(`Congratulation container not found`);
    return;
  }

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

function shuffle(array) {
  const copy = array.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function createIndexPool(length) {
  return shuffle(Array.from({ length }, (_, i) => i));
}

function assignDistractorData(item) {
  // Clear previous animations
  animMap.clear();

  const d1Cards = Array.from(document.querySelectorAll('#distractor-1 > g'));
  const d2Cards = Array.from(document.querySelectorAll('#distractor-2 > g'));

  // Clear containers
  d1Cards.forEach((card) => {
    const container = card.querySelector('.lottie-container');
    if (container) container.innerHTML = '';
  });
  d2Cards.forEach((card) => {
    const container = card.querySelector('.lottie-container');
    if (container) container.innerHTML = '';
  });

  const shuffledD1 = shuffle(item.distractor_1);
  const shuffledD2 = shuffle(item.distractor_2);
  const correctLeft = item.answer[0].toLowerCase();
  const correctRight = item.answer[1].toLowerCase();

  d1Cards.forEach((card, index) => {
    const word = shuffledD1[index] || '';
    console.log(correctLeft, correctRight);
    card.dataset.word = word;
    card.dataset.correct = word.toLowerCase() === correctLeft ? 'true' : 'false';
    const span = card.querySelector('.lottie-text span');
    if (span) {
      span.textContent = word;
    }
  });

  d2Cards.forEach((card, index) => {
    const word = shuffledD2[index] || '';
    card.dataset.word = word;
    card.dataset.correct = word.toLowerCase() === correctRight ? 'true' : 'false';
    const span = card.querySelector('.lottie-text span');
    if (span) {
      span.textContent = word;
    }
  });

  // Load all lottie animations
  loadAllLotties();
}

function addSelectionOverlay(card) {
  const span = card.querySelector('.lottie-text span');
  if (span) {
    span.classList.add('selected');
  }
}

function removeSelectionOverlay(card) {
  const span = card.querySelector('.lottie-text span');
  if (span) {
    span.classList.remove('selected');
  }
}

function setCardWordVisible(card, visible) {
  const textEl = card.querySelector('.object-text');
  if (textEl) {
    textEl.style.opacity = visible ? '' : '0';
  }
}

function resetCardStyle(card) {
  card.style.display = 'block';
  card.removeAttribute('transform');
  setCardWordVisible(card, true);
  const textSpan = card.querySelector('.lottie-text span');
  if (textSpan) {
    textSpan.style.color = '#ffffff';
  }
  removeSelectionOverlay(card);
}

function getSvgRoot() {
  return document.querySelector('svg');
}

function clearSelectedCardClones() {
  selectedCardClones.forEach(clone => clone.remove());
  selectedCardClones = [];
}

function createCenteredSelectedClones(selectedCards, isLastQuestion = false) {
  const svg = getSvgRoot();
  if (!svg || !selectedCards.d1 || !selectedCards.d2) {
    return;
  }

  clearSelectedCardClones();
  const leftClone = selectedCards.d1.cloneNode(true);
  const rightClone = selectedCards.d2.cloneNode(true);

  svg.appendChild(leftClone);
  svg.appendChild(rightClone);
  selectedCardClones = [leftClone, rightClone];

  selectedCards.d1.style.display = 'none';
  selectedCards.d2.style.display = 'none';
  centerSelectedCards({ d1: leftClone, d2: rightClone });

  const congratsPanel = document.getElementById('congratulations-panel');
  if (congratsPanel) {
    congratsPanel.style.display = isLastQuestion ? 'block' : 'none';
  }

  const congratsDiv = document.getElementById('congratulation-div');
  if (congratsDiv) {
    congratsDiv.style.display = isLastQuestion ? 'block' : 'none';
  }

  const iText = document.getElementById('i-text');
  if (iText) {
    iText.style.display = isLastQuestion ? 'none' : 'block';
  }

  if (isLastQuestion) {
    playCongratulationLottie('./assets/anim/congratulation.json');
  } else {
    playCongratulationLottie();
  }
}

function centerSelectedCards(selectedCards) {
  const svg = getSvgRoot();
  if (!svg || !selectedCards.d1 || !selectedCards.d2) {
    return;
  }

  const svgBox = svg.getBBox();
  const centerX = svgBox.x + svgBox.width / 2;
  const centerY = svgBox.y + svgBox.height / 2;

  const leftCard = selectedCards.d1;
  const rightCard = selectedCards.d2;
  const leftBox = leftCard.getBBox();
  const rightBox = rightCard.getBBox();
  const gap = 80;

  const totalWidth = leftBox.width + rightBox.width + gap;
  const targetLeftX = centerX - totalWidth / 2;
  const targetRightX = centerX + totalWidth / 2 - rightBox.width;
  const targetY = centerY - Math.max(leftBox.height, rightBox.height) / 2;

  leftCard.setAttribute('transform', `translate(${targetLeftX - leftBox.x} ${targetY - leftBox.y})`);
  rightCard.setAttribute('transform', `translate(${targetRightX - rightBox.x} ${targetY - rightBox.y})`);
  document.getElementById('next-btn').style.display = 'block';
}

function centerNextButton(button) {
  const svg = getSvgRoot();
  if (!svg || !button) {
    return;
  }

  const svgBox = svg.getBBox();
  const buttonBox = button.getBBox();
  const dx = svgBox.x + svgBox.width / 2 - (buttonBox.x + buttonBox.width / 2);
  const dy = -200;
  button.removeAttribute('transform');
  button.style.transform = `translate(${dx}px, ${dy}px)`;
}

document.addEventListener('DOMContentLoaded', function () {
  const iText = document.getElementById('i-text'); 
  const startGameButton = document.getElementById('startGameBtn');
  const mainPage = document.getElementById('mainPage');
  const nextButton = document.getElementById('next-btn');
  const showAnswerBtn = document.getElementById('show-answer-btn');
  const showAnswerPage = document.getElementById('showAnswerPage');
  const newZoneButton = document.getElementById('new-zone');
  const tryAgainButton = document.getElementById('try-again');
  const progressClipRect = document.getElementById('wg119-progress-fill-clip-rect');
  const progressPctText = document.querySelector('#progress-bar text.st24 tspan');

  const PROGRESS_BAR_FULL_WIDTH = 315;
  const PROGRESS_BAR_CLIP_X = 1548.15;
  const STAR_COUNT = 10;

  const groupKeys = Object.keys(RHYMEDATA);
  let availableGroups = createIndexPool(groupKeys.length);
  let currentGroupItems = [];
  let availableItems = [];
  let currentItem = null;
  let selectedCards = { d1: null, d2: null };
  let nextEnabled = false;
  let groupCorrectCount = 0;

  const sectionMap = {
    'distractor-1': 'd1',
    'distractor-2': 'd2'
  };

  const allCards = Array.from(document.querySelectorAll('#distractor-1 > g, #distractor-2 > g'));

  function updateGroupProgressUI() {
    const total = currentGroupItems.length || 1;
    const count = Math.min(groupCorrectCount, total);
    const pct = Math.round((count / total) * 100);
    if (progressClipRect) {
      progressClipRect.setAttribute('x', String(PROGRESS_BAR_CLIP_X));
      progressClipRect.setAttribute(
        'width',
        String((PROGRESS_BAR_FULL_WIDTH * count) / total)
      );
    }
    const whiteCircleKnob = document.getElementById('white-circle');
    if (whiteCircleKnob) {
      const dx = (PROGRESS_BAR_FULL_WIDTH * count) / total;
      if (dx <= 0) {
        whiteCircleKnob.removeAttribute('transform');
      } else {
        whiteCircleKnob.setAttribute('transform', `translate(${dx}, 0)`);
      }
    }
    if (progressPctText) {
      progressPctText.textContent = `${String(pct).padStart(2, '0')}%`;
    }
    for (let i = 1; i <= STAR_COUNT; i++) {
      const star = document.getElementById(`start-${i}`);
      if (star) {
        star.style.opacity = i <= count ? '1' : '0.3';
      }
    }
  }

  function updateNewZoneVisibility() {
    if (!newZoneButton) {
      return;
    }
    const showNewZone = nextEnabled && availableItems.length === 0;
    newZoneButton.style.display = showNewZone ? 'block' : 'none';
  }

  function updateNextState() {
    const canClickNext = nextEnabled && availableItems.length > 0;
    nextButton.style.opacity = canClickNext ? '1' : '0.5';
    nextButton.style.pointerEvents = canClickNext ? 'auto' : 'none';
    updateNewZoneVisibility();
  }

  function hideTryAgain() {
    if (tryAgainButton) {
      tryAgainButton.style.display = 'none';
    }
  }

  function showTryAgain() {
    if (tryAgainButton) {
      tryAgainButton.style.display = 'inline-block';
    }
  }

  function resetAllCards() {
    allCards.forEach(resetCardStyle);
  }

  function resetSelectionState() {
    clearSelectedCardClones();
    if (selectedCards.d1) {
      selectedCards.d1.style.display = 'block';
    }
    if (selectedCards.d2) {
      selectedCards.d2.style.display = 'block';
    }
    selectedCards = { d1: null, d2: null };
    nextEnabled = false;
    updateNextState();
    hideTryAgain();
    resetAllCards();
    // reset next button position
    nextButton.style.transform = 'translateX(-650px)';
    // reset answer visibility
    isAnswerVisible = false;
    iText.style.display = 'block';
    mainPage.style.display = 'block';
    showAnswerBtn.style.display = 'inline-block';
    showAnswerPage.style.display = 'none';
    const showAnswerText = showAnswerBtn.querySelector('tspan');
    if (showAnswerText) {
      showAnswerText.textContent = 'Show Answer';
    }
    const congratsPanel = document.getElementById('congratulations-panel');
    if (congratsPanel) {
      congratsPanel.style.display = 'none';
    }
    const congratsDiv = document.getElementById('congratulation-div');
    if (congratsDiv) {
      congratsDiv.style.display = 'none';
    }
  }

  function markCardCorrect(card) {
    const textSpan = card.querySelector('.lottie-text span');
    if (textSpan) {
      textSpan.style.color = '#2e8b57';
    }
    addSelectionOverlay(card);
  }

  function markCardIncorrect(card) {
    const textSpan = card.querySelector('.lottie-text span');
    if (textSpan) {
      textSpan.style.color = '#ff3b30';
    }
    addSelectionOverlay(card);
  }

  function handleCardClick(event) {
    //const card = event.currentTarget;
    const card = getRhymeCardFromEventTarget(event.currentTarget);
    if (!card) {
      return;
    }

    const section = card.dataset.section;
    if (!section || !currentItem) {
      return;
    }

    const word = (card.dataset.word || '').trim().toLowerCase();
    if (!word) {
      return;
    }

    // If already selected in this section, do nothing
    if (selectedCards[section]) {
      return;
    }

    selectedCards[section] = card;

    // Mark as green
    markCardCorrect(card);

    // Check if both sections have selection
    if (selectedCards.d1 && selectedCards.d2) {
      const isCorrectD1 = selectedCards.d1.dataset.correct === 'true';
      const isCorrectD2 = selectedCards.d2.dataset.correct === 'true';
      if (isCorrectD1 && isCorrectD2) {
        nextEnabled = true;
        hideTryAgain();
        groupCorrectCount += 1;
        updateGroupProgressUI();
        // Play lottie on distractor cards; word labels are hidden (SVG text paints above the bubble)
        let popSoundPlayed = false;
        allCards.forEach(card => {
          if (card !== selectedCards.d1 && card !== selectedCards.d2) {
            playLoadedLottie(card);
            if (!popSoundPlayed) {
              setTimeout(() => {
              playSound('pop-bubble');
              }, 1000);
              popSoundPlayed = true;
            }
          }
        });
        setTimeout(() => {
          correctFeedbackPage();
          console.log('Available items before creating clones:', availableItems.length);
          createCenteredSelectedClones(selectedCards, availableItems.length === 0);
          if (currentItem && currentItem.answer) {
            playSound(`${currentItem.answer[0]}-${currentItem.answer[1]}`);
          }
        }, 2000);
      } else {
        nextEnabled = false;
        showTryAgain();
        // Mark both red with white background
        markCardIncorrect(selectedCards.d1);
        markCardIncorrect(selectedCards.d2);
        // Play try-again lottie when wrong
        playTryAgainLottie();
      }
    }

    updateNextState();
  }

  function correctFeedbackPage(){
    showAnswerBtn.style.display = 'none';
    centerNextButton(nextButton);
  }

  function bindCardClicks() {
    allCards.forEach(card => {
      const sectionId = card.parentNode.id;
      card.dataset.section = sectionMap[sectionId] || '';
      const wordText = card.querySelector('.object-text');
      if (wordText) {
        wordText.addEventListener('click', handleCardClick);
      }
    });
  }

  function chooseNextItem() {
    if (currentGroupItems.length === 0) {
      chooseNewGroup();
      return;
    }

    if (availableItems.length === 0) {
      return;
    }

    const itemIndex = availableItems.pop();
    currentItem = currentGroupItems[itemIndex];
    assignDistractorData(currentItem);
    resetSelectionState();
  }

  function chooseNewGroup() {
    if (availableGroups.length === 0) {
      availableGroups = createIndexPool(groupKeys.length);
    }

    const groupIndex = availableGroups.pop();
    currentGroupItems = RHYMEDATA[groupKeys[groupIndex]];
    availableItems = createIndexPool(currentGroupItems.length);
    groupCorrectCount = 0;
    updateGroupProgressUI();
    if (newZoneButton) {
      newZoneButton.style.display = 'none';
    }
    chooseNextItem();
  }

  startGameButton.addEventListener('click', function () {
    mainPage.style.display = 'block';
    showAnswerBtn.style.display = 'inline-block';
    startGameButton.style.display = 'none';
    chooseNewGroup();
  });

  nextButton.addEventListener('click', function () {
    if (!nextEnabled || availableItems.length === 0) {
      return;
    }
    chooseNextItem();
    showAnswerBtn.style.display = 'inline-block';
    document.getElementById('congratulation-div').style.display = 'none';
  });

  newZoneButton.addEventListener('click', function () {
    resetSelectionState();
    mainPage.style.display = 'none';
    startGameButton.style.display = 'block';
    showAnswerBtn.style.display = 'none';
    showAnswerPage.style.display = 'none';
    isAnswerVisible = false;
    const showAnswerText = showAnswerBtn.querySelector('tspan');
    if (showAnswerText) {
      showAnswerText.textContent = 'Show Answer';
    }
    document.getElementById('congratulation-div').style.display = 'none';
    newZoneButton.style.display = 'none';
  });

  let isAnswerVisible = false;

  showAnswerBtn.addEventListener('click', function () {
    if (!currentItem || !currentItem.answer) {
      return;
    }
    
    if (!isAnswerVisible) {
      // Show answer
      const answer1 = document.getElementById('answer1');
      const answer2 = document.getElementById('answer2');
      
      if (answer1 && answer1.querySelector('tspan')) {
        answer1.querySelector('tspan').textContent = currentItem.answer[0];
      }
      
      if (answer2 && answer2.querySelector('tspan')) {
        answer2.querySelector('tspan').textContent = currentItem.answer[1];
      }
      
      mainPage.style.display = 'none';
      showAnswerPage.style.display = 'block';
      isAnswerVisible = true;

      if (currentItem && currentItem.answer) {
        playSound(`${currentItem.answer[0]}-${currentItem.answer[1]}`);
      }
      
      // Change button text to Hide Answer
      const showAnswerText = showAnswerBtn.querySelector('tspan');
      if (showAnswerText) {
        showAnswerText.textContent = 'Hide Answer';
      }
    } else {
      // Hide answer
      mainPage.style.display = 'block';
      showAnswerPage.style.display = 'none';
      isAnswerVisible = false;
      
      // Change button text back to Show Answer
      const showAnswerText = showAnswerBtn.querySelector('tspan');
      if (showAnswerText) {
        showAnswerText.textContent = 'Show Answer';
      }
    }
  });

  if (tryAgainButton) {
    tryAgainButton.addEventListener('click', function () {
      resetSelectionState();
    });
  }

  bindCardClicks();
  updateGroupProgressUI();
  updateNextState();
  hideTryAgain();
});