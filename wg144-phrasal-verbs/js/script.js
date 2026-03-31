const PHRASAL_VERBS = [
  {head:"look",verb:"look up",meaning:"to search for information in a book or online",example:"I need to look up the meaning of this word in the dictionary.",fib:"I need to ___ the meaning of this word in the dictionary."},
  {head:"look",verb:"look forward to",meaning:"to feel excited about something that is going to happen",example:"The children are looking forward to the summer holidays.",fib:"The children are ___ the summer holidays."},
  {head:"look",verb:"look after",meaning:"to take care of someone or something",example:"My grandmother looks after my little brother when my parents are at work.",fib:"My grandmother ___ my little brother when my parents are at work."},
  {head:"look",verb:"look down on",meaning:"to think that someone is less important than you",example:"She looks down on people who don't read books.",fib:"She ___ people who don't read books."},
  {head:"take",verb:"take off",meaning:"to remove clothing; or (of a plane) to leave the ground",example:"Please take off your shoes before entering the house.",fib:"Please ___ your shoes before entering the house."},
  {head:"take",verb:"take up",meaning:"to start doing a new activity or hobby",example:"He decided to take up painting after he retired.",fib:"He decided to ___ painting after he retired."},
  {head:"take",verb:"take after",meaning:"to look or behave like an older family member",example:"She really takes after her mother — they have the same smile.",fib:"She really ___ her mother — they have the same smile."},
  {head:"take",verb:"take over",meaning:"to begin to have control of something",example:"The new manager will take over the department next month.",fib:"The new manager will ___ the department next month."},
  {head:"give",verb:"give up",meaning:"to stop trying or to quit a habit",example:"He gave up smoking last year and feels much healthier now.",fib:"He ___ smoking last year and feels much healthier now."},
  {head:"give",verb:"give away",meaning:"to give something to someone for free; or to reveal a secret",example:"Don't give away the ending of the movie!",fib:"Don't ___ the ending of the movie!"},
  {head:"give",verb:"give in",meaning:"to finally agree to something you were against",example:"After much argument, the father gave in and let them go to the party.",fib:"After much argument, the father ___ and let them go to the party."},
  {head:"break",verb:"break down",meaning:"to stop working (a machine); or to become very upset",example:"The car broke down in the middle of the highway.",fib:"The car ___ in the middle of the highway."},
  {head:"break",verb:"break out",meaning:"to start suddenly (used for wars, fires, diseases)",example:"A fire broke out in the old building last night.",fib:"A fire ___ in the old building last night."},
  {head:"break",verb:"break into",meaning:"to enter a place by force, usually to steal",example:"Someone broke into our neighbour's house while they were away.",fib:"Someone ___ our neighbour's house while they were away."},
  {head:"break",verb:"break up",meaning:"to end a relationship",example:"They broke up after dating for three years.",fib:"They ___ after dating for three years."},
  {head:"turn",verb:"turn down",meaning:"to refuse an offer; or to reduce the volume",example:"She turned down the job offer because the salary was too low.",fib:"She ___ the job offer because the salary was too low."},
  {head:"turn",verb:"turn up",meaning:"to arrive, often unexpectedly; or to increase the volume",example:"He turned up at the party without an invitation.",fib:"He ___ at the party without an invitation."},
  {head:"turn",verb:"turn into",meaning:"to change and become something different",example:"The caterpillar turns into a beautiful butterfly.",fib:"The caterpillar ___ a beautiful butterfly."},
  {head:"turn",verb:"turn off",meaning:"to stop a machine or device from working",example:"Please turn off the lights before you leave.",fib:"Please ___ the lights before you leave."},
  {head:"put",verb:"put off",meaning:"to delay or postpone something",example:"Stop putting off your homework — do it now!",fib:"Stop ___ your homework — do it now!"},
  {head:"put",verb:"put up with",meaning:"to tolerate something unpleasant",example:"I can't put up with this noise any longer.",fib:"I can't ___ this noise any longer."},
  {head:"put",verb:"put on",meaning:"to place clothing on your body",example:"It's cold outside — put on a warm jacket.",fib:"It's cold outside — ___ a warm jacket."},
  {head:"put",verb:"put out",meaning:"to extinguish a fire or flame",example:"The firefighters quickly put out the blaze.",fib:"The firefighters quickly ___ the blaze."}
];

let state = {
  screen: 'home',
  filter: null,
  learnDeck: [],
  learnIndex: 0,
  revealStage: 0, // 0: verb, 1: example, 2: meaning
  practiceDeck: [],
  practiceIndex: 0,
  practiceOptions: [],
  practiceCorrectIdx: 0,
  practiceChosen: null,
  scoreCorrect: 0,
  scoreIncorrect: 0,
  panelOpen: false
};

function shuffle(arr) {
  let a = [...arr];
  for(let i = a.length - 1; i > 0; i--){
    let j = Math.floor(Math.random()*(i+1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getFiltered() {
  return state.filter ? PHRASAL_VERBS.filter(p => p.head === state.filter) : [...PHRASAL_VERBS];
}

// Helper functions for DOM manipulation
function getEl(id) { 
  return document.getElementById(id); 
}

function setVisible(id, visible) {
  const el = getEl(id);
  if (el) {
    el.style.display = visible ? 'block' : 'none';
  }
}

function setOpacity(id, op) {
  const el = getEl(id);
  if (el) {
    el.style.opacity = op;
  }
}

function setText(id, text) {
  const el = getEl(id);
  if (!el) return;
  
  if (el.tagName === 'text') {
    el.textContent = text;
  } else {
    const tspan = el.querySelector('tspan');
    if (tspan) {
      tspan.textContent = text;
    } else {
      el.textContent = text;
    }
  }
}

function makeClickable(el, handler) {
  if (!el) return;
  el.style.cursor = 'pointer';
  el.style.pointerEvents = 'all';
  el.addEventListener('click', handler);
}

function init() {
  // Bind Home Buttons (Learn and Practise)
  // Bind Home Buttons
  makeClickable(getEl('learn-btn'), startLearn);
  makeClickable(getEl('practice-btn'), startPractice);
  makeClickable(getEl('home-btn-learn'), goHome);
  makeClickable(getEl('home-btn-practise'), goHome);

  // Bind Learn Navigation Buttons
  makeClickable(getEl('Group_1633'), learnPrev);
  makeClickable(getEl('Group_1634'), learnNext);
  
  // Bind card clicks for learning - click anywhere on card to reveal
  const cardBases = ['tos-base-01', 'tos-base-02', 'tos-base-03'];
  cardBases.forEach(id => {
    makeClickable(getEl(id), advanceReveal);
  });

  // Tap text prompt for card flip
  makeClickable(getEl('What_do_you_think_this_phrasal_verb_means_'), advanceReveal);

  // Bind Practice Option Buttons (3 options: broke down, broke into, broke out)
  for(let i=0; i<3; i++) {
    makeClickable(getEl(`Group_120${9+i}`), () => choosePractice(i));
  }

  // Bind Practice Navigation Buttons
  makeClickable(getEl('Group_1634_2'), practiceNext);
  makeClickable(getEl('Group_1661'), practiceNext); // "Practise More" button also next (will loop back)

  // Setup Slide Panel for verb filtering
  makeClickable(getEl('panel-slider'), togglePanel);
  
  // Bind Panel Options for filtering
  const verbsToFilter = ["All verbs", "get", "go", "come", "take", "put", "turn", "give", "look", "make", "run", "pick", "bring", "break", "hold", "keep", "set", "carry", "throw", "cut", "check"];
  verbsToFilter.forEach(v => {
    // Map verb names to their SVG element IDs (handle special cases)
    let id = v === "All verbs" ? "All_verbs" : (v === "turn" ? "turn_" : (v === "break" ? "break_3" : v)); 
    makeClickable(getEl(id), () => setFilter(v === "All verbs" ? null : v));
  });

  // Initialize answer overlays as hidden and bind them
  getEl('answer-option-incorrect').style.display = 'none';
  getEl('answer-option-correct').style.display = 'none';
  
  // Make incorrect and correct overlays clickable to proceed
  makeClickable(getEl('answer-option-incorrect'), practiceNext);
  makeClickable(getEl('answer-option-correct'), practiceNext);

  // Start with Home screen
  goHome();
}

function goHome() {
  state.screen = 'home';
  state.panelOpen = false;
  updatePanelUI();
  updateVisibility();
}

function startLearn() {
  state.screen = 'learn';
  state.learnDeck = shuffle(getFiltered());
  state.learnIndex = 0;
  state.revealStage = 0;
  state.panelOpen = false;
  
  updatePanelUI();
  updateLearnUI();
  updateVisibility();
}

function startPractice() {
  state.screen = 'practice';
  state.practiceDeck = shuffle(getFiltered());
  state.practiceIndex = 0;
  state.scoreCorrect = 0;
  state.scoreIncorrect = 0;
  state.panelOpen = false;
  
  setupPracticeQ();
  updatePanelUI();
  updatePracticeUI();
  updateVisibility();
}

function setupPracticeQ() {
  const cur = state.practiceDeck[state.practiceIndex];
  state.practiceChosen = null;
  if(!cur) return;
  
  const same = PHRASAL_VERBS.filter(p => p.head === cur.head && p.verb !== cur.verb);
  const dist = shuffle(same).slice(0,2);
  const opts = shuffle([cur, ...dist]);
  
  state.practiceOptions = opts.map(o => o.verb);
  state.practiceCorrectIdx = state.practiceOptions.indexOf(cur.verb);
}

function advanceReveal() {
  if(state.revealStage < 2) {
    state.revealStage++;
    updateLearnUI();
  }
}

function learnNext() {
  if(state.learnIndex < state.learnDeck.length - 1) {
    state.learnIndex++;
    state.revealStage = 0;
    updateLearnUI();
  }
}

function learnPrev() {
  if(state.learnIndex > 0) {
    state.learnIndex--;
    state.revealStage = 0;
    updateLearnUI();
  }
}

function choosePractice(idx) {
  if(state.practiceChosen !== null) return;
  state.practiceChosen = idx;
  const isCorrect = (idx === state.practiceCorrectIdx);
  if(isCorrect) {
    state.scoreCorrect++;
    showConfetti();
  } else {
    state.scoreIncorrect++;
  }
  updatePracticeUI();
}

function practiceNext() {
  if(state.practiceChosen === null) return; // Prevent next before answer
  if(state.practiceIndex < state.practiceDeck.length - 1) {
    state.practiceIndex++;
    setupPracticeQ();
    updatePracticeUI();
  } else {
    // Finished Practice - go home
    goHome();
  }
}

function togglePanel() {
  state.panelOpen = !state.panelOpen;
  updatePanelUI();
}

function setFilter(v) {
  state.filter = v;
  
  // Highlight visually
  const verbsToFilter = ["All verbs", "get", "go", "come", "take", "put", "turn", "give", "look", "make", "run", "pick", "bring", "break", "hold", "keep", "set", "carry", "throw", "cut", "check"];
  verbsToFilter.forEach(verb => {
    let id = verb === "All verbs" ? "All_verbs" : (verb === "turn" ? "turn_" : (verb === "break" ? "break_3" : verb));
    let tspan = document.querySelector(`[id="${id}"] tspan`);
    if(tspan) {
      if(verb === v || (verb === "All verbs" && v === null)) {
        tspan.style.fill = '#2EF1FF';
        tspan.style.fontWeight = 'bold';
      } else {
        tspan.style.fill = 'white';
        tspan.style.fontWeight = '500';
      }
    }
  });

  if(state.screen === 'learn') startLearn();
  else if(state.screen === 'practice') startPractice();
}

// ===================
// UI UPDATE FUNCTIONS
// ===================

function updateVisibility() {
  const isHome = state.screen === 'home';
  const isLearn = state.screen === 'learn';
  const isPractise = state.screen === 'practice';

  // Home Screen Elements
  setVisible('btn-home-learn-practise', isHome);

  // Hidden learning cards when not in learn
  setVisible('tos-base-01', isLearn);
  setVisible('tos-base-02', isLearn);
  setVisible('tos-base-03', isLearn);

  // Hide sidebars on Home
  setVisible('panel-slider', !isHome);
  setVisible('panel-verbs', !isHome);

  // Learn Screen Elements
  setVisible('header-learn', isLearn);
  setVisible('btn-learn-global', isLearn);
  setVisible('learn-tos', isLearn);
  
  // Practise Screen Elements
  setVisible('header-practise', isPractise);
  setVisible('practise-index', isPractise);
  setVisible('btn-practise-global', isPractise);
  setVisible('practise-tos-base', isPractise);
  setVisible('practise-tos', isPractise);
  setVisible('answer-option-default', isPractise);
}

function updatePanelUI() {
  const panel = getEl('panel-verbs');
  const slider = getEl('panel-slider');
  const sliderPath = getEl('Polygon_1'); 
  
  if(panel && slider) {
    if(state.panelOpen) {
      panel.setAttribute('transform', 'translate(0, 0)');
      slider.setAttribute('transform', 'translate(220, 0)');
      if(sliderPath) sliderPath.setAttribute('transform', 'scale(-1, 1) translate(-70, 0)');
    } else {
      panel.setAttribute('transform', 'translate(-270, 0)');
      slider.setAttribute('transform', 'translate(0, 0)');
      if(sliderPath) sliderPath.setAttribute('transform', 'scale(1, 1) translate(0, 0)');
    }
  }
}

function updateLearnUI() {
  if(state.screen !== 'learn') return;
  const item = state.learnDeck[state.learnIndex];
  if(!item) return;

  // Show the appropriate card base based on reveal stage
  setVisible('tos-base-01', state.revealStage === 0);
  setVisible('tos-base-02', state.revealStage === 1);
  setVisible('tos-base-03', state.revealStage === 2);

  // Update phrasal verb text (always visible in stage 0)
  setText('break down', item.verb);
  
  // Update example sentence text (visible from stage 1 onwards)
  setText('example_sentence_text', item.example);
  
  // Update meaning text (visible from stage 2 onwards)
  setText('stop_working_machine_', item.meaning);
  setVisible('stop_working_machine_', state.revealStage >= 2);
  setVisible('Meaning', state.revealStage >= 2);

  // Update prompt text based on reveal stage
  const promptText = state.revealStage === 0 ? 
    "What do you think this phrasal verb means?" : 
    (state.revealStage === 1 ? "Tap the card to see the meaning." : "");
  setText('What do you think this phrasal verb means_', promptText);

  // Update button opacity based on navigation state
  setOpacity('Group_1633', state.learnIndex > 0 ? "1" : "0.3");
  setOpacity('Group_1634', state.learnIndex < state.learnDeck.length - 1 ? "1" : "0.3");
}

function updatePracticeUI() {
  if(state.screen !== 'practice') return;
  const item = state.practiceDeck[state.practiceIndex];
  if(!item) return;

  // Update question pagination display (e.g., "1/4", "2/4", etc.)
  setText('1/4', `${state.practiceIndex + 1}/${state.practiceDeck.length}`);
  setText('practice_fib_text', item.fib);

  // Update answer option buttons (3 options)
  const optionIds = ['Group_1209', 'Group_1210', 'Group_1211'];
  const textIds = ['broke_down_2', 'broke_into', 'broke_out'];
  
  for(let i=0; i<3; i++) {
    // Update text for each option
    setText(textIds[i], state.practiceOptions[i] || "");
    
    const optionGroup = getEl(optionIds[i]);
    if(!optionGroup) continue;

    // Manage visibility and opacity based on selection state
    if(state.practiceChosen !== null) {
      // An answer has been chosen
      if(state.practiceChosen === i) {
        // This was the clicked option - hide because it's covered by overlay
        optionGroup.style.display = 'none';
      } else if(i === state.practiceCorrectIdx) {
        // This is the correct answer (show but dim if not chosen)
        optionGroup.style.display = 'block';
        optionGroup.style.opacity = '0.5';
      } else {
        // Wrong option that wasn't chosen
        optionGroup.style.display = 'block';
        optionGroup.style.opacity = '0.3';
      }
    } else {
      // No answer chosen yet - all visible and interactive
      optionGroup.style.display = 'block';
      optionGroup.style.opacity = '1';
    }
  }

  // Show/hide and position answer overlays
  const correctGroup = getEl('answer-option-correct');
  const incorrectGroup = getEl('answer-option-incorrect');
  
  if(state.practiceChosen === null) {
    // No answer chosen yet
    if(correctGroup) correctGroup.style.display = 'none';
    if(incorrectGroup) incorrectGroup.style.display = 'none';
  } else {
    const isAnsCorrect = state.practiceChosen === state.practiceCorrectIdx;
    
    // Always show the correct answer overlay at the correct option position
    if(correctGroup) {
      correctGroup.style.display = 'block';
      // Y positions in SVG: option 0 at 553, option 1 at 657, option 2 at 761
      // Offset from first option: 0, 104, 208
      const yOffset = state.practiceCorrectIdx * 104;
      correctGroup.setAttribute('transform', `translate(0, ${yOffset})`);
      setText('broke_down_3', state.practiceOptions[state.practiceCorrectIdx]);
    }
    
    // Show incorrect overlay only if answer was wrong
    if(!isAnsCorrect && incorrectGroup) {
      incorrectGroup.style.display = 'block';
      // Position incorrect overlay at the chosen (wrong) option position
      const yOffset = state.practiceChosen * 104;
      incorrectGroup.setAttribute('transform', `translate(0, ${yOffset})`);
      setText('broke_into_2', state.practiceOptions[state.practiceChosen]);
    } else if(incorrectGroup) {
      incorrectGroup.style.display = 'none';
    }
  }

  // Update navigation buttons visibility
  const isLastQuestion = state.practiceIndex === state.practiceDeck.length - 1;
  setVisible('Group_1634_2', !isLastQuestion);
  setVisible('Group_1661', isLastQuestion);
  
  // Update button opacity based on whether an answer was chosen
  const nextOpacity = state.practiceChosen !== null ? "1" : "0.3";
  setOpacity('Group_1634_2', nextOpacity);
  setOpacity('Group_1661', nextOpacity);
}

// Visual Effects
function showConfetti() {
  if (typeof lottie !== 'undefined') {
    const container = document.getElementById('lottie-confetti');
    if(container) {
      container.innerHTML = '';
    }
  }
}

window.addEventListener('DOMContentLoaded', init);
