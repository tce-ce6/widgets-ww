document.addEventListener('DOMContentLoaded', () => {
  const handler = document.getElementById('handler');
  const highValue = document.getElementById('high-value');
  const normalValue = document.getElementById('normal-value');
  const lowValue = document.getElementById('low-value');
  const svg = document.querySelector('svg');

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
  let currentLevel = '';

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
      autoplay: false,
      path: './lottie/Vessal.json'
    });
  }

  function setBtnState(active) {
    if (startBtn) {
      startBtn.style.opacity = active ? '1' : '0.4';
      startBtn.style.pointerEvents = active ? 'auto' : 'none';
    }
  }

  function playLottie(name) {
    if (currentLottie) {
      currentLottie.destroy();
    }
    currentLottie = lottie.loadAnimation({
      container: document.getElementById('glucose-container'),
      renderer: 'svg',
      loop: true,
      autoplay: false, // Do not autoplay as requested
      path: `./lottie/${name}.json`
    });
  }

  function updateState(y) {
    let nextLevel = '';
    if (y === CY_HIGH) nextLevel = 'high';
    else if (y === CY_NORMAL) nextLevel = 'normal';
    else if (y === CY_LOW) nextLevel = 'low';

    if (nextLevel && nextLevel !== currentLevel) {
      currentLevel = nextLevel;
      playLottie(`glucose-${nextLevel}-level`);
      
      // Stop and reset vessel if it was playing
      if (vesselLottie) {
        vesselLottie.stop();
      }

      // Ready to start!
      setBtnState(true);
    }
  }

  function moveHandlerTo(targetY, animate = true) {
    const deltaY = targetY - HANDLER_BASE_Y;
    handler.style.transition = animate ? 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)' : 'none';
    handler.style.transform = `translateY(${deltaY}px)`;
    currentY = targetY;
    updateState(targetY);
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

  // Initial State setup (Quietly initialize without enabling the button)
  currentLevel = 'normal';
  currentY = CY_NORMAL;
  const initialDeltaY = CY_NORMAL - HANDLER_BASE_Y;
  handler.style.transform = `translateY(${initialDeltaY}px)`;
  initVesselAnimation();
  playLottie('glucose-normal-level');
});
