document.addEventListener("DOMContentLoaded", () => {
  // -----------------------------
  // 1. DOM ELEMENTS
  // -----------------------------
  const containers = {
    pop: document.getElementById("pop-fuse-container"),
    popupSpark: document.getElementById("popup-spark"), // ✅ ADD
    flowFast: document.getElementById("current-flow-fast-container"),
    flowNormal: document.getElementById("current-flow-normal-container"),
    flowCut: document.getElementById("current-flow-fuse-cut-container"),
    fireTV: document.getElementById("fire-tv-container"),
    fireMicro: document.getElementById("fire-microwave-container"),
    fireFridge: document.getElementById("fire-refrigerator-container"),
    spark: document.getElementById("spark-container"), // Added Spark Container
  };

  const appliancesNormal = document.getElementById("appliances-normal");
  const appliancesOnFire = document.getElementById("appliances-on-fire");
  const fuseNormalGroup = document.getElementById("fuse-normal");
  const shortCircuitBtn = document.getElementById("short-circuit-btn");
  const resetBtn = document.getElementById("reset-btn");
  const fuseSliderHandle = document.getElementById("fuse-slider-handle");
  const fuseSliderGroup = document.getElementById("fuse-group");
  const tvOffSvg = document.getElementById("tv-off-svg");

  const FUSE_OFF_X = 787;
  const FUSE_ON_X = 956;

  let state = {
    fuseOn: false,
    shortCircuitActive: false,
    fireTimeout: null,
    fuseCutTimeout: null,
    popupSparkTimeout: null, // ✅ ADD
  };

  // -----------------------------
  // 2. LOTTIE INITIALIZATION
  // -----------------------------
  const anims = {};

  function initAnimation(key, container, path, loopValue) {
    if (!container) return;
    container.style.display = "none";

    anims[key] = lottie.loadAnimation({
      container: container,
      renderer: "svg",
      loop: loopValue,
      autoplay: false,
      path: path,
    });
  }

  initAnimation("pop", containers.pop, "assets/animation/pop_up.json", false);
  initAnimation(
    "popupSpark",
    containers.popupSpark,
    "assets/animation/popup-spark.json",
    true,
  );

  initAnimation(
    "flowNormal",
    containers.flowNormal,
    "assets/animation/current_flow_normal.json",
    true,
  );
  initAnimation(
    "flowFast",
    containers.flowFast,
    "assets/animation/current_flow_fast.json",
    true,
  );
  initAnimation(
    "flowCut",
    containers.flowCut,
    "assets/animation/current_flow_fuse_cut.json",
    true,
  );
  initAnimation(
    "fireTV",
    containers.fireTV,
    "assets/animation/Fire.json",
    true,
  );
  initAnimation(
    "fireMicro",
    containers.fireMicro,
    "assets/animation/Fire.json",
    true,
  );
  initAnimation(
    "fireFridge",
    containers.fireFridge,
    "assets/animation/Fire.json",
    true,
  );
  initAnimation(
    "spark",
    containers.spark,
    "assets/animation/spark-animation.json",
    true,
  ); // Init Spark (Looping)

  // -----------------------------
  // 3. CORE CONTROL FUNCTIONS
  // -----------------------------

  function resetToDefault() {
    if (state.popupSparkTimeout) clearTimeout(state.popupSparkTimeout);

    // Clear all logic timers
    state.shortCircuitActive = false;
    state.fuseOn = false;
    tvOffSvg.style.display = "none";
    if (state.fireTimeout) clearTimeout(state.fireTimeout);
    if (state.fuseCutTimeout) clearTimeout(state.fuseCutTimeout);
    shortCircuitBtn.style.opacity = "1";
    fuseSliderGroup.style.opacity = "1";
    fuseNormalGroup.style.opacity = "1";
    // UI Reset
    fuseNormalGroup.style.display = "none";
    appliancesNormal.style.display = "block";
    appliancesOnFire.style.display = "none";
    fuseSliderHandle.setAttribute("x", FUSE_OFF_X);

    // Hide ALL animation containers
    Object.values(containers).forEach((el) => {
      if (el) el.style.display = "none";
    });

    // Stop ALL animations
    Object.values(anims).forEach((a) => {
      a.stop();
      a.goToAndStop(0, true);
    });

    // Default start
    containers.flowNormal.style.display = "block";
    anims.flowNormal.play();
  }

  function handleShortCircuit() {
    if (state.shortCircuitActive) return;
    state.shortCircuitActive = true;
    shortCircuitBtn.style.opacity = "0.4";
    fuseSliderGroup.style.opacity = "0.4";
    fuseNormalGroup.style.opacity = "0.4";
    // Stop normal flow
    anims.flowNormal.stop();
    containers.flowNormal.style.display = "none";

    // Show and Start Sparking immediately
    containers.spark.style.display = "block";
    anims.spark.play();

    if (!state.fuseOn) {
      // SCENARIO 1: FIRE (Loop Sparking indefinitely until Reset)
      containers.flowFast.style.display = "block";
      anims.flowFast.play();

      state.fireTimeout = setTimeout(() => {
        appliancesNormal.style.display = "none";
        appliancesOnFire.style.display = "block";

        containers.fireTV.style.display = "block";
        containers.fireMicro.style.display = "block";
        containers.fireFridge.style.display = "block";

        anims.fireTV.play();
        anims.fireMicro.play();
        anims.fireFridge.play();
      }, 1000);
    } else {
      // SCENARIO 2: FUSE (Stop Sparking after 3 seconds)
      containers.flowFast.style.display = "block";
      anims.flowFast.play();

      containers.pop.style.display = "block";
      anims.pop.play();

      // ▶ Delay popup-spark by 500ms
      state.popupSparkTimeout = setTimeout(() => {
        containers.popupSpark.style.display = "block";
        anims.popupSpark.play();

        // ⏹ Stop popup-spark after 1 second
        setTimeout(() => {
          anims.popupSpark.stop();
          containers.popupSpark.style.display = "none";
        }, 1000);
      }, 2500);

      state.fuseCutTimeout = setTimeout(() => {
        // Cut current flow
        anims.flowFast.stop();
        containers.flowFast.style.display = "none";

        // STOP Sparking
        anims.spark.stop();
        containers.spark.style.display = "none";

        // STOP popup spark
        anims.popupSpark.stop();
        containers.popupSpark.style.display = "none";

        // Start Fuse Cut animation
        containers.flowCut.style.display = "block";
        anims.flowCut.play();

        // Stop pop and hold at end
        anims.pop.pause();
        anims.pop.goToAndStop(anims.pop.totalFrames - 1, true);
        tvOffSvg.style.display = "block";
      }, 3000);
    }
  }

  // -----------------------------
  // 4. EVENT LISTENERS
  // -----------------------------

  // Slider Logic
  const toggleFuse = (evt) => {
    evt.stopPropagation();
    if (state.shortCircuitActive) return;
    state.fuseOn = !state.fuseOn;
    fuseNormalGroup.style.display = state.fuseOn ? "block" : "none";
    fuseSliderHandle.style.transition = "x 0.4s ease-in-out";
    fuseSliderHandle.setAttribute("x", state.fuseOn ? FUSE_ON_X : FUSE_OFF_X);
  };

  fuseSliderHandle.addEventListener("click", toggleFuse);
  if (fuseSliderGroup) fuseSliderGroup.addEventListener("click", toggleFuse);

  shortCircuitBtn.addEventListener("click", handleShortCircuit);
  resetBtn.addEventListener("click", resetToDefault);

  // Initial State Run
  resetToDefault();
});
