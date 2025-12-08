
const words = [
  {
    word: "अजगर",
    grid_data: [
      ["र", "क", "म", "त", "न"],
      ["ल", "अ", "ज", "ग", "र"],
      ["प", "स", "व", "द", "ह"],
      ["य", "ब", "च", "ए", "श"],
      ["ज", "ख", "ग", "थ", "फ"]
    ],
    correct_answer_char_array: ["अ", "ज", "ग", "र"]
  },
  {
    word: "कटहल",
    grid_data: [
      ["म", "न", "र", "स", "प"],
      ["ब", "क", "व", "च", "ध"],
      ["य", "ट", "ज", "द", "श"],
      ["ग", "ह", "थ", "ए", "फ"],
      ["ख", "ल", "ण", "औ", "झ"]
    ],
    correct_answer_char_array: ["क", "ट", "ह", "ल"]
  },
  {
    word: "खटमल",
    grid_data: [
      ["म", "ख", "र", "स", "प"],
      ["ब", "ट", "ज", "द", "ल"],
      ["य", "म", "व", "ए", "श"],
      ["ग", "ल", "थ", "च", "फ"],
      ["क", "ध", "ण", "औ", "झ"]
    ],
    correct_answer_char_array: ["ख", "ट", "म", "ल"]
  },
  {
    word: "बचपन",
    grid_data: [
      ["म", "ख", "र", "स", "प"],
      ["ल", "ब", "ज", "द", "श"],
      ["य", "व", "च", "ए", "क"],
      ["ग", "थ", "त", "प", "फ"],
      ["झ", "ध", "ण", "औ", "न"]
    ],
    correct_answer_char_array: ["ब", "च", "प", "न"]
  },
  {
    word: "बरगद",
    grid_data: [
      ["म", "ख", "ध", "ब", "प"],
      ["ल", "त", "ए", "र", "श"],
      ["य", "भ", "च", "ग", "क"],
      ["प", "थ", "न", "द", "फ"],
      ["र", "ध", "ण", "औ", "स"]
    ],
    correct_answer_char_array: ["ब", "र", "ग", "द"]
  },
  {
    word: "शलगम",
    grid_data: [
      ["म", "ख", "र", "ब", "प"],
      ["ल", "त", "ग", "द", "श"],
      ["य", "च", "न", "ए", "ल"],
      ["द", "थ", "श", "प", "ग"],
      ["झ", "ध", "ण", "आ", "म"]
    ],
    correct_answer_char_array: ["श", "ल", "ग", "म"]
  },
  {
    word: "शरबत",
    grid_data: [
      ["स", "ह", "ध", "ब", "प"],
      ["ल", "त", "ग", "द", "स"],
      ["य", "च", "ल", "ए", "क"],
      ["श", "र", "ब", "त", "फ"],
      ["झ", "ध", "ण", "ई", "श"]
    ],
    correct_answer_char_array: ["श", "र", "ब", "त"]
  },
  {
    word: "पनघट",
    grid_data: [
      ["प", "ख", "र", "ब", "श"],
      ["ल", "न", "ग", "द", "व"],
      ["य", "च", "घ", "ए", "क"],
      ["म", "ब", "र", "ट", "फ"],
      ["झ", "ध", "ण", "ज्ञ", "स"]
    ],
    correct_answer_char_array: ["प", "न", "घ", "ट"]
  },
  {
    word: "उपवन",
    grid_data: [
      ["उ", "ख", "र", "ऊ", "श"],
      ["ल", "प", "फ", "द", "व"],
      ["य", "भ", "व", "ए", "क"],
      ["न", "ब", "र", "न", "फ"],
      ["झ", "घ", "ग", "अ", "स"]
    ],
    correct_answer_char_array: ["उ", "प", "व", "न"]
  },
  {
    word: "करवट",
    grid_data: [
      ["प", "ख", "र", "उ", "श"],
      ["ल", "त", "प", "द", "व"],
      ["क", "र", "व", "ट", "ज"],
      ["न", "ब", "म", "ए", "फ"],
      ["झ", "ज्ञ", "ण", "ओ", "श"]
    ],
    correct_answer_char_array: ["क", "र", "व", "ट"]
  },
  {
    word: "कसरत",
    grid_data: [
      ["फ", "ख", "क", "उ", "ह"],
      ["ल", "त", "स", "द", "व"],
      ["म", "ब", "र", "ए", "ज"],
      ["न", "ग", "त", "य", "फ"],
      ["झ", "भ", "न", "औ", "च"]
    ],
    correct_answer_char_array: ["क", "स", "र", "त"]
  },
  {
    word: "परवल",
    grid_data: [
      ["ज", "घ", "ड़", "ई", "ञ"],
      ["छ", "ओ", "भ", "ऋ", "ठ"],
      ["ष", "ऐ", "ङ", "फ", "इ"],
      ["ढ", "औ", "झ", "ए", "उ"],
      ["प", "र", "व", "ल", "ह"]
    ],
    correct_answer_char_array: ["प", "र", "व", "ल"]
  },
  {
    word: "पचपन",
    grid_data: [
      ["ट", "ध", "ल", "ऊ", "प"],
      ["भ", "क", "म", "ऐ", "च"],
      ["र", "ष", "ज", "औ", "प"],
      ["ङ", "थ", "व", "इ", "न"],
      ["ढ़", "ख", "ग", "ए", "स"]
    ],
    correct_answer_char_array: ["प", "च", "प", "न"]
  },
  {
    word: "अदरक",
    grid_data: [
      ["ल", "ञ", "घ", "फ", "ष"],
      ["म", "अ", "द", "र", "क"],
      ["छ", "ठ", "इ", "ज", "ऐ"],
      ["ए", "ई", "औ", "भ", "त"],
      ["स", "ड", "ण", "व", "य"]
    ],
    correct_answer_char_array: ["अ", "द", "र", "क"]
  },
  {
    word: "बरतन",
    grid_data: [
      ["ख", "ब", "र", "त", "न"],
      ["घ", "ज", "ऐ", "ड", "प"],
      ["ठ", "औ", "य", "इ", "म"],
      ["छ", "ष", "ञ", "व", "ल"],
      ["फ", "ए", "ऊ", "ग", "ध"]
    ],
    correct_answer_char_array: ["ब", "र", "त", "न"]
  },
  {
    word: "चमचम",
    grid_data: [
      ["च", "ऋ", "ञ", "घ", "ष"],
      ["म", "द", "व", "प", "ऐ"],
      ["च", "ज", "ठ", "इ", "औ"],
      ["म", "भ", "र", "ए", "म"],
      ["य", "ख", "त", "ऊ", "फ"]
    ],
    correct_answer_char_array: ["च", "म", "च", "म"]
  },
  {
    word: "दलदल",
    grid_data: [
      ["ठ", "ऐ", "घ", "इ", "ञ"],
      ["म", "ष", "व", "ए", "र"],
      ["च", "औ", "प", "ऋ", "य"],
      ["द", "ल", "द", "ल", "फ"],
      ["ज", "ख", "भ", "ऊ", "ह"]
    ],
    correct_answer_char_array: ["द", "ल", "द", "ल"]
  },
  {
    word: "थरमस",
    grid_data: [
      ["ढ", "औ", "ञ", "ई", "ग"],
      ["ज", "इ", "ऐ", "प", "ल"],
      ["थ", "र", "म", "स", "ख"],
      ["व", "द", "छ", "य", "ऊ"],
      ["भ", "ए", "फ", "ट", "ण"]
    ],
    correct_answer_char_array: ["थ", "र", "म", "स"]
  },
  {
    word: "पतझड़",
    grid_data: [
      ["ष", "म", "ऐ", "ड", "ग"],
      ["छ", "प", "व", "झ", "ञ"],
      ["य", "इ", "त", "ऊ", "औ"],
      ["भ", "ए", "ख", "झ", "ऋ"],
      ["र", "ध", "फ", "ज", "ड़"]
    ],
    correct_answer_char_array: ["प", "त", "झ", "ड़"]
  },
  {
    word: "उपटन",
    grid_data: [
      ["घ", "न", "ऋ", "च", "ष"],
      ["म", "ट", "औ", "ज", "इ"],
      ["य", "ऐ", "फ", "द", "व"],
      ["ख", "भ", "ए", "ऊ", "ठ"],
      ["फ", "उ", "प", "ट", "न"]
    ],
    correct_answer_char_array: ["उ", "प", "ट", "न"]
  }
];

const letterAudioMap = {
  "अ": { folder: "Swar_Sound", file: "00_a.wav" }, "आ": { folder: "Swar_Sound", file: "01_aa.wav" },
  "इ": { folder: "Swar_Sound", file: "02_e.wav" }, "ई": { folder: "Swar_Sound", file: "03_ee.wav" },
  "उ": { folder: "Swar_Sound", file: "04_o.wav" }, "ऊ": { folder: "Swar_Sound", file: "05_oo.wav" },
  "ए": { folder: "Swar_Sound", file: "07_ae.wav" }, "ऐ": { folder: "Swar_Sound", file: "08_aae.wav" },
  "ओ": { folder: "Swar_Sound", file: "09_ao.wav" }, "औ": { folder: "Swar_Sound", file: "10_aao.wav" },
  "क": { folder: "Vyanjan_Sound", file: "00_ka.wav" }, "ख": { folder: "Vyanjan_Sound", file: "01_kha.wav" },
  "ग": { folder: "Vyanjan_Sound", file: "02_ga.wav" }, "घ": { folder: "Vyanjan_Sound", file: "03_gha.wav" },
  "च": { folder: "Vyanjan_Sound", file: "04_ch.wav" }, "छ": { folder: "Vyanjan_Sound", file: "05_cha.wav" },
  "ज": { folder: "Vyanjan_Sound", file: "06_ja.wav" }, "झ": { folder: "Vyanjan_Sound", file: "07_jha.wav" },
  "ट": { folder: "Vyanjan_Sound", file: "08_ta.wav" }, "ठ": { folder: "Vyanjan_Sound", file: "09_tha.wav" },
  "ड": { folder: "Vyanjan_Sound", file: "10_dha.wav" }, "ड़": { folder: "Vyanjan_Sound", file: "11_adha.wav" },
  "ढ": { folder: "Vyanjan_Sound", file: "12_ddha.wav" }, "त": { folder: "Vyanjan_Sound", file: "15_ta.wav" },
  "थ": { folder: "Vyanjan_Sound", file: "16_tha.wav" }, "द": { folder: "Vyanjan_Sound", file: "17_da.wav" },
  "ध": { folder: "Vyanjan_Sound", file: "18_dah.wav" }, "न": { folder: "Vyanjan_Sound", file: "19_na.wav" },
  "प": { folder: "Vyanjan_Sound", file: "20_pa.wav" }, "फ": { folder: "Vyanjan_Sound", file: "21_pha.wav" },
  "ब": { folder: "Vyanjan_Sound", file: "22_ba.wav" }, "भ": { folder: "Vyanjan_Sound", file: "23_bha.wav" },
  "म": { folder: "Vyanjan_Sound", file: "24_ma.wav" }, "य": { folder: "Vyanjan_Sound", file: "25_ya.wav" },
  "र": { folder: "Vyanjan_Sound", file: "26_ra.wav" }, "ल": { folder: "Vyanjan_Sound", file: "27_la.wav" },
  "व": { folder: "Vyanjan_Sound", file: "28_wa.wav" }, "श": { folder: "Vyanjan_Sound", file: "29_sha.wav" },
  "ष": { folder: "Vyanjan_Sound", file: "30_sa.wav" }, "स": { folder: "Vyanjan_Sound", file: "31_s.wav" },
  "ह": { folder: "Vyanjan_Sound", file: "32_ha.wav" }, "ज्ञ": { folder: "Vyanjan_Sound", file: "35_gya.wav" },
  "अं": { folder: "Swar_Sound", file: "11_anga.wav" }, "अः": { folder: "Swar_Sound", file: "12_aha.wav" },
  "ऋ": { folder: "Swar_Sound", file: "06_ऋ.wav" }, "क्ष": { folder: "Vyanjan_Sound", file: "33_chha.wav" },
  "त्र": { folder: "Vyanjan_Sound", file: "34_tra.wav" }, "ञ": { folder: "Vyanjan_Sound", file: "14_nan.wav" },
  "ङ": { folder: "Vyanjan_Sound", file: "03_ङ.wav" }, "ण": { folder: "Vyanjan_Sound", file: "13_addha.wav" },
};

const wordAudioFileNameMap = {
  "अजगर": "अजगर.mp3", "कटहल": "कटहल.mp3", "खटमल": "खटमल.mp3",
  "बचपन": "बचपन.mp3", "बरगद": "बरगद.mp3", "शलगम": "शलगम.mp3",
  "शरबत": "शरबत.mp3", "पनघट": " पनघट.mp3", "उपवन": "उपवन.mp3",
  "करवट": "करवट.mp3", "कसरत": "कसरत.mp3", "परवल": "परवल.mp3",
  "पचपन": "पचपन.mp3", "अदरक": "अदरक.mp3", "बरतन": "बरतन.mp3",
  "चमचम": "चमचम.mp3", "दलदल": "दलदल.mp3", "थरमस": "थरमस.mp3",
  "पतझड़": "पतझड़.mp3", "उपटन": "उपटन.mp3"
};

const wordImageMap = {
  "अजगर": "अजगर.svg", "कटहल": "कटहल.svg", "खटमल": "खटमल.svg",
  "बचपन": "बचपन.svg", "बरगद": "बरगद.svg", "शलगम": "शलगम.svg",
  "शरबत": "शरबत.svg", " पनघट": "पनघट.svg", "उपवन": "उपवन.svg",
  "करवट": "करवट.svg", "कसरत": "कसरत.svg", "परवल": "परवल.svg",
  "पचपन": "पचपन.svg", "अदरक": "अदरक.svg", "बरतन": "बरतन.svg",
  "चमचम": "चमचम.svg", "दलदल": "दलदल.svg", "थरमस": "थरमस.svg",
  "पतझड़": "पतझड़.svg", "उपटन": "उपटन.svg"
};

// --- Constants and State ---
const GRID_SIZE = 5;
const CORRECT_LETTER_FILL = "#1B5E20"; // Dark Green letter color
const WRONG_LETTER_FILL = "#D50000";  // Red letter color
const WRONG_FEEDBACK_DURATION = 300;
const DEFAULT_LETTER_FILL = "#000000"; // Default black letter color

let gridCellMetas = [];
let currentWordIndex = -1;
let currentWord = null;
let userAnswerArray = [];
let usedCellMetas = []; // Holds the Meta objects for cells that are currently green
let isGameLocked = false;
let isWordCompleted = false;
let activeLetterAudio = null;
let activeWordAudio = null;
let isShowAnswer = false;

let finalImageElement = null; // ID: final-image-container
let showAnswerButtonRef = null;


// --- Audio Functions (Unchanged) ---
function getLetterAudioPath(letter) {
  const config = letterAudioMap[letter];
  return config ? `Assets/Audio/${config.folder}/${config.file}` : null;
}

function playLetterSound(letter) {
  const audioPath = getLetterAudioPath(letter);
  if (!audioPath) return;
  if (activeLetterAudio) {
    try { activeLetterAudio.pause(); activeLetterAudio.currentTime = 0; } catch (e) { }
  }
  activeLetterAudio = new Audio(audioPath);
  activeLetterAudio.play().catch(e => console.log("Letter audio play failed:", e));
}

function getWordAudioFileName(wordName) {
  return wordAudioFileNameMap[wordName] || `${wordName}.mp3`;
}

//working Fine
function playWordSound() {
  if (!currentWord || !currentWord.word) return;
  const audioFile = getWordAudioFileName(currentWord.word);
  const audioPath = `Assets/Audio/Word_sound/${audioFile}`;

  if (activeWordAudio) {
    try { activeWordAudio.pause(); activeWordAudio.currentTime = 0; } catch (e) { }
  }

  activeWordAudio = new Audio(audioPath);
  activeWordAudio.play().catch(e => console.log("Word audio play failed:", e));
}

// --- Grid Mapping (Unchanged) ---

function getGroupId(row, col) {
  const index = row * GRID_SIZE + col;
  const idNumber = 853 + index * 10;
  return `Group ${idNumber}`;
}

function prepareGridCellsById() {
  if (gridCellMetas.length) return;

  for (let r = 0; r < GRID_SIZE; r++) {
    for (let c = 0; c < GRID_SIZE; c++) {
      const id = getGroupId(r, c);
      const groupElement = document.getElementById(id);

      if (!groupElement) continue;

      const tspanElement = groupElement.querySelector("tspan");
      const rectElement = groupElement.querySelector("rect"); // Keep reference to rect for sound button state only

      const meta = {
        element: groupElement,
        tspan: tspanElement,
        rect: rectElement,
        row: r,
        col: c,
        isUsed: false,
        originalFill: tspanElement ? tspanElement.getAttribute("fill") || DEFAULT_LETTER_FILL : DEFAULT_LETTER_FILL,
        letter: "",
      };

      gridCellMetas.push(meta);

      if (groupElement && !groupElement.__wordSearchBound) {
        groupElement.__wordSearchBound = true;
        groupElement.style.cursor = "pointer";
        groupElement.addEventListener("click", () => handleCellClick(meta));
      }
    }
  }
}

// --- Grid Logic ---

/**
 * Resets the visual appearance and the 'isUsed' state of ALL grid cells.
 */
function resetGridVisuals() {
  gridCellMetas.forEach((meta) => {
    meta.isUsed = false;
    if (meta.tspan) {
      meta.tspan.setAttribute("fill", meta.originalFill);
    }
  });
  usedCellMetas = []; // Clear the sequence of used cells
}

/**
 * Resets the visual appearance and 'isUsed' state only for the currently correct cells.
 * Used when hiding the "Show Answer" result.
 */
function resetCorrectCellsVisuals() {
  usedCellMetas.forEach(meta => {
    meta.isUsed = false;
    if (meta.tspan) {
      meta.tspan.setAttribute("fill", meta.originalFill);
    }
  });
  // Do NOT clear userAnswerArray here, as the user might be mid-attempt.
  usedCellMetas = [];
}


function flattenGrid(grid) {
  return grid.reduce((acc, row) => acc.concat(row), []);
}

// --- Game Flow Functions ---

function markCellAsCorrect(meta) {
  if (!meta || meta.isUsed) return; // Should not happen but good guard

  meta.isUsed = true;
  usedCellMetas.push(meta); // Track the cell in the correct sequence

  if (meta.tspan) {
    meta.tspan.setAttribute("fill", CORRECT_LETTER_FILL);
  }
}

/**
 * Blink a single cell red.
 * @param {object} meta The cell meta object to blink.
 */
function blinkSingleWrongFeedback(meta) {
  if (!meta) return;

  // Blink Red
  if (meta.tspan) meta.tspan.setAttribute("fill", WRONG_LETTER_FILL);

  // Revert after duration
  setTimeout(() => {
    if (meta.tspan) meta.tspan.setAttribute("fill", meta.originalFill);
    // Game remains unlocked. Correct sequence is preserved.
  }, WRONG_FEEDBACK_DURATION);
}

function loadWord(word, gridToLoad) {
  if (!word || !gridCellMetas.length) return;

  // Reset state
  currentWord = word;
  userAnswerArray = [];
  isGameLocked = false;
  isWordCompleted = false;

  if (showAnswerButtonRef) {
    showAnswerButtonRef.textContent = "उत्तर देखें";
  }

  currentWord.grid_data = gridToLoad;

  hideFinalImage();
  resetGridVisuals();

  // Update the letter content in the SVG
  const letters = flattenGrid(currentWord.grid_data);
  gridCellMetas.forEach((meta, index) => {
    const letter = letters[index] || "";
    meta.letter = letter;
    meta.isUsed = false;
    if (meta.tspan) {
      meta.tspan.textContent = letter;
    }
  });

  // Activate the sound prompt pulse
  setSoundPromptState(true);
}

function getNextWord() {
  if (!words.length) return null;

  currentWordIndex = (currentWordIndex + 1);
  if (currentWordIndex >= words.length) {
    currentWordIndex = 0; // Cycle back to the start if done
    console.log("Cycling back to the first word.");
  }
  return words[currentWordIndex];
}

// Normal function exposed via event listener
function resetSentence() {
  // Stop previous audio
  if (activeWordAudio) {
    activeWordAudio.pause();
    activeWordAudio.currentTime = 0;
  }

  const nextWord = getNextWord();
  if (nextWord) {
    loadWord(nextWord, nextWord.grid_data);
  } else {
    console.error("Error: Word list is empty.");
  }
}

function handleWordComplete() {
  if (isWordCompleted) return;
  isWordCompleted = true;
  isGameLocked = true;
  setSoundPromptState(false);
  setTimeout(() => {
    playWordSound(); // Play word sound only on natural completion
    showFinalImage();
    showAnswerButtonRef.disabled = true;
  }, 1000);

  // if (showAnswerButtonRef) {
  //    showAnswerButtonRef.textContent = "उत्तर छुपाएँ"; // When completed, button becomes 'Next Word' helper
  // }
}


// Normal function exposed via event listener
function handleCellClick(meta) {
  if (!currentWord || isGameLocked || meta.isUsed || isWordCompleted) return;

  // 1. Play sound of the clicked letter
  playLetterSound(meta.letter);

  const targetChars = currentWord.correct_answer_char_array;
  const nextExpectedIndex = userAnswerArray.length;

  // Check if there is an expected character left
  if (nextExpectedIndex >= targetChars.length) {
    // Word is already completed, ignore click
    return;
  }

  const nextExpectedChar = targetChars[nextExpectedIndex];

  if (meta.letter === nextExpectedChar) {
    // CORRECT: Process the click sequentially

    // 2. Append the letter to the user's answer array
    userAnswerArray.push(meta.letter);

    // 3. Mark the cell as used/disabled and give green feedback
    markCellAsCorrect(meta);

    // 4. Check for final word completion
    if (userAnswerArray.length === targetChars.length) {
      handleWordComplete();
    }

  } else {
    // INCORRECT: Only blink the wrong letter
    blinkSingleWrongFeedback(meta);
    // Do NOT reset userAnswerArray or isGameLocked
  }
}

/**
 * Checks if two cells are immediately adjacent (horizontal, vertical, or diagonal).
 * @param {object} meta1 - The first cell meta object.
 * @param {object} meta2 - The second cell meta object.
 * @returns {boolean} True if they are neighbors.
 */
function isAdjacent(meta1, meta2) {
  const dRow = Math.abs(meta1.row - meta2.row);
  const dCol = Math.abs(meta1.col - meta2.col);

  // They must be different cells (dRow or dCol must be > 0)
  // and the maximum distance in any dimension must be exactly 1.
  return (dRow <= 1 && dCol <= 1) && (dRow !== 0 || dCol !== 0);
}

// Normal function exposed via event listener
function showAnswer() {
  if (!currentWord || !finalImageElement) return;

  if (!isShowAnswer) {
    // --- SHOW ANSWER --- (Focus on this block)
    if (isWordCompleted) {
      // If already completed, just show the image. No path logic needed.
      showFinalImage();
    } else {
      // If incomplete, show the answer (mark the correct path and show image)
      isGameLocked = true;
      isShowAnswer = true;
      userAnswerArray = currentWord.correct_answer_char_array;

      resetCorrectCellsVisuals();

      const requiredChars = [...currentWord.correct_answer_char_array];

      // --- NEW VARIABLES TO TRACK DIRECTION ---
      let lastMeta = null;
      let direction = null; // Stores { dRow, dCol } for the path

      // Loop to find and mark the sequential, directional cells
      for (let i = 0; i < requiredChars.length; i++) {
        const char = requiredChars[i];

        // Step 1: Find the next sequential cell that hasn't been used yet.
        // This logic is more complex than a simple find, as it needs direction.

        let foundMeta = null;

        // If this is the first letter (i=0), we search the entire grid
        if (i === 0) {
          // Find the STARTING point (only need to match letter and not used)
          foundMeta = gridCellMetas.find(meta => meta.letter === char && !meta.isUsed);

        } else if (i === 1) {
          // Find the SECOND letter, adjacent to the first, to establish direction
          const potentialNext = gridCellMetas.find(meta => meta.letter === char && !meta.isUsed);

          if (potentialNext && lastMeta && isAdjacent(lastMeta, potentialNext)) {
            // Establish direction (dRow, dCol)
            direction = {
              dRow: potentialNext.row - lastMeta.row,
              dCol: potentialNext.col - lastMeta.col
            };
            foundMeta = potentialNext;
          }

        } else {
          // i >= 2: Use the established direction to predict the next cell

          if (lastMeta && direction) {
            const expectedRow = lastMeta.row + direction.dRow;
            const expectedCol = lastMeta.col + direction.dCol;

            // Find the cell in the exact expected position
            foundMeta = gridCellMetas.find(meta =>
              meta.row === expectedRow &&
              meta.col === expectedCol &&
              meta.letter === char &&
              !meta.isUsed
            );
          }
        }

        // Step 2: If the correct, directional cell is found, mark it
        if (foundMeta) {
          markCellAsCorrect(foundMeta);
          lastMeta = foundMeta; // Update the reference for the next iteration
        } else {
          // If the path breaks (e.g., the word isn't continuous)
          console.error(`Answer path broke at character index ${i}`);
          break;
        }
      }

      showFinalImage();
      playWordSound();
      setSoundPromptState(false);
      if (showAnswerButtonRef) {
        showAnswerButtonRef.textContent = "उत्तर छुपाएँ";
      }
    }
  }
  else {
    // --- HIDE ANSWER --- (No change needed here)
    hideFinalImage();
    resetCorrectCellsVisuals();
    isGameLocked = false;
    isShowAnswer = false;
    if (showAnswerButtonRef) {
      showAnswerButtonRef.textContent = "उत्तर देखें"; // Revert to initial state
    }
  }
}

// --- UI Functions ---

function showFinalImage() {
  if (!currentWord || !finalImageElement) return;

  const imageFileName = wordImageMap[currentWord.word];
  const imagePath = `Assets/Images/Final-Images/${imageFileName}`;

  const imgElement = finalImageElement.querySelector('img');

  if (imgElement) {
    imgElement.src = imagePath;
  }
  finalImageElement.style.display = "block";
}

function hideFinalImage() {
  if (finalImageElement) {
    finalImageElement.style.display = "none";
    showAnswerButtonRef.disabled = false;
    const imgElement = finalImageElement.querySelector('img');
    if (imgElement) {
      imgElement.src = ""; // Clear the image source when hidden
    }
  }
}

function attachSoundButtonHandler() {
  const candidate = document.querySelector("#Group\\ 595");
  //const candidate = document.getElementById("Group 595");

  if (!candidate) return;

  soundButtonRef = candidate;
  setSoundPromptState(false);

  if (!candidate.__wordSearchSoundBound) {
    candidate.__wordSearchSoundBound = true;
    candidate.style.cursor = "pointer";
    candidate.addEventListener("click", (event) => {
      event.stopPropagation();
      playWordSound();
      setSoundPromptState(false);
    });
  }
}

function setSoundPromptState(isActive) {
  if (!soundButtonRef) return;

  const rect = soundButtonRef.querySelector("rect");
  if (!rect) return;

  if (isActive) {
    rect.setAttribute("fill", "#66BB6A"); // Light green highlight
  } else {
    rect.setAttribute("fill", "#4CAF50"); // Default green
  }
}


// --- Initialization ---

function initGame() {
  finalImageElement = document.getElementById("final-image-container");
  showAnswerButtonRef = document.getElementById("show-example-btn");

  prepareGridCellsById();

  if (!gridCellMetas.length) {
    console.error("Game setup failed: Grid cells not detected/prepared by ID.");
    return;
  }

  attachSoundButtonHandler();

  // Attach UI handlers for buttons
  const showAnswerBtn = document.getElementById("show-example-btn");
  if (showAnswerBtn) {
    showAnswerBtn.addEventListener("click", showAnswer);
  }

  const resetBtn = document.getElementById("next-btn");
  if (resetBtn) {
    resetBtn.addEventListener("click", resetSentence);
  }

  hideFinalImage();
  resetSentence();
}

document.addEventListener("DOMContentLoaded", () => {
  // setTimeout(initGame, 300);
  initGame();
});