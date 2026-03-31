document.addEventListener('DOMContentLoaded', () => {
  const startBtn = document.getElementById('start-btn');
  const resetBtn = document.getElementById('reset-btn');
  const lottieContainer = document.getElementById('lottie-animation');

  let lastState = '';
  let animationTimeout;
  let inducerAbsentTriggered = false;
  let isWaitingForSecondHalf = false;
  const animations = {};
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
      const anim = animations['present'];
      if (anim) {
        setTimeout(() => {
          anim.playSegments([anim.frameRate, anim.totalFrames], true);
        }, 1000);
      }
      isWaitingForSecondHalf = false;
      if (startBtn) {
        startBtn.style.opacity = '.4';
        startBtn.style.pointerEvents = 'none';
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
          playAnim('absent-present');
        } else {
          const anim = animations['present'];
          if (anim) {
            Object.values(animations).forEach(a => {
              a.containerDiv.style.display = 'none';
              a.stop();
            });
            anim.containerDiv.style.display = 'block';
            anim.playSegments([0, anim.frameRate], true);

            if (startBtn) {
              startBtn.style.opacity = '1';
              startBtn.style.pointerEvents = 'auto';
            }
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
