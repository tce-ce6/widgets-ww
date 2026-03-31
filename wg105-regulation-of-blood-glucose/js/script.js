document.addEventListener('DOMContentLoaded', () => {
  const handler = document.getElementById('handler');
  const highValue = document.getElementById('high-value');
  const normalValue = document.getElementById('normal-value');
  const lowValue = document.getElementById('low-value');
  const svg = document.querySelector('svg');
  const toggleBtn = document.getElementById('toggle_button');
  const iText = document.getElementById('i-text');
  const insightBtn = document.getElementById('button-insite');
  const insightOverlay = document.getElementById('insights-overlay');
  const insightClose = document.getElementById('insights-close');
  const subNote = document.getElementById('sub-note');

  // Values based on cy positions in SVG (viewBox 1920x1080)
  const CY_HIGH = 359;
  const CY_NORMAL = 508;
  const CY_LOW = 656;
  const POSITIONS = [CY_HIGH, CY_NORMAL, CY_LOW];

  // Base Y position for the handler group (initial state is Normal ~508)
  const HANDLER_BASE_Y = 507.04;

  const startBtn = document.getElementById('start-btn');

  let isDragging = false;
  let dragStartY = 0;
  let currentY = CY_NORMAL;
  let currentLottie = null;
  let vesselLottie = null;
  let flowLottie = null;
  let currentLevel = '';
  let pendingFlowSegment = null;

  // Helper to get SVG coordinates from pointer event
  function getSVGPoint(event) {
    const pt = svg.createSVGPoint();
    if (event.touches && event.touches[0]) {
      pt.x = event.touches[0].clientX;
      pt.y = event.touches[0].clientY;
    } else {
      pt.x = event.clientX;
      pt.y = event.clientY;
    }
    const loc = pt.matrixTransform(svg.getScreenCTM().inverse());
    return loc;
  }

  // Initialize Vessel animation
  function initVesselAnimation() {
    if (vesselLottie) {
      vesselLottie.destroy();
    }
    vesselLottie = lottie.loadAnimation({
      container: document.getElementById('vessel-animation'),
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: './lottie/vessal.json'
    });
  }

  // Initialize Flow animation
  function initFlowAnimation() {
    if (flowLottie) {
      flowLottie.destroy();
    }
    flowLottie = lottie.loadAnimation({
      container: document.getElementById('flow-container'),
      renderer: 'svg',
      loop: false,
      autoplay: false,
      path: './lottie/flow.json'
    });

    // Set initial state for flow (Normal is at 15s = 450 frames)
    flowLottie.addEventListener('DOMLoaded', () => {
      flowLottie.goToAndStop(450, true);
    });

    // Handle end of animation
    flowLottie.addEventListener('complete', () => {
      if (currentLevel === 'high' || currentLevel === 'low') {
        // Return to normal
        setSliderState(true);
        moveHandlerTo(CY_NORMAL, true);
      }
    });
  }

  function setBtnState(active) {
    if (startBtn) {
      startBtn.style.opacity = active ? '1' : '0.4';
      startBtn.style.pointerEvents = active ? 'auto' : 'none';
    }
  }

  function setSliderState(active) {
    if (handler) {
      handler.style.opacity = active ? '1' : '0.4';
      handler.style.pointerEvents = active ? 'auto' : 'none';
    }
    if (toggleBtn) {
      toggleBtn.style.opacity = active ? '1' : '0.4';
      toggleBtn.style.pointerEvents = active ? 'auto' : 'none';
    }
    [highValue, normalValue, lowValue].forEach(el => {
      if (el) {
        el.style.pointerEvents = active ? 'auto' : 'none';
      }
    });
  }

  function playLottie(name) {
    if (currentLottie) {
      currentLottie.destroy();
    }
    currentLottie = lottie.loadAnimation({
      container: document.getElementById('glucose-container'),
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: `./lottie/${name}.json`
    });
  }

  function updateState(y) {
    let nextLevel = '';
    if (y === CY_HIGH) nextLevel = 'high';
    else if (y === CY_NORMAL) nextLevel = 'normal';
    else if (y === CY_LOW) nextLevel = 'low';

    if (nextLevel && nextLevel !== currentLevel) {
      const prevLevel = currentLevel;
      currentLevel = nextLevel;
      playLottie(`glucose-${nextLevel}-level`);

      if (subNote) {
        const levelText = nextLevel.charAt(0).toUpperCase() + nextLevel.slice(1);
        subNote.textContent = `${levelText} glucose level in blood`;
      }

      if (flowLottie) {
        let segment = null;
        // High = 0s (0), Normal = 15s (450), Low = 30s (900)
        if (prevLevel === 'high' && nextLevel === 'normal') segment = [0, 450];
        else if (prevLevel === 'normal' && nextLevel === 'high') segment = [0, 450];
        else if (prevLevel === 'normal' && nextLevel === 'low') segment = [450, 900];
        else if (prevLevel === 'low' && nextLevel === 'normal') segment = [900, 0];
        else if (prevLevel === 'high' && nextLevel === 'low') segment = [450, 400];
        else if (prevLevel === 'low' && nextLevel === 'high') segment = [900, 450];

        pendingFlowSegment = segment;
      }

      // Conditional interactive states based on level
      if (nextLevel === 'normal') {
        setSliderState(true);
        setBtnState(false);
        if (iText) iText.style.display = 'block';
      } else {
        setBtnState(true);
        setSliderState(false);
        if (iText) iText.style.display = 'none';
      }
    }
  }

  function moveHandlerTo(targetY, animate = true) {
    let finalY = targetY;
    // Step logic: if jumping between high and low, stop at normal
    if (currentLevel === 'high' && targetY === CY_LOW) finalY = CY_NORMAL;
    else if (currentLevel === 'low' && targetY === CY_HIGH) finalY = CY_NORMAL;

    const deltaY = finalY - HANDLER_BASE_Y;
    handler.style.transition = animate ? 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)' : 'none';
    handler.style.transform = `translateY(${deltaY}px)`;
    currentY = finalY;
    updateState(finalY);
  }

  // Start Button Logic
  if (startBtn) {
    const startSequence = () => {
      if (currentLottie) {
        // Disable button while playing/played
        setBtnState(false);
        currentLottie.play();
        if (vesselLottie) {
          vesselLottie.play();
        }
        if (flowLottie && pendingFlowSegment) {
          flowLottie.playSegments(pendingFlowSegment, true);
        } else if (flowLottie) {
          flowLottie.play();
        }
      }
    };

    startBtn.addEventListener('click', startSequence);
    startBtn.addEventListener('touchstart', (e) => {
      e.preventDefault();
      startSequence();
    });
  }


  function handleStart(e) {
    isDragging = true;
    const pt = getSVGPoint(e);
    // Find initial offset between mouse and handler center
    dragStartY = pt.y - currentY;
    handler.style.transition = 'none';

    // Disable button while dragging
    setBtnState(false);

    e.preventDefault();
  }

  function handleMove(e) {
    if (!isDragging) return;
    const pt = getSVGPoint(e);

    // Calculate new position based on drag start offset
    let newY = pt.y - dragStartY;

    // Stepper logic: don't allow skipping 'normal' from 'high' or 'low'
    if (currentLevel === 'high' && newY > CY_NORMAL) newY = CY_NORMAL;
    else if (currentLevel === 'low' && newY < CY_NORMAL) newY = CY_NORMAL;

    // Clamp movement within the slider range
    if (newY < CY_HIGH) newY = CY_HIGH;
    if (newY > CY_LOW) newY = CY_LOW;

    const deltaY = newY - HANDLER_BASE_Y;
    handler.style.transform = `translateY(${deltaY}px)`;
    currentY = newY;
    e.preventDefault();
  }

  function handleEnd(e) {
    if (!isDragging) return;
    isDragging = false;

    // Snap to nearest position
    let closestY = POSITIONS[0];
    let minDiff = Math.abs(currentY - POSITIONS[0]);

    for (let i = 1; i < POSITIONS.length; i++) {
      const diff = Math.abs(currentY - POSITIONS[i]);
      if (diff < minDiff) {
        minDiff = diff;
        closestY = POSITIONS[i];
      }
    }

    moveHandlerTo(closestY);
  }

  // Click on value markers
  [highValue, normalValue, lowValue].forEach(el => {
    el.addEventListener('click', (e) => {
      const cy = parseFloat(el.getAttribute('cy'));
      moveHandlerTo(cy);
    });
  });

  // Handler Drag Events
  handler.addEventListener('mousedown', handleStart);
  handler.addEventListener('touchstart', handleStart, { passive: false });

  window.addEventListener('mousemove', handleMove);
  window.addEventListener('touchmove', handleMove, { passive: false });

  window.addEventListener('mouseup', handleEnd);
  window.addEventListener('touchend', handleEnd);

  // Insight Overlay Logic
  if (insightBtn && insightOverlay) {
    insightBtn.style.cursor = 'pointer';
    insightBtn.addEventListener('click', () => {
      insightOverlay.style.display = 'block';
    });
  }

  if (insightClose && insightOverlay) {
    insightClose.addEventListener('click', () => {
      insightOverlay.style.display = 'none';
    });
  }

  // Initial State setup (Quietly initialize without enabling the button)
  currentLevel = 'normal';
  currentY = CY_NORMAL;
  const initialDeltaY = CY_NORMAL - HANDLER_BASE_Y;
  handler.style.transform = `translateY(${initialDeltaY}px)`;
  initVesselAnimation();
  initFlowAnimation();
  playLottie('glucose-normal-level');
  setSliderState(true);
});
