
let currentPlate = null;
let currentPlateIndex = -1;
let isCongratsVisible = false;

const homePage = document.getElementById('home');
const gamePage = document.getElementById('game');
const plates = document.querySelectorAll('.plates');
const homeIText = document.getElementById('home-itext');
const buttons = document.getElementById('buttons');
const resetPlateBtn = document.getElementById('reset-plates');
const nextBtn = document.getElementById('next-btn');
const homeBtn = document.getElementById('home-btn');
const btnFill = document.querySelectorAll('.btnFill');
const pushButtons = document.querySelectorAll('.push-button');
const valueEls = document.querySelectorAll(".making-value");
const progressRects = document.querySelectorAll(".progressRect");
const PROGRESS_MAX_W = 483;

const insights = {
  "convergent-plate": document.getElementById('insights-convergent'),
  "divergent-plate": document.getElementById('insights-divergent'),
  "transform-plate": document.getElementById('insights-transform')
};
const allInsights = Object.values(insights);
const insightsButton = document.getElementById('button-insights');
const closeInsights = document.querySelectorAll('.close-insights');
const congratsDiv = document.getElementById('congrats-div');

// --- Helper for Next/Reset Button Logic ---
function setControlButtons(enabled) {
  if (enabled) {
    nextBtn.style.opacity = 1;
    nextBtn.style.cursor = 'pointer';
    nextBtn.style.pointerEvents = 'auto';
    resetPlateBtn.style.opacity = 1;
    resetPlateBtn.style.cursor = 'pointer';
    resetPlateBtn.style.pointerEvents = 'auto';
  } else {
    nextBtn.style.opacity = 0.3;
    nextBtn.style.cursor = 'default';
    nextBtn.style.pointerEvents = 'none';
    resetPlateBtn.style.opacity = 0.3;
    resetPlateBtn.style.cursor = 'default';
    resetPlateBtn.style.pointerEvents = 'none';
  }
}

// Center the % values
valueEls.forEach(el => {
  const parentText = el.closest('text') || el.parentElement;
  if (parentText && parentText.tagName === 'text') {
    parentText.setAttribute('text-anchor', 'middle');
    parentText.setAttribute('transform', 'translate(1408.5 695)');
    el.setAttribute('x', '0');
  }
});

const lottieMap = {
  convergent: { container: document.getElementById('convergent-lottie'), path: './assets/JSON/convergent.json', instance: null },
  divergent: { container: document.getElementById('divergent-lottie'), path: './assets/JSON/divergent.json', instance: null },
  transform: { container: document.getElementById('transform-lottie'), path: './assets/JSON/transform.json', instance: null }
};

function initLotties() {
  Object.keys(lottieMap).forEach(key => {
    const item = lottieMap[key];
    if (!item.container) return;
    item.instance = lottie.loadAnimation({
      container: item.container,
      renderer: 'svg',
      loop: false,
      autoplay: false,
      path: item.path
    });

    item.instance.addEventListener('complete', () => {
      item.instance.goToAndStop(item.instance.totalFrames - 1, true);
      pushButtons.forEach(btn => {
        btn.style.filter = "blur(3px)";
        btn.style.pointerEvents = "none";
        btn.querySelectorAll(".btnFill").forEach(path => { path.style.fill = '#680303'; });
      });
    });
    attachProgressToLottie(key);
  });
}

function attachProgressToLottie(type) {
  const item = lottieMap[type];
  const anim = item.instance;
  anim.addEventListener("enterFrame", () => {
    const progress = anim.currentFrame / anim.totalFrames;
    const value = Math.floor(progress * 100);
    valueEls.forEach(el => { el.textContent = `${value}%`; });
    progressRects.forEach(r => { r.setAttribute('width', progress * PROGRESS_MAX_W); });
  });
}

function showPlate(value) {
  const prefix = value.replace('-plate', '');
  plates.forEach(p => {
    const pPrefix = p.dataset.value.replace('-plate', '');
    document.querySelectorAll(`[id^="${pPrefix}"]`).forEach(el => { el.style.display = 'none'; });
  });
  document.querySelectorAll(`[id^="${prefix}"]`).forEach(el => { el.style.display = 'block'; });

  Object.values(lottieMap).forEach(item => { if (item.instance) item.instance.goToAndStop(0, true); });
  btnFill.forEach(path => { path.style.fill = '#680303'; });

  // Lock controls on start
  setControlButtons(false);
  resetProgress();
}

function resetProgress() {
  progressRects.forEach(r => r.setAttribute('width', '0'));
  valueEls.forEach(el => { el.textContent = '0%'; });
  pushButtons.forEach(btn => {
    btn.style.filter = "none";
    btn.style.pointerEvents = "auto";
  });
}

// --- Event Listeners ---

document.addEventListener('DOMContentLoaded', function () {
  initLotties();
  plates.forEach((el, index) => {
    el.addEventListener("click", function () {
      currentPlate = this.dataset.value;
      currentPlateIndex = index;
      homePage.style.display = 'none';
      homeIText.style.display = 'none';
      buttons.style.display = 'block';
      insightsButton.style.display = 'block';
      showPlate(currentPlate);
    });
  });
});

pushButtons.forEach(btn => {
  btn.addEventListener("click", function () {
    // Unlock next/reset when user interacts
    setControlButtons(true);

    if (currentPlate) {
      const type = currentPlate.replace('-plate', '');
      const anim = lottieMap[type].instance;
      if (anim) {
        if (anim.currentFrame >= anim.totalFrames - 1) {
          anim.goToAndStop(0, true);
          anim.play();
        } else {
          anim.isPaused ? anim.play() : anim.pause();
        }
        this.querySelectorAll(".btnFill").forEach(path => {
          path.style.fill = (!anim.isPaused) ? '#d60000' : '#680303';
        });
      }
    }
  });
});

nextBtn.addEventListener("click", function () {
  // Standard safety check
  if (nextBtn.style.pointerEvents === 'none') return;

  resetPlateBtn.style.display = 'block';

  currentPlateIndex++;
  if (currentPlateIndex >= plates.length) currentPlateIndex = 0;
  currentPlate = plates[currentPlateIndex].dataset.value;
  showPlate(currentPlate);
});

resetPlateBtn.addEventListener("click", function () {
  if (resetPlateBtn.style.pointerEvents === 'none') return;

  const type = currentPlate.replace('-plate', '');
  const item = lottieMap[type];
  if (item && item.instance) {
    item.instance.stop();
    item.instance.goToAndStop(0, true);
  }
  resetProgress(); // Restores Push buttons blurness and clickability
  btnFill.forEach(path => { path.style.fill = '#680303'; });
});

// Original Insight Logic
insightsButton.addEventListener("click", () => {
  allInsights.forEach(el => el.style.display = 'none');
  if (currentPlate && insights[currentPlate]) {
    insights[currentPlate].style.display = 'block';
    resetPlateBtn.style.display = 'none';
  }
});

closeInsights.forEach(btn => {
  btn.addEventListener("click", () => {
    allInsights.forEach(el => el.style.display = 'none');
    resetPlateBtn.style.display = 'block';
  });
});

homeBtn.addEventListener("click", function () {
  window.location.reload();
});