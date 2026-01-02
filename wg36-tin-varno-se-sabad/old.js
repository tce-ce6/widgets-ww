// Word puzzle game script
const words = [
  {
    "word": "गगन",
    "letters": ["ग", "म", "ण", "न", "भ", "स"],
    "answer": ["ग", "ग", "न"]
  },
  {
    "word": "मटर",
    "letters": ["त", "म", "ट", "र", "ग", "भ"],
    "answer": ["म", "ट", "र"]
  },
  {
    "word": "मगर",
    "letters": ["म", "ग", "र", "भ", "स", "न"],
    "answer": ["म", "ग", "र"]
  },
  {
    "word": "शहद",
    "letters": ["ष", "श", "ह", "द", "ध", "ड"],
    "answer": ["श", "ह", "द"]
  },
  {
    "word": "सड़क",
    "letters": ["स", "ड", "श", "ड़", "क", "ख"],
    "answer": ["स", "ड़", "क"]
  },
  {
    "word": "कमल",
    "letters": ["क", "ल", "न", "भ", "ज्ञ", "म"],
    "answer": ["क", "म", "ल"]
  },
  {
    "word": "कलम",
    "letters": ["ख", "क", "त", "न", "म", "ल"],
    "answer": ["क", "ल", "म"]
  },
  {
    "word": "नमक",
    "letters": ["ण", "न", "भ", "क", "व", "म"],
    "answer": ["न", "म", "क"]
  },
  {
    "word": "बटन",
    "letters": ["त", "ज", "ट", "ब", "व", "न"],
    "answer": ["ब", "ट", "न"]
  },
  {
    "word": "भवन",
    "letters": ["न", "भ", "ब", "व", "छ", "म"],
    "answer": ["भ", "व", "न"]
  },
  {
    "word": "फसल",
    "letters": ["प", "र", "फ", "स", "ज्ञ", "ल"],
    "answer": ["फ", "स", "ल"]
  },
  {
    "word": "हवन",
    "letters": ["ह", "झ", "त्र", "व", "न", "क्ष"],
    "answer": ["ह", "व", "न"]
  },
  {
    "word": "नयन",
    "letters": ["य", "ण", "र", "न", "ख", "श"],
    "answer": ["न", "य", "न"]
  },
  {
    "word": "कलश",
    "letters": ["भ", "क", "श", "ल", "स", "न"],
    "answer": ["क", "ल", "श"]
  },
  {
    "word": "रबड़",
    "letters": ["ड़", "ब", "ड", "द", "व", "र"],
    "answer": ["र", "ब", "ड़"]
  },
  {
    "word": "शहर",
    "letters": ["ह", "र", "श", "इ", "ष", "स"],
    "answer": ["श", "ह", "र"]
  },
  {
    "word": "गरम",
    "letters": ["र", "ग", "भ", "म", "य", "ह"],
    "answer": ["ग", "र", "म"]
  },
  {
    "word": "चरण",
    "letters": ["न", "ण", "च", "ज", "र", "स"],
    "answer": ["च", "र", "ण"]
  },
  {
    "word": "महल",
    "letters": ["म", "न", "ह", "स", "ल", "ज्ञ"],
    "answer": ["म", "ह", "ल"]
  },
  {
    "word": "नहर",
    "letters": ["र", "स", "ह", "न", "झ", "ग"],
    "answer": ["न", "ह", "र"]
  }
];

// Game state
let currentWordIndex = 0;
let currentWord = null;
let answerSlots = ["", "", ""]; // Three answer slots
let letterButtons = [];
let answerSlotElements = [];

// Audio mapping for letters
const letterAudioMap = {
  "ग": "02_ग.wav", "म": "24_म.wav", "ण": "14_ण.wav", "न": "19_न.wav",
  "भ": "23_भ.wav", "स": "31_स.wav", "त": "15_त.wav", "ट": "08_ट.wav",
  "र": "26_र.wav", "श": "29_श.wav", "ह": "32_ह.wav", "द": "17_द.wav",
  "ध": "18_ध.wav", "ड": "10_ड.wav", "ड़": "11_ड़.wav", "क": "00_क.wav",
  "ख": "01_ख.wav", "ल": "27_ल.wav", "ब": "22_ब.wav", "व": "28_व.wav",
  "फ": "21_फ.wav", "प": "20_प.wav", "य": "25_य.wav", "च": "04_च.wav",
  "ज": "06_ज.wav", "झ": "07_झ.wav", "इ": "02_इ.wav", "ष": "30_ष.wav",
  "क्ष": "33_क्ष.wav", "त्र": "34_त्र.wav", "ज्ञ": "35_ग्य.wav"
};

/**
 * Selects a random word from the words array
 */
function selectRandomWord() {
  currentWordIndex = Math.floor(Math.random() * words.length);
  currentWord = words[currentWordIndex];
  return currentWord;
}

/**
 * Gets the audio file path for a letter
 */
function getLetterAudioPath(letter) {
  const audioFile = letterAudioMap[letter];
  if (audioFile) {
    return `Assets/Audio/Vyanjan_Sound/${audioFile}`;
  }
  return null;
}

/**
 * Plays audio for a letter
 */
function playLetterSound(letter) {
  const audioPath = getLetterAudioPath(letter);
  if (audioPath) {
    const audio = new Audio(audioPath);
    audio.play().catch(err => console.log("Audio play failed:", err));
  }
}

/**
 * Plays word sound
 */
function playWordSound() {
  if (currentWord && currentWord.word) {
    // Normalize word name for file (remove diacritics that might cause issues)
    const wordName = currentWord.word;
    const audioPath = `Assets/Audio/Word sound/${wordName}.mp3`;
    const audio = new Audio(audioPath);
    audio.play().catch(err => console.log("Word audio play failed:", err));
  }
}

/**
 * Initializes the game
 */
function initGame() {
  // Get letter button elements
  const buttonGroups = document.querySelectorAll('.letter-button');
  letterButtons = Array.from(buttonGroups);
  
  // Get answer slot elements
  answerSlotElements = [
    document.getElementById('answer-slot-1'),
    document.getElementById('answer-slot-2'),
    document.getElementById('answer-slot-3')
  ];
  
  // Ensure answer slots exist
  if (answerSlotElements.some(slot => !slot)) {
    console.warn("Some answer slots are missing");
  }
  
  // Load a random word only if we haven't loaded one yet
  if (!currentWord) {
    loadWord(selectRandomWord());
  }
}

/**
 * Loads a word and updates the UI
 */
function loadWord(word) {
  currentWord = word;
  answerSlots = ["", "", ""];
  
  // Update answer slots
  answerSlotElements.forEach((slot, index) => {
    if (slot) {
      slot.textContent = "";
    }
  });
  
  // Shuffle letters for display
  const shuffledLetters = [...word.letters].sort(() => Math.random() - 0.5);
  
  // Update letter buttons - refresh the list first
  letterButtons = Array.from(document.querySelectorAll('.letter-button'));
  letterButtons.forEach((button, index) => {
    if (index < shuffledLetters.length) {
      const textElement = button.querySelector('text tspan');
      if (textElement) {
        textElement.textContent = shuffledLetters[index];
      }
      // Store the letter in the button's dataset
      button.dataset.letter = shuffledLetters[index];
    }
  });
  
  // Reset button styles
  letterButtons.forEach(button => {
    button.style.opacity = "1";
    button.querySelector('path[fill="#3CD3C4"]')?.setAttribute('fill', '#3CD3C4');
  });
  
  // Hide final image initially
  hideFinalImage();
}

/**
 * Shows the final image when word is correct
 */
function showFinalImage() {
  if (!currentWord) return;
  
  const wordName = currentWord.word;
  // Map word names to final image filenames
  const imageMap = {
    "गगन": "GR_Gagan.svg",
    "मटर": "GR_matar.svg",
    "मगर": "GR_magar.svg",
    "शहद": "GR_Shahad.svg",
    "सड़क": "GR_Sadak.svg",
    "कमल": "GR_Kamal.svg",
    "कलम": "GR_Kalam.svg",
    "नमक": "GR_Namak.svg",
    "बटन": "GR_Batan.svg",
    "भवन": "GR_Bhavan.svg",
    "फसल": "GR_Fasal.svg",
    "हवन": "GR_Havan.svg",
    "नयन": "GR_Nayan.svg",
    "कलश": "GR_Kalash.svg",
    "रबड़": "GR_Rabar.svg",
    "शहर": "GR_Shahar.svg",
    "गरम": "GR_Garam.svg",
    "चरण": "GR_Charan.svg",
    "महल": "GR_Mahal.svg",
    "नहर": "GR_Nahar.svg"
  };

  // const imageMap = {
  //   "गगन": "Gagan.json",
  //   "मटर": "matar.json",
  //   "मगर": "magar.json",
  //   "शहद": "Shahad.json",
  //   "सड़क": "Sadak.json",
  //   "कमल": "Kamal.json",
  //   "कलम": "Kalam.json",
  //   "नमक": "Namak.json",
  //   "बटन": "Batan.json",
  //   "भवन": "Bhavan.json",
  //   "फसल": "Fasal.json",
  //   "हवन": "Havan.json",
  //   "नयन": "Nayan.json",
  //   "कलश": "Kalash.json",
  //   "रबड़": "Rabar.json",
  //   "शहर": "Shahar.json",
  //   "गरम": "Garam.json",
  //   "चरण": "Charan.json",
  //   "महल": "Mahal.json",
  //   "नहर": "Nahar.json"
  // };
    
    // Show final image - create an image element in the image area
    const imageContainer = document.getElementById('Group 217');
    if (imageContainer) {
      // Remove existing final image if any
      const existingFinal = document.getElementById('final-image');
      if (existingFinal) {
        existingFinal.remove();
      }
      
      // Create and add final image using SVG image element
      // Position it on the left side of the image area
      const svgNS = 'http://www.w3.org/2000/svg';
      const xlinkNS = 'http://www.w3.org/1999/xlink';
      const img = document.createElementNS(svgNS, 'image');
      img.setAttribute('id', 'final-image');
      // Use xlink:href for compatibility (SVG already has xlink namespace declared)
      img.setAttributeNS(xlinkNS, 'href', `Assets/Images/Final images/${finalImageName}`);
      // Also set href for modern browsers that support it
      img.setAttribute('href', `Assets/Images/Final images/${finalImageName}`);
      // Position on the left side - adjust coordinates as needed based on viewBox
      img.setAttribute('x', '50');
      img.setAttribute('y', '200');
      img.setAttribute('width', '450');
      img.setAttribute('height', '450');
      img.setAttribute('preserveAspectRatio', 'xMidYMid meet');
      
      setTimeout(() => {
        imageContainer.appendChild(img);
        playWordSound();
      }, 1000);
    }
  }

/**
 * Hides the final image and shows puzzled images
 */
function hideFinalImage() {
  // Remove final image if exists
  const finalImage = document.getElementById('final-image');
  if (finalImage) {
    finalImage.remove();
  }
}

/**
 * Handles letter button click
 */
function handleLetterClick(button) {
  const letter = button.dataset.letter;
  if (!letter || !currentWord) return;
  
  // Play letter sound
  playLetterSound(letter);
  
  // Find first empty slot
  let emptySlotIndex = answerSlots.findIndex(slot => slot === "");
  if (emptySlotIndex === -1) {
    // All slots are filled, replace the last one
    emptySlotIndex = 2;
  }
  
  // Check if the letter is correct for this position
  const correctLetter = currentWord.answer[emptySlotIndex];
  const isCorrect = letter === correctLetter;
  
  if (isCorrect) {
    // Correct letter - place it in slot
    answerSlots[emptySlotIndex] = letter;
    
    // Update UI
    if (answerSlotElements[emptySlotIndex]) {
      answerSlotElements[emptySlotIndex].textContent = letter;
    }
    
    // Remove any wrong-letter class from button
    button.classList.remove('wrong-letter', 'shake-button');
    
    // Check if answer is complete
    if (answerSlots[0] !== "" && answerSlots[1] !== "" && answerSlots[2] !== "") {
      checkAnswer();
    }
  } else {
    // Wrong letter - shake button and show red border
    shakeLetterButton(button);
  }
}

/**
 * Shakes the letter button (1px) and shows red border for wrong selection
 */
function shakeLetterButton(button) {
  // Remove previous classes
  button.classList.remove('wrong-letter', 'shake-button');
  
  // Force reflow to restart animation
  void button.offsetWidth;
  
  // Add shake animation class
  button.classList.add('shake-button');
  
  // Find the main button path (the one that forms the button shape)
  // Look for paths with fill="#3CD3C4" (the main button color)
  const mainPaths = button.querySelectorAll('path[fill="#3CD3C4"]');
  
  mainPaths.forEach(path => {
    // Store original stroke if not already stored
    if (!path.dataset.originalStroke) {
      const currentStroke = path.getAttribute('stroke');
      path.dataset.originalStroke = currentStroke || 'none';
    }
    if (!path.dataset.originalStrokeWidth) {
      const currentStrokeWidth = path.getAttribute('stroke-width');
      path.dataset.originalStrokeWidth = currentStrokeWidth || '0';
    }
    
    // Apply red border - add stroke if it doesn't exist
    path.setAttribute('stroke', '#ff0000');
    path.setAttribute('stroke-width', '4');
    path.setAttribute('stroke-linejoin', 'round');
    path.setAttribute('stroke-linecap', 'round');
  });
  
  // Also add red border class for CSS styling
  button.classList.add('wrong-letter');
  
  // Remove classes and restore original styling after animation
  setTimeout(() => {
    button.classList.remove('shake-button', 'wrong-letter');
    
    // Restore original stroke to all paths
    const allPaths = button.querySelectorAll('path');
    allPaths.forEach(path => {
      if (path.dataset.originalStroke !== undefined) {
        const originalStroke = path.dataset.originalStroke;
        if (originalStroke === 'none') {
          path.removeAttribute('stroke');
        } else {
          path.setAttribute('stroke', originalStroke);
        }
      }
      if (path.dataset.originalStrokeWidth !== undefined) {
        const originalWidth = path.dataset.originalStrokeWidth;
        if (originalWidth === '0') {
          path.removeAttribute('stroke-width');
        } else {
          path.setAttribute('stroke-width', originalWidth);
        }
      }
      // Remove stroke attributes we added
      path.removeAttribute('stroke-linejoin');
      path.removeAttribute('stroke-linecap');
    });
  }, 300);
}

/**
 * Checks if the answer is correct
 */
function checkAnswer() {
  if (!currentWord) return;
  
  const userAnswer = answerSlots.join("");
  const correctAnswer = currentWord.answer.join("");
  
  // Compare answers
  if (userAnswer === correctAnswer) {
    // Correct answer
    showFinalImage();
    // Play success sound or show success message
    setTimeout(() => {
      // Auto-load next word after a delay
      // loadWord(selectRandomWord());
    }, 2000);
  } else {
    // Wrong answer - shake animation and red boundary
    shakeAnswerSlots();
  }
}

/**
 * Shakes answer slots with red boundary for wrong answer
 * (This is called when all slots are filled but the complete word is wrong)
 */
function shakeAnswerSlots() {
  answerSlotElements.forEach(slot => {
    if (slot) {
      // Add shake animation class
      slot.classList.add('shake');
    }
  });
  
  // Add red stroke to the answer box
  const answerBox = document.querySelector('#Vector_3');
  if (answerBox) {
    const originalStroke = answerBox.getAttribute('stroke');
    const originalWidth = answerBox.getAttribute('stroke-width');
    answerBox.setAttribute('stroke', '#ff0000');
    answerBox.setAttribute('stroke-width', '20');
    
    // Reset after animation
    setTimeout(() => {
      answerBox.setAttribute('stroke', originalStroke || '#376FC4');
      answerBox.setAttribute('stroke-width', originalWidth || '15');
      answerSlotElements.forEach(slot => {
        if (slot) {
          slot.classList.remove('shake');
        }
      });
    }, 500);
  }
  
  // Clear answer slots after shake
  setTimeout(() => {
    answerSlots = ["", "", ""];
    answerSlotElements.forEach(slot => {
      if (slot) {
        slot.textContent = "";
      }
    });
  }, 500);
}

/**
 * Resets the game with a new word
 */
function resetSentence() {
  loadWord(selectRandomWord());
}

/**
 * Shows the answer
 */
function showAnswer() {
  if (!currentWord) return;
  
  // Fill answer slots with correct answer
  currentWord.answer.forEach((letter, index) => {
    answerSlots[index] = letter;
    if (answerSlotElements[index]) {
      answerSlotElements[index].textContent = letter;
    }
  });
  
  // Show final image
  showFinalImage();
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  // Wait a bit for SVG to fully render
  setTimeout(() => {
    initGame();
    
    // Add click handlers to letter buttons
    const buttonGroups = document.querySelectorAll('.letter-button');
    buttonGroups.forEach(button => {
      button.addEventListener('click', function(e) {
        e.stopPropagation();
        handleLetterClick(this);
      });
    });
    
    // Add click handler to sound button
    const soundButton = document.querySelector('.sound-button') || document.getElementById('Group 196');
    if (soundButton) {
      soundButton.style.cursor = 'pointer';
      soundButton.addEventListener('click', function(e) {
        e.stopPropagation();
        playWordSound();
      });
    }
    
    // Update button handlers
    const showAnswerBtn = document.getElementById('show-example-btn');
    if (showAnswerBtn) {
      showAnswerBtn.onclick = showAnswer;
    }
    
    const resetBtn = document.getElementById('next-btn');
    if (resetBtn) {
      resetBtn.onclick = resetSentence;
    }
  }, 200);
});

