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

hareTab.addEventListener("click", () => {
  loadTab(3);

  hareBox.style.display = "block";
  raceTrackBox.style.display = "none";
  trafficLightBox.style.display = "none";

  hareTabLine.style.fill = "#FFF5B6";
  raceTrackTabLine.style.fill = "#FFDE8C";
  trafficLightTabLine.style.fill = "#FFDE8C";
  hareTabRect.style.fill = "#FFF5B6";
  raceTrackTabRect.style.fill = "#FFDE8C";
  trafficLightTabRect.style.fill = "#FFDE8C";
});

raceTrackTab.addEventListener("click", () => {
  loadTab(2);

  hareBox.style.display = "none";
  raceTrackBox.style.display = "block";
  trafficLightBox.style.display = "none";

  hareTabLine.style.fill = "#FFDE8C";
  raceTrackTabLine.style.fill = "#FFF5B6";
  trafficLightTabLine.style.fill = "#FFDE8C";
  hareTabRect.style.fill = "#FFDE8C";
  raceTrackTabRect.style.fill = "#FFF5B6";
  trafficLightTabRect.style.fill = "#FFDE8C";
});

trafficLightTab.addEventListener("click", () => {
  loadTab(1);

  hareBox.style.display = "none";
  raceTrackBox.style.display = "none";
  trafficLightBox.style.display = "block";

  hareTabLine.style.fill = "#FFDE8C";
  raceTrackTabLine.style.fill = "#FFDE8C";
  trafficLightTabLine.style.fill = "#FFF5B6";
  hareTabRect.style.fill = "#FFDE8C";
  raceTrackTabRect.style.fill = "#FFDE8C";
  trafficLightTabRect.style.fill = "#FFF5B6";
});

function loadTab(tabNumber) {
  currentTab = tabNumber;
  const startText = startBtn.querySelector('tspan');
  if (tabNumber === 1) startText.textContent = "Start Lights";
  else if (tabNumber === 2) startText.textContent = "Start Race";
  else if (tabNumber === 3) startText.textContent = "Start Hopping";

  resetWidget();
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

  startBtn.style.opacity = "0.3";
  startBtn.style.pointerEvents = "none";
  resetBtn.style.opacity = "0.3";
  resetBtn.style.pointerEvents = "none";
  solutionBtn.style.opacity = "0.3";
  solutionBtn.style.pointerEvents = "none";
}

function checkButtons() {
  let a, b;
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
  loadTab(1);

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

