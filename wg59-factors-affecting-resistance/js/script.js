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
  });

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

  /* -------- Normalize length (L) -------- */
  const L =
    (widthValue - WIDTH_MIN) / (WIDTH_MAX - WIDTH_MIN); // 0 → 1

  /* -------- Normalize thickness -------- */
  const t =
    (heightValue - HEIGHT_MIN) / (HEIGHT_MAX - HEIGHT_MIN); // 0 → 1

  /* -------- Area ∝ thickness² -------- */
  const A = Math.max(t * t, 0.04); // prevent divide-by-zero

  /* -------- Resistance ∝ L / A -------- */
  let R = L / A;

  /* -------- Normalize R to 0–1 -------- */
  const R_MAX = 1 / 0.04; // must match A clamp
  R = Math.min(R / R_MAX, 1);

  /* -------- Metal-based font scaling -------- */
  const maxFont =
    MAX_RESISTANCE_FONT_BY_METAL[selectedMetal] || 390;

  const fontSize =
    MIN_RESISTANCE_FONT_SIZE +
    R * (maxFont - MIN_RESISTANCE_FONT_SIZE);

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

  updateMetalUI(); // default
});
