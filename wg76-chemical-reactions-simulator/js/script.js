document.addEventListener("DOMContentLoaded", () => {

  // ─── Reaction configuration ──────────────────────────────────────────────────
  // reactantIds: the element ids (inside the reactant group) that must ALL be
  // clicked before the Start Reaction button is enabled.

  const reactionConfig = [
    {
      tabId:           "combination-reaction",
      reactantGroupId: "combination-reaction-reactant",
      reactantIds:     ["h2", "o2"],          // 2 required
    },
    {
      tabId:           "decomposition-reaction",
      reactantGroupId: "decomposition-reaction-reactant",
      reactantIds:     ["CaCO3"],             // 1 required
    },
    {
      tabId:           "displacement-reaction",
      reactantGroupId: "displacement-reaction-reactant",
      reactantIds:     ["Zn", "CuSO4"],       // 2 required
    },
    {
      tabId:           "double-displacement-reaction",
      reactantGroupId: "double-displacement-reaction-ractant", // typo in HTML kept
      reactantIds:     ["AgNO3", "NaCl"],     // 2 required
    },
    {
      tabId:           "redox-reaction",
      reactantGroupId: "redox-reaction-reactant",
      reactantIds:     ["AgNO3", "NaCl"],     // 2 required
    },
  ];

  // Tracks which reaction tab is currently selected
  let selectedTabId = null;

  // Tracks which reactants have been clicked per reactant-group
  // key: reactantGroupId, value: Set of clicked reactant ids
  const clickedReactants = {};
  reactionConfig.forEach(({ reactantGroupId }) => {
    clickedReactants[reactantGroupId] = new Set();
  });

  // ─── Lottie animation map ─────────────────────────────────────────────────────
  // Maps each reaction tab id to its corresponding Lottie JSON files.
  // _01 = reactant drop-in, _02 = reaction in progress, _03 = product formed

  const lottieAnimationMap = {
    "combination-reaction":         "./lottie/combi_01.json",
    "decomposition-reaction":       "./lottie/decom_01.json",
    "displacement-reaction":        "./lottie/displace_01.json",
    "double-displacement-reaction": "./lottie/double_displace_01.json",
    "redox-reaction":               "./lottie/redox_01.json",
  };

  // Holds the currently playing Lottie animation instance
  let currentLottieAnim = null;


  // ─── Helpers ─────────────────────────────────────────────────────────────────

  /**
   * Change fill of every <rect>/<path> inside groupEl whose fill is #A5F700
   * (case-insensitive) to targetFill.
   * Used when SELECTING a tab (green → white).
   */
  function setTabFill(groupEl, targetFill) {
    const greenPattern = /^#a5f700$/i;
    groupEl.querySelectorAll("rect, path").forEach((el) => {
      const f = el.getAttribute("fill");
      if (f && greenPattern.test(f.trim())) {
        el.setAttribute("fill", targetFill);
      }
    });
  }

  /**
   * Restore fill of every <rect>/<path> inside groupEl whose fill is #fff
   * back to #A5F700.
   * Used when RESETTING a tab (white → green).
   */
  function restoreTabFill(groupEl) {
    const whitePattern = /^#fff(fff)?$/i;  // matches #fff and #ffffff
    groupEl.querySelectorAll("rect, path").forEach((el) => {
      const f = el.getAttribute("fill");
      if (f && whitePattern.test(f.trim())) {
        el.setAttribute("fill", "#A5F700");
      }
    });
  }

  /**
   * Walk up the DOM from `el` to find the nearest ancestor whose id is a
   * known reactant group id. Returns that group id or null.
   */
  function getReactantGroupIdFromTarget(el) {
    const groupIds = reactionConfig.map((c) => c.reactantGroupId);
    let node = el;
    while (node && node !== document.body) {
      if (groupIds.includes(node.id)) return node.id;
      node = node.parentElement;
    }
    return null;
  }

  /**
   * Set the stroke colour on the border <rect> (fill="none" + has a stroke attr)
   * inside the given reactant <g> element.
   */
  function setReactantStroke(reactantEl, strokeColor) {
    // The border rect is the one with fill="none" and a stroke attribute
    const borderRect = reactantEl.querySelector('rect[fill="none"][stroke]');
    if (borderRect) borderRect.setAttribute("stroke", strokeColor);
  }

  /**
   * Reset stroke of every reactant button across ALL groups back to the
   * original colour (#97ba1e).
   */
  function resetAllReactantStrokes() {
    reactionConfig.forEach(({ reactantIds, reactantGroupId }) => {
      const groupEl = document.getElementById(reactantGroupId);
      if (!groupEl) return;
      reactantIds.forEach((rid) => {
        // querySelectorAll handles duplicate ids in SVG
        groupEl.querySelectorAll(`#${rid}`).forEach((el) => {
          setReactantStroke(el, "#97ba1e");
        });
      });
    });
  }

  /**
   * Check whether all required reactants for the currently selected reaction
   * have been clicked. If yes, enable the Start Reaction button.
   */
  function checkAndEnableStartButton() {
    if (!selectedTabId) return;

    const config = reactionConfig.find((c) => c.tabId === selectedTabId);
    if (!config) return;

    const clicked  = clickedReactants[config.reactantGroupId];
    const allDone  = config.reactantIds.every((rid) => clicked.has(rid));

    const startBtn = document.getElementById("start-reaction-btn");
    if (startBtn) {
      startBtn.style.opacity = allDone ? "1" : "0.4";
      startBtn.style.cursor  = allDone ? "pointer" : "not-allowed";
    }
  }


  // ─── Reaction tab click handlers ─────────────────────────────────────────────

  function activateReaction(tabId) {
    selectedTabId = tabId;

    // Reset the start button since the reaction changed
    const startBtn = document.getElementById("start-reaction-btn");
    if (startBtn) {
      startBtn.style.opacity = "0.4";
      startBtn.style.cursor  = "not-allowed";
    }

    // Enable the Reset button now that a reaction is selected
    const resetBtn = document.getElementById("reset-btn");
    if (resetBtn) {
      resetBtn.style.opacity = "1";
      resetBtn.style.cursor  = "pointer";
    }

    // Reset clicked-reactant tracking for the newly selected group
    const config = reactionConfig.find((c) => c.tabId === tabId);
    if (config) {
      clickedReactants[config.reactantGroupId] = new Set();
    }

    // Reset all reactant stroke colours (deselect any previously highlighted buttons)
    resetAllReactantStrokes();

    // Update all tab fills and reactant group filters
    reactionConfig.forEach(({ tabId: tid, reactantGroupId }) => {
      const tabEl      = document.getElementById(tid);
      const reactantEl = document.getElementById(reactantGroupId);

      if (tid === tabId) {
        if (tabEl)      setTabFill(tabEl, "#fff");
        if (reactantEl) reactantEl.style.filter = "none";
      } else {
        if (tabEl)      restoreTabFill(tabEl);   // #fff → #A5F700 (deselect previous tab)
        if (reactantEl) reactantEl.style.filter = "brightness(0.5)";
      }
    });
  }

  reactionConfig.forEach(({ tabId }) => {
    const tabEl = document.getElementById(tabId);
    if (tabEl) {
      tabEl.style.cursor = "pointer";
      tabEl.addEventListener("click", () => activateReaction(tabId));
    }
  });


  // ─── Reactant click handlers ──────────────────────────────────────────────────

  /**
   * Attach click listeners to every element matching `#cssId` (querySelectorAll
   * handles duplicate ids in SVG gracefully). On click:
   *  - Record this reactant as clicked in the correct group's Set
   *  - Check if all required reactants are now clicked → enable Start button
   */
  function attachReactantHandler(cssId) {
    document.querySelectorAll(`#${cssId}`).forEach((el) => {
      el.style.cursor = "pointer";
      el.addEventListener("click", (e) => {
        e.stopPropagation();

        // Find which reactant group this element belongs to
        const groupId = getReactantGroupIdFromTarget(el);
        if (!groupId) return;

        // Mark this reactant as clicked
        clickedReactants[groupId].add(cssId);

        // Highlight this reactant button with the selected stroke colour
        setReactantStroke(el, "#00d5ff");

        // Only evaluate the button if this group belongs to the selected reaction
        const activeConfig = reactionConfig.find((c) => c.tabId === selectedTabId);
        if (activeConfig && activeConfig.reactantGroupId === groupId) {
          checkAndEnableStartButton();
        }
      });
    });
  }

  // All reactant button ids across all reactions
  // (h2, o2 → combination | CaCO3 → decomposition |
  //  Zn, CuSO4 → displacement | AgNO3, NaCl → double-displacement & redox)
  ["h2", "o2", "CaCO3", "Zn", "CuSO4", "AgNO3", "NaCl"].forEach(attachReactantHandler);


  // ─── Start Reaction button → play Lottie animation ────────────────────────────

  /**
   * Destroy any running Lottie animation, then load and play the one that
   * corresponds to the currently selected reaction.
   */
  function playReactionAnimation() {
    if (!selectedTabId) return;

    const jsonPath = lottieAnimationMap[selectedTabId];
    if (!jsonPath) return;

    const container = document.getElementById("lottie-animation");
    if (!container) return;

    // Destroy previous animation cleanly
    if (currentLottieAnim) {
      currentLottieAnim.destroy();
      currentLottieAnim = null;
    }

    // Load and autoplay the new animation using the globally available lottie object
    currentLottieAnim = lottie.loadAnimation({
      container,
      renderer:  "svg",
      loop:      false,
      autoplay:  true,
      path:      jsonPath,
    });
  }

  const startBtn = document.getElementById("start-reaction-btn");
  if (startBtn) {
    startBtn.addEventListener("click", () => {
      // Only fire when the button is fully active (opacity = 1)
      if (startBtn.style.opacity === "1") {
        playReactionAnimation();
      }
    });
  }


  // ─── Reset button ─────────────────────────────────────────────────────────────

  /**
   * Fully resets all widget state back to the initial condition:
   * - Clears selected reaction
   * - Restores all tab fills to green (#A5F700)
   * - Restores all reactant group brightness filters
   * - Resets all reactant button stroke colours
   * - Clears all clicked-reactant tracking Sets
   * - Dims the Start Reaction button
   * - Dims the Reset button itself
   * - Destroys any playing Lottie animation
   */
  function resetAll() {
    // Clear selection
    selectedTabId = null;

    // Restore all tab fills → green (#A5F700)
    // restoreTabFill() targets the #fff fills set during selection,
    // which setTabFill() cannot find (it only matches #A5F700 fills).
    reactionConfig.forEach(({ tabId, reactantGroupId }) => {
      const tabEl      = document.getElementById(tabId);
      const reactantEl = document.getElementById(reactantGroupId);
      if (tabEl)      restoreTabFill(tabEl);
      if (reactantEl) reactantEl.style.filter = "brightness(0.5)";
    });

    // Reset all reactant stroke colours
    resetAllReactantStrokes();

    // Clear all clicked-reactant Sets
    reactionConfig.forEach(({ reactantGroupId }) => {
      clickedReactants[reactantGroupId] = new Set();
    });

    // Dim Start Reaction button
    const startBtn = document.getElementById("start-reaction-btn");
    if (startBtn) {
      startBtn.style.opacity = "0.4";
      startBtn.style.cursor  = "not-allowed";
    }

    // Dim Reset button
    const resetBtn = document.getElementById("reset-btn");
    if (resetBtn) {
      resetBtn.style.opacity = "0.4";
      resetBtn.style.cursor  = "not-allowed";
    }

    // Destroy any running Lottie animation and clear the container
    if (currentLottieAnim) {
      currentLottieAnim.destroy();
      currentLottieAnim = null;
    }
    const lottieContainer = document.getElementById("lottie-animation");
    if (lottieContainer) lottieContainer.innerHTML = "";
  }

  const resetBtn = document.getElementById("reset-btn");
  if (resetBtn) {
    resetBtn.style.cursor = "not-allowed";
    resetBtn.addEventListener("click", () => {
      // Only fire when the button is active (opacity = 1)
      if (resetBtn.style.opacity === "1") {
        resetAll();
      }
    });
  }

});
