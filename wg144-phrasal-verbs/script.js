// ── Spiral holes
(function () {
  var c = document.getElementById("spiralHoles");
  var n = Math.ceil(window.innerHeight / 80);
  for (var i = 0; i < n; i++) {
    var h = document.createElement("div");
    h.className = "spiral-hole";
    h.style.top = 40 + i * 80 + "px";
    c.appendChild(h);
  }
})();

// ── Data
var PHRASAL_VERBS = [
  {
    head: "look",
    verb: "look up",
    meaning: "to search for information in a book or online",
    example: "I need to look up the meaning of this word in the dictionary.",
    fib: "I need to ___ the meaning of this word in the dictionary.",
  },
  {
    head: "look",
    verb: "look forward to",
    meaning: "to feel excited about something that is going to happen",
    example: "The children are looking forward to the summer holidays.",
    fib: "The children are ___ the summer holidays.",
  },
  {
    head: "look",
    verb: "look after",
    meaning: "to take care of someone or something",
    example:
      "My grandmother looks after my little brother when my parents are at work.",
    fib: "My grandmother ___ my little brother when my parents are at work.",
  },
  {
    head: "look",
    verb: "look down on",
    meaning: "to think that someone is less important than you",
    example: "She looks down on people who don't read books.",
    fib: "She ___ people who don't read books.",
  },
  {
    head: "take",
    verb: "take off",
    meaning: "to remove clothing; or (of a plane) to leave the ground",
    example: "Please take off your shoes before entering the house.",
    fib: "Please ___ your shoes before entering the house.",
  },
  {
    head: "take",
    verb: "take up",
    meaning: "to start doing a new activity or hobby",
    example: "He decided to take up painting after he retired.",
    fib: "He decided to ___ painting after he retired.",
  },
  {
    head: "take",
    verb: "take after",
    meaning: "to look or behave like an older family member",
    example: "She really takes after her mother — they have the same smile.",
    fib: "She really ___ her mother — they have the same smile.",
  },
  {
    head: "take",
    verb: "take over",
    meaning: "to begin to have control of something",
    example: "The new manager will take over the department next month.",
    fib: "The new manager will ___ the department next month.",
  },
  {
    head: "give",
    verb: "give up",
    meaning: "to stop trying or to quit a habit",
    example: "He gave up smoking last year and feels much healthier now.",
    fib: "He ___ smoking last year and feels much healthier now.",
  },
  {
    head: "give",
    verb: "give away",
    meaning: "to give something to someone for free; or to reveal a secret",
    example: "Don't give away the ending of the movie!",
    fib: "Don't ___ the ending of the movie!",
  },
  {
    head: "give",
    verb: "give in",
    meaning: "to finally agree to something you were against",
    example:
      "After much argument, the father gave in and let them go to the party.",
    fib: "After much argument, the father ___ and let them go to the party.",
  },
  {
    head: "break",
    verb: "break down",
    meaning: "to stop working (a machine); or to become very upset",
    example: "The car broke down in the middle of the highway.",
    fib: "The car ___ in the middle of the highway.",
  },
  {
    head: "break",
    verb: "break out",
    meaning: "to start suddenly (used for wars, fires, diseases)",
    example: "A fire broke out in the old building last night.",
    fib: "A fire ___ in the old building last night.",
  },
  {
    head: "break",
    verb: "break into",
    meaning: "to enter a place by force, usually to steal",
    example: "Someone broke into our neighbour's house while they were away.",
    fib: "Someone ___ our neighbour's house while they were away.",
  },
  {
    head: "break",
    verb: "break up",
    meaning: "to end a relationship",
    example: "They broke up after dating for three years.",
    fib: "They ___ after dating for three years.",
  },
  {
    head: "turn",
    verb: "turn down",
    meaning: "to refuse an offer; or to reduce the volume",
    example: "She turned down the job offer because the salary was too low.",
    fib: "She ___ the job offer because the salary was too low.",
  },
  {
    head: "turn",
    verb: "turn up",
    meaning: "to arrive, often unexpectedly; or to increase the volume",
    example: "He turned up at the party without an invitation.",
    fib: "He ___ at the party without an invitation.",
  },
  {
    head: "turn",
    verb: "turn into",
    meaning: "to change and become something different",
    example: "The caterpillar turns into a beautiful butterfly.",
    fib: "The caterpillar ___ a beautiful butterfly.",
  },
  {
    head: "turn",
    verb: "turn off",
    meaning: "to stop a machine or device from working",
    example: "Please turn off the lights before you leave.",
    fib: "Please ___ the lights before you leave.",
  },
  {
    head: "put",
    verb: "put off",
    meaning: "to delay or postpone something",
    example: "Stop putting off your homework — do it now!",
    fib: "Stop ___ your homework — do it now!",
  },
  {
    head: "put",
    verb: "put up with",
    meaning: "to tolerate something unpleasant",
    example: "I can't put up with this noise any longer.",
    fib: "I can't ___ this noise any longer.",
  },
  {
    head: "put",
    verb: "put on",
    meaning: "to place clothing on your body",
    example: "It's cold outside — put on a warm jacket.",
    fib: "It's cold outside — ___ a warm jacket.",
  },
  {
    head: "put",
    verb: "put out",
    meaning: "to extinguish a fire or flame",
    example: "The firefighters quickly put out the blaze.",
    fib: "The firefighters quickly ___ the blaze.",
  },
];

var HEAD_VERBS = [];
(function () {
  var s = {};
  PHRASAL_VERBS.forEach(function (p) {
    s[p.head] = 1;
  });
  HEAD_VERBS = Object.keys(s).sort();
})();

function shuffle(a) {
  a = a.slice();
  for (var i = a.length - 1; i > 0; i--) {
    var j = Math.floor(Math.random() * (i + 1));
    var t = a[i];
    a[i] = a[j];
    a[j] = t;
  }
  return a;
}
function verbCount(h) {
  return PHRASAL_VERBS.filter(function (p) {
    return p.head === h;
  }).length;
}

// ── Confetti
function launchConfetti() {
  var c = document.getElementById("confetti");
  var colors = [
    "#FFF59D",
    "#F48FB1",
    "#81D4FA",
    "#C8E6C9",
    "#FFAB91",
    "#CE93D8",
    "#EF5350",
    "#42A5F5",
    "#66BB6A",
    "#FFA726",
  ];
  for (var i = 0; i < 45; i++) {
    var p = document.createElement("div");
    p.className = "confetti-piece";
    var col = colors[Math.floor(Math.random() * colors.length)];
    var sz = 6 + Math.random() * 10;
    p.style.left = Math.random() * 100 + "%";
    p.style.top = "15%";
    p.style.width = sz + "px";
    p.style.height = sz + "px";
    p.style.animationDelay = Math.random() * 0.5 + "s";
    p.style.animationDuration = 1 + Math.random() * 0.8 + "s";
    p.style.background = col;
    if (Math.random() > 0.5) p.style.borderRadius = "50%";
    c.appendChild(p);
  }
  setTimeout(function () {
    c.innerHTML = "";
  }, 2500);
}

// ── State
var state = {
  screen: "home",
  filter: null,
  menuOpen: false,
  learnDeck: [],
  learnIndex: 0,
  revealStage: 0,
  slideDir: "right",
  practiceDeck: [],
  practiceIndex: 0,
  practiceChosen: null,
  practiceOptions: [],
  practiceCorrectIdx: null,
  scoreCorrect: 0,
  scoreIncorrect: 0,
};

function getFiltered() {
  return state.filter
    ? PHRASAL_VERBS.filter(function (p) {
        return p.head === state.filter;
      })
    : PHRASAL_VERBS.slice();
}
function startLearn() {
  state.screen = "learn";
  state.learnDeck = shuffle(getFiltered());
  state.learnIndex = 0;
  state.revealStage = 0;
  state.menuOpen = false;
  render();
}
function startPractice() {
  state.screen = "practice";
  state.practiceDeck = shuffle(getFiltered());
  state.practiceIndex = 0;
  state.practiceChosen = null;
  state.scoreCorrect = 0;
  state.scoreIncorrect = 0;
  state.menuOpen = false;
  setupPracticeQ();
  render();
}
function setupPracticeQ() {
  var cur = state.practiceDeck[state.practiceIndex];
  if (!cur) return;
  var same = PHRASAL_VERBS.filter(function (p) {
    return p.head === cur.head && p.verb !== cur.verb;
  });
  var dist = shuffle(same).slice(0, 2);
  var opts = shuffle([cur].concat(dist));
  state.practiceOptions = opts.map(function (o) {
    return o.verb;
  });
  state.practiceCorrectIdx = state.practiceOptions.indexOf(cur.verb);
  state.practiceChosen = null;
}
function goHome() {
  state.screen = "home";
  state.menuOpen = false;
  render();
}
function setFilter(h) {
  state.filter = h;
  state.menuOpen = false;
  if (state.screen === "learn") startLearn();
  else if (state.screen === "practice") startPractice();
  else render();
}
function toggleMenu() {
  state.menuOpen = !state.menuOpen;
  render();
}
function closeMenu() {
  state.menuOpen = false;
  render();
}

function advanceReveal() {
  if (state.revealStage < 2) {
    state.revealStage++;
    var s2 = document.querySelector(".section-example");
    var s3 = document.querySelector(".section-meaning");
    var d1 = document.querySelector(".divider-1");
    var d2 = document.querySelector(".divider-2");
    var prompt = document.getElementById("tap-prompt");
    if (state.revealStage === 1) {
      if (s2) s2.classList.add("visible");
      if (d1) d1.classList.add("visible");
      if (prompt) prompt.textContent = "Tap again to see the meaning";
    } else if (state.revealStage === 2) {
      if (s3) s3.classList.add("visible");
      if (d2) d2.classList.add("visible");
      if (prompt) prompt.textContent = "";
    }
  }
}
function learnPrev() {
  if (state.learnIndex > 0) {
    state.learnIndex--;
    state.revealStage = 0;
    state.slideDir = "left";
    render();
  }
}
function learnNext() {
  if (state.learnIndex < state.learnDeck.length - 1) {
    state.learnIndex++;
    state.revealStage = 0;
    state.slideDir = "right";
    render();
  }
}
function choosePractice(i) {
  if (state.practiceChosen !== null) return;
  state.practiceChosen = i;
  var ok = i === state.practiceCorrectIdx;
  if (ok) {
    state.scoreCorrect++;
    setTimeout(launchConfetti, 100);
  } else {
    state.scoreIncorrect++;
    setTimeout(function () {
      var card = document.querySelector(".practice-sentence");
      if (card) {
        card.classList.add("shake");
        setTimeout(function () {
          card.classList.remove("shake");
        }, 500);
      }
    }, 50);
  }
  render();
}
function practiceNext() {
  if (state.practiceIndex < state.practiceDeck.length - 1) {
    state.practiceIndex++;
    setupPracticeQ();
    render();
  }
}

// ── Icons
var iconHome =
  '<svg viewBox="0 0 24 24" fill="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9.5L12 3l9 6.5V20a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9.5z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>';
var iconArrow =
  '<svg viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 6 15 12 9 18"/></svg>';

// ── Render
function render() {
  var app = document.getElementById("app");
  var html = "";

  if (state.screen === "home") {
    html +=
      '<div class="landing">' +
      '<div class="landing-doodle">\u270F\uFE0F</div>' +
      "<h1>Phrasal Verbs</h1>" +
      '<div class="landing-buttons">' +
      '<button class="landing-btn btn-learn" onclick="startLearn()">Learn</button>' +
      '<button class="landing-btn btn-practice" onclick="startPractice()">Practise</button>' +
      "</div></div>";
  } else {
    var ml = state.screen === "learn" ? "Learn" : "Practise";
    html +=
      '<div class="top-bar">' +
      '<button class="home-btn" onclick="goHome()" title="Home">' +
      iconHome +
      "</button>" +
      '<span class="top-bar-title">' +
      ml +
      "</span>" +
      '<div class="top-bar-spacer"></div>' +
      "</div>";
    if (state.screen === "learn") html += renderLearn();
    else html += renderPractice();
  }

  // Side menu
  var oc = state.menuOpen ? "open" : "";
  var items =
    '<div class="menu-item menu-item-all ' +
    (state.filter === null ? "active" : "") +
    '" onclick="setFilter(null)">All verbs <span class="count">' +
    PHRASAL_VERBS.length +
    "</span></div>";
  HEAD_VERBS.forEach(function (h) {
    items +=
      '<div class="menu-item ' +
      (state.filter === h ? "active" : "") +
      '" onclick="setFilter(\'' +
      h +
      "')\">" +
      h +
      ' <span class="count">' +
      verbCount(h) +
      "</span></div>";
  });
  html +=
    '<div class="side-menu-overlay ' +
    oc +
    '" onclick="closeMenu()"></div>' +
    '<div class="side-menu ' +
    oc +
    '">' +
    "<h3>Phrasal Verbs</h3>" +
    '<div class="menu-sub">Choose a verb to filter</div>' +
    items +
    "</div>";

  // Menu trigger
  if (state.screen !== "home") {
    html +=
      '<button class="menu-trigger ' +
      oc +
      '" onclick="toggleMenu()" title="Filter by verb">' +
      iconArrow +
      "</button>";
  }

  app.innerHTML = html;
}

function renderLearn() {
  var deck = state.learnDeck;
  if (deck.length === 0)
    return '<div style="text-align:center;padding:40px 0;color:var(--text-muted);">No phrasal verbs found for this filter.</div>';
  var idx = state.learnIndex;
  var item = deck[idx];
  var fp = state.filter
    ? '<span class="filter-pill">' + state.filter + "</span>"
    : "";
  var sc = state.slideDir === "right" ? "slide-right" : "slide-left";
  var st = state.revealStage;

  var exVis = st >= 1 ? " visible" : "";
  var meVis = st >= 2 ? " visible" : "";
  var d1Vis = st >= 1 ? " visible" : "";
  var d2Vis = st >= 2 ? " visible" : "";

  var promptText = "";
  if (st === 0) promptText = "Tap the card to see an example";
  else if (st === 1) promptText = "Tap again to see the meaning";

  return (
    '<div class="learn-view">' +
    '<span class="mode-label learn">Learn</span>' +
    fp +
    '<div class="learn-prompt">What do you think this phrasal verb means?</div>' +
    '<div class="card-wrapper ' +
    sc +
    '">' +
    '<div class="reveal-card" onclick="advanceReveal()">' +
    // Section 1: Verb (always visible)
    '<div class="reveal-section section-verb">' +
    '<div class="tape tape-tl"></div><div class="tape tape-tr"></div>' +
    '<div class="flashcard-verb">' +
    item.verb +
    "</div>" +
    "</div>" +
    // Divider 1
    '<hr class="reveal-divider divider-1' +
    d1Vis +
    '" />' +
    // Section 2: Example
    '<div class="reveal-section section-example' +
    exVis +
    '">' +
    '<div class="flashcard-example">' +
    item.example +
    "</div>" +
    "</div>" +
    // Divider 2
    '<hr class="reveal-divider divider-2' +
    d2Vis +
    '" />' +
    // Section 3: Meaning
    '<div class="reveal-section section-meaning' +
    meVis +
    '">' +
    '<div class="meaning-label">Meaning</div>' +
    '<div class="meaning-text">' +
    item.meaning +
    "</div>" +
    "</div>" +
    "</div>" +
    '<div class="tap-prompt" id="tap-prompt">' +
    promptText +
    "</div>" +
    "</div>" +
    '<div class="nav-row">' +
    '<button class="nav-btn" onclick="learnPrev()" ' +
    (idx === 0 ? "disabled" : "") +
    ">← Previous</button>" +
    '<span class="card-counter">' +
    (idx + 1) +
    " / " +
    deck.length +
    "</span>" +
    '<button class="nav-btn" onclick="learnNext()" ' +
    (idx === deck.length - 1 ? "disabled" : "") +
    ">Next →</button>" +
    "</div></div>"
  );
}

function renderPractice() {
  var deck = state.practiceDeck;
  if (deck.length === 0)
    return '<div style="text-align:center;padding:40px 0;color:var(--text-muted);">No phrasal verbs found for this filter.</div>';
  var idx = state.practiceIndex;
  var item = deck[idx];
  var fp = state.filter
    ? '<span class="filter-pill">' + state.filter + "</span>"
    : "";
  var answered = state.practiceChosen !== null;
  var isCorrect = answered && state.practiceChosen === state.practiceCorrectIdx;

  // Build sentence with blank using the fib field
  var sentHTML;
  if (answered) {
    var fillClass = isCorrect ? "blank correct-fill" : "blank incorrect-fill";
    var fillText = state.practiceOptions[state.practiceChosen];
    sentHTML = item.fib.replace(
      "___",
      '<span class="' + fillClass + '">' + fillText + "</span>",
    );
  } else {
    sentHTML = item.fib.replace("___", '<span class="blank">________</span>');
  }

  var choicesHTML = "";
  state.practiceOptions.forEach(function (opt, i) {
    var cls = "choice-btn";
    if (answered) {
      if (i === state.practiceChosen && isCorrect) cls += " chosen correct";
      else if (i === state.practiceChosen && !isCorrect)
        cls += " chosen incorrect";
      if (i === state.practiceCorrectIdx && !isCorrect)
        cls += " reveal-correct";
      if (i !== state.practiceChosen && i !== state.practiceCorrectIdx)
        cls += " disabled";
    }
    choicesHTML +=
      '<button class="' +
      cls +
      '" onclick="choosePractice(' +
      i +
      ')">' +
      opt +
      "</button>";
  });

  var feedbackHTML = "";
  if (answered) {
    var fbC = isCorrect ? "correct" : "incorrect";
    var fbT = isCorrect ? "\u2713 Correct!" : "\u2717 Not quite!";
    var btnL = idx < deck.length - 1 ? "Next \u2192" : "Finish";
    var btnA = idx < deck.length - 1 ? "practiceNext()" : "goHome()";
    feedbackHTML +=
      '<div class="feedback-row">' +
      '<span class="feedback-text ' +
      fbC +
      '">' +
      fbT +
      "</span>" +
      '<button class="next-btn practice-next" onclick="' +
      btnA +
      '">' +
      btnL +
      "</button>" +
      "</div>";
  }

  return (
    '<div class="practice-view">' +
    '<span class="mode-label practice">Practise</span>' +
    fp +
    '<div class="score-bar">' +
    '<span class="score-correct">Correct: <span>' +
    state.scoreCorrect +
    "</span></span>" +
    '<span class="card-counter">' +
    (idx + 1) +
    " / " +
    deck.length +
    "</span>" +
    '<span class="score-incorrect">Incorrect: <span>' +
    state.scoreIncorrect +
    "</span></span>" +
    "</div>" +
    '<div class="slide-right">' +
    '<div class="practice-sentence">' +
    '<div class="pin pin-blue" style="top:-6px;left:20px;"></div>' +
    '<div class="sentence-label">Fill in the blank</div>' +
    '<div class="sentence-text">' +
    sentHTML +
    "</div></div>" +
    '<div class="choices">' +
    choicesHTML +
    "</div>" +
    feedbackHTML +
    "</div></div>"
  );
}

// ── Init
render();
