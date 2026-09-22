'use strict';

/* ==========================================================================
   Determine The Blood Pressure — widget logic

   The visuals come from the master SVG inlined in index.html (the provided
   resources/assets/layout.svg, embedded verbatim). This file drives it: it
   shows/hides named groups by id to switch screens/states, attaches click +
   keyboard handlers directly to the SVG's own button/card groups, and
   overlays a few real controls (the two <select>s, the back button, the
   live pressure readout) positioned exactly on top of the matching artwork.

   The animated needle / mercury column still comes from the provided Lottie
   JSON (embedded via lottie-data.js) — that is the asset built for exactly
   that animation, sharing the same 1920x1080 coordinate space as layout.svg,
   so it is drawn in the same position on top of the (hidden) static
   "illustration"/"meter" groups from the master SVG.
   ========================================================================== */

const ANIMATION_DATA = {
  aneroid: window.LOTTIE_DATA.aneroid,
  mercury: window.LOTTIE_DATA.mercury,
};

const TOTAL_FRAMES = 250; // full 200 mmHg -> 0 mmHg sweep baked into every animation
const START_VALUE = 200;
const RELEASE_SPEED = 0.2; // slow, steady fall while listening (~5 mmHg/sec)
const QUICK_DROP_SPEED = 1.3; // faster fall once the tapping sound has stopped

// Valid systolic / diastolic combinations (from the storyboard's reading-range table).
const VALID_COMBOS = {
  90: [50],
  100: [50, 60],
  110: [50, 60, 70],
  120: [50, 60, 70, 80],
  130: [50, 60, 70, 80, 90],
  140: [50, 60, 70, 80, 90, 100],
  150: [50, 60, 70, 80, 90, 100, 110],
  160: [50, 60, 70, 80, 90, 100, 110, 120],
  170: [50, 60, 70, 80, 90, 100, 110, 120, 130],
  180: [50, 60, 70, 80, 90, 100, 110, 120, 130, 140],
};

const SYSTOLIC_BANDS = {
  90: 'moderately low', 100: 'moderately low', 110: 'slightly low', 120: 'normal',
  130: 'slightly high', 140: 'moderately high', 150: 'moderately high',
  160: 'very high', 170: 'very high', 180: 'very high',
};

const DIASTOLIC_BANDS = {
  50: 'moderately low', 60: 'moderately low', 70: 'slightly low', 80: 'normal',
  90: 'slightly high', 100: 'moderately high', 110: 'moderately high',
  120: 'very high', 130: 'very high', 140: 'very high',
};

// Pixel coordinates (in the master SVG's 1920x1080 space) of the bits of
// each instrument's dashboard that a real control needs to sit on top of.
// Measured directly from the inlined SVG via getBBox() — see src/README.md.
const LAYOUT = {
  aneroid: {
    group: 'dashboard',
    instructionGroup: 'i_text',
    illustrationGroups: ['illustration', 'meter'],
    enterGroup: 'Group_644',
    answerGroup: 'Group_647',
    positive: { systolic: 'Group_642', diastolic: 'Group_645' },
    negative: { systolic: 'Group_643', diastolic: 'Group_646' },
    placeholderGroups: ['mmHg-2', 'mmHg-3'],
    systolicBox: { x: 1501, y: 386, w: 220, h: 59 },
    diastolicBox: { x: 1501, y: 585, w: 220, h: 59 },
    panel: { x: 1369, y: 161, w: 484, h: 699 },
    cuffBalloon: 'itext_2',
  },
  mercury: {
    group: 'dashdoard_2',
    instructionGroup: 'i_text1',
    illustrationGroups: ['illustration1', 'meter1'],
    enterGroup: 'Group_6441',
    answerGroup: 'Group_6471',
    positive: { systolic: 'Group_6421', diastolic: 'Group_6451' },
    negative: { systolic: 'Group_6431', diastolic: 'Group_6461' },
    placeholderGroups: ['mmHg2', 'mmHg-22'],
    systolicBox: { x: 1448, y: 386, w: 220, h: 59 },
    diastolicBox: { x: 1448, y: 585, w: 220, h: 59 },
    panel: { x: 1315, y: 161, w: 484, h: 699 },
    cuffBalloon: 'Group_12301',
  },
};

const SOUND_REACTION_GROUP = 'sound_reaction';
const CARD_GROUPS = { aneroid: 'Group_1227', mercury: 'Group_1228' };
const HIGHLIGHT_GROUPS = { aneroid: 'Rectangle_228', mercury: 'Rectangle_229' };
const BTN_RESET = 'Group_277';
const BTN_RELEASE = 'uuid-53a68dd6-7f5a-4434-a157-6d78248a4686';
const BTN_INSIGHTS = 'Group_278';
const INSIGHTS_CLOSE = 'Group_1205';

/* ---------------------------------------------------------------------- */
/* State                                                                   */
/* ---------------------------------------------------------------------- */

const state = {
  instrument: null,
  reading: null, // { systolic, diastolic }
  phase: 'select', // select -> idle -> releasing -> done
  soundStarted: false,
  soundStopped: false,
};

let mainAnim = null;
let isMainAnimReady = false;
let rafId = null;
let lastFocusedElement = null;

/* ---------------------------------------------------------------------- */
/* Element references                                                     */
/* ---------------------------------------------------------------------- */

const lottieStage = document.getElementById('lottie-stage');
const liveReading = document.getElementById('live-reading');
const liveReadingValue = document.getElementById('live-reading-value');
const liveReadingLabel = document.getElementById('live-reading-label');
const valueAnnouncer = document.getElementById('value-announcer');

const selectSystolic = document.getElementById('select-systolic');
const selectDiastolic = document.getElementById('select-diastolic');
const finalFeedback = document.getElementById('final-feedback');
const btnBack = document.getElementById('btn-back');

// const overlaySolution = document.getElementById('overlay-solution');
const solutionSystolic = document.getElementById('solution-systolic');
const solutionDiastolic = document.getElementById('solution-diastolic');
const audio = document.getElementById('tap-audio');
const measurementComponent = document.getElementById('measurment-component');

/* ---------------------------------------------------------------------- */
/* Master-SVG group helpers                                                */
/* ---------------------------------------------------------------------- */

function byId(id) {
  return document.getElementById(id);
}

function showGroup(id) {
  const el = byId(id);
  if (el) el.style.display = '';
}

function hideGroup(id) {
  const el = byId(id);
  if (el) el.style.display = 'none';
}

function setGroupVisible(id, visible) {
  if (visible) showGroup(id);
  else hideGroup(id);
}

// Makes a decorative <g> from the master SVG behave like a real button:
// clickable, focusable, and operable with Enter/Space.
function wireSvgButton(id, handler) {
  const el = byId(id);
  if (!el) return;
  el.setAttribute('role', 'button');
  el.setAttribute('tabindex', '0');
  el.style.cursor = 'pointer';
  el.addEventListener('click', (event) => {
    if (el.getAttribute('aria-disabled') === 'true') return;
    handler(event);
  });
  el.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (el.getAttribute('aria-disabled') === 'true') return;
      handler(event);
    }
  });
}

function setSvgButtonEnabled(id, enabled) {
  const el = byId(id);
  if (!el) return;
  el.setAttribute('aria-disabled', enabled ? 'false' : 'true');
  el.style.opacity = enabled ? '' : '0.45';
  el.style.pointerEvents = enabled ? 'auto' : 'none';
  el.style.cursor = enabled ? 'pointer' : 'default';
  el.style.tabIndex = enabled ? '0' : '-1';
  el.setAttribute('tabindex', enabled ? '0' : '-1');
}

function positionOverlay(el, box) {
  el.style.left = `${(box.x / 1920) * 100}%`;
  el.style.top = `${(box.y / 1080) * 100}%`;
  el.style.width = `${(box.w / 1920) * 100}%`;
  el.style.height = `${(box.h / 1080) * 100}%`;
}

// The Release button's label is baked as real SVG text ("Release") — update
// it in place so the button reads "Pause"/"Resume" while it's actually doing
// that, instead of leaving stale text next to a changed aria-label.
function setReleaseLabel(text) {
  const tspan = byId('Release')?.querySelector('tspan');
  if (tspan) tspan.textContent = text;
}

/* ---------------------------------------------------------------------- */
/* Helpers                                                                 */
/* ---------------------------------------------------------------------- */

function pick(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function generateReading() {
  const systolicOptions = Object.keys(VALID_COMBOS).map(Number);
  const systolic = pick(systolicOptions);
  const diastolic = pick(VALID_COMBOS[systolic]);
  return { systolic, diastolic };
}

function bandSentence(systolic, diastolic) {
  const sysBand = SYSTOLIC_BANDS[systolic];
  const diaBand = DIASTOLIC_BANDS[diastolic];
  const comparison = sysBand === diaBand
    ? `Both the systolic and diastolic pressures are ${sysBand}.`
    : `The systolic pressure is ${sysBand} and the diastolic pressure is ${diaBand}.`;
  return `The blood pressure measured is ${systolic}/${diastolic} mmHg. ${comparison}`;
}

function populateSelect(select, options) {
  select.innerHTML = '<option value="" selected>mmHg</option>';
  options.forEach((value) => {
    const opt = document.createElement('option');
    opt.value = String(value);
    opt.textContent = String(value);
    select.appendChild(opt);
  });
}

function frameToValue(frame) {
  return START_VALUE * (1 - frame / TOTAL_FRAMES);
}

// lottie-web mutates the animationData object it is given (e.g. it tags assets),
// so every player needs its own copy of the shared embedded JSON.
function cloneAnimationData(data) {
  return typeof structuredClone === 'function' ? structuredClone(data) : JSON.parse(JSON.stringify(data));
}

function currentLayout() {
  return LAYOUT[state.instrument];
}

/* ---------------------------------------------------------------------- */
/* Lottie setup                                                            */
/* ---------------------------------------------------------------------- */

function loadMainAnimation(instrument) {
  if (mainAnim) {
    mainAnim.destroy();
    mainAnim = null;
  }
  isMainAnimReady = false;
  mainAnim = lottie.loadAnimation({
    container: lottieStage,
    renderer: 'svg',
    loop: false,
    autoplay: false,
    animationData: cloneAnimationData(ANIMATION_DATA[instrument]),
    rendererSettings: { preserveAspectRatio: 'none' },
  });
  // lottie-web replaces the container's content wholesale, so the readout
  // markup that lives inside #lottie-stage in index.html would be wiped out
  // on the very first load — put it back as a sibling instead.
  if (liveReading.parentElement !== lottieStage.parentElement) {
    lottieStage.parentElement.insertBefore(liveReading, lottieStage.nextSibling);
  }
  mainAnim.addEventListener('DOMLoaded', () => {
    mainAnim.goToAndStop(0, true);
    isMainAnimReady = true;
    if (state.phase === 'idle') enableRelease();
  });
  mainAnim.addEventListener('complete', onReleaseComplete);
}

/* ---------------------------------------------------------------------- */
/* Screen transitions                                                      */
/* ---------------------------------------------------------------------- */

function resetSelectionHighlight() {
  hideGroup(HIGHLIGHT_GROUPS.aneroid);
  hideGroup(HIGHLIGHT_GROUPS.mercury);
}

function showSelectionScreen() {
  state.phase = 'select';
  state.instrument = null;
  cancelAnimationFrame(rafId);
  audio.pause();
  if (mainAnim) mainAnim.pause();

  showGroup('home_tab');
  showGroup('itext');
  resetSelectionHighlight();
  showGroup(BTN_INSIGHTS);
  hideGroup(BTN_RESET);
  hideGroup(BTN_RELEASE);

  ['aneroid', 'mercury'].forEach((instrument) => {
    const layout = LAYOUT[instrument];
    hideGroup(layout.group);
    hideGroup(layout.instructionGroup);
    layout.illustrationGroups.forEach(hideGroup);
    hideGroup(layout.positive.systolic);
    hideGroup(layout.positive.diastolic);
    hideGroup(layout.negative.systolic);
    hideGroup(layout.negative.diastolic);
  });
  hideGroup(SOUND_REACTION_GROUP);

  btnBack.classList.add('hidden');
  selectSystolic.classList.add('hidden');
  selectDiastolic.classList.add('hidden');
  finalFeedback.classList.add('hidden');
  lottieStage.classList.add('hidden');
  liveReading.classList.add('hidden');
  measurementComponent.style.display = 'none';
  hideGroup('itext_2');
  hideGroup('Group_12301');
}

function selectInstrument(instrument) {
  state.instrument = instrument;
  measurementComponent.style.display = 'block';
  state.reading = generateReading();
  state.phase = 'idle';
  state.soundStarted = false;
  state.soundStopped = false;

  const layout = currentLayout();
  const other = LAYOUT[instrument === 'aneroid' ? 'mercury' : 'aneroid'];

  hideGroup('home_tab');
  hideGroup('itext');
  resetSelectionHighlight();

  showGroup(layout.group);
  showGroup(layout.instructionGroup);
  hideGroup(other.group);
  hideGroup(other.instructionGroup);
  layout.illustrationGroups.forEach(hideGroup); // replaced by the Lottie player
  other.illustrationGroups.forEach(hideGroup);
  hideGroup(layout.positive.systolic);
  hideGroup(layout.positive.diastolic);
  hideGroup(layout.negative.systolic);
  hideGroup(layout.negative.diastolic);
  hideGroup(SOUND_REACTION_GROUP);

  showGroup(BTN_RESET);
  showGroup(BTN_RELEASE);
  showGroup(BTN_INSIGHTS);
  showGroup(layout.cuffBalloon);
  hideGroup(other.cuffBalloon);
  btnBack.classList.remove('hidden');

  lottieStage.classList.remove('hidden');
  liveReading.classList.remove('hidden');
  loadMainAnimation(instrument);

  audio.pause();
  audio.currentTime = 0;
  liveReading.classList.remove('is-listening');
  liveReadingValue.textContent = '200';
  liveReadingLabel.textContent = 'Current pressure';

  positionOverlay(selectSystolic, layout.systolicBox);
  positionOverlay(selectDiastolic, layout.diastolicBox);
  finalFeedback.style.left = `${(layout.panel.x / 1920) * 100}%`;
  finalFeedback.style.top = `${((layout.panel.y + layout.panel.h + 10) / 1080) * 100}%`;
  finalFeedback.style.width = `${(layout.panel.w / 1920) * 100}%`;

  populateSelect(selectSystolic, Object.keys(VALID_COMBOS).map(Number));
  populateSelect(selectDiastolic, Array.from(new Set(Object.values(VALID_COMBOS).flat())).sort((a, b) => a - b));
  resetFormState();

  // Release stays disabled until loadMainAnimation's DOMLoaded handler fires
  // (see enableRelease) so a very fast click can't race the initial setup.
  disableRelease();
  setReleaseLabel('Release');
  valueAnnouncer.textContent = 'Pressure at 200 millimeters of mercury.';

  btnBack.focus();
}

function enableRelease() {
  setSvgButtonEnabled(BTN_RELEASE, true);
}

function disableRelease() {
  setSvgButtonEnabled(BTN_RELEASE, false);
}

function isReleaseEnabled() {
  return byId(BTN_RELEASE).getAttribute('aria-disabled') !== 'true';
}

function resetFormState() {
  selectSystolic.value = '';
  selectDiastolic.value = '';
  selectSystolic.disabled = true;
  selectDiastolic.disabled = true;
  selectSystolic.classList.remove('is-correct', 'is-incorrect');
  selectDiastolic.classList.remove('is-correct', 'is-incorrect');
  selectSystolic.classList.add('hidden');
  selectDiastolic.classList.add('hidden');
  finalFeedback.textContent = '';
  finalFeedback.classList.add('hidden');
  const layout = currentLayout();
  hideGroup(layout.positive.systolic);
  hideGroup(layout.positive.diastolic);
  hideGroup(layout.negative.systolic);
  hideGroup(layout.negative.diastolic);
  setSvgButtonEnabled(layout.enterGroup, false);
  setSvgButtonEnabled(layout.answerGroup, false);
  layout.placeholderGroups.forEach(showGroup);
}

/* ---------------------------------------------------------------------- */
/* Release / measuring logic                                               */
/* ---------------------------------------------------------------------- */

function startRelease() {
  if (state.phase !== 'idle' || !mainAnim || !isMainAnimReady) return;
  state.phase = 'releasing';
  hideGroup(currentLayout().cuffBalloon);
  byId(BTN_RELEASE).setAttribute('aria-label', 'Pause the falling pressure');
  setReleaseLabel('Pause');
  mainAnim.setSpeed(RELEASE_SPEED);
  mainAnim.play();
  rafId = requestAnimationFrame(watchRelease);
}

function pauseRelease() {
  if (state.phase !== 'releasing' || !mainAnim || mainAnim.isPaused) return;
  mainAnim.pause();
  if (state.soundStarted && !state.soundStopped) {
    audio.pause();
  }
  byId(BTN_RELEASE).setAttribute('aria-label', 'Resume the falling pressure');
  setReleaseLabel('Resume');
  liveReadingLabel.textContent = 'Paused at';
  valueAnnouncer.textContent = `Paused at ${liveReadingValue.textContent} millimeters of mercury.`;
}

function resumeRelease() {
  if (state.phase !== 'releasing' || !mainAnim || !mainAnim.isPaused) return;
  mainAnim.play();
  if (state.soundStarted && !state.soundStopped) {
    audio.play().catch(() => {});
  }
  byId(BTN_RELEASE).setAttribute('aria-label', 'Pause the falling pressure');
  setReleaseLabel('Pause');
  liveReadingLabel.textContent = 'Current pressure';
}

function handleReleaseClick() {
  if (state.phase === 'idle') {
    if (!isReleaseEnabled()) return;
    startRelease();
  } else if (state.phase === 'releasing') {
    if (mainAnim && mainAnim.isPaused) resumeRelease();
    else pauseRelease();
  }
}

function watchRelease() {
  if (!mainAnim || state.phase !== 'releasing') return;

  const frame = mainAnim.currentFrame;
  const value = frameToValue(frame);
  const { systolic, diastolic } = state.reading;

  liveReadingValue.textContent = Math.round(value);

  if (!state.soundStarted && value <= systolic && value > diastolic) {
    state.soundStarted = true;
    audio.currentTime = 0;
    audio.play().catch(() => {});
    liveReading.classList.add('is-listening');
    showGroup(SOUND_REACTION_GROUP);
    valueAnnouncer.textContent = 'Tapping sound started.';
  }

  if (state.soundStarted && !state.soundStopped && value <= diastolic) {
    state.soundStopped = true;
    audio.pause();
    liveReading.classList.remove('is-listening');
    hideGroup(SOUND_REACTION_GROUP);
    mainAnim.setSpeed(QUICK_DROP_SPEED);
    valueAnnouncer.textContent = 'Tapping sound stopped. Pressure dropping to zero.';
  }

  rafId = requestAnimationFrame(watchRelease);
}

function onReleaseComplete() {
  cancelAnimationFrame(rafId);
  state.phase = 'done';
  audio.pause();
  liveReading.classList.remove('is-listening');
  liveReadingValue.textContent = '0';
  liveReadingLabel.textContent = 'Current pressure';
  hideGroup(SOUND_REACTION_GROUP);

  disableRelease();
  byId(BTN_RELEASE).setAttribute('aria-label', 'Release (already used — tap Reset to try again)');
  setReleaseLabel('Release');
  selectSystolic.disabled = false;
  selectDiastolic.disabled = false;
  selectSystolic.classList.remove('hidden');
  selectDiastolic.classList.remove('hidden');
  const layout = currentLayout();
  setSvgButtonEnabled(layout.enterGroup, true);
  setSvgButtonEnabled(layout.answerGroup, true);
  layout.placeholderGroups.forEach(hideGroup); // the real <select>s take over these boxes
  valueAnnouncer.textContent = 'Pressure at 0 millimeters of mercury. Enter your readings.';
  selectSystolic.focus();
}

function resetMeasurement() {
  cancelAnimationFrame(rafId);
  audio.pause();
  audio.currentTime = 0;
  liveReading.classList.remove('is-listening');
  liveReadingValue.textContent = '200';
  liveReadingLabel.textContent = 'Current pressure';
  hideGroup(SOUND_REACTION_GROUP);
  showGroup(currentLayout().cuffBalloon);

  state.reading = generateReading();
  state.phase = 'idle';
  state.soundStarted = false;
  state.soundStopped = false;

  if (mainAnim) {
    mainAnim.setSpeed(RELEASE_SPEED);
    mainAnim.goToAndStop(0, true);
  }
  resetFormState();
  byId(BTN_RELEASE).setAttribute('aria-label', 'Release');
  setReleaseLabel('Release');
  enableRelease();
  valueAnnouncer.textContent = 'Pressure reset to 200 millimeters of mercury.';
}

/* ---------------------------------------------------------------------- */
/* Answer checking                                                         */
/* ---------------------------------------------------------------------- */

function checkAnswers() {
  if (state.phase !== 'done') return;
  if (!selectSystolic.value || !selectDiastolic.value) {
    finalFeedback.textContent = 'Please choose both a systolic and a diastolic reading.';
    finalFeedback.classList.remove('hidden');
    return;
  }

  const systolicValue = Number(selectSystolic.value);
  const diastolicValue = Number(selectDiastolic.value);
  const { systolic, diastolic } = state.reading;
  const layout = currentLayout();
  const systolicCorrect = systolicValue === systolic;
  const diastolicCorrect = diastolicValue === diastolic;

  selectSystolic.classList.toggle('is-correct', systolicCorrect);
  selectSystolic.classList.toggle('is-incorrect', !systolicCorrect);
  setGroupVisible(layout.positive.systolic, systolicCorrect);
  setGroupVisible(layout.negative.systolic, !systolicCorrect);

  selectDiastolic.classList.toggle('is-correct', diastolicCorrect);
  selectDiastolic.classList.toggle('is-incorrect', !diastolicCorrect);
  setGroupVisible(layout.positive.diastolic, diastolicCorrect);
  setGroupVisible(layout.negative.diastolic, !diastolicCorrect);

  if (systolicCorrect && diastolicCorrect) {
    finalFeedback.textContent = bandSentence(systolic, diastolic);
    finalFeedback.classList.remove('hidden');
    selectSystolic.disabled = true;
    selectDiastolic.disabled = true;
  } else {
    finalFeedback.textContent = '';
    finalFeedback.classList.add('hidden');
  }
}

function showSolution() {
  if (!state.reading || state.phase !== 'done') return;
  solutionSystolic.textContent = `${state.reading.systolic} mmHg`;
  solutionDiastolic.textContent = `${state.reading.diastolic} mmHg`;
  // openOverlay(overlaySolution, byId(currentLayout().answerGroup));
}

/* ---------------------------------------------------------------------- */
/* Overlay handling                                                        */
/* ---------------------------------------------------------------------- */

function openInsights() {
  lastFocusedElement = byId(BTN_INSIGHTS);
  showGroup('insights');
  // The master SVG normally paints beneath the Lottie/select/back-button
  // overlays; boost it above them while its own "insights" group is open so
  // that overlay actually covers the whole stage instead of hiding behind it.
  document.getElementById('master-svg').classList.add('is-on-top');
  document.addEventListener('keydown', handleOverlayKeydown);
  byId(INSIGHTS_CLOSE).focus();
}

function closeInsights() {
  hideGroup('insights');
  document.getElementById('master-svg').classList.remove('is-on-top');
  document.removeEventListener('keydown', handleOverlayKeydown);
  if (lastFocusedElement) lastFocusedElement.focus();
}

function openOverlay(overlay, trigger) {
  lastFocusedElement = trigger || document.activeElement;
  overlay.classList.remove('hidden');
  const closeBtn = overlay.querySelector('.overlay-close');
  if (closeBtn) closeBtn.focus();
  document.addEventListener('keydown', handleOverlayKeydown);
}

function closeOverlay(overlay) {
  overlay.classList.add('hidden');
  document.removeEventListener('keydown', handleOverlayKeydown);
  if (lastFocusedElement) lastFocusedElement.focus();
}

function handleOverlayKeydown(event) {
  if (event.key !== 'Escape') return;
  if (byId('insights').style.display !== 'none') closeInsights();
  // if (!overlaySolution.classList.contains('hidden')) closeOverlay(overlaySolution);
}

/* ---------------------------------------------------------------------- */
/* Event wiring                                                            */
/* ---------------------------------------------------------------------- */

wireSvgButton(CARD_GROUPS.aneroid, () => selectInstrument('aneroid'));
wireSvgButton(CARD_GROUPS.mercury, () => selectInstrument('mercury'));

byId(CARD_GROUPS.aneroid).addEventListener('mouseenter', () => showGroup(HIGHLIGHT_GROUPS.aneroid));
byId(CARD_GROUPS.aneroid).addEventListener('mouseleave', () => hideGroup(HIGHLIGHT_GROUPS.aneroid));
byId(CARD_GROUPS.aneroid).addEventListener('focus', () => showGroup(HIGHLIGHT_GROUPS.aneroid));
byId(CARD_GROUPS.aneroid).addEventListener('blur', () => hideGroup(HIGHLIGHT_GROUPS.aneroid));
byId(CARD_GROUPS.mercury).addEventListener('mouseenter', () => showGroup(HIGHLIGHT_GROUPS.mercury));
byId(CARD_GROUPS.mercury).addEventListener('mouseleave', () => hideGroup(HIGHLIGHT_GROUPS.mercury));
byId(CARD_GROUPS.mercury).addEventListener('focus', () => showGroup(HIGHLIGHT_GROUPS.mercury));
byId(CARD_GROUPS.mercury).addEventListener('blur', () => hideGroup(HIGHLIGHT_GROUPS.mercury));

wireSvgButton(BTN_RESET, resetMeasurement);
wireSvgButton(BTN_RELEASE, handleReleaseClick);
wireSvgButton(BTN_INSIGHTS, openInsights);
wireSvgButton(INSIGHTS_CLOSE, closeInsights);
wireSvgButton(LAYOUT.aneroid.enterGroup, checkAnswers);
wireSvgButton(LAYOUT.mercury.enterGroup, checkAnswers);
wireSvgButton(LAYOUT.aneroid.answerGroup, showSolution);
wireSvgButton(LAYOUT.mercury.answerGroup, showSolution);

btnBack.addEventListener('click', showSelectionScreen);
// document.getElementById('close-solution').addEventListener('click', () => closeOverlay(overlaySolution));
// overlaySolution.addEventListener('click', (event) => {
//   if (event.target === overlaySolution) closeOverlay(overlaySolution);
// });

/* ---------------------------------------------------------------------- */
/* Init                                                                     */
/* ---------------------------------------------------------------------- */

// Every group in the master SVG renders by default (it's a flat design export,
// not a state machine) — permanently hide the pieces this widget doesn't use:
// the pre-baked "open option list" art (native <select>s handle that instead),
// the fixed-value "wrong answer" demo art (tied to one specific example, not
// arbitrary readings), duplicate/unused button artwork, and "Layer_20" — an
// Illustrator pasteboard layer that turned out to hold an entire leftover
// duplicate "Answer" panel (baked to the 120/80 worked example) not used by
// any screen here.
['insights', 'dropdown', 'dropdown1', 'drop_down_2', 'dropdown2a', 'wrong_answer', 'wrong_feed', 'Group_1566', 'Group_2781', 'Layer_20',
  // demo values (150 / 60) baked into each dashboard's dropdown boxes
  '_150', '_60-2', '_150-21', '_60-21']
  .forEach(hideGroup);

showSelectionScreen();
