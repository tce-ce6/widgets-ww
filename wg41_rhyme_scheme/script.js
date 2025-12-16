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
      "Have you ever seen a sheet on a river bed?",
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
      "A thing of beauty is a joy for ever :",
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

// --- UI wiring & interaction ---
const svgNS = 'http://www.w3.org/2000/svg';
let currentStanzaIndex = 0;
let activeMarker = null;
let markers = {};
let letterColors = {}; // letter -> { color, spans: Set<tspan> }

const markerStyles = {
  green: { color: '#73C050', cursor: "url('Assets/Images/Final images/Green_Highlighter.svg'), auto" },
  yellow: { color: '#E8B83F', cursor: "url('Assets/Images/Final images/Yellow_Highlighter.svg'), auto" },
  blue: { color: '#4FA3FF', cursor: "url('Assets/Images/Final images/Blue_Highlighter.svg'), auto" },
  pink: { color: '#FF6FB7', cursor: "url('Assets/Images/Final images/Pink_Highlighter.svg'), auto" },
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
  lineEl.innerHTML = '';
  const words = text.trim().split(/\s+/);
  if (words.length === 0) return;
  const last = words.pop();
  const before = words.join(' ');

  if (before) {
    lineEl.appendChild(document.createTextNode(before + ' '));
  }

  const clickable = document.createElementNS(svgNS, 'tspan');
  clickable.textContent = last;
  clickable.setAttribute('data-line', lineIndex);
  clickable.setAttribute('data-word', last);

  const letter = findLetterForWord(last, rhymingWords);
  if (letter) {
    clickable.setAttribute('data-letter-target', letter);
  }

  clickable.classList.add('clickable-word');
  lineEl.appendChild(clickable);
}

function applyHighlight(tspan, letter, color, isCorrect, idx) {
  if (!tspan || !activeMarker) return;
  console.log(idx)

  const word = tspan.getAttribute('data-word') || tspan.textContent;
  tspan.setAttribute('data-word', word);
  tspan.setAttribute('data-letter', letter);
  tspan.setAttribute('data-marker', activeMarker.name);
  tspan.style.paintOrder = 'stroke';
  tspan.style.stroke = color;
  tspan.style.strokeWidth = '8px';
  tspan.style.strokeLinecap = 'butt';
  tspan.style.strokeLinejoin = 'round';
  tspan.style.fill = '#000';
  tspan.style.fontWeight = 'bold';
  tspan.textContent = `${word}`;
  if (idx >= 0 && idx <= 3) {
    document.getElementById(`r${idx + 1}`).textContent = letter;
    document.getElementById(`sign${idx + 1}`).textContent = `${isCorrect ? ' ✅' : ' ✗'}`;
  }
}

function attachWordClicks(rhymingWords, scheme) {
  letterColors = {}; // reset per stanza
  const words = document.querySelectorAll('.clickable-word');
  words.forEach((el, idx) => {
    const targetLetter = el.getAttribute('data-letter-target') || (scheme[idx] || 'a');
    console.log(idx)

    el.onclick = () => {
      if (!activeMarker || !targetLetter) return;
      const chosenColor = activeMarker.color;
      // initialize record
      if (!letterColors[targetLetter]) {
        letterColors[targetLetter] = { color: chosenColor, spans: new Set() };
      }
      const record = letterColors[targetLetter];

      // Allow recolor before the pair is completed
      if (record.color !== chosenColor && record.spans.size < 2) {
        record.color = chosenColor;
        record.spans.forEach(span => applyHighlight(span, targetLetter, record.color, record.spans.size === 2), idx);
      }

      // Prevent more than two words per rhyme letter
      if (record.spans.size >= 2 && !record.spans.has(el)) {
        applyHighlight(el, targetLetter, chosenColor, false, idx);
        return;
      }

      record.spans.add(el);

      // Apply highlighting
      const isCompletePair = record.spans.size === 2;
      record.spans.forEach(span => applyHighlight(span, targetLetter, record.color, isCompletePair, idx));

      // Update the letter tag color (r1/r2/r3/r4)
      // const tagId = targetLetter === 'a' ? 'r1' : targetLetter === 'b' ? 'r3' : null;
      // if (tagId) {
      //   const tagEl = document.getElementById(tagId);
      //   if (tagEl) {
      //     tagEl.textContent = targetLetter;
      //     tagEl.style.fill = record.color;
      //   }
      // }
    };
  });
}

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
    nextBtn.addEventListener('click', nextStanza);
  }
});