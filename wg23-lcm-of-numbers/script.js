let currentTab = 1;
let trafficCycleA = 0;
let trafficCycleB = 0;
let runnerLap1 = 0;
let runnerLap2 = 0;
let whiteJump = 0;
let brownJump = 0;

const hareBox = document.getElementById("hare-box");
const raceTrackBox = document.getElementById("race-track-box");
const trafficLightBox = document.getElementById("traffic-light-box");

const hareTab = document.getElementById("tab-3");
const raceTrackTab = document.getElementById("tab-2");
const trafficLightTab = document.getElementById("tab-1");

const hareTabLine = document.getElementById("tab-3-line");
const raceTrackTabLine = document.getElementById("tab-2-line");
const trafficLightTabLine = document.getElementById("tab-1-line");

const hareTabRect = document.getElementById("tab-3-rect");
const raceTrackTabRect = document.getElementById("tab-2-rect");
const trafficLightTabRect = document.getElementById("tab-1-rect");

const mainSvg = document.getElementById("main-svg");

const startBtn = document.getElementById("start-btn");
const resetBtn = document.getElementById("reset-btn");
const solutionBtn = document.getElementById("solution-btn");

hareTab.addEventListener("click", () => loadTab(3));
raceTrackTab.addEventListener("click", () => loadTab(2));
trafficLightTab.addEventListener("click", () => loadTab(1));

function loadTab(tabNumber) {
  currentTab = tabNumber;
  const startText = startBtn.querySelector('tspan');
  if (tabNumber === 1) startText.textContent = "Start Lights";
  else if (tabNumber === 2) startText.textContent = "Start Race";
  else if (tabNumber === 3) startText.textContent = "Start Hopping";

  // Toggle Visibility
  hareBox.style.display = (tabNumber === 3) ? "block" : "none";
  raceTrackBox.style.display = (tabNumber === 2) ? "block" : "none";
  trafficLightBox.style.display = (tabNumber === 1) ? "block" : "none";

  // Update Tab Colors
  const activeColor = "#FFF5B6";
  const inactiveColor = "#FFDE8C";
  hareTabLine.style.fill = (tabNumber === 3) ? activeColor : inactiveColor;
  raceTrackTabLine.style.fill = (tabNumber === 2) ? activeColor : inactiveColor;
  trafficLightTabLine.style.fill = (tabNumber === 1) ? activeColor : inactiveColor;
  hareTabRect.style.fill = (tabNumber === 3) ? activeColor : inactiveColor;
  raceTrackTabRect.style.fill = (tabNumber === 2) ? activeColor : inactiveColor;
  trafficLightTabRect.style.fill = (tabNumber === 1) ? activeColor : inactiveColor;

  stopAnimations();
  resetWidget();
}

function startRaceAnimation() {
  const lcm = getLCM(runnerLap1, runnerLap2);
  const blueMan = document.getElementById("blue-man");
  const brownMan = document.getElementById("brown-man");
  const startX = 1052.59 - 70; // 0-marker minus offset for man center
  const trackWidth = 676; // Total width of 0-20 scale

  let currentTime = 0; // in seconds
  let frame = 0;
  const fps = 20; // Update 20 times per second for smooth motion

  stopAnimations();

  window.raceInterval = setInterval(() => {
    frame++;
    currentTime = frame / fps;

    // Runner 1
    const p1 = (currentTime % runnerLap1) / runnerLap1;
    blueMan.setAttribute('x', startX + (p1 * trackWidth));
    document.getElementById("rt-lap-1").textContent = Math.floor(currentTime / runnerLap1);
    document.getElementById("rt-time-1").textContent = Math.floor(currentTime);

    // Runner 2
    const p2 = (currentTime % runnerLap2) / runnerLap2;
    brownMan.setAttribute('x', startX + (p2 * trackWidth));
    document.getElementById("rt-lap-2").textContent = Math.floor(currentTime / runnerLap2);
    document.getElementById("rt-time-2").textContent = Math.floor(currentTime);

    if (currentTime >= lcm) {
      clearInterval(window.raceInterval);
      
      // Finalize positions at start
      blueMan.setAttribute('x', startX);
      brownMan.setAttribute('x', startX);
      document.getElementById("rt-lap-1").textContent = lcm / runnerLap1;
      document.getElementById("rt-lap-2").textContent = lcm / runnerLap2;

      // Show meeting results
      document.getElementById("meet-res-1").textContent = lcm;
      document.getElementById("meet-elapsed").textContent = lcm;
      document.getElementById("meet-first").textContent = lcm;
      document.getElementById("meeting-time").style.display = "block";
    }
  }, 1000 / fps);
}

function stopAnimations() {
  if (window.hoppingInterval) clearInterval(window.hoppingInterval);
  if (window.raceInterval) clearInterval(window.raceInterval);
}

function getGCD(a, b) {
  return b === 0 ? a : getGCD(b, a % b);
}

function getLCM(a, b) {
  if (a === 0 || b === 0) return 0;
  return Math.abs(a * b) / getGCD(a, b);
}

function startHoppingAnimation() {
  const lcm = getLCM(whiteJump, brownJump);
  const whiteHare = document.getElementById("white-hare");
  const brownHare = document.getElementById("brown-hare");
  const unitPx = 34; // Approximate pixels per foot on the scale
  const startX = 980;

  let currentWhiteJump = 0;
  let currentBrownJump = 0;
  const maxWhiteJumps = lcm / whiteJump;
  const maxBrownJumps = lcm / brownJump;

  stopAnimations();
  clearFootprints();

  const drawJumpArc = (startX, endX, y) => {
    const radius = Math.abs(endX - startX) / 2;
    const pathData = `M ${startX} ${y} A ${radius} ${radius} 0 0 1 ${endX} ${y}`;
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute('d', pathData);
    path.setAttribute('stroke', 'black');
    path.setAttribute('stroke-width', '2');
    path.setAttribute('stroke-dasharray', '5,5');
    path.setAttribute('fill', 'none');
    path.classList.add('footprint-mark');
    mainSvg.appendChild(path);
  };

  window.hoppingInterval = setInterval(() => {
    let moved = false;

    if (currentWhiteJump < maxWhiteJumps) {
      const oldX = startX + (currentWhiteJump * whiteJump * unitPx) + 70;
      currentWhiteJump++;
      const targetX = startX + (currentWhiteJump * whiteJump * unitPx);
      whiteHare.setAttribute('x', targetX);
      drawJumpArc(oldX, targetX + 70, 471.5);
      
      document.getElementById("h-pos-1").textContent = currentWhiteJump * whiteJump;
      document.getElementById("h-jump-1").textContent = currentWhiteJump;
      moved = true;
    }

    if (currentBrownJump < maxBrownJumps) {
      const oldX = startX + (currentBrownJump * brownJump * unitPx) + 70;
      currentBrownJump++;
      const targetX = startX + (currentBrownJump * brownJump * unitPx);
      brownHare.setAttribute('x', targetX);
      drawJumpArc(oldX, targetX + 70, 737.5);

      document.getElementById("h-pos-2").textContent = currentBrownJump * brownJump;
      document.getElementById("h-jump-2").textContent = currentBrownJump;
      moved = true;
    }

    if (!moved) {
      clearInterval(window.hoppingInterval);
      
      // Update result text
      document.getElementById("res-lcm-1").textContent = lcm;
      document.getElementById("res-jump-a").textContent = whiteJump;
      document.getElementById("res-jump-b").textContent = brownJump;
      document.getElementById("res-count-a").textContent = maxWhiteJumps;
      document.getElementById("res-count-b").textContent = maxBrownJumps;

      document.getElementById("footprint-box").style.display = "block";
    }
  }, 1000);
}

function clearFootprints() {
  const marks = document.querySelectorAll('.footprint-mark');
  marks.forEach(m => m.remove());
}

function resetWidget() {
  trafficCycleA = 0; trafficCycleB = 0;
  runnerLap1 = 0; runnerLap2 = 0;
  whiteJump = 0; brownJump = 0;

  const tSnaps = [200, 306, 413, 519, 625, 732, 838];
  const rSnaps = [201, 307, 414, 520, 626, 733, 839];
  const hSnaps = [202, 308, 415, 521, 627, 734, 840];

  const setPos = (id, x, initialX) => {
    const el = document.getElementById(id);
    if (el) el.setAttribute('transform', `translate(${x - initialX}, 0)`);
  }

  setPos("traffic-slider-a", tSnaps[0], 203);
  setPos("traffic-slider-b", tSnaps[0], 203);
  setPos("runner-1-slider", rSnaps[0], 204);
  setPos("runner-2-slider", rSnaps[0], 204);
  setPos("white-hare-slider", hSnaps[0], 205);
  setPos("brown-hare-slider", hSnaps[0], 205);

  const setVal = (id, val, unit) => {
    const el = document.getElementById(id);
    if (el) el.querySelector('tspan').textContent = `${val}${unit}`;
  }

  setVal("0 seconds", 0, " seconds");
  setVal("0 seconds_2", 0, " seconds");
  setVal("0 seconds/lap", 0, " seconds/lap");
  setVal("0 seconds/lap_2", 0, " seconds/lap");
  setVal("0 feet/jump", 0, " feet/jump");
  setVal("0 feet/jump_2", 0, " feet/jump");

  const whiteHare = document.getElementById("white-hare");
  const brownHare = document.getElementById("brown-hare");
  if (whiteHare) whiteHare.setAttribute('x', '980');
  if (brownHare) brownHare.setAttribute('x', '980');

  const blueMan = document.getElementById("blue-man");
  const brownMan = document.getElementById("brown-man");
  const manStartX = 1052.59 - 70;
  if (blueMan) blueMan.setAttribute('x', manStartX);
  if (brownMan) brownMan.setAttribute('x', manStartX);

  document.getElementById("rt-lap-1").textContent = "0";
  document.getElementById("rt-time-1").textContent = "0";
  document.getElementById("rt-lap-2").textContent = "0";
  document.getElementById("rt-time-2").textContent = "0";

  if (document.getElementById("h-pos-1")) {
    document.getElementById("h-pos-1").textContent = "0";
    document.getElementById("h-jump-1").textContent = "0";
    document.getElementById("h-pos-2").textContent = "0";
    document.getElementById("h-jump-2").textContent = "0";
  }

  clearFootprints();
  document.getElementById("footprint-box").style.display = "none";
  document.getElementById("meeting-time").style.display = "none";

  startBtn.style.opacity = "0.3";
  startBtn.style.pointerEvents = "none";
  resetBtn.style.opacity = "0.3";
  resetBtn.style.pointerEvents = "none";
  solutionBtn.style.opacity = "0.3";
  solutionBtn.style.pointerEvents = "none";
}

function checkButtons() {
  let a, b;
  console.log(currentTab);
  if (currentTab === 1) { a = trafficCycleA; b = trafficCycleB; }
  else if (currentTab === 2) { a = runnerLap1; b = runnerLap2; }
  else if (currentTab === 3) { a = whiteJump; b = brownJump; }

  if (a > 0 || b > 0) {
    resetBtn.style.opacity = "1";
    resetBtn.style.pointerEvents = "auto";
  } else {
    resetBtn.style.opacity = "0.3";
    resetBtn.style.pointerEvents = "none";
  }

  if (a > 0 && b > 0) {
    startBtn.style.opacity = "1";
    startBtn.style.pointerEvents = "auto";
  } else {
    startBtn.style.opacity = "0.3";
    startBtn.style.pointerEvents = "none";
  }
}

startBtn.addEventListener('click', () => {
  solutionBtn.style.opacity = "1";
  solutionBtn.style.pointerEvents = "auto";

  if (currentTab === 3) startHoppingAnimation();
  else if (currentTab === 2) startRaceAnimation();
});

resetBtn.addEventListener('click', () => {
  resetWidget();
});

function getSVGPoint(event) {
  const pt = mainSvg.createSVGPoint();
  pt.x = event.clientX;
  pt.y = event.clientY;
  const ctm = mainSvg.getScreenCTM();
  if (!ctm) return pt;
  return pt.matrixTransform(ctm.inverse());
}

function initSlider(sliderId, snaps, valueId, initialX, multiplier, unit, updateCallback) {
  const slider = document.getElementById(sliderId);
  if (!slider) return;
  const valueElement = document.getElementById(valueId);
  if (!valueElement) return;
  const valueText = valueElement.querySelector('tspan');
  let isDragging = false;

  slider.style.cursor = "pointer";

  const startDrag = (e) => {
    isDragging = true;
    e.preventDefault();
  };

  const drag = (e) => {
    if (!isDragging) return;
    const pt = getSVGPoint(e.touches ? e.touches[0] : e);
    let x = pt.x;

    x = Math.max(snaps[0], Math.min(snaps[snaps.length - 1], x));

    let nearestIndex = 0;
    let minDiff = Infinity;
    for (let i = 0; i < snaps.length; i++) {
      const diff = Math.abs(x - snaps[i]);
      if (diff < minDiff) {
        minDiff = diff;
        nearestIndex = i;
      }
    }

    const snapX = snaps[nearestIndex];
    slider.setAttribute('transform', `translate(${snapX - initialX}, 0)`);

    const value = nearestIndex * multiplier;
    if (valueText) {
      valueText.textContent = `${value}${unit}`;
    }
    updateCallback(value);
    checkButtons();
  };

  const endDrag = () => {
    isDragging = false;
  };

  slider.addEventListener('mousedown', startDrag);
  window.addEventListener('mousemove', drag);
  window.addEventListener('mouseup', endDrag);

  slider.addEventListener('touchstart', startDrag);
  window.addEventListener('touchmove', drag, { passive: false });
  window.addEventListener('touchend', endDrag);
}

window.addEventListener("load", () => {
  loadTab(3);

  // Snaps for Traffic Light Tab (Tab 1)
  const trafficSnaps = [200, 306, 413, 519, 625, 732, 838];
  initSlider("traffic-slider-a", trafficSnaps, "0 seconds", 203, 2, " seconds", (val) => {
    trafficCycleA = val;
  });
  initSlider("traffic-slider-b", trafficSnaps, "0 seconds_2", 203, 2, " seconds", (val) => {
    trafficCycleB = val;
  });

  // Snaps for Runner Tab (Tab 2)
  const runnerSnaps = [201, 307, 414, 520, 626, 733, 839];
  initSlider("runner-1-slider", runnerSnaps, "0 seconds/lap", 204, 2, " seconds/lap", (val) => {
    runnerLap1 = val;
  });
  initSlider("runner-2-slider", runnerSnaps, "0 seconds/lap_2", 204, 2, " seconds/lap", (val) => {
    runnerLap2 = val;
  });

  // Snaps for Hare Tab (Tab 3)
  const hareSnaps = [202, 308, 415, 521, 627, 734, 840];
  initSlider("white-hare-slider", hareSnaps, "0 feet/jump", 205, 1, " feet/jump", (val) => {
    whiteJump = val;
  });
  initSlider("brown-hare-slider", hareSnaps, "0 feet/jump_2", 205, 1, " feet/jump", (val) => {
    brownJump = val;
  });
});

