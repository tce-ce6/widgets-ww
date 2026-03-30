document.addEventListener("DOMContentLoaded", () => {
  // ─────────────────────────────────────────────
  //  UTILITIES
  // ─────────────────────────────────────────────
  const $ = (id) => document.getElementById(id);
  const $q = (sel, ctx) => (ctx || document).querySelector(sel);
  const $qa = (sel, ctx) => Array.from((ctx || document).querySelectorAll(sel));

  const show = (el) => {
    if (el) el.style.display = "block";
  };
  const hide = (el) => {
    if (el) el.style.display = "none";
  };
  const ptr = (el) => {
    if (el) el.style.cursor = "pointer";
  };

  // ─────────────────────────────────────────────
  //  LOTTIE — overlay on the emoji inside the popup
  // ─────────────────────────────────────────────
  const lottieWrap = document.createElement("div");
  Object.assign(lottieWrap.style, {
    position: "fixed",
    width: "130px",
    height: "130px",
    pointerEvents: "none",
    zIndex: "9999",
    display: "none",
    overflow: "hidden", // Prevent repeating/scroll issues
  });
  document.body.appendChild(lottieWrap);
  let _anim = null;
  let _staticEmojiEl = null;

  function stopLottie() {
    if (_anim) {
      try {
        _anim.destroy();
      } catch (e) {}
      _anim = null;
    }
    lottieWrap.style.display = "none";
    lottieWrap.innerHTML = ""; // Clear SVG to prevent duplicates
    if (_staticEmojiEl) {
      _staticEmojiEl.style.visibility = "";
      _staticEmojiEl = null;
    }
  }

  function playLottie(name, targetEl) {
    stopLottie();

    // Find the emoji face group inside the targetEl.
    // Emoji groups contain a path with id starting "Path_2862" (star-eyes happy)
    // or "Path_2186" (sad). Walk up 3 levels to reach the outer Group_1492/Group_1303.
    if (targetEl) {
      const innerPath = targetEl.querySelector(
        "[id^='Path_2862'],[id^='Path_2186']"
      );
      if (innerPath) {
        // path → Group_1491/1302 → clip-path group → Group_1492/1303
        const outerG =
          innerPath.parentElement?.parentElement?.parentElement;
        _staticEmojiEl = outerG || innerPath.parentElement;
      }

      if (_staticEmojiEl) {
        // Get the bounding rect of the emoji itself and overlay Lottie there
        const eRect = _staticEmojiEl.getBoundingClientRect();
        if (eRect.width > 0 && eRect.height > 0) {
          _staticEmojiEl.style.visibility = "hidden";
          lottieWrap.style.left = eRect.left + eRect.width / 2 - 65 + "px";
          lottieWrap.style.top = eRect.top + eRect.height / 2 - 65 + "px";
        } else {
          // Emoji not visible (popup may be hidden) — center on popup
          const pRect = targetEl.getBoundingClientRect();
          lottieWrap.style.left = pRect.left + pRect.width / 2 - 65 + "px";
          lottieWrap.style.top = pRect.top + 10 + "px";
          _staticEmojiEl = null;
        }
      } else {
        // No emoji found — center on popup
        const pRect = targetEl.getBoundingClientRect();
        lottieWrap.style.left = pRect.left + pRect.width / 2 - 65 + "px";
        lottieWrap.style.top = pRect.top + 10 + "px";
      }
    } else {
      lottieWrap.style.left = window.innerWidth / 2 - 65 + "px";
      lottieWrap.style.top = window.innerHeight / 2 - 65 + "px";
    }

    lottieWrap.style.display = "block";
    if (typeof lottie === "undefined") {
      console.warn("Lottie not loaded");
      return;
    }
    _anim = lottie.loadAnimation({
      container: lottieWrap,
      renderer: "svg",
      loop: true,
      autoplay: true, // User requested looping until action
      path: `./assets/animation/${name}.json`,
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
      wrong: $("limitation02-sc01-incorrect"),
    },
    lim2s2: {
      base: $("limitation02-sc02-base-screen"),
      c01: $("limitation02-sc02-correct-01"),
      c02: $("limitation02-sc02-correct-02"),
      end: $("limitation02-sc02-end-feedback"),
      wrong: $("limitation02-sc02-incorrect"),
    },

    lim3s1: {
      base: $("limitation03-sc01-base-screen"),
      end: $("limitation03-sc01-end-feedback"),
    },
    lim3s2: {
      base: $("limitation03-sc02-base-screen"),
      end: $("limitation03-sc02-failure-popup"),
    },

    conclusion: $("conclusion-base-screen"),
    solution: $("solution-popup"),
    insights: $("insights-popup"),
    back_button: $("Group_594-2"),
    home_buttom: $("Group_1566"),
    next_button: $("btn-next"),
  };

  // Navigation history for Back button
  // Each entry is a scenario object {base, cards?} or null (= menu)
  const navHistory = [];

  // Ordered sequence for Next navigation
  // null = menu; 'conclusion' = conclusion element
  const NAV_SEQ = [
    null, S.lim1s1, S.lim1s2, S.lim2s1, S.lim2s2,
    S.lim3s1, S.lim3s2, "conclusion",
  ];

  function getCurrentScreen() {
    const scs = [S.lim1s1, S.lim1s2, S.lim2s1, S.lim2s2, S.lim3s1, S.lim3s2];
    for (const sc of scs) {
      if (sc && sc.base && sc.base.style.display !== "none") return sc;
    }
    if (S.conclusion && S.conclusion.style.display !== "none") return "conclusion";
    return null; // menu
  }

  function updateNavButtons() {
    const cur = getCurrentScreen();
    const idx = NAV_SEQ.indexOf(cur);
    const hasNext = idx >= 0 && idx < NAV_SEQ.length - 1;
    if (S.next_button) hasNext ? show(S.next_button) : hide(S.next_button);
  }

  // ─────────────────────────────────────────────
  //  HIDE ALL SCREENS
  // ─────────────────────────────────────────────
  function hideAll() {
    [
      S.intro,
      S.menu,
      S.lim1s1.base,
      S.lim1s1.cards,
      S.lim1s1.wrong,
      S.lim1s1.right,
      S.lim1s1.end,
      S.lim1s2.base,
      S.lim1s2.cards,
      S.lim1s2.wrong,
      S.lim1s2.right,
      S.lim1s2.end,
      S.lim2s1.base,
      S.lim2s1.cards,
      S.lim2s1.c01,
      S.lim2s1.c02,
      S.lim2s1.end,
      S.lim2s1.wrong,
      S.lim2s2.base,
      S.lim2s2.c01,
      S.lim2s2.c02,
      S.lim2s2.end,
      S.lim2s2.wrong,
      S.lim3s1.base,
      S.lim3s1.end,
      S.lim3s2.base,
      S.lim3s2.end,
      S.conclusion,
      S.solution,
      S.insights,
      S.back_button,
      S.home_buttom,
      S.next_button,
    ].forEach(hide);

      //  lim2s1AllNames.forEach((name) => {
      //     let outline = document.getElementById(
      //       name.toLowerCase() + "_outline",
      //     );
      //     if (outline) hide(outline);
      //   });
      //      lim2s2AllNames.forEach((name) => {
      //     let outline = document.getElementById(
      //       name.toLowerCase() + "_outline",
      //     );
      //     if (outline) hide(outline);
      //   });
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
    container.querySelectorAll("*").forEach((el) => {
      el.style.cursor = "pointer";
      el.style.pointerEvents = "all";
    });
    container.style.cursor = "pointer";
    container.style.pointerEvents = "all";
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
      if (el.id && allNames.includes(el.id)) {
        clickedTrader = el;
        break;
      }
      el = el.parentElement;
    }

    // Step 2: if we didn't find a named ancestor, walk up from e.target
    // to find the direct child of container, then search inside it for a trader name
    if (!clickedTrader) {
      let cardGroup = e.target;
      while (cardGroup && cardGroup.parentElement !== container) {
        cardGroup = cardGroup.parentElement;
      }
      if (cardGroup && cardGroup !== container) {
        for (const name of allNames) {
          const namedEl = cardGroup.querySelector("#" + CSS.escape(name));
          if (namedEl) {
            return { traderId: name, topCard: cardGroup };
          }
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
      Maya: "Group_1281",
      Amit: "Group_1292",
      Omar: "Group_1293",
      Sara: "Group_1294",
      Priya: "Group_1295",
      Shambu: "Group_1296",
      // Scenario 2 traders (Maria's scenario)
      Cheenu: "Group_1281-3",
      Paul: "Group_1292-2",
      Raj: "Group_1293-2",
      Fathima: "Group_1294-2",
      Yuvi: "Group_1295-2",
      Ivan: "Group_1296-2",
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
        if (tspan) {
          tspan.textContent = line2Text;
          return;
        }
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
    cardEl.style.filter = on
      ? "drop-shadow(0 0 12px #ffcc00) brightness(1.08)"
      : "";
  }
  function clearCardHighlight() {
    if (_lastClickedCard) {
      highlightCard(_lastClickedCard, false);
      _lastClickedCard = null;
    }
  lim2s1AllNames.forEach((name) => {
          let outline = document.getElementById(
            name.toLowerCase() + "_outline",
          );
          if (outline) hide(outline);
        });
          lim2s2AllNames.forEach((name) => {
          let outline = document.getElementById(
            name.toLowerCase() + "_outline",
          );
          if (outline) hide(outline);
        });
         matched.clear();

  }

  // ─────────────────────────────────────────────
  //  INTRO → MENU
  // ─────────────────────────────────────────────
  ["Enter", "Group_794-2"].forEach((id) =>
    onClick(id, () => {
      stopLottie();
      hideAll();
      show(S.menu);
    }),
  );

  // Menu scenario buttons
  onClick("Group_1501", () => {
    clearCardHighlight();
    navHistory.push(null);
    goTo(S.lim1s1);
    show(S.home_buttom); show(S.back_button); updateNavButtons();
  });
  onClick("Group_1502", () => {
    clearCardHighlight();
    navHistory.push(null);
    goTo(S.lim1s2);
    show(S.home_buttom); show(S.back_button); updateNavButtons();
  });
  onClick("Group_1501-2", () => {
    clearCardHighlight();
    navHistory.push(null);
    goTo(S.lim2s1);
     lim2s1AllNames.forEach((name) => {
          let outline = document.getElementById(
            name.toLowerCase() + "_outline",
          );
          if (outline) hide(outline);
        });
    matched.clear();
    show(S.home_buttom); show(S.back_button); updateNavButtons();
  });
  onClick("Group_1502-2", () => {
    clearCardHighlight();
    navHistory.push(null);
    goTo(S.lim2s2);
     lim2s2AllNames.forEach((name) => {
          let outline = document.getElementById(
            name.toLowerCase() + "_outline",
          );
          if (outline) hide(outline);
        });
         matched.clear();
    show(S.home_buttom); show(S.back_button); updateNavButtons();
  });
  onClick("Group_1501-3", () => {
    navHistory.push(null);
    resetLim3s1();
    goTo(S.lim3s1);
    show(S.home_buttom); show(S.back_button); updateNavButtons();
  });
  onClick("Group_1502-3", () => {
    navHistory.push(null);
    resetLim3s2();
    if (S.lim3s2.base) goTo(S.lim3s2);
    show(S.home_buttom); show(S.back_button); updateNavButtons();
  });

  // Internal Scenario switchers (top bar) in Limitation 3
  onClick("Scenario_1-6", () => { resetLim3s1(); goTo(S.lim3s1); updateNavButtons(); });
  onClick("Scenario_2-6", () => { resetLim3s2(); if (S.lim3s2.base) goTo(S.lim3s2); updateNavButtons(); });
  onClick("Group_1500-5", () => { resetLim3s1(); goTo(S.lim3s1); updateNavButtons(); });
  onClick("Group_1500-6", () => { resetLim3s2(); if (S.lim3s2.base) goTo(S.lim3s2); updateNavButtons(); });

  // Restore a history entry (null = menu, sc object = scenario)
  function restorePrev(prev) {
    hideAll();
    if (!prev) {
      show(S.menu);
    } else if (prev.base) {
      show(prev.base);
      if (prev.cards) show(prev.cards);
      show(S.home_buttom);
      show(S.back_button);
      updateNavButtons();
    } else {
      // plain element (e.g. S.conclusion)
      show(prev);
      show(S.home_buttom);
      show(S.back_button);
      updateNavButtons();
    }
  }

  // Global back — go to previous scenario
  onClick("Back", () => {
    stopLottie();
    clearCardHighlight();
    restorePrev(navHistory.length > 0 ? navHistory.pop() : null);
  });

  // Home — always go to menu, clear history
  onClick("Group_1566", () => {
    navHistory.length = 0;
    stopLottie();
    clearCardHighlight();
    hideAll();
    show(S.menu);
  });

  // Next — advance to the next scenario in sequence
  onClick("btn-next", () => {
    const cur = getCurrentScreen();
    const idx = NAV_SEQ.indexOf(cur);
    if (idx < 0 || idx >= NAV_SEQ.length - 1) return;
    const next = NAV_SEQ[idx + 1];
    navHistory.push(cur);
    stopLottie();
    clearCardHighlight();
    hideAll();
    if (next === "conclusion") {
      show(S.conclusion);
      show(S.home_buttom);
      return;
    } else if (next && next.base) {
      if (next === S.lim3s1) resetLim3s1();
      if (next === S.lim3s2) resetLim3s2();
      show(next.base);
      if (next.cards) show(next.cards);
    } else {
      show(S.menu);
    }
    show(S.home_buttom);
    show(S.back_button);
    updateNavButtons();
  });

  // ═══════════════════════════════════════════════════════════
  //  LIMITATION 1 — Double Coincidence of Wants
  // ═══════════════════════════════════════════════════════════

  // ── SCENARIO 1: Govind (Has Fish, Wants Wheat) ──────────────
  const lim1s1AllNames = [
    "Maya",
    "Maya-2",
    "Omar",
    "Amit",
    "Priya",
    "Priya-2",
    "Shambu",
    "Sara",
  ];
  const lim1s1Correct = new Set(["Sara"]);
  const lim1s1Wants = {
    Maya: "apples",
    "Maya-2": "apples",
    Omar: "carrots",
    Amit: "potatoes",
    Priya: "wood",
    "Priya-2": "wood",
    Shambu: "wheat",
    
  };

  makeCardsClickable(S.lim1s1.cards);

  /*
   * positionPopup
   * -------------
   * The XD design drew the wrong/right popups physically over the first card.
   * To show the popup over Omar/Priya/etc., we calculate the difference
   * between the clicked card's position and the base card's position in SVG space.
   */
  function positionPopup(targetCard, popupGroup, baseCardId) {
    if (!targetCard || !popupGroup || !baseCardId) return;
    const baseCard =
      S.lim1s1.cards.querySelector("#" + CSS.escape(baseCardId)) ||
      S.lim1s2.cards.querySelector("#" + CSS.escape(baseCardId));
    if (!baseCard) return;

    const targetBBox = targetCard.getBBox();
    const baseBBox = baseCard.getBBox();
    const targetMatrix = targetCard.getCTM();
    const baseMatrix = baseCard.getCTM();

    const targetX = targetMatrix.e + targetBBox.x;
    const targetY = targetMatrix.f + targetBBox.y;
    const baseX = baseMatrix.e + baseBBox.x;
    const baseY = baseMatrix.f + baseBBox.y;

    const dx = targetX - baseX;
    const dy = targetY - baseY;

    // Hide the hardcoded replica card (e.g. Maya's copy) inside the popup
    // so it doesn't overlay incorrectly on other traders.
    const replicaCard = popupGroup.querySelector('[data-name="Group 1281"]');
    if (replicaCard) replicaCard.style.display = "none";

    // Translate ONLY the speech bubble, avoiding the dark full-screen
    // background overlay and the static buttons.
    Array.from(popupGroup.children).forEach((child) => {
      // Skip the dark overlay
      if (child.tagName.toLowerCase() === "rect") return;

      // Skip the action buttons
      const isButton =
        child.id &&
        (child.id.includes("Try_another_trader") ||
          child.id.includes("Fair_Trade") ||
          child.id.includes("Unfair_Trade"));
      const hasButtonInside =
        child.querySelector('[id*="Try_another_trader"]') ||
        child.querySelector('[id*="Fair_Trade"]') ||
        child.querySelector('[id*="Unfair_Trade"]');

      if (isButton || hasButtonInside) return;

      // Otherwise, it's the speech bubble! Translate it.
      // child.style.transform = `translate(${dx}px, ${dy}px)`;
      // child.style.transformOrigin = "center";
    });
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
       // playLottie("emoji_happy-star", S.lim1s1.right);
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
  onClick("Try_another_trader", () => {
    stopLottie();
    clearCardHighlight();
    hide(S.lim1s1.wrong);
  });

  // Fair / Unfair Trade → stop lottie + show end
  ["Fair_Trade", "Unfair_Trade"].forEach((id) => {
    const el = $(id);
    if (el) {
      ptr(el);
      el.addEventListener("click", () => {
        stopLottie();
        clearCardHighlight();
        hide(S.lim1s1.right);
        show(S.lim1s1.end);
        playLottie("emoji-sad", S.lim1s1.end);
      });
    }
  });

  // Continue sc1 → sc2
  onClick("Continue", () => {
    stopLottie();
    clearCardHighlight();
    navHistory.push(S.lim1s1);
    goTo(S.lim1s2);
    show(S.back_button); show(S.home_buttom); updateNavButtons();
  });

  // ── SCENARIO 2: Maria (Has 3 Clay Pots, Wants Tools) ────────
  const lim1s2AllNames = [
    "Cheenu",
    "Raj",
    "Yuvi",
    "Paul",
    "Fathima",
    "Fatima",
    "Ivan",
    "Ivan-2",
    "Priya-2",
    "Jaya",
    "Ranjit",
  ];
  const lim1s2Correct = new Set(["Ivan", "Ivan-2"]);
  const lim1s2Wants = {
    Cheenu: "bread",
    Raj: "carrots",
    Yuvi: "fish",
    Paul: "tools",
    Fathima: "apples",
    Fatima: "apples",
    Priya: "wood",
    "Priya-2": "wood",
    Jaya: "tools",
    Ranjit: "bread",
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
        hide(S.lim1s1.wrong);
        hide(S.lim1s2.wrong);
        positionPopup(topCard, S.lim1s2.right, "Group_1281-3"); // Base is Cheenu
        show(S.lim1s2.right);
       // playLottie("emoji_happy-star", S.lim1s2.right);
      } else {
        const want = lim1s2Wants[traderId] || "that";
        // lim1s2.wrong doesn't exist in HTML, use lim1s1.wrong as fallback
        const wrongPopup = S.lim1s2.wrong || S.lim1s1.wrong;
        setIncorrectMsg(wrongPopup, `clay pots. I want ${want}!"`);
        positionPopup(topCard, wrongPopup, "Group_1281-3"); // Base is Cheenu
        show(wrongPopup);
        playLottie("emoji-sad", wrongPopup);
      }
    });
  }

  // "Try another trader" → stop lottie, clear highlight, hide wrong popup
  onClick("Try_another_trader", () => {
    stopLottie();
    clearCardHighlight();
    hide(S.lim1s1.wrong);
  });

  // "Try another trader" for sc02
  onClick("Try_another_trader_2", () => {
    stopLottie();
    clearCardHighlight();
    hide(S.lim1s2.wrong);
    if (S.lim1s2.wrong) S.lim1s2.wrong.style.transform = "";
  });

  // Fair / Unfair Trade for sc2
  ["Fair_Trade-2", "Unfair_Trade-2"].forEach((id) =>
    onClick(id, () => {
      stopLottie();
      clearCardHighlight();
      hide(S.lim1s2.right);
      show(S.lim1s2.end);
      playLottie("emoji-sad", S.lim1s2.end);
    }),
  );

  // Continue to Limitation 2
  onClick("Continue_to_Next_Challenge_", () => {
    stopLottie();
    clearCardHighlight();
    navHistory.push(S.lim1s2);
    goTo(S.lim2s1);
     lim2s1AllNames.forEach((name) => {
          let outline = document.getElementById(
            name.toLowerCase() + "_outline",
          );
          if (outline) hide(outline);
        });
    show(S.home_buttom); show(S.back_button); updateNavButtons();
  });

  // ═══════════════════════════════════════════════════════════
  //  LIMITATION 2 — No Coincidence of Wants (pair matching)
  // ═══════════════════════════════════════════════════════════
  matched = new Set();
  function makePairManager(pairs, sc, config = {}) {
    let selectedId = null;
    let selectedEl = null;
    
    let correctCount = 0;

    const pairMap = {};
    pairs.forEach(([a, b]) => {
      pairMap[a] = b;
      pairMap[b] = a;
    });
    const totalPairs = pairs.length;

    return function attemptTrade(clickedId, clickedEl) {
      if (matched.has(clickedId)) return;

      if (!selectedId) {
        selectedId = clickedId;
        selectedEl = clickedEl;
        if (config.onSelect) config.onSelect(clickedId);
      } else {
        if (selectedId === clickedId) {
          selectedId = null;
          selectedEl = null;
          if (config.onSelect) config.onSelect(null);
          return;
        }

        const isMatch = pairMap[selectedId] === clickedId;
        if (isMatch) {
          correctCount++;
          matched.add(selectedId);
          matched.add(clickedId);

          if (config.onSelect) config.onSelect(clickedId);
          if (config.onCorrect)
            config.onCorrect(correctCount, selectedId, clickedId);

          if (correctCount >= totalPairs) {
            setTimeout(() => {
              stopLottie();
            }, 2500);
          }
        } else {
          const el1 = selectedEl,
            el2 = clickedEl;
          setTimeout(() => {
            if (el1) {
              el1.style.outline = "";
              el1.style.filter = "";
            }
            if (el2) {
              el2.style.outline = "";
              el2.style.filter = "";
            }
          }, 1200);
        }
        selectedId = null;
        selectedEl = null;
        if (config.onSelect) config.onSelect(null);
      }
    };
  }

  // ── Lim2 Scenario 1 ─────────────────────────────────────────
  let lim2s1_correctCount = 0;
  const lim2s1AllNames = [
    "Potter",
    "Farmer",
    "Fisherman",
    "Weaver",
    "Baker",
    "Gardener",
    "Blacksmith",
    "Hunter",
  ];
  const lim2s1Pairs = [
    ["Farmer", "Blacksmith"],
    ["Weaver", "Baker"],
  ];
  const out1 = $("limitation02-sc01-correct-01-outline");
  const out2 = $("limitation02-sc01-correct-02-outline");
  if (out1) hide(out1);
  if (out2) hide(out2);
  const lim2s1Trade = makePairManager(lim2s1Pairs, S.lim2s1, {
    promptId:
      "You_are_a_village_trade_coordinator._Help_village_traders_attempt_a_trade_by_tapping_on_two_traders.",
    textId: "lim2s1-prompt",
    defaultPrompt:
      "Help village traders attempt a trade by tapping on two traders.",
    onSelect: (id) => {
      if (!id) {
        // If selection is cleared
        // if (out1) hide(out1);
        // if (out2) hide(out2);
        // Also hide individual outlines if they were shown
        // lim2s1AllNames.forEach((name) => {
        //   let outline = document.getElementById(
        //     name.toLowerCase() + "_outline",
        //   );
        //   if (outline) hide(outline);
        // });
        return;
      }

      if (id === "Farmer" || id === "Blacksmith") {
        if (out1) {
          show(out1);
          let outline = document.getElementById(id.toLowerCase() + "_outline");
          if (outline) show(outline);
        }
      } else if (id === "Weaver" || id === "Baker") {
        if (out2) {
          show(out2);
          let outline = document.getElementById(id.toLowerCase() + "_outline");
          if (outline) show(outline);
        }
      }
    },
    onCorrect: (count, sld, cld) => {
      lim2s1_correctCount = count;
      if (
        sld === "Farmer" ||
        sld === "Blacksmith" ||
        cld === "Farmer" ||
        cld === "Blacksmith"
      ) {
        show(S.lim2s1.c01);
        playLottie("emoji_happy-star", S.lim2s1.c01);
        let badge = document.getElementById("Trades_Completed:_1_4");
        if (badge) {
          const tspan = badge.querySelector("tspan");
          if (tspan) tspan.textContent = `Trades Completed: ${count} / 4`;
        }
      } else if (
        sld === "Weaver" ||
        sld === "Baker" ||
        cld === "Weaver" ||
        cld === "Baker"
      ) {
        show(S.lim2s1.c02);
        playLottie("emoji_happy-star", S.lim2s1.c02);
        let badge = document.getElementById("Trades_Completed:_2_4");
        if (badge) {
          const tspan = badge.querySelector("tspan");
          if (tspan) tspan.textContent = `Trades Completed: ${count} / 4`;
        }
      }
    },
  });

  makeCardsClickable(S.lim2s1.cards);

  if (S.lim2s1.cards) {
    S.lim2s1.cards.addEventListener("click", (e) => {
      const found = findCardAndTrader(e, S.lim2s1.cards, lim2s1AllNames);
      if (!found) return;
      lim2s1Trade(found.traderId, found.topCard);
    });
  }

  onClick("Continue-2", () => {
    hide(S.lim2s1.c01);
        stopLottie();
    if (lim2s1_correctCount === 2) {
      if (S.lim2s1.end) {
        show(S.lim2s1.end)
        playLottie("emoji-sad", S.lim2s1.end)
      };
    }
  });
  onClick("Continue-3", () => {
    hide(S.lim2s1.c02);
        stopLottie();
    if (lim2s1_correctCount === 2) {
      if (S.lim2s1.end) {
        show(S.lim2s1.end)
        playLottie("emoji-sad", S.lim2s1.end)
        };
    }
  });
  onClick("Continue-4", () => {
    stopLottie();
    navHistory.push(S.lim2s1);
    goTo(S.lim2s2);
     lim2s2AllNames.forEach((name) => {
          let outline = document.getElementById(
            name.toLowerCase() + "_outline",
          );
          if (outline) hide(outline);
        });
         matched.clear();
    show(S.home_buttom); show(S.back_button); updateNavButtons();
  });

  // ── Lim2 Scenario 2 ─────────────────────────────────────────
  let lim2s2_correctCount = 0;
  const lim2s2AllNames = [
    "Carpenter",
    "Orchardist",
    "Shepherd",
    "Tailor",
    "Baker-3",
    "Miner",
    "Rancher",
    "Milkman",
  ];
  const lim2s2Pairs = [
    ["Carpenter", "Orchardist"],
    ["Shepherd", "Tailor"],
  ];
  const lim2s2NormMap = { "Baker-3": "Baker" };

  const sc2Out1 = $("limitation02-sc02-correct-01-outline");
  const sc2Out2 = $("limitation02-sc02-correct-02-outline");
  if (sc2Out1) hide(sc2Out1);
  if (sc2Out2) hide(sc2Out2);

  const lim2s2Trade = makePairManager(lim2s2Pairs, S.lim2s2, {
    onSelect: (id) => {
      if (!id) {
        // if (sc2Out1) hide(sc2Out1);
        // if (sc2Out2) hide(sc2Out2);
        // lim2s2AllNames.forEach((name) => {
        //   let nm = name.split("-")[0].toLowerCase();
        //   let outline = document.getElementById(nm + "_outline");
        //   if (outline) hide(outline);
        // });
        return;
      }
      if (id === "Carpenter" || id === "Orchardist") {
        if (sc2Out1) {
          show(sc2Out1);
          let sub = document.getElementById(id.toLowerCase() + "_outline");
          if (sub) show(sub);
        }
      } else if (id === "Shepherd" || id === "Tailor") {
        if (sc2Out2) {
          show(sc2Out2);
          let sub = document.getElementById(id.toLowerCase() + "_outline");
          if (sub) show(sub);
        }
      }
    },
    onCorrect: (count, sld, cld) => {
      if (
        sld === "Carpenter" ||
        sld === "Orchardist" ||
        cld === "Carpenter" ||
        cld === "Orchardist"
      ) {
        show(S.lim2s2.c01);
           playLottie("emoji_happy-star", S.lim2s2.c01);
        const badge = document.getElementById("Trades_Completed:_1_4-2");
        if (badge) {
          const textEl = badge.querySelector("text");
          if (textEl) textEl.textContent = `Trades Completed: ${count} / 4`;
        }
      } else if (
        sld === "Shepherd" ||
        sld === "Tailor" ||
        cld === "Shepherd" ||
        cld === "Tailor"
      ) {
        show(S.lim2s2.c02);
           playLottie("emoji_happy-star", S.lim2s2.c02);
        const badge = document.getElementById("Trades_Completed:_1_4-3");
        if (badge) {
          const textEl = badge.querySelector("text");
          if (textEl) textEl.textContent = `Trades Completed: ${count} / 4`;
        }
      }
    },
  });

  const lim2s2Root = S.lim2s2.base;
  if (lim2s2Root) {
    makeCardsClickable(lim2s2Root);
    lim2s2Root.addEventListener("click", (e) => {
      const found = findCardAndTrader(e, lim2s2Root, lim2s2AllNames);
      if (!found) return;
      // The logic should use the literal'traderId' for selection but can normalize if needed.
      // However, makePairManager uses literal IDs for pairs.
      lim2s2Trade(found.traderId, found.topCard);

      // Update badge on every click if correctCount changed
      const badge = $("Trades_Completed:_0_4-sc2-base");
      if (badge) {
        const text = badge.querySelector("tspan");
        if (text)
          text.textContent = `Trades Completed: ${lim2s2_correctCount} / 4`;
      }
    });
  }

  onClick("Continue-5", () => {
    hide(S.lim2s2.c01);
        stopLottie();
    lim2s2_correctCount++;
    updateSc2Badge();
    if (lim2s2_correctCount === 2) {
      if (S.lim2s2.end) {show(S.lim2s2.end);  playLottie("emoji-sad", S.lim2s2.end)};;
    }
  });
  onClick("Continue-6", () => {
    hide(S.lim2s2.c02);
        stopLottie();
    lim2s2_correctCount++;
    updateSc2Badge();
    if (lim2s2_correctCount === 2) {
      if (S.lim2s2.end) {show(S.lim2s2.end);  playLottie("emoji-sad", S.lim2s2.end)};
    }
  });

  function updateSc2Badge() {
    const ids = [
      "Trades_Completed:_0_4-sc2-base",
      "Trades_Completed:_1_4-2",
      "Trades_Completed:_1_4-3",
    ];
    ids.forEach((id) => {
      const el = $(id);
      if (!el) return;
      // Target the text element directly — replaces all child tspans at once
      const textEl = el.querySelector("text");
      if (textEl) {
        textEl.textContent = `Trades Completed: ${lim2s2_correctCount} / 4`;
      } else {
        const tspan = el.querySelector("tspan");
        if (tspan)
          tspan.textContent = `Trades Completed: ${lim2s2_correctCount} / 4`;
      }
    });
  }

  onClick("Continue_to_Next_Challenge_-2", () => {
    stopLottie();
    navHistory.push(S.lim2s2);
    resetLim3s1();
    goTo(S.lim3s1);
    show(S.home_buttom); show(S.back_button); updateNavButtons();
  });

  // ═══════════════════════════════════════════════════════════
  //  LIMITATION 3 — Exchange Rate Problem
  // ═══════════════════════════════════════════════════════════

  function setInvCount(groupId, val) {
    const g = $(groupId);
    if (!g) return;
    const tspan = g.querySelector("tspan");
    if (tspan) tspan.textContent = String(val);
  }

  function setTradeEnabled(groupId, enabled) {
    const g = $(groupId);
    if (!g) return;
    g.style.opacity = enabled ? "1" : "0.4";
    g.style.pointerEvents = enabled ? "" : "none";
    g.style.cursor = enabled ? "pointer" : "default";
  }

  function wireTradeBtn(btnId, fn) {
    const el = $(btnId);
    if (!el) return;
    ptr(el);
    const par = el.parentElement;
    if (par) ptr(par);
    el.addEventListener("click", fn);
    if (par)
      par.addEventListener("click", (ev) => {
        if (ev.target === par) fn();
      });
  }

  // ─────────────────────────────────────────────
  //  LIMITATION 3 — Exchange Rate Challenges
  // ─────────────────────────────────────────────
  const lim3Rates = { cow: 10, chicken: 5, bread: 2 };
  let lim3s1 = { cows: 2, chickens: 0, breads: 0, apples: 0 };
  let lim3s2 = { cows: 0, chickens: 8, breads: 0, apples: 0 };
  let showingSolution = false;

  function resetLim3s1() {
    lim3s1 = { cows: 2, chickens: 0, breads: 0, apples: 0 };
    updateLim3s1UI();
    if (S.lim3s1.end) hide(S.lim3s1.end);
    showingSolution = false;

    const s1 = $("Show_Answer");
    if (s1) $q("tspan", s1).textContent = "Show Answer";
  }

  function updateLim3s1UI() {
    setInvCount("_2_Cows", lim3s1.cows);
    setInvCount("_0_Chickens", lim3s1.chickens);
    setInvCount("_0_Bread", lim3s1.breads);
    setInvCount("_0_Apples", lim3s1.apples);
    setTradeEnabled("Group_1485", true);
    setTradeEnabled("Group_1487", true);
    setTradeEnabled("Group_1488", true);
  }

  // Inline SC1 emoji SVG into SC2 once (replaces <use> refs that fail when SC1 is hidden)
  let _sc2EmojisDone = false;
  function _inlineSC2Emojis() {
    if (_sc2EmojisDone) return;
    _sc2EmojisDone = true;
    const sc2 = $("limitation03-sc02-base-screen");
    if (!sc2) return;
    const ids = [
      "Group_1462", "Group_1466", "Group_1469", "Group_1472",         // inventory
      "Group_1462-3", "Group_1475", "Group_1475-2",                   // exchange rates
      "Group_1480", "Group_1480-2", "Group_1483",
    ];
    ids.forEach(id => {
      const src = $(id);
      if (!src) return;
      const useEl = sc2.querySelector('use[href="#' + id + '"]');
      if (!useEl) return;
      const clone = src.cloneNode(true);
      clone.removeAttribute("id");
      clone.querySelectorAll("[id]").forEach(el => el.removeAttribute("id"));
      useEl.parentNode.replaceChild(clone, useEl);
    });
  }

  function resetLim3s2() {
    _inlineSC2Emojis();
    lim3s2 = { cows: 0, chickens: 8, breads: 0, apples: 0 };
    updateLim3s2UI();
    if (S.lim3s2.end) hide(S.lim3s2.end);
    showingSolution = false;
  }

  function updateLim3s2UI() {
    setInvCount("_0_Cows-2", lim3s2.cows);
    setInvCount("_8_Chickens-2", lim3s2.chickens);
    setInvCount("_0_Bread-2", lim3s2.breads);
    setInvCount("_0_Apples-2", lim3s2.apples);
    setTradeEnabled("Trade_Cow_Chickens-2", true);
    setTradeEnabled("Trade_Chickens_Breads-2", true);
    setTradeEnabled("Trade_Breads_Apples-2", true);
  }

  function toggleLim3Solution(btnId, textId) {
    const el = $(textId);
    if (!el) return;
    const ts = $q("tspan", el) || $q("text", el) || el;
    const isShowing = ts.textContent.trim() === "Show Answer";
    if (!isShowing) {
      resetLim3s1();
    } else {
      lim3s1 = { cows: 0, chickens: 10, breads: 0, apples: 100 };
      updateLim3s1UI();
    }
    ts.textContent = isShowing ? "Hide Answer" : "Show Answer";
  }
    function toggleLim3Solution2(btnId, textId) {
    const el = $(textId);
    if (!el) return;
    const ts = $q("tspan", el) || $q("text", el) || el;
    const isShowing = ts.textContent.trim() === "Show Answer";
    if (!isShowing) {
      resetLim3s2();
    } else {
      lim3s2 = { cows: 0, chickens: 0, breads: 40, apples: 0 };
      updateLim3s2UI();
    }
    ts.textContent = isShowing ? "Hide Answer" : "Show Answer";
  }

  // SC1 Transitions & Buttons
  wireTradeBtn("Trade_Cow_Chickens", () => {
    if (lim3s1.cows > 0) {
      lim3s1.cows--;
      lim3s1.chickens += lim3Rates.cow;
      updateLim3s1UI();
    } //else playLottie("emoji-sad");
  });
  wireTradeBtn("Trade_Chickens_Breads", () => {
    if (lim3s1.chickens > 0) {
      lim3s1.chickens--;
      lim3s1.breads += lim3Rates.chicken;
      updateLim3s1UI();
    } //else playLottie("emoji-sad");
  });
  wireTradeBtn("Trade_Breads_Apples", () => {
    if (lim3s1.breads > 0) {
      lim3s1.breads--;
      lim3s1.apples += lim3Rates.bread;
      updateLim3s1UI();
      if (lim3s1.apples >= 100) {
        show(S.lim3s1.end);
        playLottie("emoji_happy-star",S.lim3s1.end);
      }
    } //else playLottie("emoji-sad");
  });
  onClick("Group_804-2", () =>
    toggleLim3Solution("Group_804-2", "Show_Answer"),
  );
  onClick("Group_1-3", resetLim3s1);
  onClick("Continue-7", () => {
    stopLottie();
    navHistory.push(S.lim3s1);
    hideAll();
    resetLim3s2();
    show(S.lim3s2.base);
    show(S.home_buttom); show(S.back_button); updateNavButtons();
  });

  // SC2 Transitions & Buttons
  wireTradeBtn("Trade_Cow_Chickens-2", () => {
    if (lim3s2.cows > 0) {
      lim3s2.cows--;
      lim3s2.chickens += lim3Rates.cow;
      updateLim3s2UI();
    } // else playLottie("emoji-sad");
  });
  wireTradeBtn("Trade_Chickens_Breads-2", () => {
    if (lim3s2.chickens > 0) {
      lim3s2.chickens--;
      lim3s2.breads += lim3Rates.chicken;
      updateLim3s2UI();
      if (lim3s2.chickens === 0 && lim3s2.cows === 0 && lim3s2.breads < 50) {
        // playLottie("emoji-sad");
        // setTimeout(() => {
        //   stopLottie();
        //   show(S.lim3s2.end);
        // }, 800);
        show(S.lim3s2.end);
        playLottie("emoji-sad");
      } else if (lim3s2.breads >= 50) {
        // Technically user could win if logic allowed, but SC2 is designed to fail.
        // We'll just check for failure as requested.
      }
    } // else playLottie("emoji-sad");
  });
  wireTradeBtn("Trade_Breads_Apples-2", () => {
    if (lim3s2.breads > 0) {
      lim3s2.breads--;
      lim3s2.apples += lim3Rates.bread;
      updateLim3s2UI();
    } else playLottie("emoji-sad");
  });
  onClick("Group_804-3", () =>
    toggleLim3Solution2("Group_804-3", "Show_Answer-2"),
  );
  onClick("Group_1-4", resetLim3s2);
  onClick("Continue-sc2-fail", () => {
    stopLottie();
    navHistory.push(S.lim3s2);
    hideAll();
    resetLim3s2();
    show(S.conclusion);
    show(S.home_buttom); 
    hide(S.back_button);
    hide(S.next_button); // conclusion is the last screen
  });

  // Move to conclusion path from successful SC1 or somewhere else (if needed)
  // For now, let's say SC2 end popup (which is failure) has a "Try Again"
  // and we might need a way to reach the Conclusion from Lim3 overall.
  // If user finishes SC1, they go to SC2. If they fail SC2, they retry.
  // I'll add a 'See Solution' or 'Conclusion' button to the failure popup if needed,
  // but the plan says Challenge 2 is 'fail on 50 Breads'.
  // Usually these games have a path to the final conclusion.

  // Let's add a "Continue to Conclusion" to S.lim3s1.end if SC2 was optional,
  // but here we sequence them.
  // I'll add a 'Finish' button logic or just assume sc2 retractable.

  // Wire Conclusion discover button
  onClick("Rectangle_436-2-2", () => {
    hide(S.solution);
    showingSolution = false;
  });
  onClick("Group_1497-2", () => {
    hide(S.solution);
    showingSolution = false;
  }); // Close X on solution popup

  // ═══════════════════════════════════════════════════════════
  //  CONCLUSION — Discover the Solution
  // ═══════════════════════════════════════════════════════════
  onClick("Click_here_to_discover_the_solution.", () => show(S.solution));
  onClick("Group_804-5", () => show(S.solution));
  function wireClose(popup) {
    if (!popup) return;
    const closeBtn =
      $q('[id^="Group_1498"]', popup) || $q('[data-name*="Close"]', popup);
    if (closeBtn) {
      ptr(closeBtn);
      closeBtn.addEventListener("click", () => hide(popup));
    }
  }
  wireClose(S.solution);
  wireClose(S.insights);

  $qa('[id^="Insights"]').forEach((btn) => {
    if (btn.id === "insights-popup") return;
    ptr(btn);
    btn.addEventListener("click", () => show(S.insights));
  });

  // Initialise lim3 UI immediately so inventory values are correct on first load
  updateLim3s1UI();
});
