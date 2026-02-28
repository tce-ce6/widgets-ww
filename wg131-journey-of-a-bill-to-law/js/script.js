/* =============================================
   WG131 – Journey of a Bill to Law
   script.js – Full Game Engine
   ============================================= */

// ── Station data ──────────────────────────────
const STATIONS = [
  {
    id: 1,
    label: "The Gateway",
    icon: "🏛️",
    color: "#97a700",
    clicks: 1,
    hold: false,
    instruction: "Click the glowing orange segment (The Gateway) 👇",
    question: "Where can a new bill be introduced in Parliament?",
    options: [
      { text: "🏛️ Lok Sabha or Rajya Sabha", correct: true },
      { text: "👤 President's office first", correct: false },
      { text: "⚖️ Supreme Court", correct: false },
    ],
    hint: "Bills can start in either house!",
    msg1: "THE GATEWAY",
    msg2: "↓ Actually: Lok Sabha",
    msg3: "Moving to next step...",
    stamp: "INTRODUCED 🏛️",
    facts: [
      "Bills can start in either house",
      "Lok Sabha = Lower House",
      "Rajya Sabha = Upper House",
      "Money Bills only in Lok Sabha",
    ],
  },
  {
    id: 2,
    label: "The Announcement",
    icon: "🎤",
    color: "#65ad00",
    clicks: 1,
    hold: false,
    instruction: "Click the glowing blue segment (The Announcement) 👇",
    question: "What happens during the First Reading stage?",
    options: [
      { text: "📢 Title and purpose announced", correct: true },
      { text: "🗳️ MPs vote immediately", correct: false },
      { text: "✍️ Full debate happens", correct: false },
    ],
    hint: "Just an announcement!",
    msg1: "THE ANNOUNCEMENT",
    msg2: "↓ Actually: First Reading",
    msg3: "Moving to next step...",
    stamp: "READ 🎤",
    facts: [
      "First Reading = Just announcement",
      "Title and purpose read aloud",
      "No debate or voting",
      "Then printed",
    ],
  },
  {
    id: 3,
    label: "The Examination",
    icon: "📋",
    color: "#00a585",
    clicks: 1,
    hold: false,
    instruction: "Click the glowing purple segment (The Examination) 👇",
    question: "What does the Committee do with the bill?",
    options: [
      { text: "🔍 Studies deeply & suggests changes", correct: true },
      { text: "📝 Just reads the title", correct: false },
      { text: "🗳️ Takes final vote", correct: false },
    ],
    hint: "Committees examine carefully!",
    msg1: "THE EXAMINATION",
    msg2: "↓ Actually: Committee",
    msg3: "Moving to next step...",
    stamp: "REVIEWED 📋",
    facts: [
      "Expert group of MPs",
      "Study in detail",
      "Suggest changes",
      "Send report",
    ],
  },
  {
    id: 4,
    label: "The Assembly",
    icon: "💬",
    color: "#0289ae",
    clicks: 5,
    hold: false,
    instruction: "Click the glowing green segment 5 times (The Assembly) 👇",
    question: "Why do MPs debate the bill?",
    options: [
      { text: "💬 To discuss if bill should pass", correct: true },
      { text: "👋 To practice speaking", correct: false },
      { text: "📖 To read newspapers", correct: false },
    ],
    hint: "Debate = pros and cons!",
    msg1: "THE ASSEMBLY",
    msg2: "↓ Actually: Debate",
    msg3: "Moving to next step...",
    stamp: "DEBATED 💬",
    facts: [
      "MPs discuss pros/cons",
      "Share opinions",
      "Decide if good",
      "Voting comes later",
    ],
  },
  {
    id: 5,
    label: "The Scroll",
    icon: "📝",
    color: "#005388",
    clicks: 3,
    hold: false,
    instruction: "Click the glowing indigo segment 3 times (The Scroll) 👇",
    question: "What happens during the clause-by-clause discussion?",
    options: [
      { text: "✍️ Each clause examined & amended", correct: true },
      { text: "🚫 Nothing happens", correct: false },
      { text: "📝 Only title read", correct: false },
    ],
    hint: "Word by word examination!",
    msg1: "THE SCROLL",
    msg2: "↓ Actually: Clauses",
    msg3: "Moving to next step...",
    stamp: "CLAUSES OK 📝",
    facts: [
      "Clause = One section",
      "Each can change",
      "Examine detail",
      "Amendments made",
    ],
  },
  {
    id: 6,
    label: "The Gathering",
    icon: "🗳️",
    color: "#3c0091",
    clicks: 0,
    hold: true,
    instruction: "HOLD the glowing red segment (The Gathering) 👇",
    question: "How many MPs must vote YES for the bill to pass Lok Sabha?",
    options: [
      { text: "✅ More than 50% (273+ of 543)", correct: true },
      { text: "👤 Just 1 MP", correct: false },
      { text: "💯 All 543 MPs", correct: false },
    ],
    hint: "Need majority!",
    msg1: "THE GATHERING",
    msg2: "↓ Actually: Voting",
    msg3: "Moving to next step...",
    stamp: "PASSED LS 🗳️",
    facts: [
      "Need MORE than 50%",
      "543 MPs total",
      "Need 272+ YES",
      "If NO wins, fails",
    ],
  },
  {
    id: 7,
    label: "The Chamber",
    icon: "🏛️",
    color: "#930032",
    clicks: 1,
    hold: false,
    instruction: "Click the glowing teal segment (The Chamber) 👇",
    question: "Why must a bill pass through both houses of Parliament?",
    options: [
      { text: "🏛️ Both must approve", correct: true },
      { text: "🚪 Just visiting", correct: false },
      { text: "📮 To mail copies", correct: false },
    ],
    hint: "Two houses!",
    msg1: "THE CHAMBER",
    msg2: "↓ Actually: Rajya Sabha",
    msg3: "Moving to next step...",
    stamp: "PASSED RS 🏛️",
    facts: [
      "MUST pass both",
      "Same process",
      "Both needed",
      "One reject = fail",
    ],
  },
  {
    id: 8,
    label: "The Final Approval",
    icon: "🖊️",
    color: "#da3a3a",
    clicks: 1,
    hold: false,
    instruction: "Click the glowing yellow segment (The Final Approval) 👇",
    question: "What happens after the President signs the bill?",
    options: [
      { text: "⚖️ Becomes a LAW!", correct: true },
      { text: "🗑️ Rejected", correct: false },
      { text: "🔄 Back to Lok Sabha", correct: false },
    ],
    hint: "Final approval!",
    msg1: "THE FINAL APPROVAL",
    msg2: "↓ Actually: President",
    msg3: "Moving to next step...",
    stamp: "ASSENT 🖊️",
    facts: [
      "Final approval",
      "Can sign/reject",
      "Signed = LAW",
      "No sign = NOT law",
    ],
  },
  {
    id: 9,
    label: "The Archive",
    icon: "📰",
    color: "#fe910e",
    clicks: 1,
    hold: false,
    instruction: "Click the glowing amber segment (The Archive) 👇",
    question: "What makes the bill officially become a law?",
    options: [
      { text: "📰 Gazette publication", correct: true },
      { text: "📺 TV announcement", correct: false },
      { text: "📱 Social media", correct: false },
    ],
    hint: "Official publication!",
    msg1: "THE ARCHIVE",
    msg2: "↓ Actually: Gazette",
    msg3: "Moving to next step...",
    stamp: "LAW! 📰",
    facts: [
      "Official newspaper",
      "Published = official",
      "Gets Act number",
      "Enforceable!",
    ],
  },
];

// ── State ─────────────────────────────────────
let currentStation = 0; // 0-based index
let clickCount = 0;
let holdInterval = null;
let holdVotes = 0;
let collectedStamps = [];
let quizAnswered = false;
let gameStarted = false;

// ── DOM refs ──────────────────────────────────
// const gameRoot = document.getElementById("game-root");
// const progressDots = document.getElementById("progress-dots");
// const wheelSvgWrap = document.getElementById("wheel-svg-wrap");
// const stationIcon = document.getElementById("station-icon");
// const stationName = document.getElementById("station-name");
// const stationSub = document.getElementById("station-sub");
// const stationBadge = document.getElementById("station-badge");
// const instructionTxt = document.getElementById("instruction-txt");
// const clickBtn = document.getElementById("click-btn");
// const holdBtn = document.getElementById("hold-btn");
// const holdFill = document.getElementById("hold-fill");
// const voteCount = document.getElementById("vote-count");
// const clickCounter = document.getElementById("click-counter");
// const clickCountVal = document.getElementById("click-count-val");
// const clickProgress = document.getElementById("click-progress");
// const clickProgressFill = document.getElementById("click-progress-fill");
// const stampsTray = document.getElementById("stamps-tray");

// // Quiz
// const quizOverlay = document.getElementById("quiz-overlay");
// const quizIcon = document.getElementById("quiz-icon");
// const quizStationName = document.getElementById("quiz-station-name");
// const quizQuestion = document.getElementById("quiz-question");
// const quizOptions = document.getElementById("quiz-options");
// const quizHint = document.getElementById("quiz-hint");
// const quizFeedback = document.getElementById("quiz-feedback");

// // Stamp overlay
// const stampOverlay = document.getElementById("stamp-overlay");
// const stampEmoji = document.getElementById("stamp-emoji");
// const stampTextBig = document.getElementById("stamp-text-big");
// const stampMsg1 = document.getElementById("stamp-msg1");
// const stampMsg2 = document.getElementById("stamp-msg2");
// const stampMsg3 = document.getElementById("stamp-msg3");

// // Insight
// const insightOverlay = document.getElementById("insight-overlay");
// const insightTitle = document.getElementById("insight-title");
// const insightFacts = document.getElementById("insight-facts");
// const insightContinue = document.getElementById("insight-continue");

// // Final
// const finalScreen = document.getElementById("final-screen");
// const finalStampsGrid = document.getElementById("final-stamps-grid");

// ── START ─────────────────────────────────────
function startGame() {
  // if (gameStarted) return;
  // gameStarted = true;
  document.getElementById("dashboard").style.display = "none";
  document.getElementById("home-screen").setAttribute("display", "block");
  document.getElementById("i-text").setAttribute("display", "block");
  // gameRoot.classList.add("visible");
  // buildProgressDots();
  // goToStation(0);
}

// ── PROGRESS DOTS ─────────────────────────────
function buildProgressDots() {
  progressDots.innerHTML = "";
  STATIONS.forEach((s, i) => {
    const dot = document.createElement("div");
    dot.className = "progress-dot";
    dot.id = `dot-${i}`;
    dot.textContent = i + 1;
    progressDots.appendChild(dot);
  });
}

function updateDots() {
  STATIONS.forEach((_, i) => {
    const dot = document.getElementById(`dot-${i}`);
    if (!dot) return;
    dot.classList.remove("done", "active");
    if (i < currentStation) dot.classList.add("done");
    else if (i === currentStation) dot.classList.add("active");
  });
}

// ── WHEEL RENDERING ───────────────────────────
function buildWheel() {
  const N = STATIONS.length;
  const R = 180,
    cx = 200,
    cy = 200,
    innerR = 55;
  const segAngle = (2 * Math.PI) / N;
  let paths = "";
  let labels = "";

  STATIONS.forEach((s, i) => {
    const startAngle = -Math.PI / 2 + i * segAngle;
    const endAngle = startAngle + segAngle;
    const midAngle = (startAngle + endAngle) / 2;

    // arc path
    const x1 = cx + R * Math.cos(startAngle);
    const y1 = cy + R * Math.sin(startAngle);
    const x2 = cx + R * Math.cos(endAngle);
    const y2 = cy + R * Math.sin(endAngle);
    const ix1 = cx + innerR * Math.cos(startAngle);
    const iy1 = cy + innerR * Math.sin(startAngle);
    const ix2 = cx + innerR * Math.cos(endAngle);
    const iy2 = cy + innerR * Math.sin(endAngle);

    const d = [
      `M ${ix1} ${iy1}`,
      `L ${x1} ${y1}`,
      `A ${R} ${R} 0 0 1 ${x2} ${y2}`,
      `L ${ix2} ${iy2}`,
      `A ${innerR} ${innerR} 0 0 0 ${ix1} ${iy1}`,
      "Z",
    ].join(" ");

    // class
    let cls = "seg-locked";
    if (i < currentStation) cls = "seg-done";
    else if (i === currentStation) cls = "seg-active";

    const style =
      i === currentStation
        ? `fill:${s.color}; --seg-color:${s.color};`
        : i < currentStation
          ? `fill:${s.color};`
          : `fill:${s.color};`;

    paths += `<path d="${d}" class="${cls}" style="${style}"
      data-station="${i}" id="seg-${i}"/>`;

    // icon + label at mid radius
    const labelR = (R + innerR) / 2;
    const lx = cx + labelR * Math.cos(midAngle);
    const ly = cy + labelR * Math.sin(midAngle);

    const iconR = R * 0.78;
    const ix = cx + iconR * Math.cos(midAngle);
    const iy = cy + iconR * Math.sin(midAngle);

    // short label (≤8 chars)
    const shortLabel = s.label.split(" ").slice(0, 2).join(" ");

    labels += `
      <text x="${lx}" y="${ly - 6}" text-anchor="middle" dominant-baseline="middle"
        font-size="18" fill="white" style="pointer-events:none;user-select:none;">${s.icon}</text>
      <text x="${lx}" y="${ly + 12}" text-anchor="middle" dominant-baseline="middle"
        font-size="10" fill="rgba(255,255,255,0.8)" font-weight="700"
        style="pointer-events:none;user-select:none;">${shortLabel}</text>`;
  });

  // center hub
  const hub = `<circle cx="${cx}" cy="${cy}" r="${innerR - 4}" fill="#1e1040" stroke="rgba(255,255,255,0.2)" stroke-width="2"/>
    <text x="${cx}" y="${cy - 6}" text-anchor="middle" font-size="22" fill="white" style="pointer-events:none;">⚖️</text>
    <text x="${cx}" y="${cy + 14}" text-anchor="middle" font-size="10" fill="rgba(255,255,255,0.5)" font-weight="700" style="pointer-events:none;">BILL</text>`;

  wheelSvgWrap.innerHTML = `
    <svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
          <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <circle cx="200" cy="200" r="192" fill="rgba(0,0,0,0.3)" stroke="rgba(255,255,255,0.06)" stroke-width="2"/>
      ${paths}
      ${labels}
      ${hub}
      <polygon points="200,8 193,22 207,22" fill="white" filter="url(#glow)" style="pointer-events:none;"/>
    </svg>`;

  // Add click listener on active segment
  const activeSeg = document.getElementById(`seg-${currentStation}`);
  if (activeSeg) {
    activeSeg.style.cursor = "pointer";
    activeSeg.addEventListener("click", handleSegmentClick);
    activeSeg.addEventListener("mousedown", handleSegmentMouseDown);
    activeSeg.addEventListener("mouseup", handleSegmentMouseUp);
    activeSeg.addEventListener("touchstart", handleSegmentMouseDown, {
      passive: true,
    });
    activeSeg.addEventListener("touchend", handleSegmentMouseUp);
  }
}

// ── GO TO STATION ─────────────────────────────
function goToStation(idx) {
  currentStation = idx;
  clickCount = 0;
  holdVotes = 0;
  quizAnswered = false;

  const s = STATIONS[idx];

  // CSS variable for color
  document
    .getElementById("action-panel")
    .style.setProperty("--station-color", s.color);
  document
    .getElementById("game-area")
    .style.setProperty("--station-color", s.color);

  // Progress dots
  updateDots();

  // Station header
  stationIcon.textContent = s.icon;
  stationName.textContent = `Station ${idx + 1}`;
  stationSub.textContent = s.label;
  stationBadge.textContent = `Step ${idx + 1} of 9`;
  stationBadge.style.background = s.color;

  // Instruction
  instructionTxt.textContent = s.instruction;
  document.getElementById("instruction-box").style.borderLeftColor = s.color;

  // Interaction UI
  resetInteractionUI(s);

  // Rebuild wheel
  buildWheel();
}

function resetInteractionUI(s) {
  // Hide all first
  clickBtn.style.display = "none";
  holdBtn.style.display = "none";
  clickCounter.style.display = "none";
  clickProgress.style.display = "none";
  clickProgressFill.style.width = "0%";

  if (s.hold) {
    // HOLD interaction
    holdBtn.style.display = "flex";
    holdFill.style.height = "0%";
    voteCount.textContent = "0";
    holdBtn.style.setProperty("--station-color", s.color);
    document.getElementById("hold-btn-label").textContent = "HOLD TO VOTE";
    // Attach hold listeners to the visible holdBtn div
    holdBtn.addEventListener("mousedown", handleSegmentMouseDown);
    holdBtn.addEventListener("mouseup", handleSegmentMouseUp);
    holdBtn.addEventListener("mouseleave", handleSegmentMouseUp);
    holdBtn.addEventListener("touchstart", handleSegmentMouseDown, {
      passive: false,
    });
    holdBtn.addEventListener("touchend", handleSegmentMouseUp);
  } else {
    // CLICK interaction
    clickBtn.style.display = "inline-flex";
    clickBtn.style.background = s.color;
    clickBtn.style.boxShadow = `0 0 30px ${s.color}, 0 6px 20px rgba(0,0,0,0.4)`;
    clickBtn.style.setProperty("--station-color", s.color);
    clickBtn.disabled = false;

    if (s.clicks > 1) {
      clickCounter.style.display = "flex";
      clickCountVal.textContent = `0 / ${s.clicks}`;
      clickProgress.style.display = "block";
      clickProgress.style.setProperty("--station-color", s.color);
      clickBtn.textContent = `Click! (${s.clicks} times)`;
    } else {
      clickBtn.textContent = "Click!";
    }
  }
}

// ── INTERACTION HANDLERS ──────────────────────
// clickBtn.addEventListener("click", handleSegmentClick);

function handleSegmentClick() {
  const s = STATIONS[currentStation];
  if (s.hold || quizAnswered) return;

  clickCount++;
  const needed = s.clicks;

  if (needed > 1) {
    clickCountVal.textContent = `${clickCount} / ${needed}`;
    const pct = (clickCount / needed) * 100;
    clickProgressFill.style.width = `${pct}%`;
    clickBtn.textContent =
      clickCount >= needed ? "✓ Done!" : `Click! (${clickCount}/${needed})`;
  }

  if (clickCount >= needed) {
    clickBtn.disabled = true;
    showQuiz(s);
  }
}

// HOLD mechanics
let holdActive = false;
const HOLD_TARGET = 273;
const HOLD_SPEED = 12; // votes per 100ms

function handleSegmentMouseDown(e) {
  const s = STATIONS[currentStation];
  if (!s.hold || quizAnswered || holdActive) return;
  if (e.cancelable) e.preventDefault();
  holdActive = true;
  holdInterval = setInterval(() => {
    if (!holdActive) {
      clearInterval(holdInterval);
      return;
    }
    holdVotes = Math.min(HOLD_TARGET, holdVotes + HOLD_SPEED);
    const pct = (holdVotes / HOLD_TARGET) * 100;
    holdFill.style.height = `${pct}%`;
    voteCount.textContent = holdVotes;
    if (holdVotes >= HOLD_TARGET) {
      clearInterval(holdInterval);
      holdActive = false;
      quizAnswered = true; // prevent re-trigger
      document.getElementById("hold-btn-label").textContent = "✓ PASSED!";
      setTimeout(() => {
        quizAnswered = false; // reset for quiz interaction
        showQuiz(s);
      }, 400);
    }
  }, 100);
}

function handleSegmentMouseUp() {
  holdActive = false;
  if (holdInterval) clearInterval(holdInterval);
}

// ── QUIZ ──────────────────────────────────────
function showQuiz(s) {
  quizAnswered = false;
  quizIcon.textContent = s.icon;
  quizStationName.textContent = s.label;
  quizQuestion.textContent = s.question;
  quizHint.textContent = `💡 Hint: ${s.hint}`;
  quizHint.classList.remove("visible");
  quizFeedback.classList.remove("show", "ok", "fail");
  quizFeedback.textContent = "";

  // Build options (shuffle order each time for freshness)
  quizOptions.innerHTML = "";
  const shuffled = [...s.options].sort(() => Math.random() - 0.5);
  shuffled.forEach((opt) => {
    const btn = document.createElement("button");
    btn.className = "quiz-option";
    btn.textContent = opt.text;
    btn.addEventListener("click", () => handleQuizAnswer(btn, opt.correct, s));
    quizOptions.appendChild(btn);
  });

  quizOverlay.classList.add("open");
}

function handleQuizAnswer(btn, correct, s) {
  if (quizAnswered) return;
  const allBtns = quizOptions.querySelectorAll(".quiz-option");

  if (correct) {
    quizAnswered = true;
    btn.classList.add("correct");
    allBtns.forEach((b) => {
      if (b !== btn) b.disabled = true;
    });
    quizFeedback.textContent = "✓ Correct! Well done!";
    quizFeedback.className = "show ok";
    setTimeout(() => closeQuizAndStamp(s), 900);
  } else {
    btn.classList.add("wrong");
    quizHint.classList.add("visible");
    quizFeedback.textContent = "✗ Try again!";
    quizFeedback.className = "show fail";
    setTimeout(() => {
      btn.classList.remove("wrong");
      quizFeedback.classList.remove("show", "fail");
      quizFeedback.textContent = "";
    }, 900);
  }
}

function closeQuizAndStamp(s) {
  quizOverlay.classList.remove("open");
  setTimeout(() => showStamp(s), 300);
}

// ── STAMP ─────────────────────────────────────
function showStamp(s) {
  stampEmoji.textContent = s.icon;
  stampTextBig.textContent = s.stamp;
  stampMsg1.textContent = s.msg1;
  stampMsg2.textContent = s.msg2;
  stampMsg3.textContent = s.msg3;
  stampOverlay.classList.add("show");

  setTimeout(() => {
    stampOverlay.classList.remove("show");
    collectStamp(s);
    setTimeout(() => showInsight(s), 300);
  }, 2200);
}

function collectStamp(s) {
  collectedStamps.push(s.stamp);
  const chip = document.createElement("div");
  chip.className = "stamp-chip";
  chip.textContent = s.stamp;
  chip.style.borderColor = s.color;
  stampsTray.appendChild(chip);
}

// ── INSIGHT ───────────────────────────────────
function showInsight(s) {
  insightTitle.textContent = `${s.icon} ${s.msg1}`;
  insightFacts.innerHTML = "";
  s.facts.forEach((f) => {
    const div = document.createElement("div");
    div.className = "insight-fact";
    div.textContent = `• ${f}`;
    insightFacts.appendChild(div);
  });
  insightOverlay.classList.add("show");
}

// insightContinue.addEventListener("click", () => {
//   insightOverlay.classList.remove("show");
//   const next = currentStation + 1;
//   if (next >= STATIONS.length) {
//     showFinalScreen();
//   } else {
//     goToStation(next);
//   }
// });

// ── FINAL SCREEN ──────────────────────────────
function showFinalScreen() {
  gameRoot.classList.remove("visible");
  finalStampsGrid.innerHTML = "";
  collectedStamps.forEach((stamp, i) => {
    const div = document.createElement("div");
    div.className = "final-stamp";
    div.style.setProperty(
      "--rot",
      `${(i % 2 === 0 ? -1 : 1) * (2 + (i % 3))}deg`,
    );
    div.style.borderColor = STATIONS[i].color;
    div.textContent = stamp;
    finalStampsGrid.appendChild(div);
  });
  finalScreen.classList.add("show");
}

// "Start New Journey" button — overlay on SVG design
// document.getElementById("new-journey-overlay").addEventListener("click", () => {
//   finalScreen.classList.remove("show");
//   collectedStamps = [];
//   currentStation = 0;
//   clickCount = 0;
//   holdVotes = 0;
//   gameStarted = false;
//   stampsTray.innerHTML = "";
//   document.getElementById("svg-container").style.display = "";
//   gameRoot.classList.remove("visible");
// });

// ── BIND INTRO BUTTON ─────────────────────────
window.addEventListener("load", () => {
  // Invisible overlay div positioned over the START JOURNEY button in the SVG image
  const startOverlay = document.getElementById("start-btn-overlay");
  if (startOverlay) {
    startOverlay.addEventListener("click", startGame);
  }

  // ── STATION SEGMENT CLICK → SHOW POPUP-INSIGHTS ──────────────────────────
  // Station path IDs in the home-screen SVG wheel (stations 1–9)
  const stationPathIds = [
    "Path_2191", // Station 1 – The Gateway
    "Path_2181", // Station 2 – The Announcement
    "Path_2161", // Station 3 – The Examination
    "Path_2151", // Station 4 – The Assembly
    "Path_2141", // Station 5 – The Gathering
    "Path_2131", // Station 6 – The Scroll
    "Path_2121", // Station 7 – The Chamber
    "Path_2111", // Station 8 – The Final Approval
    "Path_2171", // Station 9 – The Archive
  ];

  stationPathIds.forEach((pathId, idx) => {
    const el = document.getElementById(pathId);
    if (el) {
      el.style.cursor = "pointer";
      el.addEventListener("click", () => showPopupInsights(idx));
    }
  });

  // ── CLOSE POPUP: click darkened background rect inside popup-insights ──────
  const dimmerRect = document.getElementById("Rectangle_4371");
  if (dimmerRect) {
    dimmerRect.style.cursor = "pointer";
    dimmerRect.addEventListener("click", hidePopupInsights);
  }

  // ── CLOSE POPUP: click the "Insights" button inside popup-insights ─────────
  const insightsBtnInPopup = document.getElementById("Group_7971");
  if (insightsBtnInPopup) {
    insightsBtnInPopup.style.cursor = "pointer";
    insightsBtnInPopup.addEventListener("click", hideInsightsPanel);
  }

  // ── btn-insights: click → show popup-insights ────────────────────────────
  const btnInsights = document.getElementById("btn-insights");
  if (btnInsights) {
    btnInsights.style.cursor = "pointer";
    btnInsights.addEventListener("click", showInsightsPanel);
  }

  // ── CLOSE popup-insights: click its background rect ───────────────────────
  const insightsDimmer = document.getElementById("Rectangle_4371");
  if (insightsDimmer) {
    insightsDimmer.style.cursor = "pointer";
    insightsDimmer.addEventListener("click", hideInsightsPanel);
  }
});

// Helper: set <tspan> text and optionally centre it at a given SVG x
// centerX: if provided, sets text-anchor=middle and centres the text element there
function setQuizText(groupId, text, centerX) {
  const grp = document.getElementById(groupId);
  if (!grp) return;
  const tspan = grp.querySelector("tspan");
  if (!tspan) return;
  tspan.textContent = text;

  const textEl = tspan.closest("text") || grp.querySelector("text");
  if (textEl) {
    textEl.style.display = "";
    textEl.style.visibility = "visible";
    if (!textEl.style.fill)
      textEl.style.fill = groupId === "The_Gateway1" ? "#fff" : "#181818";

    if (centerX !== undefined) {
      // SVG translate can use space OR comma: translate(x y) or translate(x,y)
      const curTransform = textEl.getAttribute("transform") || "";
      const yMatch = curTransform.match(
        /translate\(\s*[\d.+-]+[\s,]+\s*([\d.+-]+)\s*\)/,
      );
      const y = yMatch ? yMatch[1].trim() : "314"; // 314 = default question y
      textEl.setAttribute("text-anchor", "middle");
      textEl.setAttribute("transform", `translate(${centerX} ${y})`);
      tspan.setAttribute("x", "0");
    }
  }
}

// Station click → populate & colour Quiz-popup from STATIONS[idx], then show it
function showPopupInsights(idx) {
  if (idx === undefined || idx === null) idx = 0;
  const s = STATIONS[idx];
  if (!s) return;

  // ── 1. Header label text ──────────────────────────────────────────────────
  setQuizText("The_Gateway1", s.label);

  // ── 2. Header banner colour ───────────────────────────────────────────────
  const banner = document.getElementById("Rectangle_438");
  if (banner) banner.style.fill = s.color;

  // ── 3. Card border colour ─────────────────────────────────────────────────
  const cardGroup = document.getElementById("Rectangle_436-2");
  if (cardGroup) {
    const borderRect = cardGroup.querySelectorAll("rect")[1];
    if (borderRect) borderRect.style.stroke = s.color;
  }

  // ── 4. Icon circle colour ─────────────────────────────────────────────────
  const iconCircle = document.getElementById("Group_1207");
  if (iconCircle) iconCircle.style.fill = s.color;

  // ── 4b. Station SVG icon – clone from Activity-summary-end row ──────────────
  // Map: station index → inner icon group ID + its source circle cx/cy
  const ICON_MAP = [
    { groupId: "Group_7472", cx: 468, cy: 762 }, // 0 – The Gateway
    { groupId: "Group_7462", cx: 591, cy: 762 }, // 1 – The Announcement
    { groupId: "Group_7542", cx: 714, cy: 762 }, // 2 – The Examination
    { groupId: "Group_7532", cx: 837, cy: 762 }, // 3 – The Assembly
    { groupId: "Group_7522", cx: 960, cy: 762 }, // 4 – The Scroll
    { groupId: "Group_7512", cx: 1083, cy: 762 }, // 5 – The Gathering
    { groupId: "Group_7502", cx: 1206, cy: 762 }, // 6 – The Chamber
    { groupId: "Group_7492", cx: 1329, cy: 762 }, // 7 – The Final Approval
    { groupId: "Group_7482", cx: 1452, cy: 762 }, // 8 – The Archive
  ];
  const SVG_NS = "http://www.w3.org/2000/svg";
  const TARGET_CX = 960,
    TARGET_CY = 207;

  // Hide the static hardcoded icon
  const staticIcon = document.getElementById("Group_7292");
  if (staticIcon) staticIcon.style.display = "none";

  // Remove any previously injected clone
  const oldClone = document.getElementById("quiz-icon-clone");
  if (oldClone) oldClone.parentNode.removeChild(oldClone);

  const iconInfo = ICON_MAP[idx];
  if (iconInfo) {
    const srcGroup = document.getElementById(iconInfo.groupId);
    if (srcGroup) {
      const dx = TARGET_CX - iconInfo.cx;
      const dy = TARGET_CY - iconInfo.cy;

      const wrapper = document.createElementNS(SVG_NS, "g");
      wrapper.setAttribute("id", "quiz-icon-clone");
      wrapper.setAttribute("transform", `translate(${dx},${dy})`);

      const iconClone = srcGroup.cloneNode(true);
      iconClone.removeAttribute("id");

      // Force all child paths/rects to white so they show on the coloured circle
      // iconClone
      //   .querySelectorAll("path, rect, circle, polygon")
      //   .forEach((el) => {
      //     el.style.fill = "#ffffff";
      //     el.style.stroke = "none";
      //     el.removeAttribute("class"); // remove CSS class overrides
      //   });

      wrapper.appendChild(iconClone);

      // Append into Group_1207 (parent of Ellipse_32) so it renders on top
      if (iconCircle && iconCircle.parentNode) {
        iconCircle.parentNode.appendChild(wrapper);
      }
    }
  }

  // ── 7. Show Quiz-popup ────────────────────────────────────────────────────
  const quizPopup = document.getElementById("Quiz-popup");
  if (quizPopup) {
    quizPopup.removeAttribute("display");
    quizPopup.style.display = "inline";
  }

  // ── 5+6. Set question & options AFTER popup is visible (centered at x=960) ─
  setQuizText(
    "Where_can_a_new_bill_be_introduced_in_Parliament_",
    s.question,
    960,
  );

  const optionGroupIds = [
    "Lok_Sabha_or_Rajya_Sabha",
    "President_s_office_first",
    "Supreme_Court",
  ];
  const shuffled = [...s.options].sort(() => Math.random() - 0.5);
  optionGroupIds.forEach((gid, i) => {
    if (shuffled[i]) {
      const clean = shuffled[i].text.replace(/^[\p{Emoji}\s]+/u, "").trim();
      setQuizText(gid, clean || shuffled[i].text, 960); // centred in option box
    }
  });

  // ── 8. Resize banner to fit label (after render so measurement is accurate)
  requestAnimationFrame(() => resizeQuizBanner());

  // ── 9. Reveal btn-insights ────────────────────────────────────────────────
  const btnInsights = document.getElementById("btn-insights");
  if (btnInsights) {
    btnInsights.classList.remove("st160");
    btnInsights.style.display = "inline";
  }
}

/**
 * Measures the rendered width of the header label text and rebuilds the
 * Rectangle_438 path so the banner always fits, centered at SVG x=960.
 * Banner shape: rounded bottom corners (r=18), top flush against popup edge.
 */
function resizeQuizBanner() {
  const labelGrp = document.getElementById("The_Gateway1");
  if (!labelGrp) return;
  const textEl = labelGrp.querySelector("text");
  if (!textEl) return;

  // Measure rendered text width (works once element is visible)
  let textW = 0;
  try {
    textW = textEl.getComputedTextLength();
  } catch (e) {
    // Fallback: estimate ~20px per character at font-size 32px bold
    textW = (textEl.textContent || "").length * 20;
  }

  const PAD = 50; // horizontal padding each side
  const CX = 960; // popup horizontal centre (SVG coords)
  const H = 67; // banner height
  const R = 18; // corner radius
  const W = Math.max(220, textW + PAD * 2); // min 220 wide
  const x0 = CX - W / 2; // left edge

  // Rebuild path: top-left → right → down → rounded bottom-right →
  //               back left → rounded bottom-left → up → close
  const d = [
    `M${x0},89`,
    `h${W}`,
    `v${H}`,
    `c0,${R},-${R / 2},${R},-${R},${R}`,
    `h-${W - R * 2}`,
    `c-${R},0,-${R},-${R / 2},-${R},-${R}`,
    `v-${H}`,
    `Z`,
  ].join(" ");

  const banner = document.getElementById("Rectangle_438");
  if (banner) banner.setAttribute("d", d);

  // Re-centre label text inside the (possibly wider) banner
  textEl.setAttribute("transform", `translate(${CX} 145)`);
  textEl.setAttribute("text-anchor", "middle");
  const tspan = textEl.querySelector("tspan");
  if (tspan) tspan.setAttribute("x", "0");
}

// Hide Quiz-popup (and hide btn-insights again)
function hidePopupInsights() {
  const quizPopup = document.getElementById("Quiz-popup");
  if (quizPopup) quizPopup.style.display = "none";

  const btnInsights = document.getElementById("btn-insights");
  if (btnInsights) {
    btnInsights.style.display = "";
    btnInsights.classList.add("st160");
  }
}

// btn-insights click → show popup-insights
function showInsightsPanel() {
  const panel = document.getElementById("popup-insights");
  if (panel) {
    panel.classList.remove("st160");
    panel.style.display = "inline";
  }
}

// Hide popup-insights
function hideInsightsPanel() {
  const panel = document.getElementById("popup-insights");
  if (panel) {
    panel.style.display = "";
    panel.classList.add("st160");
  }
}
