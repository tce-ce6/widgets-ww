/**
 * Unravel The Taxonomic Trail - Widget Script
 * Encapsulated within DOMContentLoaded to ensure the DOM is fully loaded.
 */
document.addEventListener("DOMContentLoaded", () => {
  /**
   * Global object to store app state and taxonomic data.
   */
  const AppState = {
    currentKingdom: 'animal', // 'animal' or 'plant'
    currentSet: 1,
    currentLevel: 0, // 0 to 6 (Kingdom to Species)
    eliminatedIndices: new Set(),
    isLevelRevealed: [true, false, false, false, false, false, false], // Kingdom is revealed by default
    isGameActive: false,

    // Mapping SVG IDs
    organismGroups: ['Group_1104', 'Group_1590', 'Group_1589', 'Group_1588', 'Group_1587', 'Group_1586', 'Group_1585'],
    levelTabGroups: ['Group_1075', 'Group_1076', 'Group_1077', 'Group_1078', 'Group_1079', 'Group_1080', 'Group_1081'],
    levelTabClickedGroups: ['Group_1075-2', 'Group_1076-2', 'Group_1077-2', 'Group_1078-2', 'Group_1079-2', 'Group_1080-2', 'Group_1081-2'],
    levelLabels: ['Kingdom', 'Phylum_', 'Class', 'Order', 'Family_', 'Genus_', 'Species'],
    levelRevealedLabels: ['Kingdom-2', 'Phylum_2', 'Class-2', 'Order-2', 'Family_2', 'Genus_2', 'Species-2'],
    taxonGroups: ['Animalia', 'Chordata', 'Mammalia', 'Carnivora', 'Felidae', 'Felis', 'Margarita'],
    hintTriggers: ['Group_1598', 'Group_1592', 'Group_1593', 'Group_1594', 'Group_1595', 'Group_1596', 'Group_1597'],

    // Taxonomic levels names
    levels: ['Kingdom', 'Phylum', 'Class', 'Order', 'Family', 'Genus', 'Species'],
    plantLevels: ['Kingdom', 'Division', 'Class', 'Order', 'Family', 'Genus', 'Species'],

    // Data Structure for Organism Sets
    data: {
      animal: {
        set1: {
          targetName: "Sand cat",
          targetScientific: "Felis margarita",
          targetImage: "assets/images/Animal set _1/Sand cat_th1.png",
          organisms: [
            { name: "Salamander", image: "assets/images/Animal set _1/Salamander_th1.png", eliminateAt: 2 }, // Class (Mammalia)
            { name: "Dog", image: "assets/images/Animal set _1/dog_th1.png", eliminateAt: 4 }, // Family (Felidae)
            { name: "Jungle cat", image: "assets/images/Animal set _1/Jungle cat_th1.png", eliminateAt: 6 }, // Species (margarita)
            { name: "Lion", image: "assets/images/Animal set _1/lion_th1.png", eliminateAt: 5 }, // Genus (Felis)
            { name: "House mouse", image: "assets/images/Animal set _1/House mouse_th1.png", eliminateAt: 3 }, // Order (Carnivora)
            { name: "Leech", image: "assets/images/Animal set _1/Leech_th1.png", eliminateAt: 1 }, // Phylum (Chordata)
            { name: "Sand cat", image: "assets/images/Animal set _1/Sand cat_th1.png", eliminateAt: -1 } // Correct target
          ],
          clues: [
            ["Multicellular organisms that consume food", "(heterotrophs) and can move."],
            ["Possess a notochord (flexible rod-like", "structure) at some stage of life."],
            ["Warm-blooded animals with hair/fur and", "mammary glands that produce milk."],
            ["Possess carnassial teeth (modified molars and", "premolars) for shearing flesh."],
            ["Have retractable claws housed in protective sheaths;", "short rounded skull with forward-facing eyes."],
            ["Small cats that can purr continuously but", "cannot roar; lack fully ossified hyoid bone."],
            ["Have dense fur between toe pads to walk on hot desert sand;", "enlarged ear pinnae for heat dissipation."]
          ],
          taxons: ["Animalia", "Chordata", "Mammalia", "Carnivora", "Felidae", "Felis", "Margarita"]
        }
      },
      plant: {
        set1: {
          targetName: "Spirogyra",
          targetScientific: "Spirogyra varians",
          targetImage: "assets/images/Plant set_1/Slender spirogyra_th1.png",
          organisms: [
            { name: "Moss", image: "assets/images/Plant set_1/Moss_th.png", eliminateAt: 1 },
            { name: "Ulva", image: "assets/images/Plant set_1/Ulva_th.png", eliminateAt: 2 },
            { name: "Mougeotia", image: "assets/images/Plant set_1/Mougeotia_th.png", eliminateAt: 3 },
            { name: "Closterium", image: "assets/images/Plant set_1/Closterium_th.png", eliminateAt: 4 },
            { name: "Chlamydomonas", image: "assets/images/Plant set_1/Chlamydomonas_th.png", eliminateAt: 5 },
            { name: "Elongated spirogyra", image: "assets/images/Plant set_1/Elongated spirogyra_th.png", eliminateAt: 6 },
            { name: "Slender spirogyra", image: "assets/images/Plant set_1/Slender spirogyra_th.png", eliminateAt: -1 }
          ],
          clues: [
            ["Multi-cellular and single-cellular", "organisms that photosynthesize."],
            ["Green algae found in freshwater", "and marine habitats."],
            ["Filamentous green algae", "with spiral chloroplasts."],
            ["Characterized by their unique", "conjugation method."],
            ["Zygnemataceae", "family features."],
            ["Spiral-shaped", "chloroplast arrangement."],
            ["Slender filaments with", "specific cell wall patterns."]
          ],
          taxons: ["Plantae", "Chlorophyta", "Chlorophyceae", "Zygnematales", "Zygnemataceae", "Spirogyra", "Varians"]
        }
      }
    }
  };

  /**
   * Initialize the application.
   */
  function init() {
    setupEventListeners();
    showView('home');
  }

  /**
   * Switch between 'home' and 'trail' views.
   */
  function showView(viewId) {
    const homeEl = document.getElementById('home');

    if (viewId === 'home') {
      if (homeEl) homeEl.style.display = 'block';
      toggleTrailUI(false);
    } else {
      if (homeEl) homeEl.style.display = 'none';
      toggleTrailUI(true);
      resetGame();
    }
  }

  /**
   * Show or hide Trail-specific SVG groups.
   */
  function toggleTrailUI(isVisible) {
    const trailElements = [
      'all_images', 'question_mark_hint_instruction',
      'Group_1623', 'tabs', 'tabs_clicked', 'instruction_text',
      'instruction_text-2', 'animal_title', 'plant_title', 'question_mark'
    ];

    const bottomControls = {
      'Button_Insite_': true,
      'Group_1566': true,
      'Group_10': isVisible, // Show Answer
      'Group_11': isVisible  // New Set
    };

    trailElements.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = isVisible ? 'block' : 'none';
    });

    for (const [id, show] of Object.entries(bottomControls)) {
      const el = document.getElementById(id);
      if (el) el.style.display = show ? 'block' : 'none';
    }

    // Ensure overlays are hidden
    const overlays = [
      'correct_feedback', 'wrong_feedback', 'show_answer',
      'insits', 'final_screen_image', 'final_message'
    ];
    overlays.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = 'none';
    });

    hideAllHints();
  }

  /**
   * Setup event listeners for clicks.
   */
  function setupEventListeners() {
    // Kingdom selection
    const animalCard = document.getElementById('animal_card_wrapper');
    if (animalCard) {
      animalCard.addEventListener('click', () => {
        AppState.currentKingdom = 'animal';
        showView('trail');
      });
    }

    const plantCard = document.getElementById('plant_card_wrapper');
    if (plantCard) {
      plantCard.addEventListener('click', () => {
        AppState.currentKingdom = 'plant';
        showView('trail');
      });
    }

    // Level reveals
    AppState.levelTabGroups.forEach((groupId, index) => {
      const tabEl = document.getElementById(groupId);
      if (tabEl) {
        tabEl.classList.add('cursor-pointer');
        tabEl.addEventListener('click', () => revealLevel(index));
      }
    });

    // Organism clicks
    AppState.organismGroups.forEach((groupId, index) => {
      const groupEl = document.getElementById(groupId);
      if (groupEl) {
        groupEl.classList.add('cursor-pointer');
        groupEl.addEventListener('click', () => checkElimination(index));
      }
    });

    // Hint "?" clicks
    const hintButtons = ['Group_1598', 'Group_1592', 'Group_1593', 'Group_1594', 'Group_1595', 'Group_1596', 'Group_1597'];
    hintButtons.forEach((id, index) => {
      const btn = document.getElementById(id);
      if (btn) {
        btn.classList.add('cursor-pointer');
        btn.addEventListener('click', () => showHint(index));
      }
    });

    // Close hint buttons
    const closeHintButtons = ['Group_1102', 'Group_1102-2', 'Group_1102-3', 'Group_1102-4', 'Group_1102-5', 'Group_1102-6', 'Group_1102-7'];
    closeHintButtons.forEach((id) => {
      const btn = document.getElementById(id);
      if (btn) {
        btn.classList.add('cursor-pointer');
        btn.addEventListener('click', (e) => {
          e.stopPropagation(); // Avoid double trigger if clicking near box edge
          hideAllHints();
        });
      }
    });

    // Close when clicking the hint box itself
    for (let i = 1; i <= 7; i++) {
      const hintBox = document.getElementById(`hint-${i}`);
      if (hintBox) {
        hintBox.classList.add('cursor-pointer');
        hintBox.addEventListener('click', () => hideAllHints());
      }
    }

    // Home button
    const homeBtn = document.getElementById('Group_1566');
    if (homeBtn) {
      homeBtn.classList.add('cursor-pointer');
      homeBtn.addEventListener('click', () => showView('home'));
    }

    // Bottom Controls
    const showAnsBtn = document.getElementById('Group_10');
    if (showAnsBtn) {
      showAnsBtn.classList.add('cursor-pointer');
      showAnsBtn.addEventListener('click', showAnswer);
    }

    const nextSetBtn = document.getElementById('Group_11');
    if (nextSetBtn) {
      nextSetBtn.classList.add('cursor-pointer');
      nextSetBtn.addEventListener('click', nextSet);
    }

    const insightsBtn = document.getElementById('Button_Insite_');
    if (insightsBtn) {
      insightsBtn.classList.add('cursor-pointer');
      insightsBtn.addEventListener('click', showInsights);
    }

    // Closing Overlays
    const closeAnsBtn = document.getElementById('Group_1577');
    if (closeAnsBtn) closeAnsBtn.addEventListener('click', () => document.getElementById('show_answer').style.display = 'none');

    const closeInsBtn = document.getElementById('Group_1331');
    if (closeInsBtn) {
      closeInsBtn.classList.add('cursor-pointer');
      closeInsBtn.addEventListener('click', () => document.getElementById('insits').style.display = 'none');
    }
  }

  /**
   * Reset game state for a new set or kingdom.
   */
  function resetGame() {
    AppState.currentLevel = 0; // Starting at Kingdom
    AppState.eliminatedIndices.clear();
    AppState.isLevelRevealed = [true, false, false, false, false, false, false];
    AppState.isGameActive = true;
    renderOrganisms();
    updateLevelsUI();
    hideAllHints();
    updateInstruction();
  }

  /**
   * Reveal a specific taxonomic level.
   */
  function revealLevel(index) {
    if (!AppState.isGameActive) return;

    // We can only reveal the level that is currently "in focus".
    // If Kingdom (0) is already revealed, we allow revealing Phylum (1).
    // Subsequent levels are revealed only after the previous level's animal is eliminated.
    let targetRevealIndex = AppState.currentLevel;

    // Special case for start: Kingdom is revealed, next reveal is Phylum (1)
    if (AppState.currentLevel === 0 && AppState.isLevelRevealed[0]) {
      targetRevealIndex = 1;
    }

    if (index !== targetRevealIndex) return;

    AppState.isLevelRevealed[index] = true;
    AppState.currentLevel = index; // Move focus to this newly revealed level
    updateLevelsUI();
    updateInstruction();
  }

  /**
   * Render organism images into their containers.
   */
  function renderOrganisms() {
    const kingdomData = AppState.data[AppState.currentKingdom][`set${AppState.currentSet}`];

    AppState.organismGroups.forEach((groupId, index) => {
      const groupEl = document.getElementById(groupId);
      if (!groupEl) return;

      const rect = groupEl.querySelector('rect[fill="#fff"]');
      if (!rect) return;

      const orgData = kingdomData.organisms[index];

      const existingImg = groupEl.querySelector('image.org-img');
      if (existingImg) existingImg.remove();

      const img = document.createElementNS("http://www.w3.org/2000/svg", "image");
      img.setAttributeNS(null, "href", orgData.image);
      img.setAttributeNS(null, "x", rect.getAttribute("x"));
      img.setAttributeNS(null, "y", rect.getAttribute("y"));
      img.setAttributeNS(null, "width", rect.getAttribute("width"));
      img.setAttributeNS(null, "height", rect.getAttribute("height"));
      img.setAttributeNS(null, "preserveAspectRatio", "xMidYMid meet");
      img.classList.add('org-img');

      groupEl.appendChild(img);

      const nameText = groupEl.querySelector('tspan');
      if (nameText) nameText.textContent = orgData.name;

      groupEl.style.display = 'block';
      groupEl.style.opacity = '1';
      groupEl.style.filter = 'none';
      groupEl.classList.remove('eliminated');
      groupEl.classList.remove('correct-ans-border');
      groupEl.classList.remove('wrong-ans-border');
    });
  }

  /**
   * Update the visual state of the level tabs and labels.
   */
  function updateLevelsUI() {
    const isPlant = AppState.currentKingdom === 'plant';
    const revealedLabelIds = AppState.levelRevealedLabels;
    const kingdomData = AppState.data[AppState.currentKingdom][`set${AppState.currentSet}`];

    AppState.levelTabGroups.forEach((groupId, index) => {
      const tab = document.getElementById(groupId);
      const clickedTab = document.getElementById(AppState.levelTabClickedGroups[index]);
      const label = document.getElementById(AppState.levelLabels[index]);
      const revealedLabel = document.getElementById(revealedLabelIds[index]);
      const taxonGroup = document.getElementById(AppState.taxonGroups[index]);
      const hintTrigger = document.getElementById(AppState.hintTriggers[index]);

      if (AppState.isLevelRevealed[index]) {
        if (tab) tab.style.display = 'none';
        if (clickedTab) clickedTab.style.display = 'block';
        if (label) label.style.display = 'none';
        if (revealedLabel) {
          revealedLabel.style.display = 'block';
          // Terminology shift for Division
          const tspan = revealedLabel.querySelector('tspan');
          if (tspan) {
            if (isPlant && index === 1) tspan.textContent = 'Division';
            else if (index === 1) tspan.textContent = 'Phylum';
            else if (index === 0) tspan.textContent = 'Kingdom';
          }
        }
        if (taxonGroup) {
          taxonGroup.style.display = 'block';
          const tspans = taxonGroup.querySelectorAll('tspan');
          if (tspans.length > 0) {
            tspans[0].textContent = kingdomData.taxons[index];
            // Clear other tspans to prevent overlap
            for (let i = 1; i < tspans.length; i++) {
              tspans[i].textContent = '';
            }
          }
        }
        if (hintTrigger) hintTrigger.style.display = 'block';
      } else {
        if (tab) tab.style.display = 'block';
        if (clickedTab) clickedTab.style.display = 'none';
        if (label) label.style.display = 'block';
        if (revealedLabel) revealedLabel.style.display = 'none';
        if (taxonGroup) taxonGroup.style.display = 'none';
        if (hintTrigger) hintTrigger.style.display = 'none';
      }
    });

    const animalTitle = document.getElementById('animal_title');
    const plantTitle = document.getElementById('plant_title');
    if (animalTitle) animalTitle.style.display = isPlant ? 'none' : 'block';
    if (plantTitle) plantTitle.style.display = isPlant ? 'block' : 'none';
  }

  /**
   * Handle organism click and check for elimination.
   */
  function checkElimination(index) {
    if (!AppState.isGameActive) return;
    if (AppState.eliminatedIndices.has(index)) return;

    // Level 0 (Kingdom) has no elimination target. Game logic starts at Level 1.
    // At level 0, user must first reveal Phylum/Division by clicking the tab.
    if (AppState.currentLevel === 0) return;

    // Check if the current level name has been revealed yet.
    // If not, the user should reveal the level first.
    if (!AppState.isLevelRevealed[AppState.currentLevel]) return;

    const kingdomData = AppState.data[AppState.currentKingdom][`set${AppState.currentSet}`];
    const orgData = kingdomData.organisms[index];

    if (orgData.eliminateAt === AppState.currentLevel) {
      handleCorrectElimination(index);
    } else {
      handleWrongElimination(index);
    }
  }

  function handleCorrectElimination(index) {
    AppState.eliminatedIndices.add(index);
    const groupEl = document.getElementById(AppState.organismGroups[index]);
    if (groupEl) {
      groupEl.classList.add('correct-ans-border');
    }

    showFeedback(true, index);

    setTimeout(() => {
      if (groupEl) {
        groupEl.classList.remove('correct-ans-border');
        groupEl.style.display = 'none';
        groupEl.classList.add('eliminated');
      }

      if (AppState.currentLevel < 6) {
        // Move to the next level phase
        AppState.currentLevel++;
        updateLevelsUI();
        updateInstruction();
      } else {
        showFinalSummary();
      }
    }, 2000);
  }

  function handleWrongElimination(index) {
    const groupEl = document.getElementById(AppState.organismGroups[index]);
    if (groupEl) {
      groupEl.classList.add('wrong-ans-border');
    }

    showFeedback(false, index);

    setTimeout(() => {
      if (groupEl) {
        groupEl.classList.remove('wrong-ans-border');
      }
    }, 2000);
  }

  function showFeedback(isCorrect, index) {
    // Hide any existing feedback
    const correctEl = document.getElementById('correct_feedback');
    const wrongEl = document.getElementById('wrong_feedback');
    if (correctEl) correctEl.style.display = 'none';
    if (wrongEl) wrongEl.style.display = 'none';

    const feedbackId = isCorrect ? 'correct_feedback' : 'wrong_feedback';
    const feedbackEl = document.getElementById(feedbackId);
    if (feedbackEl) {
      feedbackEl.style.display = 'block';

      // First hide all specific animal feedbacks
      for (let i = 1; i <= 7; i++) {
        const c = document.getElementById(`correct-${i}`);
        const w = document.getElementById(`wrong-${i}`);
        if (c) c.style.display = 'none';
        if (w) w.style.display = 'none';
      }

      // Index 0 (Leftmost) maps to correct-1 / wrong-1
      const specificId = `${isCorrect ? 'correct' : 'wrong'}-${index + 1}`;
      const specificEl = document.getElementById(specificId);
      if (specificEl) specificEl.style.display = 'block';
    }

    setTimeout(() => {
      if (feedbackEl) feedbackEl.style.display = 'none';
    }, 2000);
  }

  /**
   * Update instructions based on game state.
   */
  function updateInstruction() {
    const levelNames = AppState.currentKingdom === 'plant' ? AppState.plantLevels : AppState.levels;

    const instr1 = document.getElementById('instruction_text');
    const instr2 = document.getElementById('instruction_text-2');

    // Case 1: Level revealed -> Prompt to eliminate animal
    if (AppState.isLevelRevealed[AppState.currentLevel] && AppState.currentLevel > 0) {
      if (instr1) {
        instr1.style.display = 'block';
        const currentLevelName = levelNames[AppState.currentLevel];
        const kingdomPrefix = AppState.currentKingdom === 'animal' ? 'animal' : 'plant';
        const tspans = instr1.querySelectorAll('tspan');
        if (tspans.length >= 7) {
          tspans[0].textContent = 'T';
          tspans[1].textContent = `ap the ${kingdomPrefix} that does N`;
          tspans[2].textContent = 'O';
          tspans[3].textContent = 'T';
          tspans[4].textContent = ' belong ';
          tspans[5].textContent = 't';
          tspans[6].textContent = `o this ${currentLevelName}`;
        }
      }
      if (instr2) instr2.style.display = 'none';
    }
    // Case 2: Level not revealed OR Level 0 revealed (special start state)
    else {
      if (instr1) instr1.style.display = 'none';
      if (instr2) {
        instr2.style.display = 'block';

        let nextLevelIndex = AppState.currentLevel;
        if (AppState.currentLevel === 0 && AppState.isLevelRevealed[0]) {
          nextLevelIndex = 1;
        }

        const levelToReveal = levelNames[nextLevelIndex];
        const tspans = instr2.querySelectorAll('tspan');
        if (tspans.length >= 2) {
          tspans[0].textContent = `T`;
          tspans[1].textContent = `ap ${levelToReveal} to reveal its name `;
          for (let i = 2; i < tspans.length; i++) {
            tspans[i].textContent = '';
          }
        }
      }
    }
  }

  function showHint(index) {
    hideAllHints();
    const hintId = `hint-${index + 1}`; // Corrected mapping: Kingdom is index 0 -> hint-7? Wait. 
    // Let's re-verify matching: 
    // Kingdom (0) -> hint-7
    // Phylum (1) -> hint-6
    // Class (2) -> hint-5
    // Order (3) -> hint-4
    // Family (4) -> hint-3
    // Genus (5) -> hint-2
    // Species (6) -> hint-1
    const correctedHintId = `hint-${7 - index}`;
    const hintEl = document.getElementById(correctedHintId);
    if (hintEl) {
      const kingdomData = AppState.data[AppState.currentKingdom][`set${AppState.currentSet}`];
      const clueLines = kingdomData.clues[index];
      const textGroups = hintEl.querySelectorAll('g[isolation="isolate"]');

      // Each hint box has 2 text blocks or tspans across blocks
      // Let's assume the first lines go into first tspans of available text elements
      const allTspans = hintEl.querySelectorAll('tspan');
      // We need to clear them and set them
      allTspans.forEach(t => t.textContent = '');

      // Map first line to first text block, second line to second
      const textElements = hintEl.querySelectorAll('text');
      if (textElements.length >= 2) {
        // Line 1
        const tspans1 = textElements[0].querySelectorAll('tspan');
        if (tspans1.length > 0) tspans1[0].textContent = clueLines[0];
        // Line 2
        const tspans2 = textElements[1].querySelectorAll('tspan');
        if (tspans2.length > 0) tspans2[0].textContent = clueLines[1];
      }

      hintEl.style.display = 'block';
    }
  }

  function hideAllHints() {
    for (let i = 1; i <= 7; i++) {
      const el = document.getElementById(`hint-${i}`);
      if (el) el.style.display = 'none';
    }
  }

  function showAnswer() {
    const kingdomData = AppState.data[AppState.currentKingdom][`set${AppState.currentSet}`];
    const correctIdx = kingdomData.organisms.findIndex(o => o.eliminateAt === AppState.currentLevel);

    if (correctIdx !== -1) {
      const org = kingdomData.organisms[correctIdx];
      const levelNames = AppState.currentKingdom === 'plant' ? AppState.plantLevels : AppState.levels;
      const currentLevelName = levelNames[AppState.currentLevel];
      const currentTaxonName = kingdomData.taxons[AppState.currentLevel];

      const imgEl = document.getElementById('show_answer_img');
      const nameEl = document.getElementById('show_answer_name_text');
      const explNameEl = document.getElementById('sa_expl_name');
      const explLevelEl = document.getElementById('sa_expl_level');

      if (imgEl) imgEl.setAttribute('href', org.image);
      if (nameEl && nameEl.querySelector('tspan')) {
        nameEl.querySelector('tspan').textContent = org.name;
      }
      if (explNameEl) explNameEl.textContent = org.name;
      if (explLevelEl) explLevelEl.textContent = `${currentLevelName} ${currentTaxonName}`;
    }

    const showAnswerEl = document.getElementById('show_answer');
    if (showAnswerEl) showAnswerEl.style.display = 'block';
  }

  function nextSet() {
    resetGame();
  }

  function showInsights() {
    const insightsEl = document.getElementById('insits');
    if (insightsEl) insightsEl.style.display = 'block';
  }

  function showFinalSummary() {
    AppState.isGameActive = false;
    const kingdomData = AppState.data[AppState.currentKingdom][`set${AppState.currentSet}`];

    // Populate final screen with target organism data
    const finalImg = document.getElementById('final_organism_img');
    const finalName = document.getElementById('final_organism_name');
    const finalScientific = document.getElementById('final_scientific_name');

    if (finalImg) finalImg.setAttribute('href', kingdomData.targetImage);
    if (finalName) finalName.textContent = kingdomData.targetName;
    if (finalScientific) finalScientific.textContent = kingdomData.targetScientific;

    const summaryImg = document.getElementById('final_screen_image');
    const summaryMsg = document.getElementById('final_message');
    if (summaryImg) summaryImg.style.display = 'block';
    if (summaryMsg) summaryMsg.style.display = 'block';
  }

  // Start the app
  init();
});
