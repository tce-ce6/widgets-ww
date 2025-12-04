// Word search puzzle script for WG37
 
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
      ["म", "ख", "र", "ब", "प"],
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
      ["स", "ह", "र", "ब", "प"],
      ["ल", "त", "ग", "द", "श"],
      ["य", "च", "ल", "ए", "क"],
      ["श", "र", "ब", "त", "फ"],
      ["झ", "ध", "ण", "ई", "स"]
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
 
const GRID_SIZE = 5;
const CORRECT_CELL_FILL = "#2E7D32";
const WRONG_CELL_FILL = "#C62828";
const WRONG_FEEDBACK_DURATION = 300;
 
const SEARCH_DIRECTIONS = [
  { dr: 0, dc: 1 },
  { dr: 0, dc: -1 },
  { dr: 1, dc: 0 },
  { dr: -1, dc: 0 },
  { dr: 1, dc: 1 },
  { dr: 1, dc: -1 },
  { dr: -1, dc: 1 },
  { dr: -1, dc: -1 }
];
 
const letterAudioMap = {
  "अ": { folder: "Swar_Sound", file: "00_अ.wav" },
  "आ": { folder: "Swar_Sound", file: "01_आ.wav" },
  "इ": { folder: "Swar_Sound", file: "02_इ.wav" },
  "ई": { folder: "Swar_Sound", file: "03_ई.wav" },
  "उ": { folder: "Swar_Sound", file: "04_उ.wav" },
  "ऊ": { folder: "Swar_Sound", file: "05_ऊ.wav" },
  "ए": { folder: "Swar_Sound", file: "07_ए.wav" },
  "ऐ": { folder: "Swar_Sound", file: "08_ऐ.wav" },
  "ओ": { folder: "Swar_Sound", file: "09_ओ.wav" },
  "औ": { folder: "Swar_Sound", file: "10_औ.wav" },
  "अं": { folder: "Swar_Sound", file: "11_अं.wav" },
  "अः": { folder: "Swar_Sound", file: "12_अह.wav" },
  "क": { folder: "Vyanjan_Sound", file: "00_क.wav" },
  "ख": { folder: "Vyanjan_Sound", file: "01_ख.wav" },
  "ग": { folder: "Vyanjan_Sound", file: "02_ग.wav" },
  "घ": { folder: "Vyanjan_Sound", file: "03_घ.wav" },
  "च": { folder: "Vyanjan_Sound", file: "04_च.wav" },
  "छ": { folder: "Vyanjan_Sound", file: "05_छ.wav" },
  "ज": { folder: "Vyanjan_Sound", file: "06_ज.wav" },
  "झ": { folder: "Vyanjan_Sound", file: "07_झ.wav" },
  "ट": { folder: "Vyanjan_Sound", file: "08_ट.wav" },
  "ठ": { folder: "Vyanjan_Sound", file: "09_ठ.wav" },
  "ड": { folder: "Vyanjan_Sound", file: "10_ड.wav" },
  "ड़": { folder: "Vyanjan_Sound", file: "11_ड़.wav" },
  "ढ": { folder: "Vyanjan_Sound", file: "12_ढ.wav" },
  "त": { folder: "Vyanjan_Sound", file: "15_त.wav" },
  "थ": { folder: "Vyanjan_Sound", file: "16_थ.wav" },
  "द": { folder: "Vyanjan_Sound", file: "17_द.wav" },
  "ध": { folder: "Vyanjan_Sound", file: "18_ध.wav" },
  "न": { folder: "Vyanjan_Sound", file: "19_न.wav" },
  "प": { folder: "Vyanjan_Sound", file: "20_प.wav" },
  "फ": { folder: "Vyanjan_Sound", file: "21_फ.wav" },
  "ब": { folder: "Vyanjan_Sound", file: "22_ब.wav" },
  "भ": { folder: "Vyanjan_Sound", file: "23_भ.wav" },
  "म": { folder: "Vyanjan_Sound", file: "24_म.wav" },
  "य": { folder: "Vyanjan_Sound", file: "25_य.wav" },
  "र": { folder: "Vyanjan_Sound", file: "26_र.wav" },
  "ल": { folder: "Vyanjan_Sound", file: "27_ल.wav" },
  "व": { folder: "Vyanjan_Sound", file: "28_व.wav" },
  "श": { folder: "Vyanjan_Sound", file: "29_श.wav" },
  "ष": { folder: "Vyanjan_Sound", file: "30_ष.wav" },
  "स": { folder: "Vyanjan_Sound", file: "31_स.wav" },
  "ह": { folder: "Vyanjan_Sound", file: "32_ह.wav" },
  "क्ष": { folder: "Vyanjan_Sound", file: "33_क्ष.wav" },
  "त्र": { folder: "Vyanjan_Sound", file: "34_त्र.wav" },
  "ज्ञ": { folder: "Vyanjan_Sound", file: "35_ग्य.wav" }
};
 
const wordAudioFileNameMap = {
  "अजगर": "अजगर.mp3",
  "कटहल": "कटहल.mp3",
  "खटमल": "खटमल.mp3",
  "बचपन": "बचपन.mp3",
  "बरगद": "बरगद.mp3",
  "शलगम": "शलगम.mp3",
  "शरबत": "शरबत.mp3",
  "पनघट": "पनघट.mp3",
  "उपवन": "उपवन.mp3",
  "करवट": "करवट.mp3",
  "कसरत": "कसरत.mp3",
  "परवल": "परवल.mp3",
  "पचपन": "पचपन.mp3",
  "अदरक": "अदरक.mp3",
  "बरतन": "बरतन.mp3",
  "चमचम": "चमचम.mp3",
  "दलदल": "दलदल.mp3",
  "थरमस": "थरमस.mp3",
  "पतझड़": "पतझड़.mp3",
  "उपटन": "उपटन.mp3"
};
 
const wordImageMap = {
  "अजगर": "अजगर.svg",
  "कटहल": "कटहल.svg",
  "खटमल": "खटमल.svg",
  "बचपन": "बचपन.svg",
  "बरगद": "बरगद.svg",
  "शलगम": "शलगम.svg",
  "शरबत": "शरबत.svg",
  "पनघट": "पनघट.svg",
  "उपवन": "उपवन.svg",
  "करवट": "करवट.svg",
  "कसरत": "कसरत.svg",
  "परवल": "परवल.svg",
  "पचपन": "पचपन.svg",
  "अदरक": "अदरक.svg",
  "बरतन": "बरतन.svg",
  "चमचम": "चमचम.svg",
  "दलदल": "दलदल.svg",
  "थरमस": "थरमस.svg",
  "पतझड़": "पतझड़.svg",
  "उपटन": "उपटन.svg"
};
 
let gridCellMetas = [];
let cellMetaLookup = new Map();
let currentWordIndex = -1;
let currentWord = null;
let answerPath = [];
let currentProgressIndex = 0;
let isGameLocked = false;
let isWordCompleted = false;
let activeLetterAudio = null;
let activeWordAudio = null;
let finalImageElement = null;
let soundButtonRef = null;
let soundPulseStyleInjected = false;
 
function getRandomWord(excludeIndex = -1) {
  if (!words.length) {
    return { word: null, index: -1 };
  }
 
  let nextIndex = Math.floor(Math.random() * words.length);
  if (words.length > 1) {
    while (nextIndex === excludeIndex) {
      nextIndex = Math.floor(Math.random() * words.length);
    }
  }
 
  return { word: words[nextIndex], index: nextIndex };
}
 
function selectRandomWord(excludeCurrent = false) {
  const currentIndex = excludeCurrent ? currentWordIndex : -1;
  const { word, index } = getRandomWord(currentIndex);
  currentWordIndex = index;
  currentWord = word;
  return word;
}
 
function getNextWord() {
  if (!words.length) {
    return null;
  }
 
  currentWordIndex = (currentWordIndex + 1) % words.length;
  currentWord = words[currentWordIndex];
  return currentWord;
}
 
function getLetterAudioPath(letter) {
  const config = letterAudioMap[letter];
  if (!config) {
    return null;
  }
  return `Assets/Audio/${config.folder}/${config.file}`;
}
 
function playLetterSound(letter) {
  const audioPath = getLetterAudioPath(letter);
  if (!audioPath) {
    return;
  }
 
  if (activeLetterAudio) {
    try {
      activeLetterAudio.pause();
      activeLetterAudio.currentTime = 0;
    } catch (err) {
      console.log("Failed to reset previous letter audio:", err);
    }
  }
 
  const audio = new Audio(audioPath);
  audio.currentTime = 0;
  activeLetterAudio = audio;
  audio.play().catch(err => console.log("Letter audio play failed:", err));
}
 
function getWordAudioFileName(wordName) {
  return wordAudioFileNameMap[wordName] || `${wordName}.mp3`;
}
 
function playWordSound() {
  if (!currentWord || !currentWord.word) {
    return;
  }
 
  const audioFile = getWordAudioFileName(currentWord.word);
  const audioPath = `Assets/Audio/Word_sound/${audioFile}`;
 
  if (activeLetterAudio) {
    try {
      activeLetterAudio.pause();
      activeLetterAudio.currentTime = 0;
    } catch (err) {
      console.log("Failed to pause letter audio:", err);
    }
  }
 
  if (activeWordAudio) {
    try {
      activeWordAudio.pause();
      activeWordAudio.currentTime = 0;
    } catch (err) {
      console.log("Failed to reset previous word audio:", err);
    }
  }
 
  const audio = new Audio(audioPath);
  audio.currentTime = 0;
  activeWordAudio = audio;
  audio.play().catch(err => console.log("Word audio play failed:", err));
}
 
function getUniquePositions(values, tolerance = 1) {
  const sorted = values
    .filter(value => Number.isFinite(value))
    .sort((a, b) => a - b);
 
  return sorted.reduce((unique, value) => {
    if (!unique.some(existing => Math.abs(existing - value) < tolerance)) {
      unique.push(value);
    }
    return unique;
  }, []);
}
 
function getClosestIndex(referenceList, value) {
  let closestIndex = 0;
  let minDiff = Infinity;
 
  referenceList.forEach((reference, index) => {
    const diff = Math.abs(reference - value);
    if (diff < minDiff) {
      minDiff = diff;
      closestIndex = index;
    }
  });
 
  return closestIndex;
}
 
function prepareGridCells() {
  if (gridCellMetas.length) {
    return;
  }
 
  const svg = document.querySelector("#shabd-widget svg");
  if (!svg) {
    console.warn("SVG root not found.");
    return;
  }
 
  const textElements = Array.from(svg.querySelectorAll('text[font-size="75"]'));
  if (!textElements.length) {
    console.warn("Grid letter nodes not found.");
    return;
  }
 
  const rawCells = textElements
    .map(element => {
      const tspan = element.querySelector("tspan");
      if (!tspan) {
        return null;
      }
 
      const x = parseFloat(tspan.getAttribute("x"));
      const y = parseFloat(tspan.getAttribute("y"));
      return { element, tspan, x, y };
    })
    .filter(Boolean);
 
  if (!rawCells.length) {
    console.warn("No usable grid cells detected.");
    return;
  }
 
  const xPositions = getUniquePositions(rawCells.map(cell => cell.x), 5);
  const yPositions = getUniquePositions(rawCells.map(cell => cell.y), 5);
 
  if (xPositions.length !== GRID_SIZE || yPositions.length !== GRID_SIZE) {
    console.warn("Grid dimension mismatch.", { xPositions, yPositions });
  }
 
  cellMetaLookup = new Map();
 
  gridCellMetas = rawCells
    .map(cell => {
      const row = getClosestIndex(yPositions, cell.y);
      const col = getClosestIndex(xPositions, cell.x);
      const index = row * GRID_SIZE + col;
 
      return {
        element: cell.element,
        tspan: cell.tspan,
        row,
        col,
        index,
        originalFill: cell.tspan.getAttribute("fill") || "#000000",
        letter: "",
        isSelected: false
      };
    })
    .sort((a, b) => a.index - b.index);
 
  gridCellMetas.forEach(meta => {
    cellMetaLookup.set(`${meta.row}-${meta.col}`, meta);
    meta.element.style.cursor = "pointer";
    meta.element.style.userSelect = "none";
    if (!meta.element.__wordSearchBound) {
      meta.element.__wordSearchBound = true;
      meta.element.addEventListener("click", () => handleCellClick(meta));
    }
  });
}
 
function flattenGrid(grid) {
  return grid.reduce((acc, row) => acc.concat(row), []);
}
 
function resetGridVisuals() {
  gridCellMetas.forEach(meta => {
    meta.isSelected = false;
    if (meta.tspan) {
      meta.tspan.setAttribute("fill", meta.originalFill);
    }
  });
}
 
function computeAnswerPath(grid, sequence) {
  if (!Array.isArray(sequence) || !sequence.length) {
    return [];
  }
 
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[row].length; col++) {
      if (grid[row][col] !== sequence[0]) {
        continue;
      }
 
      for (const direction of SEARCH_DIRECTIONS) {
        const path = [];
        let r = row;
        let c = col;
        let matches = true;
 
        for (let idx = 0; idx < sequence.length; idx++) {
          if (
            r < 0 ||
            c < 0 ||
            r >= grid.length ||
            c >= grid[r].length ||
            grid[r][c] !== sequence[idx]
          ) {
            matches = false;
            break;
          }
 
          path.push({ row: r, col: c });
          r += direction.dr;
          c += direction.dc;
        }
 
        if (matches) {
          return path;
        }
      }
    }
  }
 
  return [];
}
 
function deriveAnswerPath(word) {
  const sequence = word.correct_answer_char_array || [];
  if (!sequence.length) {
    return [];
  }
 
  const positions = computeAnswerPath(word.grid_data, sequence);
  const pathMetas = positions
    .map(pos => cellMetaLookup.get(`${pos.row}-${pos.col}`))
    .filter(Boolean);
 
  if (pathMetas.length === sequence.length) {
    return pathMetas;
  }
 
  console.warn("Falling back to sequential match for word:", word.word);
  const fallback = [];
  const usedIndices = new Set();
 
  sequence.forEach(letter => {
    const meta = gridCellMetas.find(
      cell => cell.letter === letter && !usedIndices.has(cell.index) && !fallback.includes(cell)
    );
    if (meta) {
      usedIndices.add(meta.index);
      fallback.push(meta);
    } else {
      fallback.push(null);
    }
  });
 
  return fallback;
}
 
function loadWord(word) {
  if (!word || !gridCellMetas.length) {
    return;
  }
 
  setSoundPromptState(true);
 
  currentWord = word;
  currentProgressIndex = 0;
  isGameLocked = false;
  isWordCompleted = false;
  answerPath = [];
 
  hideFinalImage();
  resetGridVisuals();
 
  const letters = flattenGrid(word.grid_data);
  gridCellMetas.forEach((meta, index) => {
    const letter = letters[index] || "";
    meta.letter = letter;
    meta.isSelected = false;
    if (meta.tspan) {
      meta.tspan.textContent = letter;
      meta.tspan.setAttribute("fill", meta.originalFill);
    }
  });
 
  answerPath = deriveAnswerPath(word);
}
 
function markCellAsCorrect(meta) {
  if (!meta || meta.isSelected) {
    return;
  }
  meta.isSelected = true;
  if (meta.tspan) {
    meta.tspan.setAttribute("fill", CORRECT_CELL_FILL);
  }
}
 
function showWrongFeedback(meta) {
  if (!meta || !meta.tspan) {
    return;
  }
 
  const targetFill = meta.isSelected ? CORRECT_CELL_FILL : meta.originalFill;
  meta.tspan.setAttribute("fill", WRONG_CELL_FILL);
 
  setTimeout(() => {
    if (meta.tspan) {
      meta.tspan.setAttribute("fill", meta.isSelected ? CORRECT_CELL_FILL : targetFill);
    }
  }, WRONG_FEEDBACK_DURATION);
}
 
function handleCellClick(meta) {
  if (!currentWord || isGameLocked || meta.isSelected) {
    return;
  }
 
  playLetterSound(meta.letter);
 
  const expectedMeta = answerPath[currentProgressIndex];
  const expectedLetter = currentWord.correct_answer_char_array
    ? currentWord.correct_answer_char_array[currentProgressIndex]
    : null;
 
  if (expectedMeta && meta === expectedMeta) {
    markCellAsCorrect(meta);
    currentProgressIndex += 1;
  } else if (!expectedMeta && meta.letter === expectedLetter) {
    markCellAsCorrect(meta);
    answerPath[currentProgressIndex] = meta;
    currentProgressIndex += 1;
  } else {
    showWrongFeedback(meta);
    return;
  }
 
  if (currentProgressIndex >= (currentWord.correct_answer_char_array || []).length) {
    handleWordComplete();
  }
}
 
function handleWordComplete() {
  if (isWordCompleted) {
    return;
  }
  isWordCompleted = true;
  isGameLocked = true;
  setSoundPromptState(false);
  playWordSound();
  showFinalImage();
}
 
function showAnswer() {
  if (!currentWord || !answerPath.length) {
    return;
  }
 
  (currentWord.correct_answer_char_array || []).forEach((letter, index) => {
    let meta = answerPath[index];
    if (!meta || meta.letter !== letter) {
      meta = gridCellMetas.find(cell => !cell.isSelected && cell.letter === letter);
      if (meta) {
        answerPath[index] = meta;
      }
    }
    if (meta) {
      markCellAsCorrect(meta);
    }
  });
 
  currentProgressIndex = currentWord.correct_answer_char_array
    ? currentWord.correct_answer_char_array.length
    : 0;
  handleWordComplete();
}
 
function resetSentence() {
  const nextWord = getNextWord();
  if (nextWord) {
    loadWord(nextWord);
  }
}
 
function ensureFinalImageHolder() {
  if (finalImageElement) {
    return finalImageElement;
  }
 
  const container = document.querySelector("#shabd-widget .container");
  if (!container) {
    return null;
  }
 
  const img = document.querySelector(".final-image-container");
 
  container.appendChild(img);
  finalImageElement = img;
  return finalImageElement;
}
 
function showFinalImage() {
  if (!currentWord) {
    return;
  }
 
  const holder = ensureFinalImageHolder();
  const fileName = wordImageMap[currentWord.word];
 
  if (!holder || !fileName) {
    return;
  }
 
  holder.src = `Assets/Images/Final images/${fileName}`;
  holder.alt = currentWord.word;
  holder.style.display = "block";
}
 
function hideFinalImage() {
  const holder = ensureFinalImageHolder();
  if (!holder) {
    return;
  }
 
  holder.style.display = "none";
  holder.removeAttribute("src");
  holder.removeAttribute("alt");
}
 
function attachSoundButtonHandler() {
  const candidate =
    document.querySelector(".sound-button") ||
    document.getElementById("Group 595") ||
    document.getElementById("Group 196") ||
    document.getElementById("Group 593");
 
  if (!candidate) {
    return;
  }
 
  soundButtonRef = candidate;
  setSoundPromptState(false);
 
  if (!candidate.__wordSearchSoundBound) {
    candidate.__wordSearchSoundBound = true;
    candidate.style.cursor = "pointer";
    candidate.addEventListener("click", event => {
      event.stopPropagation();
      playWordSound();
      setSoundPromptState(false);
    });
  }
}
 
function initGame() {
  prepareGridCells();
 
  if (!gridCellMetas.length) {
    console.warn("Unable to initialise grid.");
    return;
  }
 
  attachSoundButtonHandler();
 
  const initialWord = getNextWord();
  if (initialWord) {
    loadWord(initialWord);
  }
 
  const showAnswerBtn = document.getElementById("show-example-btn");
  if (showAnswerBtn && !showAnswerBtn.__wordSearchBound) {
    showAnswerBtn.__wordSearchBound = true;
    showAnswerBtn.addEventListener("click", showAnswer);
  }
 
  const resetBtn = document.getElementById("next-btn");
  if (resetBtn && !resetBtn.__wordSearchBound) {
    resetBtn.__wordSearchBound = true;
    resetBtn.addEventListener("click", resetSentence);
  }
}
 
function setSoundPromptState(isActive) {
  if (!soundButtonRef) {
    return;
  }
 
  if (isActive) {
    soundButtonRef.style.animation = "wordSoundPulse 1.2s ease-in-out infinite";
  } else {
    soundButtonRef.style.animation = "none";
  }
}
 
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(initGame, 200);
});