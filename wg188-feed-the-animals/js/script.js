const ANIMALS = [
  {
    "animal": "Cow",
    "food-options": ["Grass", "Corn", "Meat", "Fish", "Bone", "Mouse"],
    "correct-answer": ["Grass", "Corn"],
    "correct-feedback": "Correct — Cows are herbivores. They eat only plants.",
    "incorrect-feedback": {
      "one-correct-one-incorrect": "Incorrect! A cow eats only plants! Try again!",
      "both-incorrect": "Incorrect! A cow eats only plants! Try again!"
    }
  },
  {
    "animal": "Rabbit",
    "food-options": ["Carrot", "Leaves", "Meat", "Fish", "Bone", "Egg"],
    "correct-answer": ["Carrot", "Leaves"],
    "correct-feedback": "Correct — Rabbits are herbivores. They eat only plants.",
    "incorrect-feedback": {
      "one-correct-one-incorrect": "Incorrect! A rabbit eats only plants! Try again!",
      "both-incorrect": "Incorrect! A rabbit eats only plants! Try again!"
    }
  },
  {
    "animal": "Elephant",
    "food-options": ["Banana", "Leaves", "Meat", "Fish", "Bone", "Mouse"],
    "correct-answer": ["Banana", "Leaves"],
    "correct-feedback": "Correct — Elephants are herbivores. They eat only plants.",
    "incorrect-feedback": {
      "one-correct-one-incorrect": "Incorrect! An elephant eats only plants! Try again!",
      "both-incorrect": "Incorrect! An elephant eats only plants! Try again!"
    }
  },
  {
    "animal": "Giraffe",
    "food-options": ["Leaves", "Apple", "Meat", "Fish", "Bone", "Egg"],
    "correct-answer": ["Leaves", "Apple"],
    "correct-feedback": "Correct — Giraffes are herbivores. They eat only plants.",
    "incorrect-feedback": {
      "one-correct-one-incorrect": "Incorrect! A giraffe eats only plants! Try again!",
      "both-incorrect": "Incorrect! A giraffe eats only plants! Try again!"
    }
  },
  {
    "animal": "Panda",
    "food-options": ["Bamboo", "Apple", "Meat", "Fish", "Bone", "Mouse"],
    "correct-answer": ["Bamboo", "Apple"],
    "correct-feedback": "Correct — Pandas are herbivores. They eat only plants.",
    "incorrect-feedback": {
      "one-correct-one-incorrect": "Incorrect! A panda eats only plants! Try again!",
      "both-incorrect": "Incorrect! A panda eats only plants! Try again!"
    }
  },
  {
    "animal": "Horse",
    "food-options": ["Apple", "Grass", "Meat", "Fish", "Bone", "Mouse"],
    "correct-answer": ["Apple", "Grass"],
    "correct-feedback": "Correct — Horses are herbivores. They eat only plants.",
    "incorrect-feedback": {
      "one-correct-one-incorrect": "Incorrect! A horse eats only plants! Try again!",
      "both-incorrect": "Incorrect! A horse eats only plants! Try again!"
    }
  },
  {
    "animal": "Goat",
    "food-options": ["Grass", "Leaves", "Meat", "Fish", "Bone", "Egg"],
    "correct-answer": ["Grass", "Leaves"],
    "correct-feedback": "Correct — Goats are herbivores. They eat only plants.",
    "incorrect-feedback": {
      "one-correct-one-incorrect": "Incorrect! A goat eats only plants! Try again!",
      "both-incorrect": "Incorrect! A goat eats only plants! Try again!"
    }
  },
  {
    "animal": "Bear",
    "food-options": ["Berries", "Apple", "Corn", "Fish", "Egg", "Bug"],
    "correct-answer": {
      "plant": ["Berries", "Apple", "Corn"],
      "animal": ["Fish", "Egg", "Bug"],
      "rule": "Any 1 plant + any 1 animal"
    },
    "correct-feedback": "Correct — Bears are omnivores. They eat both plants and animals.",
    "incorrect-feedback": {
      "one-correct-one-incorrect": "Incorrect! A bear eats both plants and animals! Try again!",
      "both-incorrect": "Incorrect! A bear eats both plants and animals! Try again!"
    }
  },
  {
    "animal": "Pig",
    "food-options": ["Corn", "Carrot", "Apple", "Egg", "Bug", "Worm"],
    "correct-answer": {
      "plant": ["Corn", "Carrot", "Apple"],
      "animal": ["Egg", "Bug", "Worm"],
      "rule": "Any 1 plant + any 1 animal"
    },
    "correct-feedback": "Correct — Pigs are omnivores. They eat both plants and animals.",
    "incorrect-feedback": {
      "one-correct-one-incorrect": "Incorrect! A pig eats both plants and animals! Try again!",
      "both-incorrect": "Incorrect! A pig eats both plants and animals! Try again!"
    }
  },
  {
    "animal": "Monkey",
    "food-options": ["Banana", "Apple", "Corn", "Bug", "Egg", "Lizard"],
    "correct-answer": {
      "plant": ["Banana", "Apple", "Corn"],
      "animal": ["Bug", "Egg", "Lizard"],
      "rule": "Any 1 plant + any 1 animal"
    },
    "correct-feedback": "Correct — Monkeys are omnivores. They eat both plants and animals.",
    "incorrect-feedback": {
      "one-correct-one-incorrect": "Incorrect! A monkey eats both plants and animals! Try again!",
      "both-incorrect": "Incorrect! A monkey eats both plants and animals! Try again!"
    }
  },
  {
    "animal": "Chicken",
    "food-options": ["Grain", "Corn", "Spinach", "Bug", "Mouse", "Egg"],
    "correct-answer": {
      "plant": ["Grain", "Corn", "Spinach"],
      "animal": ["Bug", "Mouse", "Egg"],
      "rule": "Any 1 plant + any 1 animal"
    },
    "correct-feedback": "Correct — Chickens are omnivores. They eat both plants and animals.",
    "incorrect-feedback": {
      "one-correct-one-incorrect": "Incorrect! A chicken eats both plants and animals! Try again!",
      "both-incorrect": "Incorrect! A chicken eats both plants and animals! Try again!"
    }
  },
  {
    "animal": "Duck",
    "food-options": ["Corn", "Grain", "Leaves", "Fish", "Bug", "Worm"],
    "correct-answer": {
      "plant": ["Corn", "Grain", "Leaves"],
      "animal": ["Fish", "Bug", "Worm"],
      "rule": "Any 1 plant + any 1 animal"
    },
    "correct-feedback": "Correct — Ducks are omnivores. They eat both plants and animals.",
    "incorrect-feedback": {
      "one-correct-one-incorrect": "Incorrect! A duck eats both plants and animals! Try again!",
      "both-incorrect": "Incorrect! A duck eats both plants and animals! Try again!"
    }
  },
  {
    "animal": "Lion",
    "food-options": ["Meat", "Bone", "Grass", "Carrot", "Banana", "Corn"],
    "correct-answer": ["Meat", "Bone"],
    "correct-feedback": "Correct — Lions are carnivores. They eat only animals.",
    "incorrect-feedback": {
      "one-correct-one-incorrect": "Incorrect! A lion eats only animals! Try again!",
      "both-incorrect": "Incorrect! A lion eats only animals! Try again!"
    }
  },
  {
    "animal": "Tiger",
    "food-options": ["Meat", "Fish", "Grass", "Carrot", "Apple", "Corn"],
    "correct-answer": ["Meat", "Fish"],
    "correct-feedback": "Correct — Tigers are carnivores. They eat only animals.",
    "incorrect-feedback": {
      "one-correct-one-incorrect": "Incorrect! A tiger eats only animals! Try again!",
      "both-incorrect": "Incorrect! A tiger eats only animals! Try again!"
    }
  },
  {
    "animal": "Wolf",
    "food-options": ["Meat", "Bone", "Grass", "Carrot", "Berries", "Corn"],
    "correct-answer": ["Meat", "Bone"],
    "correct-feedback": "Correct — Wolves are carnivores. They eat only animals.",
    "incorrect-feedback": {
      "one-correct-one-incorrect": "Incorrect! A wolf eats only animals! Try again!",
      "both-incorrect": "Incorrect! A wolf eats only animals! Try again!"
    }
  },
  {
    "animal": "Shark",
    "food-options": ["Fish", "Meat", "Grass", "Carrot", "Banana", "Corn"],
    "correct-answer": ["Fish", "Meat"],
    "correct-feedback": "Correct — Sharks are carnivores. They eat only animals.",
    "incorrect-feedback": {
      "one-correct-one-incorrect": "Incorrect! A shark eats only animals! Try again!",
      "both-incorrect": "Incorrect! A shark eats only animals! Try again!"
    }
  },
  {
    "animal": "Eagle",
    "food-options": ["Mouse", "Fish", "Grass", "Carrot", "Corn", "Apple"],
    "correct-answer": ["Mouse", "Fish"],
    "correct-feedback": "Correct — Eagles are carnivores. They eat only animals.",
    "incorrect-feedback": {
      "one-correct-one-incorrect": "Incorrect! An eagle eats only animals! Try again!",
      "both-incorrect": "Incorrect! An eagle eats only animals! Try again!"
    }
  },
  {
    "animal": "Snake",
    "food-options": ["Mouse", "Egg", "Grass", "Carrot", "Banana", "Leaves"],
    "correct-answer": ["Mouse", "Egg"],
    "correct-feedback": "Correct — The snake is a carnivore. It feeds on other animals.",
    "incorrect-feedback": {
      "one-correct-one-incorrect": "Incorrect! A snake eats only animals! Try again!",
      "both-incorrect": "Incorrect! A snake eats only animals! Try again!"
    }
  },
  {
    "animal": "Owl",
    "food-options": ["Mouse", "Bug", "Grass", "Carrot", "Corn", "Leaves"],
    "correct-answer": ["Mouse", "Bug"],
    "correct-feedback": "Correct — Owls are carnivores. They eat only animals.",
    "incorrect-feedback": {
      "one-correct-one-incorrect": "Incorrect! An owl eats only animals! Try again!",
      "both-incorrect": "Incorrect! An owl eats only animals! Try again!"
    }
  },
  {
    "animal": "Frog",
    "food-options": ["Bug", "Fish", "Grass", "Carrot", "Banana", "Leaves"],
    "correct-answer": ["Bug", "Fish"],
    "correct-feedback": "Correct — Frogs are carnivores. They eat only animals.",
    "incorrect-feedback": {
      "one-correct-one-incorrect": "Incorrect! A frog eats only animals! Try again!",
      "both-incorrect": "Incorrect! A frog eats only animals! Try again!"
    }
  }
];

const TOTAL_ROUNDS = ANIMALS.length;
const PROGRESS_BAR_MAX_WIDTH = 324.81;

const ANIMAL_IMAGE_MAP = {
  Cow: 'animal-cow',
  Rabbit: 'animal-rabbit',
  Elephant: 'animal-elephant',
  Giraffe: 'animal-girrafe',
  Panda: 'animal-panda',
  Horse: 'animal-horse',
  Goat: 'animal-goat',
  Bear: 'animal-bear',
  Pig: 'animal-pig',
  Monkey: 'animal-monkey',
  Chicken: 'animal-chicken',
  Duck: 'animal-duck',
  Lion: 'animal-lion',
  Tiger: 'animal-tiger',
  Wolf: 'animal-wolf',
  Shark: 'animal-shark',
  Eagle: 'animal-eagle',
  Snake: 'animal-snake',
  Owl: 'animal-owl',
  Frog: 'animal-frog'
};

const FOOD_IMAGE_MAP = {
  Grass: 'opt-grass',
  Corn: 'opt-corn',
  Meat: 'opt-meat',
  Fish: 'opt-fish',
  Bone: 'opt-bone',
  Mouse: 'opt-mouse',
  Carrot: 'opt-carrot',
  Leaves: 'opt-leaves',
  Egg: 'opt-egg',
  Banana: 'opt-banana',
  Apple: 'opt-fruit',
  Bamboo: 'opt-bamboo',
  Berries: 'opt-berries',
  Bug: 'opt-bug',
  Worm: 'opt-worm',
  Lizard: 'opt-snail',
  Grain: 'opt-wheat',
  Spinach: 'opt-leaves'
};

const shuffle = (items) => {
  const list = [...items];
  for (let index = list.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    [list[index], list[swapIndex]] = [list[swapIndex], list[index]];
  }
  return list;
};

const padCount = (value) => String(value).padStart(2, '0');

const getDietType = (animalData) => {
  const answer = animalData['correct-answer'];
  if (answer && !Array.isArray(answer)) return 'omnivore';
  const feedback = animalData['correct-feedback'] || '';
  if (feedback.includes('herbivore')) return 'herbivore';
  if (feedback.includes('carnivore')) return 'carnivore';
  return 'omnivore';
};

const getAnimalImage = (name) => `./assets/image/${ANIMAL_IMAGE_MAP[name] || `animal-${name.toLowerCase()}`}.svg`;

const getFoodImage = (food) => `./assets/image/${FOOD_IMAGE_MAP[food] || 'opt-fruit'}.svg`;

const splitFeedback = (text) => {
  const cleaned = text
    .replace(/^Correct\s*[—–-]\s*/i, '')
    .replace(/^Incorrect!\s*/i, '')
    .replace(/\s*Try again!\s*$/i, '')
    .trim();
  const parts = cleaned.split(/(?<=\.)\s+/);
  return [parts[0] || cleaned, parts.slice(1).join(' ')];
};

const evaluateSelection = (animalData, selectedFoods) => {
  const answer = animalData['correct-answer'];
  if (Array.isArray(answer)) {
    const correctSet = new Set(answer);
    const matchCount = selectedFoods.filter((food) => correctSet.has(food)).length;
    return {
      isCorrect: matchCount === 2 && selectedFoods.length === 2,
      matchCount
    };
  }

  const plantMatch = selectedFoods.some((food) => answer.plant.includes(food));
  const animalMatch = selectedFoods.some((food) => answer.animal.includes(food));
  return {
    isCorrect: plantMatch && animalMatch,
    matchCount: Number(plantMatch) + Number(animalMatch)
  };
};

document.addEventListener('DOMContentLoaded', () => {
  const introScreen = document.getElementById('intro-page');
  const gameScreen = document.getElementById('game-screen');
  const summaryScreen = document.getElementById('summary-screen');
  const startFeedingBtn = document.getElementById('start-feeding-btn');
  const feedBtn = document.getElementById('feed-btn');
  const nextAnimalBtn = document.getElementById('next-animal-btn');
  const playAgainBtn = document.getElementById('play-again-btn');
  const feedOptionsList = document.getElementById('feed-options-list');
  const animalImage = document.getElementById('animal-image');
  const animalQuestionLabel = document.getElementById('animal-question-label');
  const feedBtnText = document.getElementById('feed-btn-text');
  const progressFill = document.getElementById('progress-fill');
  const progressBarText = document.querySelector('#progress-bar-text tspan');
  const correctCountText = document.getElementById('correct-count-text');
  const incorrectCountText = document.getElementById('incorrect-count-text');
  const correctPanel = document.getElementById('correct-panel');
  const incorrectPanel = document.getElementById('incorrect-panel');
  const correctLine1 = document.getElementById('correct-feedback-line1');
  const correctLine2 = document.getElementById('correct-feedback-line2');
  const incorrectLine1 = document.getElementById('incorrect-feedback-line1');
  const incorrectLine2 = document.getElementById('incorrect-feedback-line2');
  const summaryScore = document.getElementById('summary-score');
  const summaryHerbivores = document.getElementById('summary-herbivores');
  const summaryOmnivores = document.getElementById('summary-omnivores');
  const summaryCarnivores = document.getElementById('summary-carnivores');

  if (!introScreen || !gameScreen || !startFeedingBtn || !feedOptionsList) return;

  let queue = [];
  let roundIndex = 0;
  let currentAnimal = null;
  let selectedFoods = [];
  let locked = false;
  let correctCount = 0;
  let incorrectCount = 0;
  let dietScores = { herbivore: 0, omnivore: 0, carnivore: 0 };
  let resetIncorrectTimer = null;

  const setDisplay = (element, value) => {
    if (element) element.style.display = value;
  };

  const hideFeedback = () => {
    setDisplay(correctPanel, 'none');
    setDisplay(incorrectPanel, 'none');
  };

  const updateCounts = () => {
    if (correctCountText) correctCountText.textContent = padCount(correctCount);
    if (incorrectCountText) incorrectCountText.textContent = padCount(incorrectCount);
  };

  const updateProgress = () => {
    const current = Math.min(roundIndex + 1, TOTAL_ROUNDS);
    if (progressBarText) progressBarText.textContent = `${padCount(current)} of ${TOTAL_ROUNDS}`;
    if (progressFill) {
      const width = (current / TOTAL_ROUNDS) * PROGRESS_BAR_MAX_WIDTH;
      progressFill.setAttribute('width', String(Math.max(45, width)));
    }
  };

  const renderFoodOptions = () => {
    selectedFoods = [];
    feedOptionsList.replaceChildren();
    shuffle(currentAnimal['food-options']).forEach((food, index) => {
      const item = document.createElement('li');
      item.className = 'feed-option';
      item.id = `feed-option-${index + 1}`;
      item.dataset.food = food;

      const image = document.createElement('img');
      image.src = getFoodImage(food);
      image.alt = food;

      const label = document.createElement('span');
      label.textContent = food;

      item.append(image, label);
      item.addEventListener('click', () => onFoodClick(item, food));
      feedOptionsList.appendChild(item);
    });
  };

  const showRound = () => {
    locked = false;
    hideFeedback();
    
    // Toggle buttons: Show feedBtn, hide nextAnimalBtn
    setDisplay(feedBtn, 'block');
    setDisplay(nextAnimalBtn, 'none');

    currentAnimal = queue[roundIndex];
    const animalName = currentAnimal.animal;
    const animalKey = animalName.toLowerCase();

    if (animalQuestionLabel) {
      animalQuestionLabel.textContent = `Which food does the ${animalName} eat?`;
    }
    if (animalImage) {
      animalImage.src = getAnimalImage(animalName);
      animalImage.alt = animalName;
      animalImage.onerror = () => {
        animalImage.onerror = null;
        animalImage.src = './assets/image/animal-bear.svg';
      };
    }
    if (feedBtnText) feedBtnText.textContent = `Feed the ${animalKey}`;
    renderFoodOptions();
    updateProgress();
    updateCounts();
  };

  const handleNextAnimal = () => {
    if (roundIndex + 1 >= TOTAL_ROUNDS) {
      showSummary();
      return;
    }
    roundIndex += 1;
    showRound();
  };

  const startGame = () => {
    clearTimeout(resetIncorrectTimer);
    queue = shuffle(ANIMALS);
    roundIndex = 0;
    selectedFoods = [];
    locked = false;
    correctCount = 0;
    incorrectCount = 0;
    dietScores = { herbivore: 0, omnivore: 0, carnivore: 0 };
    setDisplay(introScreen, 'none');
    setDisplay(summaryScreen, 'none');
    setDisplay(gameScreen, 'block');
    hideFeedback();
    showRound();
  };

  const showSummary = () => {
    setDisplay(gameScreen, 'none');
    hideFeedback();
    setDisplay(summaryScreen, 'block');
    if (summaryScore) summaryScore.textContent = `${correctCount}/${TOTAL_ROUNDS}`;
    if (summaryHerbivores) summaryHerbivores.textContent = String(dietScores.herbivore);
    if (summaryOmnivores) summaryOmnivores.textContent = String(dietScores.omnivore);
    if (summaryCarnivores) summaryCarnivores.textContent = String(dietScores.carnivore);
  };

  const markOptions = (isCorrect) => {
    feedOptionsList.querySelectorAll('.feed-option').forEach((item) => {
      item.classList.add('disabled');
      if (!item.classList.contains('selected')) return;
      item.classList.add(isCorrect ? 'correct' : 'wrong');
    });
  };

  const onFoodClick = (item, food) => {
    if (locked) return;
    hideFeedback();

    if (item.classList.contains('selected')) {
      item.classList.remove('selected');
      selectedFoods = selectedFoods.filter((value) => value !== food);
      return;
    }

    if (selectedFoods.length >= 2) return;
    item.classList.add('selected');
    selectedFoods.push(food);
  };

  const submitAnswer = () => {
    if (locked || !currentAnimal || selectedFoods.length !== 2) return;

    const result = evaluateSelection(currentAnimal, selectedFoods);
    locked = true;
    markOptions(result.isCorrect);

    if (result.isCorrect) {
      correctCount += 1;
      dietScores[getDietType(currentAnimal)] += 1;
      const [line1, line2] = splitFeedback(currentAnimal['correct-feedback']);
      if (correctLine1) correctLine1.textContent = line1;
      if (correctLine2) correctLine2.textContent = line2 || '';
      setDisplay(incorrectPanel, 'none');
      setDisplay(correctPanel, 'block');
      updateCounts();

      // Hide Feed button and display Next Animal button
      setDisplay(feedBtn, 'none');
      setDisplay(nextAnimalBtn, 'block');
      return;
    }

    incorrectCount += 1;
    const feedbackKey = result.matchCount === 1 ? 'one-correct-one-incorrect' : 'both-incorrect';
    const [line1] = splitFeedback(currentAnimal['incorrect-feedback'][feedbackKey]);
    if (incorrectLine1) incorrectLine1.textContent = line1;
    if (incorrectLine2) incorrectLine2.textContent = 'Try again!';
    setDisplay(correctPanel, 'none');
    setDisplay(incorrectPanel, 'block');
    updateCounts();

    // Reset wrong attempts so user can retry current round
    resetIncorrectTimer = setTimeout(() => {
      locked = false;
      selectedFoods = [];
      feedOptionsList.querySelectorAll('.feed-option').forEach((item) => {
        item.classList.remove('selected', 'correct', 'wrong', 'disabled');
      });
    }, 1400);
  };

  startFeedingBtn.addEventListener('click', startGame);
  feedBtn?.addEventListener('click', submitAnswer);
  nextAnimalBtn?.addEventListener('click', handleNextAnimal);
  playAgainBtn?.addEventListener('click', startGame);
});