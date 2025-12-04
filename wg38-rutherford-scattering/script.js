document.addEventListener("DOMContentLoaded", () => {
  const torchBtn = document.getElementById("torch-btn");
  const playBtn = document.getElementById("play-btn");
  const torchBeam = document.getElementById("torch-beam");
  const stepForwardBtn = document.getElementById("step-forward");
  const stepForward = document.getElementById("step-forward");
  const resetBtn = document.getElementById("reset-btn");
  const closeBtn = document.getElementById("close-btn");

  const torchAnim = lottie.loadAnimation({
    container: document.getElementById("ray-container"),
    renderer: "svg",
    loop: false,
    autoplay: false,
    path: "ray-lottie.json",
  });

  // Wait for Lottie JSON to load before using frames
  torchAnim.addEventListener("DOMLoaded", () => {
    const totalFrames = torchAnim.totalFrames;
    const durationInSec = torchAnim.getDuration(true);
    const fps = totalFrames / durationInSec;

    const startFrame = 0;
    const endFrame = 50;
    let segmentStarted = false; // 👈 Track if we've started the main segment

    torchAnim.addEventListener("complete", () => {
      if (segmentStarted) {
        playBtn.classList.add("play-btn", "disabled", "pause");
        playBtn.classList.remove("playing");
        stepForwardBtn.classList.add("disabled");
      }
    });

    // 🔥 Torch button → play 0–1s
    torchBtn.addEventListener("click", () => {
      const ray = document.getElementById("ray-container");
      ray.style.opacity = "1";
      ray.style.visibility = "visible";

      torchAnim.stop();
      torchAnim.playSegments([startFrame, endFrame], true);

      torchBeam.classList.add("active");
      playBtn.classList.remove("disabled");
      stepForward.classList.remove("disabled");
      resetBtn.classList.remove("disabled");

      segmentStarted = false;

      function playAnimation() {
        const playButton = document.getElementById("play-btn");

        // 1. Add 'playing' class after 2000 milliseconds (2 seconds)
        setTimeout(() => {
          playButton.classList.add("starting");
          setTimeout(() => {
            playButton.classList.remove("starting");
          }, 2000);
        }, 2000);
      }

      playAnimation();
    });

    // ▶ Play button → play remaining animation after 1s
    playBtn.addEventListener("click", () => {
      const currentFrame = torchAnim.currentFrame;

      // If already playing → pause it
      if (playBtn.classList.contains("playing")) {
        torchAnim.pause();
        playBtn.classList.remove("playing");
        playBtn.classList.add("pause");
        return;
      }

      // If paused → resume it (fixed: resume starts the main segment if it wasn't started yet)
      if (playBtn.classList.contains("pause")) {
        // If the main segment hasn't been started yet, start it from the correct frame.
        if (!segmentStarted) {
          const startFrom = currentFrame >= endFrame ? currentFrame : endFrame;
          torchAnim.playSegments([startFrom, totalFrames], true);
          segmentStarted = true;
        } else {
          // already in the main segment, just resume
          torchAnim.play();
        }

        playBtn.classList.remove("pause");
        playBtn.classList.add("playing");
        return;
      }

      // 👉 FIRST CLICK: Start or resume the main segment
      if (!segmentStarted) {
        // Start the segment from wherever we are (endFrame or beyond)
        const startFrom = currentFrame >= endFrame ? currentFrame : endFrame;
        torchAnim.playSegments([startFrom, totalFrames], true);
        segmentStarted = true;
      } else {
        // Already in segment, just resume
        torchAnim.play();
      }

      playBtn.classList.add("playing");
    });

    // 👉 STEP-FORWARD
    const STEP = 5;

    stepForwardBtn.addEventListener("click", () => {
      let currentFrame = torchAnim.currentFrame;
      let nextFrame = currentFrame + STEP;

      if (nextFrame > totalFrames) nextFrame = totalFrames;

      torchAnim.goToAndStop(nextFrame, true);
      playBtn.classList.remove("playing");
      playBtn.classList.add("pause");
    });

    resetBtn.addEventListener("click", () => {
      torchAnim.stop();
      torchAnim.goToAndStop(0, true);

      playBtn.classList.remove("playing", "pause", "disabled");
      playBtn.classList.add("disabled");
      stepForward.classList.add("disabled");
      resetBtn.classList.add("disabled");

      torchBeam.classList.remove("active");
      torchBtn.classList.remove("active");

      // 👉 HIDE LOTTIE COMPLETELY
      const ray = document.getElementById("ray-container");
      ray.style.opacity = "0";
      ray.style.visibility = "hidden";

      segmentStarted = false;

      console.log("Reset complete");
    });

    document.getElementById("insight-btn").addEventListener("click", () => {
      const modal = document.getElementById("characteristics-modal");

      modal.style.display = "block";
      modal.style.opacity = "1";
      modal.style.visibility = "visible";

      // Add blur/disable to the SVG
      document.getElementById("svg-container").classList.add("modal-open");

      
      torchAnim.pause();   

      closeBtn.addEventListener("click", () => {

        playBtn.classList.add("play-btn", "pause");
        playBtn.classList.remove("playing");

        document.getElementById("svg-container").classList.remove("modal-open");
        modal.style.display = "none";
        modal.style.opacity = "0";
        modal.style.visibility = "hidden";
      });
    });
  });
});
