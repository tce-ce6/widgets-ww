document.addEventListener("DOMContentLoaded", () => {
  const pickCardButton = document.getElementById("pick_a_card_button");
  const pickACardSection = document.getElementById("pick-a-card");
  const wdgetTitle = document.getElementById("wdgetTitle");
  const iText = document.getElementById("i-text");
  const visualPanel = document.getElementById("visual-panel");
  const audioButton = document.getElementById("audio_button");
  const activityBox = document.getElementById("activityBox");
  const homeIcon = document.getElementById("home_icon");
  const textInPanel = document.getElementById("text_in_panel");
  const blankCard = document.getElementById("Rectangle_369");
  const showAnswerButton = document.getElementById("show_answer_button");
  const nextButton = document.getElementById("next_button");

  const animalIds = [
    "cow", "rooster", "sheep", "pig", "horse", "dog", "cat", "wolf",
    "tiger", "goat", "lion", "snake", "monkey", "duck", "frog",
    "owl", "parrot", "whale", "bear", "hyena", "elephant",
    "squirrel", "hen", "eagle", "donkey", "crow"
  ];

  const animalData = {
    pig: { audio: "assets/Audio/Pigs_snort_%231-1771997725764.mp3", text: "Pigs snort." },
    cow: { audio: "assets/Audio/Cows_moo_%233-1771997142880.mp3", text: "Cows moo." },
    sheep: { audio: "assets/Audio/Sheep_bleat_%232-1771997633719.mp3", text: "Sheep bleat." },
    rooster: { audio: "assets/Audio/Roosters_crow_%232-1771997216064.mp3", text: "Roosters crow." },
    horse: { audio: "assets/Audio/Horses_neigh_%231-1771997775887.mp3", text: "Horses neigh." },
    dog: { audio: "assets/Audio/Dogs_bark_%231-1771997830956.mp3", text: "Dogs bark." },
    cat: { audio: "assets/Audio/Cats_miaow_%233-1771997919879.mp3", text: "Cats miaow." },
    wolf: { audio: "assets/Audio/Wolves_howl_%233-1771995883562.mp3", text: "Wolves howl." },
    tiger: { audio: "assets/Audio/Tiger's_roar-Elevenlabs.mp3", text: "Tigers roar." },
    goat: { audio: "assets/Audio/Goats_bleat_%231-1771996009412.mp3", text: "Goats bleat." },
    lion: { audio: "assets/Audio/Lion's_roar-Elevenlabs.mp3", text: "Lions roar." },
    snake: { audio: "assets/Audio/Snakes_hiss_%231-1771996128543.mp3", text: "Snakes hiss." },
    monkey: { audio: "assets/Audio/Monkeys-chatter-Elevenlabs.mp3", text: "Monkeys chatter." },
    duck: { audio: "assets/Audio/Ducks quack.mp3", text: "Ducks quack." },
    frog: { audio: "assets/Audio/Frogs_croak_%231-1771997017176.mp3", text: "Frogs croak." },
    owl: { audio: "assets/Audio/Owls_hoot_%231-1771996782198.mp3", text: "Owls hoot." },
    parrot: { audio: "assets/Audio/Parrots_squawk_%232-1771996973755.mp3", text: "Parrots squawk." },
    whale: { audio: "assets/Audio/Whales_sing_%231-1771999176103.mp3", text: "Whales sing." },
    bear: { audio: "assets/Audio/Bears_roar_%232-1771999227968.mp3", text: "Bears roar." },
    hyena: { audio: "assets/Audio/Hyenas_laugh_%233-1771999589081.mp3", text: "Hyenas laugh." },
    elephant: { audio: "assets/Audio/Elephants_trumpet_%233-1771999686126.mp3", text: "Elephants trumpet." },
    squirrel: { audio: "assets/Audio/Squirrels_chirp_%231-1771999740818.mp3", text: "Squirrels chirp." },
    hen: { audio: "assets/Audio/Hens_cluck_%233-1771999819991.mp3", text: "Hens cluck." },
    eagle: { audio: "assets/Audio/Eagles_screech_%231-1771999937702.mp3", text: "Eagles screech." },
    donkey: { audio: "assets/Audio/Donkeys_bray_%232-1771933129832.mp3", text: "Donkeys bray." },
    crow: { audio: "assets/Audio/Crows_caw._%232-1771997972100.mp3", text: "Crows caw." }
  };

  const animalBBoxes = {
    bear: { cx: 311.08, cy: 490.94 },
    cat: { cx: 301.17, cy: 509.81 },
    cow: { cx: 315.24, cy: 519.27 },
    crow: { cx: 311.76, cy: 503.16 },
    dog: { cx: 306.58, cy: 536.39 },
    donkey: { cx: 304.15, cy: 496.01 },
    duck: { cx: 308.46, cy: 494.89 },
    eagle: { cx: 295.81, cy: 500.45 },
    elephant: { cx: 310.40, cy: 533.01 },
    frog: { cx: 308.40, cy: 512.47 },
    goat: { cx: 296.08, cy: 491.72 },
    hen: { cx: 300.96, cy: 509.97 },
    horse: { cx: 309.47, cy: 507.42 },
    hyena: { cx: 312.82, cy: 496.58 },
    lion: { cx: 307.60, cy: 511.72 },
    monkey: { cx: 312.05, cy: 490.49 },
    owl: { cx: 315.46, cy: 490.23 },
    parrot: { cx: 302.79, cy: 485.52 },
    pig: { cx: 300.35, cy: 505.51 },
    rooster: { cx: 309.50, cy: 493.50 },
    sheep: { cx: 311.68, cy: 504.33 },
    snake: { cx: 312.21, cy: 491.55 },
    squirrel: { cx: 309.50, cy: 505.07 },
    tiger: { cx: 305.85, cy: 524.80 },
    whale: { cx: 306.38, cy: 511.18 },
    wolf: { cx: 313.90, cy: 498.92 }
  };

  let targetAnimalKey = null;
  let selectedAnimalKey = null;
  let currentAudio = null;
  let trayAnimals = [];
  let lastTargetKey = null;

  const gameCases = [
    { target: "cow", distractors: ["pig", "sheep"], text: "Cows moo." },
    { target: "rooster", distractors: ["cow", "hen"], text: "Roosters crow." },
    { target: "sheep", distractors: ["pig", "cow"], text: "Sheep bleat." },
    { target: "pig", distractors: ["hen", "dog"], text: "Pigs snort." },
    { target: "horse", distractors: ["crow", "cat"], text: "Horses neigh." },
    { target: "dog", distractors: ["cow", "wolf"], text: "Dogs bark." },
    { target: "cat", distractors: ["rooster", "tiger"], text: "Cats miaow." },
    { target: "crow", distractors: ["cow", "pig"], text: "Crows caw." },
    { target: "donkey", distractors: ["horse", "dog"], text: "Donkeys bray." },
    { target: "wolf", distractors: ["tiger", "snake"], text: "Wolves howl." },
    { target: "tiger", distractors: ["hyena", "bear"], text: "Tigers roar." },
    { target: "goat", distractors: ["sheep", "horse"], text: "Goats bleat." },
    { target: "lion", distractors: ["snake", "wolf"], text: "Lions roar." },
    { target: "snake", distractors: ["owl", "frog"], text: "Snakes hiss." },
    { target: "monkey", distractors: ["duck", "snake"], text: "Monkeys chatter." },
    { target: "duck", distractors: ["hen", "parrot"], text: "Ducks quack." },
    { target: "owl", distractors: ["eagle", "crow"], text: "Owls hoot." },
    { target: "parrot", distractors: ["duck", "eagle"], text: "Parrots squawk." },
    { target: "frog", distractors: ["snake", "duck"], text: "Frogs croak." },
    { target: "whale", distractors: ["bear", "cat"], text: "Whales sing." },
    { target: "bear", distractors: ["wolf", "horse"], text: "Bears roar." },
    { target: "hyena", distractors: ["lion", "monkey"], text: "Hyenas laugh." },
    { target: "elephant", distractors: ["cow", "monkey"], text: "Elephants trumpet." },
    { target: "squirrel", distractors: ["monkey", "parrot"], text: "Squirrels chirp." },
    { target: "hen", distractors: ["eagle", "duck"], text: "Hens cluck." },
    { target: "eagle", distractors: ["duck", "parrot"], text: "Eagles screech." }
  ];

  let remainingCases = [];

  const traySlotIds = ["option-01-patch", "option-02-patch", "option-03-patch"];

  function resetGame() {
    const hideInitially = [
      iText, visualPanel, audioButton, activityBox,
      nextButton, textInPanel, ...animalIds.map(id => document.getElementById(id))
    ];
    hideInitially.forEach(el => { if (el) el.style.display = "none"; });

    if (wdgetTitle) wdgetTitle.style.display = "block";
    if (pickACardSection) pickACardSection.style.display = "block";
    if (pickCardButton) pickCardButton.style.display = "block";

    if (showAnswerButton) {
      showAnswerButton.style.display = "none";
      showAnswerButton.classList.remove("disabled-btn");
      showAnswerButton.style.pointerEvents = "auto";
    }

    targetAnimalKey = null;
    selectedAnimalKey = null;
    trayAnimals = [];

    // Clear dynamic icons and borders
    traySlotIds.forEach(slotId => {
      const slotEl = document.getElementById(slotId);
      if (slotEl) {
        slotEl.classList.remove("vibrate", "incorrect-border");
        const injected = slotEl.querySelector(".dynamic-tray-icon");
        if (injected) injected.remove();

        // Reset original border color on Rectangle_6 (white background)
        const outerCard = slotEl.querySelector("rect[id^='Rectangle_6']");
        if (outerCard) {
          outerCard.setAttribute("stroke", "none");
          outerCard.setAttribute("stroke-width", "0");
        }
        // Also reset Rectangle_7 just in case
        const border = slotEl.querySelector("g[id^='Rectangle_7'] rect[stroke]");
        if (border) {
          border.setAttribute("stroke", "#7b6bff");
          border.setAttribute("stroke-width", "3");
        }
      }
    });

    if (currentAudio) {
      currentAudio.pause();
      currentAudio = null;
    }

    // Re-enable tray cards interactivity
    traySlotIds.forEach(slotId => {
      const slotEl = document.getElementById(slotId);
      if (slotEl) {
        slotEl.style.pointerEvents = "all";
      }
    });
  }

  function setupTray() {
    if (!targetAnimalKey) {
      if (remainingCases.length === 0) {
        remainingCases = [...gameCases].sort(() => Math.random() - 0.5);
      }
      const currentCase = remainingCases.pop();
      targetAnimalKey = currentCase.target;
      lastTargetKey = targetAnimalKey;

      // Update text and sound for the picked target
      // The animalData object is still used for audio assets
      const distractors = currentCase.distractors;
      trayAnimals = [targetAnimalKey, ...distractors].sort(() => Math.random() - 0.5);
    }

    // Populate the 3 tray slots
    traySlotIds.forEach((slotId, index) => {
      const slotEl = document.getElementById(slotId);
      if (!slotEl) return;

      // Ensure visibility of the slot itself
      slotEl.style.display = "block";
      slotEl.classList.remove("incorrect-border", "vibrate", "disabled-btn", "fade-out");

      // Clear existing animal icons (pig-option, cow-option, sheep-option)
      const existingIcons = ["pig-option", "cow-option", "sheep-option"];
      existingIcons.forEach(id => {
        const el = document.getElementById(id);
        if (el && el.parentElement === slotEl) el.style.display = "none";
      });

      // Remove previously injected dynamic icons
      const prevInjected = slotEl.querySelector(".dynamic-tray-icon");
      if (prevInjected) prevInjected.remove();

      // Clone new icon from visual-panel
      const animalKey = trayAnimals[index];
      const sourceEl = document.getElementById(animalKey);
      if (!sourceEl) return;

      const clone = sourceEl.cloneNode(true);
      clone.setAttribute("class", "dynamic-tray-icon");
      clone.id = ""; // Remove ID to avoid duplicates
      clone.style.display = "block";
      clone.style.opacity = "1";

      // Calculate precise centering transform
      // Slot centers based on Rectangle_6 x + width/2: Slot 1 CX=832.34, Slot 2 CX=1240.38, Slot 3 CX=1648.42
      const bbox = animalBBoxes[animalKey] || { cx: 308, cy: 505 };
      let slotCX = 0;
      if (slotId === "option-01-patch") slotCX = 832.34;
      if (slotId === "option-02-patch") slotCX = 1240.38;
      if (slotId === "option-03-patch") slotCX = 1648.42;
      const slotCY = 536.4;

      const tx = slotCX - 0.8 * bbox.cx;
      const ty = slotCY - 0.8 * bbox.cy;
      console.log(animalKey, "To check for wolf image scenario")
      if (animalKey === 'wolf') {
        clone.setAttribute("transform", `translate(${tx + 110}, ${ty + 250}) scale(0.9)`);

      } else {
        clone.setAttribute("transform", `translate(${tx}, ${ty}) scale(0.8)`);

      }


      slotEl.appendChild(clone);

      // Make the entire slot interactive (both patch and animal)
      slotEl.style.cursor = "pointer";
      slotEl.style.pointerEvents = "none";

      // Clear existing listeners by cloning and replacing
      const freshSlot = slotEl.cloneNode(true);
      slotEl.parentNode.replaceChild(freshSlot, slotEl);

      freshSlot.addEventListener("click", () => {
        if (targetAnimalKey === animalKey) {
          revealSuccess();
        } else {
          // Incorrect - Vibrate and show red border on outer patch (Rectangle_6)
          freshSlot.classList.add("vibrate");
          const outerCard = freshSlot.querySelector("rect[id^='Rectangle_6']");
          if (outerCard) {
            outerCard.setAttribute("stroke", "#FF0000");
            outerCard.setAttribute("stroke-width", "10");
          }

          setTimeout(() => {
            freshSlot.classList.remove("vibrate");
            if (outerCard) {
              outerCard.setAttribute("stroke", "none");
              outerCard.setAttribute("stroke-width", "0");
            }
          }, 500);
        }
      });
    });
  }

  function adjustFontSize(element, maxFontSize, maxWidth) {
    let fontSize = maxFontSize;
    element.setAttribute("font-size", fontSize);
    while (element.getComputedTextLength() > maxWidth && fontSize > 10) {
      fontSize -= 1;
      element.setAttribute("font-size", fontSize);
    }
  }

  resetGame();

  if (pickCardButton) {
    pickCardButton.style.cursor = "pointer";
    pickCardButton.addEventListener("click", () => {
      if (pickACardSection) pickACardSection.style.display = "none";
      if (pickCardButton) pickCardButton.style.display = "none";

      if (iText) iText.style.display = "block";
      if (visualPanel) visualPanel.style.display = "block";
      if (audioButton) audioButton.style.display = "block";
      if (activityBox) activityBox.style.display = "block";
      if (showAnswerButton) {
        showAnswerButton.style.display = "block";
        showAnswerButton.setAttribute("transform", "translate(-170, 0)");
        showAnswerButton.classList.add("disabled-btn");
        showAnswerButton.style.pointerEvents = "none";
      }
      if (nextButton) {
        nextButton.style.display = "block";
        nextButton.setAttribute("transform", "translate(170, 0)");
      }

      setupTray();
      selectedAnimalKey = null;
    });
  }

  if (audioButton) {
    audioButton.style.cursor = "pointer";
    audioButton.addEventListener("click", () => {
      if (!targetAnimalKey) {
        setupTray();
      }
      if (currentAudio) currentAudio.pause();
      currentAudio = new Audio(animalData[targetAnimalKey].audio);
      currentAudio.play().catch(e => console.error("Audio play failed:", e));

      if (showAnswerButton) {
        showAnswerButton.classList.remove("disabled-btn");
        showAnswerButton.style.pointerEvents = "auto";
      }

      traySlotIds.forEach(slotId => {
        const slotEl = document.getElementById(slotId);
        if (slotEl) {
          slotEl.style.pointerEvents = "all";
        }
      });
    });
  }

  function revealSuccess(showConfetti = true) {
    if (!targetAnimalKey) return;

    // Show both buttons and shift them side-by-side
    if (showAnswerButton) {
      showAnswerButton.style.display = "block";
      showAnswerButton.setAttribute("transform", "translate(-170, 0)");
      showAnswerButton.classList.add("disabled-btn");
      showAnswerButton.style.pointerEvents = "none";
    }
    if (nextButton) {
      nextButton.style.display = "block";
      nextButton.setAttribute("transform", "translate(170, 0)");
    }

    // Disable all tray slots (RHS cards) and fade out incorrect ones
    traySlotIds.forEach((slotId, index) => {
      const slotEl = document.getElementById(slotId);
      if (slotEl) {
        slotEl.style.pointerEvents = "none";
        if (trayAnimals[index] !== targetAnimalKey) {
          slotEl.classList.add("fade-out");
        } else {
          slotEl.classList.remove("disabled-btn"); // Ensure correct card is fully visible
        }
      }
    });

    // Clear all tray slot borders (remove red borders from incorrect attempts)
    traySlotIds.forEach(slotId => {
      const slotEl = document.getElementById(slotId);
      if (slotEl) {
        const outerCard = slotEl.querySelector("rect[id^='Rectangle_6']");
        if (outerCard) {
          outerCard.setAttribute("stroke", "none");
          outerCard.setAttribute("stroke-width", "0");
        }
      }
    });

    // Show the animal in visual-panel and center it in the large card
    const animalPanelEl = document.getElementById(targetAnimalKey);
    if (animalPanelEl) {
      animalPanelEl.style.display = "block";

      // Center in Card: CardCX=312.85 (Rectangle_369 center), CardCY=488
      const bbox = animalBBoxes[targetAnimalKey] || { cx: 308, cy: 505 };
      const tx = 312.85 - bbox.cx;
      const ty = 488 - bbox.cy;
      animalPanelEl.setAttribute("transform", `translate(${tx}, ${ty})`);
      if (targetAnimalKey === 'wolf') {
        animalPanelEl.setAttribute("transform", `translate(${tx + 125}, ${ty + 330}) scale(1.2)`);


      } else {
        animalPanelEl.setAttribute("transform", `translate(${tx}, ${ty}) `);

      }

    }

    if (textInPanel) {
      textInPanel.style.display = "block";
      const textEl = textInPanel.querySelector("tspan");
      if (textEl) {
        textEl.textContent = animalData[targetAnimalKey].text;

        const textParent = textInPanel.querySelector("text");
        if (textParent) {
          // Center text: Card center is 312.85
          textParent.setAttribute("text-anchor", "middle");
          textParent.setAttribute("transform", "translate(312.85, 807.61)");

          // Clear tspan x if it was set
          textEl.removeAttribute("x");

          adjustFontSize(textParent, 50, 420);
        }
      }
    }

    // Play animal audio
    if (currentAudio) currentAudio.pause();
    currentAudio = new Audio(animalData[targetAnimalKey].audio);
    currentAudio.play().catch(e => console.error("Audio play failed:", e));

    if (showConfetti && window.lottie) {
      const container = document.getElementById("confetti-container");
      if (container) {
        const anim = lottie.loadAnimation({
          container: container,
          renderer: "svg",
          loop: false,
          autoplay: true,
          path: "assets/Animation/confetti-anim.json"
        });
        anim.onComplete = () => { container.innerHTML = ""; };
      }
    }
  }

  if (blankCard) {
    blankCard.style.cursor = "pointer";
    blankCard.addEventListener("click", () => {
      // Logic requirement changed: selecting correct animal automatically moves it.
      // But keeping this as a backup if they tap the card after selecting?
      // Actually, user said "tap correct animal and then taps blank card" in one msg, 
      // but "if user clicks right show animation and move to blank card" in the latest.
      // I'll make it auto-move but allow card click if selected.
      if (selectedAnimalKey === targetAnimalKey) {
        revealSuccess();
      }
    });
  }

  if (showAnswerButton) {
    showAnswerButton.style.cursor = "pointer";
    showAnswerButton.addEventListener("click", () => {
      if (!targetAnimalKey) {
        setupTray();
      }
      revealSuccess(false);
    });
  }

  if (nextButton) {
    nextButton.style.cursor = "pointer";
    nextButton.addEventListener("click", () => {
      // Hide current animal and text
      if (visualPanel) {
        animalIds.forEach(id => {
          const el = document.getElementById(id);
          if (el) el.style.display = "none";
        });
      }
      if (textInPanel) textInPanel.style.display = "none";

      // Reset buttons and positions
      if (showAnswerButton) {
        showAnswerButton.style.display = "block";
        showAnswerButton.setAttribute("transform", "translate(-170, 0)");
        showAnswerButton.classList.add("disabled-btn");
        showAnswerButton.style.pointerEvents = "none";
      }
      if (nextButton) {
        nextButton.style.display = "block";
        nextButton.setAttribute("transform", "translate(170, 0)");
      }

      // Re-enable tray cards interactivity
      traySlotIds.forEach(slotId => {
        const slotEl = document.getElementById(slotId);
        if (slotEl) {
          slotEl.style.pointerEvents = "all";
        }
      });

      // Stop audio
      if (currentAudio) {
        currentAudio.pause();
        currentAudio = null;
      }

      // Pick next animal
      targetAnimalKey = null;
      setupTray();
    });
  }
});
