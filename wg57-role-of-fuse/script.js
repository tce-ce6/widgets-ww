document.addEventListener("DOMContentLoaded", () => {
  // -----------------------------
  // DOM ELEMENTS
  // -----------------------------
  const fuseGroup = document.getElementById("fuse-group");
  const shortCircuitBtn = document.getElementById("short-circuit-btn");
  const resetBtn = document.getElementById("reset-btn");
  const fuseSliderHandle = document.getElementById("fuse-slider-handle");

  // -----------------------------
  // CONSTANTS
  // -----------------------------
  const FUSE_OFF_X = 787;
  const FUSE_ON_X = 956;

  // -----------------------------
  // APPLICATION STATE
  // -----------------------------
  const state = {
    fuseOn: false,          // default OFF
    shortCircuit: false
  };

  // -----------------------------
  // INITIAL SETUP
  // -----------------------------
  fuseSliderHandle.style.transition = "x 0.4s ease-in-out";
  fuseSliderHandle.setAttribute("x", FUSE_OFF_X);

  // -----------------------------
  // HELPERS
  // -----------------------------
  function updateFuseUI() {

    const targetX = state.fuseOn ? FUSE_ON_X : FUSE_OFF_X;
    console.log("Setting fuse slider to x =", targetX);
    fuseSliderHandle.setAttribute("x", targetX);
  }

  function resetState() {
    state.fuseOn = false;
    state.shortCircuit = false;
    updateFuseUI();
  }

  // -----------------------------
  // EVENT LISTENERS
  // -----------------------------

  // Fuse toggle (slider)
  fuseSliderHandle.addEventListener("click", () => {
    state.fuseOn = !state.fuseOn;
    updateFuseUI();
  });

  // Short circuit button
  shortCircuitBtn.addEventListener("click", () => {
    state.shortCircuit = true;
    // you can add visual feedback here later
    console.log("Short circuit activated");
  });

  // Reset button
  resetBtn.addEventListener("click", () => {
    resetState();
    console.log("System reset to default");
  });
});
