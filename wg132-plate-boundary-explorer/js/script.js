
let currentPlate = null;
let currentPlateIndex = -1; // nothing selected initially
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

const convergetInsight = document.getElementById('insights-convergent');
const divergentInsight = document.getElementById('insights-divergent');
const transformInsight = document.getElementById('insights-transform');

const insightsButton = document.getElementById('button-insights');
const closeInsights = document.querySelectorAll('.close-insights');
const congratsDiv = document.getElementById('congrats-div');

const valueEls = document.querySelectorAll(".making-value");

const lottieMap = {
  convergent: {
    container: document.getElementById('convergent-lottie'),
    path: './assets/JSON/convergent.json',
    instance: null
  },
  divergent: {
    container: document.getElementById('divergent-lottie'),
    path: './assets/JSON/divergent.json',
    instance: null
  },
  transform: {
    container: document.getElementById('transform-lottie'),
    path: './assets/JSON/transform.json',
    instance: null
  }
};

const insights = {
  "convergent-plate": document.getElementById('insights-convergent'),
  "divergent-plate": document.getElementById('insights-divergent'),
  "transform-plate": document.getElementById('insights-transform')
};

const allInsights = Object.values(insights);

closeInsights.forEach(btn => {
  btn.addEventListener("click", () => {
    allInsights.forEach(el => el.style.display = 'none');
    resetPlateBtn.style.display = 'block';
  });
});

insightsButton.addEventListener("click", () => {
  // hide all first
  allInsights.forEach(el => el.style.display = 'none');
  resetPlateBtn.style.display = 'none';
  // show only current
  if (currentPlate && insights[currentPlate]) {
    insights[currentPlate].style.display = 'block';
  }
});

function initLotties() {
  Object.keys(lottieMap).forEach(key => {
    const item = lottieMap[key];

    if (!item.container) return;

    item.instance = lottie.loadAnimation({
      container: item.container,
      renderer: 'svg',
      loop: false,
      autoplay: false, // ❗ important
      path: item.path,
      rendererSettings: {
        hideOnTransparent: false,
        preserveAspectRatio: 'xMidYMid meet'
      }
    });

    // Keep last frame after play
    item.instance.addEventListener('complete', () => {
      item.instance.goToAndStop(item.instance.totalFrames - 1, true);
    });
  });
}

function playLottie(type) {
  const item = lottieMap[type];
  if (!item || !item.instance) return;

  attachProgressToLottie(type); // 👈 attach progress

  item.instance.stop(); // reset
  item.instance.play();
}

document.addEventListener('DOMContentLoaded', function () {

  initLotties();

  plates.forEach((el, index) => {
    el.addEventListener("click", function () {
      currentPlate = this.dataset.value; // get data-value
      homePage.style.display = 'none';
      homeIText.style.display = 'none';
      buttons.style.display = 'block';
      resetPlateBtn.style.display = 'block';
      insightsButton.style.display = 'block';

      // First hide all related sections (optional but recommended)
      // document.querySelectorAll('[id]').forEach(item => {
      //   item.style.display = 'none';
      // });

      currentPlateIndex = index;
      isCongratsVisible = false;

      showPlate(currentPlate);
    });
  });
});

function showPlate(value) {
  const prefix = value.replace('-plate', '');

  // hide all
  plates.forEach(p => {
    const pPrefix = p.dataset.value.replace('-plate', '');
    document.querySelectorAll(`[id^="${pPrefix}"]`).forEach(el => {
      el.style.display = 'none';
    });
  });

  // show current
  document.querySelectorAll(`[id^="${prefix}"]`).forEach(el => {
    el.style.display = 'block';
  });

  // reset lottie
  Object.values(lottieMap).forEach(item => {
    if (item.instance) item.instance.goToAndStop(0);
  });

  // reset push buttons fill and control buttons state
  btnFill.forEach(path => {
    path.style.fill = '#680303';
  });
  resetPlateBtn.style.opacity = 0.3;
  resetPlateBtn.style.cursor = 'auto';
  nextBtn.style.opacity = 0.3;
  nextBtn.style.cursor = 'auto';
};

function attachProgressToLottie(type) {
  const item = lottieMap[type];
  if (!item || !item.instance) return;

  const anim = item.instance;

  anim.addEventListener("enterFrame", () => {
    const progress = anim.currentFrame / anim.totalFrames;
    const value = Math.floor(progress * 101);

    valueEls.forEach(el => {
      el.textContent = `${value}%`;
    });
  });
};

homeBtn.addEventListener("click", function () {
  homePage.style.display = 'block';
  homeIText.style.display = 'block';
  buttons.style.display = 'none';
  btnFill.forEach(path => {
    path.style.fill = '#680303';
  });
  resetPlateBtn.style.opacity = 0.3;
  resetPlateBtn.style.cursor = 'auto';
  nextBtn.style.opacity = 0.3;
  nextBtn.style.cursor = 'auto';

  congratsDiv.style.display = 'none';
  isCongratsVisible = false;
  currentPlateIndex = -1;

  if (currentPlate) {
    const prefix = currentPlate.replace('-plate', '');

    document.querySelectorAll(`[id^="${prefix}"]`).forEach(item => {
      item.style.display = 'none';
    });
  }

  currentPlate = null; // ✅ reset after use
});

pushButtons.forEach(btn => {
  btn.addEventListener("click", function () {

    // 🎯 Fill only clicked button
    this.querySelectorAll(".btnFill").forEach(path => {
      path.style.fill = '#d60000';
    });

    // UI updates
    resetPlateBtn.style.opacity = 1;
    resetPlateBtn.style.cursor = 'pointer';
    nextBtn.style.opacity = 1;
    nextBtn.style.cursor = 'pointer';

    // 🎯 Play correct lottie based on current plate
    if (currentPlate) {
      const type = currentPlate.replace('-plate', '');
      playLottie(type);
    }

  });
});

nextBtn.addEventListener("click", () => {

  // STEP 1: If congrats not shown → show it
  if (!isCongratsVisible) {
    congratsDiv.style.display = 'block';
    isCongratsVisible = true;
    resetPlateBtn.style.display = 'none';
    insightsButton.style.display = 'none';
    return;
  }

  resetPlateBtn.style.display = 'block';
  insightsButton.style.display = 'block';
  // STEP 2: If already shown → go to next plate
  congratsDiv.style.display = 'none';
  isCongratsVisible = false;

  currentPlateIndex++;
  console.log(currentPlateIndex, plates.length)
  // loop or stop at end
  if (currentPlateIndex >= plates.length) {
    currentPlateIndex = 0; // or return;
  }

  const nextPlate = plates[currentPlateIndex];
  const value = nextPlate.dataset.value;

  currentPlate = value;
  showPlate(value);

});

resetPlateBtn.addEventListener("click", () => {

  if (!currentPlate) return;

  btnFill.forEach(path => {
    path.style.fill = '#680303';
  });

  const type = currentPlate.replace('-plate', '');
  const item = lottieMap[type];

  if (!item || !item.instance) return;

  item.instance.stop();          // stops animation
  item.instance.goToAndStop(0);  // reset to first frame

});