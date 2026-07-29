const DATA = [
  {phrase:"कपड़े धोने का काम करने वाला", answer:"धोबी", phraseAudio:"assets/audio/dhobi.mp3", wordAudio:"assets/audio/dhobi.mp3", image:"assets/image/dhobi.svg"},
  {phrase:"बीमार लोगों का इलाज करने वाला", answer:"चिकित्सक", phraseAudio:"assets/audio/chikitsak.mp3", wordAudio:"assets/audio/chikitsak.mp3", image:"assets/image/chikitsak.svg"},
  {phrase:"पत्र बाँटने वाला", answer:"डाकिया", phraseAudio:"assets/audio/dakiya.mp3", wordAudio:"assets/audio/dakiya.mp3", image:"assets/image/dakiya.svg"},
  {phrase:"खाना बनाने वाला", answer:"रसोइया", phraseAudio:"assets/audio/rasoiya.mp3", wordAudio:"assets/audio/rasoiya.mp3", image:"assets/image/rasoiya.svg"},
  {phrase:"मछली पकड़ने वाला", answer:"मछुआरा", phraseAudio:"assets/audio/machuara.mp3", wordAudio:"assets/audio/machuara.mp3", image:"assets/image/machuara.svg"},
  {phrase:"लकड़ी का सामान बनाने वाला", answer:"बढ़ई", phraseAudio:"assets/audio/badhai.mp3", wordAudio:"assets/audio/badhai.mp3", image:"assets/image/badhai.svg"},
  {phrase:"मिट्टी के बर्तन बनाने वाला", answer:"कुम्हार", phraseAudio:"assets/audio/kumhar.mp3", wordAudio:"assets/audio/kumhar.mp3", image:"assets/image/kumhar.svg"},
  {phrase:"कपड़े सिलने वाला", answer:"दर्जी", phraseAudio:"assets/audio/darji.mp3", wordAudio:"assets/audio/darji.mp3", image:"assets/image/darji.svg"},
  {phrase:"सोने-चाँदी के गहने बनाने वाला", answer:"सुनार", phraseAudio:"assets/audio/sunar.mp3", wordAudio:"assets/audio/sunar.mp3", image:"assets/image/sunar.svg"},
  {phrase:"जूते बनाने और ठीक करने वाला", answer:"मोची", phraseAudio:"assets/audio/mochi.mp3", wordAudio:"assets/audio/mochi.mp3", image:"assets/image/mochi.svg"},
  {phrase:"बगीचे की देखभाल करने वाला", answer:"माली", phraseAudio:"assets/audio/mali.mp3", wordAudio:"assets/audio/mali.mp3", image:"assets/image/mali.svg"},
  {phrase:"गाना गाने वाला", answer:"गायक", phraseAudio:"assets/audio/gayak.mp3", wordAudio:"assets/audio/gayak.mp3", image:"assets/image/gayak.svg"},
  {phrase:"चित्र बनाने वाला", answer:"चित्रकार", phraseAudio:"assets/audio/chitrakar.mp3", wordAudio:"assets/audio/chitrakar.mp3", image:"assets/image/chitrakar.svg"},
  {phrase:"बच्चों को पढ़ाने वाला", answer:"शिक्षक", phraseAudio:"assets/audio/shikshak.mp3", wordAudio:"assets/audio/shikshak.mp3", image:"assets/image/shikshak.svg"},
  {phrase:"नाव चलाने वाला", answer:"नाविक", phraseAudio:"assets/audio/navik.mp3", wordAudio:"assets/audio/navik.mp3", image:"assets/image/navik.svg"},
  {phrase:"संगीत जानने वाला", answer:"संगीतज्ञ", phraseAudio:"assets/audio/sangitagya.mp3", wordAudio:"assets/audio/sangitagya.mp3", image:"assets/image/sangitatnya.svg"},
  {phrase:"खेत में खेती करने वाला", answer:"किसान", phraseAudio:"assets/audio/kisan.mp3", wordAudio:"assets/audio/kisan.mp3", image:"assets/image/kisan.svg"},
  {phrase:"घर बनाने वाला", answer:"मिस्त्री", phraseAudio:"assets/audio/mistri.mp3", wordAudio:"assets/audio/mistri.mp3", image:"assets/image/mistri.svg"},
  {phrase:"लोहे का सामान बनाने वाला", answer:"लोहार", phraseAudio:"assets/audio/lohar.mp3", wordAudio:"assets/audio/lohar.mp3", image:"assets/image/lohar.svg"},
  {phrase:"वाहन चलाने वाला", answer:"चालक", phraseAudio:"assets/audio/chalak.mp3", wordAudio:"assets/audio/chalak.mp3", image:"assets/image/chalak.svg"},
  {phrase:"विमान उड़ाने वाला", answer:"पायलट", phraseAudio:"assets/audio/paylat.mp3", wordAudio:"assets/audio/paylat.mp3", image:"assets/image/pilot.svg"},
  {phrase:"समाचार लिखने वाला", answer:"पत्रकार", phraseAudio:"assets/audio/patrakar.mp3", wordAudio:"assets/audio/patrakar.mp3", image:"assets/image/patrakar.svg"},
  {phrase:"जो देश की रक्षा करता हो", answer:"सैनिक", phraseAudio:"assets/audio/sainik.mp3", wordAudio:"assets/audio/sainik.mp3", image:"assets/image/sainik.svg"},
  {phrase:"जो बाल काटता हो", answer:"नाई", phraseAudio:"assets/audio/naai.mp3", wordAudio:"assets/audio/naai.mp3", image:"assets/image/naai.svg"}
];

const BUBBLE_SIZES = [250, 250, 250];
const BUBBLE_POSITIONS = [
  {top:150, left:120},
  {top:40, left:440},
  {top:150, right:80}
];
const BUBBLE_LOTTIE_PATH = './lottie/bubbles.json';
const BUBBLE_LOTTIE_HOLD_SECONDS = 1;
const BUBBLE_REVEAL_DELAY_SECONDS = 3;

let currentIndex = 0;
let score = 0;
let isLocked = false;
let shuffledData = [];
let bubbleLottieAnimation = null;
let bubbleRevealTimeout = null;
let bubbleIntroCompleteHandler = null;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

getBubbleLottieAnimation();

function startGame() {
  shuffledData = shuffle(DATA);
  currentIndex = 0;
  score = 0;
  document.getElementById('startScreen').classList.add('hidden');
  document.getElementById('endScreen').classList.add('hidden');
  document.getElementById('gameArea').classList.remove('hidden');
  const backdrop = document.getElementById('backdrop');
  if (backdrop) backdrop.style.display = 'none';
  buildProgress();
  loadQuestion();
}

function restartGame() {
  document.getElementById('endScreen').classList.add('hidden');
  document.getElementById('startScreen').classList.remove('hidden');
}

function buildProgress() {
  updateProgress();
}

function updateProgress() {
  const total = shuffledData.length || 1;
  const pct = Math.round((currentIndex / total) * 100);
  const badgeVal = Math.min(currentIndex + 1, total);

  const badgeEl = document.getElementById('progressBadge');
  const percentEl = document.getElementById('progressPercent');
  const fillEl = document.getElementById('progressFill');

  if (badgeEl) badgeEl.textContent = badgeVal;
  if (percentEl) percentEl.textContent = pct + '%';
  if (fillEl) fillEl.style.width = pct + '%';
}

function getWrongOptions(correctAnswer) {
  const allAnswers = DATA.map(d => d.answer).filter(a => a !== correctAnswer);
  const shuffled = shuffle(allAnswers);
  return shuffled.slice(0, 2);
}

function getBubbleLottieAnimation() {
  const container = document.getElementById('lottieContainer');
  if (!container || typeof lottie === 'undefined') return null;
  if (bubbleLottieAnimation) return bubbleLottieAnimation;

  bubbleLottieAnimation = lottie.loadAnimation({
    container: container,
    renderer: 'svg',
    loop: false,
    autoplay: false,
    path: BUBBLE_LOTTIE_PATH
  });

  return bubbleLottieAnimation;
}

function getBubbleLottieHoldFrame() {
  const animation = getBubbleLottieAnimation();
  if (!animation) return 30;

  const frameRate = animation.frameRate || 30;
  const totalFrames = animation.totalFrames || 181;
  return Math.min(Math.round(frameRate * BUBBLE_LOTTIE_HOLD_SECONDS), Math.max(totalFrames - 1, 0));
}

function playBubbleLottieIntro(q) {
  const animation = getBubbleLottieAnimation();
  if (!animation) {
    bubbleRevealTimeout = setTimeout(function() { showBubbles(q); }, BUBBLE_REVEAL_DELAY_SECONDS * 1000);
    return;
  }

  animation.loop = false;

  function runIntroSegment() {
    animation.removeEventListener('DOMLoaded', runIntroSegment);
    if (bubbleIntroCompleteHandler) {
      animation.removeEventListener('complete', bubbleIntroCompleteHandler);
    }

    bubbleIntroCompleteHandler = function onIntroComplete() {
      animation.removeEventListener('complete', onIntroComplete);
      bubbleIntroCompleteHandler = null;
      bubbleRevealTimeout = setTimeout(function() { showBubbles(q); }, BUBBLE_REVEAL_DELAY_SECONDS * 1000);
    };
    animation.addEventListener('complete', bubbleIntroCompleteHandler);

    animation.playSegments([0, getBubbleLottieHoldFrame()], true);
  }

  if (animation.isLoaded) {
    runIntroSegment();
  } else {
    animation.addEventListener('DOMLoaded', runIntroSegment);
  }
}

function playBubbleLottieRemainder() {
  const animation = getBubbleLottieAnimation();
  if (!animation || !animation.isLoaded) return;

  const startFrame = getBubbleLottieHoldFrame();
  const endFrame = Math.max((animation.totalFrames || 181) - 1, startFrame);
  animation.loop = false;
  animation.playSegments([startFrame, endFrame], true);
}

function loadQuestion() {
  if (currentIndex >= shuffledData.length) {
    endGame();
    return;
  }

  isLocked = false;
  const q = shuffledData[currentIndex];

  document.getElementById('phraseText').textContent = q.phrase;
  document.getElementById('hintText').textContent = 'सही बुलबुले को टैप करके फोड़ो!';

  updateProgress();
  hideOverlays();
  const btnRow = document.getElementById('btnRow');
  btnRow.style.display = 'flex';
  btnRow.className = 'btn-row';
  btnRow.innerHTML =
    '<button id="btnRetry" class="game-btn btn-retry disabled" disabled onclick="retryQuestion()">फिर से प्रयास करें</button>' +
    '<button id="btnNext" class="game-btn btn-next disabled" disabled onclick="nextQuestion()">अगला वाक्यांश</button>';

  const zone = document.getElementById('bubbleZone');
  zone.querySelectorAll('.bubble').forEach(b => b.remove());

  clearTimeout(bubbleRevealTimeout);
  playBubbleLottieIntro(q);
}

function showBubbles(q) {
  const wrongOpts = getWrongOptions(q.answer);
  const options = shuffle([q.answer, ...wrongOpts]);

  const zone = document.getElementById('bubbleZone');

  options.forEach((word, i) => {
    const bub = document.createElement('div');
    const size = BUBBLE_SIZES[i];
    bub.className = 'bubble bubble-colors-' + i;
    bub.style.width = size + 'px';
    bub.style.height = size + 'px';

    const pos = BUBBLE_POSITIONS[i];
    bub.style.top = pos.top + 'px';
    if (pos.left !== undefined) bub.style.left = pos.left + 'px';
    if (pos.right !== undefined) bub.style.right = pos.right + 'px';

    bub.style.animationDelay = (i * 0.3) + 's';

    const span = document.createElement('span');
    span.className = 'bubble-word';
    span.textContent = word;
    bub.appendChild(span);

    bub.onclick = function() { handleBubbleClick(word, bub); };
    zone.appendChild(bub);
  });

  playBubbleLottieRemainder();
}

function handleBubbleClick(word, bubbleEl) {
  if (isLocked) return;
  isLocked = true;

  const q = shuffledData[currentIndex];

  if (word === q.answer) {
    score++;
    showCorrect(q);
  } else {
    showWrong(bubbleEl);
  }
}

function showCorrect(q) {
  const overlay = document.getElementById('correctOverlay');
  overlay.style.display = 'flex';

  document.getElementById('correctWord').textContent = q.answer;

  const roleImg = document.getElementById('role-image');
  if (roleImg) {
    roleImg.src = q.image;
  }

  document.getElementById('hintText').textContent = 'शाबाश! सही जवाब!';

  playWordAudio(q);

  const nextBtn = document.getElementById('btnNext');
  if (nextBtn) {
    nextBtn.classList.remove('disabled');
    nextBtn.removeAttribute('disabled');
  }
}

function showWrong(bubbleEl) {
  if (bubbleEl) {
    bubbleEl.classList.add('wrong');
  }

  document.getElementById('hintText').textContent = 'गलत! फिर से कोशिश करो!';

  const retryBtn = document.getElementById('btnRetry');
  if (retryBtn) {
    retryBtn.classList.remove('disabled');
    retryBtn.removeAttribute('disabled');
  }
}

function retryQuestion() {
  loadQuestion();
}

function nextQuestion() {
  currentIndex++;
  loadQuestion();
}

function hideOverlays() {
  document.getElementById('correctOverlay').style.display = 'none';
  document.getElementById('wrongOverlay').style.display = 'none';
}

function playPhraseAudio() {
  const q = shuffledData[currentIndex];
  if (!q) return;
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

function endGame() {
  document.getElementById('gameArea').classList.add('hidden');
  const endScreen = document.getElementById('endScreen');
  endScreen.classList.remove('hidden');

  const total = shuffledData.length;
  const pct = Math.round((score / total) * 100);
  let msg = '';
  if (pct === 100) msg = 'उत्कृष्ट! सभी सही!';
  else if (pct >= 75) msg = 'बहुत अच्छा!';
  else if (pct >= 50) msg = 'अच्छा प्रयास!';
  else msg = 'और अभ्यास करो!';

  document.getElementById('endScore').textContent =
    'स्कोर: ' + score + ' / ' + total + ' (' + pct + '%) — ' + msg;
}