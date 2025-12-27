document.addEventListener("DOMContentLoaded", () => {
  const pipsSlider = document.getElementById("slider-width");
  const heightSlider = document.getElementById("slider-height");
const copperBar = document.getElementById("copper-bar");

// Set transform origin so scaling happens from the left
copperBar.setAttribute(
  "transform-origin",
  "309.741px 480.309px" // left-center of the bar (based on your path)
);

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

  // 🔒 hard restriction (snap back)
  if (value < 13) {
    pipsSlider.noUiSlider.set(13);
    value = 13;
  } else if (value > 29) {
    pipsSlider.noUiSlider.set(29);
    value = 29;
  }

  // 📏 Map slider range (13 → 29) to scale (0.5 → 1.2)
  const minScale = 0.43;
  const maxScale = 1.2;

  const scale =
    minScale +
    ((value - 13) / (29 - 13)) * (maxScale - minScale);

  // 🟫 Apply width scaling to copper bar
  copperBar.setAttribute(
    "transform",
    `scale(${scale}, 1)`
  );
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
    const value = Number(values[handle]);
    if (value < 4) {
      heightSlider.noUiSlider.set(4);
    } else if (value > 9) {
      heightSlider.noUiSlider.set(9);
    }
  });



});
