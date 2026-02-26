document.addEventListener("DOMContentLoaded", () => {

    // ─────────────────────────────────────────────
    //  UTILITIES
    // ─────────────────────────────────────────────
    const $ = (id) => document.getElementById(id);
    const $q = (sel, ctx) => (ctx || document).querySelector(sel);
    const $qa = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

    const show = (el) => { if (el) el.style.display = "block"; };
    const hide = (el) => { if (el) el.style.display = "none"; };
    const ptr = (el) => { if (el) el.style.cursor = "pointer"; };

    // ─────────────────────────────────────────────
    //  LOTTIE — overlay on the emoji inside the popup
    // ─────────────────────────────────────────────
    const lottieWrap = document.createElement("div");
    Object.assign(lottieWrap.style, {
        position: "fixed",
        width: "130px", height: "130px",
        pointerEvents: "none", zIndex: "9999", display: "none",
        overflow: "hidden" // Prevent repeating/scroll issues
    });
    document.body.appendChild(lottieWrap);
    let _anim = null;
    let _staticEmojiEl = null;

    function stopLottie() {
        if (_anim) { try { _anim.destroy(); } catch (e) { } _anim = null; }
        lottieWrap.style.display = "none";
        lottieWrap.innerHTML = ""; // Clear SVG to prevent duplicates
        if (_staticEmojiEl) { _staticEmojiEl.style.visibility = ""; _staticEmojiEl = null; }
    }

    function playLottie(name, targetEl) {
        stopLottie();

        // Find the emoji face group inside the targetEl (group with many paths = face)
        if (targetEl) {
            const allGroups = targetEl.querySelectorAll("g");
            for (const g of allGroups) {
                // The emoji group has 5+ path children directly
                const paths = g.querySelectorAll(":scope > path");
                if (paths.length >= 5) {
                    _staticEmojiEl = g;
                    break;
                }
            }
            // Also try clip-path groups (emoji is often wrapped in a clipPath group)
            if (!_staticEmojiEl) {
                const clipG = targetEl.querySelector("g[clip-path]");
                if (clipG) _staticEmojiEl = clipG;
            }

            if (_staticEmojiEl) {
                // Get the bounding rect of the emoji itself and overlay Lottie there
                const eRect = _staticEmojiEl.getBoundingClientRect();
                if (eRect.width > 0 && eRect.height > 0) {
                    _staticEmojiEl.style.visibility = "hidden";
                    lottieWrap.style.left = (eRect.left + eRect.width / 2 - 65) + "px";
                    lottieWrap.style.top = (eRect.top + eRect.height / 2 - 65) + "px";
                } else {
                    // Emoji not visible (popup may be hidden) — center on popup
                    const pRect = targetEl.getBoundingClientRect();
                    lottieWrap.style.left = (pRect.left + pRect.width / 2 - 65) + "px";
                    lottieWrap.style.top = (pRect.top + 10) + "px";
                    _staticEmojiEl = null;
                }
            } else {
                // No emoji found — center on popup
                const pRect = targetEl.getBoundingClientRect();
                lottieWrap.style.left = (pRect.left + pRect.width / 2 - 65) + "px";
                lottieWrap.style.top = (pRect.top + 10) + "px";
            }
        } else {
            lottieWrap.style.left = (window.innerWidth / 2 - 65) + "px";
            lottieWrap.style.top = (window.innerHeight / 2 - 65) + "px";
        }

        lottieWrap.style.display = "block";
        if (typeof lottie === "undefined") {
            console.warn("Lottie not loaded");
            return;
        }
        _anim = lottie.loadAnimation({
            container: lottieWrap, renderer: "svg",
            loop: true, autoplay: true, // User requested looping until action
            path: `./assets/animation/${name}.json`
        });
        // Remove completion listener since it loops infinitely now
    }

    // ─────────────────────────────────────────────
    //  SCREEN REGISTRY
    // ─────────────────────────────────────────────
    const S = {
        intro: $("intro-panel"),
        menu: $("btn-menu"),

        lim1s1: {
            base: $("limitation01-sc01-base-screen"),
            cards: $("limitation01-sc01-cards"),
            wrong: $("limitation01-sc01-incorrect"),
            right: $("limitation01-sc01-correct"),
            end: $("limitation01-sc01-end-feedback"),
        },
        lim1s2: {
            base: $("limitation01-sc02-base-screen"),
            cards: $("limitation01-sc02-cards"),
            wrong: $("limitation01-sc02-incorrect"),
            right: $("limitation01-sc02-correct"),
            end: $("limitation01-sc02-end-feedback"),
        },

        lim2s1: {
            base: $("limitation02-sc01-base-screen"),
            cards: $("limitation02-sc01-cards"),
            c01: $("limitation02-sc01-correct-01"),
            c02: $("limitation02-sc01-correct-02"),
            end: $("limitation02-sc01-end-feedback"),
        },
        lim2s2: {
            base: $("limitation02-sc02-base-screen"),
            c01: $("limitation02-sc02-correct-01"),
            c02: $("limitation02-sc02-correct-02"),
            end: $("limitation02-sc02-end-feedback"),
        },

        lim3s1: {
            base: $("limitation03-sc01-base-screen"),
            end: $("limitation03-sc01-end-feedback"),
        },
        // lim3s2 HTML screen not yet in index.html — gracefully null
        lim3s2: { base: null, end: null },

        conclusion: $("conclusion-base-screen"),
        solution: $("solution-popup"),
        insights: $("insights-popup"),
    };

    // ─────────────────────────────────────────────
    //  HIDE ALL SCREENS
    // ─────────────────────────────────────────────
    function hideAll() {
        [
            S.intro, S.menu,
            S.lim1s1.base, S.lim1s1.cards, S.lim1s1.wrong, S.lim1s1.right, S.lim1s1.end,
            S.lim1s2.base, S.lim1s2.cards, S.lim1s2.wrong, S.lim1s2.right, S.lim1s2.end,
            S.lim2s1.base, S.lim2s1.cards, S.lim2s1.c01, S.lim2s1.c02, S.lim2s1.end,
            S.lim2s2.base, S.lim2s2.c01, S.lim2s2.c02, S.lim2s2.end,
            S.lim3s1.base, S.lim3s1.end,
            S.conclusion, S.solution, S.insights,
        ].forEach(hide);
    }

    hideAll();
    show(S.intro);

    // ─────────────────────────────────────────────
    //  HELPERS
    // ─────────────────────────────────────────────
    function onClick(id, fn) {
        const el = $(id);
        if (!el) return;
        ptr(el);
        el.addEventListener("click", fn);
    }

    function goTo(sc) {
        if (!sc || !sc.base) return;
        stopLottie();
        hideAll();
        show(sc.base);
        if (sc.cards) show(sc.cards);
    }

    // Make ALL descendants of container have cursor:pointer
    function makeCardsClickable(container) {
        if (!container) return;
        container.querySelectorAll("*").forEach(el => { el.style.cursor = "pointer"; });
        container.style.cursor = "pointer";
    }

    /*
     * findCardAndTrader
     * -----------------
     * Finds which trader was clicked anywhere inside the cards container,
     * and returns the INDIVIDUAL card group (not the wrapper group).
     *
     * The SVG structure is:
     *   container > Group_1301 (wrapper for ALL cards) > [individual card groups]
     *
     * Strategy:
     *   1. Scan the entire container for each known trader name
     *   2. When found, walk UP from that named element to find its CARD group
     *      (the group that contains both the background rect AND the trader name)
     *   3. The card group is identified as the group that contains a <rect> sibling
     */
    function findCardAndTrader(e, container, allNames) {
        if (!container) return null;

        // Step 1: find which named element (if any) is an ancestor of e.target
        let el = e.target;
        let clickedTrader = null;
        while (el && el !== container) {
            if (el.id && allNames.includes(el.id)) { clickedTrader = el; break; }
            el = el.parentElement;
        }

        // Step 2: if we didn't find a named ancestor, scan ALL named elements
        // to find which one's card bounding rect contains the click point
        if (!clickedTrader) {
            const clickX = e.clientX, clickY = e.clientY;
            for (const name of allNames) {
                const namedEl = container.querySelector("#" + CSS.escape(name));
                if (!namedEl) continue;
                // Walk up to find the card group for this named element
                const cardG = getCardGroup(namedEl, container);
                if (!cardG) continue;
                const r = cardG.getBoundingClientRect();
                if (clickX >= r.left && clickX <= r.right && clickY >= r.top && clickY <= r.bottom) {
                    return { traderId: name, topCard: cardG };
                }
            }
            return null;
        }

        // Step 3: walk up from the named element to find the enclosing card group
        const cardG = getCardGroup(clickedTrader, container);
        return { traderId: clickedTrader.id, topCard: cardG || clickedTrader };
    }

    /*
     * getCardGroup
     * ------------
     * Instead of relying on fragile SVG DOM traversal (where groups might be 
     * cloned, nested unexpectedly, or share same bounding boxes originally),
     * we statically map trader names to their known primary card group ID.
     * This guarantees the correct yellow highlight is applied to the correct card.
     */
    function getCardGroup(namedEl, container) {
        if (!namedEl) return null;
        const id = namedEl.id || "";

        // Static map of trader -> specific card wrapper group ID
        // Deduced from HTML inspection of limitation01-sc01-cards and sc02 cards
        const cardMap = {
            "Maya": "Group_1281",
            "Amit": "Group_1292",
            "Omar": "Group_1293",
            "Sara": "Group_1294",
            "Priya": "Group_1295",
            "Shambu": "Group_1296",
            // Scenario 2 traders (Maria's scenario)
            "Cheenu": "Group_1281-3",
            "Paul": "Group_1292-2",
            "Raj": "Group_1293-2",
            "Fathima": "Group_1294-2",
            "Yuvi": "Group_1295-2",
            "Ivan": "Group_1296-2"
        };

        // Handle variations like "Maya-2" or "Ivan-2"
        const baseName = id.split("-")[0];
        const targetId = cardMap[baseName] || cardMap[id];

        if (targetId) {
            const group = container.querySelector("#" + CSS.escape(targetId));
            if (group) return group;
        }

        // Fallback: If not in map, just return immediate parent wrapper
        return namedEl.parentElement;
    }

    /*
     * setIncorrectMsg
     * ---------------
     * Updates the second line of the wrong popup's speech bubble text.
     * The popup has a <g> with id containing "Sorry" and two <text> children:
     *   Line 1: "Sorry, I don't need "
     *   Line 2: "fish. I want apples!" ← we update this tspan
     */
    function setIncorrectMsg(screenWrong, line2Text) {
        if (!screenWrong) return;

        // Try the known group ID pattern first (most reliable)
        const sorryGroup =
            screenWrong.querySelector('[id*="Sorry"]') ||
            screenWrong.querySelector('[data-name*="Sorry"]');

        if (sorryGroup) {
            const texts = sorryGroup.querySelectorAll("text");
            // The second <text> contains "fish. I want X!"
            const target = texts.length >= 2 ? texts[texts.length - 1] : texts[0];
            if (target) {
                const tspan = target.querySelector("tspan");
                if (tspan) { tspan.textContent = line2Text; return; }
            }
        }

        // Hard fallback: last red text in the popup
        const reds = screenWrong.querySelectorAll("text[fill='red']");
        if (reds.length > 0) {
            const t = reds[reds.length - 1].querySelector("tspan");
            if (t) t.textContent = line2Text;
        }
    }

    // Yellow highlight on the selected card
    let _lastClickedCard = null;
    function highlightCard(cardEl, on) {
        if (!cardEl) return;
        cardEl.style.filter = on ? "drop-shadow(0 0 12px #ffcc00) brightness(1.08)" : "";
    }
    function clearCardHighlight() {
        if (_lastClickedCard) { highlightCard(_lastClickedCard, false); _lastClickedCard = null; }
    }

    // ─────────────────────────────────────────────
    //  INTRO → MENU
    // ─────────────────────────────────────────────
    ["Enter", "Group_794-2"].forEach(id => onClick(id, () => {
        stopLottie();
        hideAll();
        show(S.menu);
    }));

    // Menu scenario buttons
    onClick("Group_1501", () => { clearCardHighlight(); goTo(S.lim1s1); });
    onClick("Group_1502", () => { clearCardHighlight(); goTo(S.lim1s2); });
    onClick("Group_1501-2", () => goTo(S.lim2s1));
    onClick("Group_1502-2", () => goTo(S.lim2s2));
    onClick("Group_1501-3", () => { resetLim3s1(); goTo(S.lim3s1); });
    onClick("Group_1502-3", () => { resetLim3s2(); if (S.lim3s2.base) goTo(S.lim3s2); });

    // Global back / home — also stop lottie
    onClick("Back", () => { stopLottie(); clearCardHighlight(); hideAll(); show(S.menu); });
    onClick("Group_1566", () => { stopLottie(); clearCardHighlight(); hideAll(); show(S.menu); });

    // ═══════════════════════════════════════════════════════════
    //  LIMITATION 1 — Double Coincidence of Wants
    // ═══════════════════════════════════════════════════════════

    // ── SCENARIO 1: Govind (Has Fish, Wants Wheat) ──────────────
    const lim1s1AllNames = ["Maya", "Maya-2", "Omar", "Amit", "Priya", "Priya-2", "Shambu", "Sara"];
    const lim1s1Correct = new Set(["Sara"]);
    const lim1s1Wants = {
        "Maya": "apples", "Maya-2": "apples",
        "Omar": "carrots",
        "Amit": "potatoes",
        "Priya": "wood", "Priya-2": "wood",
        "Shambu": "wheat",
    };

    makeCardsClickable(S.lim1s1.cards);

    /*
     * positionPopup
     * -------------
     * The XD design drew the wrong/right popups physically over Maya's card.
     * To show the popup over Omar/Priya/etc., we calculate the difference
     * between the clicked card's position and Maya's card's position in SVG space (getBBox),
     * and apply that as a CSS transform to the popup group.
     */
    function positionPopup(targetCard, popupGroup, baseCardId) {
        if (!targetCard || !popupGroup || !baseCardId) return;
        const baseCard = S.lim1s1.cards.querySelector("#" + CSS.escape(baseCardId));
        if (!baseCard) return;

        // Use getBBox instead of getBoundingClientRect because we are applying 
        // a transform inside the SVG. getBoundingClientRect gives screen space offsets 
        // which get multiplied incorrectly by the SVG scale.
        const targetBBox = targetCard.getBBox();
        const baseBBox = baseCard.getBBox();

        // However, SVG `getBBox` evaluates to the un-transformed local bounding box,
        // and we really want the difference in their global (within SVG) coordinates.
        // For groups that are siblings inside `limitation01-sc01-cards`, we can 
        // get their transform info or just get the Current Matrix:
        const targetMatrix = targetCard.getCTM();
        const baseMatrix = baseCard.getCTM();

        // If they are siblings or share the same parent coordinate space, this is robust:
        const targetX = targetMatrix.e + targetBBox.x;
        const targetY = targetMatrix.f + targetBBox.y;

        const baseX = baseMatrix.e + baseBBox.x;
        const baseY = baseMatrix.f + baseBBox.y;

        const dx = targetX - baseX;
        const dy = targetY - baseY;

        popupGroup.style.transform = `translate(${dx}px, ${dy}px)`;
        popupGroup.style.transformOrigin = "center";
    }

    if (S.lim1s1.cards) {
        S.lim1s1.cards.addEventListener("click", (e) => {
            const found = findCardAndTrader(e, S.lim1s1.cards, lim1s1AllNames);
            if (!found) return;
            const { traderId, topCard } = found;

            clearCardHighlight();
            _lastClickedCard = topCard;
            highlightCard(topCard, true);

            if (lim1s1Correct.has(traderId)) {
                hide(S.lim1s1.wrong);
                positionPopup(topCard, S.lim1s1.right, "Group_1281"); // Base is Maya
                show(S.lim1s1.right);
                playLottie("emoji_happy-star", S.lim1s1.right);
            } else {
                const want = lim1s1Wants[traderId] || "that";
                setIncorrectMsg(S.lim1s1.wrong, `fish. I want ${want}!"`);
                positionPopup(topCard, S.lim1s1.wrong, "Group_1281"); // Base is Maya
                show(S.lim1s1.wrong);
                playLottie("emoji-sad", S.lim1s1.wrong);
            }
        });
    }

    // "Try another trader" → stop lottie, clear highlight, hide wrong popup
    onClick("Try_another_trader", () => { stopLottie(); clearCardHighlight(); hide(S.lim1s1.wrong); });

    // Fair / Unfair Trade → stop lottie + show end
    ["Fair_Trade", "Unfair_Trade"].forEach(id => {
        const el = $(id);
        if (el) {
            ptr(el);
            el.addEventListener("click", () => {
                stopLottie(); clearCardHighlight();
                hide(S.lim1s1.right);
                show(S.lim1s1.end);
            });
        }
    });

    // Continue sc1 → sc2
    onClick("Continue", () => { stopLottie(); clearCardHighlight(); goTo(S.lim1s2); });

    // ── SCENARIO 2: Maria (Has 3 Clay Pots, Wants Tools) ────────
    const lim1s2AllNames = ["Cheenu", "Raj", "Yuvi", "Paul", "Fathima", "Fatima", "Ivan", "Ivan-2"];
    const lim1s2Correct = new Set(["Ivan", "Ivan-2"]);
    const lim1s2Wants = {
        "Cheenu": "bread",
        "Raj": "carrots",
        "Yuvi": "fish",
        "Paul": "tools",
        "Fathima": "apples", "Fatima": "apples",
    };

    makeCardsClickable(S.lim1s2.cards);

    if (S.lim1s2.cards) {
        S.lim1s2.cards.addEventListener("click", (e) => {
            const found = findCardAndTrader(e, S.lim1s2.cards, lim1s2AllNames);
            if (!found) return;
            const { traderId, topCard } = found;

            clearCardHighlight();
            _lastClickedCard = topCard;
            highlightCard(topCard, true);

            if (lim1s2Correct.has(traderId)) {
                hide(S.lim1s2.wrong);
                positionPopup(topCard, S.lim1s2.right, "Group_1281-3"); // Base is Cheenu
                show(S.lim1s2.right);
                playLottie("emoji_happy-star", S.lim1s2.right);
            } else {
                const want = lim1s2Wants[traderId] || "that";
                setIncorrectMsg(S.lim1s2.wrong, `clay pots. I want ${want}!"`);
                positionPopup(topCard, S.lim1s2.wrong, "Group_1281-3"); // Base is Cheenu
                show(S.lim1s2.wrong);
                playLottie("emoji-sad", S.lim1s2.wrong);
            }
        });
    }

    // "Try another trader" → stop lottie, clear highlight, hide wrong popup
    onClick("Try_another_trader", () => {
        stopLottie();
        clearCardHighlight();
        hide(S.lim1s1.wrong);
        if (S.lim1s1.wrong) S.lim1s1.wrong.style.transform = "";
    });

    // "Try another trader" for sc02
    onClick("Try_another_trader_2", () => {
        stopLottie();
        clearCardHighlight();
        hide(S.lim1s2.wrong);
        if (S.lim1s2.wrong) S.lim1s2.wrong.style.transform = "";
    });

    // Fair / Unfair Trade for sc2
    ["Fair_Trade-2", "Unfair_Trade-2"].forEach(id => onClick(id, () => {
        stopLottie(); clearCardHighlight();
        hide(S.lim1s2.right);
        show(S.lim1s2.end);
    }));

    // Continue to Limitation 2
    onClick("Continue_to_Next_Challenge_", () => { stopLottie(); clearCardHighlight(); goTo(S.lim2s1); });

    // ═══════════════════════════════════════════════════════════
    //  LIMITATION 2 — No Coincidence of Wants (pair matching)
    // ═══════════════════════════════════════════════════════════

    function makePairManager(pairs, sc) {
        let selectedId = null;
        let selectedEl = null;
        const matched = new Set();
        let correctCount = 0;
        let wrongCount = 0;

        const pairMap = {};
        pairs.forEach(([a, b]) => { pairMap[a] = b; pairMap[b] = a; });
        const totalPairs = pairs.length;

        return function attemptTrade(clickedId, clickedEl) {
            if (matched.has(clickedId)) return;

            if (!selectedId) {
                selectedId = clickedId;
                selectedEl = clickedEl;
                clickedEl.style.outline = "4px solid #ffcc00";
                clickedEl.style.filter = "drop-shadow(0px 0px 12px gold)";
            } else {
                if (selectedId === clickedId) {
                    selectedEl.style.outline = "";
                    selectedEl.style.filter = "";
                    selectedId = null; selectedEl = null;
                    return;
                }

                const isMatch = pairMap[selectedId] === clickedId;
                if (isMatch) {
                    correctCount++;
                    matched.add(selectedId);
                    matched.add(clickedId);
                    [selectedEl, clickedEl].forEach(el => {
                        el.style.outline = "4px solid #4caf50";
                        el.style.filter = "drop-shadow(0px 0px 12px #4caf50)";
                    });
                    playLottie("emoji_happy-star");
                    if (correctCount === 1 && sc.c01) { hide(sc.c02); show(sc.c01); }
                    if (correctCount === 2 && sc.c02) { hide(sc.c01); show(sc.c02); }
                    if (correctCount >= totalPairs) {
                        setTimeout(() => { stopLottie(); hide(sc.c01); hide(sc.c02); show(sc.end); }, 1200);
                    }
                } else {
                    wrongCount++;
                    [selectedEl, clickedEl].forEach(el => {
                        el.style.outline = "4px solid red";
                        el.style.filter = "drop-shadow(0px 0px 12px red)";
                    });
                    playLottie("emoji-sad");
                    setTimeout(() => {
                        if (selectedEl) { selectedEl.style.outline = ""; selectedEl.style.filter = ""; }
                        clickedEl.style.outline = "";
                        clickedEl.style.filter = "";
                    }, 1500);
                    if (wrongCount >= 6) setTimeout(() => show(sc.end), 2000);
                }
                selectedId = null; selectedEl = null;
            }
        };
    }

    // ── Lim2 Scenario 1 ─────────────────────────────────────────
    const lim2s1AllNames = ["Potter", "Farmer", "Fisherman", "Weaver", "Baker", "Gardener", "Blacksmith", "Hunter"];
    const lim2s1Pairs = [["Farmer", "Blacksmith"], ["Weaver", "Baker"]];
    const lim2s1Trade = makePairManager(lim2s1Pairs, S.lim2s1);

    makeCardsClickable(S.lim2s1.cards);

    if (S.lim2s1.cards) {
        S.lim2s1.cards.addEventListener("click", (e) => {
            const found = findCardAndTrader(e, S.lim2s1.cards, lim2s1AllNames);
            if (!found) return;
            lim2s1Trade(found.traderId, found.topCard);
        });
    }

    onClick("Continue-2", () => { stopLottie(); goTo(S.lim2s2); });

    // ── Lim2 Scenario 2 ─────────────────────────────────────────
    const lim2s2AllNames = ["Carpenter", "Orchardist", "Shepherd", "Tailor", "Baker-3", "Miner", "Rancher", "Milkman"];
    const lim2s2Pairs = [["Carpenter", "Orchardist"], ["Shepherd", "Tailor"]];
    const lim2s2NormMap = { "Baker-3": "Baker" };
    const lim2s2Trade = makePairManager(lim2s2Pairs, S.lim2s2);

    const lim2s2Root = S.lim2s2.base;
    if (lim2s2Root) {
        makeCardsClickable(lim2s2Root);
        lim2s2Root.addEventListener("click", (e) => {
            const found = findCardAndTrader(e, lim2s2Root, lim2s2AllNames);
            if (!found) return;
            const normId = lim2s2NormMap[found.traderId] || found.traderId;
            lim2s2Trade(normId, found.topCard);
        });
    }

    onClick("Continue-7", () => { stopLottie(); resetLim3s1(); goTo(S.lim3s1); });

    // ═══════════════════════════════════════════════════════════
    //  LIMITATION 3 — Exchange Rate Problem
    // ═══════════════════════════════════════════════════════════

    function setInvCount(groupId, val) {
        const g = $(groupId);
        if (!g) return;
        const tspan = g.querySelector("tspan");
        if (tspan) tspan.textContent = String(val);
    }

    function wireTradeBtn(btnId, fn) {
        const el = $(btnId);
        if (!el) return;
        ptr(el);
        const par = el.parentElement;
        if (par) ptr(par);
        el.addEventListener("click", fn);
        if (par) par.addEventListener("click", (ev) => { if (ev.target === par) fn(); });
    }

    // ── Scenario 1: 2 Cows → goal: 100 Apples ────────────────
    let lim3s1 = { cows: 2, chickens: 0, breads: 0, apples: 0 };

    function resetLim3s1() {
        lim3s1 = { cows: 2, chickens: 0, breads: 0, apples: 0 };
        updateLim3s1UI();
        if (S.lim3s1.end) hide(S.lim3s1.end);
    }

    function updateLim3s1UI() {
        setInvCount("_2_Cows", lim3s1.cows);
        setInvCount("_0_Chickens", lim3s1.chickens);
        setInvCount("_0_Apples", lim3s1.apples);
        setInvCount("_0_Bread", lim3s1.breads);
    }

    function checkLim3s1Win() {
        if (lim3s1.apples >= 100) {
            playLottie("emoji_happy-star");
            setTimeout(() => { stopLottie(); show(S.lim3s1.end); }, 600);
        }
    }

    wireTradeBtn("Trade_Cow_Chickens", () => {
        if (lim3s1.cows > 0) {
            lim3s1.cows--; lim3s1.chickens += 10;
            updateLim3s1UI(); checkLim3s1Win();
        } else { playLottie("emoji-sad"); }
    });
    wireTradeBtn("Trade_Chickens_Breads", () => {
        if (lim3s1.chickens > 0) {
            lim3s1.chickens--; lim3s1.breads += 5;
            updateLim3s1UI(); checkLim3s1Win();
        } else { playLottie("emoji-sad"); }
    });
    wireTradeBtn("Trade_Breads_Apples", () => {
        if (lim3s1.breads > 0) {
            lim3s1.breads--; lim3s1.apples += 2;
            updateLim3s1UI(); checkLim3s1Win();
        } else { playLottie("emoji-sad"); }
    });

    // Reset buttons inside sc1
    if (S.lim3s1.base) {
        S.lim3s1.base.querySelectorAll("[id^='Reset']").forEach(btn => {
            ptr(btn); btn.addEventListener("click", resetLim3s1);
        });
    }

    // Continue sc1 → sc2
    onClick("Continue-6", () => { stopLottie(); resetLim3s2(); if (S.lim3s2.base) goTo(S.lim3s2); });

    // ── Scenario 2: 8 Chickens → goal: 50 Breads (will fail) ──
    let lim3s2 = { cows: 0, chickens: 8, breads: 0, apples: 0 };

    function resetLim3s2() {
        lim3s2 = { cows: 0, chickens: 8, breads: 0, apples: 0 };
        if (S.lim3s2.base) updateLim3s2UI();
        if (S.lim3s2.end) hide(S.lim3s2.end);
    }

    function updateLim3s2UI() {
        if (!S.lim3s2.base) return;
        setInvCount("_0_Cows-2", lim3s2.cows);
        setInvCount("_8_Chickens", lim3s2.chickens);
        setInvCount("_0_Bread-2", lim3s2.breads);
        setInvCount("_0_Apples-2", lim3s2.apples);
    }

    function checkLim3s2Done() {
        // Fail: chickens exhausted and still < 50 breads
        if (lim3s2.cows === 0 && lim3s2.chickens === 0 && lim3s2.breads < 50) {
            playLottie("emoji-sad");
            setTimeout(() => { stopLottie(); if (S.lim3s2.end) show(S.lim3s2.end); }, 800);
        }
    }

    if (S.lim3s2.base) {
        S.lim3s2.base.querySelectorAll("g[id^='Trade_'], g[data-name^='Trade']").forEach(el => ptr(el));
        S.lim3s2.base.addEventListener("click", (e) => {
            let el = e.target;
            let tradeEl = null;
            while (el && el !== S.lim3s2.base) {
                if (el.id && el.id.startsWith("Trade_")) { tradeEl = el; break; }
                if (el.dataset?.name?.startsWith("Trade")) { tradeEl = el; break; }
                el = el.parentElement;
            }
            if (!tradeEl) return;
            const id = tradeEl.id || tradeEl.dataset.name || "";
            if (id.includes("Cow")) {
                if (lim3s2.cows > 0) { lim3s2.cows--; lim3s2.chickens += 10; updateLim3s2UI(); checkLim3s2Done(); }
                else playLottie("emoji-sad");
            } else if (id.includes("Chicken")) {
                if (lim3s2.chickens > 0) { lim3s2.chickens--; lim3s2.breads += 5; updateLim3s2UI(); checkLim3s2Done(); }
                else playLottie("emoji-sad");
            } else if (id.includes("Bread")) {
                if (lim3s2.breads > 0) { lim3s2.breads--; lim3s2.apples += 2; updateLim3s2UI(); }
                else playLottie("emoji-sad");
            }
        });

        S.lim3s2.base.querySelectorAll("[id^='Reset']").forEach(btn => {
            ptr(btn); btn.addEventListener("click", resetLim3s2);
        });
    }

    // Continue lim3 sc2 → Conclusion
    if (S.lim3s2.end) {
        S.lim3s2.end.addEventListener("click", (e) => {
            const btn = e.target.closest('[id^="Continue"]');
            if (btn) { stopLottie(); hideAll(); show(S.conclusion); }
        });
    }
    onClick("Continue-8", () => { stopLottie(); hideAll(); show(S.conclusion); });

    // lim3 sc1 → conclusion path (if only one limitation)
    // Continue-9 or similar may exist; rely on lim3s1.end listener
    if (S.lim3s1.end) {
        S.lim3s1.end.addEventListener("click", (e) => {
            const btn = e.target.closest('[id^="Continue"]');
            if (btn && btn.id !== "Continue-6") { stopLottie(); hideAll(); show(S.conclusion); }
        });
    }

    // ═══════════════════════════════════════════════════════════
    //  CONCLUSION — Discover the Solution
    // ═══════════════════════════════════════════════════════════
    onClick("Click_here_to_discover_the_solution.", () => show(S.solution));

    function wireClose(popup) {
        if (!popup) return;
        const closeBtn = $q('[id^="Group_1498"]', popup) || $q('[data-name*="Close"]', popup);
        if (closeBtn) { ptr(closeBtn); closeBtn.addEventListener("click", () => hide(popup)); }
    }
    wireClose(S.solution);
    wireClose(S.insights);

    $qa('[id^="Insights"]').forEach(btn => {
        if (btn.id === "insights-popup") return;
        ptr(btn);
        btn.addEventListener("click", () => show(S.insights));
    });

    // Initialise lim3 UI immediately so inventory values are correct on first load
    updateLim3s1UI();

});
