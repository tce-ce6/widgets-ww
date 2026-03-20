/* =========================================================
   WG149 — Mark It Right! — Punctuation Widget
   Plain JavaScript, function-based, single global object
   =========================================================
   SVG Element IDs (key):
     #car               – car group, animated by translateX
     #q-text            – sentence text container
     #option-btn-1..7   – punctuation option buttons
     #signals-box       – traffic signal housing (top right)
     #yellow-signal     – signal slot A (leftmost)
     #green-signal      – signal slot B
     #red-signal        – signal slot C
     #yellow-signal1    – signal slot D (rightmost)
     #four-signals-panel – always-visible 4-slot housing
     #three/two/one-signals-panel – hidden (not used)
     #inside-popup      – insights popup (SVG group)
     #inside-btn        – Insights button
     #close-btn         – popup close button
     #next-btn-panel    – Next button
   ========================================================= */

var WG = {
    /* ── state ─────────────────────────────────────────────── */
    sentences: [],
    currentIndex: 0,
    currentSentence: null,
    blanks: [],
    filledAnswers: [],
    activeBlank: 0,
    wrongAttempts: 0,
    showAnswerVisible: false,
    idleTimer: null,
    blinkTimer: null,

    /* Signal slot IDs in order left→right */
    signalSlots: ["yellow-signal", "green-signal", "red-signal", "yellow-signal1"],

    /* ── all 25 sentences ──────────────────────────────────── */
    rawSentences: [
        { display: "My friend Rita loves to read books____", blanks: ["."] },
        { display: "What a beautiful rainbow____", blanks: ["!"] },
        { display: "Where is your school bag____", blanks: ["?"] },
        { display: "I like to eat apples____ oranges and bananas____", blanks: [",", "."] },
        { display: "The teacher said____ ____Please sit down quietly____ ____", blanks: [",", "\u201c", ".", "\u201d"] },
        { display: "That is Ramya____s bicycle____", blanks: ["'", "."] },
        { display: "Bravo____ What a wonderful performance____", blanks: ["!", "!"] },
        { display: "We visited Delhi____ Mumbai and Kolkata last summer____", blanks: [",", "."] },
        { display: "Do you know where my pencil is____", blanks: ["?"] },
        { display: "Mother asked____ ____Have you finished your homework____ ____", blanks: [",", "\u201c", "?", "\u201d"] },
        { display: "The cat____s tail is very fluffy____", blanks: ["'", "."] },
        { display: "Fire____ The building is burning____", blanks: ["!", "!"] },
        { display: "My birthday is on Monday____ 15 March____", blanks: [",", "."] },
        { display: "Can you help me carry these books____", blanks: ["?"] },
        { display: "I love to play cricket____ football and badminton____", blanks: [",", "."] },
        { display: "She asked____ ____Is this your bag____ ____", blanks: [",", "\u201c", "?", "\u201d"] },
        { display: "The child replied calmly, \"Yes____ I would like some milk____\"", blanks: [",", "."] },
        { display: "This is Meena____s favourite storybook____", blanks: ["'", "."] },
        { display: "What time does the school start____", blanks: ["?"] },
        { display: "The sky turned orange____ pink and purple at sunset____", blanks: [",", "."] },
        { display: "Father asked____ ____Did you water the plants today____ ____", blanks: [",", "\u201c", "?", "\u201d"] },
        { display: "Ouch____ That really hurt____", blanks: ["!", "!"] },
        { display: "The dog____s bone is buried in the garden____", blanks: ["'", "."] },
        { display: "I need a pen____ a notebook and an eraser for school____", blanks: [",", "."] },
        { display: "The wise old man said____ ____Always be kind to others____ ____", blanks: [",", "\u201c", ".", "\u201d"] }
    ],

    /* option button id → character */
    optionMap: {
        "option-btn-1": ".",
        "option-btn-2": "?",
        "option-btn-3": "!",
        "option-btn-4": ",",
        "option-btn-5": "'",
        "option-btn-6": "\u201c", // Opening double quote “
        "option-btn-7": "\u201d"  // Closing double quote ”
    }
};

/* ──────────────────────────────────────────────────────────
   HELPERS
   ────────────────────────────────────────────────────────── */

function shuffleArray(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
        var j = Math.floor(Math.random() * (i + 1));
        var tmp = a[i]; a[i] = a[j]; a[j] = tmp;
    }
    return a;
}

function getEl(id) { return document.getElementById(id); }

function show(id) { var el = getEl(id); if (el) el.style.display = ""; }
function hide(id) { var el = getEl(id); if (el) el.style.display = "none"; }
function setVisible(id, v) { if (v) show(id); else hide(id); }

/* ──────────────────────────────────────────────────────────
   EXPAND COMPOSED BLANKS  (e.g. "?\u201d" → ["?", "\u201d"])
   ────────────────────────────────────────────────────────── */

function expandBlanks(sentence) {
    var exp = [];
    sentence.blanks.forEach(function (b) {
        if (b.length > 1) {
            for (var i = 0; i < b.length; i++) exp.push(b[i]);
        } else {
            exp.push(b);
        }
    });
    return { display: sentence.display, blanks: exp };
}

/* ──────────────────────────────────────────────────────────
   INITIALISE
   ────────────────────────────────────────────────────────── */

function init() {
    WG.sentences = shuffleArray(WG.rawSentences.map(expandBlanks));
    WG.currentIndex = 0;

    hide("inside-popup");
    hide("inside-popup-text");
    hide("close-btn");
    hideShowAnswer();
    hide("answer-btn");
    hide("answer-btn-text");
    hide("next-btn-panel");

    /* All signal panels are hidden by CSS; updateSignalPanel() will show the right one */
    /* Bind option buttons */
    Object.keys(WG.optionMap).forEach(function (id) {
        var el = getEl(id);
        if (el) {
            el.style.cursor = "pointer";
            el.addEventListener("click", function () { onOptionClick(WG.optionMap[id]); });
        }
    });

    /* Differentiate the two quotation-mark buttons visually */
    styleQuoteButtons();

    /* Bind Insights button */
    var btnInsight = getEl("inside-btn");
    if (btnInsight) { btnInsight.style.cursor = "pointer"; btnInsight.addEventListener("click", onInsightClick); }

    /* Bind Close popup */
    var closeBtn = getEl("close-btn");
    if (closeBtn) { closeBtn.style.cursor = "pointer"; closeBtn.addEventListener("click", onClosePopup); }

    /* Bind Next button */
    var nextBtn = getEl("next-btn-panel");
    if (nextBtn) { nextBtn.style.cursor = "pointer"; nextBtn.addEventListener("click", onNextClick); }

    loadSentence(WG.currentIndex);
}

/* ──────────────────────────────────────────────────────────
   STYLE QUOTE BUTTONS
   Make "open-quote" (btn-6) and "close-quote" (btn-7)
   visually distinct: blue tint vs. orange tint, and add
   small Open / Close labels so users can tell them apart.
   ────────────────────────────────────────────────────────── */

function styleQuoteButtons() {
    /* Ensure both quote buttons (opening + closing) are visible.
       Matching is handled via WG.optionMap (btn-6 → “, btn-7 → ”). */
    var btn7 = getEl("option-btn-7");
    if (btn7) btn7.style.display = "";
}

/* addQuoteLabel removed as we no longer need labels for quotes */

/* ──────────────────────────────────────────────────────────
   LOAD SENTENCE
   ────────────────────────────────────────────────────────── */

function loadSentence(index) {
    WG.currentSentence = WG.sentences[index];
    WG.blanks = WG.currentSentence.blanks;
    WG.filledAnswers = WG.blanks.map(function () { return null; });
    WG.activeBlank = 0;
    WG.wrongAttempts = 0;
    WG.showAnswerVisible = false;

    stopBlink();
    renderSentence();
    resetOptionButtons();
    hide("next-btn-panel");
    hideShowAnswer();
    resetCarPosition();
    updateSignals();
    startIdleTimer();
}

/* ──────────────────────────────────────────────────────────
   SENTENCE RENDERING WITH HIGHLIGHTED BLANKS
   Each segment between ____ is rendered as a plain tspan;
   unfilled blanks are a blue underlined tspan.
   ────────────────────────────────────────────────────────── */

/* No padding so adjacent blanks touch each other visually */
var BLANK_DISPLAY = "____";

function renderSentence() {
    var qText = getEl("q-text");
    if (!qText) return;
    var textEl = qText.querySelector("text");
    if (!textEl) return;

    /* Preserve whitespace so SVG space characters render properly */
    textEl.setAttribute("xml:space", "preserve");

    /* Clear all existing tspan children */
    while (textEl.firstChild) textEl.removeChild(textEl.firstChild);

    var display = WG.currentSentence.display;
    var parts = display.split("____");
    var blankIndex = 0;

    parts.forEach(function (part, i) {
        if (part.length > 0) {
            var ts = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
            /* For the text part, replace empty segments completely with a standard space
               if it somehow got collapsed, but generally textContent handles it */
            ts.textContent = part;
            textEl.appendChild(ts);
        }

        /* After every segment except the last there is a blank */
        if (i < parts.length - 1) {
            var filled = WG.filledAnswers[blankIndex];
            var isActive = (blankIndex === WG.activeBlank);
            var ts2 = document.createElementNS("http://www.w3.org/2000/svg", "tspan");

            if (filled !== null) {
                /* Correctly answered — show the character in green */
                ts2.textContent = filled;
                ts2.style.fill = "#1a9c00";
                ts2.style.fontWeight = "700";
                // ts2.style.textDecoration = "underline";
            } else if (isActive) {
                /* Current active blank — pulsing blue class (CSS animation) */
                ts2.textContent = BLANK_DISPLAY;
                ts2.setAttribute("class", "active-blank");
                ts2.style.fontWeight = "900";
                // ts2.style.textDecoration = "underline";
            } else {
                /* Future blank — dimmed grey */
                ts2.textContent = BLANK_DISPLAY;
                ts2.style.fill = "#999";
                ts2.style.fontWeight = "400";
                ts2.style.textDecoration = "underline";
            }

            textEl.appendChild(ts2);
            blankIndex++;
        }
    });
}

/* ──────────────────────────────────────────────────────────
   OPTION BUTTON INTERACTION
   ────────────────────────────────────────────────────────── */

function onOptionClick(char) {
    if (WG.activeBlank >= WG.blanks.length) return;
    var correctAnswer = WG.blanks[WG.activeBlank];
    if (char === correctAnswer) {
        onCorrectAnswer(char);
    } else {
        onWrongAnswer();
    }
}

function onCorrectAnswer(char) {
    stopBlink();
    WG.filledAnswers[WG.activeBlank] = char;
    WG.activeBlank++;
    WG.wrongAttempts = 0;

    updateSignals();
    renderSentence();
    resetOptionButtons();
    updateCarPosition();

    if (WG.activeBlank >= WG.blanks.length) {
        onAllBlanksFilled();
    } else {
        startIdleTimer();
        hideShowAnswer();
    }
}


function onWrongAnswer() {
    WG.wrongAttempts++;
    showRedSignalBlink();
    showTryAgainMessage();
    if (WG.wrongAttempts >= 2) showShowAnswer();
}

function onAllBlanksFilled() {
    clearIdleTimer();
    stopBlink();
    show("next-btn-panel");
    /* Drive car completely off-screen to the left */
    driveCarOffScreen();
    /* Keep all signals steady green */
    updateSignals();
}

/* ──────────────────────────────────────────────────────────
   NEXT BUTTON
   ────────────────────────────────────────────────────────── */

function onNextClick() {
    WG.currentIndex++;
    if (WG.currentIndex >= WG.sentences.length) {
        WG.sentences = shuffleArray(WG.rawSentences.map(expandBlanks));
        WG.currentIndex = 0;
        showCongratulatoryMessage();
        return;
    }
    loadSentence(WG.currentIndex);
}

/* ──────────────────────────────────────────────────────────
   SHOW ANSWER
   ────────────────────────────────────────────────────────── */

function showShowAnswer() {
    WG.showAnswerVisible = true;
    /* Re-append show-answer-btn below the popup to maintain z-order */
    var btn = getEl("show-answer-btn");
    if (btn) {
        btn.style.display = "";
        /* Keep it below popup by inserting before popup */
        var svg = getEl("Layer_37");
        var popup = getEl("inside-popup");
        if (svg && popup && popup.parentNode === svg) {
            svg.insertBefore(btn, popup);
        }
    }
}

function hideShowAnswer() {
    WG.showAnswerVisible = false;
    var btn = getEl("show-answer-btn");
    if (btn) btn.style.display = "none";
}

function onShowAnswer() {
    var correctAnswer = WG.blanks[WG.activeBlank];
    onCorrectAnswer(correctAnswer);
    hideShowAnswer();
}

/* ──────────────────────────────────────────────────────────
   INSIGHTS POPUP
   Fix: move popup + add overlay to top of SVG stack so it
   renders above ALL other elements including show-answer-btn
   ────────────────────────────────────────────────────────── */

function onInsightClick() {
    clearIdleTimer();
    var svg = getEl("Layer_37");
    if (!svg) return;

    /* Remove stale overlay if any */
    var existingOverlay = getEl("insight-overlay");
    if (existingOverlay) existingOverlay.parentNode.removeChild(existingOverlay);

    /* Create dark semi-transparent overlay covering the full SVG canvas */
    var overlay = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    overlay.setAttribute("id", "insight-overlay");
    overlay.setAttribute("x", "0");
    overlay.setAttribute("y", "0");
    overlay.setAttribute("width", "1920");
    overlay.setAttribute("height", "1080");
    overlay.setAttribute("fill", "rgba(0,0,0,0.65)");
    overlay.style.cursor = "pointer";
    overlay.addEventListener("click", onClosePopup);
    svg.appendChild(overlay);

    /* Move inside-popup, its text, and the close button to be the last children of SVG (render on top) */
    ["inside-popup", "inside-popup-text", "close-btn"].forEach(function (id) {
        var el = getEl(id);
        if (el) {
            svg.appendChild(el);
            el.style.display = "";
        }
    });
}

function onClosePopup() {
    /* Hide popup elements */
    ["inside-popup", "inside-popup-text", "close-btn"].forEach(function (id) {
        hide(id);
    });

    /* Remove overlay */
    var overlay = getEl("insight-overlay");
    if (overlay) overlay.parentNode.removeChild(overlay);

    startIdleTimer();
}

/* ──────────────────────────────────────────────────────────
   TRAFFIC SIGNAL LOGIC
   ──────────────────────────────────────────────────────────
   SVG has 4 coloured lamp groups:
     Slot 0 (A): #yellow-signal   (leftmost,  ~x=1527)
     Slot 1 (B): #green-signal    (~x=1613)
     Slot 2 (C): #red-signal      (~x=1699)
     Slot 3 (D): #yellow-signal1  (rightmost, ~x=1785)

   All 4 slots sit inside #four-signals-panel housing which
   is ALWAYS visible (narrower panels are hidden).

   Colour semantics applied by updateSignals():
     DIM  (#2a2a2a) – blank slot (not used in this sentence)
     YELLOW (#efff00) – pending blank (not yet answered)
     GREEN  (#0dff00) – correctly answered blank
     ORANGE (#ff9800) – currently active blank (waiting for tap)

   Red blinking is applied separately during wrong-answer feedback.
   ────────────────────────────────────────────────────────── */



/*
  Signal slot → circle ID mapping (left to right):
  slot 0: #yellow-signal  (x≈1527, used in 4-blank sentences only)
  slot 1: #green-signal   (x≈1613, used in 3+ blank sentences)
  slot 2: #red-signal     (x≈1699, used in 2+ blank sentences)
  slot 3: #yellow-signal1 (x≈1785, always used)

  For N blanks we show only the rightmost N signal circles AND
  the matching housing panel (one/two/three/four-signals-panel).
*/

function blankToSlot(blankIdx) {
    var n = WG.blanks.length;
    return (4 - Math.min(n, 4)) + blankIdx;
}

/* Update housing panel + visibility of each circle, then set colours */
function updateSignals() {
    updateSignalPanel();

    var n = Math.min(WG.blanks.length, 4);

    WG.signalSlots.forEach(function (slotId, slotIndex) {
        var blankIdx = slotIndex - (4 - n);

        if (blankIdx < 0 || blankIdx >= n) return;  /* circle already hidden */

        /* Only allow green states and unlit dim states */
        if (WG.filledAnswers[blankIdx] !== null) {
            setSignalState(slotId, "green");
        } else {
            setSignalState(slotId, "dim");
        }
    });
}

/* Show the right housing panel and hide/show individual circles */
function updateSignalPanel() {
    var n = Math.min(WG.blanks.length, 4);

    /* Housing panels */
    var panelMap = {
        1: "one-signals-panel", 2: "two-signals-panel",
        3: "three-signals-panel", 4: "four-signals-panel"
    };
    ["one-signals-panel", "two-signals-panel",
        "three-signals-panel", "four-signals-panel"].forEach(function (p) { hide(p); });
    if (panelMap[n]) show(panelMap[n]);

    /* Signal circles — only show the rightmost N circles */
    WG.signalSlots.forEach(function (slotId, slotIndex) {
        var blankIdx = slotIndex - (4 - n);
        if (blankIdx < 0) {
            hide(slotId);           /* not needed for this sentence */
        } else {
            show(slotId);           /* show and reset to dim pending colour */
            setSignalState(slotId, "dim");
        }
    });
}

function setSignalState(slotId, state) {
    var grp = getEl(slotId);
    if (!grp) return;
    var paths = grp.querySelectorAll("path, circle");
    if (paths.length < 2) return;

    /* Maintain slight shadow / highlight with two shades of the same color */
    if (state === "green") {
        paths[0].style.fill = "#0dff00";   /* main green */
        paths[1].style.fill = "#13e81d";   /* darker slightly shifted green for shadow */
    } else if (state === "red") {
        paths[0].style.fill = "#ff0000";   /* pure red */
        paths[1].style.fill = "#d80505";   /* darker red for shadow */
    } else { /* "dim" */
        paths[0].style.fill = "#3a3a3a";   /* unlit dark grey */
        paths[1].style.fill = "#222222";   /* deep unlit shadow */
    }
}

function showRedSignalBlink() {
    stopBlink();
    var slotIndex = blankToSlot(WG.activeBlank);
    var slotId = WG.signalSlots[slotIndex];
    if (!slotId) return;

    setSignalState(slotId, "red");

    var on = true;
    WG.blinkTimer = setInterval(function () {
        on = !on;
        setSignalState(slotId, on ? "red" : "dim");
    }, 300);

    setTimeout(function () {
        stopBlink();
        updateSignals();
    }, 2000);
}

function stopBlink() {
    if (WG.blinkTimer) {
        clearInterval(WG.blinkTimer);
        WG.blinkTimer = null;
    }
}

/* ──────────────────────────────────────────────────────────
   CAR ANIMATION
   The car group starts at SVG x≈1590. The SVG viewBox is
   1920 units wide. To drive completely off left edge we need
   to translate by more than (1590 + carWidth≈340) = ~1930
   SVG units. We use 2000 to be safe.
   Intermediate steps progress proportionally from 0 to -700.
   ────────────────────────────────────────────────────────── */

function updateCarPosition() {
    var carEl = getEl("car");
    if (!carEl) return;

    var total = WG.blanks.length;
    var filled = WG.activeBlank;
    /* Intermediate progress moves car 0 → -700 SVG units */
    var progress = total > 0 ? filled / total : 0;
    var translateX = progress * -700;

    carEl.style.transition = "transform 0.6s ease";
    carEl.style.transform = "translateX(" + translateX + "px)";
}

function driveCarOffScreen() {
    var carEl = getEl("car");
    if (!carEl) return;
    /* Move the entire car width + starting position off the left edge */
    carEl.style.transition = "transform 1.2s ease-in";
    carEl.style.transform = "translateX(-3000px)";
}

function resetCarPosition() {
    var carEl = getEl("car");
    if (!carEl) return;
    carEl.style.transition = "none";
    carEl.style.transform = "translateX(0px)";
}

/* ──────────────────────────────────────────────────────────
   IDLE GLOW HINT
   ────────────────────────────────────────────────────────── */

function startIdleTimer() {
    clearIdleTimer();
    WG.idleTimer = setTimeout(function () { glowBlanks(); }, 5000);
}

function clearIdleTimer() {
    if (WG.idleTimer) { clearTimeout(WG.idleTimer); WG.idleTimer = null; }
}

function glowBlanks() {
    var panel = getEl("q-panel");
    if (!panel) return;
    var rect = panel.querySelector("rect");
    if (!rect) return;

    var glowOn = true;
    var pulseCount = 0;
    var glowTimer = setInterval(function () {
        if (pulseCount >= 8) { clearInterval(glowTimer); rect.style.filter = ""; return; }
        glowOn = !glowOn;
        rect.style.filter = glowOn ? "drop-shadow(0 0 18px #2196f3)" : "";
        pulseCount++;
    }, 500);
}

/* ──────────────────────────────────────────────────────────
   TRY AGAIN MESSAGE
   ────────────────────────────────────────────────────────── */

function showTryAgainMessage() {
    var svg = getEl("Layer_37");
    if (!svg) return;

    var old = getEl("try-again-msg");
    if (old) old.parentNode.removeChild(old);

    var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.setAttribute("id", "try-again-msg");

    var bg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    // Reduced width + moved down to avoid overlapping answer buttons.
    // Text remains centered at x=960.
    bg.setAttribute("x", "750"); bg.setAttribute("y", "640");
    bg.setAttribute("width", "420"); bg.setAttribute("height", "60");
    bg.setAttribute("rx", "16"); bg.setAttribute("ry", "16");
    bg.setAttribute("fill", "#ff4444"); bg.setAttribute("fill-opacity", "0.93");
    g.appendChild(bg);

    var txt = document.createElementNS("http://www.w3.org/2000/svg", "text");
    txt.setAttribute("x", "960"); txt.setAttribute("y", "681");
    txt.setAttribute("text-anchor", "middle");
    txt.setAttribute("fill", "#fff");
    txt.setAttribute("font-size", "26");
    txt.setAttribute("font-family", "Roboto-Bold, sans-serif");
    txt.setAttribute("font-weight", "700");
    txt.textContent = "Try Again!";
    g.appendChild(txt);

    svg.appendChild(g);

    setTimeout(function () {
        var msg = getEl("try-again-msg");
        if (msg) msg.parentNode.removeChild(msg);
    }, 1800);
}

/* ──────────────────────────────────────────────────────────
   CONGRATULATORY MESSAGE
   ────────────────────────────────────────────────────────── */

function showCongratulatoryMessage() {
    var svg = getEl("Layer_37");
    if (!svg) return;

    var old = getEl("congrats-overlay");
    if (old) old.parentNode.removeChild(old);

    var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.setAttribute("id", "congrats-overlay");

    var bg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    bg.setAttribute("x", "0"); bg.setAttribute("y", "0");
    bg.setAttribute("width", "1920"); bg.setAttribute("height", "1080");
    bg.setAttribute("fill", "rgba(0,0,0,0.55)");
    g.appendChild(bg);

    var card = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    card.setAttribute("x", "510"); card.setAttribute("y", "370");
    card.setAttribute("width", "900"); card.setAttribute("height", "340");
    card.setAttribute("rx", "30"); card.setAttribute("ry", "30");
    card.setAttribute("fill", "#fff");
    g.appendChild(card);

    var title = document.createElementNS("http://www.w3.org/2000/svg", "text");
    title.setAttribute("x", "960"); title.setAttribute("y", "465");
    title.setAttribute("text-anchor", "middle");
    title.setAttribute("fill", "#2196f3");
    title.setAttribute("font-size", "58");
    title.setAttribute("font-family", "Roboto-Bold, sans-serif");
    title.setAttribute("font-weight", "700");
    title.textContent = "\uD83C\uDF89 Congratulations!";
    g.appendChild(title);

    var sub = document.createElementNS("http://www.w3.org/2000/svg", "text");
    sub.setAttribute("x", "960"); sub.setAttribute("y", "540");
    sub.setAttribute("text-anchor", "middle");
    sub.setAttribute("fill", "#555");
    sub.setAttribute("font-size", "34");
    sub.setAttribute("font-family", "Roboto-Regular, sans-serif");
    sub.textContent = "You completed all sentences!";
    g.appendChild(sub);

    var btnR = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    btnR.setAttribute("x", "760"); btnR.setAttribute("y", "590");
    btnR.setAttribute("width", "400"); btnR.setAttribute("height", "80");
    btnR.setAttribute("rx", "20"); btnR.setAttribute("ry", "20");
    btnR.setAttribute("fill", "#4caf50");
    btnR.style.cursor = "pointer";
    g.appendChild(btnR);

    var btnT = document.createElementNS("http://www.w3.org/2000/svg", "text");
    btnT.setAttribute("x", "960"); btnT.setAttribute("y", "641");
    btnT.setAttribute("text-anchor", "middle");
    btnT.setAttribute("fill", "#fff");
    btnT.setAttribute("font-size", "34");
    btnT.setAttribute("font-family", "Roboto-Bold, sans-serif");
    btnT.setAttribute("font-weight", "700");
    btnT.textContent = "Tap to Begin Again";
    btnT.style.cursor = "pointer";
    g.appendChild(btnT);

    [btnR, btnT, bg].forEach(function (el) {
        el.addEventListener("click", function () {
            var overlay = getEl("congrats-overlay");
            if (overlay) overlay.parentNode.removeChild(overlay);
            resetCarPosition();
            loadSentence(WG.currentIndex);
        });
    });

    svg.appendChild(g);
}
/* ──────────────────────────────────────────────────────────
   RESET OPTION BUTTONS
   ────────────────────────────────────────────────────────── */

/* No quote button special fills needed now */
function resetOptionButtons() {
    Object.keys(WG.optionMap).forEach(function (id) {
        var el = getEl(id);
        if (!el) return;
        var bgRect = el.querySelector("rect");
        if (bgRect) {
            bgRect.style.fill = "#c7eabb";
        }
    });
}

/* ──────────────────────────────────────────────────────────
   SHOW ANSWER BUTTON (created dynamically, inserted into SVG)
   ────────────────────────────────────────────────────────── */

function createShowAnswerButton() {
    var svg = getEl("Layer_37");
    if (!svg || getEl("show-answer-btn")) return;

    var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.setAttribute("id", "show-answer-btn");
    g.style.cursor = "pointer";
    g.style.display = "none";

    var btnR = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    btnR.setAttribute("x", "700"); btnR.setAttribute("y", "956");
    btnR.setAttribute("width", "520"); btnR.setAttribute("height", "84");
    btnR.setAttribute("rx", "22"); btnR.setAttribute("ry", "22");
    btnR.setAttribute("fill", "#ff9800");
    g.appendChild(btnR);

    var btnT = document.createElementNS("http://www.w3.org/2000/svg", "text");
    btnT.setAttribute("x", "960"); btnT.setAttribute("y", "1009");
    btnT.setAttribute("text-anchor", "middle");
    btnT.setAttribute("fill", "#fff");
    btnT.setAttribute("font-size", "38");
    btnT.setAttribute("font-family", "Roboto-Bold, sans-serif");
    btnT.setAttribute("font-weight", "700");
    btnT.textContent = "Show Answer";
    g.appendChild(btnT);

    g.addEventListener("click", onShowAnswer);

    /* Insert before inside-popup so popup always renders on top */
    var popup = getEl("inside-popup");
    if (popup && popup.parentNode === svg) {
        svg.insertBefore(g, popup);
    } else {
        svg.appendChild(g);
    }
}

/* ──────────────────────────────────────────────────────────
   BOOT
   ────────────────────────────────────────────────────────── */

document.addEventListener("DOMContentLoaded", function () {
    createShowAnswerButton();
    init();
});
