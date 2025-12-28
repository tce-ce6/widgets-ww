document.addEventListener("DOMContentLoaded", () => {
  const pipsSlider = document.getElementById("slider-width");
  const heightSlider = document.getElementById("slider-height");
  const copperBar = document.getElementById("copper-bar");
  const aluminiumBar = document.getElementById("aluminium-bar");
  const tungstenBar = document.getElementById("tungsten-bar");

  const copperTxt = document.getElementById("copper-txt");
  const aluminiumTxt = document.getElementById("aluminium-txt");
  const tungstenTxt = document.getElementById("tungsten-txt");
  const resistanceLetter = document.getElementById("resistance-letter");

  const MIN_RESISTANCE_FONT_SIZE = 150; // 👈 adjust if needed
  const MAX_RESISTANCE_FONT_SIZE = 390; // 👈 adjust if needed

  const BASE_RESISTANCE_FONT_SIZE = 570;

  let activeBar = copperBar; // ✅ default
  let selectedMetal = "copper";

  let currentScaleX = 1;
  let currentScaleY = 1;

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

  document.getElementById("copper-btn").addEventListener("click", () => {
    selectedMetal = "copper";
    updateMetalUI();
  });

  document.getElementById("aluminium-btn").addEventListener("click", () => {
    selectedMetal = "aluminium";
    updateMetalUI();
  });

  document.getElementById("tungsten-btn").addEventListener("click", () => {
    selectedMetal = "tungsten";
    updateMetalUI();
  });

  // Set transform origin so scaling happens from the left
  [copperBar, aluminiumBar, tungstenBar].forEach((bar) => {
    bar.setAttribute("transform-origin", "309.741px 567.498px");
  });

  // First (horizontal) slider
  noUiSlider.create(pipsSlider, {
    start: 13,
    step: 1,
    range: { min: 0, max: 30 },
    connect: [true, false],
    // Add event listener to prevent going below 13
    pips: {
      mode: "steps",
      density: 100,
      format: {
        to: (value) => {
          const labels = [
            "5",
            "10",
            "15",
            "20",
            "25",
            "30",
            "35",
            "40",
            "45",
            "50",
            "55",
            "60",
            "65",
            "70",
            "75",
            "80",
            "85",
            "90",
            "95",
            "100",
            "101",
            "102",
            "103",
            "104",
            "105",
            "106",
            "107",
            "108",
            "109",
            "110",
          ];
          return labels[Math.round(value)] || "";
        },
      },
    },
  });

  pipsSlider.noUiSlider.on("update", function (values, handle) {
    let value = Number(values[handle]);

    if (value < 4) {
      pipsSlider.noUiSlider.set(4);
      value = 4;
    } else if (value > 29) {
      pipsSlider.noUiSlider.set(29);
      value = 29;
    }

    // ✅ FIXED SCALE (NO CALCULATION)
    currentScaleX = widthScaleMap[value] || 1;

    activeBar.setAttribute(
      "transform",
      `scale(${currentScaleX}, ${currentScaleY})`
    );
    updateResistanceFontSize(value);
  });

  // Second (vertical) slider
  noUiSlider.create(heightSlider, {
    start: 6,
    step: 1,
    range: { min: 0, max: 10 },
    orientation: "vertical",
    direction: "rtl", // bottom → top (remove if not needed)
    range: { min: 0, max: 10 },
    connect: [true, false],
    pips: {
      mode: "steps",
      density: 100,
      format: {
        to: (value) =>
          ["10", "20", "30", "40", "50", "60", "70", "80", "90", "100"][value],
      },
    },
  });

heightSlider.noUiSlider.on("update", function (values, handle) {
  let value = Number(values[handle]);

  if (value < 4) {
    heightSlider.noUiSlider.set(4);
    value = 4;
  } else if (value > 9) {
    heightSlider.noUiSlider.set(9);
    value = 9;
  }

  currentScaleY = heightScaleMap[value] || 1;

  activeBar.setAttribute(
    "transform",
    `scale(${currentScaleX}, ${currentScaleY})`
  );

  // ✅ NEW: update resistance font-size on height change
  updateResistanceFontSizeByHeight(value);
});


  function updateMetalUI() {
    // Hide all bars
    copperBar.style.display = "none";
    aluminiumBar.style.display = "none";
    tungstenBar.style.display = "none";

    // Hide all texts
    copperTxt.style.display = "none";
    aluminiumTxt.style.display = "none";
    tungstenTxt.style.display = "none";

    // Reset transform so new metal inherits current scale
    let barToActivate;

    if (selectedMetal === "copper") {
      barToActivate = copperBar;
      copperTxt.style.display = "block";
    } else if (selectedMetal === "aluminium") {
      barToActivate = aluminiumBar;
      aluminiumTxt.style.display = "block";
    } else if (selectedMetal === "tungsten") {
      barToActivate = tungstenBar;
      tungstenTxt.style.display = "block";
    }

    barToActivate.style.display = "block";

    // 🔒 keep slider scaling intact
    barToActivate.setAttribute(
      "transform",
      `scale(${currentScaleX}, ${currentScaleY})`
    );

    activeBar = barToActivate;

    if (resistanceLetter && selectedMetal !== "copper") {
      resistanceLetter.setAttribute("font-size", BASE_RESISTANCE_FONT_SIZE);
    }
  }
function updateResistanceFontSize(sliderValue) {
  if (!resistanceLetter) return;
  if (selectedMetal !== "copper") return;

  const scale = widthScaleMap[sliderValue] || 1;

  let newFontSize = BASE_RESISTANCE_FONT_SIZE * scale;

  // 🔒 CLAMP font size
  newFontSize = Math.max(
    MIN_RESISTANCE_FONT_SIZE,
    Math.min(MAX_RESISTANCE_FONT_SIZE, newFontSize)
  );

  resistanceLetter.setAttribute("font-size", newFontSize);
}

function updateResistanceFontSizeByHeight(sliderValue) {
  if (!resistanceLetter) return;
  if (selectedMetal !== "copper") return;

  const scale = heightScaleMap[sliderValue] || 1;

  let newFontSize = BASE_RESISTANCE_FONT_SIZE * scale;

  // 🔒 CLAMP font size
  newFontSize = Math.max(
    MIN_RESISTANCE_FONT_SIZE,
    Math.min(MAX_RESISTANCE_FONT_SIZE, newFontSize)
  );

  resistanceLetter.setAttribute("font-size", newFontSize);
}


  updateMetalUI(); // copper default
});
