const STANZAS = [
  {
    "stanza": [
      "Slowly, silently, now the moon",
      "Walks the night in her silver shoon;",
      "This way, and that, she peers, and sees",
      "Silver fruit upon silver trees;"
    ],
    "source": "Silver, Walter de la Mare",
    "rhyming_words": {
      "a": ["moon", "shoon"],
      "b": ["sees", "trees"]
    },
    "rhyme_scheme": "aabb"
  },
  {
    "stanza": [
      "One by one the casements catch",
      "Her beams beneath the silvery thatch;",
      "Couched in his kennel, like a log,",
      "With paws of silver sleeps the dog;"
    ],
    "source": "Silver, Walter de la Mare",
    "rhyming_words": {
      "a": ["catch", "thatch"],
      "b": ["log", "dog"]
    },
    "rhyme_scheme": "aabb"
  },
  {
    "stanza": [
      "The woman was old and ragged and gray,",
      "And bent with the chill of a winter’s day;",
      "The streets were white with a recent snow,",
      "And the woman’s feet with age were slow."
    ],
    "source": "Somebody’s Mother, Mary Dow Brine",
    "rhyming_words": {
      "a": ["gray", "day"],
      "b": ["snow", "slow"]
    },
    "rhyme_scheme": "aabb"
  },
  {
    "stanza": [
      "Out of the night that covers me,",
      "Black as the Pit from pole to pole",
      "I thank whatever gods may be",
      "For my unconquerable soul."
    ],
    "source": "Invictus, William Ernst Henley",
    "rhyming_words": {
      "a": ["me", "be"],
      "b": ["pole", "soul"]
    },
    "rhyme_scheme": "abab"
  },
  {
    "stanza": [
      "In the fell clutch of circumstance",
      "I have not winced nor cried aloud.",
      "Under the bludgeonings of chance",
      "My head is bloody, but unbowed."
    ],
    "source": "Invictus, William Ernst Henley",
    "rhyming_words": {
      "a": ["circumstance", "chance"],
      "b": ["aloud", "unbowed"]
    },
    "rhyme_scheme": "abab"
  },
  {
    "stanza": [
      "Have you ever seen a sheet on a riverbed?",
      "Or a single hair from a hammer’s head?",
      "Has the foot of a mountain any toes?",
      "And is there a pair of garden hose?"
    ],
    "source": null,
    "rhyming_words": {
      "a": ["riverbed", "head"],
      "b": ["toes", "hose"]
    },
    "rhyme_scheme": "aabb"
  },
  {
    "stanza": [
      "A thing of beauty is a joy for ever",
      "Its loveliness increases; it will never",
      "Pass into nothingness; but still will keep",
      "A bower quiet for us, and a sleep"
    ],
    "source": "A Thing of Beauty, John Keats",
    "rhyming_words": {
      "a": ["ever", "never"],
      "b": ["keep", "sleep"]
    },
    "rhyme_scheme": "aabb"
  },
  {
    "stanza": [
      "Full of sweet dreams, and health and quiet breathing.",
      "Therefore, on every morrow, are we wreathing",
      "A flowery band to bind us to the earth,",
      "Spite of despondence, of the inhuman dearth"
    ],
    "source": "A Thing of Beauty, John Keats",
    "rhyming_words": {
      "a": ["breathing", "wreathing"],
      "b": ["earth", "dearth"]
    },
    "rhyme_scheme": "aabb"
  },
  {
    "stanza": [
      "Turn, turn thy hasty foot aside,",
      "Nor crush that helpless worm!",
      "The frame thy scornful looks deride",
      "Requir’d a God to form."
    ],
    "source": "The Worm, Thomas Gisborne",
    "rhyming_words": {
      "a": ["aside", "deride"],
      "b": ["worm", "form"]
    },
    "rhyme_scheme": "abab"
  },
  {
    "stanza": [
      "The common Lord of all that move,",
      "From whom thy being flow’d,",
      "A portion of His boundless love",
      "On that poor worm bestow’d."
    ],
    "source": "The Worm, Thomas Gisborne",
    "rhyming_words": {
      "a": ["move", "love"],
      "b": ["flow’d", "bestow’d"]
    },
    "rhyme_scheme": "abab"
  },
  {
    "stanza": [
      "Tell me, tell me, smiling child,",
      "What the past is like to thee?",
      "‘An Autumn evening soft and mild",
      "With a wind that sighs mournfully.’"
    ],
    "source": "Past, Present, Future, Emily Bronte",
    "rhyming_words": {
      "a": ["child", "mild"],
      "b": ["thee", "mournfully"]
    },
    "rhyme_scheme": "abab"
  },
  {
    "stanza": [
      "And what is the future, happy one?",
      "‘A sea beneath a cloudless sun;",
      "A mighty, glorious, dazzling sea",
      "Stretching into infinity."
    ],
    "source": "Past, Present, Future, Emily Bronte",
    "rhyming_words": {
      "a": ["one", "sun"],
      "b": ["sea", "infinity"]
    },
    "rhyme_scheme": "aabb"
  },
  {
    "stanza": [
      "I come from haunts of coot and hern,",
      "I make a sudden sally",
      "And sparkle out among the fern,",
      "To bicker down a valley."
    ],
    "source": "The Brook, Alfred Tennyson",
    "rhyming_words": {
      "a": ["hern", "fern"],
      "b": ["sally", "valley"]
    },
    "rhyme_scheme": "abab"
  },
  {
    "stanza": [
      "Till last by Philip’s farm I flow",
      "To join the brimming river,",
      "For men may come and men may go,",
      "But I go on forever."
    ],
    "source": "The Brook, Alfred Tennyson",
    "rhyming_words": {
      "a": ["flow", "go"],
      "b": ["river", "forever"]
    },
    "rhyme_scheme": "abab"
  },
  {
    "stanza": [
      "Belinda lived in a little white house,",
      "With a little black kitten and a little grey mouse,",
      "And a little yellow dog and a little red wagon,",
      "And a realio, trulio, little pet dragon."
    ],
    "source": "The Tale of Custard the Dragon, Ogden Nash",
    "rhyming_words": {
      "a": ["house", "mouse"],
      "b": ["wagon", "dragon"]
    },
    "rhyme_scheme": "aabb"
  }
];

const wordsAudio = {
  "Stanza_01": "./Assets/Audio/Stanza_01",
  "Stanza_02": "./Assets/Audio/Stanza_02",
  "Stanza_03": "./Assets/Audio/Stanza_03",
  "Stanza_04": "./Assets/Audio/Stanza_04",
  "Stanza_05": "./Assets/Audio/Stanza_05",
  "Stanza_06": "./Assets/Audio/Stanza_06",
  "Stanza_07": "./Assets/Audio/Stanza_07",
  "Stanza_08": "./Assets/Audio/Stanza_08",
  "Stanza_09": "./Assets/Audio/Stanza_09",
  "Stanza_10": "./Assets/Audio/Stanza_10",
  "Stanza_11": "./Assets/Audio/Stanza_11",
  "Stanza_12": "./Assets/Audio/Stanza_12",
  "Stanza_13": "./Assets/Audio/Stanza_13",
  "Stanza_14": "./Assets/Audio/Stanza_14",
  "Stanza_15": "./Assets/Audio/Stanza_15",
  "Stanza_16": "./Assets/Audio/Stanza_16",
  "Stanza_17": "./Assets/Audio/Stanza_17",
  "Stanza_18": "./Assets/Audio/Stanza_18",
  "Stanza_19": "./Assets/Audio/Stanza_19",
  "Stanza_20": "./Assets/Audio/Stanza_20",
  "Stanza_21": "./Assets/Audio/Stanza_21",
  "Stanza_22": "./Assets/Audio/Stanza_22",
  "Stanza_23": "./Assets/Audio/Stanza_23",
  "Stanza_24": "./Assets/Audio/Stanza_24",
  "Stanza_25": "./Assets/Audio/Stanza_25",
  "Stanza_26": "./Assets/Audio/Stanza_26",
  "Stanza_27": "./Assets/Audio/Stanza_27",
  "Stanza_28": "./Assets/Audio/Stanza_28",
  "Stanza_29": "./Assets/Audio/Stanza_29"
}

// --- UI wiring & interaction ---
let currentStanzaIndex = 0;
let activeMarker = null;
let markers = {};
let letterColors = {}; // letter -> { color, spans: Set<tspan> }
let activeRhyme = null;        // 'a' or 'b'
let completedRhymes = new Set();

let correctWordsSet = new Set();   // stores correctly answered word elements
let stanzaAudioPlayed = false;    // prevents repeat audio

const markerStyles = {
  green: { color: '#7ef241', cursor: "url('Assets/Images/Final images/Green_Highlighter.svg'), auto" },
  yellow: { color: '#f7f734', cursor: "url('Assets/Images/Final images/Yellow_Highlighter.svg'), auto" },
  blue: { color: '#43ceff', cursor: "url('Assets/Images/Final images/Blue_Highlighter.svg'), auto" },
  pink: { color: '#ff43b7', cursor: "url('Assets/Images/Final images/Pink_Highlighter.svg'), auto" },
};

function setMarkerEnabled(markerEl, enabled) {
  if (!markerEl) return;
  markerEl.style.pointerEvents = enabled ? 'auto' : 'none';
  markerEl.style.opacity = enabled ? '1' : '0.4';
}

function resetMarkers() {
  activeMarker = null;
  document.body.style.cursor = 'default';
  setMarkerEnabled(markers.green, true);
  ['yellow', 'blue', 'pink'].forEach(k => setMarkerEnabled(markers[k], false));

  for (let i = 1; i <= 4; i++) {
    const rEl = document.getElementById(`r${i}`);
    const signEl = document.getElementById(`sign${i}`);

    if (rEl) rEl.textContent = '';
    if (signEl) signEl.textContent = '';
  }

}

function setActiveMarker(name, opts = {}) {
  const { unlockOthers = false } = opts;
  const style = markerStyles[name];
  if (!style) return;
  activeMarker = { name, ...style };
  document.body.style.cursor = style.cursor;
  // Unlock other markers only after the user explicitly clicks green
  if (name === 'green' && unlockOthers) {
    ['yellow', 'blue', 'pink'].forEach(k => setMarkerEnabled(markers[k], true));
  }
}

function findLetterForWord(word, rhymingWords) {
  if (!word || !rhymingWords) return null;
  const lw = word.replace(/[^\w']/g, '').toLowerCase();
  for (const [letter, list] of Object.entries(rhymingWords)) {
    if (list.some(w => w.replace(/[^\w']/g, '').toLowerCase() === lw)) {
      return letter;
    }
  }
  return null;
}

function wrapLastWord(lineEl, text, lineIndex, rhymingWords) {
  if (!lineEl) return;
  lineEl.innerHTML = ''; // Clear existing

  const words = text.trim().split(/\s+/);
  const last = words.pop();
  const before = words.join(' ');

  // Add the plain text before the last word
  if (before) {
    lineEl.appendChild(document.createTextNode(before + ' '));
  }

  // Create the "Box" word (Standard HTML span)
  const clickable = document.createElement('span');
  clickable.textContent = last;
  clickable.classList.add('clickable-word');

  // Set data attributes
  clickable.setAttribute('data-line', lineIndex);
  clickable.setAttribute('data-word', last);

  // Find the target rhyme letter (a, b, etc.)
  const letter = findLetterForWord(last, rhymingWords);
  if (letter) {
    clickable.setAttribute('data-letter-target', letter);
  }

  lineEl.appendChild(clickable);
}

function applyHighlight(el, letter, markerColor, isCorrectIgnored, idx) {
  if (!el || !activeMarker) return;

  const rhymeColorMap = {
    a: markerStyles.green.color,
    b: markerStyles.yellow.color,
    c: markerStyles.blue.color,
    d: markerStyles.pink.color
  };

  const schemaColor = rhymeColorMap[letter];
  const isCorrect = markerColor === schemaColor;

  /* WORD STYLE */
  el.style.backgroundColor = isCorrect ? schemaColor : markerColor;
  el.style.color = "white";
  el.style.padding = "0px 8px";
  el.style.fontWeight = "bold";
  el.style.display = "inline-block";

  /* SIDE INDICATORS */
  if (typeof idx === "number") {
    const letterTag = document.getElementById(`r${idx + 1}`);
    const signTag = document.getElementById(`sign${idx + 1}`);

    if (letterTag) {
      letterTag.textContent = letter;
      letterTag.style.fill = schemaColor; // ALWAYS schema color
    }

    if (signTag) {
      signTag.textContent = isCorrect ? " ✅" : " ✗";
      // ❗ No green/red coloring
    }

    if (isCorrect) {
      correctWordsSet.add(el);
    } else {
      correctWordsSet.delete(el); // important if marker changed
    }

    checkAndPlayStanzaAudio();
  }
}


let firstWordClicked = false; // Global or scoped state

function attachWordClicks(rhymingWords, scheme) {
  const words = document.querySelectorAll('.clickable-word');
  const warningDiv = document.getElementById('warning');
  let letterColors = {};
  firstWordClicked = false; // Reset for new stanza

  words.forEach((el, idx) => {
    const targetLetter = el.getAttribute('data-letter-target');

    el.onclick = () => {
      // 1. Restriction: If it's NOT the first line and first line isn't clicked yet
      if (idx !== 0 && !firstWordClicked) {
        warningDiv.style.display = 'block';
        return;
      }

      // 2. If clicking the first line, unlock others
      if (idx === 0) {
        firstWordClicked = true;
        warningDiv.style.display = 'none';
      }

      // 3. Normal Highlighting Logic
      if (!activeMarker) return;
      const chosenColor = activeMarker.color;

      if (!letterColors[targetLetter]) {
        letterColors[targetLetter] = { spans: new Set() };
      }
      const record = letterColors[targetLetter];

      // Limit to 2 words per rhyme
      if (record.spans.size >= 2 && !record.spans.has(el)) {
        applyHighlight(el, targetLetter, activeMarker.color, false, idx);
        return;
      }

      // Add clicked word
      record.spans.add(el);

      // 🔥 ALWAYS re-evaluate using CURRENT marker color
      record.spans.forEach(span => {
        applyHighlight(
          span,
          targetLetter,
          activeMarker.color, // ← current marker ONLY
          true,
          idx
        );
      });


      // if (!letterColors[targetLetter]) {
      //   letterColors[targetLetter] = { color: chosenColor, spans: new Set() };
      // }
      // const record = letterColors[targetLetter];

      // // Limit to 2 words per rhyme
      // if (record.spans.size >= 2 && !record.spans.has(el)) {
      //    applyHighlight(el, targetLetter, chosenColor, false, idx);
      //    return;
      // }

      // record.spans.add(el);
      // const isComplete = record.spans.size === 2;

      // record.spans.forEach(span => {
      //   // We pass 'idx' of the current click to update the specific sign
      //   applyHighlight(span, targetLetter, record.color, isComplete, idx);
      // });
    };
  });
}

// function attachWordClicks(rhymingWords, scheme) {
//   letterColors = {}; 
//   const words = document.querySelectorAll('.clickable-word');
//   const warningDiv = document.getElementById('warning');

//   // Track if the first word (index 0) has been clicked
//   let firstWordClicked = false;

//   words.forEach((el, idx) => {
//     const targetLetter = el.getAttribute('data-letter-target') || (scheme[idx] || 'a');

//     el.onclick = () => {
//       // 1. Check if the user is trying to click a later word before the first word
//       if (idx !== 0 && !firstWordClicked) {
//         if (warningDiv) {
//           warningDiv.textContent = "Please select a word from the first line first!";
//           warningDiv.style.display = 'block';
//         }
//         return; // Stop execution here
//       }

//       // 2. If they clicked the first word, unlock the rest and hide warning
//       if (idx === 0) {
//         firstWordClicked = true;
//         if (warningDiv) warningDiv.style.display = 'none';
//       }

//       // --- Rest of your existing logic ---
//       if (!activeMarker || !targetLetter) return;
//       const chosenColor = activeMarker.color;

//       if (!letterColors[targetLetter]) {
//         letterColors[targetLetter] = { color: chosenColor, spans: new Set() };
//       }
//       const record = letterColors[targetLetter];

//       if (record.color !== chosenColor && record.spans.size < 2) {
//         record.color = chosenColor;
//         record.spans.forEach(span => applyHighlight(span, targetLetter, record.color, record.spans.size === 2, idx));
//       }

//       if (record.spans.size >= 2 && !record.spans.has(el)) {
//         applyHighlight(el, targetLetter, chosenColor, false, idx);
//         return;
//       }

//       record.spans.add(el);
//       const isCompletePair = record.spans.size === 2;
//       record.spans.forEach(span => applyHighlight(span, targetLetter, record.color, isCompletePair, idx));
//     };
//   });
// }

// Reveal correct answer with default colors (a: green, b: yellow)
function showAnswer() {
  const stanzaObj = STANZAS[currentStanzaIndex % STANZAS.length];
  if (!stanzaObj) return;
  const rhymingWords = stanzaObj.rhyming_words || {};
  const defaultColors = { a: markerStyles.green.color, b: markerStyles.yellow.color };

  document.querySelectorAll('.clickable-word').forEach(el => {
    const letter = el.getAttribute('data-letter-target') || 'a';
    const color = defaultColors[letter] || markerStyles.green.color;
    applyHighlight(el, letter, color, true);
  });

  playCurrentStanzaAudio();
}

function getCurrentStanzaKey() {
  const num = String(currentStanzaIndex + 1).padStart(2, '0');
  return `Stanza_${num}`;
}

let stanzaAudio = null;

function playCurrentStanzaAudio() {
  const stanzaKey = getCurrentStanzaKey();
  const audioSrc = wordsAudio[stanzaKey];

  if (!audioSrc) return;

  // Stop previous audio if playing
  if (stanzaAudio) {
    stanzaAudio.pause();
    stanzaAudio.currentTime = 0;
  }
  console.log(audioSrc)
  stanzaAudio = new Audio(`${audioSrc}.mp3`); // add extension if needed
  stanzaAudio.play().catch(err => {
    console.warn("Audio play blocked:", err);
  });
}

function resetForNextStanza() {
  correctWordsSet.clear();
  stanzaAudioPlayed = false;
}

function checkAndPlayStanzaAudio() {
  if (stanzaAudioPlayed) return;

  const totalWords = document.querySelectorAll('.clickable-word').length;

  if (correctWordsSet.size === totalWords) {
    stanzaAudioPlayed = true;
    playCurrentStanzaAudio(); // your existing function
  }
}

function renderStanza(index) {
  const stanzaObj = STANZAS[index % STANZAS.length];
  if (!stanzaObj) return;

  const [line1 = '', line2 = '', line3 = '', line4 = ''] = stanzaObj.stanza || [];
  const author = stanzaObj.source || 'Unknown author';
  const rhymingWords = stanzaObj.rhyming_words || {};

  const s1 = document.getElementById('S1');
  const s2 = document.getElementById('S2');
  const s3 = document.getElementById('S3');
  const s4 = document.getElementById('S4');
  const authorEl = document.getElementById('author');

  wrapLastWord(s1, line1, 0, rhymingWords);
  wrapLastWord(s2, line2, 1, rhymingWords);
  wrapLastWord(s3, line3, 2, rhymingWords);
  wrapLastWord(s4, line4, 3, rhymingWords);
  if (authorEl) authorEl.textContent = `- ${author}`;

  attachWordClicks(rhymingWords, stanzaObj.rhyme_scheme || '');

  // Reset marker state per stanza; require green click to unlock others
  resetMarkers();
}

function nextStanza() {
  currentStanzaIndex = (currentStanzaIndex + 1) % STANZAS.length;
  renderStanza(currentStanzaIndex);
  activeRhyme = null;
}

// Wire show answer to button if present
function bindShowAnswer() {
  const btn = document.getElementById('showAnswer');
  if (btn) btn.addEventListener('click', showAnswer);
}

document.addEventListener('DOMContentLoaded', function () {

  // Fetch marker elements after DOM ready
  markers.green = document.getElementById('green-marker');
  markers.yellow = document.getElementById('yellow-marker');
  markers.blue = document.getElementById('blue-marker');
  markers.pink = document.getElementById('pink-marker');

  // Only green enabled initially
  resetMarkers();

  if (markers.green) markers.green.addEventListener('click', () => setActiveMarker('green', { unlockOthers: true }));
  if (markers.yellow) markers.yellow.addEventListener('click', () => setActiveMarker('yellow'));
  if (markers.blue) markers.blue.addEventListener('click', () => setActiveMarker('blue'));
  if (markers.pink) markers.pink.addEventListener('click', () => setActiveMarker('pink'));

  // initial render
  renderStanza(currentStanzaIndex);
  bindShowAnswer();

  // wire Next button
  const nextBtn = document.getElementById('next-btn');
  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      nextStanza();
      resetForNextStanza();
    });

    function resetRhymeState() {
      activeRhyme = null;
      completedRhymes = new Set();
      firstWordClicked = false;
      letterColors = {};

      // Reset words
      document.querySelectorAll('.clickable-word').forEach(el => {
        el.style.backgroundColor = "";
        el.style.color = "";
        el.style.padding = "";
        el.style.fontWeight = "";
      });

      // Reset indicators
      document.querySelectorAll('[id^="r"]').forEach(el => {
        el.textContent = "";
        el.style.fill = "";
      });

      document.querySelectorAll('[id^="sign"]').forEach(el => {
        el.textContent = "";
      });

      const warningDiv = document.getElementById('warning');
      if (warningDiv) warningDiv.style.display = 'none';
    }
  }

  const showAnswerBtn = document.getElementById('showAnswer');
  if (showAnswerBtn) {
    showAnswerBtn.addEventListener('click', showAnswer);
  }
});