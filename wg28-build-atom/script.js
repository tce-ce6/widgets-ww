let elementData = [];
const MAX_PROTONS = 20;
const MAX_NEUTRONS = 20;
let isAnswerShown = false;

let savedUserProtons = [];
let savedUserNeutrons = [];
let savedUserElectrons = [];

// =============================
// ELECTRON GLOBALS
// =============================

// store electron DOM elements
const electronParticles = [];

// electron shell limits
const SHELL_CAPACITY = [2, 8, 8, 18]; // K,L,M,N shells

// shell radii (distance from nucleus)
const SHELL_RADII = [100, 150, 200, 250]; // px


document.addEventListener("DOMContentLoaded", async () => {
  const container = document.querySelector("#molecule-listing");
  elementData = await fetch("atom-data.json").then(r => r.json());
  populateSidebarList();
  moleculeList.addEventListener("scroll", updateScrollDownButton);

  console.log("elementData", elementData);

  // 1. Load JSON manually so we can read ln / nm
  const json = await fetch("atom-lottie.json").then(r => r.json());

  // 2. Start animation using the JSON object
  const anim = lottie.loadAnimation({
    container,
    renderer: "svg",
    loop: false,
    autoplay: true,
    animationData: json
  });

  // 3. When SVG is built, replace ln → nm
  anim.addEventListener("DOMLoaded", () => {
    const svg = container.querySelector("svg");
    applyNameIds(json, svg);
  });

});
document.querySelector("#check-ans").addEventListener("click", checkAnswer);
document.querySelector("#reset-btn").addEventListener("click", resetStep2);
document.querySelector("#show-ans").addEventListener("click", toggleShowAnswer);

document.getElementById("sidebar-btn").addEventListener("click", () => {
  document.getElementById("sidebar-wrapper").classList.toggle("active");
});

const moleculeList = document.querySelector("#molecule-list");
const scrollDownBtn = document.querySelector(".scoll-down");


// =============================
// Convert ln → nm for all layers
// =============================
function applyNameIds(json, svg) {
  if (!json.layers) return;

  json.layers.forEach(layer => {
    const ln = layer.ln;
    const nm = layer.nm;

    if (!ln || !nm) return;

    const newId = nm
      .trim()
      .replace(/\s+/g, "_")
      .replace(/[^\w\-]/g, "");

    const target = svg.getElementById(ln);

    if (target) {
      target.id = newId;
      target.style.cursor = "pointer";

      target.addEventListener("click", () => {
        selectedAtom = newId;

        document.querySelector("#step1").style.display = "none";
        document.querySelector("#step2").style.display = "block";
        document.querySelector("#btn-wrapper").style.display = "block";   // 👈 NEW

        const cleanName = selectedAtom.split("_")[0];
        document.querySelector("#molecule-name").textContent = cleanName;

        setActiveSidebarItem(cleanName);

        // Lookup symbol from your JSON
        const match = elementData.find(e => e.element.toLowerCase() === cleanName.toLowerCase());
        console.log("match.symbol", match.symbol);

        if (match) {
          // document.querySelector("#selected-atom").textContent = match.symbol;
        } else {
          // document.querySelector("#selected-atom").textContent = "?";
        }
      });

    }
  });
}


// =============================
// BUTTON ACTIONS
// =============================
document.querySelector("#add-proton-button").addEventListener("click", () => {
  addParticle("proton");
});

document.querySelector("#remove-proton-button").addEventListener("click", () => {
  removeParticle("proton");
});

document.querySelector("#add-neutron-button").addEventListener("click", () => {
  addParticle("neutron");
});

document.querySelector("#remove-neutron-button").addEventListener("click", () => {
  removeParticle("neutron");
});

document.querySelector("#add-electron-button").addEventListener("click", () => {
  addElectron();
});

document.querySelector("#remove-electron-button").addEventListener("click", () => {
  removeElectron();
});

function addElectron() {
  resetFeedback();

  const totalElectrons = electronParticles.length;

  // Determine shell index from current total electrons
  let shellIndex = 0;
  let remaining = totalElectrons;

  while (shellIndex < SHELL_CAPACITY.length && remaining >= SHELL_CAPACITY[shellIndex]) {
    remaining -= SHELL_CAPACITY[shellIndex];
    shellIndex++;
  }

  // No more shells available
  if (shellIndex >= SHELL_CAPACITY.length) {
    document.querySelector("#limit-note").textContent = "Maximum shell limit reached!";
    return;
  }

  // Check shell capacity
  if (remaining >= SHELL_CAPACITY[shellIndex]) {
    document.querySelector("#limit-note").textContent =
      `Shell ${shellIndex + 1} is full`;
    return;
  }

  document.querySelector("#limit-note").textContent = "";

  // Create electron
  const electronWrapper = document.querySelector("#electron-wrapper");  // 👈 FIX
  const electronImg = document.createElement("img");

  electronImg.src = "assets/electron.svg";
  electronImg.classList.add("electron");
  electronImg.style.width = "20px";
  electronImg.style.position = "absolute";

  electronImg.addEventListener("click", () => removeSingleElectron(electronImg));

  electronWrapper.appendChild(electronImg);  // 👈 FIXED append target

  electronParticles.push(electronImg);

  updateElectronPositions();
  updateCounters();
  updateShellCounts(); // 👈 NEW

}


function removeElectron() {
  const last = electronParticles.pop();
  if (last) last.remove();

  resetFeedback();
  updateElectronPositions();
  updateCounters();
  updateShellCounts(); // 👈 NEW

}

function removeSingleElectron(el) {
  el.remove();

  const index = electronParticles.indexOf(el);
  if (index !== -1) electronParticles.splice(index, 1);

  resetFeedback();
  updateElectronPositions();
  updateCounters();
  updateShellCounts(); // 👈 NEW

}

function updateElectronPositions() {
  const droppingWrapper = document.querySelector("#droping-wrapper");
  const rect = droppingWrapper.getBoundingClientRect();
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;

  let electronIndex = 0;

  SHELL_CAPACITY.forEach((capacity, shell) => {
    const electronsInShell = electronParticles.slice(
      electronIndex,
      electronIndex + capacity
    );

    const count = electronsInShell.length;
    const radius = SHELL_RADII[shell];

    electronsInShell.forEach((electron, i) => {
      const angle = (i / count) * Math.PI * 2;

      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      electron.style.left = `${x}px`;
      electron.style.top = `${y}px`;
    });

    electronIndex += count;
  });

  updateShellRings();
  updateShellCounts(); // 👈 NEW
}






// Global array to hold the DOM elements of the added particles
const droppedParticles = [];
// Keep track of the last particle's position for stacking
let lastParticlePosition = { x: 0, y: 0, z: 0 };

// =============================
// PARTICLE ADDITION LOGIC
// =============================
function addParticle(type) {
  const protonCount = droppedParticles.filter(p => p.classList.contains("proton")).length;
  const neutronCount = droppedParticles.filter(p => p.classList.contains("neutron")).length;

  // ===== LIMIT CHECKS =====
  if (type === "proton" && protonCount >= MAX_PROTONS) {
    document.querySelector("#limit-note").textContent = "Proton limit reached (20 max)";
    return;
  }

  if (type === "neutron" && neutronCount >= MAX_NEUTRONS) {
    document.querySelector("#limit-note").textContent = "Neutron limit reached (20 max)";
    return;
  }

  // Clear previous limit messages
  document.querySelector("#limit-note").textContent = "";

  resetFeedback();


  const droppingWrapper = document.querySelector("#droping-wrapper");
  if (!droppingWrapper) return;

  const particleImg = document.createElement("img");
  particleImg.classList.add("nucleus-particle", type);

  particleImg.addEventListener("click", () => {
    removeSingleParticle(particleImg);
  });

  if (type === "proton") {
    particleImg.src = "assets/proton.svg";
  } else if (type === "neutron") {
    particleImg.src = "assets/neutron.svg";
  } else {
    return;
  }

  particleImg.style.width = '30px';
  particleImg.style.height = '30px';

  const particleCount = droppedParticles.length;
  const radius = 10;
  const angle = particleCount * 0.618034 * 2 * Math.PI;

  const offsetX = radius * Math.sqrt(particleCount) * Math.cos(angle);
  const offsetY = radius * Math.sqrt(particleCount) * Math.sin(angle);

  const zOffset = particleCount * - 0.1;
  const rotation = Math.random() * 360;

  particleImg.style.position = 'absolute';
  particleImg.style.left = `calc(50% + ${offsetX}px)`;
  particleImg.style.top = `calc(50% + ${offsetY}px)`;
  particleImg.style.transform = `translate(-50%, -50%) translateZ(${zOffset}px) rotate(${rotation}deg)`;
  particleImg.style.zIndex = 100 - particleCount;

  droppingWrapper.appendChild(particleImg);
  droppedParticles.push(particleImg);
  repositionParticles();

  updateCounters();
}


function removeParticle(type) {
  const index = droppedParticles.findIndex(p => p.classList.contains(type));

  if (index !== -1) {
    droppedParticles[index].remove();
    droppedParticles.splice(index, 1);
  }

  // Clear limit note
  document.querySelector("#limit-note").textContent = "";
  resetFeedback();
  repositionParticles();   // 👈 NEW
  updateCounters();
}


// =============================
// COUNTER UPDATE LOGIC
// =============================
function updateCounters() {
  const protonCount = droppedParticles.filter(p => p.classList.contains("proton")).length;
  const neutronCount = droppedParticles.filter(p => p.classList.contains("neutron")).length;
  const electronCount = electronParticles.length; // 👈 NEW

}


function checkAnswer() {
  resetFeedback(); // clear previous messages

  const protonCount = droppedParticles.filter(p => p.classList.contains("proton")).length;
  const neutronCount = droppedParticles.filter(p => p.classList.contains("neutron")).length;

  const cleanName = selectedAtom.split("_")[0];

  // Find isotope from JSON
  const match = elementData.find(e =>
    e.element.toLowerCase() === cleanName.toLowerCase() &&
    e.protons === protonCount &&
    e.neutrons === neutronCount
  );

  const note = document.querySelector("#indicator-note");

  if (match) {
    // ✔ Correct answer
    note.textContent = "That is the correct answer!";
    note.style.color = "green";
  } else {
    // ❌ Incorrect answer
    note.textContent = "That's incorrect. Try again!";
    note.style.color = "red";
  }
}


function resetFeedback() {
  const note = document.querySelector("#indicator-note");

  note.textContent = "";
  note.style.color = "";
  document.querySelector("#limit-note").textContent = "";
}


function resetStep2() {
  // remove nucleus particles
  droppedParticles.forEach(p => p.remove());
  droppedParticles.length = 0;

  // remove electrons
  electronParticles.forEach(e => e.remove());
  electronParticles.length = 0;

  // update counters
  updateCounters();

  // hide feedback
  document.querySelector("#feedback-image").style.display = "none";
  document.querySelector("#indicator-note").textContent = "";
  document.querySelector("#limit-note").textContent = "";

  // reset shell counts
  document.getElementById("shell-k").textContent = 0;
  document.getElementById("shell-L").textContent = 0;
  document.getElementById("shell-M").textContent = 0;
  document.getElementById("shell-N").textContent = 0;

  // remove shell rings
  const shellWrapper = document.querySelector("#shell-wrapper");
  if (shellWrapper) shellWrapper.innerHTML = "";
}



function repositionParticles() {
  const radius = 10;

  droppedParticles.forEach((particle, index) => {
    const angle = index * 0.618034 * 2 * Math.PI; // golden angle
    const offsetX = radius * Math.sqrt(index) * Math.cos(angle);
    const offsetY = radius * Math.sqrt(index) * Math.sin(angle);

    const zOffset = index * 0.1;
    const rotation = Math.random() * 360;

    particle.style.left = `calc(50% + ${offsetX}px)`;
    particle.style.top = `calc(50% + ${offsetY}px)`;
    particle.style.transform =
      `translate(-50%, -50%) translateZ(${zOffset}px) rotate(${rotation}deg)`;
    particle.style.zIndex = 100 - index;
  });
}
function removeSingleParticle(particle) {
  // Remove from DOM
  particle.remove();

  // Remove from droppedParticles array
  const index = droppedParticles.indexOf(particle);
  if (index !== -1) {
    droppedParticles.splice(index, 1);
  }

  // Reset UI
  resetFeedback();
  document.querySelector("#limit-note").textContent = "";

  // Reposition remaining particles
  repositionParticles();

  // Update counters
  updateCounters();
}
function populateSidebarList() {
  const list = document.querySelector("#molecule-list");
  list.innerHTML = ""; // clear first

  // Use unique element names only (Hydrogen, Helium, Lithium…)
  const uniqueElements = [...new Set(elementData.map(e => e.element))];

  uniqueElements.forEach(elementName => {
    const li = document.createElement("li");
    li.textContent = elementName;
    li.classList.add("molecule-item");

    // On click → behave like clicking the SVG atom
    li.addEventListener("click", () => handleElementSelection(elementName));

    list.appendChild(li);
  });
}
function handleElementSelection(elementName) {
  selectedAtom = elementName;

  // Switch steps
  document.querySelector("#step1").style.display = "none";
  document.querySelector("#step2").style.display = "block";
  document.querySelector("#btn-wrapper").style.display = "block";

  setActiveSidebarItem(elementName);

  // Update name
  document.querySelector("#molecule-name").textContent = elementName;

  // Find its symbol
  const match = elementData.find(e => e.element.toLowerCase() === elementName.toLowerCase());

  if (match) {
    document.querySelector("#selected-atom").textContent = match.symbol;
  } else {
    document.querySelector("#selected-atom").textContent = "?";
  }

  // Reset UI (recommended)
  resetStep2();
}

function setActiveSidebarItem(elementName) {
  const items = document.querySelectorAll("#molecule-list .molecule-item");

  items.forEach(li => {
    if (li.textContent.trim().toLowerCase() === elementName.toLowerCase()) {
      li.classList.add("active");
    } else {
      li.classList.remove("active");
    }
  });
}

function updateScrollDownButton() {
  const scrollTop = moleculeList.scrollTop;
  const visibleHeight = moleculeList.clientHeight;
  const totalHeight = moleculeList.scrollHeight;

  scrollDownBtn.classList.remove("top", "bottom");

  // list not scrollable → no indicator at all
  if (totalHeight <= visibleHeight) {
    return;
  }

  const atTop = scrollTop <= 5;
  const atBottom = scrollTop + visibleHeight >= totalHeight - 5;

  if (atBottom) {
    scrollDownBtn.classList.add("top");     // show "scroll to top"
  } else if (atTop) {
    scrollDownBtn.classList.add("bottom");  // show "scroll to bottom"
  }
}

document.querySelector("#home-btn").addEventListener("click", () => {

  // Hide step2, show step1
  document.querySelector("#step2").style.display = "none";
  document.querySelector("#step1").style.display = "block";

  // Hide button wrapper
  document.querySelector("#btn-wrapper").style.display = "none";

  // Reset selected atom
  selectedAtom = null;

  // Reset all particles
  resetStep2();

  // Reset sidebar active highlight
  document.querySelectorAll("#molecule-list .molecule-item")
    .forEach(li => li.classList.remove("active"));

  // Reset scroll button state
  updateScrollDownButton();
});

function updateShellRings() {
  const shellWrapper = document.querySelector("#shell-wrapper");
  shellWrapper.innerHTML = ""; // clear old rings

  let electronIndex = 0;

  SHELL_CAPACITY.forEach((capacity, shell) => {
    const electronsInShell = electronParticles.slice(
      electronIndex,
      electronIndex + capacity
    );

    const count = electronsInShell.length;

    // If this shell has electrons → draw ring
    if (count > 0) {
      const radius = SHELL_RADII[shell];

      const ring = document.createElement("div");
      ring.classList.add("atom-shell");

      ring.style.width = `${radius * 2}px`;
      ring.style.height = `${radius * 2}px`;

      shellWrapper.appendChild(ring);
    }

    electronIndex += count;
  });
}
function updateElectronPositions() {
  const droppingWrapper = document.querySelector("#droping-wrapper");
  const rect = droppingWrapper.getBoundingClientRect();
  const centerX = rect.width / 2;
  const centerY = rect.height / 2;

  let electronIndex = 0;

  SHELL_CAPACITY.forEach((capacity, shell) => {
    const electronsInShell = electronParticles.slice(
      electronIndex,
      electronIndex + capacity
    );

    const count = electronsInShell.length;
    const radius = SHELL_RADII[shell];

    electronsInShell.forEach((electron, i) => {
      const angle = (i / count) * Math.PI * 2;

      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);

      electron.style.left = `${x}px`;
      electron.style.top = `${y}px`;
    });

    electronIndex += count;
  });

  updateShellRings();   // 👈 ADD THIS (mandatory)
}

function updateShellCounts() {
  let electronIndex = 0;

  // K, L, M, N shell counters
  let shellCounts = [0, 0, 0, 0];

  SHELL_CAPACITY.forEach((capacity, shell) => {
    const electronsInShell = electronParticles.slice(
      electronIndex,
      electronIndex + capacity
    );

    shellCounts[shell] = electronsInShell.length;

    electronIndex += electronsInShell.length;
  });

  // Update UI text
  document.getElementById("shell-k").textContent = shellCounts[0];
  document.getElementById("shell-L").textContent = shellCounts[1];
  document.getElementById("shell-M").textContent = shellCounts[2];
  document.getElementById("shell-N").textContent = shellCounts[3];
}
function toggleShowAnswer() {
  if (!selectedAtom) return;

  const cleanName = selectedAtom.split("_")[0];
  const match = elementData.find(e => e.element.toLowerCase() === cleanName.toLowerCase());
  if (!match) return;

  if (!isAnswerShown) {
    // ==========================
    // SHOW ANSWER
    // ==========================
    isAnswerShown = true;
    document.querySelector("#show-ans").textContent = "Hide Answer";

    // ---- SAVE USER STATE ----
    savedUserProtons = droppedParticles.filter(p => p.classList.contains("proton")).map(() => "proton");
    savedUserNeutrons = droppedParticles.filter(p => p.classList.contains("neutron")).map(() => "neutron");
    savedUserElectrons = electronParticles.map(() => "electron");

    // ---- CLEAR UI (but keep saved state) ----
    droppedParticles.forEach(p => p.remove());
    droppedParticles.length = 0;

    electronParticles.forEach(e => e.remove());
    electronParticles.length = 0;

    // ---- SHOW CORRECT PROTONS ----
    for (let i = 0; i < match.protons; i++) addParticle("proton");

    // ---- SHOW CORRECT NEUTRONS ----
    for (let i = 0; i < match.neutrons; i++) addParticle("neutron");

    // ---- SHOW CORRECT ELECTRONS BY SHELL ----
    const electronConfig = match.electronicConfiguration.split(",").map(n => parseInt(n.trim()));
    electronConfig.forEach(count => {
      for (let i = 0; i < count; i++) addElectron();
    });

  } else {
    // ==========================
    // HIDE ANSWER → RESTORE USER STATE
    // ==========================
    isAnswerShown = false;
    document.querySelector("#show-ans").textContent = "Show Answer";

    // Clear the answer particles
    droppedParticles.forEach(p => p.remove());
    droppedParticles.length = 0;

    electronParticles.forEach(e => e.remove());
    electronParticles.length = 0;

    // ---- RESTORE USER PROTONS ----
    savedUserProtons.forEach(() => addParticle("proton"));

    // ---- RESTORE USER NEUTRONS ----
    savedUserNeutrons.forEach(() => addParticle("neutron"));

    // ---- RESTORE USER ELECTRONS ----
    savedUserElectrons.forEach(() => addElectron());
  }
}

