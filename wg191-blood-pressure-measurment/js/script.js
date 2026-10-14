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

// Per-instrument ids. Each answer dashboard is plain HTML inside its own
// <foreignObject> in the master SVG (#dashboard / #dashboard-2); `panel` is
// its position in the 1920x1080 canvas, used to place the final sentence.
const LAYOUT = {
  aneroid: {
    group: 'dashboard',
    instructionGroup: 'i_text',
    illustrationGroups: ['illustration', 'meter'],
    selects: { systolic: 'systolic-select', diastolic: 'diastolic-select' },
    enterButton: 'enter-btn',
    answerButton: 'answer-btn',
    positive: { systolic: 'systolic-correct', diastolic: 'diastolic-correct' },
    negative: { systolic: 'systolic-wrong', diastolic: 'diastolic-wrong' },
    panel: { x: 1369, y: 161, w: 484, h: 699 },
    cuffBalloon: 'itext_2',
  },
  mercury: {
    group: 'dashboard-2',
    instructionGroup: 'i_text1',
    illustrationGroups: ['illustration1', 'meter1'],
    selects: { systolic: 'systolic-select-2', diastolic: 'diastolic-select-2' },
    enterButton: 'enter-btn-2',
    answerButton: 'answer-btn-2',
    positive: { systolic: 'systolic-correct-2', diastolic: 'diastolic-correct-2' },
    negative: { systolic: 'systolic-wrong-2', diastolic: 'diastolic-wrong-2' },
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

const finalFeedback = document.getElementById('final-feedback');
const btnBack = document.getElementById('btn-back');

const answerPopup = document.getElementById('answer-popup');
const answerBackdrop = document.getElementById('answer-backdrop');
const answerClose = document.getElementById('answer-close');
const answerSystolic = document.getElementById('answer-systolic');
const answerDiastolic = document.getElementById('answer-diastolic');
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

function setDashButtonsEnabled(layout, enabled) {
  byId(layout.enterButton).disabled = !enabled;
  byId(layout.answerButton).disabled = !enabled;
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

// The empty first option keeps the box blank (just the "mmHg" unit and the
// arrow from the artwork) until a value is picked.
function populateSelect(select, options) {
  select.innerHTML = '<option value="" selected hidden></option>';
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

function currentSelects() {
  const { selects } = currentLayout();
  return { systolic: byId(selects.systolic), diastolic: byId(selects.diastolic) };
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

  finalFeedback.style.left = `${(layout.panel.x / 1920) * 100}%`;
  finalFeedback.style.top = `${((layout.panel.y + layout.panel.h + 10) / 1080) * 100}%`;
  finalFeedback.style.width = `${(layout.panel.w / 1920) * 100}%`;

  const selects = currentSelects();
  populateSelect(selects.systolic, Object.keys(VALID_COMBOS).map(Number));
  populateSelect(selects.diastolic, Array.from(new Set(Object.values(VALID_COMBOS).flat())).sort((a, b) => a - b));
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
  Object.values(currentSelects()).forEach((select) => {
    select.value = '';
    select.disabled = true;
    select.classList.remove('is-correct', 'is-incorrect');
  });
  finalFeedback.textContent = '';
  finalFeedback.classList.add('hidden');
  const layout = currentLayout();
  hideGroup(layout.positive.systolic);
  hideGroup(layout.positive.diastolic);
  hideGroup(layout.negative.systolic);
  hideGroup(layout.negative.diastolic);
  setDashButtonsEnabled(layout, false);
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
  const selects = currentSelects();
  selects.systolic.disabled = false;
  selects.diastolic.disabled = false;
  setDashButtonsEnabled(currentLayout(), true);
  valueAnnouncer.textContent = 'Pressure at 0 millimeters of mercury. Enter your readings.';
  selects.systolic.focus();
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
  const { systolic: selectSystolic, diastolic: selectDiastolic } = currentSelects();
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
  answerSystolic.textContent = String(state.reading.systolic);
  answerDiastolic.textContent = String(state.reading.diastolic);
  openAnswer();
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

function isAnswerOpen() {
  return answerPopup.style.display !== 'none';
}

function openAnswer() {
  lastFocusedElement = byId(currentLayout().answerButton);
  answerPopup.style.display = '';
  document.addEventListener('keydown', handleOverlayKeydown);
  answerClose.focus();
}

function closeAnswer() {
  answerPopup.style.display = 'none';
  document.removeEventListener('keydown', handleOverlayKeydown);
  if (lastFocusedElement) lastFocusedElement.focus();
}

function handleOverlayKeydown(event) {
  if (event.key !== 'Escape') return;
  if (byId('insights').style.display !== 'none') closeInsights();
  else if (isAnswerOpen()) closeAnswer();
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
Object.values(LAYOUT).forEach((layout) => {
  byId(layout.enterButton).addEventListener('click', checkAnswers);
  byId(layout.answerButton).addEventListener('click', showSolution);
});

btnBack.addEventListener('click', showSelectionScreen);
answerClose.addEventListener('click', closeAnswer);
answerBackdrop.addEventListener('click', (event) => {
  if (event.target === answerBackdrop) closeAnswer();
});

/* ---------------------------------------------------------------------- */
/* Init                                                                     */
/* ---------------------------------------------------------------------- */

// Every group in the master SVG renders by default (it's a flat design export,
// not a state machine) — permanently hide the pieces this widget doesn't use:
// the Insights overlay (until opened) and duplicate/unused button artwork.
['insights', 'Group_1566', 'Group_2781'].forEach(hideGroup);

showSelectionScreen();
