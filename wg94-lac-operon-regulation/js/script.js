document.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.getElementById('start-btn');
  const resetBtn = document.getElementById('reset-btn');
  const lottieContainer = document.getElementById('lottie-animation');
  const iText = document.getElementById('i-text');

  let lastState = '';
  let animationTimeout;
  let inducerAbsentTriggered = false;
  let isWaitingForSecondHalf = false;
  let resumableAnimKey = '';

  const animations = {};
  let pausedFrame = 0; // declare at top
  const animationFiles = {
    start: './assets/start.json',
    present: './assets/present.json',
    absent: './assets/absent.json',
    'absent-present': './assets/absent-to-present.json',
    'present-absent': './assets/present-to-absent.json'
  };

  // Preload all animations
  Object.entries(animationFiles).forEach(([key, path]) => {
    const div = document.createElement('div');
    div.classList.add('animation-layer');
    div.style.display = 'none';
    div.style.width = '100%';
    div.style.height = '100%';
    lottieContainer.appendChild(div);

    animations[key] = lottie.loadAnimation({
      container: div,
      renderer: 'svg',
      loop: false,
      autoplay: false,
      path: path,
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid meet',
        clearCanvas: true
      }
    });
    animations[key].containerDiv = div;
  });

  function playAnim(key, autoplay = true) {
    console.log(`[Animation Log] playAnim called for: "${key}" (autoplay: ${autoplay}) at ${new Date().toLocaleTimeString()}`);
    Object.values(animations).forEach(anim => {
      anim.containerDiv.style.display = 'none';
      anim.stop();
    });
    const target = animations[key];
    if (target) {
      target.containerDiv.style.display = 'block';
      if (autoplay) {
        target.goToAndPlay(0, true);
      } else {
        target.goToAndStop(0, true);
      }
    }
  }

  // Initial load
  playAnim('start', false);

  const inducerPresent = document.getElementById('inducer-present');
  const inducerAbsent = document.getElementById('inducer-absent');

  startBtn.addEventListener('click', () => {
    if (animationTimeout) clearTimeout(animationTimeout);

    if (isWaitingForSecondHalf) {
      const anim = animations[resumableAnimKey];
      if (anim) {
        console.log(`[Animation Log] Resuming: "${resumableAnimKey}" at ${new Date().toLocaleTimeString()}`);
        anim.containerDiv.style.display = 'block';
        setTimeout(() => {
          anim.play();
        }, 1000);
      }
      isWaitingForSecondHalf = false;
      if (startBtn) {
        startBtn.style.opacity = '.4';
        startBtn.style.pointerEvents = 'none';
        if (iText) iText.style.display = 'none';
      }
      return;
    }

    if (inducerAbsentTriggered) {
      const rectObject = document.getElementById('rect-object');
      if (rectObject) rectObject.style.display = 'block';
      return; // Do not play start.json animation again
    }

    lastState = '';

    // Dim the start button and disable it immediately for the first load
    if (startBtn) {
      startBtn.style.opacity = '.4';
      startBtn.style.pointerEvents = 'none';
      if (iText) iText.style.display = 'none';
    }

    // Play start.json animation
    playAnim('start', true);

    // After 5 seconds, remove opacity on control-bar
    animationTimeout = setTimeout(() => {
      const controlBar = document.getElementById('control-bar');
      if (controlBar) {
        controlBar.style.opacity = '1';
        controlBar.style.pointerEvents = 'auto';
      }
    }, 5000);
  });

  function enableResetBtn() {
    if (resetBtn) {
      resetBtn.style.opacity = '1';
      resetBtn.style.pointerEvents = 'auto';
    }
  }

  function disableResetBtn() {
    if (resetBtn) {
      resetBtn.style.opacity = '.4';
      resetBtn.style.pointerEvents = 'none';
    }
  }

  if (inducerPresent) {
    inducerPresent.addEventListener('change', () => {
      enableResetBtn();
      if (inducerPresent.checked) {
        if (inducerAbsent) inducerAbsent.checked = false;

        inducerAbsentTriggered = false;
        const rectObject = document.getElementById('rect-object');
        if (rectObject) rectObject.style.display = 'none';

        if (lastState === 'absent') {
          const anim = animations['absent-present'];
          if (anim) {
            Object.values(animations).forEach(a => {
              a.containerDiv.style.display = 'none';
              a.stop();
            });
            anim.containerDiv.style.display = 'block';
            console.log(`[Animation Log] Starting: "absent-present" at ${new Date().toLocaleTimeString()}`);
            anim.goToAndPlay(0, true);
            setTimeout(() => {
              console.log(`[Animation Log] Pausing: "absent-present" at 3s mark at ${new Date().toLocaleTimeString()}`);
              anim.pause();
              pausedFrame = anim.currentFrame;
            }, 3000);

            if (startBtn) {
              startBtn.style.opacity = '1';
              startBtn.style.pointerEvents = 'auto';
              if (iText) {
                iText.innerText = "Tap Start to initiate z, y, a genes' expression";
                iText.style.display = 'block';
              }
            }
            resumableAnimKey = 'absent-present';
            isWaitingForSecondHalf = true;
          }
        } else {
          const anim = animations['present'];
          if (anim) {
            Object.values(animations).forEach(a => {
              a.containerDiv.style.display = 'none';
              a.stop();
            });
            anim.containerDiv.style.display = 'block';
            console.log(`[Animation Log] Starting: "present" at ${new Date().toLocaleTimeString()}`);
            anim.goToAndPlay(0, true);

            setTimeout(() => {
              console.log(`[Animation Log] Pausing: "present" at 1s mark at ${new Date().toLocaleTimeString()}`);
              anim.pause();
              pausedFrame = anim.currentFrame;
            }, 1000);

            if (startBtn) {
              startBtn.style.opacity = '1';
              startBtn.style.pointerEvents = 'auto';
              if (iText) {
                iText.innerText = "Tap Start to initiate z, y, a genes' expression";
                iText.style.display = 'block';
              }
            }
            resumableAnimKey = 'present';
            isWaitingForSecondHalf = true;
          }
        }
        lastState = 'present';
      }
    });
  }

  if (inducerAbsent) {
    inducerAbsent.addEventListener('change', () => {
      enableResetBtn();
      if (inducerAbsent.checked) {
        if (inducerPresent) inducerPresent.checked = false;

        const targetAnimKey = lastState === 'present' ? 'present-absent' : 'absent';
        playAnim(targetAnimKey);
        lastState = 'absent';

        // Enable start button immediately and set the trigger flag
        if (startBtn) {
          startBtn.style.opacity = '1';
          startBtn.style.pointerEvents = 'auto';
          if (iText) {
            iText.innerText = "Tap Start to initiate z, y, a genes' expression";
            iText.style.display = 'block';
          }
        }
        inducerAbsentTriggered = true;
      }
    });
  }

  const modal = document.getElementById('modal');
  const modalBackdrop = document.getElementById('modal-backdrop');
  const insightBtn = document.getElementById('insight-btn');
  const closeModal = document.getElementById('close-modal');

  if (insightBtn && modal && modalBackdrop) {
    insightBtn.addEventListener('click', () => {
      modal.style.display = 'block';
      modalBackdrop.style.display = 'block';
    });
  }

  if (closeModal && modal && modalBackdrop) {
    closeModal.addEventListener('click', () => {
      modal.style.display = 'none';
      modalBackdrop.style.display = 'none';
    });
  }

  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (animationTimeout) clearTimeout(animationTimeout);
      lastState = '';

      // Restore the start button
      if (startBtn) {
        startBtn.style.opacity = '1';
        startBtn.style.pointerEvents = 'auto';
        if (iText) {
          iText.innerText = "Tap Start to initiate i gene's expression";
          iText.style.display = 'block';
        }
      }

      inducerAbsentTriggered = false;
      isWaitingForSecondHalf = false;
      const rectObject = document.getElementById('rect-object');
      if (rectObject) rectObject.style.display = 'none';

      playAnim('start', false);

      const controlBar = document.getElementById('control-bar');
      if (controlBar) {
        controlBar.style.opacity = '.4';
        controlBar.style.pointerEvents = 'none';
      }

      if (inducerPresent) inducerPresent.checked = false;
      if (inducerAbsent) inducerAbsent.checked = false;

      if (modal) modal.style.display = 'none';
      if (modalBackdrop) modalBackdrop.style.display = 'none';

      disableResetBtn();
    });
  }
});
