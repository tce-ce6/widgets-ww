const DATA = [
  {phrase:"जिसके समान कोई दूसरा न हो", answer:"अद्वितीय", phraseAudio:"assets/audio/vakyansh-01.mp3", wordAudio:"assets/audio/vakyansh-01-ans.mp3"},
  {phrase:"जिसकी आशा न की गई हो", answer:"अप्रत्याशित", phraseAudio:"assets/audio/vakyansh-02.mp3", wordAudio:"assets/audio/vakyansh-02-ans.mp3"},
  {phrase:"जो इन्द्रियों से परे हो", answer:"अगोचर", phraseAudio:"assets/audio/vakyansh-03.mp3", wordAudio:"assets/audio/vakyansh-03-ans.mp3"},
  {phrase:"जो विधान के विपरीत हो", answer:"अवैधानिक", phraseAudio:"assets/audio/vakyansh-04.mp3", wordAudio:"assets/audio/vakyansh-04-ans.mp3"},
  {phrase:"जो संविधान के प्रतिकूल हो", answer:"असंवैधानिक", phraseAudio:"assets/audio/vakyansh-05.mp3", wordAudio:"assets/audio/vakyansh-05-ans.mp3"},
  {phrase:"जिसे भले-बुरे का ज्ञान न हो", answer:"अविवेकी", phraseAudio:"assets/audio/vakyansh-06.mp3", wordAudio:"assets/audio/vakyansh-06-ans.mp3"},
  {phrase:"जिसे वाणी व्यक्त न कर सके", answer:"अनिर्वचनीय", phraseAudio:"assets/audio/vakyansh-07.mp3", wordAudio:"assets/audio/vakyansh-07-ans.mp3"},
  {phrase:"जैसा पहले कभी न हुआ हो", answer:"अभूतपूर्व", phraseAudio:"assets/audio/vakyansh-08.mp3", wordAudio:"assets/audio/vakyansh-08-ans.mp3"},
  {phrase:"जो व्यर्थ का व्यय करता हो", answer:"अपव्ययी", phraseAudio:"assets/audio/vakyansh-09.mp3", wordAudio:"assets/audio/vakyansh-09-ans.mp3"},
  {phrase:"बहुत कम खर्च करने वाला", answer:"मितव्ययी", phraseAudio:"assets/audio/vakyansh-10.mp3", wordAudio:"assets/audio/vakyansh-10-ans.mp3"},
  {phrase:"जिसके पास कुछ भी न हो", answer:"अकिंचन", phraseAudio:"assets/audio/vakyansh-11.mp3", wordAudio:"assets/audio/vakyansh-11-ans.mp3"},
  {phrase:"जिसका निवारण न हो सके", answer:"अनिवार्य", phraseAudio:"assets/audio/vakyansh-12.mp3", wordAudio:"assets/audio/vakyansh-12-ans.mp3"},
  {phrase:"जिसका परिहार करना सम्भव न हो", answer:"अपरिहार्य", phraseAudio:"assets/audio/vakyansh-13.mp3", wordAudio:"assets/audio/vakyansh-13-ans.mp3"},
  {phrase:"जिसे प्राप्त न किया जा सके", answer:"अप्राप्य", phraseAudio:"assets/audio/vakyansh-14.mp3", wordAudio:"assets/audio/vakyansh-14-ans.mp3"},
  {phrase:"जिसका उपचार सम्भव न हो", answer:"असाध्य", phraseAudio:"assets/audio/vakyansh-15.mp3", wordAudio:"assets/audio/vakyansh-15-ans.mp3"},
  {phrase:"जो तुरंत कविता बना सके", answer:"आशुकवि", phraseAudio:"assets/audio/vakyansh-16.mp3", wordAudio:"assets/audio/vakyansh-16-ans.mp3"},
  {phrase:"जो दूसरों के दोष खोजे", answer:"छिद्रान्वेषी", phraseAudio:"assets/audio/vakyansh-17.mp3", wordAudio:"assets/audio/vakyansh-17-ans.mp3"},
  {phrase:"इन्द्रियों को जीतने वाला", answer:"जितेन्द्रिय", phraseAudio:"assets/audio/vakyansh-18.mp3", wordAudio:"assets/audio/vakyansh-18-ans.mp3"},
  {phrase:"जो त्यागने योग्य हो", answer:"त्याज्य", phraseAudio:"assets/audio/vakyansh-19.mp3", wordAudio:"assets/audio/vakyansh-19-ans.mp3"},
  {phrase:"जिसे पार करना कठिन हो", answer:"दुस्तर", phraseAudio:"assets/audio/vakyansh-20.mp3", wordAudio:"assets/audio/vakyansh-20-ans.mp3"},
  {phrase:"जिसमें कोई विवाद ही न हो", answer:"निर्विवाद", phraseAudio:"assets/audio/vakyansh-21.mp3", wordAudio:"assets/audio/vakyansh-21-ans.mp3"},
  {phrase:"रात्रि में विचरण करने वाला", answer:"निशाचर", phraseAudio:"assets/audio/vakyansh-22.mp3", wordAudio:"assets/audio/vakyansh-22-ans.mp3"},
  {phrase:"किसी विषय का पूर्ण ज्ञाता", answer:"पारंगत", phraseAudio:"assets/audio/vakyansh-23.mp3", wordAudio:"assets/audio/vakyansh-23-ans.mp3"},
  {phrase:"जिसे तुरंत उचित उत्तर सूझ जाए", answer:"प्रत्युत्पन्नमति", phraseAudio:"assets/audio/vakyansh-24.mp3", wordAudio:"assets/audio/vakyansh-24-ans.mp3"},
  {phrase:"मोक्ष का इच्छुक", answer:"मुमुक्षु", phraseAudio:"assets/audio/vakyansh-25.mp3", wordAudio:"assets/audio/vakyansh-25-ans.mp3"},
  {phrase:"युद्ध की इच्छा रखने वाला", answer:"युयुत्सु", phraseAudio:"assets/audio/vakyansh-26.mp3", wordAudio:"assets/audio/vakyansh-26-ans.mp3"},
  {phrase:"जो क्षण भर में नष्ट हो जाए", answer:"क्षणभंगुर", phraseAudio:"assets/audio/vakyansh-27.mp3", wordAudio:"assets/audio/vakyansh-27-ans.mp3"},
  {phrase:"जिसका मन दूसरी ओर हो", answer:"अन्यमनस्क", phraseAudio:"assets/audio/vakyansh-28.mp3", wordAudio:"assets/audio/vakyansh-28-ans.mp3"},
  {phrase:"जो कार्य कठिनता से हो सके", answer:"दुष्कर", phraseAudio:"assets/audio/vakyansh-29.mp3", wordAudio:"assets/audio/vakyansh-29-ans.mp3"},
  {phrase:"जिसने किसी दूसरे का स्थान अस्थाई रूप से ग्रहण किया हो", answer:"स्थानापन्न", phraseAudio:"assets/audio/vakyansh-30.mp3", wordAudio:"assets/audio/vakyansh-30-ans.mp3"}
];

const DEFAULT_HINT = "वाक्यांश सुनें, फिर नीचे कार्ड खोलें |";
const OPTIONS_OPEN_HINT = "सही शब्द चुनें - या अन्य विकल्प के पाने के लिए 'अन्य विकल्प' बटन पर टैप करें।";
const OPTION_COUNT = 6;
const MAX_OPTION_SETS = 3;

let shuffledData = [];
let currentIndex = 0;
let isLocked = false;
let wrongOptionEl = null;
let cardLottieAnimation = null;
let feedbackLottieAnimation = null;
let trophyLottieAnimation = null;
let soundPlayed = false;
let currentQuestionHadWrong = false;
let firstTryCorrectCount = 0;
let optionSetIndex = 1;
let usedWrongWords = [];

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function updateProgress() {
  const total = shuffledData.length;
  const pct = Math.round((currentIndex / total) * 100);
  const current = Math.min(currentIndex + 1, total);

  const fillEl = document.getElementById('progressFill');
  const knobEl = document.getElementById('progressKnob');
  const labelEl = document.getElementById('progressLabel');

  if (fillEl) fillEl.style.width = pct + '%';
  if (knobEl) knobEl.style.left = pct + '%';
  if (labelEl) labelEl.textContent = current + ' of ' + total;
}

function getOptionWords(q, excludeWords) {
  const wrongAnswers = DATA.map(d => d.answer).filter(a => a !== q.answer && !excludeWords.includes(a));
  const wrongPicks = shuffle(wrongAnswers).slice(0, OPTION_COUNT - 1);
  return shuffle([
    {word: q.answer, correct: true},
    ...wrongPicks.map(word => ({word, correct: false}))
  ]);
}

function renderOptionSet(q) {
  const options = getOptionWords(q, usedWrongWords);
  options.forEach(opt => {
    if (!opt.correct) usedWrongWords.push(opt.word);
  });

  options.forEach((opt, i) => {
    const el = document.getElementById('option-' + (i + 1));
    if (!el) return;
    const wordEl = el.querySelector('.card-txt-word');
    if (wordEl) wordEl.textContent = opt.word;
    el.classList.remove('correct', 'wrong', 'disabled');
    el.onclick = function () { selectOption(opt, el, q); };
  });
}

function loadQuestion() {
  isLocked = false;
  wrongOptionEl = null;
  soundPlayed = false;
  currentQuestionHadWrong = false;
  optionSetIndex = 1;
  usedWrongWords = [];

  const q = shuffledData[currentIndex];

  document.getElementById('phrase').textContent = q.phrase;
  document.getElementById('itext').textContent = DEFAULT_HINT;

  updateProgress();
  hideFeedbackLottie();

  const nextBtn = document.getElementById('next-btn');
  if (nextBtn) nextBtn.disabled = false;

  const retryBtn = document.getElementById('more-option-btn');
  if (retryBtn) {
    retryBtn.disabled = false;
    retryBtn.classList.remove('disabled', 'blink');
  }

  renderOptionSet(q);

  restartCardLottie();
}

function selectOption(opt, el, q) {
  if (!soundPlayed || isLocked || el.classList.contains('disabled')) return;

  if (opt.correct) {
    isLocked = true;
    if (!currentQuestionHadWrong) firstTryCorrectCount++;
    el.classList.add('correct');
    document.querySelectorAll('.card-txt').forEach(c => c.classList.add('disabled'));
    document.getElementById('itext').textContent = 'शाबाश! सही जवाब!';
    playFeedbackLottie('correct', el);
    playWordAudio(q);

    const retryBtn = document.getElementById('more-option-btn');
    if (retryBtn) {
      retryBtn.disabled = true;
      retryBtn.classList.add('disabled');
      retryBtn.classList.remove('blink');
    }

    if (currentIndex >= shuffledData.length - 1) {
      const nextBtn = document.getElementById('next-btn');
      if (nextBtn) nextBtn.disabled = true;

      if (feedbackLottieAnimation) {
        feedbackLottieAnimation.addEventListener('complete', function () {
          resetSentence();
        });
      } else {
        resetSentence();
      }
    }
  } else {
    currentQuestionHadWrong = true;
    el.classList.add('wrong', 'disabled');
    wrongOptionEl = el;
    document.getElementById('itext').textContent = 'गलत! फिर से कोशिश करो!';
    playFeedbackLottie('incorrect', el);

    const wrongEntry = DATA.find(d => d.answer === opt.word);
    if (wrongEntry) playWordAudio(wrongEntry);

    const retryBtn = document.getElementById('more-option-btn');
    if (retryBtn && optionSetIndex < MAX_OPTION_SETS) {
      retryBtn.disabled = false;
      retryBtn.classList.remove('disabled');
      retryBtn.classList.add('blink');
    }
  }
}

function retryOptions() {
  const retryBtn = document.getElementById('more-option-btn');
  if (retryBtn && retryBtn.disabled) return;
  if (optionSetIndex >= MAX_OPTION_SETS) return;

  optionSetIndex++;
  isLocked = false;
  wrongOptionEl = null;
  hideFeedbackLottie();
  document.getElementById('itext').textContent = OPTIONS_OPEN_HINT;

  renderOptionSet(shuffledData[currentIndex]);

  if (retryBtn) {
    const noMoreSets = optionSetIndex >= MAX_OPTION_SETS;
    retryBtn.disabled = noMoreSets;
    retryBtn.classList.toggle('disabled', noMoreSets);
    retryBtn.classList.remove('blink');
  }
}

function resetSentence() {
  currentIndex++;
  if (currentIndex >= shuffledData.length) {
    showResults();
    return;
  }
  loadQuestion();
}

function showResults() {
  const total = shuffledData.length;
  const pct = Math.round((firstTryCorrectCount / total) * 10000) / 100;

  const wrapper = document.getElementById('resul-wrapper');
  const allCorrectEl = document.getElementById('all-correct');
  const allNotCorrectEl = document.getElementById('all-not-corret');
  const resultNumbersEl = document.getElementById('result-numbers');

  if (resultNumbersEl) resultNumbersEl.textContent = pct + '%';

  const isPerfect = firstTryCorrectCount === total;
  if (allCorrectEl) allCorrectEl.classList.toggle('hidden', !isPerfect);
  if (allNotCorrectEl) allNotCorrectEl.classList.toggle('hidden', isPerfect);

  if (wrapper) wrapper.style.display = 'block';

  document.querySelectorAll('.content-wrapper').forEach(function (el) {
    el.classList.add('hidden');
  });

  const buttonRow = document.querySelector('.button-controls');
  if (buttonRow) buttonRow.style.display = 'none';

  playTrophyLottie();
}

function playTrophyLottie() {
  hideTrophyLottie();

  const container = document.getElementById('trophy-img');
  if (!container) return;

  trophyLottieAnimation = lottie.loadAnimation({
    container: container,
    renderer: 'svg',
    loop: true,
    autoplay: true,
    path: './lottie/trophy.json'
  });
}

function hideTrophyLottie() {
  if (trophyLottieAnimation) {
    trophyLottieAnimation.stop();
    trophyLottieAnimation.destroy();
    trophyLottieAnimation = null;
  }
  const container = document.getElementById('trophy-img');
  if (container) container.innerHTML = '';
}

function restartGame() {
  const wrapper = document.getElementById('resul-wrapper');
  if (wrapper) wrapper.style.display = 'none';

  document.querySelectorAll('.content-wrapper').forEach(function (el) {
    el.classList.remove('hidden');
  });

  const buttonRow = document.querySelector('.button-controls');
  if (buttonRow) buttonRow.style.display = 'flex';

  hideTrophyLottie();

  firstTryCorrectCount = 0;
  shuffledData = shuffle(DATA);
  currentIndex = 0;
  loadQuestion();
}

function restartCardLottie() {
  if (cardLottieAnimation) {
    cardLottieAnimation.stop();
    cardLottieAnimation.destroy();
    cardLottieAnimation = null;
  }

  const container = document.getElementById('card-lottie');
  container.innerHTML = '';

  const cardContainerEl = document.getElementById('card-container');
  if (cardContainerEl) cardContainerEl.classList.add('hidden');

  requestAnimationFrame(() => {
    cardLottieAnimation = lottie.loadAnimation({
      container: container,
      renderer: 'svg',
      loop: false,
      autoplay: false,
      path: './lottie/cards.json'
    });

    cardLottieAnimation.addEventListener('complete', function () {
      cardLottieAnimation.pause();
      if (cardContainerEl) cardContainerEl.classList.remove('hidden');
      document.getElementById('itext').textContent = OPTIONS_OPEN_HINT;
    });
  });

  container.onclick = function () {
    if (cardLottieAnimation) cardLottieAnimation.play();
  };
}

function playFeedbackLottie(kind, el) {
  hideFeedbackLottie();

  const container = el.querySelector('.feedback-lottie');
  if (!container) return;
  container.classList.add('active');

  feedbackLottieAnimation = lottie.loadAnimation({
    container: container,
    renderer: 'svg',
    loop: false,
    autoplay: true,
    path: kind === 'correct' ? './lottie/correct.json' : './lottie/incorrect.json'
  });

  if (kind === 'incorrect') {
    feedbackLottieAnimation.addEventListener('complete', hideFeedbackLottie);
  }
}

function hideFeedbackLottie() {
  if (feedbackLottieAnimation) {
    feedbackLottieAnimation.stop();
    feedbackLottieAnimation.destroy();
    feedbackLottieAnimation = null;
  }
  document.querySelectorAll('.feedback-lottie').forEach(function (container) {
    container.innerHTML = '';
    container.classList.remove('active');
  });
}

function playPhraseAudio() {
  const q = shuffledData[currentIndex];
  if (!q) return;
  soundPlayed = true;
  try {
    const audio = new Audio(q.phraseAudio);
    audio.play().catch(function(){});
  } catch(e) {}
}

function playWordAudio(q) {
  try {
    const audio = new Audio(q.wordAudio);
    audio.play().catch(function(){});
  } catch(e) {}
}

document.addEventListener('DOMContentLoaded', function () {
  shuffledData = shuffle(DATA);
  currentIndex = 0;
  firstTryCorrectCount = 0;
  loadQuestion();
});

// Debug helper: steps through every question, missing `wrongCount` of them
// (spread evenly across the run) before answering correctly, then advances
// to the results screen. Drives the real click handlers/functions rather
// than duplicating game logic, so it exercises the same code path a user would.
window.debugAutoPlay = function (wrongCount = 30, delay = 0) {
  const total = shuffledData.length;
  const wrongIndices = new Set();
  for (let i = 0; i < wrongCount && i < total; i++) {
    wrongIndices.add(Math.floor(i * total / wrongCount));
  }

  function playOne() {
    if (currentIndex >= shuffledData.length) return;

    const q = shuffledData[currentIndex];
    playPhraseAudio();

    const cardEls = Array.from(document.querySelectorAll('.card-txt'));
    const correctEl = cardEls.find(el => el.querySelector('.card-txt-word').textContent === q.answer);
    const wrongEl = cardEls.find(el => el.querySelector('.card-txt-word').textContent !== q.answer);
    const missFirst = wrongIndices.has(currentIndex) && wrongEl;

    if (missFirst) {
      wrongEl.click();
      setTimeout(function () {
        retryOptions();
        setTimeout(function () {
          const freshCorrectEl = Array.from(document.querySelectorAll('.card-txt'))
            .find(el => el.querySelector('.card-txt-word').textContent === q.answer);
          if (freshCorrectEl) freshCorrectEl.click();
          setTimeout(function () {
            resetSentence();
            setTimeout(playOne, delay);
          }, delay);
        }, delay);
      }, delay);
    } else if (correctEl) {
      correctEl.click();
      setTimeout(function () {
        resetSentence();
        setTimeout(playOne, delay);
      }, delay);
    }
  }

  playOne();
};

