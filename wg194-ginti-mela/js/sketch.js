document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const lanternElements = Array.from(document.querySelectorAll(".lantern-div"));
  const starPaths = Array.from(document.querySelectorAll("#star-panel path"));
  const dropdown = document.getElementById("find-word");
  const newGridBtn = document.querySelector(".new-grid-btn");
  const showAnsBtn = document.getElementById("show-ans-btn");
  const hintCardWrapper = document.getElementById("hint-img");
  const hintCardImg = document.getElementById("hint-card-image");
  const hintPrompt = document.getElementById("hint-tap-prompt");
  const hintQuestion = document.getElementById("questions");

  // State
  let currentCategory = "word-match"; // 'word-match' or 'sequence'
  let current16Numbers = []; // array of 16 string keys ("1"-"100")
  let current5TargetNumbers = []; // array of 5 string keys ("1"-"100")
  let currentQuestionIndex = 0; // 0 to 4
  let isHintRevealed = false;
  let isProcessingAnswer = false;

  // Sound effects helper using Web Audio API
  function playSound(type) {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (type === "flip") {
        osc.type = "sine";
        osc.frequency.setValueAtTime(400, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(700, ctx.currentTime + 0.12);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.12);
        osc.start();
        osc.stop(ctx.currentTime + 0.12);
      } else if (type === "correct") {
        osc.type = "triangle";
        osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
        osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.1); // E5
        osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.2); // G5
        gain.gain.setValueAtTime(0.2, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.35);
        osc.start();
        osc.stop(ctx.currentTime + 0.35);
      } else if (type === "wrong") {
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(220, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(140, ctx.currentTime + 0.2);
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
        osc.start();
        osc.stop(ctx.currentTime + 0.2);
      } else if (type === "win") {
        const notes = [523.25, 659.25, 783.99, 1046.5];
        notes.forEach((freq, i) => {
          const o = ctx.createOscillator();
          const g = ctx.createGain();
          o.type = "triangle";
          o.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.12);
          g.gain.setValueAtTime(0.18, ctx.currentTime + i * 0.12);
          g.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.12 + 0.25);
          o.connect(g);
          g.connect(ctx.destination);
          o.start(ctx.currentTime + i * 0.12);
          o.stop(ctx.currentTime + i * 0.12 + 0.25);
        });
      }
    } catch (e) {
      // Ignore audio context errors if browser audio policy restricts it
    }
  }

  // Shuffle array helper
  function shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // Get current category from dropdown
  function getSelectedCategory() {
    const val = dropdown ? dropdown.value : "";
    if (val === "क्रम" || val === "sequence") {
      return "sequence";
    }
    return "word-match";
  }

  // Generate 16 unique random numbers between 1 and 100
  function pick16UniqueNumbers() {
    const allNumbers = [];
    for (let i = 1; i <= 100; i++) {
      allNumbers.push(String(i));
    }
    return shuffle(allNumbers).slice(0, 16);
  }

  // Pick 5 unique numbers strictly from the 16 numbers in the current grid
  function pick5TargetNumbers(sixteenList) {
    return shuffle(sixteenList).slice(0, 5);
  }

  // Reset hint card to initial front view
  function resetCardToFront() {
    isHintRevealed = false;
    if (hintCardImg) {
      hintCardImg.src = "./assets/images/hint-card-front.svg";
    }
    if (hintPrompt) {
      hintPrompt.style.display = "block";
      hintPrompt.textContent = "हिंट देखने के लिए यहाँ टैप करें 👆";
    }
    if (hintQuestion) {
      hintQuestion.style.display = "none";
      hintQuestion.textContent = "";
    }
    if (showAnsBtn) {
      showAnsBtn.disabled = true;
    }
  }

  // Reveal hint card with hint-card-back.svg and show hint text
  function revealHintCard() {
    if (isHintRevealed) return;
    if (currentQuestionIndex >= current5TargetNumbers.length) return;

    playSound("flip");
    isHintRevealed = true;

    if (hintCardImg) {
      hintCardImg.src = "./assets/images/hint-card-back.svg";
    }
    if (hintPrompt) {
      hintPrompt.style.display = "none";
    }
    if (hintQuestion) {
      hintQuestion.style.display = "block";
      updateHintText();
    }
    if (showAnsBtn) {
      showAnsBtn.disabled = false;
    }
  }

  // Update text of the current hint
  function updateHintText() {
    if (currentQuestionIndex >= current5TargetNumbers.length) {
      if (hintQuestion && isHintRevealed) {
        hintQuestion.textContent = "शाबाश! आपने सभी 5 हिंट पूरे कर लिए हैं! 🎉";
      }
      return;
    }
    const currentNumKey = current5TargetNumbers[currentQuestionIndex];
    const categoryData = (typeof NUMBERDATA !== "undefined" && NUMBERDATA[currentCategory]) 
      ? NUMBERDATA[currentCategory] 
      : (typeof NUMBERDATA !== "undefined" ? NUMBERDATA["word-match"] : {});
    const hintObj = categoryData[currentNumKey];

    if (hintQuestion && isHintRevealed) {
      hintQuestion.textContent = hintObj ? hintObj.hint : "";
    }
  }

  // Initialize a new game round
  function initRound() {
    currentCategory = getSelectedCategory();
    currentQuestionIndex = 0;
    isProcessingAnswer = false;

    // 1. Pick 16 unique numbers from numbers json
    current16Numbers = pick16UniqueNumbers();

    // 2. Pick 5 hints that strictly exist in the 16 numbers
    current5TargetNumbers = pick5TargetNumbers(current16Numbers);

    // 3. Populate 16 lanterns
    lanternElements.forEach((lantern, index) => {
      const numKey = current16Numbers[index];
      const devanagari = (typeof numbers !== "undefined" && numbers[numKey]) ? numbers[numKey] : numKey;

      lantern.dataset.number = numKey;
      lantern.dataset.devanagari = devanagari;
      lantern.classList.remove("solved", "correct-pop", "lantern-glow", "lantern-shake");

      const img = lantern.querySelector("img");
      if (img) {
        img.src = "./assets/images/lantern-normal.svg";
      }

      const numSpan = lantern.querySelector(".num-span");
      if (numSpan) {
        numSpan.textContent = devanagari;
      }
    });

    // 4. Reset star panel
    starPaths.forEach((star) => {
      star.classList.remove("active-star");
      star.removeAttribute("class");
    });

    // 5. Reset Hint Card
    resetCardToFront();
  }

  // Handle lantern click
  function onLanternClick(e) {
    if (isProcessingAnswer) return;
    if (currentQuestionIndex >= current5TargetNumbers.length) return;

    const lantern = e.currentTarget;
    if (lantern.classList.contains("solved")) return;

    // If hint is not revealed yet, prompt user to tap the card first
    if (!isHintRevealed) {
      if (hintCardWrapper) {
        hintCardWrapper.classList.add("shake");
        setTimeout(() => hintCardWrapper.classList.remove("shake"), 500);
      }
      if (hintPrompt) {
        hintPrompt.textContent = "पहले कार्ड पर टैप करके हिंट देखें! 👆";
      }
      return;
    }

    const clickedDevanagari = lantern.dataset.devanagari;
    const targetKey = current5TargetNumbers[currentQuestionIndex];
    const categoryData = (typeof NUMBERDATA !== "undefined" && NUMBERDATA[currentCategory]) 
      ? NUMBERDATA[currentCategory] 
      : (typeof NUMBERDATA !== "undefined" ? NUMBERDATA["word-match"] : {});
    const currentHintObj = categoryData[targetKey];
    const expectedAnswer = currentHintObj 
      ? currentHintObj.answer 
      : ((typeof numbers !== "undefined" && numbers[targetKey]) ? numbers[targetKey] : targetKey);

    // Check match
    if (clickedDevanagari === expectedAnswer) {
      // Correct!
      isProcessingAnswer = true;
      playSound("correct");

      const img = lantern.querySelector("img");
      if (img) {
        img.src = "./assets/images/lantern-correct.svg";
      }
      lantern.classList.add("solved", "correct-pop");
      lantern.classList.remove("lantern-glow");

      setTimeout(() => {
        lantern.classList.remove("correct-pop");
      }, 350);

      // Light up star
      if (starPaths[currentQuestionIndex]) {
        starPaths[currentQuestionIndex].classList.add("active-star");
      }

      setTimeout(() => {
        currentQuestionIndex++;
        isProcessingAnswer = false;

        if (currentQuestionIndex < current5TargetNumbers.length) {
          // Next question: card resets to front and hint is hidden until clicked
          resetCardToFront();
        } else {
          // All 5 completed!
          playSound("win");
          if (hintCardImg) {
            hintCardImg.src = "./assets/images/hint-card-back.svg";
          }
          if (hintPrompt) {
            hintPrompt.style.display = "none";
          }
          if (hintQuestion) {
            hintQuestion.style.display = "block";
            hintQuestion.textContent = "शानदार! आपने सभी 5 हिंट हल कर लिए! 🌟🌟🌟🌟🌟";
          }
          if (showAnsBtn) {
            showAnsBtn.disabled = true;
          }
        }
      }, 900);
    } else {
      // Incorrect!
      playSound("wrong");
      lantern.classList.add("lantern-shake");
      const img = lantern.querySelector("img");
      if (img) {
        img.src = "./assets/images/lantern-incorrect.svg";
      }

      setTimeout(() => {
        lantern.classList.remove("lantern-shake");
        if (img && !lantern.classList.contains("solved")) {
          img.src = "./assets/images/lantern-normal.svg";
        }
      }, 600);
    }
  }

  // Handle "उत्तर दिखाएँ" (Show Answer)
  function onShowAnswerClick() {
    if (!isHintRevealed || currentQuestionIndex >= current5TargetNumbers.length) return;

    const targetKey = current5TargetNumbers[currentQuestionIndex];
    const categoryData = (typeof NUMBERDATA !== "undefined" && NUMBERDATA[currentCategory]) 
      ? NUMBERDATA[currentCategory] 
      : (typeof NUMBERDATA !== "undefined" ? NUMBERDATA["word-match"] : {});
    const currentHintObj = categoryData[targetKey];
    const expectedAnswer = currentHintObj 
      ? currentHintObj.answer 
      : ((typeof numbers !== "undefined" && numbers[targetKey]) ? numbers[targetKey] : targetKey);

    // Find the matching lantern and highlight it
    lanternElements.forEach((lantern) => {
      if (lantern.dataset.devanagari === expectedAnswer) {
        lantern.classList.add("lantern-glow");
        setTimeout(() => {
          lantern.classList.remove("lantern-glow");
        }, 2200);
      }
    });
  }

  // Event Listeners
  if (hintCardWrapper) {
    hintCardWrapper.addEventListener("click", revealHintCard);
  }

  if (dropdown) {
    dropdown.addEventListener("change", () => {
      // When dropdown changes, reset grid and target hints to new selection
      initRound();
    });
  }

  if (newGridBtn) {
    newGridBtn.addEventListener("click", () => {
      initRound();
    });
  }

  if (showAnsBtn) {
    showAnsBtn.addEventListener("click", onShowAnswerClick);
  }

  lanternElements.forEach((lantern) => {
    lantern.addEventListener("click", onLanternClick);
  });

  // Start initial game round
  initRound();
});
