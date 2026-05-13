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
    { "answer": ["flip", "slip"], "distractor_1": ["flip", "guess", "choose", "sound", "card"], "distractor_2": ["slip", "lamp", "gentle", "night", "tray"] },
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
    anim.play();
  }
}

function playTryAgainLottie() {
  // Find a container to play try-again lottie, perhaps the first distractor-1 card's container
  const container = document.querySelector('.try-again-lottie');

  if (!container) {
    console.warn(`Try-again container not found`);
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
    card.dataset.word = word;
    card.dataset.correct = word.toLowerCase() === correctLeft ? 'true' : 'false';
    const span = card.querySelector('text tspan');
    if (span) {
      span.textContent = word;
    }
  });

  d2Cards.forEach((card, index) => {
    const word = shuffledD2[index] || '';
    card.dataset.word = word;
    card.dataset.correct = word.toLowerCase() === correctRight ? 'true' : 'false';
    const span = card.querySelector('text tspan');
    if (span) {
      span.textContent = word;
    }
  });

  // Load all lottie animations
  loadAllLotties();
}

function addSelectionOverlay(card) {
  const existing = card.querySelector('.selection-overlay');
  if (existing) {
    return;
  }
  const text = card.querySelector('text');
  if (!text) {
    return;
  }
  const bbox = text.getBBox();
  const paddingX = 16;
  const paddingY = 10;
  const overlay = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
  overlay.setAttribute('class', 'selection-overlay');
  overlay.setAttribute('x', bbox.x - paddingX);
  overlay.setAttribute('y', bbox.y - paddingY);
  overlay.setAttribute('width', bbox.width + paddingX * 2);
  overlay.setAttribute('height', bbox.height + paddingY * 2);
  overlay.setAttribute('rx', '16');
  overlay.setAttribute('fill', '#ffffff');
  overlay.setAttribute('opacity', '0.95');
  card.insertBefore(overlay, card.firstChild);
}

function removeSelectionOverlay(card) {
  const overlay = card.querySelector('.selection-overlay');
  if (overlay) {
    overlay.remove();
  }
}

function resetCardStyle(card) {
  card.style.display = 'block';
  const textSpan = card.querySelector('text tspan');
  if (textSpan) {
    textSpan.style.fill = '#ffffff';
  }
  removeSelectionOverlay(card);
}

document.addEventListener('DOMContentLoaded', function () {
  const startGameButton = document.getElementById('startGameBtn');
  const mainPage = document.getElementById('mainPage');
  const nextButton = document.getElementById('next-btn');
  const newZoneButton = document.getElementById('new-zone');
  const tryAgainButton = document.getElementById('try-again');

  const groupKeys = Object.keys(RHYMEDATA);
  let availableGroups = createIndexPool(groupKeys.length);
  let currentGroupItems = [];
  let availableItems = [];
  let currentItem = null;
  let selectedCards = { d1: null, d2: null };
  let nextEnabled = false;

  const sectionMap = {
    'distractor-1': 'd1',
    'distractor-2': 'd2'
  };

  const allCards = Array.from(document.querySelectorAll('#distractor-1 > g, #distractor-2 > g'));

  function updateNextState() {
    nextButton.style.opacity = nextEnabled ? '1' : '0.5';
    nextButton.style.pointerEvents = nextEnabled ? 'auto' : 'none';
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
    selectedCards = { d1: null, d2: null };
    nextEnabled = false;
    updateNextState();
    hideTryAgain();
    resetAllCards();
  }

  function markCardCorrect(card) {
    const textSpan = card.querySelector('text tspan');
    if (textSpan) {
      textSpan.style.fill = '#2e8b57';
    }
    addSelectionOverlay(card);
  }

  function markCardIncorrect(card) {
    const textSpan = card.querySelector('text tspan');
    if (textSpan) {
      textSpan.style.fill = '#ff3b30';
    }
    addSelectionOverlay(card);
  }

  function handleCardClick(event) {
    const card = event.currentTarget;
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
        // Play all remaining lotties when correct
        allCards.forEach(card => {
          if (card !== selectedCards.d1 && card !== selectedCards.d2) {
            playLoadedLottie(card);
          }
        });
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

  function bindCardClicks() {
    allCards.forEach(card => {
      const sectionId = card.parentNode.id;
      card.dataset.section = sectionMap[sectionId] || '';
      card.style.cursor = 'pointer';
      card.addEventListener('click', handleCardClick);
    });
  }

  function chooseNextItem() {
    if (currentGroupItems.length === 0) {
      chooseNewGroup();
      return;
    }

    if (availableItems.length === 0) {
      availableItems = createIndexPool(currentGroupItems.length);
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
    chooseNextItem();
  }

  startGameButton.addEventListener('click', function () {
    mainPage.style.display = 'block';
    startGameButton.style.display = 'none';
    chooseNewGroup();
  });

  nextButton.addEventListener('click', function () {
    if (!nextEnabled) {
      return;
    }
    chooseNextItem();
  });

  newZoneButton.addEventListener('click', function () {
    mainPage.style.display = 'none';
    startGameButton.style.display = 'block';
    chooseNewGroup();
  });

  if (tryAgainButton) {
    tryAgainButton.addEventListener('click', function () {
      resetSelectionState();
    });
  }

  bindCardClicks();
  updateNextState();
  hideTryAgain();
});