// ================= STATE =================
const state = {
    selectedElement: null,
    electronSequence: [],
    currentElectron: 1,
    feedbackPopup: null,
    
};

// ================= DATA =================
const orbitals = [
  { id: '1s', boxes: 1 },
  { id: '2s', boxes: 1 },
  { id: '2p', boxes: 3 },
  { id: '3s', boxes: 1 },
  { id: '3p', boxes: 3 },
  { id: '4s', boxes: 1 },
  { id: '3d', boxes: 5 },
  { id: '4p', boxes: 3 },
  { id: '5s', boxes: 1 },
  { id: '4d', boxes: 5 },
  { id: '5p', boxes: 3 },
  { id: '6s', boxes: 1 },
  { id: '4f', boxes: 7 },
  { id: '5d', boxes: 5 },
  { id: '6p', boxes: 3 },
  { id: '7s', boxes: 1 }
];

const elements = [
    { symbol: 'H', name: 'Hydrogen', number: 1 },
    { symbol: 'He', name: 'Helium', number: 2 },
    { symbol: 'C', name: 'Carbon', number: 6 },
    { symbol: 'N', name: 'Nitrogen', number: 7 },
    { symbol: 'O', name: 'Oxygen', number: 8 },
    { symbol: 'Ne', name: 'Neon', number: 10 },
    { symbol: 'Na', name: 'Sodium', number: 11 },
    { symbol: 'Mg', name: 'Magnesium', number: 12 },
    { symbol: 'Al', name: 'Aluminium', number: 13 },
    { symbol: 'P', name: 'Phosphorus', number: 15 },
    { symbol: 'Cl', name: 'Chlorine', number: 17 },
    { symbol: 'Ar', name: 'Argon', number: 18 }
];

const elementLayout = [
  { symbol: "H", number: 1, row: 1, col: 1 },
  { symbol: "He", number: 2, row: 1, col: 3 },

  { symbol: "Li", number: 3, row: 2, col: 1 },
  { symbol: "Be", number: 4, row: 2, col: 2 },
  { symbol: "B", number: 5, row: 2, col: 3 },

  { symbol: "C", number: 6, row: 3, col: 1 },
  { symbol: "N", number: 7, row: 3, col: 2 },
  { symbol: "O", number: 8, row: 3, col: 3 },

  { symbol: "F", number: 9, row: 4, col: 1 },
  { symbol: "Ne", number: 10, row: 4, col: 2 },
  { symbol: "Na", number: 11, row: 4, col: 3 },

  { symbol: "Mg", number: 12, row: 5, col: 1 },
  { symbol: "Al", number: 13, row: 5, col: 2 },
  { symbol: "Si", number: 14, row: 5, col: 3 },

  { symbol: "P", number: 15, row: 6, col: 1 },
  { symbol: "S", number: 16, row: 6, col: 2 },
  { symbol: "Cl", number: 17, row: 6, col: 3 },

  { symbol: "Ar", number: 18, row: 7, col: 2 }
];

state.ui = {
  mode: "onboarding", // onboarding | active | completed
  showHint: false
};

// ================= LOGIC =================
function getCorrectSequence(n) {
    let seq = [];

    for (const o of orbitals) {
        for (let i = 0; i < o.boxes && seq.length < n; i++) {
            seq.push({ orbital: o.id, box: i, spin: 'up' });
        }
        for (let i = 0; i < o.boxes && seq.length < n; i++) {
            seq.push({ orbital: o.id, box: i, spin: 'down' });
        }
    }
    return seq;
}

function getNext() {
    if (!state.selectedElement) return null;
    return getCorrectSequence(state.selectedElement.number)[state.currentElectron - 1];
}

function getConfig() {
  let map = {};

  state.electronSequence.forEach(e => {
    map[e.orbital] = (map[e.orbital] || 0) + 1;
  });

  return Object.entries(map)
    .map(([orbital, count]) => {
      return `${orbital}<sup>${count}</sup>`;
    })
    .join(' ');
}

// ================= INTERACTION =================
function handleClick(orb, box, spin) {

  if (!state.selectedElement) return;

  const next = getNext();
  if (!next) return;

  // ✅ FIRST validate
  if (!(next.orbital === orb && next.box === box && next.spin === spin)) {
    state.feedbackPopup = {
      type: 'incorrect',
      message: `Follow Aufbau → Next is ${next.orbital}`
    };
    render();
    return;
  }

  // ✅ THEN process
  state.electronSequence.push({ orbital: orb, box, spin });
  state.currentElectron++;

  let msg = spin === 'up'
    ? "Correct! Hund’s Rule"
    : "Correct! Pauli Principle";

  state.feedbackPopup = { type: 'correct', message: msg };

  // ✅ completion
  if (state.currentElectron > state.selectedElement.number) {
    state.ui.mode = "completed";
    }

  render();
}

// ================= UI =================
function renderBox(o, i) {

  const next = getNext();
  const isNext = next && next.orbital === o.id && next.box === i;

  const filled = state.electronSequence.filter(e => e.orbital === o.id && e.box === i);

  const hasDown = filled.some(e => e.spin === 'down');
  const hasUp = filled.some(e => e.spin === 'up');

  return `
  <div class="flex flex-col gap-1">

    <!-- DOWN -->
    <button onclick="handleClick('${o.id}',${i},'down')" 
      class="box-btn down 
      ${hasDown ? 'filled-down' : 'empty'} 
      ${isNext && next?.spin==='down' ? 'active' : ''}">
      ↓
    </button>

    <!-- UP -->
    <button onclick="handleClick('${o.id}',${i},'up')" 
      class="box-btn up 
      ${hasUp ? 'filled-up' : 'empty'} 
      ${isNext && next?.spin==='up' ? 'active' : ''}">
      ↑
    </button>

  </div>`;
}

function renderCompletionPopup() {
  return `
    <div class="completion-overlay">

      <div class="completion-card">

        <div class="completion-title">
          Configuration Complete!
        </div>

        <div class="completion-text">
          Perfect! You've successfully configured 
          all ${state.selectedElement.number} electrons 
          for ${state.selectedElement.name}!
        </div>

        <button onclick="continueAfterComplete()" class="completion-btn">
          Continue
        </button>

      </div>

    </div>
  `;
}

function continueAfterComplete() {
  state.ui.mode = "active"; // or onboarding if you want reset
  render();
}

function toggleHint() {
  console.log("HINT CLICKED");

  state.ui.showHint = !state.ui.showHint;
  render();   // 🔥 IMPORTANT
}



function render() {

  ensureOverlayLayers();

  let overlay = "";

  if (state.ui.mode === "completed") {
    overlay += renderCompletionPopup();
  }

  if (state.ui.showHint) {

  }

  const isOnboarding = state.ui.mode === "onboarding";

  document.getElementById('app').innerHTML = `

    ${overlay}

    <div class="main-layout">

      <!-- LEFT PANEL -->
      <div class="left-panel">

        ${!isOnboarding ? renderOrbitals() : ""}

        ${isOnboarding ? `
          <div class="onboarding-center">
            <div class="onboarding-title">Select an Element</div>
            <div class="onboarding-sub">Choose from the panel to start</div>
          </div>
        ` : ""}

        ${isOnboarding ? `
        <div class="onboarding-arrow">
          <svg viewBox="0 0 240 160">

            <defs>
              <marker 
                id="arrowhead"
                markerWidth="6"
                markerHeight="6"
                refX="5"
                refY="3"
                orient="auto"
              >
                <path d="M0,0 L6,3 L0,6 Z" fill="#57C9D5" />
              </marker>
            </defs>

            <path
              d="M20,140 C80,40 180,20 220,40"
              stroke="#57C9D5"
              stroke-width="3"
              fill="none"
              stroke-linecap="round"
              marker-end="url(#arrowhead)"
            />

          </svg>
        </div>
        ` : ""}

        ${!isOnboarding ? `
          <div class="config-box">
            <div class="config-title">Electronic Configuration</div>
            <div class="config-value">
              ${state.electronSequence.length === 0 
                ? "Click boxes to build..." 
                : getConfig()}
            </div>
          </div>
        ` : ""}

      </div>

      <!-- RIGHT PANEL -->
      <div class="right-panel">

        <div class="right-layout">

          <!-- LEFT COLUMN -->
          <div class="right-left">
            ${renderElementSelector()}
            ${renderElementCard()}
            ${renderQuickRules()}
          </div>

          <!-- RIGHT COLUMN -->
          <div class="right-right">
            ${renderAufbau()}
          </div>

        </div>

      </div>

    </div>

  

 `;

setTimeout(() => {
  const next = getNext();

  document.querySelectorAll('.orb').forEach(el => {
    el.classList.remove('active-orb');
  });

  if (!next) return;   // 🔥 CRITICAL

  const active = document.querySelector(`[data-orb="${next.orbital}"]`);
  if (active) {
    active.classList.add('active-orb');
  }
}, 0);


  renderGlobalControls();

// 🔥 ALWAYS control popup layer here
if (state.ui.showHint) {
  renderHint();
} else {
  document.getElementById("popup-layer").innerHTML = "";
}

if (state.ui.showHint) {
  overlay += `<div class="interaction-blocker"></div>`;
}
}



function reset() {
    state.electronSequence = [];
    state.currentElectron = 1;
}

// ================= AUTO DEMO =================
function autoFill() {
    if (!state.selectedElement) return;

    const seq = getCorrectSequence(state.selectedElement.number);
    let i = 0;

    const interval = setInterval(() => {
        if (i >= seq.length) {
            clearInterval(interval);
            return;
        }
        state.electronSequence.push(seq[i]);
        state.currentElectron++;
        render();
        i++;
    }, 300);
}

// INIT
render();

function renderOrbitals() {

    if (state.ui.mode === "onboarding") {
    return "";   // 🔥 return NOTHING
  }


  const layout = [
    { id:'1s', class:'o-1s', boxes:1 },
    { id:'2s', class:'o-2s', boxes:1 },
    { id:'2p', class:'o-2p', boxes:3 },

    { id:'3s', class:'o-3s', boxes:1 },
    { id:'3p', class:'o-3p', boxes:3 },
    { id:'3d', class:'o-3d', boxes:5 },

    { id:'4s', class:'o-4s', boxes:1 },
    { id:'4p', class:'o-4p', boxes:3 },
    { id:'4d', class:'o-4d', boxes:5 },
    { id:'4f', class:'o-4f', boxes:7 },

    { id:'5s', class:'o-5s', boxes:1 },
    { id:'5p', class:'o-5p', boxes:3 },
    { id:'5d', class:'o-5d', boxes:5 },

    { id:'6s', class:'o-6s', boxes:1 },
    { id:'6p', class:'o-6p', boxes:3 },

    { id:'7s', class:'o-7s', boxes:1 }
  ];

  return `
    <div class="orbital-layout">
      ${layout.map(o => `
        <div class="orbital ${o.class}">
          <div class="label">${o.id}</div>
          ${Array.from({length:o.boxes},(_,i)=>renderBox({id:o.id},i)).join("")}
        </div>
      `).join("")}
    </div>
  `;
}

function renderElementSelector() {

  const allowedSymbols = elements.map(e => e.symbol);

  return `
    <div class="element-card">
      <div class="element-title">Select Element</div>

      <div class="element-grid">
        ${elementLayout
          .filter(el => allowedSymbols.includes(el.symbol))   // ✅ KEY LINE
          .map(el => `
            <div 
              class="element-box ${state.selectedElement?.symbol === el.symbol ? 'active' : ''}"
              onclick="selectElement('${el.symbol}', ${el.number})"
            >
              <div class="symbol">${el.symbol}</div>
              <div class="number">${el.number}</div>
            </div>
          `).join("")}
      </div>
    </div>
  `;
}


function renderElementCard() {
  if (!state.selectedElement) return '';

  const progress = ((state.currentElectron - 1) / state.selectedElement.number) * 100;

  return `
  <div class="element-info-card">

    <div class="element-name">
      ${state.selectedElement.name}
    </div>

    <div class="element-progress-text">
      Electron: ${state.currentElectron - 1}/${state.selectedElement.number}
    </div>

    <div class="progress-bar">
      <div class="progress-fill" style="width:${progress}%"></div>
    </div>

  </div>
  `;
}

function renderQuickRules() {
  return `
  <div class="rules-card">

    <div class="rules-title">Quick Rules</div>

    <ul class="rules-list">
      <li><span class="highlight">Aufbau:</span> Fill lower energy first</li>
      <li><span class="highlight">Hund’s:</span> Spread ↑ before pairing</li>
      <li><span class="highlight">Pauli:</span> Max 2e⁻ per box (↑↓)</li>
    </ul>

  </div>
  `;
}
function renderAufbau() {
  return `
  <div class="aufbau-card">

    <div class="aufbau-title">Aufbau Diagram</div>
    <div class="aufbau-sub">Order of filling orbitals →</div>

    

    <div class="aufbau-diagonal">

      <div class="row r1">
        <div class="orb y" data-orb="1s">1s</div>
      </div>

      <div class="row r2">
        <div class="orb y" data-orb="2s">2s</div>
        <div class="orb p" data-orb="2p">2p</div>
      </div>

      <div class="row r3">
        <div class="orb g" data-orb="3s">3s</div>
        <div class="orb g" data-orb="3p">3p</div>
        <div class="orb g" data-orb="3d">3d</div>
      </div>

      <div class="row r4">
        <div class="orb t" data-orb="4s">4s</div>
        <div class="orb t" data-orb="4p">4p</div>
        <div class="orb t" data-orb="4d">4d</div>
        <div class="orb t" data-orb="4f">4f</div>
      </div>

      <div class="row r5">
        <div class="orb b" data-orb="5s">5s</div>
        <div class="orb b" data-orb="5p">5p</div>
        <div class="orb b" data-orb="5d">5d</div>
      </div>

      <div class="row r6">
        <div class="orb v" data-orb="6s">6s</div>
        <div class="orb v" data-orb="6p">6p</div>
      </div>

      <div class="row r7">
        <div class="orb r" data-orb="7s">7s</div>
      </div>

    </div>

    <div class="aufbau-note">
      Follow diagonals from top-right to bottom-left
    </div>

  </div>
  `;
}

function renderControls() {
  return `
    <div class="control-row">

      <div class="left-space"></div>

      <button onclick="resetAll()" class="reset-btn">
        Reset
      </button>

      <button onclick="closeHint()" 
        class="hint-btn" 
        id="hintBtn"
        ${state.ui.isHintEnabled ? "" : "disabled"}>
              <span class="hint-icon">💡</span>
        <span class="hint-text">Hint</span>
      </button>

    </div>
  `;
}

function renderHint() {
  const next = getNext();

  // CASE 1: No element selected OR completed
  if (!next) {
    document.getElementById("popup-layer").innerHTML = `
      <div class="hint-popup">
        <div class="hint-card">
          <div class="hint-text-big">
            Select an element to start building configuration.
          </div>
        </div>
      </div>
    `;
    return;
  }

  // ✅ CASE 2: NORMAL HINT (THIS WAS MISSING)

  const isUp = next.spin === 'up';
  const isDown = next.spin === 'down';

  document.getElementById("popup-layer").innerHTML = `
    <div class="hint-popup">

      <div class="hint-card">


        <div class="hint-close" onclick="closeHint()">✕</div>

        <div class="hint-body">

          <div class="hint-icons">
            <div class="box-btn down ${isDown ? 'active' : ''}">↓</div>
            <div class="box-btn up ${isUp ? 'active' : ''}">↑</div>
          </div>

          <div class="hint-text-big">
            Next electron goes in <b>${next.orbital}</b> (${isUp ? '↑' : '↓'} spin).
          </div>

        </div>

      </div>

    </div>
  `;
}

function selectElement(symbol, number) {
  const elementData = elements.find(e => e.symbol === symbol);

  state.selectedElement = elementData;
  state.atomicNumber = number;

  state.ui.isHintEnabled = true;   // ✅ ENABLE HERE

  state.ui.mode = "active";
  state.ui.showHint = false;

  reset();
  render();
}

function resetAll() {

  state.selectedElement = null;
  state.electronSequence = [];
  state.currentElectron = 1;

  state.ui.mode = "onboarding";
  state.ui.showHint = false;
  state.ui.isHintEnabled = false;  // ✅ ADD THIS

  render();
}

function renderGlobalControls() {

  // RESET
document.getElementById("reset-layer").innerHTML = `
  <button onclick="resetAll()" 
    class="reset-btn"
    ${state.ui.showHint ? "disabled" : ""}>
    Reset
  </button>
`;

  // HINT (UPDATED)
 document.getElementById("hint-layer").innerHTML = `
  <button onclick="toggleHint()" 
    class="hint-btn"
    ${state.ui.isHintEnabled ? "" : "disabled"}>
    
    <span class="hint-icon">💡</span>
    <span class="hint-text">Hint</span>

  </button>
`;
}


renderGlobalControls();

if (state.ui.showHint) {
  renderHint();
} else {
  document.getElementById("popup-layer").innerHTML = "";
}

function ensureOverlayLayers() {
  const root = document.getElementById("overlay-root");

  if (!document.getElementById("reset-layer")) {
    root.innerHTML = `
      <div id="reset-layer"></div>
      <div id="popup-layer"></div>
      <div id="hint-layer"></div>
    `;
  }
}

function closeHint() {
  state.ui.showHint = false;

  // 🔥 immediate cleanup (important)
  const popup = document.getElementById("popup-layer");
  if (popup) popup.innerHTML = "";

  render();
}