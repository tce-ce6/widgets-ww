document.addEventListener("DOMContentLoaded", () => {
  const pipsSlider = document.getElementById("slider-pips");
  const earthImg = document.getElementById("earth-img");
  const tapTexts = document.querySelectorAll(".tap-txt");
  const topLottieWrapper = document.getElementById("top-lottie-wrapper");

  if (!pipsSlider || !earthImg) return;

  const degrees = [-45, -23, 0, 23, 45];

  // 🔒 Hide initially
  tapTexts.forEach((el) => (el.style.display = "none"));

  noUiSlider.create(pipsSlider, {
    start: 2, // 0°
    step: 1,
    range: { min: 0, max: 4 },
    connect: [true, false],
    pips: {
      mode: "steps",
      density: 100,
      format: {
        to: (value) => ["-45°", "-23°", "0°", "23°", "45°"][value],
      },
    },
  });

  // 🔄 Rotate earth always
  pipsSlider.noUiSlider.on("update", (values) => {
    const index = Math.round(values[0]);
    earthImg.style.transform = `rotate(${degrees[index]}deg)`;
  });

  // ✅ Show / hide tap text based on value
  pipsSlider.noUiSlider.on("set", (values) => {
    const index = Math.round(values[0]);

    if (index === 2) {
      // 🔁 Back to 0° → HIDE
      tapTexts.forEach((el) => {
        el.style.display = "none";
      });
    } else {
      // Any other angle → SHOW
      tapTexts.forEach((el) => {
        el.style.display = "block";
      });
    }
  });

  const earthWrap = document.getElementById("earth-wrap");

  if (!earthWrap) {
    console.error("earth-wrap not found");
    return;
  }

  // 🎞️ Lottie animations map
  const lottieMap = {
    top: {
      wrapper: document.getElementById("top-lottie-wrapper"),
      anim: lottie.loadAnimation({
        container: document.getElementById("top-earth-lottie"),
        renderer: "svg",
        loop: false,
        autoplay: false,
        path: "./lottie/top_earth.json",
      }),
    },
    bottom: {
      wrapper: document.getElementById("bottom-lottie-wrapper"),
      anim: lottie.loadAnimation({
        container: document.getElementById("bottom-earth-lottie"),
        renderer: "svg",
        loop: false,
        autoplay: false,
        path: "./lottie/earth_down.json",
      }),
    },
    left: {
      wrapper: document.getElementById("left-lottie-wrapper"),
      anim: lottie.loadAnimation({
        container: document.getElementById("left-earth-lottie"),
        renderer: "svg",
        loop: false,
        autoplay: false,
        path: "./lottie/left_earth.json",
      }),
    },
    right: {
      wrapper: document.getElementById("right-lottie-wrapper"),
      anim: lottie.loadAnimation({
        container: document.getElementById("right-earth-lottie"),
        renderer: "svg",
        loop: false,
        autoplay: false,
        path: "./lottie/right_earth.json",
      }),
    },
  };

  function playEarthLottie(direction) {
    Object.keys(lottieMap).forEach((key) => {
      const { wrapper, anim } = lottieMap[key];

      if (!wrapper || !anim) return;

      if (key === direction) {
        wrapper.style.display = "block";
        anim.goToAndPlay(0, true);
      } else {
        wrapper.style.display = "none";
        anim.stop();
      }
    });
  }

  // All possible tap targets
  const targets = ["top", "bottom", "left", "right"];

  targets.forEach((id) => {
    const targetEl = document.getElementById(id);
    if (!targetEl) return;

    targetEl.addEventListener("click", () => {
      // 🚫 Do nothing if tap-txt is hidden
      const isTapVisible = Array.from(tapTexts).some(
        (el) => el.style.display !== "none"
      );
      if (!isTapVisible) return;

      const bbox = targetEl.getBBox();

      // ---- existing movement logic (unchanged) ----
      const currX = parseFloat(earthWrap.getAttribute("x")) || 0;
      const currY = parseFloat(earthWrap.getAttribute("y")) || 0;
      const currW = parseFloat(earthWrap.getAttribute("width")) || 1;
      const currH = parseFloat(earthWrap.getAttribute("height")) || 1;

      const targetW = bbox.width * 1.08;
      const targetH = bbox.height * 1.08;

      const targetX = bbox.x + (bbox.width - targetW) / 2;
      const targetY = bbox.y + (bbox.height - targetH) / 2;

      const dx = targetX - currX;
      const dy = targetY - currY;
      const sx = targetW / currW;
      const sy = targetH / currH;

      earthWrap.style.transform = `
      translate(${dx}px, ${dy}px)
      scale(${sx}, ${sy})
    `;

      setTimeout(() => {
        earthWrap.style.transform = "none";
        earthWrap.setAttribute("x", targetX);
        earthWrap.setAttribute("y", targetY);
        earthWrap.setAttribute("width", targetW);
        earthWrap.setAttribute("height", targetH);
        targetEl.appendChild(earthWrap);
        playEarthLottie(id);
        // ✅ Show / hide TOP lottie wrapper
        if (id === "top") {
          topLottieWrapper.style.display = "block";
          topEarthAnim.goToAndPlay(0, true); // play animation
        } else {
          topLottieWrapper.style.display = "none";
          topEarthAnim.stop(); // optional
        }
      }, 450);
    });
  });
});
  