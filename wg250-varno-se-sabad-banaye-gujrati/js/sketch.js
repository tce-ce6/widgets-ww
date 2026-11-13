// Content: gu_gu_01_wg250 (Gujarati) - 20 four-letter words in a 5x5 word search
const words = [
  {
    word: "મખમલ",
    grid_data: [
      ["ભ", "ઘ", "ર", "ઈ", "ટ"],
      ["છ", "ઓ", "સ", "ઋ", "ઠ"],
      ["ષ", "ઐ", "ક", "ફ", "ઇ"],
      ["મ", "ખ", "મ", "લ", "ઉ"],
      ["ઢ", "ઔ", "ઝ", "એ", "ળ"]
    ],
    correct_answer_char_array: ["મ", "ખ", "મ", "લ"],
    audio: "01_makhmal.mp3",
    image: "01_makhmal.svg"
  },
  {
    word: "બખતર",
    grid_data: [
      ["વ", "ઘ", "ડ", "ઈ", "ઞ"],
      ["છ", "ઓ", "ભ", "ઋ", "બ"],
      ["ષ", "ઐ", "ઙ", "ફ", "ખ"],
      ["ઢ", "ઔ", "ઝ", "એ", "ત"],
      ["પ", "થ", "સ", "ઉ", "ર"]
    ],
    correct_answer_char_array: ["બ", "ખ", "ત", "ર"],
    audio: "02_bakhtar.mp3",
    image: "02_bakhtar.svg"
  },
  {
    word: "ગરદન",
    grid_data: [
      ["ગ", "ખ", "ઘ", "સ", "પ"],
      ["લ", "ર", "જ", "ધ", "શ"],
      ["ય", "વ", "દ", "એ", "ક"],
      ["ચ", "થ", "ત", "ન", "ફ"],
      ["ઝ", "ભ", "ણ", "ઔ", "ડ"]
    ],
    correct_answer_char_array: ["ગ", "ર", "દ", "ન"],
    audio: "03_gardan.mp3",
    image: "03_gardan.svg"
  },
  {
    word: "કમરખ",
    grid_data: [
      ["ઠ", "ઐ", "ઘ", "ઇ", "ઞ"],
      ["ક", "ષ", "વ", "એ", "ડ"],
      ["ચ", "મ", "પ", "ઋ", "ય"],
      ["દ", "ઔ", "ર", "ઊ", "ફ"],
      ["જ", "ભ", "ઙ", "ખ", "હ"]
    ],
    correct_answer_char_array: ["ક", "મ", "ર", "ખ"],
    audio: "04_kamrakh.mp3",
    image: "04_kamrakh.svg"
  },
  {
    word: "શરબત",
    grid_data: [
      ["સ", "હ", "ઈ", "ષ", "પ"],
      ["લ", "ઢ", "ગ", "દ", "ઓ"],
      ["ય", "ચ", "ઇ", "એ", "ક"],
      ["શ", "ર", "બ", "ત", "ફ"],
      ["ઝ", "ધ", "ણ", "ઉ", "વ"]
    ],
    correct_answer_char_array: ["શ", "ર", "બ", "ત"],
    audio: "05_sharbat.mp3",
    image: "05_sharbat.svg"
  },
  {
    word: "અજગર",
    grid_data: [
      ["ત", "ક", "મ", "ઇ", "ન"],
      ["લ", "અ", "જ", "ગ", "ર"],
      ["પ", "સ", "વ", "દ", "હ"],
      ["ય", "બ", "ચ", "એ", "શ"],
      ["ઝ", "ખ", "ઘ", "થ", "ફ"]
    ],
    correct_answer_char_array: ["અ", "જ", "ગ", "ર"],
    audio: "06_ajgar.mp3",
    image: "06_ajgar.svg"
  },
  {
    word: "હળદર",
    grid_data: [
      ["મ", "ન", "હ", "સ", "પ"],
      ["બ", "ક", "ળ", "ચ", "ધ"],
      ["ય", "ટ", "દ", "ઉ", "શ"],
      ["ઘ", "લ", "ર", "એ", "ફ"],
      ["ખ", "ઠ", "ણ", "ઔ", "ઝ"]
    ],
    correct_answer_char_array: ["હ", "ળ", "દ", "ર"],
    audio: "07_haldar.mp3",
    image: "07_haldar.svg"
  },
  {
    word: "ચણતર",
    grid_data: [
      ["ભ", "ઘ", "દ", "ઈ", "ટ"],
      ["છ", "ઓ", "સ", "ઋ", "ઠ"],
      ["ષ", "ઐ", "ક", "ફ", "ઇ"],
      ["ચ", "ણ", "ત", "ર", "ઉ"],
      ["ઢ", "ઔ", "ઝ", "એ", "ળ"]
    ],
    correct_answer_char_array: ["ચ", "ણ", "ત", "ર"],
    audio: "08_chantar.mp3",
    image: "08_chantar.svg"
  },
  {
    word: "કરવત",
    grid_data: [
      ["પ", "ખ", "ઞ", "ઉ", "શ"],
      ["લ", "ત", "પ", "દ", "ઇ"],
      ["ક", "ર", "વ", "ત", "જ"],
      ["ન", "બ", "મ", "એ", "ફ"],
      ["ઝ", "ઙ", "ણ", "ઓ", "ષ"]
    ],
    correct_answer_char_array: ["ક", "ર", "વ", "ત"],
    audio: "09_karvat.mp3",
    image: "09_karvat.svg"
  },
  {
    word: "પરવળ",
    grid_data: [
      ["જ", "ઘ", "ડ", "ઈ", "ઞ"],
      ["છ", "ઓ", "ભ", "ઋ", "ઠ"],
      ["ષ", "ઐ", "ઙ", "ફ", "ઇ"],
      ["ઢ", "ઔ", "ઝ", "એ", "ઉ"],
      ["પ", "ર", "વ", "ળ", "હ"]
    ],
    correct_answer_char_array: ["પ", "ર", "વ", "ળ"],
    audio: "10_parval.mp3",
    image: "10_parval.svg"
  },
  {
    word: "કસરત",
    grid_data: [
      ["ફ", "ખ", "ઉ", "હ", "ક"],
      ["લ", "ઙ", "દ", "સ", "વ"],
      ["મ", "બ", "ર", "એ", "જ"],
      ["ન", "ત", "ગ", "ય", "ઠ"],
      ["ઝ", "ભ", "ણ", "ઔ", "ચ"]
    ],
    correct_answer_char_array: ["ક", "સ", "ર", "ત"],
    audio: "11_kasrat.mp3",
    image: "11_kasrat.svg"
  },
  {
    word: "જડતર",
    grid_data: [
      ["જ", "ખ", "ઞ", "બ", "શ"],
      ["ડ", "ળ", "ગ", "દ", "ઠ"],
      ["ત", "ય", "ચ", "એ", "છ"],
      ["ર", "મ", "ઢ", "ઓ", "ફ"],
      ["ઝ", "ધ", "ણ", "ઞ", "સ"]
    ],
    correct_answer_char_array: ["જ", "ડ", "ત", "ર"],
    audio: "12_jadtar.mp3",
    image: "12_jadtar.svg"
  },
  {
    word: "સરઘસ",
    grid_data: [
      ["ઢ", "ઇ", "ઞ", "ઊ", "ગ"],
      ["સ", "ર", "ઘ", "સ", "ખ"],
      ["થ", "દ", "છ", "ય", "ઔ"],
      ["વ", "ઐ", "ફ", "ટ", "ણ"],
      ["ભ", "એ", "ઝ", "લ", "ઋ"]
    ],
    correct_answer_char_array: ["સ", "ર", "ઘ", "સ"],
    audio: "13_sarghas.mp3",
    image: "13_sarghas.svg"
  },
  {
    word: "ઝગમગ",
    grid_data: [
      ["ષ", "ત", "ઉ", "ડ", "ખ"],
      ["છ", "ઞ", "ઝ", "ઇ", "ઔ"],
      ["ય", "વ", "ગ", "ઊ", "ફ"],
      ["ભ", "ઐ", "મ", "ઋ", "લ"],
      ["ઢ", "પ", "ગ", "એ", "સ"]
    ],
    correct_answer_char_array: ["ઝ", "ગ", "મ", "ગ"],
    audio: "14_zagmag.mp3",
    image: "14_zagmag.svg"
  },
  {
    word: "જળચર",
    grid_data: [
      ["ષ", "મ", "ઐ", "ડ", "ગ"],
      ["છ", "જ", "વ", "ઝ", "ઞ"],
      ["ય", "ળ", "ઇ", "ઊ", "ઔ"],
      ["ભ", "ચ", "ખ", "ઋ", "લ"],
      ["ઢ", "ર", "ધ", "ફ", "સ"]
    ],
    correct_answer_char_array: ["જ", "ળ", "ચ", "ર"],
    audio: "15_jalchar.mp3",
    image: "15_jalchar.svg"
  },
  {
    word: "દફતર",
    grid_data: [
      ["ખ", "ઇ", "ઞ", "દ", "ગ"],
      ["જ", "ઐ", "ફ", "પ", "લ"],
      ["છ", "ત", "ય", "ઊ", "વ"],
      ["ર", "ભ", "ઔ", "એ", "ઠ"],
      ["ધ", "ષ", "ણ", "ઙ", "થ"]
    ],
    correct_answer_char_array: ["દ", "ફ", "ત", "ર"],
    audio: "16_daftar.mp3",
    image: "16_daftar.svg"
  },
  {
    word: "મફલર",
    grid_data: [
      ["ઘ", "મ", "ફ", "લ", "ર"],
      ["છ", "ઋ", "દ", "ઇ", "પ"],
      ["ળ", "ઐ", "ઞ", "ભ", "ઢ"],
      ["ય", "ઔ", "ટ", "એ", "ઊ"],
      ["ન", "ઉ", "ઝ", "શ", "ડ"]
    ],
    correct_answer_char_array: ["મ", "ફ", "લ", "ર"],
    audio: "17_mafler.mp3",
    image: "17_mafler.svg"
  },
  {
    word: "ગપશપ",
    grid_data: [
      ["ઠ", "ઐ", "ગ", "ઇ", "ઞ"],
      ["છ", "ઘ", "પ", "ઋ", "ડ"],
      ["ય", "ષ", "શ", "ઊ", "ઔ"],
      ["ભ", "ફ", "પ", "એ", "લ"],
      ["જ", "ઙ", "શ", "ખ", "ત"]
    ],
    correct_answer_char_array: ["ગ", "પ", "શ", "પ"],
    audio: "18_gapshap.mp3",
    image: "18_gapshap.svg"
  },
  {
    word: "ટનટન",
    grid_data: [
      ["ઢ", "ઔ", "ઞ", "ઈ", "ગ"],
      ["ટ", "ઇ", "ઐ", "પ", "લ"],
      ["છ", "ન", "ઠ", "ય", "ઊ"],
      ["વ", "દ", "ટ", "ણ", "ભ"],
      ["ખ", "એ", "ફ", "ન", "મ"]
    ],
    correct_answer_char_array: ["ટ", "ન", "ટ", "ન"],
    audio: "19_tantan.mp3",
    image: "19_tantan.svg"
  },
  {
    word: "દલદલ",
    grid_data: [
      ["ષ", "દ", "ઐ", "ડ", "ગ"],
      ["છ", "લ", "વ", "ઝ", "ઞ"],
      ["ય", "દ", "ઇ", "ઊ", "ઔ"],
      ["ભ", "લ", "ખ", "ઋ", "ધ"],
      ["ઢ", "ળ", "ચ", "ફ", "સ"]
    ],
    correct_answer_char_array: ["દ", "લ", "દ", "લ"],
    audio: "20_daldal.mp3",
    image: "20_daldal.svg"
  }
];

// Letter sounds (assets/audio/letters/) - consonants from wg247, vowels from wg212
const letterAudioMap = {
  "અ": "00_a.mp3", "આ": "00_aa.mp3", "ઇ": "00_i.mp3", "ઈ": "00_ii.mp3",
  "ઉ": "00_u.mp3", "ઊ": "00_uu.mp3", "ઋ": "00_ri.mp3", "એ": "00_e.mp3",
  "ઐ": "00_ai.mp3", "ઓ": "00_o.mp3", "ઔ": "00_au.mp3",
  "ક": "01_ka.mp3", "ખ": "02_kha.mp3", "ગ": "03_ga.mp3", "ઘ": "04_gha.mp3",
  "ઙ": "05_nga.mp3", "ચ": "06_cha.mp3", "છ": "07_chha.mp3", "જ": "08_ja.mp3",
  "ઝ": "09_jha.mp3", "ઞ": "10_nya.mp3", "ટ": "11_tta.mp3", "ઠ": "12_ttha.mp3",
  "ડ": "13_dda.mp3", "ઢ": "14_ddha.mp3", "ણ": "15_nna.mp3", "ત": "16_ta.mp3",
  "થ": "17_tha.mp3", "દ": "18_da.mp3", "ધ": "19_dha.mp3", "ન": "20_na.mp3",
  "પ": "21_pa.mp3", "ફ": "22_pha.mp3", "બ": "23_ba.mp3", "ભ": "24_bha.mp3",
  "મ": "25_ma.mp3", "ય": "26_ya.mp3", "ર": "27_ra.mp3", "લ": "28_la.mp3",
  "વ": "29_va.mp3", "શ": "30_sha.mp3", "ષ": "31_ssa.mp3", "સ": "32_sa.mp3",
  "હ": "33_ha.mp3", "ળ": "34_lla.mp3", "ક્ષ": "35_ksha.mp3", "ત્ર": "36_tra.mp3",
  "જ્ઞ": "37_gya.mp3"
};

const LETTER_AUDIO_PATH_BASE = "assets/audio/letters/";
const WORD_AUDIO_PATH_BASE = "assets/audio/words/";
const IMAGE_PATH_BASE = "assets/images/";

// UI text
const SHOW_ANSWER_TEXT = "જવાબ જુઓ";
const HIDE_ANSWER_TEXT = "જવાબ છુપાવો";

// --- Constants and State ---
const GRID_SIZE = 5;
const CORRECT_LETTER_FILL = "#1B5E20"; // Dark Green letter color
const WRONG_LETTER_FILL = "#D50000";  // Red letter color
const WRONG_FEEDBACK_DURATION = 300;
const DEFAULT_LETTER_FILL = "#000000"; // Default black letter color

let gridCellMetas = [];
let currentWordIndex = -1; // getNextWord() increments before use, so the first word shown is index 0
let currentWord = null;
let userAnswerArray = [];
let usedCellMetas = []; // Holds the Meta objects for cells that are currently green
let isGameLocked = false;
let isWordCompleted = false;
let tempShowAnswerCellMetas = [];
let activeLetterAudio = null;
let activeWordAudio = null;
let isShowAnswer = false;
let parentDiv;

let finalImageElement = null; // ID: final-image-container
let showAnswerButtonRef = null;


// --- Audio Functions ---
function getLetterAudioPath(letter) {
  const file = letterAudioMap[letter];
  return file ? LETTER_AUDIO_PATH_BASE + file : null;
}

function playLetterSound(letter) {
  const audioPath = getLetterAudioPath(letter);
  if (!audioPath) return;
  if (activeLetterAudio) {
    try { activeLetterAudio.pause(); activeLetterAudio.currentTime = 0; } catch (e) { }
  }
  activeLetterAudio = new Audio(audioPath);
  lastLetterAudio = activeLetterAudio;
  activeLetterAudio.play().catch(e => console.log("Letter audio play failed:", e));
}

// --- Word sound after the last letter (same behaviour as wg247 / wg248) ---
// Letter/word recordings have silence at the start and end. To make the heard gap between
// the last letter and the word exactly WORD_SOUND_DELAY_MS, that silence is measured once
// per file (when a word loads) and taken into account.
const WORD_SOUND_DELAY_MS = 1000;            // heard gap: end of last letter -> start of word
const LETTER_SOUND_MAX_WAIT_MS = 4000;       // fallback if a letter sound never reports "ended"
const SHOW_ANSWER_WORD_SOUND_DELAY_MS = 1000; // word sound delay after "જવાબ જુઓ"
const WORD_PLAYBACK_RATE = 1.0;
const SILENCE_THRESHOLD = 0.05; // samples below 5% of the file's peak count as silence
const soundSilencePending = new Map(); // absolute url -> Promise
const soundSilenceInfo = {};           // absolute url -> { duration, lead, tail } (seconds)
let silenceDecodeCtx = null;
let lastLetterAudio = null;
let wordSoundTimer = null;
let wordSoundToken = 0;

function toAbsoluteUrl(path) {
  return new URL(path, document.baseURI).href;
}

function getSoundSilence(path) {
  const url = toAbsoluteUrl(path);
  if (!soundSilencePending.has(url)) {
    const pending = (async () => {
      try {
        const Ctx = window.OfflineAudioContext || window.webkitOfflineAudioContext;
        if (!Ctx) return null;
        if (!silenceDecodeCtx) silenceDecodeCtx = new Ctx(1, 1, 44100);
        const data = await (await fetch(url)).arrayBuffer();
        const buffer = await silenceDecodeCtx.decodeAudioData(data);
        const samples = buffer.getChannelData(0);
        let peak = 0;
        for (let i = 0; i < samples.length; i++) {
          const v = Math.abs(samples[i]);
          if (v > peak) peak = v;
        }
        const threshold = peak * SILENCE_THRESHOLD;
        let start = 0;
        while (start < samples.length && Math.abs(samples[start]) < threshold) start++;
        let end = samples.length - 1;
        while (end > start && Math.abs(samples[end]) < threshold) end--;
        const info = {
          duration: buffer.duration,
          lead: start / buffer.sampleRate,
          tail: (samples.length - 1 - end) / buffer.sampleRate
        };
        soundSilenceInfo[url] = info;
        return info;
      } catch (err) {
        return null; // fall back to timing from the file's end
      }
    })();
    soundSilencePending.set(url, pending);
  }
  return soundSilencePending.get(url);
}

function getWordAudioPath(word) {
  return word && word.audio ? WORD_AUDIO_PATH_BASE + word.audio : null;
}

/**
 * Measures the silence of the current word's answer letters and word sound in advance.
 */
function preloadWordSoundTiming(word) {
  if (!word) return;
  word.correct_answer_char_array.forEach(letter => {
    const path = getLetterAudioPath(letter);
    if (path) getSoundSilence(path);
  });
  const wordPath = getWordAudioPath(word);
  if (wordPath) getSoundSilence(wordPath);
}

function cancelPendingWordSound() {
  wordSoundToken++;
  clearTimeout(wordSoundTimer);
  wordSoundTimer = null;
}

function playWordSoundAfterDelay(ms) {
  cancelPendingWordSound();
  const token = wordSoundToken;
  wordSoundTimer = setTimeout(() => {
    wordSoundTimer = null;
    if (token === wordSoundToken) playWordSound();
  }, Math.max(0, ms));
}

/**
 * Plays the word sound WORD_SOUND_DELAY_MS after the last letter is heard
 * (measured from the end of the letter's voice to the start of the word's voice).
 */
function playWordSoundAfterLetter() {
  const wordPath = getWordAudioPath(currentWord);
  const wordInfo = wordPath ? soundSilenceInfo[toAbsoluteUrl(wordPath)] : null;
  const wordLeadMs = wordInfo ? (wordInfo.lead / WORD_PLAYBACK_RATE) * 1000 : 0;

  const audio = lastLetterAudio;
  const letterPlaying = audio && !audio.paused && !audio.ended;
  if (!letterPlaying) {
    playWordSoundAfterDelay(WORD_SOUND_DELAY_MS - wordLeadMs);
    return;
  }

  const letterInfo = soundSilenceInfo[audio.src];
  if (letterInfo) {
    const duration = isFinite(audio.duration) ? audio.duration : letterInfo.duration;
    const remainingMs = (duration - letterInfo.tail - audio.currentTime) * 1000;
    playWordSoundAfterDelay(Math.max(0, remainingMs) + WORD_SOUND_DELAY_MS - wordLeadMs);
    return;
  }

  // Silence not measured (e.g. decoding unsupported): wait for the letter file to end
  cancelPendingWordSound();
  const token = wordSoundToken;
  let scheduled = false;
  const schedule = () => {
    if (scheduled || token !== wordSoundToken) return;
    scheduled = true;
    playWordSoundAfterDelay(WORD_SOUND_DELAY_MS - wordLeadMs);
  };
  audio.addEventListener('ended', schedule, { once: true });
  audio.addEventListener('error', schedule, { once: true });
  wordSoundTimer = setTimeout(schedule, LETTER_SOUND_MAX_WAIT_MS);
}

function playWordSound() {
  const audioPath = getWordAudioPath(currentWord);
  if (!audioPath) return;

  if (activeWordAudio) {
    try { activeWordAudio.pause(); activeWordAudio.currentTime = 0; } catch (e) { }
  }

  activeWordAudio = new Audio(audioPath);
  activeWordAudio.playbackRate = WORD_PLAYBACK_RATE;
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
    parentDiv = meta.tspan ? meta.tspan.closest("div") : null;

    // Add correct highlight class
    if (parentDiv) parentDiv.classList.remove("correct");
  });
  usedCellMetas = []; // Clear the sequence of used cells
}

/**
 * Marks a cell temporarily for "Show Answer" mode.
 */
function markCellAsTemporaryCorrect(meta) { // <--- REVISED FUNCTION
    // DO NOT set meta.isUsed = true, as this is for user progress only.
  
    tempShowAnswerCellMetas.push(meta); // Track the cell in the TEMPORARY sequence
  
    parentDiv = meta.tspan ? meta.tspan.closest("div") : null;
  
    // Add correct highlight class
    if (parentDiv) parentDiv.classList.add("correct");
  }

  /**
 * Resets the visual appearance only for the TEMPORARY (show answer) cells, 
 * and then reapplies the visual state for the cells the user has correctly found.
 */
  function resetTemporaryAnswerVisuals() {
    // 1. Remove ALL temporary highlights.
    tempShowAnswerCellMetas.forEach(meta => {
        parentDiv = meta.tspan ? meta.tspan.closest("div") : null;
        if (parentDiv) parentDiv.classList.remove("correct");
    });
    tempShowAnswerCellMetas = [];

    // 2. Re-apply the green highlight class to the cells the user has correctly found (usedCellMetas).
    // This restores the visual state of the user's persistent progress.
    usedCellMetas.forEach(meta => {
        parentDiv = meta.tspan ? meta.tspan.closest("div") : null;
        if (parentDiv) {
            // Ensure the 'correct' class is present for the user's progress
            parentDiv.classList.add("correct"); 
        }
    });
}

function flattenGrid(grid) {
  return grid.reduce((acc, row) => acc.concat(row), []);
}

/**
 * Blink a single cell red.
 * @param {object} meta The cell meta object to blink.
 */
function blinkSingleWrongFeedback(meta) {
  if (!meta) return;

  // Blink Red
  parentDiv = meta.tspan ? meta.tspan.closest("div") : null;

  // ADD the class
  if (parentDiv) parentDiv.classList.add("wrong");

  // Revert after duration
  setTimeout(() => {
    if (parentDiv) parentDiv.classList.remove("wrong");
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

  document.querySelectorAll('[id^="Group"]').forEach(el => {
    el.style.cursor = "pointer";
  });

  if (showAnswerButtonRef) {
    showAnswerButtonRef.textContent = SHOW_ANSWER_TEXT;
  }

  currentWord.grid_data = gridToLoad;
  preloadWordSoundTiming(currentWord);

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
  // Stop previous audio and any pending word sound / completion reveal
  cancelPendingWordSound();
  clearTimeout(wordCompleteTimer);
  wordCompleteTimer = null;
  if (activeWordAudio) {
    activeWordAudio.pause();
    activeWordAudio.currentTime = 0;
  }

  const nextWord = getNextWord();
  isShowAnswer = false;
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
  document.querySelectorAll('[id^="Group"]').forEach(el => {
    el.style.cursor = "auto";
  });  
  setSoundPromptState(false);
  // Word sound plays 1 sec after the last letter's sound ends
  playWordSoundAfterLetter();
  clearTimeout(wordCompleteTimer);
  wordCompleteTimer = setTimeout(() => {
    wordCompleteTimer = null;
    showFinalImage();
    showAnswerButtonRef.disabled = true;
  }, 1200);
}

let wordCompleteTimer = null;

/**
 * Finds the cells of the answer word in the grid: a straight line in any of the
 * 8 directions (horizontal, vertical, diagonal, forwards or backwards).
 */
function findAnswerPath(chars) {
  const directions = [[0, 1], [1, 0], [1, 1], [1, -1], [0, -1], [-1, 0], [-1, -1], [-1, 1]];
  const cellAt = (r, c) => gridCellMetas.find(meta => meta.row === r && meta.col === c);
  for (const start of gridCellMetas) {
    if (start.letter !== chars[0]) continue;
    for (const [dRow, dCol] of directions) {
      const path = [];
      for (let k = 0; k < chars.length; k++) {
        const cell = cellAt(start.row + dRow * k, start.col + dCol * k);
        if (!cell || cell.letter !== chars[k]) break;
        path.push(cell);
      }
      if (path.length === chars.length) return path;
    }
  }
  return null;
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
    usedCellMetas.push(meta);
    // 3. Mark the cell as used/disabled and give green feedback
   // markCellAsCorrect(meta);
    markCellAsTemporaryCorrect(meta);

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
      // --- SHOW ANSWER ---
      // ... (Show Answer logic remains as previously revised)
      
      // Lock the game and show the full path
      isGameLocked = true; 
      isShowAnswer = true;
      resetTemporaryAnswerVisuals(); // Clears any previous temp marks, but restores user marks

      document.querySelectorAll('[id^="Group"]').forEach(el => {
        el.style.cursor = "auto";
      });      
      
      // Highlight the answer path in the grid
      const answerPath = findAnswerPath(currentWord.correct_answer_char_array);
      if (answerPath) {
          answerPath.forEach(meta => markCellAsTemporaryCorrect(meta));
      } else {
          console.error(`Answer path not found in the grid for "${currentWord.word}"`);
      }

      // UI updates
      showFinalImage();
      playWordSoundAfterDelay(SHOW_ANSWER_WORD_SOUND_DELAY_MS);
      setSoundPromptState(false);
      if (showAnswerButtonRef) {
          showAnswerButtonRef.textContent = HIDE_ANSWER_TEXT;
      }

  } else {
      // --- HIDE ANSWER ---
      cancelPendingWordSound();
      hideFinalImage();
      
      // This function removes the full-solution highlight AND restores the user's progress highlight.
      resetTemporaryAnswerVisuals(); 
    
      isGameLocked = false; // Unlock the game
      isShowAnswer = false;

      document.querySelectorAll('[id^="Group"]').forEach(el => {
        el.style.cursor = "pointer";
      });
      
      if (showAnswerButtonRef) {
          showAnswerButtonRef.textContent = SHOW_ANSWER_TEXT;
      }
      // User's progress (userAnswerArray and usedCellMetas) is preserved.
  }
}

// --- UI Functions ---

function showFinalImage() {
  if (!currentWord || !finalImageElement) return;

  const imagePath = IMAGE_PATH_BASE + currentWord.image;

  const imgElement = finalImageElement.querySelector('img');

  if (imgElement) {
    imgElement.src = imagePath;
  }
  finalImageElement.style.display = "block";
  setTimeout(() => {
    finalImageElement.classList.add("show");  // animate
  }, 10);
}

function hideFinalImage() {
  if (finalImageElement) {
    finalImageElement.style.display = "none";
    setTimeout(() => {
      finalImageElement.classList.remove("show");  // animate
    }, 10);
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
  initGame();
});