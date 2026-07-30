const DATA = [
  {phrase:"कपड़े धोने का काम करने वाला", answer:"धोबी", phraseAudio:"assets/audio/dhobi-vakyansh.mp3", wordAudio:"assets/audio/dhobi.mp3", image:"assets/image/dhobi.svg"},
  {phrase:"बीमार लोगों का इलाज करने वाला", answer:"चिकित्सक", phraseAudio:"assets/audio/chikitsak-vakyansh.mp3", wordAudio:"assets/audio/chikitsak.mp3", image:"assets/image/chikitsak.svg"},
  {phrase:"पत्र बाँटने वाला", answer:"डाकिया", phraseAudio:"assets/audio/dakiya-vakyansh.mp3", wordAudio:"assets/audio/dakiya.mp3", image:"assets/image/dakiya.svg"},
  {phrase:"खाना बनाने वाला", answer:"रसोइया", phraseAudio:"assets/audio/rasoiya-vakyansh.mp3", wordAudio:"assets/audio/rasoiya.mp3", image:"assets/image/rasoiya.svg"},
  {phrase:"मछली पकड़ने वाला", answer:"मछुआरा", phraseAudio:"assets/audio/machuara-vakyansh.mp3", wordAudio:"assets/audio/machuara.mp3", image:"assets/image/machuara.svg"},
  {phrase:"लकड़ी का सामान बनाने वाला", answer:"बढ़ई", phraseAudio:"assets/audio/badhai-vakyansh.mp3", wordAudio:"assets/audio/badhai.mp3", image:"assets/image/badhai.svg"},
  {phrase:"मिट्टी के बर्तन बनाने वाला", answer:"कुम्हार", phraseAudio:"assets/audio/kumhar-vakyansh.mp3", wordAudio:"assets/audio/kumhar.mp3", image:"assets/image/kumhar.svg"},
  {phrase:"कपड़े सिलने वाला", answer:"दर्जी", phraseAudio:"assets/audio/darji-vakyansh.mp3", wordAudio:"assets/audio/darji.mp3", image:"assets/image/darji.svg"},
  {phrase:"सोने-चाँदी के गहने बनाने वाला", answer:"सुनार", phraseAudio:"assets/audio/sunar-vakyansh.mp3", wordAudio:"assets/audio/sunar.mp3", image:"assets/image/sunar.svg"},
  {phrase:"जूते बनाने और ठीक करने वाला", answer:"मोची", phraseAudio:"assets/audio/mochi-vakyansh.mp3", wordAudio:"assets/audio/mochi.mp3", image:"assets/image/mochi.svg"},
  {phrase:"बगीचे की देखभाल करने वाला", answer:"माली", phraseAudio:"assets/audio/mali-vakyansh.mp3", wordAudio:"assets/audio/mali.mp3", image:"assets/image/mali.svg"},
  {phrase:"गाना गाने वाला", answer:"गायक", phraseAudio:"assets/audio/gayak-vakyansh.mp3", wordAudio:"assets/audio/gayak.mp3", image:"assets/image/gayak.svg"},
  {phrase:"चित्र बनाने वाला", answer:"चित्रकार", phraseAudio:"assets/audio/chitrakar-vakyansh.mp3", wordAudio:"assets/audio/chitrakar.mp3", image:"assets/image/chitrakar.svg"},
  {phrase:"बच्चों को पढ़ाने वाला", answer:"शिक्षक", phraseAudio:"assets/audio/shikshak-vakyansh.mp3", wordAudio:"assets/audio/shikshak.mp3", image:"assets/image/shikshak.svg"},
  {phrase:"नाव चलाने वाला", answer:"नाविक", phraseAudio:"assets/audio/navik-vakyansh.mp3", wordAudio:"assets/audio/navik.mp3", image:"assets/image/navik.svg"},
  {phrase:"संगीत जानने वाला", answer:"संगीतज्ञ", phraseAudio:"assets/audio/sangitagya-vakyansh.mp3", wordAudio:"assets/audio/sangitagya.mp3", image:"assets/image/sangitatnya.svg"},
  {phrase:"खेत में खेती करने वाला", answer:"किसान", phraseAudio:"assets/audio/kisan-vakyansh.mp3", wordAudio:"assets/audio/kisan.mp3", image:"assets/image/kisan.svg"},
  {phrase:"घर बनाने वाला", answer:"मिस्त्री", phraseAudio:"assets/audio/mistri-vakyansh.mp3", wordAudio:"assets/audio/mistri.mp3", image:"assets/image/mistri.svg"},
  {phrase:"लोहे का सामान बनाने वाला", answer:"लोहार", phraseAudio:"assets/audio/lohar-vakyansh.mp3", wordAudio:"assets/audio/lohar.mp3", image:"assets/image/lohar.svg"},
  {phrase:"वाहन चलाने वाला", answer:"चालक", phraseAudio:"assets/audio/chalak-vakyansh.mp3", wordAudio:"assets/audio/chalak.mp3", image:"assets/image/chalak.svg"},
  {phrase:"विमान उड़ाने वाला", answer:"पायलट", phraseAudio:"assets/audio/paylat-vakyansh.mp3", wordAudio:"assets/audio/paylat.mp3", image:"assets/image/pilot.svg"},
  {phrase:"समाचार लिखने वाला", answer:"पत्रकार", phraseAudio:"assets/audio/patrakar-vakyansh.mp3", wordAudio:"assets/audio/patrakar.mp3", image:"assets/image/patrakar.svg"},
  {phrase:"जो देश की रक्षा करता हो", answer:"सैनिक", phraseAudio:"assets/audio/sainik-vakyansh.mp3", wordAudio:"assets/audio/sainik.mp3", image:"assets/image/sainik.svg"},
  {phrase:"जो बाल काटता हो", answer:"नाई", phraseAudio:"assets/audio/naai-vakyansh.mp3", wordAudio:"assets/audio/naai.mp3", image:"assets/image/naai.svg"}
];

const BUBBLE_SIZES = [250, 250, 250];
const BUBBLE_POSITIONS = [
  {top:120, left:95},
  {top:22, left:427},
  {top:80, right:123}
];
const TANK_LOTTIE_PATH = './lottie/tank.json';
const BUBBLE_LOTTIE_PATH = './lottie/bubbles.json';
const FISH_LOTTIE_PATH = './lottie/fish.json';
const CONFETTI_LOTTIE_PATH = './lottie/conffitee.json';

let currentIndex = 0;
let score = 0;
let isLocked = false;
let shuffledData = [];
let tankLottieAnimation = null;
let bubbleLottieAnimation = null;
let bubbleAnimationDone = false;
let confettiLottieAnimation = null;
let phraseAudioPlayed = false;

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function startGame() {
  shuffledData = shuffle(DATA);
  currentIndex = 0;
  score = 0;
  phraseAudioPlayed = false;
  document.getElementById('startScreen').classList.add('hidden');
  document.getElementById('endScreen').classList.add('hidden');
  document.getElementById('gameArea').classList.remove('hidden');
  const backdrop = document.getElementById('backdrop');
  if (backdrop) backdrop.style.display = 'none';
  buildProgress();
  restartLottieAnimations();
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

// bubbles.json embeds an audio layer. Without a Howler-compatible audio
// factory, lottie's built-in fallback stub is missing .pause() and throws
// ("this.audio.pause is not a function"), which kills the whole render loop
// for both animations. Wrap a native <audio> element in the interface lottie
// expects (play/pause/seek/playing/volume/rate).
function lottieAudioFactory(asset) {
    // asset can be a base64 data URI or a normal file path
    const src =
        typeof asset === "string"
            ? asset
            : asset?.p || asset?.path || "";

    const audio = new Audio(src);

    return {
        play() {
            audio.play().catch(() => {});
        },
        pause() {
            audio.pause();
        },
        stop() {
            audio.pause();
            audio.currentTime = 0;
        },
        seek(time) {
            if (typeof time === "number") {
                audio.currentTime = time;
            }
            return audio.currentTime;
        },
        playing() {
            return !audio.paused;
        },
        volume(v) {
            if (typeof v === "number") {
                audio.volume = v;
            }
            return audio.volume;
        },
        rate(r) {
            if (typeof r === "number") {
                audio.playbackRate = r;
            }
            return audio.playbackRate;
        }
    };
}

// Lottie instances are destroyed and recreated on every play rather than
// reused + goToAndPlay(0) — restarting a still-playing instance (bubbles.json
// runs ~4s, longer than most answer times) doesn't reliably reset it.
function restartLottieAnimations() {

    if (tankLottieAnimation) {
        tankLottieAnimation.stop();
        tankLottieAnimation.destroy();
        tankLottieAnimation = null;
    }

    if (bubbleLottieAnimation) {
        bubbleLottieAnimation.stop();
        bubbleLottieAnimation.destroy();
        bubbleLottieAnimation = null;
    }

    const tankContainer = document.getElementById("lottieContainer");
    const bubbleContainer = document.getElementById("bubbleLottieContainer");

    tankContainer.innerHTML = "";
    bubbleContainer.innerHTML = "";

    bubbleAnimationDone = false;

    requestAnimationFrame(() => {

        tankLottieAnimation = lottie.loadAnimation({
            container: tankContainer,
            renderer: "svg",
            loop: false,
            autoplay: true,
            path: "./lottie/tank.json"
        });

        bubbleLottieAnimation = lottie.loadAnimation({
            container: bubbleContainer,
            renderer: "svg",
            loop: false,
            autoplay: true,
            audioFactory: lottieAudioFactory,
            path: "./lottie/bubbles.json"
        });

        bubbleLottieAnimation.addEventListener('complete', function() {
            bubbleAnimationDone = true;
            revealAnswerBubbles();
        });

    });

}

function revealAnswerBubbles() {
  document.querySelectorAll('.bubble').forEach(function(b) {
    b.classList.remove('bubble-hidden');
  });
}

function loadQuestion() {
  if (currentIndex >= shuffledData.length) {
    endGame();
    return;
  }

  isLocked = false;
  const q = shuffledData[currentIndex];

  document.getElementById('phraseText').textContent = q.phrase;
  document.getElementById('hintText').textContent = 'वाक्यांश पढ़ो और ऑडियो सुनो। सही शब्द बबल को टैप करो।';

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

  showBubbles(q);
}

function showBubbles(q) {
  const wrongOpts = getWrongOptions(q.answer);
  const options = shuffle([q.answer, ...wrongOpts]);

  const zone = document.getElementById('bubbleZone');

  options.forEach((word, i) => {
    const bub = document.createElement('div');
    const size = BUBBLE_SIZES[i];
    bub.className = 'bubble bubble-colors-' + i +
      (bubbleAnimationDone ? '' : ' bubble-hidden') +
      (phraseAudioPlayed ? '' : ' bubble-locked');
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
}

function handleBubbleClick(word, bubbleEl) {
  if (!phraseAudioPlayed) return;
  if (isLocked) return;
  isLocked = true;

  const q = shuffledData[currentIndex];

  playWordAudio(word);

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

  if (confettiLottieAnimation) {
    confettiLottieAnimation.destroy();
    confettiLottieAnimation = null;
  }

  const confettiContainer = document.getElementById('correct-confeti');
  confettiContainer.innerHTML = '';

  confettiLottieAnimation = lottie.loadAnimation({
    container: confettiContainer,
    renderer: 'svg',
    loop: false,
    autoplay: true,
    path: CONFETTI_LOTTIE_PATH
  });

  document.getElementById('bubbleLottieContainer').classList.add('lottie-hidden');

  document.querySelectorAll('.bubble').forEach(function(b) {
    b.classList.add('bubble-hidden');
  });

  document.getElementById('correctWord').textContent = q.answer;

  const roleImg = document.getElementById('role-image');
  if (roleImg) {
    roleImg.src = q.image;
  }

  document.getElementById('hintText').textContent = 'शाबाश! सही जवाब!';

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
  phraseAudioPlayed = false;
  if (currentIndex >= shuffledData.length) {
    loadQuestion();
    return;
  }
  restartLottieAnimations();
  loadQuestion();
}

function hideOverlays() {
  document.getElementById('correctOverlay').style.display = 'none';
  document.getElementById('wrongOverlay').style.display = 'none';
  document.getElementById('bubbleLottieContainer').classList.remove('lottie-hidden');

  if (confettiLottieAnimation) {
    confettiLottieAnimation.destroy();
    confettiLottieAnimation = null;
  }
}

function playPhraseAudio() {
  const q = shuffledData[currentIndex];
  if (!q) return;
  try {
    const audio = new Audio(q.phraseAudio);
    audio.play().catch(function(){});
  } catch(e) {}

  phraseAudioPlayed = true;
  document.querySelectorAll('.bubble').forEach(function(b) {
    b.classList.remove('bubble-locked');
  });
}

function playWordAudio(word) {
  const entry = DATA.find(function(d) { return d.answer === word; });
  if (!entry) return;
  try {
    const audio = new Audio(entry.wordAudio);
    audio.play().catch(function(){});
  } catch(e) {}
}

function endGame() {
    document.getElementById('gameArea').classList.add('hidden');

    if (bubbleLottieAnimation) {
        bubbleLottieAnimation.stop();
        bubbleLottieAnimation.destroy();
        bubbleLottieAnimation = null;
    }

    if (tankLottieAnimation) {
        tankLottieAnimation.stop();
        tankLottieAnimation.destroy();
        tankLottieAnimation = null;
    }

    const endScreen = document.getElementById('endScreen');
    endScreen.classList.remove('hidden');

    // Hide the button row
    const btnRow = document.getElementById('btnRow');
    if (btnRow) {
        btnRow.style.display = 'none';
    }

    const backdrop = document.getElementById('backdrop');
    if (backdrop) backdrop.style.display = 'block';
}

lottie.loadAnimation({
    container: document.getElementById('fish-animation'),
    renderer: 'svg',
    loop: true,
    autoplay: true,
    path: FISH_LOTTIE_PATH
});

window.debugEndGame = function () {
    // If the game hasn't started, start it first
    if (!shuffledData.length) {
        startGame();
    }

    // Pretend all questions have been completed
    currentIndex = shuffledData.length;
    score = shuffledData.length; // optional: show 100% score

    endGame();
};

window.debugAutoPlay = function () {
    if (!shuffledData.length) {
        startGame();
    }

    const timer = setInterval(() => {
        score++;
        nextQuestion();

        if (currentIndex >= shuffledData.length) {
            clearInterval(timer);
        }
    }, 100);
};