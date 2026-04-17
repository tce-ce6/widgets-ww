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
  const svgContainer = document.getElementById("svg-container");

  const noteWrapper = document.getElementById("note-wrapper");
  const closeBtn = noteWrapper.querySelector(".close-btn");
  const btn1 = document.getElementById("btn-1");
  const resetBtn = document.getElementById("reset-btn");

  const particleWrapper = document.getElementById("particle-wrapper");
  const PARTICLE_COUNT = 50;
  let hasUserChangedSlider = false;

  /* ------------------ CONSTANTS ------------------ */

  const MIN_RESISTANCE_FONT_SIZE = 150;
  const MAX_RESISTANCE_FONT_SIZE = 390;
  const RESISTANCE_INITIAL_FONT_SIZE = 194; // Recalculated for sync

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

  const copperBtn = document.getElementById("copper-btn");
  const aluminiumBtn = document.getElementById("aluminium-btn");
  const tungstenBtn = document.getElementById("tungsten-btn");

  /* ------------------ PARTICLE SIZE BASE ------------------ */

  const PARTICLE_BASE_WIDTH = 880;
  const PARTICLE_BASE_HEIGHT = 160;
  const PARTICLE_BASE_Y = 400;

  const copperParticleFO = document.getElementById("copper-particle");

  /* ------------------ BAR SCALE MAPS ------------------ */

  const widthScaleMap = {
    4: 0.111, 5: 0.146, 6: 0.183, 7: 0.217, 8: 0.252, 9: 0.287,
    10: 0.322, 11: 0.357, 12: 0.392, 13: 0.427, 14: 0.462, 15: 0.497,
    16: 0.532, 17: 0.567, 18: 0.602, 19: 0.637, 20: 0.672, 21: 0.707,
    22: 0.742, 23: 0.777, 24: 0.812, 25: 0.847, 26: 0.882, 27: 0.917,
    28: 0.952, 29: 0.987,
  };

  const heightScaleMap = {
    4: 0.59, 5: 0.785, 6: 0.985, 7: 1.185, 8: 1.385, 9: 1.585,
  };

  /* ------------------ METAL BUTTONS ------------------ */

  copperBtn.onclick = () => {
    selectedMetal = "copper";
    updateMetalUI();
    updateMetalButtonClasses();
    updateResistanceFont();
  };

  aluminiumBtn.onclick = () => {
    selectedMetal = "aluminium";
    updateMetalUI();
    updateMetalButtonClasses();
    updateResistanceFont();
  };

  tungstenBtn.onclick = () => {
    selectedMetal = "tungsten";
    updateMetalUI();
    updateMetalButtonClasses();
    updateResistanceFont();
  };

  /* ------------------ TRANSFORM ORIGIN ------------------ */

  [copperBar, aluminiumBar, tungstenBar].forEach((bar) => {
    bar.setAttribute("transform-origin", "309.741px 567.498px");
  });

  /* ------------------ WIDTH SLIDER ------------------ */

  noUiSlider.create(widthSlider, {
    start: WIDTH_INITIAL,
    step: 1,
    range: { min: WIDTH_MIN-4, max: WIDTH_MAX+1 }, // Giving some buffer for the snap logic
    connect: [true, false],
  });

  widthSlider.noUiSlider.on("update", () => {
    let value = Math.round(Number(widthSlider.noUiSlider.get()));
    if (value < WIDTH_MIN) { widthSlider.noUiSlider.set(WIDTH_MIN); value = WIDTH_MIN; }
    if (value > WIDTH_MAX) { widthSlider.noUiSlider.set(WIDTH_MAX); value = WIDTH_MAX; }

    currentScaleX = widthScaleMap[value] || 1;
    activeBar.setAttribute("transform", `scale(${currentScaleX}, ${currentScaleY})`);
    updateResistanceFont();
    updateParticleWrapperSize();
  });

  /* ------------------ HEIGHT SLIDER ------------------ */

  noUiSlider.create(heightSlider, {
    start: HEIGHT_INITIAL,
    step: 1,
    range: { min: HEIGHT_MIN-4, max: HEIGHT_MAX+1 },
    orientation: "vertical",
    direction: "rtl",
    connect: [true, false],
  });

  heightSlider.noUiSlider.on("update", () => {
    let value = Math.round(Number(heightSlider.noUiSlider.get()));
    if (value < HEIGHT_MIN) { heightSlider.noUiSlider.set(HEIGHT_MIN); value = HEIGHT_MIN; }
    if (value > HEIGHT_MAX) { heightSlider.noUiSlider.set(HEIGHT_MAX); value = HEIGHT_MAX; }

    currentScaleY = heightScaleMap[value] || 1;
    activeBar.setAttribute("transform", `scale(${currentScaleX}, ${currentScaleY})`);
    updateResistanceFont();
    updateParticleWrapperSize();
  });

  widthSlider.noUiSlider.on("change", () => {
    hasUserChangedSlider = true;
    resetBtn.removeAttribute("disabled");
  });

  heightSlider.noUiSlider.on("change", () => {
    hasUserChangedSlider = true;
    resetBtn.removeAttribute("disabled");
  });

  function updateParticleWrapperSize() {
    if (!particleWrapper || !copperParticleFO) return;
    const newWidth = PARTICLE_BASE_WIDTH * currentScaleX;
    const newHeight = PARTICLE_BASE_HEIGHT * currentScaleY;
    const newY = PARTICLE_BASE_Y - (newHeight - PARTICLE_BASE_HEIGHT) / 1;
    copperParticleFO.setAttribute("width", newWidth);
    copperParticleFO.setAttribute("height", newHeight);
    copperParticleFO.setAttribute("y", newY);
    particleWrapper.style.width = `${newWidth}px`;
    particleWrapper.style.height = `${newHeight}px`;
    createParticles();
  }

  function updateMetalUI() {
    [copperBar, aluminiumBar, tungstenBar].forEach(b => b.style.display = "none");
    [copperTxt, aluminiumTxt, tungstenTxt].forEach(t => t.style.display = "none");

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
    activeBar.setAttribute("transform", `scale(${currentScaleX}, ${currentScaleY})`);
  }

  btn1.addEventListener("click", () => {
    noteWrapper.style.display = "block";
    svgContainer.classList.add("modal-open");
  });

  closeBtn.addEventListener("click", () => {
    noteWrapper.style.display = "none";
    svgContainer.classList.remove("modal-open");
  });

  /* ------------------ GLOBAL RESET ------------------ */

  resetBtn.addEventListener("click", () => {
    hasUserChangedSlider = false;
    resetBtn.setAttribute("disabled", true);
    selectedMetal = "copper";
    updateMetalButtonClasses();
    widthSlider.noUiSlider.set(WIDTH_INITIAL);
    heightSlider.noUiSlider.set(HEIGHT_INITIAL);
    currentScaleX = widthScaleMap[WIDTH_INITIAL] || 1;
    currentScaleY = heightScaleMap[HEIGHT_INITIAL] || 1;
    noteWrapper.style.display = "none";
    svgContainer.classList.remove("modal-open");
    updateMetalUI();
    updateResistanceFont(); // CONSISTENT UPDATE
  });

  function updateResistanceFont() {
    if (!widthSlider.noUiSlider || !heightSlider.noUiSlider) return;
    const widthValue = Number(widthSlider.noUiSlider.get());
    const heightValue = Number(heightSlider.noUiSlider.get());

    // Normalize to 0-1 range
    const L = (widthValue - WIDTH_MIN) / (WIDTH_MAX - WIDTH_MIN);
    const t = (heightValue - HEIGHT_MIN) / (HEIGHT_MAX - HEIGHT_MIN);

    // Balanced Linear Impact logic
    let R = (L + (1 - t)) / 2;
    R = Math.max(0, Math.min(R, 1));

    const minFont = MIN_RESISTANCE_FONT_SIZE + METAL_FONT_OFFSET[selectedMetal];
    const maxFont = MAX_RESISTANCE_FONT_BY_METAL[selectedMetal];

    const fontSize = minFont + R * (maxFont - minFont);
    resistanceLetter.setAttribute("font-size", fontSize);
  }

  function createParticles() {
    if (!particleWrapper) return;
    particleWrapper.innerHTML = "";
    const w = particleWrapper.clientWidth;
    const h = particleWrapper.clientHeight;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      const p = document.createElement("span");
      p.className = "particle";
      const size = Math.random() * 3 + 2;
      const duration = Math.random() * 2 + 1.5;
      p.style.width = `${size}px`;
      p.style.height = `${size}px`;
      p.style.left = `${Math.random() * w}px`;
      p.style.top = `${Math.random() * h}px`;
      p.style.animationDuration = `${duration}s`;
      p.style.animationDelay = `${Math.random() * 1.5}s`;
      particleWrapper.appendChild(p);
    }
  }

  function updateMetalButtonClasses() {
    [copperBtn, aluminiumBtn, tungstenBtn].forEach(btn => btn.classList.remove("active", "disabled"));
    if (selectedMetal === "copper") {
      copperBtn.classList.add("active");
      aluminiumBtn.classList.add("disabled");
      tungstenBtn.classList.add("disabled");
    } else if (selectedMetal === "aluminium") {
      aluminiumBtn.classList.add("active");
      copperBtn.classList.add("disabled");
      tungstenBtn.classList.add("disabled");
    } else if (selectedMetal === "tungsten") {
      tungstenBtn.classList.add("active");
      copperBtn.classList.add("disabled");
      aluminiumBtn.classList.add("disabled");
    }
  }

  createParticles();
  updateMetalUI();
  updateMetalButtonClasses();
  updateResistanceFont();
});
