
// let currentPlate = null;
// let currentPlateIndex = -1; // nothing selected initially
// let isCongratsVisible = false;

// const homePage = document.getElementById('home');
// const gamePage = document.getElementById('game');
// const plates = document.querySelectorAll('.plates');

// const homeIText = document.getElementById('home-itext');

// const buttons = document.getElementById('buttons');
// const resetPlateBtn = document.getElementById('reset-plates');
// const nextBtn = document.getElementById('next-btn');
// const homeBtn = document.getElementById('home-btn');

// const btnFill = document.querySelectorAll('.btnFill');
// const pushButtons = document.querySelectorAll('.push-button');

// const convergetInsight = document.getElementById('insights-convergent');
// const divergentInsight = document.getElementById('insights-divergent');
// const transformInsight = document.getElementById('insights-transform');

// const insightsButton = document.getElementById('button-insights');
// const closeInsights = document.querySelectorAll('.close-insights');
// const congratsDiv = document.getElementById('congrats-div');

// const valueEls = document.querySelectorAll(".making-value");

// // Center the % values
// valueEls.forEach(el => {
//   const parentText = el.closest('text') || el.parentElement;
//   if (parentText && parentText.tagName === 'text') {
//     parentText.setAttribute('text-anchor', 'middle');
//     parentText.setAttribute('transform', 'translate(1408.5 695)');
//     el.setAttribute('x', '0');
//   }
// });

// const lottieMap = {
//   convergent: {
//     container: document.getElementById('convergent-lottie'),
//     path: './assets/JSON/convergent.json',
//     instance: null
//   },
//   divergent: {
//     container: document.getElementById('divergent-lottie'),
//     path: './assets/JSON/divergent.json',
//     instance: null
//   },
//   transform: {
//     container: document.getElementById('transform-lottie'),
//     path: './assets/JSON/transform.json',
//     instance: null
//   }
// };

// const insights = {
//   "convergent-plate": document.getElementById('insights-convergent'),
//   "divergent-plate": document.getElementById('insights-divergent'),
//   "transform-plate": document.getElementById('insights-transform')
// };

// const allInsights = Object.values(insights);

// closeInsights.forEach(btn => {
//   btn.addEventListener("click", () => {
//     allInsights.forEach(el => el.style.display = 'none');
//     resetPlateBtn.style.display = 'block';
//   });
// });

// insightsButton.addEventListener("click", () => {
//   // hide all first
//   allInsights.forEach(el => el.style.display = 'none');
//   resetPlateBtn.style.display = 'none';
//   // show only current
//   if (currentPlate && insights[currentPlate]) {
//     insights[currentPlate].style.display = 'block';
//   }
// });

// function initLotties() {
//   Object.keys(lottieMap).forEach(key => {
//     const item = lottieMap[key];

//     if (!item.container) return;

//     item.instance = lottie.loadAnimation({
//       container: item.container,
//       renderer: 'svg',
//       loop: false,
//       autoplay: false, // ❗ important
//       path: item.path,
//       rendererSettings: {
//         hideOnTransparent: false,
//         preserveAspectRatio: 'xMidYMid meet'
//       }
//     });

//     // Keep last frame after play
//     item.instance.addEventListener('complete', () => {
//       item.instance.goToAndStop(item.instance.totalFrames - 1, true);

//       // Blur and disable button on complete
//       pushButtons.forEach(btn => {
//         btn.style.filter = "blur(3px)";
//         btn.style.pointerEvents = "none";
//         // Reset fill so it doesn't stay red
//         btn.querySelectorAll(".btnFill").forEach(path => {
//           path.style.fill = '#680303';
//         });
//       });
//     });

//     attachProgressToLottie(key);
//   });
// }

// function toggleLottie(type) {
//   const item = lottieMap[type];
//   if (!item || !item.instance) return;

//   const anim = item.instance;

//   if (anim.currentFrame >= anim.totalFrames - 1 && anim.totalFrames > 0) {
//     // If it reached the end, start over
//     anim.goToAndStop(0, true);
//     anim.play();
//   } else if (anim.isPaused) {
//     anim.play();
//   } else {
//     anim.pause();
//   }
// }

// document.addEventListener('DOMContentLoaded', function () {

//   initLotties();

//   plates.forEach((el, index) => {
//     el.addEventListener("click", function () {
//       currentPlate = this.dataset.value; // get data-value
//       homePage.style.display = 'none';
//       homeIText.style.display = 'none';
//       buttons.style.display = 'block';
//       resetPlateBtn.style.display = 'block';
//       insightsButton.style.display = 'block';

//       // First hide all related sections (optional but recommended)
//       // document.querySelectorAll('[id]').forEach(item => {
//       //   item.style.display = 'none';
//       // });

//       currentPlateIndex = index;
//       isCongratsVisible = false;

//       showPlate(currentPlate);
//     });
//   });
// });

// function showPlate(value) {
//   const prefix = value.replace('-plate', '');

//   // hide all
//   plates.forEach(p => {
//     const pPrefix = p.dataset.value.replace('-plate', '');
//     document.querySelectorAll(`[id^="${pPrefix}"]`).forEach(el => {
//       el.style.display = 'none';
//     });
//   });

//   // show current
//   document.querySelectorAll(`[id^="${prefix}"]`).forEach(el => {
//     el.style.display = 'block';
//   });

//   // reset lottie
//   Object.values(lottieMap).forEach(item => {
//     if (item.instance) item.instance.goToAndStop(0);
//   });

//   // reset push buttons fill and control buttons state
//   btnFill.forEach(path => {
//     path.style.fill = '#680303';
//   });
//   resetPlateBtn.style.opacity = 0.3;
//   resetPlateBtn.style.cursor = 'auto';
//   nextBtn.style.opacity = 0.3;
//   nextBtn.style.cursor = 'auto';

//   // reset progress bar
//   resetProgress();
// };

// const progressGroups = document.querySelectorAll(".progressGroup");
// const progressRects = document.querySelectorAll(".progressRect");
// const PROGRESS_MAX_W = 483; // 468px track + 2×7.5 rounded caps

// function resetProgress() {
//   progressRects.forEach(r => r.setAttribute('width', '0'));
//   valueEls.forEach(el => { el.textContent = '0%'; });

//   // Reactivate push button
//   pushButtons.forEach(btn => {
//     btn.style.filter = "none";
//     btn.style.pointerEvents = "auto";
//   });
// }

// function attachProgressToLottie(type) {
//   const item = lottieMap[type];
//   if (!item || !item.instance) return;

//   const anim = item.instance;

//   anim.addEventListener("enterFrame", () => {
//     const progress = anim.currentFrame / anim.totalFrames;
//     const value = Math.floor(progress * 101);

//     // update % text
//     valueEls.forEach(el => { el.textContent = `${value}%`; });

//     // update bar width (grows left → right)
//     progressRects.forEach(r => {
//       r.setAttribute('width', progress * PROGRESS_MAX_W);
//     });
//   });
// }

// homeBtn.addEventListener("click", function () {
//   homePage.style.display = 'block';
//   homeIText.style.display = 'block';
//   buttons.style.display = 'none';
//   btnFill.forEach(path => {
//     path.style.fill = '#680303';
//   });
//   resetPlateBtn.style.opacity = 0.3;
//   resetPlateBtn.style.cursor = 'auto';
//   nextBtn.style.opacity = 0.3;
//   nextBtn.style.cursor = 'auto';

//   congratsDiv.style.display = 'none';
//   isCongratsVisible = false;
//   currentPlateIndex = -1;

//   if (currentPlate) {
//     const prefix = currentPlate.replace('-plate', '');

//     document.querySelectorAll(`[id^="${prefix}"]`).forEach(item => {
//       item.style.display = 'none';
//     });
//   }

//   currentPlate = null; // ✅ reset after use
// });

// pushButtons.forEach(btn => {
//   btn.addEventListener("click", function () {

//     // 🎯 Fill only clicked button
//     this.querySelectorAll(".btnFill").forEach(path => {
//       path.style.fill = '#d60000';
//     });

//     // UI updates
//     resetPlateBtn.style.opacity = 1;
//     resetPlateBtn.style.cursor = 'pointer';
//     nextBtn.style.opacity = 1;
//     nextBtn.style.cursor = 'pointer';

//     // 🎯 Play/Pause correct lottie based on current plate
//     if (currentPlate) {
//       const type = currentPlate.replace('-plate', '');
//       toggleLottie(type);

//       // Toggle button color based on paused state
//       const item = lottieMap[type];
//       const anim = item ? item.instance : null;
//       this.querySelectorAll(".btnFill").forEach(path => {
//         path.style.fill = (anim && !anim.isPaused && anim.currentFrame < anim.totalFrames - 1) ? '#d60000' : '#680303';
//       });
//     }

//   });
// });

// nextBtn.addEventListener("click", () => {
//   resetPlateBtn.style.display = 'block';
//   insightsButton.style.display = 'block';

//   congratsDiv.style.display = 'none';
//   isCongratsVisible = false;

//   currentPlateIndex++;
//   console.log(currentPlateIndex, plates.length)
//   // loop back to first plate if at the end
//   if (currentPlateIndex >= plates.length) {
//     currentPlateIndex = 0;
//   }

//   const nextPlate = plates[currentPlateIndex];
//   const value = nextPlate.dataset.value;

//   currentPlate = value;
//   showPlate(value);
// });

// resetPlateBtn.addEventListener("click", () => {

//   if (!currentPlate) return;

//   btnFill.forEach(path => {
//     path.style.fill = '#680303';
//   });

//   const type = currentPlate.replace('-plate', '');
//   const item = lottieMap[type];

//   if (!item || !item.instance) return;

//   item.instance.stop();          // stops animation
//   item.instance.goToAndStop(0);  // reset to first frame

//   // reset progress bar
//   resetProgress();

// });