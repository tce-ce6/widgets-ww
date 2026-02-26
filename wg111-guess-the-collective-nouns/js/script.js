/**
 * ═══════════════════════════════════════════════════════════════
 *  Guess the Collective Nouns – Interactive Widget  (script.js)
 * ═══════════════════════════════════════════════════════════════
 *
 *  Architecture rules (as per requirements):
 *  ──────────────────────────────────────────
 *  1. All mutable state lives inside the single global object GCN.
 *  2. Logic is written as named, stand-alone functions.
 *  3. Interactions are achieved exclusively by showing / hiding
 *     SVG elements (visibility / opacity toggling), never by
 *     altering the SVG's structural layout.
 *  4. Plain JavaScript – no third-party libraries (Lottie is
 *     already loaded separately and is available as window.lottie).
 *
 *  SVG coordinate space: 1920 × 1080 px
 *
 *  Key SVG element IDs (from index.html):
 *  ────────────────────────────────────────
 *  • "Group 900"       – Submit button group   (pink pill)
 *  • "Group 898"       – Show Answer button    (green pill, initially opacity:0.3)
 *  • "Group 1089"      – Next button           (orange pill, initially opacity:0.3)
 *  • "Group 2020"      – Backspace key button
 *  • "Group 752"       – Input box wrapper     (white rect + placeholder text)
 *  • "Show Answer"     – Text inside #Group 898
 *  • "Submit"          – Text inside #Group 900
 *  • "Next"            – Text inside #Group 1089
 *  • "______ of elephants" – Dynamic question text on the card
 *  • "Type your answer"    – Placeholder text in the input box
 *  • "0" (orange)          – Score counter beside the star
 *  • "0/25"                – Progress counter top-right
 *  • Letter texts: id="A", id="B", … id="Z"  (each is a <text> element)
 *  • "Rectangle 2657"  – Keyboard background (clipping rect)
 *  • "Path 5958"       – Card border path (blue border on white card)
 * ═══════════════════════════════════════════════════════════════
 */

/* ═══════════════════════════════════════════════════════════════
   §1  GLOBAL STATE OBJECT
   All mutable data lives inside GCN – no loose globals elsewhere.
   ═══════════════════════════════════════════════════════════════ */
var GCN = {

    /* ── §1a  Question data ──────────────────────────────────────
       28 entries: { noun, animal, image }
       image paths are relative to the widget root (./assets/images/).
       All 28 SVG files are present in assets/images/.
       The filename is used exactly as placed in that folder.
       Files with spaces in the name are encoded with %20 in the href.
       ─────────────────────────────────────────────────────────── */
    questions: [
        /* 1 */  { noun: "herd", animal: "elephants", image: "herd.svg" },
        /* 2 */  { noun: "pack", animal: "wolves", image: "pack.svg" },
        /* 3 */  { noun: "pride", animal: "lions", image: "pride.svg" },
        /* 4 */  { noun: "flock", animal: "birds", image: "flock.svg" },
        /* 5 */  { noun: "gaggle", animal: "geese", image: "gaggle.svg" },
        /* 6 */  { noun: "swarm", animal: "bees", image: "swarm-hive .svg" },
        /* 7 */  { noun: "troop", animal: "monkeys", image: "troop.svg" },
        /* 8 */  { noun: "troupe", animal: "performers", image: "troupe.svg" },
        /* 9 */  { noun: "army", animal: "ants", image: "army-troop .svg" },
        /* 10 */ { noun: "colony", animal: "bats", image: "colony-army .svg" },
        /* 11 */ { noun: "pod", animal: "whales", image: "pod-school.svg" },
        /* 12 */ { noun: "flight", animal: "birds", image: "flight.svg" },
        /* 13 */ { noun: "fleet", animal: "ships", image: "fleet.svg" },
        /* 14 */ { noun: "batch", animal: "cookies", image: "batch.svg" },
        /* 15 */ { noun: "bouquet", animal: "flowers", image: "bouquet.svg" },
        /* 16 */ { noun: "bunch", animal: "grapes", image: "bunch.svg" },
        /* 17 */ { noun: "bundle", animal: "sticks", image: "bundle.svg" },
        /* 18 */ { noun: "choir", animal: "singers", image: "choir.svg" },
        /* 19 */ { noun: "class", animal: "students", image: "class.svg" },
        /* 20 */ { noun: "crew", animal: "sailors", image: "crew.svg" },
        /* 21 */ { noun: "litter", animal: "kittens", image: "litter.svg" },
        /* 22 */ { noun: "litter", animal: "puppies", image: "litter1.svg" },
        /* 23 */ { noun: "pack", animal: "cards", image: "pack-deck.svg" },
        /* 24 */ { noun: "pile", animal: "books", image: "pile-stack.svg" },
        /* 25 */ { noun: "quiver", animal: "arrows", image: "quiver.svg" },
        /* 26 */ { noun: "team", animal: "horses", image: "team.svg" },
        /* 27 */ { noun: "gaggle", animal: "geese", image: "gaggle1.svg" },
        /* 28 */ { noun: "pride", animal: "lions", image: "pride1.svg" }
    ],

    /* ── §1b  Runtime state ──────────────────────────────────────
       All fields are reset by resetGame().
       ─────────────────────────────────────────────────────────── */
    currentIndex: 0,      // active question (0-based)
    score: 0,      // correct-answer star count
    completed: 0,      // questions finished (correct OR revealed)
    typedAnswer: "",     // current keyboard-typed string (lowercase)
    feedbackTimer: null,   // setTimeout handle for auto-hiding feedback
    isAnswered: false,  // true once the question is resolved
    isShowingAnswer: false,  // true while Show-Answer mode is active

    /* ── §1c  Cached element references (populated in §2 init) ── */
    els: {}
};


/* ═══════════════════════════════════════════════════════════════
   §2  INITIALISATION  – entry point called on DOMContentLoaded
   ═══════════════════════════════════════════════════════════════ */

/**
 * init()
 * ────────
 * 1. Resolves and caches all SVG element references.
 * 2. Injects dynamic overlay elements (feedback boxes, image, etc.).
 * 3. Wires click listeners to keyboard keys and action buttons.
 * 4. Loads question 0 to start the game.
 */
function init() {
    var svg = document.querySelector("#svg-container svg");
    if (!svg) { console.error("SVG root not found"); return; }

    /* Cache the SVG root for later use */
    GCN.els.svg = svg;

    /* §2a — Resolve SVG element references */
    resolveElements(svg);

    /* §2b — Inject dynamic overlays */
    buildDynamicOverlays(svg);

    /* §2c — Wire keyboard + button listeners */
    attachKeyboardListeners(svg);
    attachButtonListeners();

    /* §2d — Start game */
    loadQuestion(0);
}


/* ═══════════════════════════════════════════════════════════════
   §3  ELEMENT RESOLUTION
   ═══════════════════════════════════════════════════════════════ */

/**
 * resolveElements(svg)
 * ─────────────────────
 * SVG IDs in this project contain spaces ("Group 900" etc.).
 * querySelector with '#Group\ 900' works in most browsers but can
 * be fragile.  We use a reliable helper that scans by id attribute.
 */
function resolveElements(svg) {
    var els = GCN.els;

    /* Low-level helper: find element whose .id === given string */
    function byId(id) {
        /* Direct getElementById first (fastest) */
        var el = document.getElementById(id);
        if (el) return el;
        /* Fallback: scan all elements with an [id] attribute */
        var all = svg.querySelectorAll("[id]");
        for (var i = 0; i < all.length; i++) {
            if (all[i].id === id) return all[i];
        }
        return null;
    }

    /* ── Action button groups ──────────────────────────────────── */
    els.submitBtn = byId("Group 900");   // pink Submit pill
    els.showAnswerBtn = byId("Group 898");   // green Show Answer pill
    els.nextBtn = byId("Group 1089"); // orange Next pill
    els.backspaceBtn = byId("Group 2020"); // backspace key

    /* ── Input area ────────────────────────────────────────────── */
    els.inputGroup = byId("Group 752");  // white input box group

    /* ── "Show Answer" button text element (for "Hide Answer" swap) */
    /* The text is the child with id="Show Answer" */
    els.showAnswerTextEl = byId("Show Answer");

    /* ── Dynamic text elements inside the SVG ─────────────────── */
    /* Placeholder in input box */
    els.inputPlaceholder = byId("Type your answer");

    /* Question text on the card ("______ of elephants") */
    els.questionText = findTextByContent(svg, "______of elephants");

    /* Score counter (orange "0" next to the star) */
    /* Has fill="#F6790B"; id="0" which conflicts – find by fill */
    els.scoreText = findTextByFill(svg, "#F6790B");

    /* Progress counter – top-right white box.
     The element has id="0/25" (its SVG id attribute never changes).
     JS will dynamically update its tspan content to "1/28", "2/28" etc. */
    els.progressText = byId("0/25");

    /* Log warnings for any unresolved references */
    var checks = {
        submitBtn: els.submitBtn,
        showAnswerBtn: els.showAnswerBtn,
        nextBtn: els.nextBtn,
        backspaceBtn: els.backspaceBtn,
        questionText: els.questionText,
        scoreText: els.scoreText,
        progressText: els.progressText
    };
    for (var key in checks) {
        if (!checks[key]) console.warn("GCN: could not resolve element →", key);
    }
}

/**
 * findTextByContent(svg, content)
 * ────────────────────────────────
 * Walk all <text> elements; return the first whose trimmed
 * textContent matches `content` (trim + collapse whitespace).
 */
function findTextByContent(svg, content) {
    var target = content.trim().replace(/\s+/g, " ");
    var texts = svg.querySelectorAll("text");
    for (var i = 0; i < texts.length; i++) {
        var tc = texts[i].textContent.trim().replace(/\s+/g, " ");
        if (tc === target) return texts[i];
    }
    return null;
}

/**
 * findTextByFill(svg, fill)
 * ──────────────────────────
 * Return the first <text> element with the given fill attribute.
 */
function findTextByFill(svg, fill) {
    var texts = svg.querySelectorAll("text");
    for (var i = 0; i < texts.length; i++) {
        if ((texts[i].getAttribute("fill") || "").toLowerCase() === fill.toLowerCase()) {
            return texts[i];
        }
    }
    return null;
}


/* ═══════════════════════════════════════════════════════════════
   §4  DYNAMIC SVG OVERLAY BUILDER
   ═══════════════════════════════════════════════════════════════ */

/**
 * buildDynamicOverlays(svg)
 * ──────────────────────────
 * Appends all interactive / feedback elements into the SVG.
 * These are invisible initially and shown/hidden at runtime.
 *
 * Elements injected:
 *   • dyn-typed-text        – typed answer inside input box
 *   • dyn-animal-image      – photo of the animal on the card
 *   • dyn-excellent-overlay – "Excellent!" dashed green box
 *   • dyn-tryagain-overlay  – "Try Again!" dashed red box
 *   • dyn-confetti          – coloured dot burst
 *   • dyn-complete-overlay  – full-screen end-game screen
 */
function buildDynamicOverlays(svg) {
    var els = GCN.els;

    /* Ensure a <defs> block exists for clip-paths */
    var defs = svg.querySelector("defs") || mkSVG("defs", {});
    if (!svg.querySelector("defs")) svg.insertBefore(defs, svg.firstChild);

    /* ── Clip path for animal image (rounded rectangle inside card) */
    var imgClip = mkSVG("clipPath", { id: "dyn-img-clip" });
    imgClip.appendChild(mkSVG("rect", { x: "730", y: "245", width: "430", height: "420", rx: "16" }));
    defs.appendChild(imgClip);

    /* ── Typed-answer text inside the input box ────────────────── */
    var typedText = mkSVG("text", {
        id: "dyn-typed-text",
        x: "1309", y: "356",
        fill: "#1A1818",
        "font-family": "Roboto",
        "font-size": "35",
        "font-weight": "500",
        "letter-spacing": "0em",
        style: "white-space:pre; visibility:hidden; pointer-events:none;"
    });
    svg.appendChild(typedText);
    els.typedText = typedText;

    /* ── Animal image inside the card ─────────────────────────── */
    var animalImg = mkSVG("image", {
        id: "dyn-animal-image",
        x: "730", y: "245",
        width: "430", height: "420",
        preserveAspectRatio: "xMidYMid meet",
        "clip-path": "url(#dyn-img-clip)",
        style: "visibility:hidden; pointer-events:none;"
    });
    svg.appendChild(animalImg);
    els.animalImage = animalImg;

    /* ── "Excellent!" green feedback overlay ───────────────────── */
    els.excellentOverlay = buildFeedbackBox(svg, {
        id: "dyn-excellent-overlay",
        x: 90, y: 330, w: 400, h: 130,
        borderColor: "#4CAF50",
        bgColor: "#F4FBF4",
        iconType: "check",
        label: "Excellent!",
        labelColor: "#2E7D32"
    });

    /* ── "Try Again!" red feedback overlay ────────────────────── */
    els.tryAgainOverlay = buildFeedbackBox(svg, {
        id: "dyn-tryagain-overlay",
        x: 90, y: 330, w: 400, h: 130,
        borderColor: "#E53935",
        bgColor: "#FFF5F5",
        iconType: "cross",
        label: "Try Again!",
        labelColor: "#C62828"
    });

    /* ── Confetti dots ─────────────────────────────────────────── */
    els.confetti = buildConfetti(svg);

    /* ── Game-complete overlay ─────────────────────────────────── */
    els.completeOverlay = buildCompleteOverlay(svg);
}

/**
 * buildFeedbackBox(svg, opts)
 * ────────────────────────────
 * Creates a dashed-border feedback <g> element with:
 *   • coloured dashed rectangle
 *   • circle icon (check or cross)
 *   • label text
 * Returns the <g> element (initially hidden).
 */
function buildFeedbackBox(svg, opts) {
    var g = mkSVG("g", { id: opts.id, style: "visibility:hidden;" });

    /* Background rectangle with dashed border */
    g.appendChild(mkSVG("rect", {
        x: opts.x, y: opts.y,
        width: opts.w, height: opts.h,
        rx: "18", ry: "18",
        fill: opts.bgColor,
        stroke: opts.borderColor,
        "stroke-width": "3",
        "stroke-dasharray": "10,6"
    }));

    /* Icon circle */
    var cx = opts.x + 60;
    var cy = opts.y + opts.h / 2;

    g.appendChild(mkSVG("circle", { cx: cx, cy: cy, r: "32", fill: opts.borderColor }));

    if (opts.iconType === "check") {
        /* ✓ check-mark path */
        var path = mkSVG("path", {
            d: ["M", cx - 15, cy, "L", cx - 4, cy + 13, "L", cx + 17, cy - 15].join(" "),
            stroke: "#FFFFFF",
            "stroke-width": "5.5",
            "stroke-linecap": "round",
            "stroke-linejoin": "round",
            fill: "none"
        });
        g.appendChild(path);
    } else {
        /* ✕ cross mark – two diagonal lines */
        g.appendChild(mkSVG("line", {
            x1: cx - 13, y1: cy - 13, x2: cx + 13, y2: cy + 13,
            stroke: "#FFFFFF", "stroke-width": "5.5", "stroke-linecap": "round"
        }));
        g.appendChild(mkSVG("line", {
            x1: cx + 13, y1: cy - 13, x2: cx - 13, y2: cy + 13,
            stroke: "#FFFFFF", "stroke-width": "5.5", "stroke-linecap": "round"
        }));
    }

    /* Label text */
    var txt = mkSVG("text", {
        x: opts.x + 112,
        y: opts.y + opts.h / 2 + 16,
        fill: opts.labelColor,
        "font-family": "Roboto",
        "font-size": "44",
        "font-weight": "bold",
        "letter-spacing": "0em"
    });
    txt.textContent = opts.label;
    g.appendChild(txt);

    svg.appendChild(g);
    return g;
}

/**
 * buildConfetti(svg)
 * ───────────────────
 * Scatters 20 coloured circles to the left of the card.
 * Returns the <g> group (initially hidden).
 */
function buildConfetti(svg) {
    var colors = ["#FF4E4E", "#FFD700", "#4CAF50", "#29B6F6", "#FF69B4", "#AB47BC", "#FF8C00", "#26C6DA"];
    var g = mkSVG("g", { id: "dyn-confetti", style: "visibility:hidden; pointer-events:none;" });

    /* Positions scattered around the left 'Excellent!' zone */
    var pts = [
        [155, 265], [230, 295], [140, 350], [195, 250], [255, 310],
        [178, 390], [157, 300], [245, 270], [210, 360], [168, 430],
        [130, 370], [268, 295], [203, 240], [148, 445], [285, 315],
        [228, 405], [188, 278], [260, 345], [120, 310], [200, 290]
    ];
    for (var i = 0; i < pts.length; i++) {
        g.appendChild(mkSVG("circle", {
            cx: pts[i][0], cy: pts[i][1],
            r: 4 + (i % 5),
            fill: colors[i % colors.length],
            opacity: 0.85
        }));
    }

    svg.appendChild(g);
    return g;
}

/**
 * buildCompleteOverlay(svg)
 * ──────────────────────────
 * Full-screen congratulations panel shown after all 25 questions.
 * Contains the final score and a "Play Again" button.
 * Returns the <g> group (initially hidden).
 */
function buildCompleteOverlay(svg) {
    var g = mkSVG("g", { id: "dyn-complete-overlay", style: "visibility:hidden;" });

    /* Semi-transparent dark backdrop */
    g.appendChild(mkSVG("rect", {
        x: "0", y: "0", width: "1920", height: "1080",
        fill: "rgba(0,0,0,0.55)"
    }));

    /* White card panel */
    g.appendChild(mkSVG("rect", {
        x: "560", y: "295", width: "800", height: "490",
        rx: "32", ry: "32",
        fill: "#FFFFFF",
        stroke: "#4CAF50",
        "stroke-width": "6"
    }));

    /* Star emoji decoration */
    appendSVGText(g, "960", "400", "⭐", {
        "font-size": "64", "text-anchor": "middle", fill: "#F6790B"
    });

    /* "Well Done!" heading */
    appendSVGText(g, "960", "475", "Well Done!", {
        "font-size": "56", "font-weight": "bold",
        "text-anchor": "middle", fill: "#2E7D32"
    });

    /* Completion sub-message */
    appendSVGText(g, "960", "540", "You've completed all 28!", {
        "font-size": "34", "text-anchor": "middle", fill: "#555555"
    });

    /* Dynamic score line – id exposed so updateCompleteScore() can set it */
    var scoreMsg = mkSVG("text", {
        id: "dyn-complete-score",
        x: "960", y: "605",
        fill: "#F6790B",
        "font-family": "Roboto",
        "font-size": "40",
        "font-weight": "bold",
        "text-anchor": "middle",
        "letter-spacing": "0em"
    });
    scoreMsg.textContent = "You earned 0 stars!";
    g.appendChild(scoreMsg);
    GCN.els.completeScoreText = scoreMsg;

    /* "Play Again" button – blue rounded rectangle */
    var btnRect = mkSVG("rect", {
        x: "710", y: "650", width: "500", height: "80",
        rx: "40", ry: "40",
        fill: "#1565C0",
        style: "cursor:pointer;"
    });
    btnRect.addEventListener("click", resetGame);
    g.appendChild(btnRect);

    var btnTxt = mkSVG("text", {
        x: "960", y: "700",
        fill: "#FFFFFF",
        "font-family": "Roboto",
        "font-size": "34",
        "font-weight": "bold",
        "text-anchor": "middle",
        "letter-spacing": "0em",
        style: "cursor:pointer; pointer-events:auto;"
    });
    btnTxt.textContent = "Play Again";
    btnTxt.addEventListener("click", resetGame);
    g.appendChild(btnTxt);

    svg.appendChild(g);
    return g;
}


/* ═══════════════════════════════════════════════════════════════
   §5  SVG CREATION UTILITIES
   ═══════════════════════════════════════════════════════════════ */

/**
 * mkSVG(tag, attrs)
 * ──────────────────
 * Shorthand for createElementNS + setAttribute.
 * @param  {string} tag
 * @param  {Object} attrs   key–value attribute map
 * @return {SVGElement}
 */
function mkSVG(tag, attrs) {
    var NS = "http://www.w3.org/2000/svg";
    var el = document.createElementNS(NS, tag);
    for (var k in attrs) {
        if (attrs.hasOwnProperty(k)) el.setAttribute(k, attrs[k]);
    }
    /* Ensure Roboto is the default font for all text nodes */
    if (tag === "text" && !attrs["font-family"]) {
        el.setAttribute("font-family", "Roboto");
    }
    return el;
}

/**
 * appendSVGText(parent, x, y, content, attrs)
 * ─────────────────────────────────────────────
 * Create and append a <text> SVG element with given textContent.
 */
function appendSVGText(parent, x, y, content, attrs) {
    attrs = attrs || {};
    attrs.x = x; attrs.y = y;
    var el = mkSVG("text", attrs);
    el.textContent = content;
    parent.appendChild(el);
    return el;
}


/* ═══════════════════════════════════════════════════════════════
   §6  VISIBILITY HELPERS
   ═══════════════════════════════════════════════════════════════ */

/**
 * showEl(el)
 * ───────────
 * Make an SVG/HTML element visible.
 * Removes inline visibility:hidden / display:none / opacity-0.
 */
function showEl(el) {
    if (!el) return;
    el.style.visibility = "visible";
    el.style.display = "";
    el.style.opacity = "";
}

/**
 * hideEl(el)
 * ───────────
 * Fully hide an SVG/HTML element without removing it from the DOM.
 */
function hideEl(el) {
    if (!el) return;
    el.style.visibility = "hidden";
    el.style.opacity = "0";
}

/**
 * enableBtn(groupEl)
 * ───────────────────
 * Activate a button group: full opacity, pointer-events on.
 */
function enableBtn(groupEl) {
    if (!groupEl) return;
    groupEl.style.opacity = "1";
    groupEl.style.pointerEvents = "auto";
    groupEl.style.cursor = "pointer";
}

/**
 * disableBtn(groupEl)
 * ────────────────────
 * De-activate a button group: 0.3 opacity, pointer-events off.
 */
function disableBtn(groupEl) {
    if (!groupEl) return;
    groupEl.style.opacity = "0.3";
    groupEl.style.pointerEvents = "none";
    groupEl.style.cursor = "default";
}


/* ═══════════════════════════════════════════════════════════════
   §7  KEYBOARD INTERACTION
   ═══════════════════════════════════════════════════════════════ */

/**
 * attachKeyboardListeners(svg)
 * ──────────────────────────────
 * The SVG keyboard uses individual <text> elements with id="A" .. id="Z".
 * Each letter's bounding path lives in the same row's <path> siblings.
 * We attach click listeners directly to each letter <text> and its
 * corresponding background <path> (identified by vertical position).
 *
 * Strategy:
 *   • For every <text id="X"> where X is a single A-Z character:
 *       – make the text itself clickable (letter label)
 *       – expand the click area by wrapping in a transparent <rect>
 *         that covers the key bouding box defined from the SVG data.
 */
function attachKeyboardListeners(svg) {
    /* Exact x/y centres and bounds for each key derived from the SVG coord data */
    var keyMap = {
        "A": { bx: 1261, by: 426, bw: 50, bh: 50 },
        "B": { bx: 1323, by: 426, bw: 50, bh: 50 },
        "C": { bx: 1385, by: 426, bw: 50, bh: 50 },
        "D": { bx: 1448, by: 426, bw: 50, bh: 50 },
        "E": { bx: 1510, by: 426, bw: 50, bh: 50 },
        "F": { bx: 1572, by: 426, bw: 44, bh: 50 },
        "G": { bx: 1261, by: 488, bw: 50, bh: 50 },
        "H": { bx: 1323, by: 488, bw: 50, bh: 50 },
        "I": { bx: 1385, by: 488, bw: 50, bh: 50 },
        "J": { bx: 1448, by: 488, bw: 50, bh: 50 },
        "K": { bx: 1510, by: 488, bw: 50, bh: 50 },
        "L": { bx: 1572, by: 488, bw: 44, bh: 50 },
        "M": { bx: 1261, by: 550, bw: 50, bh: 50 },
        "N": { bx: 1323, by: 550, bw: 50, bh: 50 },
        "O": { bx: 1385, by: 550, bw: 50, bh: 50 },
        "P": { bx: 1448, by: 550, bw: 50, bh: 50 },
        "Q": { bx: 1510, by: 550, bw: 50, bh: 50 },
        "R": { bx: 1572, by: 550, bw: 44, bh: 50 },
        "S": { bx: 1261, by: 612, bw: 50, bh: 50 },
        "T": { bx: 1323, by: 612, bw: 50, bh: 50 },
        "U": { bx: 1385, by: 612, bw: 50, bh: 50 },
        "V": { bx: 1448, by: 612, bw: 50, bh: 50 },
        "W": { bx: 1510, by: 612, bw: 50, bh: 50 },
        "X": { bx: 1572, by: 612, bw: 44, bh: 50 },
        "Y": { bx: 1385, by: 674, bw: 50, bh: 50 },
        "Z": { bx: 1448, by: 674, bw: 50, bh: 50 }
    };

    /* Attach listener to each letter <text> element and overlay a
       transparent hit-area <rect> for reliable click detection. */
    "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").forEach(function (letter) {
        var textEl = document.getElementById(letter);
        if (!textEl) return;

        /* Style the letter to show it's interactive */
        textEl.style.cursor = "pointer";

        /* Attach click to the text element itself */
        textEl.addEventListener("click", function () { handleKeyPress(letter); });

        /* Overlay a transparent hit-rect for better touch/click area */
        var km = keyMap[letter];
        if (!km) return;
        var hitRect = mkSVG("rect", {
            x: km.bx, y: km.by, width: km.bw, height: km.bh,
            fill: "transparent",
            style: "cursor:pointer;"
        });
        hitRect.addEventListener("click", function () { handleKeyPress(letter); });
        svg.appendChild(hitRect);
        /* Store ref so we can disable during answered state */
        GCN.els["keyHit_" + letter] = hitRect;
    });

    /* ── Backspace button listener ─────────────────────────────── */
    if (GCN.els.backspaceBtn) {
        GCN.els.backspaceBtn.style.cursor = "pointer";
        GCN.els.backspaceBtn.addEventListener("click", handleBackspace);
    }
}

/**
 * handleKeyPress(letter)
 * ───────────────────────
 * Appends a lowercase letter to typedAnswer and refreshes display.
 * No-ops if the question is already answered.
 * @param {string} letter  Single uppercase letter ("A"–"Z").
 */
function handleKeyPress(letter) {
    if (GCN.isAnswered) return;
    GCN.typedAnswer += letter.toLowerCase();
    updateInputDisplay();
}

/**
 * handleBackspace()
 * ──────────────────
 * Removes the last character from typedAnswer.
 */
function handleBackspace() {
    if (GCN.isAnswered) return;
    if (GCN.typedAnswer.length === 0) return;
    GCN.typedAnswer = GCN.typedAnswer.slice(0, -1);
    updateInputDisplay();
}

/**
 * updateInputDisplay()
 * ─────────────────────
 * Synchronises the SVG input area with GCN.typedAnswer:
 *   • empty → show placeholder "Type your answer"
 *   • has text → hide placeholder, show typed text
 */
function updateInputDisplay() {
    var els = GCN.els;

    if (GCN.typedAnswer === "") {
        /* Restore placeholder */
        showEl(els.inputPlaceholder);
        hideEl(els.typedText);
    } else {
        hideEl(els.inputPlaceholder);
        if (els.typedText) {
            els.typedText.textContent = GCN.typedAnswer;
            showEl(els.typedText);
        }
    }
}


/* ═══════════════════════════════════════════════════════════════
   §8  BUTTON LISTENERS
   ═══════════════════════════════════════════════════════════════ */

/**
 * attachButtonListeners()
 * ────────────────────────
 * Attach click handlers to the three main action buttons.
 */
function attachButtonListeners() {
    var els = GCN.els;
    if (els.submitBtn) els.submitBtn.addEventListener("click", handleSubmit);
    if (els.showAnswerBtn) els.showAnswerBtn.addEventListener("click", handleShowAnswer);
    if (els.nextBtn) els.nextBtn.addEventListener("click", handleNext);
}


/* ═══════════════════════════════════════════════════════════════
   §9  SUBMIT LOGIC
   ═══════════════════════════════════════════════════════════════ */

/**
 * handleSubmit()
 * ───────────────
 * Called when the learner clicks Submit.
 * Validates typedAnswer against the correct noun (case-insensitive).
 */
function handleSubmit() {
    if (GCN.isAnswered) return;          // already done – ignore extra clicks
    if (GCN.typedAnswer.trim() === "") return; // nothing typed

    var typed = GCN.typedAnswer.trim().toLowerCase();
    var correct = GCN.questions[GCN.currentIndex].noun.toLowerCase();

    if (typed === correct) {
        handleCorrectAnswer();
    } else {
        handleWrongAnswer();
    }
}

/**
 * handleCorrectAnswer()
 * ──────────────────────
 * • Increments score and completed count.
 * • Reveals animal image and full-answer text on the card.
 * • Shows "Excellent!" feedback + confetti.
 * • Activates Next button; deactivates Submit & Show Answer.
 * • Auto-hides feedback after 2.5 s.
 */
function handleCorrectAnswer() {
    /* Mark resolved */
    GCN.isAnswered = true;
    GCN.score += 1;
    GCN.completed += 1;

    /* Update score and progress in the SVG */
    updateScoreDisplay();
    updateProgressDisplay();

    /* Card: reveal answer + image */
    updateCardQuestion(true);
    showAnimalImage(GCN.currentIndex);

    /* Feedback */
    showFeedback("excellent");
    showEl(GCN.els.confetti);

    /* Button states */
    disableBtn(GCN.els.submitBtn);
    disableBtn(GCN.els.showAnswerBtn);
    enableBtn(GCN.els.nextBtn);

    /* Auto-dismiss after 2.5 s */
    clearTimeout(GCN.feedbackTimer);
    GCN.feedbackTimer = setTimeout(function () {
        hideFeedback("excellent");
        hideEl(GCN.els.confetti);
    }, 2500);
}

/**
 * handleWrongAnswer()
 * ────────────────────
 * • Shows "Try Again!" feedback for 1.8 s.
 * • Clears the typed answer so the learner can retry.
 * • Does NOT increment score or completed.
 */
function handleWrongAnswer() {
    showFeedback("tryagain");

    /* Clear input for retry */
    GCN.typedAnswer = "";
    updateInputDisplay();

    clearTimeout(GCN.feedbackTimer);
    GCN.feedbackTimer = setTimeout(function () {
        hideFeedback("tryagain");
    }, 1800);
}


/* ═══════════════════════════════════════════════════════════════
   §10  SHOW / HIDE ANSWER LOGIC
   ═══════════════════════════════════════════════════════════════ */

/**
 * handleShowAnswer()
 * ───────────────────
 * Toggle: reveal or conceal the correct answer on the card.
 *
 * First click  → reveal answer, count as completed (no star),
 *                unlock Next button, change button to "Hide Answer".
 * Second click → hide answer text/image, change back to "Show Answer".
 *                (isAnswered stays true – Submit is still blocked.)
 */
function handleShowAnswer() {
    if (GCN.isAnswered && !GCN.isShowingAnswer) return; // can't re-show after correct submit

    if (!GCN.isShowingAnswer) {
        /* ── REVEAL ─────────────────────────────── */
        GCN.isShowingAnswer = true;
        GCN.isAnswered = true;

        /* Count as completed (no star) */
        GCN.completed += 1;
        updateProgressDisplay();

        /* Reveal on card */
        updateCardQuestion(true);
        showAnimalImage(GCN.currentIndex);

        /* Change button label */
        setShowAnswerText("Hide Answer");

        /* Enable Next button */
        enableBtn(GCN.els.nextBtn);

        /* Disable Submit (reveal = forfeit) */
        disableBtn(GCN.els.submitBtn);

    } else {
        /* ── CONCEAL (toggle back) ──────────────── */
        GCN.isShowingAnswer = false;
        /* Note: isAnswered remains true → Submit stays blocked */

        /* Hide image + restore blank question on card */
        hideEl(GCN.els.animalImage);
        updateCardQuestion(false);

        /* Restore button label */
        setShowAnswerText("Show Answer");
    }
}

/**
 * setShowAnswerText(label)
 * ─────────────────────────
 * Updates the text inside the "Show Answer" button to `label`.
 * Handles both direct text nodes and nested <tspan> elements.
 * @param {string} label  "Show Answer" or "Hide Answer"
 */
function setShowAnswerText(label) {
    var el = GCN.els.showAnswerTextEl;
    if (!el) return;
    var tspan = el.querySelector("tspan");
    if (tspan) {
        tspan.textContent = label;
    } else {
        el.textContent = label;
    }
}


/* ═══════════════════════════════════════════════════════════════
   §11  NEXT QUESTION LOGIC
   ═══════════════════════════════════════════════════════════════ */

/**
 * handleNext()
 * ─────────────
 * Advances to the next question, or shows the completion screen
 * if all questions have been answered.
 */
function handleNext() {
    if (!GCN.isAnswered) return; /* safety guard – should not fire */

    clearTimeout(GCN.feedbackTimer);

    var next = GCN.currentIndex + 1;

    if (next >= GCN.questions.length) {
        showCompleteOverlay();
    } else {
        loadQuestion(next);
    }
}


/* ═══════════════════════════════════════════════════════════════
   §12  QUESTION LOADING
   ═══════════════════════════════════════════════════════════════ */

/**
 * loadQuestion(index)
 * ────────────────────
 * Sets up UI state for the question at `index`:
 *   • Reset all per-question state flags
 *   • Clear input display (show placeholder)
 *   • Hide all overlays and feedback
 *   • Update card question text (blank form)
 *   • Set correct button enable / disable states
 * @param {number} index  0-based question index
 */
function loadQuestion(index) {
    var els = GCN.els;

    /* — Update state — */
    GCN.currentIndex = index;
    GCN.typedAnswer = "";
    GCN.isAnswered = false;
    GCN.isShowingAnswer = false;

    /* — Reset input display — */
    updateInputDisplay();

    /* — Hide all overlays — */
    hideFeedback("excellent");
    hideFeedback("tryagain");
    hideEl(els.confetti);
    hideEl(els.animalImage);

    /* — Reset card question — */
    updateCardQuestion(false);

    /* — Button states —
         Submit:      ENABLED  (learner can type and submit)
         Show Answer: ENABLED  (learner may ask for the answer)
         Next:        DISABLED (must answer or reveal first) */
    enableBtn(els.submitBtn);
    enableBtn(els.showAnswerBtn);
    disableBtn(els.nextBtn);

    /* — Reset Show Answer button text — */
    setShowAnswerText("Show Answer");
}

/**
 * updateCardQuestion(showFull)
 * ─────────────────────────────
 * Updates the question text element on the card.
 * @param {boolean} showFull  true  → display "herd of elephants"
 *                            false → display "______ of elephants"
 */
function updateCardQuestion(showFull) {
    var q = GCN.questions[GCN.currentIndex];
    var noun = showFull ? q.noun : "______";
    var newText = noun + " of " + q.animal;

    var el = GCN.els.questionText;
    if (!el) return;

    /* Update tspan if present, else set textContent directly */
    var tspan = el.querySelector("tspan");
    if (tspan) {
        tspan.textContent = newText;
    } else {
        el.textContent = newText;
    }
}


/* ═══════════════════════════════════════════════════════════════
   §13  ANIMAL IMAGE
   ═══════════════════════════════════════════════════════════════ */

/**
 * showAnimalImage(index)
 * ───────────────────────
 * Sets href on the SVG <image> element and makes it visible.
 * @param {number} index  Question index.
 */
function showAnimalImage(index) {
    var imgEl = GCN.els.animalImage;
    if (!imgEl) return;

    /* Encode the filename so that names containing spaces (e.g. "army-troop .svg")
       are valid URL paths. Only the filename part is encoded, not the path slashes. */
    var filename = GCN.questions[index].image;
    var src = "./assets/images/" + encodeURIComponent(filename);

    /* Set both href and xlink:href for broad browser compatibility */
    imgEl.setAttribute("href", src);
    imgEl.setAttributeNS("http://www.w3.org/1999/xlink", "href", src);

    showEl(imgEl);
}


/* ═══════════════════════════════════════════════════════════════
   §14  FEEDBACK OVERLAYS
   ═══════════════════════════════════════════════════════════════ */

/**
 * showFeedback(type)
 * ───────────────────
 * Shows either the "excellent" or "tryagain" overlay with a
 * spring pop-in animation (CSS transform).
 * @param {"excellent"|"tryagain"} type
 */
function showFeedback(type) {
    var el = type === "excellent"
        ? GCN.els.excellentOverlay
        : GCN.els.tryAgainOverlay;
    if (!el) return;

    /* Pop-in: scale from 0.5 → 1 with a spring easing */
    el.style.transformOrigin = "290px 395px";  /* pivot near centre of box */
    el.style.transform = "scale(0.5)";
    el.style.transition = "none";
    showEl(el);

    /* Trigger reflow so the initial scale is applied before transition */
    void el.getBoundingClientRect();

    el.style.transition = "transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1)";
    el.style.transform = "scale(1)";
}

/**
 * hideFeedback(type)
 * ───────────────────
 * Hides the specified feedback overlay with a quick scale-out.
 * @param {"excellent"|"tryagain"} type
 */
function hideFeedback(type) {
    var el = type === "excellent"
        ? GCN.els.excellentOverlay
        : GCN.els.tryAgainOverlay;
    if (!el) return;

    el.style.transition = "transform 0.18s ease-in";
    el.style.transform = "scale(0)";

    /* After animation: fully hide visibility */
    clearTimeout(el._hideTimer);
    el._hideTimer = setTimeout(function () { hideEl(el); }, 200);
}


/* ═══════════════════════════════════════════════════════════════
   §15  SCORE & PROGRESS DISPLAY
   ═══════════════════════════════════════════════════════════════ */

/**
 * updateScoreDisplay()
 * ─────────────────────
 * Updates the orange score digit next to the star icon.
 */
function updateScoreDisplay() {
    setTspanOrText(GCN.els.scoreText, String(GCN.score));
}

/**
 * updateProgressDisplay()
 * ────────────────────────
 * Updates the "X/25" progress counter in the top-right box.
 */
function updateProgressDisplay() {
    var value = GCN.completed + "/" + GCN.questions.length;
    setTspanOrText(GCN.els.progressText, value);
}

/**
 * setTspanOrText(el, value)
 * ──────────────────────────
 * Utility: set text on an SVG <text> element.
 * If the element contains a <tspan>, update the tspan's textContent.
 * @param {SVGElement|null} el
 * @param {string}          value
 */
function setTspanOrText(el, value) {
    if (!el) return;
    var tspan = el.querySelector("tspan");
    if (tspan) {
        tspan.textContent = value;
    } else {
        el.textContent = value;
    }
}


/* ═══════════════════════════════════════════════════════════════
   §16  GAME COMPLETE
   ═══════════════════════════════════════════════════════════════ */

/**
 * showCompleteOverlay()
 * ──────────────────────
 * Reveals the game-complete overlay, updating the final score message.
 */
function showCompleteOverlay() {
    var els = GCN.els;

    /* Update the dynamic score line */
    if (els.completeScoreText) {
        els.completeScoreText.textContent =
            "You earned " + GCN.score + " star" + (GCN.score !== 1 ? "s" : "") + "!";
    }

    showEl(els.completeOverlay);
}

/**
 * resetGame()
 * ────────────
 * Resets all state and restarts the game from question 1.
 * Called by the "Play Again" button on the complete overlay.
 */
function resetGame() {
    /* Reset all numeric state */
    GCN.score = 0;
    GCN.completed = 0;
    GCN.currentIndex = 0;
    GCN.typedAnswer = "";
    GCN.isAnswered = false;
    GCN.isShowingAnswer = false;

    /* Update score + progress displays */
    updateScoreDisplay();
    updateProgressDisplay();

    /* Hide the complete overlay */
    hideEl(GCN.els.completeOverlay);

    /* Load the very first question */
    loadQuestion(0);
}


/* ═══════════════════════════════════════════════════════════════
   §17  BOOTSTRAP
   ═══════════════════════════════════════════════════════════════ */
document.addEventListener("DOMContentLoaded", function () {
    init();
});
