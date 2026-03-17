document.addEventListener("DOMContentLoaded", () => {

    /* ── Fixed SVG x-centres of the 15 timeline buttons ── */
    const TIMELINE_CX = [286.79, 410.80, 537.08, 659.05, 784.40, 908.47, 1034.66, 1156.13, 1281.13, 1403.76, 1529.07, 1653.31, 1776.40, 1902.47, 2025.78];
    const TIMELINE_IDS = ["timeline-btn1", "timeline-btn2", "timeline-btn3", "timeline-btn4", "timeline-btn5", "timeline-btn6", "timeline-btn7", "timeline-btn8", "timeline-btn9", "timeline-btn10", "timeline-btn11", "timeline-btn12", "timeline-btn13", "timeline-btn14", "timeline-btn15"];
    const Q_ORIGIN_CX = 1076; // original SVG x of Q-marker group

    /* ── Dynamic line values (updated per question) ── */
    let currentLineValues = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70];
    let correctAnim, incorrectAnim;

    /* ── Question bank ── */
    const ALL_QUESTIONS = [
        // 2-digit • round to 5
        { number: 32, roundTo: 5, answer: 30, digits: 2, hint: "32 → 30 is 2 steps away, 35 is 3 steps. Pick 30!" },
        { number: 43, roundTo: 5, answer: 45, digits: 2, hint: "43 → 40 is 3 steps away, 45 is 2 steps. Pick 45!" },
        { number: 57, roundTo: 5, answer: 55, digits: 2, hint: "57 → 55 is 2 steps away, 60 is 3 steps. Pick 55!" },
        { number: 68, roundTo: 5, answer: 70, digits: 2, hint: "68 → 65 is 3 steps away, 70 is 2 steps. Pick 70!" },
        // 2-digit • round to 10
        { number: 32, roundTo: 10, answer: 30, digits: 2, hint: "32 → 30 is 2 steps away, 40 is 8 steps. Pick 30!" },
        { number: 47, roundTo: 10, answer: 50, digits: 2, hint: "47 → 40 is 7 steps away, 50 is 3 steps. Pick 50!" },
        { number: 63, roundTo: 10, answer: 60, digits: 2, hint: "63 → 60 is 3 steps away, 70 is 7 steps. Pick 60!" },
        { number: 25, roundTo: 10, answer: 30, digits: 2, hint: "25 is exactly halfway — we always round UP to 30!" },
        { number: 54, roundTo: 10, answer: 50, digits: 2, hint: "54 → 50 is 4 steps away, 60 is 6 steps. Pick 50!" },
        { number: 37, roundTo: 10, answer: 40, digits: 2, hint: "37 → 30 is 7 steps away, 40 is 3 steps. Pick 40!" },
        { number: 18, roundTo: 10, answer: 20, digits: 2, hint: "18 → 10 is 8 steps away, 20 is 2 steps. Pick 20!" },
        // 3-digit • round to 10
        { number: 134, roundTo: 10, answer: 130, digits: 3, hint: "134 → 130 is 4 steps away, 140 is 6 steps. Pick 130!" },
        { number: 267, roundTo: 10, answer: 270, digits: 3, hint: "267 → 260 is 7 steps away, 270 is 3 steps. Pick 270!" },
        { number: 345, roundTo: 10, answer: 350, digits: 3, hint: "345 is exactly halfway — we round UP to 350!" },
        { number: 428, roundTo: 10, answer: 430, digits: 3, hint: "428 → 420 is 8 steps away, 430 is 2 steps. Pick 430!" },
        { number: 183, roundTo: 10, answer: 180, digits: 3, hint: "183 → 180 is 3 steps away, 190 is 7 steps. Pick 180!" },
        // 3-digit • round to 100
        { number: 347, roundTo: 100, answer: 300, digits: 3, hint: "347 → 300 is 47 away, 400 is 53 away. Pick 300!" },
        { number: 682, roundTo: 100, answer: 700, digits: 3, hint: "682 → 600 is 82 away, 700 is 18 away. Pick 700!" },
        { number: 173, roundTo: 100, answer: 200, digits: 3, hint: "173 → 100 is 73 away, 200 is 27 away. Pick 200!" },
        { number: 450, roundTo: 100, answer: 500, digits: 3, hint: "450 is exactly halfway — we round UP to 500!" },
        { number: 234, roundTo: 100, answer: 200, digits: 3, hint: "234 → 200 is 34 away, 300 is 66 away. Pick 200!" },
        // 4-digit • round to 100
        { number: 3247, roundTo: 100, answer: 3200, digits: 4, hint: "3247 → 3200 is 47 away, 3300 is 53 away. Pick 3200!" },
        { number: 4683, roundTo: 100, answer: 4700, digits: 4, hint: "4683 → 4600 is 83 away, 4700 is 17 away. Pick 4700!" },
        { number: 1472, roundTo: 100, answer: 1500, digits: 4, hint: "1472 → 1400 is 72 away, 1500 is 28 away. Pick 1500!" },
        { number: 2350, roundTo: 100, answer: 2400, digits: 4, hint: "2350 is exactly halfway — we round UP to 2400!" },
        // 4-digit • round to 1000
        { number: 2347, roundTo: 1000, answer: 2000, digits: 4, hint: "2347 → 2000 is 347 away, 3000 is 653 away. Pick 2000!" },
        { number: 7683, roundTo: 1000, answer: 8000, digits: 4, hint: "7683 → 7000 is 683 away, 8000 is 317 away. Pick 8000!" },
        { number: 4500, roundTo: 1000, answer: 5000, digits: 4, hint: "4500 is exactly halfway — we round UP to 5000!" },
        { number: 6182, roundTo: 1000, answer: 6000, digits: 4, hint: "6182 → 6000 is 182 away, 7000 is 818 away. Pick 6000!" },
    ];

    /* ── State ── */
    let state = { selectedDigits: "all", selectedRound: "all", currentQ: null, answered: false, vehicle: "car" };

    const $ = id => document.getElementById(id);
    function setVisible(id, show) { const e = $(id); if (e) e.style.display = show ? "" : "none"; }
    function triggerAnim(id, anim) {
        const e = $(id); if (!e) return;
        e.style.display = "";
        e.style.animation = "none"; void e.offsetWidth;
        e.style.animation = anim;
    }
    if (typeof lottie !== "undefined") {
        correctAnim = lottie.loadAnimation({
            container: $("correct-anim-container"),
            renderer: "svg",
            loop: false,
            autoplay: false,
            path: "./assets/animation/correct-confetti-anim.json"
        });
        incorrectAnim = lottie.loadAnimation({
            container: $("incorrect-anim-container"),
            renderer: "svg",
            loop: false,
            autoplay: false,
            path: "./assets/animation/incorrect-cross-anim.json"
        });
    }


    /* ── Get Timeline-numbers <text> elements sorted by x ── */
    function getTimelineTexts() {
        const g = $("Timeline-numbers"); if (!g) return [];
        return Array.from(g.querySelectorAll("text")).sort((a, b) => {
            const x = el => { const m = (el.getAttribute("transform") || "").match(/translate\(([^,\s]+)/); return m ? parseFloat(m[1]) : 0; };
            return x(a) - x(b);
        });
    }

    /* ── Compute 15 tick values centred around answer ── */
    function computeLineValues(q) {
        const step = q.roundTo;
        const startVal = Math.max(0, q.answer - 7 * step);
        return Array.from({ length: 15 }, (_, i) => startVal + i * step);
    }

    /* Update text labels on number line – centred & sized to fit */
    function updateNumberLine(values) {
        currentLineValues = values;

        // Circle CY alternates: even-index buttons sit lower, odd sit higher
        const circleY = (i) => (i % 2 === 0) ? 631.76 : 577.65;

        // Font size shrinks as numbers get longer so they stay inside the circle
        const maxLen = Math.max(...values.map(v => String(v).length));
        // Refined font sizes for yellow circles (Diameter 96):
        const fontSize = maxLen <= 2 ? 46 : maxLen === 3 ? 38 : 32;

        getTimelineTexts().forEach((el, i) => {
            if (i >= values.length) return;
            const val = values[i];

            // Update text content
            let ts = el.querySelector("tspan");
            if (!ts) {
                ts = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
                el.appendChild(ts);
            }
            ts.textContent = String(val);
            ts.setAttribute("x", "0");
            ts.setAttribute("y", "0");

            // Centre the <text> element exactly on its circle
            el.setAttribute("transform", `translate(${TIMELINE_CX[i]} ${circleY(i)})`);
            el.setAttribute("text-anchor", "middle");
            el.setAttribute("dominant-baseline", "middle");
            el.setAttribute("font-size", String(fontSize));
            el.setAttribute("font-weight", "bold");
            el.setAttribute("font-family", "Roboto-Bold, Roboto");
        });
    }


    /* ── Slide Q-marker to correct SVG position ── */
    function positionQMarker(number) {
        const [minVal, maxVal] = [currentLineValues[0], currentLineValues[14]];
        const [minX, maxX] = [TIMELINE_CX[0], TIMELINE_CX[14]];
        const frac = maxVal > minVal ? Math.max(0, Math.min(1, (number - minVal) / (maxVal - minVal))) : 0.5;
        const dx = minX + frac * (maxX - minX) - Q_ORIGIN_CX;
        ["Q-marker", "Q-line", "Q-circle", "Q-numbers", "Car", "Bike"].forEach(id => {
            const el = $(id); if (!el) return;
            el.style.transition = "transform 0.55s cubic-bezier(.25,.46,.45,.94)";
            el.style.transform = `translateX(${dx}px)`;
        });
    }

    /* ── Update instruction text (fix overlap by repositioning 3rd text) ── */
    function updateIText(num, roundTo) {
        const el = $("i-text"); if (!el) return;
        const texts = el.querySelectorAll("text");
        if (texts.length < 3) return;
        const numStr = String(num);
        const roundLabel = { 5: "fives", 10: "tens", 50: "fifties", 100: "hundreds", 1000: "thousands" }[roundTo] || String(roundTo);
        // Text[1] = bold number
        const t1 = texts[1].querySelector("tspan") || texts[1];
        t1.textContent = numStr;
        // Text[2] x-position: starts after number. ~23px per digit at font-size:40
        const newX = 1189.25 + numStr.length * 23 + 6;
        texts[2].setAttribute("transform", `translate(${newX} 173.67)`);
        texts[2].textContent = "";
        const ts = document.createElementNS("http://www.w3.org/2000/svg", "tspan");
        ts.setAttribute("x", "0"); ts.setAttribute("y", "0");
        ts.textContent = ` to nearest ${roundLabel}.`;
        texts[2].appendChild(ts);
    }

    /* ── Reset all button colours ── */
    function resetButtons() {
        TIMELINE_IDS.forEach(id => {
            const el = $(id); if (!el) return;
            el.querySelectorAll("circle").forEach(c => {
                c.style.fill = "#fcee21"; c.style.stroke = "#f99f00";
                c.style.animation = ""; c.style.filter = "";
            });
        });
    }

    function animateButton(btnId, type) {
        const el = $(btnId); if (!el) return;
        const c = el.querySelector("circle"); if (!c) return;
        if (type === "correct") {
            c.style.fill = "#56db00"; c.style.stroke = "#2a7a00";
            c.style.animation = "pulse-correct 0.55s ease forwards";
            c.style.filter = "drop-shadow(0 0 12px #56db00)";
        } else {
            c.style.fill = "#ff4444"; c.style.stroke = "#bb0000";
            c.style.animation = "shake-btn 0.45s ease";
            c.style.filter = "drop-shadow(0 0 8px #ff4444)";
            setTimeout(() => { if (c.style.fill === "rgb(255, 68, 68)") { c.style.fill = "#fcee21"; c.style.stroke = "#f99f00"; c.style.animation = ""; c.style.filter = ""; } }, 520);
        }
    }

    /* ── Correct popup (incl Layer_27 — the extra floating X) ── */
    /* ── Correct popup functionality ── */
    function showCorrectPopup(q) {
        hideHintPopup();
        const group = $("correct-popup-group");
        const overlay = $("popup-overlay");
        if (!group || !overlay) return;

        const el = $("answer-text");
        if (el) {
            const ts = el.querySelector("tspan");
            if (ts) ts.textContent = `${q.answer} is the nearest multiple of ${q.roundTo} to ${q.number}.`;
        }

        overlay.style.display = "";
        const btnContainer = $("timeline-btns-container");
        if (btnContainer) btnContainer.classList.add("answered");
        triggerAnim("correct-popup-group", "simpleZoom 0.3s ease-out both");
        if (correctAnim) {
            correctAnim.goToAndPlay(0, true);
        }
    }

    function hideCorrectPopup() {
        setVisible("correct-popup-group", false);
        setVisible("popup-overlay", false);
    }

    /* ── Hint (wrong-answer) popup ── */
    const HINT_ELS = ["hint-popup", "hint-heading", "quick-hint", "hint-text", "hint-cross-mark"];

    // Store original arrow x values so we never accumulate shifts
    const ARROW_ORIG = {
        "arrow": [[664.85, 534.16, 689.85, 534.16], [683.85, 541.16, 690.85, 533.16], [690.85, 534.16, 682.85, 527.16]],
        "arrow-2": [[664.85, 594.16, 689.85, 594.16], [683.85, 601.16, 690.85, 593.16], [690.85, 594.16, 682.85, 587.16]]
    };

    function showHintPopup(q, clicked) {
        hideCorrectPopup();
        hideHelp(false); // Hide help popup without hiding overlay

        const group = $("hint-popup-group");
        const overlay = $("popup-overlay");
        if (!group || !overlay) return;

        // Reset previous vehicle clones and visibility
        document.querySelectorAll(".hint-car-clone").forEach(el => el.remove());
        setVisible("popup-car", false);
        setVisible("popup-bike", false);

        // ── heading ──
        const h = $("hint-heading");
        if (h) { const ts = h.querySelectorAll("tspan"); if (ts.length >= 5) ts[4].textContent = `ou clicked ${clicked}.`; }

        // ── compute distances ──
        const lower = Math.floor(q.number / q.roundTo) * q.roundTo;
        const upper = lower + q.roundTo;
        const dLow = q.number - lower;
        const dHigh = upper - q.number;

        // ── hint text lines ──
        const ht = $("hint-text");
        if (ht) {
            const lines = ht.querySelectorAll("text");
            const setText = (el, txt) => {
                if (!el) return;
                let ts = el.querySelector("tspan");
                if (!ts) { ts = document.createElementNS("http://www.w3.org/2000/svg", "tspan"); el.appendChild(ts); }
                ts.textContent = txt;
            };
            setText(lines[0], String(q.number));
            setText(lines[1], ` ${lower} = ${dLow} step${dLow !== 1 ? "s" : ""}`);
            setText(lines[2], String(q.number));
            setText(lines[3], ` ${upper} = ${dHigh} step${dHigh !== 1 ? "s" : ""}`);
            if (lines[4]) setText(lines[4], `"Pick the number that's fewer steps away!"`);
        }

        // ── reposition arrows using ORIGINAL coords + fresh delta ──
        const numDigits = String(q.number).length;
        const lowerStr = String(lower);
        const dLowStr = String(dLow) + (dLow !== 1 ? " steps" : " step");
        const higherStr = String(upper);
        const dHighStr = String(dHigh) + (dHigh !== 1 ? " steps" : " step");

        // Arrow starts right after the initial number
        // ── reposition arrows ──
        const ARROW_ORIG = {
            "arrow": [[664.85, 534.16, 689.85, 534.16], [683.85, 541.16, 690.85, 533.16], [690.85, 534.16, 682.85, 527.16]],
            "arrow-2": [[664.85, 594.16, 689.85, 594.16], [683.85, 601.16, 690.85, 593.16], [690.85, 594.16, 682.85, 587.16]]
        };
        const arrowX = 623.98 + numDigits * 17 + 10;
        const textAfterArrowX = arrowX + 35;
        if (ht) {
            const lines = ht.querySelectorAll("text");
            if (lines[1]) lines[1].setAttribute("transform", `translate(${textAfterArrowX} 545.77)`);
            if (lines[3]) lines[3].setAttribute("transform", `translate(${textAfterArrowX} 605.77)`);
        }
        ["arrow", "arrow-2"].forEach(arrowId => {
            const arrowEl = document.getElementById(arrowId);
            if (!arrowEl) return;
            const origLines = ARROW_ORIG[arrowId];
            const lineEls = arrowEl.querySelectorAll("line");
            const delta = arrowX - 664.85;
            lineEls.forEach((line, i) => {
                if (!origLines[i]) return;
                line.setAttribute("x1", origLines[i][0] + delta);
                line.setAttribute("y1", origLines[i][1]);
                line.setAttribute("x2", origLines[i][2] + delta);
                line.setAttribute("y2", origLines[i][3]);
            });
        });

        // ── cars ──
        const sourceId = state.vehicle === "car" ? "popup-car" : "popup-bike";
        const source = $(sourceId);

        if (source) {
            const isCar = state.vehicle === "car";
            const iconW = isCar ? 78 : 56;
            // popup right edge ≈ 1708 SVG units
            const maxRight = 1700;
            // car origin in SVG: popup-car leftmost x ≈ 866
            const originX = isCar ? 866 : 905;

            const lowerTextLen = (1 + lowerStr.length + 3 + dLowStr.length) * 17;
            const upperTextLen = (1 + higherStr.length + 3 + dHighStr.length) * 17;
            const carsStartX_row1 = textAfterArrowX + lowerTextLen + 10;
            const carsStartX_row2 = textAfterArrowX + upperTextLen + 10;

            const drawRow = (count, yOffset, dotsY, rowStartX) => {
                if (count <= 0) return;
                const maxFit = Math.max(1, Math.floor((maxRight - rowStartX) / iconW));
                const actualShow = count <= maxFit ? count : Math.min(count, maxFit - 1); // leave 1 slot for dots if needed

                for (let i = 0; i < actualShow; i++) {
                    const clone = source.cloneNode(true);
                    clone.removeAttribute("id");
                    clone.classList.add("hint-car-clone");
                    clone.style.display = "";
                    // Remove clip-path refs so clones render correctly
                    clone.querySelectorAll("[clip-path]").forEach(el => el.removeAttribute("clip-path"));
                    clone.setAttribute("transform",
                        `translate(${rowStartX - originX + i * iconW}, ${isCar ? yOffset : yOffset - 60})`);
                    group.appendChild(clone);
                }

                if (count > maxFit) {
                    const dots = document.createElementNS("http://www.w3.org/2000/svg", "text");
                    dots.setAttribute("x", String(rowStartX + actualShow * iconW));
                    dots.setAttribute("y", String(dotsY));
                    dots.classList.add("hint-car-clone");
                    dots.setAttribute("fill", "#333");
                    dots.setAttribute("font-size", "34");
                    dots.setAttribute("font-weight", "bold");
                    dots.textContent = "...";
                    group.appendChild(dots);
                }
            };

            drawRow(dLow, -8, 548, carsStartX_row1);
            drawRow(dHigh, 52, 608, carsStartX_row2);
        }

        overlay.style.display = "";
        triggerAnim("hint-popup-group", "popZoom 0.4s ease both");
        if (incorrectAnim) {
            incorrectAnim.goToAndPlay(0, true);
        }
    }

    function hideHintPopup() {
        setVisible("hint-popup-group", false);
        setVisible("popup-overlay", false);
        document.querySelectorAll(".hint-car-clone").forEach(el => el.remove());
    }
    // 👇 ADD THIS HERE
    const hintCross = $("hint-cross-mark");

    if (hintCross) {
        hintCross.style.cursor = "pointer";
        hintCross.addEventListener("click", (e) => {
            e.stopPropagation();
            hideHintPopup();
        });
    }

    /* ── Generate a new question ── */
    function pickQuestion() {
        let pool = ALL_QUESTIONS.filter(q =>
            (state.selectedDigits === "all" || q.digits === state.selectedDigits) &&
            (state.selectedRound === "all" || q.roundTo === state.selectedRound)
        );
        if (!pool.length) pool = ALL_QUESTIONS;
        const others = pool.filter(q => q !== state.currentQ);
        const src = others.length ? others : pool;
        return src[Math.floor(Math.random() * src.length)];
    }

    function generateQuestion() {
        resetButtons(); hideCorrectPopup(); hideHintPopup();
        const btnContainer = $("timeline-btns-container");
        if (btnContainer) btnContainer.classList.remove("answered");
        state.currentQ = pickQuestion(); state.answered = false;
        const q = state.currentQ;
        console.log(q);
        // Q-circle number - bold and slightly larger if it's 2 digits
        const qn = $("Q-numbers");
        if (qn) {
            const ts = qn.querySelector("tspan");
            if (ts) ts.textContent = String(q.number);
            const txt = qn.querySelector("text");
            if (txt) {
                const numLen = String(q.number).length;
                const qSize = numLen <= 2 ? 42 : numLen === 3 ? 36 : 30;
                txt.setAttribute("font-size", String(qSize));
                txt.setAttribute("font-weight", "bold");
                txt.setAttribute("font-family", "Roboto-Bold, Roboto");
            }
        }
        console.log(qn);
        // Instruction text
        updateIText(q.number, q.roundTo);
        console.log(updateIText);
        // Dynamic number line
        const lineVals = computeLineValues(q);
        updateNumberLine(lineVals);
        console.log(lineVals);
        // Slide marker
        positionQMarker(q.number);
        console.log(positionQMarker);
    }

    /* ── Timeline button click handlers ── */
    TIMELINE_IDS.forEach((btnId, i) => {
        const el = $(btnId); if (!el) return;
        el.style.cursor = "pointer";
        el.addEventListener("click", () => {
            if (state.answered || !state.currentQ) return;
            const clicked = currentLineValues[i];
            const q = state.currentQ;
            if (clicked === q.answer) {
                state.answered = true;
                animateButton(btnId, "correct");
                setTimeout(() => showCorrectPopup(q), 380);
            } else {
                animateButton(btnId, "wrong");
                setTimeout(() => showHintPopup(q, clicked), 320);
            }
        });
    });

    /* ── Popup Close Handlers ── */
    [$("hint-popup-group"), $("hint-cross-mark")].forEach(el => {
        if (el) { el.style.cursor = "pointer"; el.addEventListener("click", hideHintPopup); }
    });
    [$("correct-popup-group"), $("answer-cross-mark")].forEach(el => {
        if (el) { el.style.cursor = "pointer"; el.addEventListener("click", hideCorrectPopup); }
    });

    /* ── New Number button ── */
    const newBtn = $("btn-new-number");
    if (newBtn) {
        console.log(newBtn);
        newBtn.style.cursor = "pointer";
        newBtn.addEventListener("click", () => {
            console.log("New Number button clicked");
            // newBtn.style.transform = "scale(0.95)";
            // setTimeout(() => newBtn.style.transform = "scale(1)", 200);
            generateQuestion();
        });
        console.log(newBtn.value);
    }

    /* ── Help panel logic ── */
    function hideHelp() {
        setVisible("help-popup-group", false);
        setVisible("popup-overlay", false);
    }
    function showHelp() {
        hideHintPopup();
        hideCorrectPopup();
        const group = $("help-popup-group");
        const overlay = $("popup-overlay");
        if (group && overlay) {
            overlay.style.display = "";
            triggerAnim("help-popup-group", "fadeInUp 0.35s ease both");
        }
    }
    [$("help-btn"), $("help-btn-text")].forEach(el => { if (el) { el.style.cursor = "pointer"; el.addEventListener("click", showHelp); } });
    [$("help-popup-group"), $("help-cross-btn")].forEach(el => { if (el) { el.style.cursor = "pointer"; el.addEventListener("click", hideHelp); } });

    /* ── Vehicle selector ── */
    function selectVehicle(type) {
        state.vehicle = type;
        setVisible("Car", type === "car");
        setVisible("Bike", type === "bike");
        // Slide highlight rect
        const rect = $("selected-vechle");
        if (rect) { rect.style.transform = type === "car" ? "translateX(0)" : "translateX(131px)"; rect.style.transition = "transform 0.3s ease"; }
    }
    ["car-btn", "car-text"].forEach(id => {
        const el = $(id); if (!el) return;
        el.style.cursor = "pointer";
        el.addEventListener("click", () => selectVehicle("car"));
    });
    ["bike-btn", "bike-text"].forEach(id => {
        const el = $(id); if (!el) return;
        el.style.cursor = "pointer";
        el.addEventListener("click", () => selectVehicle("bike"));
    });

    /* ── Digit dropdown ── */
    const dd1 = $("drop-down1"), dd1opt = $("drop-down1-option"), dd1txt = $("drop-down1-text");
    function toggleDD1(show) { if (show) triggerAnim("drop-down1-option", "slideDown 0.2s ease both"); else setVisible("drop-down1-option", false); }
    if (dd1) { dd1.style.cursor = "pointer"; dd1.addEventListener("click", e => { e.stopPropagation(); toggleDD1(dd1opt && dd1opt.style.display === "none"); setVisible("drop-down2-option", false); }); }

    const DIGIT_OPTS = [
        { id: "Group_6067", label: "2 Digits", value: 2 },
        { id: "Group_1581", label: "3 Digits", value: 3 },
        { id: "Group_1582", label: "4 Digits", value: 4 },
    ];
    DIGIT_OPTS.forEach(({ id, label, value }) => {
        const row = $(id); if (!row) return;
        row.style.cursor = "pointer";
        row.addEventListener("click", e => {
            e.stopPropagation();
            state.selectedDigits = value;
            const t = dd1txt && dd1txt.querySelector("tspan"); if (t) t.textContent = label;
            DIGIT_OPTS.forEach(({ id: rid }) => { const r = $(rid); if (r) { const rc = r.querySelector("rect"); if (rc) rc.setAttribute("fill", rid === id ? "#2196f3" : "#f2f2f2"); } });
            setVisible("drop-down1-option", false);
            generateQuestion();
        });
    });

    /* ── Round-to dropdown ── */
    const dd2 = $("drop-down2"), dd2opt = $("drop-down2-option"), dd2txt = $("drop-down2-text");
    function toggleDD2(show) { if (show) triggerAnim("drop-down2-option", "slideDown 0.2s ease both"); else setVisible("drop-down2-option", false); }
    if (dd2) { dd2.style.cursor = "pointer"; dd2.addEventListener("click", e => { e.stopPropagation(); toggleDD2(dd2opt && dd2opt.style.display === "none"); setVisible("drop-down1-option", false); }); }

    // Re-label 3rd duplicate option as "1000"
    const dup = $("Triangle2"); if (dup) { const ts = dup.querySelector("tspan"); if (ts) ts.textContent = "Round to nearest: 1000"; }
    const ROUND_OPTS = [
        { id: "Group_60671", label: "Round to nearest: 10", value: 10 },
        { id: "Group_15811", label: "Round to nearest: 50", value: 50 },
        { id: "Group_15821", label: "Round to nearest: 100", value: 100 },
        { id: "Group_15822", label: "Round to nearest: 1000", value: 1000 },
    ];
    ROUND_OPTS.forEach(({ id, label, value }) => {
        const row = $(id); if (!row) return;
        row.style.cursor = "pointer";
        row.addEventListener("click", e => {
            e.stopPropagation();
            state.selectedRound = value;
            const t = dd2txt && dd2txt.querySelector("tspan"); if (t) t.textContent = label;
            ROUND_OPTS.forEach(({ id: rid }) => { const r = $(rid); if (r) { const rc = r.querySelector("rect"); if (rc) rc.setAttribute("fill", rid === id ? "#2196f3" : "#f2f2f2"); } });
            setVisible("drop-down2-option", false);
            generateQuestion();
        });
    });

    document.addEventListener("click", () => { setVisible("drop-down1-option", false); setVisible("drop-down2-option", false); });

    /* ── Initialise ── */
    function init() {
        setVisible("popup-overlay", false);
        setVisible("correct-popup-group", false);
        setVisible("hint-popup-group", false);
        setVisible("help-popup-group", false);
        setVisible("popup-car", false);
        setVisible("popup-bike", false);
        setVisible("drop-down1-option", false);
        setVisible("drop-down2-option", false);
        selectVehicle("car");
        generateQuestion();
    }

    init();
});
