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

// Words from the storyboard (gu_gu_2_wg231_Storyboard.docx).
const WORDS = [
  { "correct": "ફુગ્ગા", "wrong": ["ફુગા", "ફૂગ્ગા"], "hint": "ગ્ગ જોડાક્ષર છે અને ફુ ઉપર ટૂંકો ુ આવે." },
  { "correct": "ઉંદર", "wrong": ["ઉદંર", "ઊંદર"], "hint": "અનુસ્વાર પહેલા અક્ષર ઉ ઉપર આવે, અને ઉ ટૂંકો છે." },
  { "correct": "વાંસળી", "wrong": ["વાસળી", "વાંશળી"], "hint": "વા ઉપર અનુસ્વાર આવે અને સ લખાય, શ નહિ." },
  { "correct": "હીંચકો", "wrong": ["હિંચકો", "હીચંકો"], "hint": "હી લાંબો છે અને અનુસ્વાર હી ઉપર જ આવે." },
  { "correct": "વિજ્ઞાન", "wrong": ["વિગ્યાન", "વીજ્ઞાન"], "hint": "જ + ઞ મળીને જ્ઞ બને; વિ ટૂંકો છે." },
  { "correct": "યજ્ઞ", "wrong": ["યગ્ય", "યજ્ય"], "hint": "યજ્ઞ માં જ્ઞ જોડાક્ષર આવે." },
  { "correct": "શ્રીકૃષ્ણ", "wrong": ["શ્રીક્રુષ્ણ", "શ્રિકૃષ્ણ"], "hint": "કૃ માં ૃ આવે અને શ્રી લાંબો છે." },
  { "correct": "આશ્રમ", "wrong": ["આશરમ", "આસ્રમ"], "hint": "શ + ર મળીને શ્ર જોડાક્ષર બને." },
  { "correct": "વૃક્ષો", "wrong": ["વ્રુક્ષો", "વૃક્શો"], "hint": "વૃ માં ૃ આવે અને ક + ષ મળીને ક્ષ બને." },
  { "correct": "શિક્ષક", "wrong": ["શીક્ષક", "શિક્શક"], "hint": "શિ ટૂંકો છે અને ક્ષ જોડાક્ષર આવે." },
  { "correct": "આજ્ઞા", "wrong": ["આગ્યા", "અજ્ઞા"], "hint": "આજ્ઞા માં જ્ઞ જોડાક્ષર આવે." },
  { "correct": "પ્રવાસે", "wrong": ["પરવાસે", "પ્રવાશે"], "hint": "પ + ર મળીને પ્ર બને; સ લખાય, શ નહિ." },
  { "correct": "રૂપિયા", "wrong": ["રુપિયા", "રૂપીયા"], "hint": "રૂ લાંબો અને પિ ટૂંકો આવે." },
  { "correct": "ડૂબી", "wrong": ["ડુબી", "ડૂબિ"], "hint": "ડૂ લાંબો અને બી લાંબો આવે." },
  { "correct": "સૂરજ", "wrong": ["સુરજ", "શૂરજ"], "hint": "સૂ લાંબો છે અને સ લખાય, શ નહિ." },
  { "correct": "ઊંઘવા", "wrong": ["ઉંઘવા", "ઊઘંવા"], "hint": "ઊ લાંબો છે અને અનુસ્વાર ઊ ઉપર આવે." },
  { "correct": "મોબાઈલ", "wrong": ["મોબાઇલ", "મોબઈલ"], "hint": "મોબાઈલ માં લાંબો ઈ આવે." },
  { "correct": "શરણાઈ", "wrong": ["શરણાઇ", "સરણાઈ"], "hint": "છેલ્લે લાંબો ઈ આવે અને શરૂઆતમાં શ આવે." },
  { "correct": "ખિસકોલી", "wrong": ["ખીસકોલી", "ખિસકોલિ"], "hint": "ખિ ટૂંકો અને છેલ્લે લી લાંબો આવે." },
  { "correct": "ઋષિમુનિઓ", "wrong": ["રૂષિમુનિઓ", "ઋશિમુનિઓ"], "hint": "શરૂઆતમાં ઋ અને પછી ષ આવે." },
  { "correct": "દુઃખી", "wrong": ["દુખી", "દુઃખિ"], "hint": "દુ પછી વિસર્ગ (ઃ) અને છેલ્લે ખી લાંબો આવે." }
];

const LABEL_CORRECT = 'આમ લખો ✓';
const LABEL_WRONG = 'આમ ન લખો ✗';

// Layout in XD pixels
const CARD_CENTERS = [406, 960, 1513];
const CONFETTI_HALF_WIDTH = 335.5;
const CONFETTI_CARD = { y: 274, width: 671, height: 568 };
const CONFETTI_END = { x: 360, y: 0, width: 1200, height: 900 };
const CARD_WORD_MAX_WIDTH = 420;
const HINT_MIN_WIDTH = 598;
const HINT_PADDING = 80;
const SHAKE_MS = 400;

const cards = [...document.querySelectorAll('.card')];
const hint = document.getElementById('hint');
const hintBox = document.getElementById('hint-box');
const hintText = document.getElementById('hint-text');
const wordCount = document.getElementById('word-count');
const cardsLayer = document.getElementById('cards');
const instructions = document.getElementById('instructions');
const endScreen = document.getElementById('end-screen');
const showBtn = document.getElementById('show-btn');
const nextBtn = document.getElementById('next-btn');
const replayBtn = document.getElementById('replay-btn');
const confettiLayer = document.getElementById('confetti-layer');

let wordIndex = 0;
let resolved = false;
let finished = false;
let touched = false; // Replay stays dim until there is something to restart
let confettiAnim = null;
let trophyAnim = null;
let audioContext = null;

// --- HELPERS ---

function toGujaratiDigits(value) {
  return String(value).padStart(2, '0').replace(/\d/g, (d) => String.fromCharCode(0x0AE6 + Number(d)));
}

function shuffle(list) {
  const copy = list.slice();
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

function setEnabled(button, enabled) {
  button.classList.toggle('disabled', !enabled);
  button.setAttribute('aria-disabled', String(!enabled));
}

function completedCount() {
  if (finished) return WORDS.length;
  return wordIndex + (resolved ? 1 : 0);
}

function updateControls() {
  wordCount.textContent = `${toGujaratiDigits(completedCount())}/${toGujaratiDigits(WORDS.length)}`;
  setEnabled(showBtn, !resolved && !finished);
  setEnabled(nextBtn, resolved && !finished);
  setEnabled(replayBtn, touched);
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

// --- LOTTIE ---

function loadLottie(containerId, fileName, loop) {
  if (!window.lottie) return null;
  return window.lottie.loadAnimation({
    container: document.getElementById(containerId),
    renderer: 'svg',
    loop: loop,
    autoplay: true,
    path: `./assets/animation/${fileName}`
  });
}

function stopConfetti() {
  if (confettiAnim) {
    confettiAnim.destroy();
    confettiAnim = null;
  }
}

function playConfetti(box) {
  stopConfetti();
  confettiLayer.setAttribute('x', box.x);
  confettiLayer.setAttribute('y', box.y);
  confettiLayer.setAttribute('width', box.width);
  confettiLayer.setAttribute('height', box.height);
  confettiAnim = loadLottie('confetti-lottie', 'confetti-2.json', false);
  if (confettiAnim) confettiAnim.addEventListener('complete', stopConfetti);
}

function stopTrophy() {
  if (trophyAnim) {
    trophyAnim.destroy();
    trophyAnim = null;
  }
}

// --- CARDS ---

function fitCardWord(card) {
  const text = card.querySelector('.card-word');
  text.style.fontSize = '';
  const length = text.getComputedTextLength();
  if (length > CARD_WORD_MAX_WIDTH) {
    const size = parseFloat(getComputedStyle(text).fontSize);
    text.style.fontSize = `${size * CARD_WORD_MAX_WIDTH / length}px`;
  }
}

function markCard(card) {
  const isCorrect = card.dataset.word === WORDS[wordIndex].correct;
  card.classList.add(isCorrect ? 'correct' : 'wrong');
  card.querySelector('.card-label').textContent = isCorrect ? LABEL_CORRECT : LABEL_WRONG;
}

function showHint() {
  hintText.textContent = WORDS[wordIndex].hint;
  hint.classList.remove('hidden');
  const width = Math.max(HINT_MIN_WIDTH, hintText.getComputedTextLength() + HINT_PADDING);
  hintBox.setAttribute('width', width);
  hintBox.setAttribute('x', 960 - width / 2);
}

function onCardTap(card) {
  if (resolved || finished || card.classList.contains('wrong')) return;
  touched = true;
  markCard(card);
  showHint();

  if (card.classList.contains('correct')) {
    playGoodSound();
    resolved = true;
    const center = CARD_CENTERS[cards.indexOf(card)];
    playConfetti({ x: center - CONFETTI_HALF_WIDTH, y: CONFETTI_CARD.y, width: CONFETTI_CARD.width, height: CONFETTI_CARD.height });
  } else {
    playBadSound();
    card.classList.add('shake');
    setTimeout(() => card.classList.remove('shake'), SHAKE_MS);
  }
  updateControls();
}

// --- WORDS ---

function loadWord() {
  const item = WORDS[wordIndex];
  const options = shuffle([item.correct, ...item.wrong]);
  resolved = false;
  stopConfetti();
  hint.classList.add('hidden');
  cards.forEach((card, i) => {
    card.classList.remove('correct', 'wrong', 'shake');
    card.dataset.word = options[i];
    card.querySelector('.card-word').textContent = options[i];
    card.querySelector('.card-label').textContent = '';
    fitCardWord(card);
  });
  updateControls();
}

function showAnswer() {
  touched = true;
  cards.forEach(markCard);
  showHint();
  resolved = true;
  updateControls();
}

function showEndScreen() {
  finished = true;
  stopConfetti();
  hint.classList.add('hidden');
  cardsLayer.classList.add('hidden');
  instructions.classList.add('hidden');
  endScreen.classList.remove('hidden');
  updateControls();
  trophyAnim = loadLottie('trophy-lottie', 'trophy.json', true);
  playConfetti(CONFETTI_END);
}

function nextWord() {
  if (wordIndex < WORDS.length - 1) {
    wordIndex++;
    loadWord();
  } else {
    showEndScreen();
  }
}

function restart() {
  wordIndex = 0;
  finished = false;
  touched = false;
  stopTrophy();
  cardsLayer.classList.remove('hidden');
  instructions.classList.remove('hidden');
  endScreen.classList.add('hidden');
  loadWord();
}

function onActivate(element, action) {
  element.addEventListener('click', action);
  element.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      action();
    }
  });
}

function onButton(button, action) {
  onActivate(button, () => {
    if (!button.classList.contains('disabled')) action();
  });
}

cards.forEach((card) => onActivate(card, () => onCardTap(card)));
onButton(showBtn, showAnswer);
onButton(nextBtn, nextWord);
onButton(replayBtn, restart);

// Card text is fitted by measuring it, so the Gujarati font must be ready first.
Promise.all([
  document.fonts.load('400 40px "Noto Sans Gujarati"', 'અક્ષર'),
  document.fonts.load('700 56px "Noto Sans Gujarati"', 'અક્ષર')
]).catch(() => {}).then(loadWord);
