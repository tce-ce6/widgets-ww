// script.js
// Final script for hollow-SVG based molecule builder (Option B, class-only slot detection)

// ============ CONSTANTS & DATA ============
const moleculeLayout = {
  Water: [{ x: 200, y: 200 }], // kept for reference (not used under hollow-SVG)
  Oxygen: [
    { x: 180, y: 200 },
    { x: 260, y: 200 },
  ],
  Methane: [{ x: 200, y: 200 }],
};

const labels = [
  "Oxygen",
  "Nitrogen",
  "Hydrogen peroxide",
  "Sulphur dioxide",
  "Nitric acid",
  "Acetic acid",
  "Calcium carbonate",
  "Potassium permanganate",
  "Sodium bicarbonate",
  "Copper sulphate",
  "Butane",
  "Sodium hydroxide",
  "Hydrochloric acid",
  "Ethanol",
  "Methanol",
  "Water",
  "Carbon dioxide",
  "Sodium chloride",
  "Ammonia",
  "Methane",
];
let selectedMolecule = "";

const moleculeList = document.getElementById("molecule-list");
moleculeList.innerHTML = "";

const moleculeRequirements = {
  Water: ["atom-h", "atom-h", "atom-o"],
  Oxygen: ["atom-o", "atom-o"],
  Nitrogen: ["atom-n", "atom-n"],
  Ammonia: ["atom-n", "atom-h", "atom-h", "atom-h"],
  "Hydrogen peroxide": ["atom-h", "atom-h", "atom-o", "atom-o"],
  "Sulphur dioxide": ["atom-s", "atom-o", "atom-o"],
  Methane: ["atom-c", "atom-h", "atom-h", "atom-h", "atom-h"],
  Methanol: ["atom-c", "atom-o", "atom-h", "atom-h", "atom-h", "atom-h"],
  Ethanol: [
    "atom-c",
    "atom-c",
    "atom-o",
    "atom-h",
    "atom-h",
    "atom-h",
    "atom-h",
    "atom-h",
    "atom-h",
  ],
  "Nitric acid": ["atom-n", "atom-o", "atom-o", "atom-o", "atom-h"],
  "Hydrochloric acid": ["atom-h", "atom-cl"],
  "Sodium chloride": ["atom-na", "atom-cl"],
  "Calcium carbonate": ["atom-ca", "atom-c", "atom-o", "atom-o", "atom-o"],
  "Sodium hydroxide": ["atom-na", "atom-o", "atom-h"],
  "Sodium bicarbonate": [
    "atom-na",
    "atom-c",
    "atom-o",
    "atom-o",
    "atom-o",
    "atom-h",
  ],
  "Potassium permanganate": [
    "atom-k",
    "atom-mn",
    "atom-o",
    "atom-o",
    "atom-o",
    "atom-o",
  ],
  "Copper sulphate": [
    "atom-c",
    "atom-cu",
    "atom-o",
    "atom-o",
    "atom-o",
  ],
  "Butane": ["atom-c", "atom-c", "atom-c", "atom-c", "atom-h", "atom-h", "atom-h", "atom-h", "atom-h", "atom-h", "atom-h", "atom-h", "atom-h", "atom-h"],
  "Carbon dioxide": ["atom-o", "atom-c", "atom-o"],
  "Acetic acid": [
    "atom-h",
    "atom-c",
    "atom-o",
    "atom-h",
    "atom-o",
    "atom-c",
    "atom-c",
  ],
};

const atomColors = {
  H: 0xffffff,
  O: 0xff0000,
  C: 0x333333,
  N: 0x0000ff,
  S: 0xffff00,
  Na: 0x87ceeb,
  K: 0x8b4513,
  Ca: 0xaaaaaa,
  Mn: 0x800080,
  Cu: 0xa0522d,
  Cl: 0x00ff00,
  Al: 0xc0c0c0,
};

const molecule3D = {
  Water: [
    { atom: "O", pos: [0, 0, 0] },
    { atom: "H", pos: [0.95, 0.3, 0] },
    { atom: "H", pos: [-0.95, 0.3, 0] },
  ],
  Oxygen: [
    { atom: "O", pos: [0, 0, 0] },
    { atom: "O", pos: [1.2, 0, 0] },
  ],
  Nitrogen: [
    { atom: "N", pos: [0, 0, 0] },
    { atom: "N", pos: [1.1, 0, 0] },
  ],
  Ammonia: [
    { atom: "N", pos: [0, 0, 0] },
    { atom: "H", pos: [1, 0.8, 0] },
    { atom: "H", pos: [-1, 0.8, 0] },
    { atom: "H", pos: [0, -1, 0] },
  ],
  "Hydrogen peroxide": [
    { atom: "O", pos: [0, 0, 0] },
    { atom: "O", pos: [1.45, 0, 0] },
    { atom: "H", pos: [-0.7, 0.9, 0] },
    { atom: "H", pos: [2.15, 0.9, 0] },
  ],
  "Sulphur dioxide": [
    { atom: "S", pos: [0, 0, 0] },
    { atom: "O", pos: [1.4, 0.9, 0] },
    { atom: "O", pos: [-1.4, 0.9, 0] },
  ],
  Methane: [
    { atom: "C", pos: [0, 0, 0] },
    { atom: "H", pos: [1, 1, 0] },
    { atom: "H", pos: [-1, 1, 0] },
    { atom: "H", pos: [1, -1, 0] },
    { atom: "H", pos: [-1, -1, 0] },
  ],
  Methanol: [
    { atom: "C", pos: [0, 0, 0] },
    { atom: "O", pos: [1.4, 0, 0] },
    { atom: "H", pos: [-1, 1, 0] },
    { atom: "H", pos: [-1, -1, 0] },
    { atom: "H", pos: [0, 1.4, 0] },
    { atom: "H", pos: [2.2, 0.8, 0] },
  ],
  Ethanol: [
    { atom: "C", pos: [0, 0, 0] },
    { atom: "C", pos: [1.5, 0, 0] },
    { atom: "O", pos: [2.7, 0.8, 0] },
    { atom: "H", pos: [-0.8, -1, 0] },
    { atom: "H", pos: [-0.8, 1, 0] },
    { atom: "H", pos: [1.5, -1, 0] },
    { atom: "H", pos: [1.5, 1, 0] },
    { atom: "H", pos: [3.5, 1.3, 0] },
    { atom: "H", pos: [2.7, -0.8, 0] },
  ],
  "Nitric acid": [
    { atom: "N", pos: [0, 0, 0] },
    { atom: "O", pos: [1.2, 0, 0] },
    { atom: "O", pos: [-1.2, 0.8, 0] },
    { atom: "O", pos: [-1.2, -0.8, 0] },
    { atom: "H", pos: [-2, -1.3, 0] },
  ],
  "Hydrochloric acid": [
    { atom: "H", pos: [0, 0, 0] },
    { atom: "Cl", pos: [1.3, 0, 0] },
  ],
  "Sodium chloride": [
    { atom: "Na", pos: [0, 0, 0] },
    { atom: "Cl", pos: [2, 0, 0] },
  ],
  "Calcium carbonate": [
    { atom: "Ca", pos: [0, 0, 0] },
    { atom: "C", pos: [2.5, 0, 0] },
    { atom: "O", pos: [3.3, 1, 0] },
    { atom: "O", pos: [3.3, -1, 0] },
    { atom: "O", pos: [2.5, 0, 1.5] },
  ],
  "Sodium hydroxide": [
    { atom: "Na", pos: [0, 0, 0] },
    { atom: "O", pos: [1.5, 0, 0] },
    { atom: "H", pos: [2.2, 0.8, 0] },
  ],
  "Sodium bicarbonate": [
    { atom: "Na", pos: [0, 0, 0] },
    { atom: "C", pos: [2, 0, 0] },
    { atom: "O", pos: [3, 1, 0] },
    { atom: "O", pos: [3, -1, 0] },
    { atom: "O", pos: [2, 0, 1.5] },
    { atom: "H", pos: [1.6, -1.2, 0] },
  ],
  "Potassium permanganate": [
    { atom: "K", pos: [0, 0, 0] },
    { atom: "Mn", pos: [3, 0, 0] },
    { atom: "O", pos: [4.2, 1, 0] },
    { atom: "O", pos: [4.2, -1, 0] },
    { atom: "O", pos: [3, 1.5, 1.5] },
    { atom: "O", pos: [3, -1.5, -1.5] },
  ],
  "Copper sulphate": [
    { atom: "Cu", pos: [0, 0, 0] },
    { atom: "S", pos: [2, 0, 0] },
    { atom: "O", pos: [2.8, 1, 0] },
    { atom: "O", pos: [2.8, -1, 0] },
    { atom: "O", pos: [2, 1.5, 1] },
    { atom: "O", pos: [2, -1.5, -1] },
  ],
  "Butane": [
    { atom: "Al", pos: [0, 0, 0] },
    { atom: "Al", pos: [2, 0, 0] },
    { atom: "O", pos: [1, 1.5, 0] },
    { atom: "O", pos: [-0.5, -1.5, 0] },
    { atom: "O", pos: [2.5, -1.5, 0] },
  ],
  "Carbon dioxide": [
    { atom: "C", pos: [0, 0, 0] },
    { atom: "O", pos: [1.2, 0, 0] },
    { atom: "O", pos: [-1.2, 0, 0] },
  ],
  "Acetic acid": [
    { atom: "C", pos: [0, 0, 0] },
    { atom: "C", pos: [1.5, 0, 0] },
    { atom: "O", pos: [2.5, 1, 0] },
    { atom: "O", pos: [2.5, -1, 0] },
    { atom: "H", pos: [-0.9, 1, 0] },
    { atom: "H", pos: [-0.9, -1, 0] },
    { atom: "H", pos: [1.5, 1.2, 0] },
    { atom: "H", pos: [3.3, -1.3, 0] },
  ],
};

// ============ STATE VARIABLES ============
const wheel = document.getElementById("wheel");
const spinBtn = document.getElementById("spinBtn");
const dropArea = document.getElementById("droping-wrapper");
const sliceAngle = 360 / labels.length;
const radius = 200;
const spanElements = [];

let isAnswerShown = false;
let savedDroppedAtoms = [];
let currentRotation = 0;
let current3DScene = null;

// Hollow-SVG specific state
let currentMoleculeTargets = []; // elements inside hollow SVG: outer <g class="atom-...">
let filledAtoms = {}; // map targetSlotId -> src (e.g., "slot-0" -> "assets/atoms/Gr_h.svg")

let savedHollowSVG = "";
let savedSlotState = {};

let originalHollowSVGText = "";


// ============ UTILITY FUNCTIONS ============
const getEl = (id) => document.getElementById(id);
const hide = (id) => (getEl(id).style.display = "none");
const show = (id, display = "block") => (getEl(id).style.display = display);

const resetWheelBtn = document.querySelector(".resetWheel-btn");

function highlightActiveMolecule() {
  const allLi = document.querySelectorAll("#molecule-list li");

  allLi.forEach((li) => {
    li.classList.toggle("active", li.textContent === selectedMolecule);
  });
}

function getAtomIdFromImage(imgSrc) {
  return (
    "atom-" +
    imgSrc
      .split("/")
      .pop()
      .split(".")[0]
      .replace(/^Gr_/i, "")
      .replace(/[^a-zA-Z0-9_]/g, "")
      .toLowerCase()
  );
}

function updateNote(text, color) {
  const note = getEl("instruction-note");
  note.textContent = text;
  note.style.color = color || "#231F20";
  show("instruction-note");
}

// ============ WHEEL SETUP ============
labels.forEach((label, i) => {
  const span = document.createElement("span");
  span.textContent = label;
  span.style.transform = `rotate(${
    sliceAngle * i + sliceAngle / 2 - 8
  }deg) translate(${radius - 80}px) rotate(7deg)`;
  wheel.appendChild(span);
  spanElements.push(span);
});

function updateActiveSlice(rotation) {
  const normalized = (360 - (rotation % 360)) % 360;
  const index = Math.floor(normalized / sliceAngle);

  spanElements.forEach((s, i) => {
    const active = i === index;
    s.classList.toggle("active", active);
    
    if (active) {
      console.log("labels[i]", labels[i]);
      selectedMolecule = labels[i];   // 🔥 update selected molecule here
      getEl("molecule-name").textContent = selectedMolecule;
    }
  });
}


document.getElementById("sidebar-btn").addEventListener("click", () => {
  document.getElementById("sidebar-wrapper").classList.toggle("active");
});

// ============ SPIN WHEEL LOGIC ============
spinBtn.addEventListener("click", async () => {
  
  if (spinBtn.dataset.state === "go") {
    console.log("getEl", getEl("molecule-widget"));
    
    getEl("molecule-widget").classList.add("active");
    hide("step1");
    show("step2");
    show("btn-wrapper");
    // getEl("molecule-name").textContent = selectedMolecule;
    highlightActiveMolecule();

    // Load hollow SVG for currently selected molecule (if any)
    if (selectedMolecule) {
      await loadAndShowMoleculeSVG(selectedMolecule);
    }
    return;
  }

  spanElements.forEach((s) => s.classList.remove("active"));

  // Choose a random slice index to stop on
  const chosenIndex = Math.floor(Math.random() * labels.length);

  // Compute the slice center angle in degrees (matches how spans are positioned)
  // Note: spans use `sliceAngle * i + sliceAngle/2 - 8` in their transform, so include that -8deg offset.
  const sliceCenterAngle = (sliceAngle * chosenIndex + sliceAngle / 2 - 16 + 360) % 360;

  // We want normalized = sliceCenterAngle when the rotation finishes, where
  // normalized = (360 - (rotation % 360)) % 360
  // Solve rotation_mod = (360 - normalized) % 360
  const desiredNormalized = sliceCenterAngle;
  const rotationMod = (360 - desiredNormalized) % 360;

  // Add several full turns for animation flair, with slight randomness
  const fullTurns = 10 + Math.floor(Math.random() * 6); // 10..15 full turns
  const newRotation = currentRotation + fullTurns * 360 + rotationMod;

  const anim = wheel.animate(
    [
      { transform: `rotate(${currentRotation}deg)` },
      { transform: `rotate(${newRotation}deg)` },
    ],
    {
      duration: 4000,
      easing: "cubic-bezier(0.25, 0.8, 0.25, 1)",
      fill: "forwards",
    }
  );

  anim.onfinish = async () => {
    currentRotation = newRotation % 360;
    // Ensure active slice corresponds to the chosen index
    updateActiveSlice(currentRotation);
    // selectedMolecule = labels[chosenIndex];
    spinBtn.textContent = "START";
    spinBtn.dataset.state = "go";

    // On spin finish, load hollow SVG and reset drop area for new molecule
    getEl("molecule-name").textContent = selectedMolecule;
    highlightActiveMolecule();
    resetDropArea(); // clears old stuff
    await loadAndShowMoleculeSVG(selectedMolecule);
    resetWheelBtn.style.display = "block"; // show reset wheel button
    highlightActiveMolecule();
    updateScrollDownButton();
  };
});

// ============ ATOM INTERACTION (hollow SVG flow) ============
function getDropRect() {
  return dropArea.getBoundingClientRect();
}

// ======= atom limit config =======
const MAX_ATOMS = 30;
let userAtomCount = 0; // authoritative counter
let atomBusy = false; // prevents race during animation

function syncUserAtomCount() {
  userAtomCount = dropArea.querySelectorAll(".user-atom").length;
}
syncUserAtomCount();

function onAtomLimitChange() {
  if (userAtomCount >= MAX_ATOMS) {
    document.body.classList.add("atoms-full");
    updateNote(`Maximum ${MAX_ATOMS} atoms reached`, "orange");
  } else {
    document.body.classList.remove("atoms-full");
    hide("instruction-note");
  }
}
onAtomLimitChange();

// helper to find first empty target for a given atom id (prefix), using class-only detection
function findFirstEmptyTargetFor(atomId) {
  // atomId example: "atom-h"
  // currentMoleculeTargets hold outer groups (<g class="atom-h">)
  return currentMoleculeTargets.find((t) => {
    if (!t) return false;
    const cls =
      t.className && typeof t.className === "string"
        ? t.className
        : (t.getAttribute && t.getAttribute("class")) || "";
    // check if the class list contains the requested prefix as a token or starts with it
    if (!cls) return false;
    const tokens = cls.split(/\s+/);
    const matches = tokens.some((tk) =>
  tk.toLowerCase() === atomId.toLowerCase()
);
    if (!matches) return false;
    // ensure this slot isn't filled
    return !filledAtoms[t.dataset.slotId];
  });
}

// place atom inside target outer group and hide its child shapes
function placeAtomIntoTargetBySrc(target, src) {
  // 1. Find the TRUE hollow circle geometry inside the slot
  const shape = target.querySelector("circle, path");

  // If no shape found, fallback to group bbox
  const refBox = shape ? shape.getBBox() : target.getBBox();

  const slotX = refBox.x;
  const slotY = refBox.y;
  const slotW = refBox.width;
  const slotH = refBox.height;

  // final atom size = match circle diameter exactly
  const atomSize = Math.min(slotW, slotH);

  // compute center
  const cx = slotX + slotW / 2;
  const cy = slotY + slotH / 2;

  const imgX = cx - atomSize / 2;
  const imgY = cy - atomSize / 2;

  // 2. Hide the hollow placeholder (circle + outline)
  target.querySelectorAll("circle, path").forEach((n) => {
    n.style.opacity = "0";
  });

  // 3. Create atom SVG <image>
  const img = document.createElementNS("http://www.w3.org/2000/svg", "image");
  img.setAttributeNS("http://www.w3.org/1999/xlink", "href", src);

  img.setAttribute("width", atomSize);
  img.setAttribute("height", atomSize);

  img.setAttribute("x", imgX);
  img.setAttribute("y", imgY);

  img.classList.add("svg-atom");

  // 4. Remove atom & restore hollow if clicked
  // Disable remove-on-click (atom stays fixed)
  img.addEventListener("click", (e) => {
      e.stopPropagation();
      e.preventDefault();
  });


  // 5. Insert into SVG slot
  target.appendChild(img);

  // Save state
  filledAtoms[target.dataset.slotId] = src;
  userAtomCount++;
  onAtomLimitChange();
checkMoleculeCompleted(false);
}

resetWheelBtn.addEventListener("click", () => {
  resetSpinnerWheel(); // your existing function
  resetWheelBtn.style.display = "none"; // hide again after reset
});

// Animated fly + place (used when clicking atom palette)
function flyAtomFromPaletteToDrop(paletteImageHref, atomImageRect, atomId) {
  // create fly image in body
  const flyImg = document.createElement("img");
  flyImg.src = paletteImageHref;
  flyImg.className = "atom-fly";
  flyImg.style.position = "fixed";
  flyImg.style.left = atomImageRect.left + "px";
  flyImg.style.top = atomImageRect.top + "px";
  flyImg.style.width = atomImageRect.width + "px";
  flyImg.style.height = atomImageRect.height + "px";
  flyImg.style.transition = "transform 0.6s ease, opacity 0.6s ease";
  document.body.appendChild(flyImg);
  flyImg.getBoundingClientRect();

  const dropRect = getDropRect();
  // choose target center - we animate towards dropArea center, then snap to correct target
  const centerX = dropRect.left + dropRect.width / 2;
  const centerY = dropRect.top + dropRect.height / 2;
  const translateX = centerX - atomImageRect.left;
  const translateY = centerY - atomImageRect.top;

  flyImg.style.transform = `translate(${translateX}px, ${translateY}px) scale(0.3)`;
  flyImg.style.opacity = "0";

  setTimeout(() => {
    // find the correct target for this atom (class-only)
    const atomPrefix = atomId; // e.g., "atom-h"
    const target = findFirstEmptyTargetFor(atomPrefix);
    if (!target) {
      updateNote("That’s an incorrect selection.", "orange");
      flyImg.remove();
      atomBusy = false;
      return;
    }

    // place final image inside dropArea at target
    placeAtomIntoTargetBySrc(target, paletteImageHref);
    flyImg.remove();
    atomBusy = false;
  }, 620);
}

// attach click events to palette atoms (g.atom)
function activatePaletteAtoms() {
  // remove existing listeners by replacing nodes
  document.querySelectorAll("g.atom").forEach((g) => {
    g.replaceWith(g.cloneNode(true));
  });

  document.querySelectorAll("g.atom").forEach((atom) => {
    atom.addEventListener("click", () => {
      // disable when showing answer
      if (isAnswerShown) return;
      if (atomBusy) return;
      if (userAtomCount >= MAX_ATOMS) {
        updateNote(`Maximum ${MAX_ATOMS} atoms reached`, "orange");
        return;
      }

      const image = atom.querySelector("image");
      if (!image) return;

      const href =
        image.getAttribute("href") ||
        image.getAttributeNS("http://www.w3.org/1999/xlink", "href");
      if (!href) return;

      const atomId = atom.id || getAtomIdFromImage(href); // e.g., "atom-h"
      atomBusy = true;

      // get bounding rect of the palette image
      let imgRect = image.getBoundingClientRect();
      if (imgRect.width === 0 && image.parentElement) {
        // fallback: compute approx
        const parentRect = image.parentElement.getBoundingClientRect();
        imgRect = parentRect;
      }

      flyAtomFromPaletteToDrop(href, imgRect, atomId);
    });
  });
}

// ============ ANSWER MANAGEMENT ============
function checkMoleculeCompleted(showMessage = false) {
  if (isAnswerShown) return;
  hide("instruction-note");
  Object.keys(filledAtoms).forEach((slotId) => {
    const slot = currentMoleculeTargets.find(
      (s) => s.dataset.slotId === slotId
    );
    const hasActualImg = slot && slot.querySelector("image.svg-atom");
    if (!hasActualImg) {
      delete filledAtoms[slotId];
    }
  });
  const required = moleculeRequirements[selectedMolecule];
  if (!required) return;

  // derive dropped ids from filledAtoms (map slot -> src)
  const dropped = Object.values(filledAtoms).map((src) =>
    getAtomIdFromImage(src)
  );
  const reqSorted = [...required].sort();
  const droppedSorted = [...dropped].sort();

  if (JSON.stringify(reqSorted) === JSON.stringify(droppedSorted)) {


    show("3d-btn");
    getEl("show-ans").textContent = "Hide Answer";

    // Save clones for restore (if hide answer)
    savedDroppedAtoms = [...dropArea.querySelectorAll(".svg-atom")].map(atom => ({
      src: atom.getAttributeNS("http://www.w3.org/1999/xlink", "href"),
      slotId: atom.parentElement.dataset.slotId
    }));

    showAnswerImage();
    updateNote("That is the correct answer!", "#4caf50");
    setDisabledStateForCorrectAnswer(true);
  } else {
    // Only show the red "incorrect" note when explicitly requested
    if (showMessage) {
      updateNote("That's incorrect. Try again!", "red");
    } else {
      // keep instruction-note hidden when auto-checking
      hide("instruction-note");
    }
  }

}


function showAnswerImage() {
  dropArea.innerHTML = "";
  const img = document.createElement("img");
  img.src = `assets/molecules/${selectedMolecule.replace(/\s+/g, "_")}.png`;
  img.style.width = "auto";
  img.style.height = "450";
  img.classList.add("dropped-atom");
  dropArea.appendChild(img);
  isAnswerShown = true;
}

function toggleAnswer() {
  const showBtn = getEl("show-ans");

  if (!isAnswerShown) {
    savedHollowSVG = dropArea.innerHTML;
    savedSlotState = { ...filledAtoms };
    savedDroppedAtoms = [...dropArea.querySelectorAll(".svg-atom")].map(
      (atom) => {
        return {
          src: atom.getAttributeNS("http://www.w3.org/1999/xlink", "href"),
          slotId: atom.parentElement.dataset.slotId,
        };
      }
    );

    showAnswerImage();
    showBtn.textContent = "Hide Answer";
  }
  // ===== RESTORE ANSWER (Hide Answer) =====
// ===== RESTORE ANSWER (Hide Answer) =====
else {
  dropArea.innerHTML = originalHollowSVGText;  // 🔥 fixed

    // Re-detect hollow groups
    currentMoleculeTargets = [...dropArea.querySelectorAll("[class^='atom-']")];
    currentMoleculeTargets.forEach((t, i) => t.dataset.slotId = "slot-" + i);

    // 🔥 FIX: Reassign slotId because innerHTML removed them
    currentMoleculeTargets.forEach((t, i) => {
        t.dataset.slotId = "slot-" + i;
    });

    // Restore hollow shapes
    currentMoleculeTargets.forEach(slot => {
        slot.querySelectorAll("circle, path").forEach(n => {
            n.style.opacity = "1";
        });
    });

    // Restore atoms
    filledAtoms = {};
    savedDroppedAtoms.forEach(item => {
        const slot = currentMoleculeTargets.find(s => s.dataset.slotId === item.slotId);
        if (slot) placeAtomIntoTargetBySrc(slot, item.src);
    });

    syncUserAtomCount();
    onAtomLimitChange();

    getEl("show-ans").textContent = "Show Answer";
    isAnswerShown = false;
    setDisabledStateForCorrectAnswer(false);

}

}

// ============ RESET & HELPERS ============
function resetDropArea() {
  dropArea.innerHTML = "";
  isAnswerShown = false;
  savedDroppedAtoms = [];
  filledAtoms = {};
  currentMoleculeTargets = [];
  getEl("show-ans").textContent = "Show Answer";

  userAtomCount = 0;
  atomBusy = false;
setDisabledStateForCorrectAnswer(false);

  onAtomLimitChange();

  document.getElementById("droping-wrapper").classList.remove("active-3d");
  hide("instruction-note");
  hide("3d-btn");
  // if a molecule is selected, reload its hollow SVG
  if (selectedMolecule) {
    loadAndShowMoleculeSVG(selectedMolecule).catch((e) => {
      console.warn("Could not reload molecule SVG on reset:", e);
    });
  }
}

function resetSpinnerWheel() {
  currentRotation = 0;
  wheel.style.transform = "rotate(0deg)";
  spanElements.forEach((s) => s.classList.remove("active"));
  selectedMolecule = "";
  spinBtn.textContent = "SPIN";
  delete spinBtn.dataset.state;
}

// ============ 3D MODEL FUNCTIONS ============
function cleanup3DScene() {
  if (!current3DScene) return;

  if (current3DScene.renderer) current3DScene.renderer.dispose();
  if (current3DScene.controls) current3DScene.controls.dispose();
  if (current3DScene.scene) {
    current3DScene.scene.traverse((obj) => {
      if (obj.geometry) obj.geometry.dispose();
      if (obj.material) {
        (Array.isArray(obj.material) ? obj.material : [obj.material]).forEach(
          (m) => m.dispose()
        );
      }
    });
  }
  if (current3DScene.animationId)
    cancelAnimationFrame(current3DScene.animationId);
  current3DScene = null;
}

function load3DMolecule(moleculeName, container) {
  cleanup3DScene();

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xffffff);

  const camera = new THREE.PerspectiveCamera(
    45,
    container.clientWidth / container.clientHeight,
    0.1,
    1000
  );
  camera.position.set(5, 5, 5);

  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  container.appendChild(renderer.domElement);

  const controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  current3DScene = { scene, renderer, controls };

  scene.add(new THREE.AmbientLight(0xffffff, 0.8));
  const dir = new THREE.DirectionalLight(0xffffff, 1);
  dir.position.set(3, 3, 3);
  scene.add(dir);

  const model = molecule3D[moleculeName];
  if (!model) return console.warn("3D model not available for", moleculeName);

  model.forEach((item) => {
    const sphere = new THREE.Mesh(
      new THREE.SphereGeometry(0.4, 32, 32),
      new THREE.MeshPhongMaterial({ color: atomColors[item.atom] || 0x888888 })
    );
    sphere.position.set(...item.pos);
    scene.add(sphere);
  });

  for (let i = 1; i < model.length; i++) {
    const A = new THREE.Vector3(...model[0].pos);
    const B = new THREE.Vector3(...model[i].pos);
    const bond = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.1, A.distanceTo(B), 12),
      new THREE.MeshPhongMaterial({ color: 0x666666 })
    );
    bond.position.copy(A.clone().lerp(B, 0.5));
    bond.lookAt(B);
    bond.rotateX(Math.PI / 2);
    scene.add(bond);
  }

  function animate() {
    current3DScene.animationId = requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
  }
  animate();
}

function open3DModel() {
  const wrapper = document.getElementById("droping-wrapper");

  wrapper.classList.add("active-3d");

  // Remove old viewer container if present
  const old3D = document.getElementById("threeD-container");
  if (old3D) old3D.remove();

  // Create new container
  const container = document.createElement("div");
  container.id = "threeD-container";
  container.style.width = "400px";
  container.style.height = "400px";
  container.style.backgroundColor = "#ffffff";
  wrapper.appendChild(container);

  load3DSDFModel(selectedMolecule, container);
}


// ============ HOLLOW SVG LOADING ============
// Load SVG file content
async function loadSVG(path) {
  const res = await fetch(path);
  if (!res.ok) throw new Error("SVG not found: " + path);
  return await res.text();
}

// Insert SVG into dropArea and detect outer group slots by class-only
function loadMoleculeStructure(svgHtml) {
  const wrapper = document.getElementById("droping-wrapper");
  wrapper.innerHTML = svgHtml;

  // find outer groups whose class starts with "atom-"
  // We only target outer groups (the <g class="atom-x"> itself)
  const byClass = Array.from(wrapper.querySelectorAll("g")).filter((g) => {
    const cls = (g.getAttribute && g.getAttribute("class")) || "";
    if (!cls) return false;
    return cls.split(/\s+/).some((tk) => tk.toLowerCase().startsWith("atom-"));
  });

  // assign predictable slot ids and store
  currentMoleculeTargets = [...wrapper.querySelectorAll("[class^='atom-']")];
  currentMoleculeTargets.forEach((t, i) => {
    t.dataset.slotId = "slot-" + i;
  });

  // reset filled map
  filledAtoms = {};

  // re-activate palette atom handlers (they are on page-level, so ensure they exist)
  activatePaletteAtoms();
}

// wrapper that fetches SVG file and inserts it
async function loadAndShowMoleculeSVG(name) {
  if (!name) return;
  const path = `assets/hollow-molecule/${name}.svg`;
  try {
    const svgText = await loadSVG(path);
    originalHollowSVGText = svgText; 
    loadMoleculeStructure(svgText);
    // ensure we're not showing answer when loading new structure
    isAnswerShown = false;
    getEl("show-ans").textContent = "Show Answer";
    syncUserAtomCount();
    onAtomLimitChange();
  } catch (err) {
    console.warn("Failed to load hollow SVG for", name, err);
    // fallback: clear area and show message
    dropArea.innerHTML = `<div style="padding:20px;color:#b00;">Hollow SVG not found for ${name}</div>`;
    currentMoleculeTargets = [];
    filledAtoms = {};
  }
}
const listBox = document.getElementById("molecule-list");
const scrollDownBtn = document.querySelector(".scoll-down");

listBox.addEventListener("scroll", () => {
  const atBottom =
    listBox.scrollTop + listBox.clientHeight >= listBox.scrollHeight - 5;

  if (atBottom) {
    scrollDownBtn.classList.add("active");
  } else {
    scrollDownBtn.classList.remove("active");
  }
});
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
    scrollDownBtn.classList.add("top");     // show "scroll to top" version
  } else if (atTop) {
    scrollDownBtn.classList.add("bottom");  // show "scroll to bottom" version
  }
}


moleculeList.addEventListener("scroll", updateScrollDownButton);

// ============ INIT: build molecule list & attach event handlers ============
// ============ INIT: build molecule list in A–Z order ============
const sortedLabels = [...labels].sort((a, b) => a.localeCompare(b));

sortedLabels.forEach((name) => {
  const li = document.createElement("li");
  li.textContent = name;

  li.addEventListener("click", async () => {
    selectedMolecule = name;

    document
      .querySelectorAll("#molecule-list li")
      .forEach((item) => item.classList.remove("active"));

    li.classList.add("active");

    li.scrollIntoView({ behavior: "smooth", block: "nearest" });

    updateScrollDownButton();
    getEl("molecule-name").textContent = selectedMolecule;

    resetDropArea();
    syncUserAtomCount();
    onAtomLimitChange();
    hide("3d-btn");

    await loadAndShowMoleculeSVG(selectedMolecule);

    if (document.getElementById("step2").style.display === "block") {
      if (isAnswerShown) {
        toggleAnswer();
        syncUserAtomCount();
        onAtomLimitChange();
      }
    }
  });

  moleculeList.appendChild(li);
});


// activate palette immediately
activatePaletteAtoms();

// ============ EVENT LISTENERS ============
getEl("show-ans").addEventListener("click", () => {
  hide("instruction-note");
  toggleAnswer();
  syncUserAtomCount();
  onAtomLimitChange();
});
getEl("reset-btn").addEventListener("click", resetDropArea);
getEl("check-ans").addEventListener("click", () => checkMoleculeCompleted(true));

getEl("3d-btn").addEventListener("click", open3DModel);
getEl("home-btn").addEventListener("click", () => {
  document.getElementsByClassName("resetWheel-btn")[0].style.display = "none"; // hide reset wheel button
  hide("step2");
  show("step1");
  hide("btn-wrapper");
  resetDropArea();
  syncUserAtomCount();
  onAtomLimitChange();
  resetSpinnerWheel();
});

function setDisabledStateForCorrectAnswer(disable) {
  const paletteAtoms = document.querySelectorAll("g.atom");

  paletteAtoms.forEach(atom => {
    if (disable) atom.classList.add("disable");
    else atom.classList.remove("disable");
  });

  const checkBtn = document.getElementById("check-ans");
  const showAnsBtn = document.getElementById("show-ans");

  if (disable) {
    checkBtn.classList.add("disable");
    showAnsBtn.classList.add("disable");
  } else {
    checkBtn.classList.remove("disable");
    showAnsBtn.classList.remove("disable");
  }
}


function load3DSDFModel(moleculeName, container) {
  if (!moleculeName) {
    console.warn("No molecule selected for 3D view");
    return;
  }

  const fileName = moleculeName.replace(/\s+/g, "_") + ".sdf";
  const filePath = `assets/3d-assets/${fileName}`;

  console.log("Loading 3D SDF:", filePath);

  // Create viewer
  const viewer = $3Dmol.createViewer(container, {
    backgroundColor: "white"
  });

  // Load SDF file
  jQuery.get(filePath, function(data) {
    viewer.addModel(data, "sdf");

    viewer.setStyle({}, { stick: { radius: 0.15 }, sphere: { scale: 0.25 } });

    const model = viewer.getModel();
    const atoms = model.selectedAtoms({});

    atoms.forEach(atom => {
        viewer.addLabel(atom.elem, {
            position: atom,
            fontSize: 12,
            fontColor: "black",
            backgroundColor: "white",
            inFront: true
        });
    });

    viewer.zoomTo();
    viewer.zoom(1.5);
    viewer.render();
})

  .fail(() => {
    container.innerHTML = `
      <div style="color: red; padding: 20px;">
        3D model not found for: ${moleculeName}<br>
        Missing file:<br>
        <b>${filePath}</b>
      </div>`;
  });
}
