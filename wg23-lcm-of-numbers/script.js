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
    document.getElementById("rt-time-1").textContent = `${Math.floor(currentTime)}s`;

    // Runner 2
    const p2 = (currentTime % runnerLap2) / runnerLap2;
    brownMan.setAttribute('x', startX + (p2 * trackWidth));
    document.getElementById("rt-lap-2").textContent = Math.floor(currentTime / runnerLap2);
    document.getElementById("rt-time-2").textContent = `${Math.floor(currentTime)}s`;

    if (currentTime >= lcm) {
      clearInterval(window.raceInterval);

      // Finalize positions at start
      blueMan.setAttribute('x', startX);
      brownMan.setAttribute('x', startX);
      document.getElementById("rt-lap-1").textContent = lcm / runnerLap1;
      document.getElementById("rt-lap-2").textContent = lcm / runnerLap2;

      // Show meeting results
      const count1 = lcm / runnerLap1;
      const count2 = lcm / runnerLap2;
      document.getElementById("meet-line-1").textContent = `Both meet at the start after ${lcm} seconds`;
      document.getElementById("meet-line-2").textContent = `LCM of ${runnerLap1} and ${runnerLap2} is ${lcm}.`;
      document.getElementById("meet-line-3").textContent = `Runner 1 completed ${count1} laps. Runner 2 completed ${count2} laps`;
      document.getElementById("meeting-time").style.display = "block";
    }
  }, 1000 / fps);
}

function startTrafficAnimation() {
  const lcm = getLCM(trafficCycleA, trafficCycleB);
  const brightGreen = "#2ff411";
  const darkGreen = "#004010";
  const brightRed = "#FF2424";
  const darkRed = "#401010";

  let currentTime = 0;
  stopAnimations();
  clearTrafficTimes();

  const updateLightsAndBlocks = () => {
    if (currentTime > lcm) {
      clearInterval(window.trafficInterval);
      updateTrafficLight("traffic-A-green", "traffic-A-red", true);
      updateTrafficLight("traffic-B-green", "traffic-B-red", true);

      // Populate and show light-blink-box
      document.getElementById("res-lcm-light").textContent = lcm;
      document.getElementById("res-cycle-a-val").textContent = trafficCycleA;
      document.getElementById("res-cycle-b-val").textContent = trafficCycleB;
      document.getElementById("res-light-count-a").textContent = lcm / trafficCycleA;
      document.getElementById("res-light-count-b").textContent = lcm / trafficCycleB;
      document.getElementById("light-blink-box").style.display = "block";
      return;
    }

    // Update Traffic A
    const phaseA = currentTime % trafficCycleA;
    const isGreenA = phaseA < (trafficCycleA / 2);
    updateTrafficLight("traffic-A-green", "traffic-A-red", isGreenA);
    if (phaseA === 0) addTrafficTime("traffic-A-time", currentTime);

    // Update Traffic B
    const phaseB = currentTime % trafficCycleB;
    const isGreenB = phaseB < (trafficCycleB / 2);
    updateTrafficLight("traffic-B-green", "traffic-B-red", isGreenB);
    if (phaseB === 0) addTrafficTime("traffic-B-light-time", currentTime);

    currentTime++;
  };

  // Immediate first call
  updateLightsAndBlocks();
  window.trafficInterval = setInterval(updateLightsAndBlocks, 1000);

  function updateTrafficLight(gId, rId, showGreen) {
    const gPath = document.getElementById(gId).querySelector('path');
    const rPath = document.getElementById(rId).querySelector('path');
    gPath.setAttribute('fill', showGreen ? brightGreen : darkGreen);
    rPath.setAttribute('fill', showGreen ? darkRed : brightRed);
  }

  function addTrafficTime(containerId, time) {
    const container = document.getElementById(containerId);
    if (!container) return;
    const template = container.firstElementChild;
    if (!template) return;

    template.style.display = "none";

    const clone = template.cloneNode(true);
    const blocksCount = container.querySelectorAll('.traffic-time-block').length;
    const offset = blocksCount * 45; // Reduced margin to fit 7 per row

    clone.classList.add('traffic-time-block');
    clone.style.display = "block";
    clone.setAttribute('transform', `translate(${offset}, 0)`);

    const tspan = clone.querySelector('tspan');
    if (tspan) tspan.textContent = time + "s";

    container.appendChild(clone);
  }
}

function clearTrafficTimes() {
  document.querySelectorAll('.traffic-time-block').forEach(el => el.remove());
}

function resetTrafficLights() {
  const darkGreen = "#004010";
  const darkRed = "#401010";
  const lightIds = ["traffic-A-green", "traffic-A-red", "traffic-B-green", "traffic-B-red"];
  lightIds.forEach(id => {
    const group = document.getElementById(id);
    if (!group) return;
    const path = group.querySelector('path');
    if (!path) return;
    if (id.includes('green')) path.setAttribute('fill', darkGreen);
    else path.setAttribute('fill', darkRed);
  });
}

function stopAnimations() {
  if (window.hoppingInterval) clearInterval(window.hoppingInterval);
  if (window.raceInterval) clearInterval(window.raceInterval);
  if (window.trafficInterval) clearInterval(window.trafficInterval);
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
  stopAnimations();

  trafficCycleA = 0; trafficCycleB = 0;
  runnerLap1 = 0; runnerLap2 = 0;
  whiteJump = 0; brownJump = 0;

  const tSnaps = [200, 306, 413, 519, 625, 732, 838];
  const rSnaps = [201, 307, 414, 520, 626, 733, 839];
  const hSnaps = [202, 308, 415, 521, 627, 734];

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
    if (!el) return;
    const target = (el.tagName === 'tspan' || el.tagName === 'text') ? el : el.querySelector('tspan');
    if (target) target.textContent = `${val}${unit}`;
    else el.textContent = `${val}${unit}`;
  }

  setVal("green-time-a", 0, " seconds");
  setVal("green-time-b", 0, " seconds");
  const d1 = document.getElementById("green-desc-a");
  if (d1) d1.textContent = "Green for 0s, then Red for 0s";
  const d2 = document.getElementById("green-desc-b");
  if (d2) d2.textContent = "Green for 0s, then Red for 0s";
  setVal("runner-time-a", 0, " seconds/lap");
  setVal("runner-time-b", 0, " seconds/lap");
  setVal("hare-jump-a", 0, " feet/jump");
  setVal("hare-jump-b", 0, " feet/jump");

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
  resetTrafficLights();
  clearTrafficTimes();
  document.getElementById("footprint-box").style.display = "none";
  document.getElementById("meeting-time").style.display = "none";
  document.getElementById("light-blink-box").style.display = "none";
  document.getElementById("solution-modal").style.display = "none";

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
  else if (currentTab === 1) startTrafficAnimation();
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
  const valueText = (valueElement.tagName === 'tspan' || valueElement.tagName === 'text') ? valueElement : valueElement.querySelector('tspan');
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

    const maxIndex = snaps.length - 1;
    nearestIndex = Math.min(nearestIndex, maxIndex);
    const snapX = snaps[nearestIndex];
    slider.setAttribute('transform', `translate(${snapX - initialX}, 0)`);

    let value = nearestIndex * multiplier;
    const maxValue = maxIndex * multiplier;
    value = Math.min(value, maxValue);
    if ((sliderId === 'white-hare-slider' || sliderId === 'brown-hare-slider') && value > 5) {
      value = 5;
    }

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

solutionBtn.addEventListener('click', () => {
  updateSolutionModal();
  document.getElementById("solution-modal").style.display = "block";
});

document.getElementById("close-solution-btn").addEventListener('click', () => {
  document.getElementById("solution-modal").style.display = "none";
});

function updateSolutionModal() {
  let val1, val2, unit, label1, label2, intro1, intro2, introUnit, answerText, seqLabel, compUnit;
  if (currentTab === 1) {
    val1 = trafficCycleA; val2 = trafficCycleB;
    unit = " seconds"; label1 = "Traffic Light A Cycle: "; label2 = "Traffic Light B Cycle: ";
    intro1 = "To find when both lights turn green";
    intro2 = "simultaneously, we need to find the";
    introUnit = "Least Common Multiple (LCM) of their cycle times.";
    seqLabel = "Light A turns green at: ";
    compUnit = " cycles";
    answerText = "Answer: Both lights turn green together after ";
  } else if (currentTab === 2) {
    val1 = runnerLap1; val2 = runnerLap2;
    unit = " seconds"; label1 = "Runner 1 Lap Time: "; label2 = "Runner 2 Lap Time: ";
    intro1 = "To find when both runners meet at the";
    intro2 = "starting line, we need to find the";
    introUnit = "Least Common Multiple (LCM) of their lap times.";
    seqLabel = "Runner 1 at starting point at: ";
    compUnit = " laps";
    answerText = "Answer: Both meet at the start after ";
  } else {
    val1 = whiteJump; val2 = brownJump;
    unit = " feet"; label1 = "White Hare Jump: "; label2 = "Brown Hare Jump: ";
    intro1 = "To find where both hares' footprints";
    intro2 = "match, we need to find the";
    introUnit = "Least Common Multiple (LCM) of their jump lengths.";
    seqLabel = "White Hare footprints at: ";
    compUnit = " jumps";
    answerText = "Answer: Footprints first match at ";
  }

  const lcm = getLCM(val1, val2);
  const getSeq = (v, name) => {
    let s = [0];
    for (let i = 1; i <= Math.min(5, lcm / v); i++) s.push(i * v);
    let label = (currentTab === 1) ? `Light ${name} turns green at: ` :
      (currentTab === 2) ? `Runner ${name} at starting point at: ` :
        `${name} Hare footprints at: `;
    return label + s.join(", ") + (lcm / v > 5 ? "..." : "");
  };

  const setT = (id, text) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.textContent = text;
  };

  setT("sol-intro-line1", intro1);
  setT("sol-intro-line2", intro2);
  setT("sol-intro-unit", introUnit);
  setT("sol-val-1", label1 + val1 + unit);
  setT("sol-val-2", label2 + val2 + unit);
  setT("sol-seq-1", getSeq(val1, currentTab === 3 ? "White" : (currentTab === 1 ? "A" : "1")));
  setT("sol-seq-2", getSeq(val2, currentTab === 3 ? "Brown" : (currentTab === 1 ? "B" : "2")));
  setT("sol-lcm", `LCM = ${lcm}${unit}`);
  setT("sol-ans-label", answerText);
  setT("sol-ans-unit", unit);
  setT("sol-ans-val", lcm);

  const name1 = currentTab === 1 ? "Light A" : (currentTab === 2 ? "Runner 1" : "White Hare");
  const name2 = currentTab === 1 ? "Light B" : (currentTab === 2 ? "Runner 2" : "Brown Hare");
  setT("sol-conclusion", `${name1} completed ${lcm / val1}${compUnit} • ${name2} completed ${lcm / val2}${compUnit}`);
}

window.addEventListener("load", () => {
  loadTab(3);

  // Snaps for Traffic Light Tab (Tab 1)
  const trafficSnaps = [200, 306, 413, 519, 625, 732, 838];
  initSlider("traffic-slider-a", trafficSnaps, "green-time-a", 203, 2, " seconds", (val) => {
    trafficCycleA = val;
    const desc = document.getElementById("green-desc-a");
    if (desc) desc.textContent = `Green for ${val / 2}s, then Red for ${val / 2}s`;
  });
  initSlider("traffic-slider-b", trafficSnaps, "green-time-b", 203, 2, " seconds", (val) => {
    trafficCycleB = val;
    const desc = document.getElementById("green-desc-b");
    if (desc) desc.textContent = `Green for ${val / 2}s, then Red for ${val / 2}s`;
  });

  // Snaps for Runner Tab (Tab 2)
  const runnerSnaps = [201, 307, 414, 520, 626, 733, 839];
  initSlider("runner-1-slider", runnerSnaps, "runner-time-a", 204, 2, " seconds/lap", (val) => {
    runnerLap1 = val;
  });
  initSlider("runner-2-slider", runnerSnaps, "runner-time-b", 204, 2, " seconds/lap", (val) => {
    runnerLap2 = val;
  });

  // Snaps for Hare Tab (Tab 3)
  const hareSnaps = [202, 308, 415, 521, 627, 734];
  initSlider("white-hare-slider", hareSnaps, "hare-jump-a", 205, 1, " feet/jump", (val) => {
    whiteJump = val;
  });
  initSlider("brown-hare-slider", hareSnaps, "hare-jump-b", 205, 1, " feet/jump", (val) => {
    brownJump = val;
  });
});

