/* =========================================================
   WG149 — Mark It Right! — Punctuation Widget
   Plain JavaScript, function-based, single global object
   =========================================================
   SVG Element IDs (key):
     #car               – car group, animated by translateX
     #q-text            – sentence text container
     #answer-btn        – yellow highlight box (hidden; decoration only)
     #answer-btn-text   – text inside the yellow box (hidden)
     #option-btn-1..7   – punctuation option buttons
     #signals-box       – traffic signal housing (top right)
     #yellow-signal     – yellow lamp 1
     #green-signal      – green lamp
     #red-signal        – red lamp
     #yellow-signal1    – yellow lamp 2
     #four/three/two/one-signals-panel – housing variants
     #inside-popup      – insights popup
     #inside-btn        – Insights button
     #close-btn         – popup close button
     #next-btn-panel    – Next button
   ========================================================= */

var WG = {
    /* ── state ─────────────────────────────────────────────── */
    sentences: [],           // shuffled sentence list
    currentIndex: 0,         // which sentence are we on
    currentSentence: null,   // sentence object being played
    blanks: [],              // ordered blank descriptors for current sentence
    filledAnswers: [],       // answers filled by user (parallel to blanks)
    activeBlank: 0,          // index of blank the user is currently targeting
    wrongAttempts: 0,        // wrong attempts for current blank
    showAnswerVisible: false, // is Show Answer button visible
    carBaseX: -260,          // SVG X of the leftmost position of car group
    carEndX: 0,              // car rests when fully completed
    idleTimer: null,         // timer for glow hint
    blinkTimer: null,        // timer for red-signal blink

    /* ── all 25 sentences ──────────────────────────────────── */
    /* Each blank is stored in-order as {position, answer}
       We store the sentence as an array of parts (string | blank-placeholder).
       Format: { display: "text shown in q-panel", blanks: [".", "!"] }
       The display uses ____ for each blank in appearance order.
    */
    rawSentences: [
        {
            display: "My friend Rita loves to read books____",
            blanks: ["."]
        },
        {
            display: "Wow____ What a beautiful rainbow____",
            blanks: ["!", "!"]
        },
        {
            display: "Where is your school bag____",
            blanks: ["?"]
        },
        {
            display: "I like to eat apples____ oranges and bananas____",
            blanks: [",", "."]
        },
        {
            display: "The teacher said____ ____Please sit down quietly________",
            blanks: [",", "\u201c", ".\u201d"]
        },
        {
            display: "That is Ramya____s bicycle____",
            blanks: ["'", "."]
        },
        {
            display: "Help____ I am stuck in a tree____",
            blanks: ["!", "!"]
        },
        {
            display: "We visited Delhi____ Mumbai and Kolkata last summer____",
            blanks: [",", "."]
        },
        {
            display: "Do you know where my pencil is____",
            blanks: ["?"]
        },
        {
            display: "Mother asked____ ____Have you finished your homework__________",
            blanks: [",", "\u201c", "?\u201d"]
        },
        {
            display: "The cat____s tail is very fluffy____",
            blanks: ["'", "."]
        },
        {
            display: "Hurray____ We won the match____",
            blanks: ["!", "!"]
        },
        {
            display: "My birthday is on Monday____ 15 March____",
            blanks: [",", "."]
        },
        {
            display: "Can you help me carry these books____",
            blanks: ["?"]
        },
        {
            display: "I love to play cricket____ football and badminton____",
            blanks: [",", "."]
        },
        {
            display: "She asked____ ____Is this your bag__________",
            blanks: [",", "\u201c", "?\u201d"]
        },
        {
            display: "Watch out____ There is a big puddle ahead____",
            blanks: ["!", "!"]
        },
        {
            display: "This is Meena____s favourite storybook____",
            blanks: ["'", "."]
        },
        {
            display: "What time does the school start____",
            blanks: ["?"]
        },
        {
            display: "The sky turned orange____ pink and purple at sunset____",
            blanks: [",", "."]
        },
        {
            display: "Father asked____ ____Did you water the plants today__________",
            blanks: [",", "\u201c", "?\u201d"]
        },
        {
            display: "Look____ A butterfly is sitting on the flower____",
            blanks: ["!", "!"]
        },
        {
            display: "The dog____s bone is buried in the garden____",
            blanks: ["'", "."]
        },
        {
            display: "I need a pen____ a notebook and an eraser for school____",
            blanks: [",", "."]
        },
        {
            display: "The wise old man said____ ____Always be kind to others__________",
            blanks: [",", "\u201c", ".\u201d"]
        }
    ],

    /* ── option button mapping: id → character ─────────────── */
    optionMap: {
        "option-btn-1": ".",
        "option-btn-2": "?",
        "option-btn-3": "!",
        "option-btn-4": ",",
        "option-btn-5": "'",
        "option-btn-6": "\u201c",   // opening "
        "option-btn-7": "\u201d"    // closing "
    },

    /* Special combined answers the user needs to place:
       "\u201c"  → maps to option-btn-6
       "\u201d"  → maps to option-btn-7
       "?\u201d" / ".\u201d" / "!\u201d" → these are multi-char accepted strings;
         the blank shows "?\"" etc. We accept ? then " in sequence,
         or we treat these as a single composed answer that maps to a button.
       To keep it simple: we split composed blanks into individual taps.
       Re-encode: sentences with ".\u201d" get blanks [".", "\u201d"] not [".\u201d"]
    */
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

function getEl(id) {
    return document.getElementById(id);
}

function show(id) {
    var el = getEl(id);
    if (el) el.style.display = "";
}

function hide(id) {
    var el = getEl(id);
    if (el) el.style.display = "none";
}

function setVisible(id, visible) {
    if (visible) show(id); else hide(id);
}

/* ──────────────────────────────────────────────────────────
   SENTENCE SPLITTING: expand composed blanks
   ────────────────────────────────────────────────────────── */

function expandBlanks(sentence) {
    var expanded = [];
    sentence.blanks.forEach(function (b) {
        if (b.length > 1) {
            // e.g. "?\"" → ["?", "\""]
            for (var i = 0; i < b.length; i++) {
                expanded.push(b[i]);
            }
        } else {
            expanded.push(b);
        }
    });
    return {
        display: sentence.display,
        blanks: expanded
    };
}

/* ──────────────────────────────────────────────────────────
   INITIALISE
   ────────────────────────────────────────────────────────── */

function init() {
    /* Expand composed blanks in rawSentences */
    WG.sentences = shuffleArray(
        WG.rawSentences.map(expandBlanks)
    );
    WG.currentIndex = 0;

    /* Hide the popup and show-answer button on start */
    hide("inside-popup");
    hideShowAnswer();

    /* Hide static SVG decorative elements that JS will manage */
    hide("answer-btn");
    hide("answer-btn-text");
    hide("next-btn-panel");

    /* Bind option buttons */
    Object.keys(WG.optionMap).forEach(function (id) {
        var el = getEl(id);
        if (el) {
            el.style.cursor = "pointer";
            el.addEventListener("click", function () {
                onOptionClick(WG.optionMap[id]);
            });
        }
    });

    /* Bind Insights button */
    var btnInsight = getEl("inside-btn");
    if (btnInsight) {
        btnInsight.style.cursor = "pointer";
        btnInsight.addEventListener("click", onInsightClick);
    }

    /* Bind Close popup */
    var closeBtn = getEl("close-btn");
    if (closeBtn) {
        closeBtn.style.cursor = "pointer";
        closeBtn.addEventListener("click", onClosePopup);
    }

    /* Bind Next button */
    var nextBtn = getEl("next-btn-panel");
    if (nextBtn) {
        nextBtn.style.cursor = "pointer";
        nextBtn.addEventListener("click", onNextClick);
    }

    /* Show Answer button (we create it dynamically in SVG) */
    var showAnswerBtn = getEl("show-answer-btn");
    if (showAnswerBtn) {
        showAnswerBtn.style.cursor = "pointer";
        showAnswerBtn.addEventListener("click", onShowAnswer);
    }

    loadSentence(WG.currentIndex);
}

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

    /* Clear signals — show default yellow (pending) state */
    resetSignals();

    /* Render the sentence display */
    renderSentence();

    /* Update active blank indicator inside question panel */
    updateActiveBlankDisplay();

    /* Reset option buttons to normal state */
    resetOptionButtons();

    /* Hide Next button (shown on completion) */
    hide("next-btn-panel");

    /* Hide Show Answer if showing */
    hideShowAnswer();

    /* Update car position */
    updateCarPosition();

    /* Start idle glow timer */
    startIdleTimer();

    /* Show appropriate signal panel */
    updateSignalPanel();
}

/* ──────────────────────────────────────────────────────────
   SENTENCE RENDERING
   ────────────────────────────────────────────────────────── */

function renderSentence() {
    var sen = WG.currentSentence;
    var display = sen.display;
    var blankIndex = 0;

    /* Replace ____ with filled answer or blank placeholder */
    var rendered = display.replace(/____/g, function () {
        var filled = WG.filledAnswers[blankIndex];
        var isActive = (blankIndex === WG.activeBlank);
        blankIndex++;
        if (filled !== null) {
            return filled;
        }
        if (isActive) {
            return "____";
        }
        return "____";
    });

    /* Update the SVG text element */
    var qText = getEl("q-text");
    if (!qText) return;

    /* Find the text element inside q-text */
    var textEl = qText.querySelector("text");
    if (!textEl) return;
    var tspan = textEl.querySelector("tspan");
    if (!tspan) return;

    tspan.textContent = rendered;

    /* Update answer-btn-text to show the active blank's current value or blank */
    updateAnswerBtnText();
}

function updateAnswerBtnText() {
    /* answer-btn and answer-btn-text are permanently hidden (they overlap the sentence text).
       Signal lights (green/red/yellow) provide all the visual feedback needed. */
}

function updateActiveBlankDisplay() {
    renderSentence();
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

    /* Flash green signal */
    showGreenSignal();

    /* Advance to next blank */
    WG.activeBlank++;
    WG.wrongAttempts = 0;

    updateSignalPanel();
    renderSentence();
    resetOptionButtons();

    /* Animate car forward */
    updateCarPosition();

    /* Check if all blanks filled */
    if (WG.activeBlank >= WG.blanks.length) {
        onAllBlanksFilled();
    } else {
        /* restart idle glow */
        startIdleTimer();
        hideShowAnswer();
    }
}

function onWrongAnswer() {
    WG.wrongAttempts++;

    /* Show red-signal blink */
    showRedSignalBlink();

    /* Show "Try Again" message */
    showTryAgainMessage();

    /* After 2 wrong attempts, reveal Show Answer button */
    if (WG.wrongAttempts >= 2) {
        showShowAnswer();
    }
}

function onAllBlanksFilled() {
    clearIdleTimer();
    stopBlink();

    /* Show Next button */
    show("next-btn-panel");

    /* Keep green signal on */
    showGreenSignal();
}

/* ──────────────────────────────────────────────────────────
   NEXT BUTTON
   ────────────────────────────────────────────────────────── */

function onNextClick() {
    WG.currentIndex++;

    if (WG.currentIndex >= WG.sentences.length) {
        /* All sentences exhausted — restart */
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
    var btn = getEl("show-answer-btn");
    if (btn) btn.style.display = "";
}

function hideShowAnswer() {
    WG.showAnswerVisible = false;
    var btn = getEl("show-answer-btn");
    if (btn) btn.style.display = "none";
}

function onShowAnswer() {
    /* Fill in the correct answer for the current blank */
    var correctAnswer = WG.blanks[WG.activeBlank];
    onCorrectAnswer(correctAnswer);
    hideShowAnswer();
}

/* ──────────────────────────────────────────────────────────
   INSIGHTS POPUP
   ────────────────────────────────────────────────────────── */

function onInsightClick() {
    show("inside-popup");
    clearIdleTimer();
}

function onClosePopup() {
    hide("inside-popup");
    startIdleTimer();
}

/* ──────────────────────────────────────────────────────────
   TRAFFIC SIGNAL LOGIC
   ────────────────────────────────────────────────────────── */

/*
  The SVG has 4 signal circles at different positions:
    yellow-signal  (1st / leftmost in 4-signal panel)
    green-signal   (2nd)
    red-signal     (3rd)
    yellow-signal1 (4th / rightmost)

  We also have panel groups:
    four-signals-panel  — visible when blanks count >= 4 (or as base)
    three-signals-panel — visible when blanks count == 3
    two-signals-panel   — visible when blanks count == 2
    one-signals-panel   — visible when blanks count == 1

  For simplicity we keep the four-signal housing always visible (it's the
  background pole structure). We just show/hide individual lights and panels
  based on the blank count.

  Colour logic:
    "pending" blank     → yellow
    "filled correct"    → green
    "current wrong"     → red (blinks)
*/

function resetSignals() {
    stopBlink();
    /* Default: show yellow only, hide green and red */
    setSignalColor("yellow-signal", "#efff00");
    setSignalColor("green-signal", "#555");     /* dim */
    setSignalColor("red-signal", "#555");        /* dim */
    setSignalColor("yellow-signal1", "#efff00");
}

function showGreenSignal() {
    stopBlink();
    /* Briefly show green, then back to default after a moment */
    setSignalColor("green-signal", "#0dff00");
    setSignalColor("red-signal", "#555");
    setSignalColor("yellow-signal", "#555");
    setSignalColor("yellow-signal1", "#555");

    /* After 1 second, restore */
    setTimeout(function () {
        resetSignals();
    }, 1000);
}

function showRedSignalBlink() {
    stopBlink();
    setSignalColor("red-signal", "red");
    setSignalColor("green-signal", "#555");
    setSignalColor("yellow-signal", "#555");
    setSignalColor("yellow-signal1", "#555");

    var on = true;
    WG.blinkTimer = setInterval(function () {
        on = !on;
        setSignalColor("red-signal", on ? "red" : "#555");
    }, 300);

    setTimeout(function () {
        stopBlink();
        resetSignals();
    }, 2000);
}

function stopBlink() {
    if (WG.blinkTimer) {
        clearInterval(WG.blinkTimer);
        WG.blinkTimer = null;
    }
}

/* Set the fill of the main circle inside a signal group */
function setSignalColor(signalGroupId, color) {
    var grp = getEl(signalGroupId);
    if (!grp) return;
    /* The first path is the main filled circle */
    var paths = grp.querySelectorAll("path, circle");
    if (paths.length > 0) {
        paths[0].style.fill = color;
    }
}

function updateSignalPanel() {
    var totalBlanks = WG.blanks.length;
    var remaining = WG.blanks.length - WG.activeBlank;

    /* Show the appropriate housing panel */
    var panels = ["one-signals-panel", "two-signals-panel",
        "three-signals-panel", "four-signals-panel"];
    panels.forEach(function (p) { hide(p); });

    if (totalBlanks >= 4) {
        show("four-signals-panel");
    } else if (totalBlanks === 3) {
        show("three-signals-panel");
    } else if (totalBlanks === 2) {
        show("two-signals-panel");
    } else {
        show("one-signals-panel");
    }
}

/* ──────────────────────────────────────────────────────────
   CAR ANIMATION (SVG x-position update)
   ────────────────────────────────────────────────────────── */

/*
  The car group (`#car`) sits at roughly x=1590 in SVG coords when
  the sentence begins. As the user fills blanks, it moves left across
  the screen (the road), stopping partway. When all blanks are filled
  it reaches a "goal" position. On Next it resets off-screen right and
  animates back in.

  We implement this by applying a CSS transform (translateX) to the car group.
  The car starts at translateX(0) and moves to translateX(-NNpx) progressively.
*/

function updateCarPosition() {
    var carEl = getEl("car");
    if (!carEl) return;

    var totalBlanks = WG.blanks.length;
    var filled = WG.activeBlank; /* number of blanks correctly answered */

    /* Progress ratio: 0 → 1 */
    var progress = totalBlanks > 0 ? filled / totalBlanks : 0;

    /* We move the car from 0 to -400 SVG units */
    var maxMove = -400;
    var translateX = progress * maxMove;

    carEl.style.transition = "transform 0.6s ease";
    carEl.style.transform = "translateX(" + translateX + "px)";
}

function resetCarPosition() {
    var carEl = getEl("car");
    if (!carEl) return;
    carEl.style.transition = "none";
    carEl.style.transform = "translateX(0px)";
}

/* ──────────────────────────────────────────────────────────
   IDLE / GLOW HINT
   ────────────────────────────────────────────────────────── */

function startIdleTimer() {
    clearIdleTimer();
    WG.idleTimer = setTimeout(function () {
        glowBlanks();
    }, 5000);
}

function clearIdleTimer() {
    if (WG.idleTimer) {
        clearTimeout(WG.idleTimer);
        WG.idleTimer = null;
    }
}

function glowBlanks() {
    /* Pulse the q-panel border to draw attention */
    var panel = getEl("q-panel");
    if (!panel) return;

    var rect = panel.querySelector("rect");
    if (!rect) return;

    var glowOn = true;
    var pulseCount = 0;
    var maxPulses = 6;
    var glowTimer = setInterval(function () {
        if (pulseCount >= maxPulses) {
            clearInterval(glowTimer);
            rect.style.filter = "";
            return;
        }
        glowOn = !glowOn;
        rect.style.filter = glowOn
            ? "drop-shadow(0 0 12px #38c1b7)"
            : "";
        pulseCount++;
    }, 500);
}

/* ──────────────────────────────────────────────────────────
   TRY AGAIN MESSAGE
   ────────────────────────────────────────────────────────── */

function showTryAgainMessage() {
    /* Show a brief Try Again overlay text in SVG */
    var svg = document.getElementById("Layer_37");
    if (!svg) return;

    /* Remove any existing try-again message */
    var old = getEl("try-again-msg");
    if (old) old.parentNode.removeChild(old);

    var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.setAttribute("id", "try-again-msg");

    /* Background rect */
    var bg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    bg.setAttribute("x", "660");
    bg.setAttribute("y", "614");
    bg.setAttribute("width", "600");
    bg.setAttribute("height", "80");
    bg.setAttribute("rx", "16");
    bg.setAttribute("ry", "16");
    bg.setAttribute("fill", "#ff4444");
    bg.setAttribute("fill-opacity", "0.92");
    g.appendChild(bg);

    /* Text */
    var txt = document.createElementNS("http://www.w3.org/2000/svg", "text");
    txt.setAttribute("x", "960");
    txt.setAttribute("y", "665");
    txt.setAttribute("text-anchor", "middle");
    txt.setAttribute("fill", "#fff");
    txt.setAttribute("font-size", "38");
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
    var svg = document.getElementById("Layer_37");
    if (!svg) return;

    var old = getEl("congrats-overlay");
    if (old) old.parentNode.removeChild(old);

    var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.setAttribute("id", "congrats-overlay");

    /* Semi-transparent overlay */
    var bg = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    bg.setAttribute("x", "0");
    bg.setAttribute("y", "0");
    bg.setAttribute("width", "1920");
    bg.setAttribute("height", "1080");
    bg.setAttribute("fill", "rgba(0,0,0,0.5)");
    g.appendChild(bg);

    /* Card */
    var card = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    card.setAttribute("x", "510");
    card.setAttribute("y", "370");
    card.setAttribute("width", "900");
    card.setAttribute("height", "340");
    card.setAttribute("rx", "30");
    card.setAttribute("ry", "30");
    card.setAttribute("fill", "#fff");
    g.appendChild(card);

    /* Title */
    var title = document.createElementNS("http://www.w3.org/2000/svg", "text");
    title.setAttribute("x", "960");
    title.setAttribute("y", "460");
    title.setAttribute("text-anchor", "middle");
    title.setAttribute("fill", "#2196f3");
    title.setAttribute("font-size", "56");
    title.setAttribute("font-family", "Roboto-Bold, sans-serif");
    title.setAttribute("font-weight", "700");
    title.textContent = "🎉 Congratulations!";
    g.appendChild(title);

    /* Sub text */
    var sub = document.createElementNS("http://www.w3.org/2000/svg", "text");
    sub.setAttribute("x", "960");
    sub.setAttribute("y", "540");
    sub.setAttribute("text-anchor", "middle");
    sub.setAttribute("fill", "#555");
    sub.setAttribute("font-size", "34");
    sub.setAttribute("font-family", "Roboto-Regular, sans-serif");
    sub.textContent = "You completed all sentences!";
    g.appendChild(sub);

    /* Tap to play again button */
    var btnR = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    btnR.setAttribute("x", "760");
    btnR.setAttribute("y", "590");
    btnR.setAttribute("width", "400");
    btnR.setAttribute("height", "80");
    btnR.setAttribute("rx", "20");
    btnR.setAttribute("ry", "20");
    btnR.setAttribute("fill", "#4caf50");
    btnR.style.cursor = "pointer";
    g.appendChild(btnR);

    var btnT = document.createElementNS("http://www.w3.org/2000/svg", "text");
    btnT.setAttribute("x", "960");
    btnT.setAttribute("y", "641");
    btnT.setAttribute("text-anchor", "middle");
    btnT.setAttribute("fill", "#fff");
    btnT.setAttribute("font-size", "34");
    btnT.setAttribute("font-family", "Roboto-Bold, sans-serif");
    btnT.setAttribute("font-weight", "700");
    btnT.textContent = "Tap to Begin Again";
    btnT.style.cursor = "pointer";
    g.appendChild(btnT);

    /* Click on button or overlay to restart */
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

function resetOptionButtons() {
    Object.keys(WG.optionMap).forEach(function (id) {
        var el = getEl(id);
        if (!el) return;
        /* Remove any highlight rect we added */
        var hl = el.querySelector(".option-highlight");
        if (hl) hl.parentNode.removeChild(hl);
        /* Reset fill on the main bg rect */
        var bgRect = el.querySelector("rect");
        if (bgRect) bgRect.style.fill = "#c7eabb";
    });
}

/* ──────────────────────────────────────────────────────────
   SHOW ANSWER BUTTON (dynamically created in SVG)
   ────────────────────────────────────────────────────────── */

function createShowAnswerButton() {
    var svg = document.getElementById("Layer_37");
    if (!svg || getEl("show-answer-btn")) return;

    var g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.setAttribute("id", "show-answer-btn");
    g.style.cursor = "pointer";
    g.style.display = "none";

    var btnR = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    btnR.setAttribute("x", "750");
    btnR.setAttribute("y", "960");
    btnR.setAttribute("width", "420");
    btnR.setAttribute("height", "80");
    btnR.setAttribute("rx", "20");
    btnR.setAttribute("ry", "20");
    btnR.setAttribute("fill", "#ff9800");
    g.appendChild(btnR);

    var btnT = document.createElementNS("http://www.w3.org/2000/svg", "text");
    btnT.setAttribute("x", "960");
    btnT.setAttribute("y", "1011");
    btnT.setAttribute("text-anchor", "middle");
    btnT.setAttribute("fill", "#fff");
    btnT.setAttribute("font-size", "34");
    btnT.setAttribute("font-family", "Roboto-Bold, sans-serif");
    btnT.setAttribute("font-weight", "700");
    btnT.textContent = "Show Answer";
    g.appendChild(btnT);

    g.addEventListener("click", onShowAnswer);
    svg.appendChild(g);
}

/* ──────────────────────────────────────────────────────────
   BOOT
   ────────────────────────────────────────────────────────── */

document.addEventListener("DOMContentLoaded", function () {
    createShowAnswerButton();
    init();
});
