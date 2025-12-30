document.addEventListener("DOMContentLoaded", () => {
  const widthSlider = document.getElementById("slider-width");
  const heightSlider = document.getElementById("slider-height");

  const copperBar = document.getElementById("copper-bar");
  const aluminiumBar = document.getElementById("aluminium-bar");
  const tungstenBar = document.getElementById("tungsten-bar");

  const copperTxt = document.getElementById("copper-txt");
  const aluminiumTxt = document.getElementById("aluminium-txt");
  const tungstenTxt = document.getElementById("tungsten-txt");

  const resistanceLetter = document.getElementById("resistance-letter");

  const noteWrapper = document.getElementById("note-wrapper");
  const ansText = document.getElementById("ans-text");
  const closeBtn = noteWrapper.querySelector(".close-btn");
  const btn1 = document.getElementById("btn-1");
  const resetBtn = document.getElementById("reset-btn");

  const particleWrapper = document.getElementById("particle-wrapper");
const PARTICLE_COUNT = 50;

  const noteTextByMetal = {
    copper:
      "Increasing the wire's thickness (cross-sectional area) lowers its resistance.",
    aluminium:
      "Increasing the wire's thickness (cross-sectional area) lowers its resistance.",
    tungsten:
      "Increasing the wire's thickness (cross-sectional area) lowers its resistance.",
  };

  
  /* ------------------ CONSTANTS ------------------ */

  const MIN_RESISTANCE_FONT_SIZE = 150;
  const MAX_RESISTANCE_FONT_SIZE = 390;
  const RESISTANCE_INITIAL_FONT_SIZE = 294; // ✅ FIX

  const LENGTH_REFERENCE = 13;

  const WIDTH_MIN = 4;
  const WIDTH_MAX = 29;
  const HEIGHT_MIN = 4;
  const HEIGHT_MAX = 9;

  /* ------------------ STATE ------------------ */

  let selectedMetal = "copper";
  let activeBar = copperBar;

  let currentScaleX = 1;
  let currentScaleY = 1;

  const WIDTH_INITIAL = LENGTH_REFERENCE;
  const HEIGHT_INITIAL = 6;

  const MAX_RESISTANCE_FONT_BY_METAL = {
    copper: 290,
    aluminium: 340,
    tungsten: 390,
  };

  const METAL_FONT_OFFSET = {
    copper: 0,
    aluminium: 60,
    tungsten: 120,
  };

  /* ------------------ PARTICLE SIZE BASE ------------------ */

// Base size of particle wrapper when WIDTH_INITIAL & HEIGHT_INITIAL
const PARTICLE_BASE_WIDTH = 900;   // matches your foreignObject width
const PARTICLE_BASE_HEIGHT = 170;  // matches your foreignObject height

const copperParticleFO = document.getElementById("copper-particle");

  /* ------------------ BAR SCALE MAPS ------------------ */

  const widthScaleMap = {
    4: 0.111,
    5: 0.146,
    6: 0.183,
    7: 0.217,
    8: 0.252,
    9: 0.287,
    10: 0.322,
    11: 0.357,
    12: 0.392,
    13: 0.427,
    14: 0.462,
    15: 0.497,
    16: 0.532,
    17: 0.567,
    18: 0.602,
    19: 0.637,
    20: 0.672,
    21: 0.707,
    22: 0.742,
    23: 0.777,
    24: 0.812,
    25: 0.847,
    26: 0.882,
    27: 0.917,
    28: 0.952,
    29: 0.987,
  };

  const heightScaleMap = {
    4: 0.59,
    5: 0.785,
    6: 0.985,
    7: 1.185,
    8: 1.385,
    9: 1.585,
  };

  /* ------------------ METAL BUTTONS ------------------ */

  document.getElementById("copper-btn").onclick = () => {
    const prevMetal = selectedMetal;
    selectedMetal = "copper";

    adjustFontOnMetalChange(prevMetal, selectedMetal);
    updateMetalUI();
  };

  document.getElementById("aluminium-btn").onclick = () => {
    const prevMetal = selectedMetal;
    selectedMetal = "aluminium";

    adjustFontOnMetalChange(prevMetal, selectedMetal);
    updateMetalUI();
  };

  document.getElementById("tungsten-btn").onclick = () => {
    const prevMetal = selectedMetal;
    selectedMetal = "tungsten";

    adjustFontOnMetalChange(prevMetal, selectedMetal);
    updateMetalUI();
  };

  /* ------------------ TRANSFORM ORIGIN ------------------ */

  [copperBar, aluminiumBar, tungstenBar].forEach((bar) => {
    bar.setAttribute("transform-origin", "309.741px 567.498px");
  });

  /* ------------------ WIDTH SLIDER ------------------ */

  noUiSlider.create(widthSlider, {
    start: WIDTH_INITIAL,
    step: 1,
    range: { min: 0, max: 30 },
    connect: [true, false],
  });

  widthSlider.noUiSlider.on("update", () => {
    let value = Number(widthSlider.noUiSlider.get());

    if (value < WIDTH_MIN) {
      widthSlider.noUiSlider.set(WIDTH_MIN);
      value = WIDTH_MIN;
    } else if (value > WIDTH_MAX) {
      widthSlider.noUiSlider.set(WIDTH_MAX);
      value = WIDTH_MAX;
    }

    currentScaleX = widthScaleMap[value] || 1;
    activeBar.setAttribute(
      "transform",
      `scale(${currentScaleX}, ${currentScaleY})`
    );

    updateResistanceFont(); // ✅
    updateParticleWrapperSize(); // ✅ ADD

  });

  /* ------------------ HEIGHT SLIDER ------------------ */

  noUiSlider.create(heightSlider, {
    start: HEIGHT_INITIAL,
    step: 1,
    range: { min: 0, max: 10 },
    orientation: "vertical",
    direction: "rtl",
    connect: [true, false],
  });

  heightSlider.noUiSlider.on("update", () => {
    let value = Number(heightSlider.noUiSlider.get());

    if (value < HEIGHT_MIN) {
      heightSlider.noUiSlider.set(HEIGHT_MIN);
      value = HEIGHT_MIN;
    } else if (value > HEIGHT_MAX) {
      heightSlider.noUiSlider.set(HEIGHT_MAX);
      value = HEIGHT_MAX;
    }

    currentScaleY = heightScaleMap[value] || 1;
    activeBar.setAttribute(
      "transform",
      `scale(${currentScaleX}, ${currentScaleY})`
    );

    updateResistanceFont(); // ✅
    updateParticleWrapperSize(); // ✅ ADD

  });

function updateParticleWrapperSize() {
  if (!particleWrapper || !copperParticleFO) return;

  const newWidth = PARTICLE_BASE_WIDTH * currentScaleX;
  const newHeight = PARTICLE_BASE_HEIGHT * currentScaleY;

  // Resize SVG foreignObject
  copperParticleFO.setAttribute("width", newWidth);
  copperParticleFO.setAttribute("height", newHeight);

  // Resize inner container
  particleWrapper.style.width = `${newWidth}px`;
  particleWrapper.style.height = `${newHeight}px`;

  // 🔥 IMPORTANT: recreate particles to occupy full area
  createParticles();
}




  function updateMetalUI() {
    copperBar.style.display =
      aluminiumBar.style.display =
      tungstenBar.style.display =
        "none";

    copperTxt.style.display =
      aluminiumTxt.style.display =
      tungstenTxt.style.display =
        "none";

    if (selectedMetal === "copper") {
      activeBar = copperBar;
      copperTxt.style.display = "block";
    } else if (selectedMetal === "aluminium") {
      activeBar = aluminiumBar;
      aluminiumTxt.style.display = "block";
    } else {
      activeBar = tungstenBar;
      tungstenTxt.style.display = "block";
    }

    activeBar.style.display = "block";
    activeBar.setAttribute(
      "transform",
      `scale(${currentScaleX}, ${currentScaleY})`
    );
  }


  btn1.addEventListener("click", () => {
    ansText.textContent = noteTextByMetal[selectedMetal] || "";
    noteWrapper.style.display = "block";
  });

  closeBtn.addEventListener("click", () => {
    noteWrapper.style.display = "none";
  });

  /* ------------------ GLOBAL RESET ------------------ */

  resetBtn.addEventListener("click", () => {
    selectedMetal = "copper";

    widthSlider.noUiSlider.set(WIDTH_INITIAL);
    heightSlider.noUiSlider.set(HEIGHT_INITIAL);

    currentScaleX = widthScaleMap[WIDTH_INITIAL] || 1;
    currentScaleY = heightScaleMap[HEIGHT_INITIAL] || 1;

    resistanceLetter.setAttribute("font-size", RESISTANCE_INITIAL_FONT_SIZE);

    noteWrapper.style.display = "none";

    updateMetalUI();
  });

function updateResistanceFont() {
  if (!widthSlider.noUiSlider || !heightSlider.noUiSlider) return;

  const widthValue = Number(widthSlider.noUiSlider.get());
  const heightValue = Number(heightSlider.noUiSlider.get());

  // Normalize to 0-1 range
  const L = (widthValue - WIDTH_MIN) / (WIDTH_MAX - WIDTH_MIN); // length (0 to 1)
  const t = (heightValue - HEIGHT_MIN) / (HEIGHT_MAX - HEIGHT_MIN); // thickness (0 to 1)

  // Cross-sectional area - inverse relationship with resistance
  // 🔥 Much smaller minimum for more dramatic effect
  const A = Math.max(0.02 + t * 0.98, 0.02); // scale from 0.02 to 1.0

  // Physics: R = ρ * (L / A)
  // Apply exponential scaling for dramatic visual effect
  const lengthEffect = Math.pow(0.3 + L * 0.7, 2.5);
  const areaEffect = Math.pow(A, 0.25); // 🔥 Reduced from 0.4 to 0.25 for MORE dramatic effect
  
  // Calculate base resistance
  let R = lengthEffect / areaEffect;

  // Normalize to 0-1 range
  const R_MIN = Math.pow(0.3, 2.5) / Math.pow(1.0, 0.25);
  const R_MAX = Math.pow(1.0, 2.5) / Math.pow(0.02, 0.25);
  
  R = Math.max(0, Math.min((R - R_MIN) / (R_MAX - R_MIN), 1));

  // Apply metal-specific resistivity offset
  const minFont = MIN_RESISTANCE_FONT_SIZE + METAL_FONT_OFFSET[selectedMetal];
  const maxFont = MAX_RESISTANCE_FONT_BY_METAL[selectedMetal];

  // Map to font size with metal-specific range
  const fontSize = minFont + R * (maxFont - minFont);

  resistanceLetter.setAttribute("font-size", fontSize);
}



  function adjustFontOnMetalChange(prevMetal, newMetal) {
    const currentFont =
      Number(resistanceLetter.getAttribute("font-size")) ||
      RESISTANCE_INITIAL_FONT_SIZE;

    const delta = METAL_FONT_OFFSET[newMetal] - METAL_FONT_OFFSET[prevMetal];

    let newFont = currentFont + delta;

    // 🔒 Safety clamp (optional but recommended)
    const maxFont = MAX_RESISTANCE_FONT_BY_METAL[newMetal] || 390;

    newFont = Math.max(MIN_RESISTANCE_FONT_SIZE, Math.min(newFont, maxFont));

    resistanceLetter.setAttribute("font-size", newFont);
  }

  /* ------------------ PARTICLES ------------------ */



function createParticles() {
  if (!particleWrapper) return;

  particleWrapper.innerHTML = "";

  const w = particleWrapper.clientWidth;
  const h = particleWrapper.clientHeight;

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const p = document.createElement("span");
    p.className = "particle";

    const size = Math.random() * 3 + 2;   // 2–5px
    const duration = Math.random() * 2 + 1.5;

    p.style.width = `${size}px`;
    p.style.height = `${size}px`;

    // ✅ Spread across full container
    p.style.left = `${Math.random() * w}px`;
    p.style.top = `${Math.random() * h}px`;

    p.style.animationDuration = `${duration}s`;
    p.style.animationDelay = `${Math.random() * 1.5}s`;

    particleWrapper.appendChild(p);
  }
}


/* create on load */
createParticles();

/* recreate on reset */
resetBtn.addEventListener("click", () => {
  createParticles();
    updateParticleWrapperSize(); // ✅ ADD

});


  updateMetalUI(); // default
});
