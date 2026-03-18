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
    pendingTimeouts: [],

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
            ["Have dense fur between toe pads to walk on hot", "desert sand; enlarged ear pinnae for heat dissipation."]
          ],
          taxons: ["Animalia", "Chordata", "Mammalia", "Carnivora", "Felidae", "Felis", "margarita"]
        },
        set2: {
          targetName: "Burmese python",
          targetScientific: "Python bivittatus",
          targetImage: "assets/images/Animal set_2/Burmese python_th1.png",
          organisms: [
            { name: "Indian gharial", image: "assets/images/Animal set_2/Indian gharial _th1.png", eliminateAt: 3 },
            { name: "Jellyfish", image: "assets/images/Animal set_2/Jellyfish_th1.png", eliminateAt: 1 },
            { name: "Green tree python", image: "assets/images/Animal set_2/Green tree python _th1.png", eliminateAt: 5 },
            { name: "Dog", image: "assets/images/Animal set_2/dog_th1.png", eliminateAt: 2 },
            { name: "Ball python", image: "assets/images/Animal set_2/Ball python _th1.png", eliminateAt: 6 },
            { name: "King cobra", image: "assets/images/Animal set_2/King cobra _th1.png", eliminateAt: 4 },
            { name: "Burmese python", image: "assets/images/Animal set_2/Burmese python_th1.png", eliminateAt: -1 }
          ],
          clues: [
            ["Multicellular organisms that consume food", "(heterotrophs) and can move."],
            ["Possess a notochord (flexible rod-like", "structure) at some stage of life."],
            ["Cold-blooded vertebrates with dry,", "scaly skin that lay eggs on land."],
            ["Scaled reptiles with flexible skulls", "and the ability to shed skin."],
            ["Non-venomous constrictors with heat-sensing", "pits and vestigial hind limbs."],
            ["Large, heavy-bodied snakes that kill prey", "by squeezing (constriction)."],
            ["Dark-coloured python with brown blotches,", "native to Southeast Asia."]
          ],
          taxons: ["Animalia", "Chordata", "Reptilia", "Squamata", "Pythonidae", "Python", "bivittatus"]
        },
        set3: {
          targetName: "Speckled wood pigeon",
          targetScientific: "Columba hodgsonii",
          targetImage: "assets/images/Animal set_3/Speckled wood pigeon_th1.png",
          organisms: [
            { name: "Jungle cat", image: "assets/images/Animal set_3/Jungle cat_th1.png", eliminateAt: 2 },
            { name: "Laughing dove", image: "assets/images/Animal set_3/Laughing dove _th1.png", eliminateAt: 5 },
            { name: "Snail", image: "assets/images/Animal set_3/Snail_th1.png", eliminateAt: 1 },
            { name: "Wood pigeon", image: "assets/images/Animal set_3/Wood pigeon _th1.png", eliminateAt: 6 },
            { name: "Sparrow", image: "assets/images/Animal set_3/Sparrow_th1.png", eliminateAt: 3 },
            { name: "White winged dove", image: "assets/images/Animal set_3/White winged dove _th1.png", eliminateAt: 4 },
            { name: "Speckled wood pigeon", image: "assets/images/Animal set_3/Speckled wood pigeon_th1.png", eliminateAt: -1 }
          ],
          clues: [
            ["Multicellular organisms that consume food", "(heterotrophs) and can move."],
            ["Possess a notochord (flexible rod-like", "structure) at some stage of life."],
            ["Warm-blooded vertebrates with feathers, beaks,", "and lay hard-shelled eggs."],
            ["Stout-bodied birds with small heads", "that produce \"crop milk\" for young."],
            ["Birds with soft cooing calls and a distinctive", "bobbing head movement while walking."],
            ["Medium to large pigeons with iridescent", "neck patches and strong flight."],
            ["Himalayan forest pigeon with maroon-brown", "plumage speckled with white spots on neck."]
          ],
          taxons: ["Animalia", "Chordata", "Aves", "Columbiformes", "Columbidae", "Columba", "hodgsonii"]
        },
        set4: {
          targetName: "Northern Pacific sea star",
          targetScientific: "Asterias amurensis",
          targetImage: "assets/images/Animal set_4/Northern Pacific sea star_th1.png",
          organisms: [
            { name: "Spiny sun star", image: "assets/images/Animal set_4/Spiny sun star_th1.png", eliminateAt: 4 },
            { name: "Sea urchin", image: "assets/images/Animal set_4/Sea urchin_th1.png", eliminateAt: 2 },
            { name: "Sunflower star", image: "assets/images/Animal set_4/Sunflower star_th1.png", eliminateAt: 5 },
            { name: "King cobra", image: "assets/images/Animal set_4/King cobra _th1.png", eliminateAt: 1 },
            { name: "Forbes' sea star", image: "assets/images/Animal set_4/Forbes’ sea star_th1.png", eliminateAt: 6 },
            { name: "Cushion star", image: "assets/images/Animal set_4/Cushion star_th1.png", eliminateAt: 3 },
            { name: "Northern Pacific sea star", image: "assets/images/Animal set_4/Northern Pacific sea star_th1.png", eliminateAt: -1 }
          ],
          clues: [
            ["Multicellular organisms that consume food", "(heterotrophs) and can move."],
            ["Spiny-skinned marine animals with five-part", "radial symmetry and water vascular system."],
            ["Have star-shaped body with arms merging into central", "disc; can evert stomach for external digestion."],
            ["Possess straight or crossed pedicellariae (tiny", "pincer-like structures) used for defense and cleaning."],
            ["Sea stars with four rows of tube feet and", "crossed pedicellariae on body surface."],
            ["Typically have five arms with conical spines", "arranged in irregular longitudinal rows."],
            ["Yellow-orange sea stars with purple markings;", "invasive species native to North Pacific."]
          ],
          taxons: ["Animalia", "Echinodermata", "Asteroidea", "Forcipulatida", "Asteriidae", "Asterias", "amurensis"]
        }
      },
      plant: {
        set1: {
          targetName: "Elongated spirogyra",
          targetScientific: "Spirogyra longata",
          targetImage: "assets/images/Plant set_1/Elongated spirogyra_th.png",
          organisms: [
            { name: "Mougeotia", image: "assets/images/Plant set_1/Mougeotia_th.png", eliminateAt: 5 },
            { name: "Moss", image: "assets/images/Plant set_1/Moss_th.png", eliminateAt: 1 },
            { name: "Slender spirogyra", image: "assets/images/Plant set_1/Slender spirogyra_th.png", eliminateAt: 6 },
            { name: "Chlamydomonas", image: "assets/images/Plant set_1/Chlamydomonas_th.png", eliminateAt: 3 },
            { name: "Ulva", image: "assets/images/Plant set_1/Ulva_th.png", eliminateAt: 2 },
            { name: "Closterium", image: "assets/images/Plant set_1/Closterium_th.png", eliminateAt: 4 },
            { name: "Elongated spirogyra", image: "assets/images/Plant set_1/Elongated spirogyra_th.png", eliminateAt: -1 }
          ],
          clues: [
            ["Multicellular, eukaryotic organisms that primarily", "produce their own food through photosynthesis."],
            ["Simplest plants with undifferentiated body (thallus);", "no true roots, stems, or leaves."],
            ["Green algae with chlorophyll a and b stored in", "cup, spiral, or ribbon-shaped chloroplasts."],
            ["Reproduce sexually by conjugation (fusion of", "non-flagellated gametes through conjugation tube)."],
            ["Have unbranched filamentous algae with cells", "joined end-to-end in single chains."],
            ["Have spiral or ribbon-shaped chloroplasts", "coiled like a spring inside each cell."],
            ["Have elongated cylindrical cells that are 2–3", "times longer than wide."]
          ],
          taxons: ["Plantae", "Thallophyta", "Chlorophyceae", "Zygnematales", "Zygnemataceae", "Spirogyra", "longata"]
        },
        set2: {
          targetName: "Mediterranean cord moss",
          targetScientific: "Funaria mediterranea",
          targetImage: "assets/images/Plant set_2/Mediterranean cord moss_th.png",
          organisms: [
            { name: "Haircap moss", image: "assets/images/Plant set_2/Haircap moss _th.png", eliminateAt: 3 },
            { name: "Pygmy moss", image: "assets/images/Plant set_2/Pygmy moss_th.png", eliminateAt: 5 },
            { name: "Liverwort", image: "assets/images/Plant set_2/Liverwort_th.png", eliminateAt: 2 },
            { name: "Splachnum moss", image: "assets/images/Plant set_2/Splachnum moss _th.png", eliminateAt: 4 },
            { name: "Chlamydomonas", image: "assets/images/Plant set_2/Chlamydomonas_th.png", eliminateAt: 1 },
            { name: "Common cord moss", image: "assets/images/Plant set_2/Common cord moss_th.png", eliminateAt: 6 },
            { name: "Mediterranean cord moss", image: "assets/images/Plant set_2/Mediterranean cord moss_th.png", eliminateAt: -1 }
          ],
          clues: [
            ["Multicellular, eukaryotic organisms that primarily", "produce their own food through photosynthesis."],
            ["Non-vascular plants; no true roots, stems, or leaves;", "called \"amphibians of plant kingdom.\""],
            ["True mosses with leafy gametophyte and capsule", "with peristome teeth for spore dispersal."],
            ["Pioneer mosses that rapidly colonise disturbed,", "burnt, or nitrogen-rich soil."],
            ["Pear-shaped or asymmetrical capsules with", "reduced or absent peristome teeth."],
            ["Twisted seta (stalk) that coils and uncoils with", "humidity changes to aid spore dispersal."],
            ["Native to Mediterranean region; smaller capsules", "than common cord moss."]
          ],
          taxons: ["Plantae", "Bryophyta", "Bryopsida", "Funariales", "Funariaceae", "Funaria", "mediterranea"]
        },
        set3: {
          targetName: "Blue pine",
          targetScientific: "Pinus wallichiana",
          targetImage: "assets/images/Plant set_3/Blue pine.png",
          organisms: [
            { name: "Deodar", image: "assets/images/Plant set_3/Deodar.png", eliminateAt: 5 },
            { name: "Coconut", image: "assets/images/Plant set_3/Coconut_th.png", eliminateAt: 1 },
            { name: "Scots pine", image: "assets/images/Plant set_3/Scots pine.png", eliminateAt: 6 },
            { name: "Cypress", image: "assets/images/Plant set_3/Cypress.png", eliminateAt: 4 },
            { name: "Cycas", image: "assets/images/Plant set_3/Cycas_th.png", eliminateAt: 2 },
            { name: "Araucaria", image: "assets/images/Plant set_3/Araucaria_th.png", eliminateAt: 3 },
            { name: "Blue pine", image: "assets/images/Plant set_3/Blue pine.png", eliminateAt: -1 }
          ],
          clues: [
            ["Multicellular, eukaryotic organisms that primarily", "produce their own food through photosynthesis."],
            ["Have naked seeds, meaning they are not enclosed", "in an ovary or fruit."],
            ["Have needle-like or scale-like leaves; lack", "motile sperm (pollen tube delivers sperm)."],
            ["Have resin canals present throughout wood,", "leaves, and cones."],
            ["Each cone scale bears exactly two-winged seeds", "on its upper surface."],
            ["Have dimorphic shoots: long shoots with scale leaves", "and dwarf shoots bearing needle fascicles."],
            ["Have bluish-green drooping needles per fascicle;", "banana-shaped resinous cones."]
          ],
          taxons: ["Plantae", "Gymnospermae", "Pinopsida", "Pinales", "Pinaceae", "Pinus", "wallichiana"]
        },
        set4: {
          targetName: "Fragrant mango",
          targetScientific: "Mangifera odorata",
          targetImage: "assets/images/Plant set_4/Fragrant mango.png",
          organisms: [
            { name: "Apple", image: "assets/images/Plant set_4/Apple (fruit).png", eliminateAt: 3 },
            { name: "Alphonso mango", image: "assets/images/Plant set_4/Alphonso mango (fruit).png", eliminateAt: 6 },
            { name: "Pine", image: "assets/images/Plant set_4/Pine (cone).png", eliminateAt: 1 },
            { name: "Cashew", image: "assets/images/Plant set_4/Cashew (fruit).png", eliminateAt: 5 },
            { name: "Banana", image: "assets/images/Plant set_4/Banana (fruit).png", eliminateAt: 2 },
            { name: "Orange", image: "assets/images/Plant set_4/Orange (fruit).png", eliminateAt: 4 },
            { name: "Fragrant mango", image: "assets/images/Plant set_4/Fragrant mango.png", eliminateAt: -1 }
          ],
          clues: [
            ["Multicellular, eukaryotic organisms that primarily", "produce their own food through photosynthesis."],
            ["Have seeds enclosed within fruits; possess true", "flowers with ovary."],
            ["Have embryo with two cotyledons; reticulate leaf", "venation; tap root system."],
            ["Have flowers with prominent nectar disc between", "stamens and ovary."],
            ["Have resin ducts producing urushiol (causes allergic", "skin reactions); drupe fruits."],
            ["Have fleshy drupe fruits with large single", "stony seed."],
            ["The fruit has sweet fragrant aroma resembling", "coconut; bright orange fibrous flesh with mild flavour."]
          ],
          taxons: ["Plantae", "Angiospermae", "Dicotyledonae", "Sapindales", "Anacardiaceae", "Mangifera", "odorata"]
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
    // Clear any pending timeouts to avoid race conditions (e.g., box hiding after reset)
    AppState.pendingTimeouts.forEach(t => clearTimeout(t));
    AppState.pendingTimeouts = [];

    AppState.currentLevel = 0; // Starting at Kingdom
    AppState.eliminatedIndices.clear();
    AppState.isLevelRevealed = [true, false, false, false, false, false, false];
    AppState.isGameActive = true;

    // Shuffle organisms array to randomize panel placement
    const kingdomData = AppState.data[AppState.currentKingdom][`set${AppState.currentSet}`];
    for (let i = kingdomData.organisms.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [kingdomData.organisms[i], kingdomData.organisms[j]] = [kingdomData.organisms[j], kingdomData.organisms[i]];
    }

    // Ensure all elements are visible
    const allImages = document.getElementById('all_images');
    if (allImages) allImages.style.display = 'block';

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
    hideAllHints();
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
        if (label) {
          label.style.display = 'block';
          const tspan = label.querySelector('tspan');
          if (tspan && index === 1) {
            tspan.textContent = isPlant ? 'Division' : 'Phylum';
          }
        }
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

    const timer = setTimeout(() => {
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
    AppState.pendingTimeouts.push(timer);
  }

  function handleWrongElimination(index) {
    const groupEl = document.getElementById(AppState.organismGroups[index]);
    if (groupEl) {
      groupEl.classList.add('wrong-ans-border');
    }

    showFeedback(false, index);

    const timer = setTimeout(() => {
      if (groupEl) {
        groupEl.classList.remove('wrong-ans-border');
      }
    }, 2000);
    AppState.pendingTimeouts.push(timer);
  }

  function showFeedback(isCorrect, index) {
    // Hide any existing feedback
    const correctEl = document.getElementById('correct_feedback');
    const wrongEl = document.getElementById('wrong_feedback');
    if (correctEl) correctEl.style.display = 'none';
    if (wrongEl) wrongEl.style.display = 'none';

    const feedbackId = isCorrect ? 'correct_feedback' : 'wrong_feedback';
    const feedbackEl = document.getElementById(feedbackId);
    hideAllHints();
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
      if (specificEl) {
        specificEl.style.display = 'block';

        // Dynamically update "animal" to "plant" if current kingdom is plant
        const noun = AppState.currentKingdom === 'plant' ? 'plant' : 'animal';
        const tspans = specificEl.querySelectorAll('tspan');
        tspans.forEach(tspan => {
          if (tspan.textContent.includes('animal')) {
            tspan.textContent = tspan.textContent.replace('animal', noun);
          }
        });
      }
    }

    const timer = setTimeout(() => {
      if (feedbackEl) feedbackEl.style.display = 'none';
    }, 2000);
    AppState.pendingTimeouts.push(timer);
  }

  /**
   * Update instructions based on game state.
   */
  function updateInstruction() {
    const levelNames = AppState.currentKingdom === 'plant' ? AppState.plantLevels : AppState.levels;

    const instr1 = document.getElementById('instruction_text');
    const instr2 = document.getElementById('instruction_text-2');
    const showAnsBtn = document.getElementById('Group_10');

    // Case 1: Level revealed -> Prompt to eliminate animal
    if (AppState.isLevelRevealed[AppState.currentLevel] && AppState.currentLevel > 0) {
      if (instr1) {
        instr1.style.display = 'block';
        const currentLevelName = levelNames[AppState.currentLevel];
        const kingdomPrefix = AppState.currentKingdom === 'animal' ? 'animal' : 'plant';
        const tspan = instr1.querySelector('tspan');
        if (tspan) {
          tspan.textContent = `Tap the ${kingdomPrefix} that does NOT belong to this ${currentLevelName}`;
        }
      }
      if (instr2) instr2.style.display = 'none';

      if (showAnsBtn) {
        showAnsBtn.style.opacity = '1';
        showAnsBtn.style.pointerEvents = 'auto';
      }
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
        const tspan = instr2.querySelector('tspan');
        if (tspan) {
          tspan.textContent = `Tap ${levelToReveal} to reveal its name`;
        }
      }

      if (showAnsBtn) {
        showAnsBtn.style.opacity = '0.5';
        showAnsBtn.style.pointerEvents = 'none';
      }
    }
  }

  function showHint(index) {
    if (!AppState.isGameActive) return;
    hideAllHints();
    const hintId = `hint-${index + 1}`; // Corrected mapping: Kingdom is index 0 -> hint-7? Wait. 
    // Let's re-verify matching: 
    // Kingdom (0) -> hint-7
    const correctedHintId = `hint-${7 - index}`;
    const hintEl = document.getElementById(correctedHintId);
    if (hintEl) {
      const kingdomData = AppState.data[AppState.currentKingdom][`set${AppState.currentSet}`];
      const clueLines = kingdomData.clues[index];

      // Map first line to first text block, second line to second
      const textElements = hintEl.querySelectorAll('text');
      if (textElements.length >= 2) {
        // Clear all tspans first
        hintEl.querySelectorAll('tspan').forEach(t => t.textContent = '');

        // Line 1
        const tspans1 = textElements[0].querySelectorAll('tspan');
        if (tspans1.length > 0) tspans1[0].textContent = clueLines[0];
        // Line 2
        const tspans2 = textElements[1].querySelectorAll('tspan');
        if (tspans2.length > 0) tspans2[0].textContent = clueLines[1];

        // Make it visible to measure
        hintEl.style.display = 'block';

        // Use requestAnimationFrame to ensure browser has updated the DOM for measurement
        requestAnimationFrame(() => {
          const b1 = textElements[0].getBBox();
          const b2 = textElements[1].getBBox();
          const maxTextWidth = Math.max(b1.width, b2.width);

          const leftPadding = 30;
          const rightPadding = 80; // Extra room for the close button
          const dynamicWidth = Math.max(200, maxTextWidth + leftPadding + rightPadding);

          const bgRects = hintEl.querySelectorAll('rect');
          if (bgRects.length >= 2) {
            bgRects[0].setAttribute('width', dynamicWidth);
            bgRects[1].setAttribute('width', dynamicWidth - 4);

            const rectX = parseFloat(bgRects[0].getAttribute('x'));

            // Reposition the close button
            const closeBtn = hintEl.querySelector('g[id^="Group_1102"]');
            if (closeBtn) {
              const circle = closeBtn.querySelector('circle');
              if (circle) {
                const circleCX = parseFloat(circle.getAttribute('cx'));
                // Target center of circle at rect right edge - 30 margin
                const targetCX = rectX + dynamicWidth - 30;
                const tx = targetCX - circleCX;
                closeBtn.setAttribute('transform', `translate(${tx}, 0)`);
              }
            }
          }
        });
      } else {
        hintEl.style.display = 'block';
      }
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
    hideAllHints();
  }

  function nextSet() {
    const kingdomSets = Object.keys(AppState.data[AppState.currentKingdom]).length;
    AppState.currentSet++;
    if (AppState.currentSet > kingdomSets) {
      AppState.currentSet = 1;
    }
    toggleTrailUI(true);
    resetGame();
  }

  function showInsights() {
    const insightsEl = document.getElementById('insits');
    if (insightsEl) insightsEl.style.display = 'block';
    hideAllHints();
  }

  function showFinalSummary() {
    AppState.isGameActive = false;
    const kingdomData = AppState.data[AppState.currentKingdom][`set${AppState.currentSet}`];

    const showAnsBtn = document.getElementById('Group_10');
    if (showAnsBtn) {
      showAnsBtn.style.opacity = '0.5';
      showAnsBtn.style.pointerEvents = 'none';
    }

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

    const elementsToHide = [
      'all_images',
      'question_mark_hint_instruction',
      'instruction_text',
      'instruction_text-2'
    ];
    elementsToHide.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = 'none';
    });

    hideAllHints();
  }

  // Start the app
  init();
});
