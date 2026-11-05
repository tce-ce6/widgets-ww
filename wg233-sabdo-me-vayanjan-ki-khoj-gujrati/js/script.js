// In Electron with nodeIntegration, the UMD build of lottie assigns itself to
// module.exports instead of window.lottie, so pick it up from there.
if (
  !window.lottie &&
  typeof module === 'object' &&
  module &&
  module.exports &&
  typeof module.exports.loadAnimation === 'function'
) {
  window.lottie = module.exports;
}

// Words from the storyboard (gu_gu_2_wg233_Storyboard.docx): 3 rounds of 7 words.
const ROUNDS = [
  { "શ્ર": ["આશ્રમ", "શ્રીકૃષ્ણ", "શ્રમ"], "ક્ષ": ["વૃક્ષ", "શિક્ષક"], "જ્ઞ": ["યજ્ઞ", "વિજ્ઞાન"] },
  { "શ્ર": ["પરિશ્રમ", "શ્રાવણ"], "ક્ષ": ["રક્ષા", "ક્ષમા", "પરીક્ષા"], "જ્ઞ": ["યજ્ઞશાળા", "આજ્ઞા"] },
  { "શ્ર": ["શ્રીફળ", "મિશ્ર"], "ક્ષ": ["અક્ષર", "ક્ષણ"], "જ્ઞ": ["પ્રતિજ્ઞા", "જ્ઞાન", "સંજ્ઞા"] }
];

const TOTAL_WORDS = ROUNDS.reduce((sum, round) => sum + Object.values(round).flat().length, 0);

const HINT_WRONG = 'આ શબ્દ ધ્યાનથી જુઓ — તેમાં કયો જોડાક્ષર છુપાયેલો છે?';
const HINT_SHOW_ANSWER = 'સાચી ગોઠવણ જુઓ. પછીના રાઉન્ડમાં જાતે પ્રયત્ન કરો.';
const HINT_HELP = 'શરૂ કરવા માટે ઉપરના શબ્દ પર આંગળી કે માઉસ દબાવી રાખો અને નીચે સાચા ખાના સુધી ખેંચી જાઓ.';

// Layout in XD pixels
const SVG_NS = 'http://www.w3.org/2000/svg';
const CHIP_SLOTS = [0, 216, 441, 666, 891, 1107, 1320]; // Cloud offsets, left to right
const CHIP_Y = -28; // The design svg sits 28px lower than the XD clouds
const CHIP_TEXT = { x: 302, y: 356, maxWidth: 176 };
const BOARD_HIT = [ // Whole easel face and tab, per board
  { x: 180, y: 389, w: 451, h: 374 },
  { x: 735, y: 389, w: 451, h: 374 },
  { x: 1285, y: 389, w: 451, h: 374 }
];
const WORD_ROW = { x: 406, w: 325, h: 54, r: 14, top: 523, step: 68, textDrop: 39 };
const PROGRESS_FILL_WIDTH = 331;
const HINT_MIN_WIDTH = 615;
const HINT_PADDING = 60;
const DRAG_THRESHOLD = 8; // Screen pixels before a press counts as a drag
const WRONG_FEEDBACK_MS = 600;

const stage = document.getElementById('stage');
const chipsLayer = document.getElementById('chips');
const boards = [...document.querySelectorAll('.board')];
const hint = document.getElementById('hint');
const hintBox = document.getElementById('hint-box');
const hintText = document.getElementById('hint-text');
const endBanner = document.getElementById('end-banner');
const roundCount = document.getElementById('round-count');
const progressFill = document.getElementById('progress-fill');
const showBtn = document.getElementById('show-btn');
const nextBtn = document.getElementById('next-btn');
const replayBtn = document.getElementById('replay-btn');
const helpBtn = document.getElementById('help-btn');
const burstLayer = document.getElementById('burst-layer');

let roundIndex = 0;
let placedWords = 0;
let chipsLeft = 0;
let armedChip = null;
let drag = null;
let hintKind = null;
let burstAnim = null;
let confettiAnim = null;
let audioContext = null;

// --- HELPERS ---

function toGujaratiDigits(value) {
  return String(value).replace(/\d/g, (d) => String.fromCharCode(0x0AE6 + Number(d)));
}

function shuffle(list) {
  const copy = list.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function svgElement(name, attributes) {
  const el = document.createElementNS(SVG_NS, name);
  Object.entries(attributes || {}).forEach(([key, value]) => el.setAttribute(key, value));
  return el;
}

function toStagePoint(event) {
  const point = new DOMPoint(event.clientX, event.clientY);
  return point.matrixTransform(stage.getScreenCTM().inverse());
}

function boardAt(point) {
  const index = BOARD_HIT.findIndex((b) =>
    point.x >= b.x && point.x <= b.x + b.w && point.y >= b.y && point.y <= b.y + b.h);
  return index === -1 ? null : boards[index];
}

function setHot(board) {
  boards.forEach((b) => b.classList.toggle('hot', b === board));
}

function setEnabled(button, enabled) {
  button.classList.toggle('disabled', !enabled);
  button.setAttribute('aria-disabled', String(!enabled));
}

// --- SOUND (same tones as the reference widget) ---

function tone(frequency, duration, type) {
  try {
    audioContext = audioContext || new (window.AudioContext || window.webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = type || 'sine';
    oscillator.frequency.value = frequency;
    gain.gain.setValueAtTime(0.14, audioContext.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + duration);
    oscillator.connect(gain);
    gain.connect(audioContext.destination);
    oscillator.start();
    oscillator.stop(audioContext.currentTime + duration);
  } catch (error) {
    // Sound is optional
  }
}

function playGoodSound() {
  tone(660, 0.12);
  setTimeout(() => tone(880, 0.18), 110);
}

function playBadSound() {
  tone(200, 0.22, 'triangle');
}

// --- HINT ---

function showHint(message, kind) {
  hintText.textContent = message;
  hint.classList.remove('hidden');
  hintKind = kind;
  const width = Math.max(HINT_MIN_WIDTH, hintText.getComputedTextLength() + HINT_PADDING);
  hintBox.setAttribute('width', width);
  hintBox.setAttribute('x', 960 - width / 2);
}

function hideHint() {
  hint.classList.add('hidden');
  hintKind = null;
}

// --- LOTTIE ---

function loadLottie(containerId, fileName, settings) {
  if (!window.lottie) return null;
  return window.lottie.loadAnimation({
    container: document.getElementById(containerId),
    renderer: 'svg',
    loop: false,
    autoplay: true,
    path: `./assets/animation/${fileName}`,
    rendererSettings: settings
  });
}

function stopBurst() {
  if (burstAnim) {
    burstAnim.destroy();
    burstAnim = null;
  }
}

function playBurst(board) {
  stopBurst();
  const hit = BOARD_HIT[boards.indexOf(board)];
  burstLayer.setAttribute('x', hit.x + hit.w / 2 - 230);
  burstAnim = loadLottie('burst-lottie', 'bubble-burst-confetti.json');
  if (burstAnim) burstAnim.addEventListener('complete', stopBurst);
}

function stopConfetti() {
  if (confettiAnim) {
    confettiAnim.destroy();
    confettiAnim = null;
  }
}

function playConfetti() {
  stopConfetti();
  confettiAnim = loadLottie('confetti-lottie', 'confetti-8.json', { preserveAspectRatio: 'xMidYMid slice' });
  if (confettiAnim) confettiAnim.addEventListener('complete', stopConfetti);
}

// --- GAME STATE ---

function updateProgress() {
  roundCount.textContent = `${toGujaratiDigits(roundIndex + 1)}/${toGujaratiDigits(ROUNDS.length)}`;
  progressFill.setAttribute('width', PROGRESS_FILL_WIDTH * placedWords / TOTAL_WORDS);
}

function addWordToBoard(board, word) {
  const list = board.querySelector('.board-words');
  const y = WORD_ROW.top + list.children.length * WORD_ROW.step;
  const group = svgElement('g');
  group.appendChild(svgElement('rect', {
    class: 'word-pill',
    x: WORD_ROW.x - WORD_ROW.w / 2,
    y: y,
    width: WORD_ROW.w,
    height: WORD_ROW.h,
    rx: WORD_ROW.r
  }));
  const text = svgElement('text', { class: 'word-text', x: WORD_ROW.x, y: y + WORD_ROW.textDrop });
  text.textContent = word;
  group.appendChild(text);
  list.appendChild(group);
}

function disarm() {
  if (armedChip) armedChip.classList.remove('active');
  armedChip = null;
}

function finishRound() {
  setEnabled(showBtn, false);
  if (roundIndex < ROUNDS.length - 1) {
    setEnabled(nextBtn, true);
  } else {
    hideHint();
    endBanner.classList.remove('hidden');
    playConfetti();
  }
}

function placeChip(chip, board) {
  if (chip.dataset.key !== board.dataset.key) {
    playBadSound();
    board.classList.add('wrong');
    setTimeout(() => board.classList.remove('wrong'), WRONG_FEEDBACK_MS);
    showHint(HINT_WRONG, 'wrong');
    return;
  }

  playGoodSound();
  addWordToBoard(board, chip.dataset.word);
  if (armedChip === chip) armedChip = null;
  chip.remove();
  chipsLeft--;
  placedWords++;
  updateProgress();
  hideHint();
  playBurst(board);
  if (chipsLeft === 0) finishRound();
}

// --- WORD CLOUDS ---

function moveChip(chip, dx, dy) {
  chip.setAttribute('transform', `translate(${chip.slotX + dx} ${CHIP_Y + dy})`);
}

function createChip(word, key, slotX) {
  const chip = svgElement('g', { class: 'chip' });
  chip.dataset.word = word;
  chip.dataset.key = key;
  chip.slotX = slotX;
  chip.appendChild(svgElement('use', { href: '#cloud-shape' }));
  const text = svgElement('text', { x: CHIP_TEXT.x, y: CHIP_TEXT.y });
  text.textContent = word;
  chip.appendChild(text);
  moveChip(chip, 0, 0);
  chip.addEventListener('pointerdown', onChipDown);
  chip.addEventListener('pointermove', onChipMove);
  chip.addEventListener('pointerup', onChipUp);
  chip.addEventListener('pointercancel', onChipCancel);
  return chip;
}

function fitChipText(chip) {
  const text = chip.querySelector('text');
  const length = text.getComputedTextLength();
  if (length > CHIP_TEXT.maxWidth) {
    const size = parseFloat(getComputedStyle(text).fontSize);
    text.style.fontSize = `${size * CHIP_TEXT.maxWidth / length}px`;
  }
}

function onChipDown(event) {
  const chip = event.currentTarget;
  drag = { chip, start: toStagePoint(event), screenX: event.clientX, screenY: event.clientY, moved: false };
  try {
    chip.setPointerCapture(event.pointerId);
  } catch (error) {
    // Dragging still works without capture
  }
  chipsLayer.appendChild(chip); // Drag above the other clouds
}

function onChipMove(event) {
  if (!drag || drag.chip !== event.currentTarget) return;
  if (!drag.moved) {
    const far = Math.abs(event.clientX - drag.screenX) >= DRAG_THRESHOLD ||
      Math.abs(event.clientY - drag.screenY) >= DRAG_THRESHOLD;
    if (!far) return;
    drag.moved = true;
    disarm();
    drag.chip.classList.add('dragging', 'active');
  }
  const point = toStagePoint(event);
  moveChip(drag.chip, point.x - drag.start.x, point.y - drag.start.y);
  setHot(boardAt(point));
}

function endDrag() {
  const chip = drag.chip;
  drag = null;
  chip.classList.remove('dragging', 'active');
  moveChip(chip, 0, 0);
  setHot(null);
}

function onChipUp(event) {
  if (!drag || drag.chip !== event.currentTarget) return;
  const chip = drag.chip;
  const moved = drag.moved;
  const point = toStagePoint(event);
  endDrag();

  if (moved) {
    const board = boardAt(point);
    if (board) placeChip(chip, board);
  } else {
    const wasArmed = armedChip === chip;
    disarm();
    if (!wasArmed) {
      armedChip = chip;
      chip.classList.add('active');
      tone(520, 0.08);
    }
  }
}

function onChipCancel(event) {
  if (drag && drag.chip === event.currentTarget) endDrag();
}

// --- ROUNDS ---

function loadRound() {
  disarm();
  drag = null;
  hideHint();
  stopBurst();
  stopConfetti();
  endBanner.classList.add('hidden');
  boards.forEach((board) => {
    board.querySelector('.board-words').textContent = '';
    board.classList.remove('hot', 'wrong');
  });

  const round = ROUNDS[roundIndex];
  const items = shuffle(Object.keys(round).flatMap((key) => round[key].map((word) => ({ word, key }))));
  chipsLayer.textContent = '';
  items.forEach((item, i) => {
    const chip = createChip(item.word, item.key, CHIP_SLOTS[i]);
    chipsLayer.appendChild(chip);
    fitChipText(chip);
  });

  chipsLeft = items.length;
  setEnabled(nextBtn, false);
  setEnabled(showBtn, true);
  updateProgress();
}

function showAnswer() {
  disarm();
  [...chipsLayer.children].forEach((chip) => {
    const board = boards.find((b) => b.dataset.key === chip.dataset.key);
    addWordToBoard(board, chip.dataset.word);
    chip.remove();
    placedWords++;
  });
  chipsLeft = 0;
  updateProgress();
  showHint(HINT_SHOW_ANSWER, 'answer');
  finishRound();
}

function nextRound() {
  roundIndex++;
  loadRound();
}

function restart() {
  roundIndex = 0;
  placedWords = 0;
  loadRound();
}

function toggleHelp() {
  if (hintKind === 'help') {
    hideHint();
  } else {
    showHint(HINT_HELP, 'help');
  }
}

function onButton(button, action) {
  button.addEventListener('click', () => {
    if (!button.classList.contains('disabled')) action();
  });
  button.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      button.dispatchEvent(new MouseEvent('click'));
    }
  });
}

boards.forEach((board) => {
  board.addEventListener('click', () => {
    if (armedChip) placeChip(armedChip, board);
  });
});

onButton(showBtn, showAnswer);
onButton(nextBtn, nextRound);
onButton(replayBtn, restart);
onButton(helpBtn, toggleHelp);

// Cloud text is fitted by measuring it, so the Gujarati font must be ready first.
Promise.all([
  document.fonts.load('400 34px "Noto Sans Gujarati"', 'અક્ષર'),
  document.fonts.load('700 42px "Noto Sans Gujarati"', 'અક્ષર')
]).catch(() => {}).then(loadRound);
