let letterData = {
  "अ": {
    "answers": ["अजगर", "अननस"],
    "distractors": ["आठ", "आवळा"],
    "question": "‘अ’ हा ध्वनी असलेले शब्द ओळखा."
  },
  "आ": {
    "answers": ["आरसा", "आकाश"],
    "distractors": ["अंगठी", "अजगर"],
    "question": "‘आ’ हा ध्वनी असलेले शब्द ओळखा."
  },
  "इ": {
    "answers": ["इडली", "इमारत"],
    "distractors": ["ईद", "ईमानदार"],
    "question": "‘इ’ हा ध्वनी असलेले शब्द ओळखा."
  },
  "ई": {
    "answers": ["समई", "ईडलिंबू"],
    "distractors": ["इमारत", "इलाज"],
    "question": "‘ई’ हा ध्वनी असलेले शब्द ओळखा."
  },
  "उ": {
    "answers": ["उखळ", "उशी"],
    "distractors": ["ऊन", "ऊसर"],
    "question": "‘उ’ हा ध्वनी असलेले शब्द ओळखा."
  },
  "ऊ": {
    "answers": ["ऊस", "पाऊस"],
    "distractors": ["उपमा", "उदास"],
    "question": "‘ऊ’ हा ध्वनी असलेले शब्द ओळखा."
  },
  "ऋ": {
    "answers": ["ऋषि", "ऋतु"],
    "distractors": ["एड़ी", "ऊपर"],
    "question": "‘ऋ’ हा ध्वनी असलेले शब्द ओळखा."
  },
  "ए": {
    "answers": ["एक", "एडका"],
    "distractors": ["ऐश्वर्य", "ऐवज"],
    "question": "‘ए’ हा ध्वनी असलेले शब्द ओळखा."
  },
  "ऐ": {
    "answers": ["ऐरण", "ऐरावत"],
    "distractors": ["ऋषभ", "एकता"],
    "question": "‘ऐ’ हा ध्वनी असलेले शब्द ओळखा."
  },
  "ओ": {
    "answers": ["ओढा", "ओढणी"],
    "distractors": ["औक्षण", "औंजळ"],
    "question": "‘ओ’ हा ध्वनी असलेले शब्द ओळखा."
  },
  "औ": {
    "answers": ["औजार", "औषध"],
    "distractors": ["ओस", "ओळख"],
    "question": "‘औ’ हा ध्वनी असलेले शब्द ओळखा."
  },
  "अं": {
    "answers": ["अंजीर", "अंगठी"],
    "distractors": ["अमर", "आवळा"],
    "question": "‘अं’ हा ध्वनी असलेले शब्द ओळखा."
  },
  "अः": {
    "answers": ["स्वतः", "पुनः"],
    "distractors": ["ऊस", "अँट"],
    "question": "‘अः’ हा ध्वनी असलेले शब्द ओळखा."
  },
  "अँ": {
    "answers": ["अँट", "अँनिमल"],
    "distractors": ["ऑरका", "ऑलिव"],
    "question": "‘अँ’ हा ध्वनी असलेले शब्द ओळखा."
  },
  "आँ": {
    "answers": ["ऑफिस", "ऑईल"],
    "distractors": ["अँकर", "अँपल"],
    "question": "‘आँ’ हा ध्वनी असलेले शब्द ओळखा."
  }
}

let imgJson = {
  "अजगर": "ajgar.svg",
  "अननस": "ananas.svg",
  "आरसा": "aarasa.svg",
  "आकाश": "akash.svg",
  "इडली": "idli.svg",
  "इमारत": "imarat.svg",
  "समई": "samai.svg",
  "ईडलिंबू": "edlimbu.svg",
  "उखळ": "ukhad.svg",
  "उशी": "ushi.svg",
  "ऊस": "oos.svg",
  "पाऊस": "paus.svg",
  "ऋषि": "rishi.svg",
  "ऋतु": "rutu.svg",
  "एक": "ek.svg",
  "एडका": "edka.svg",
  "ऐरण": "airan.svg",
  "ऐरावत": "airavat.svg",
  "ओढा": "odha.svg",
  "ओढणी": "odhani.svg",
  "औजार": "auzar.svg",
  "औषध": "aushadh.svg",
  "अंजीर": "anjir.svg",
  "अंगठी": "angathi.svg",
  "स्वतः": "swatha.svg",
  "पुनः": "punah.svg",
  "अँट": "ant.svg",
  "अँनिमल": "animal.svg",
  "ऑफिस": "office.svg",
  "ऑईल": "oil.svg"
};

let soundJson = {
  "अ": "a.mp3",
  "आ": "aa.mp3",
  "ए": "ae.mp3",
  "ऐ": "aee.mp3",
  "इ": "e.mp3",
  "ई": "ee.mp3",
  "ओ": "o.mp3",
  "औ": "ou.mp3",
  "ऋ": "ri.mp3",
  "उ": "u.mp3",
  "अः": "uhh.mp3",
  "अं": "um.mp3",
  "ऊ": "uu.mp3",
  "अँ": "an.mp3",
  "आँ": "aw.mp3"
};

let wordSoundJson = {
  "अजगर": "ajagar.mp3",
  "अननस": "ananas.mp3",
  "आरसा": "aarsa.mp3",
  "आकाश": "aakash.mp3",
  "इडली": "edali.mp3",
  "इमारत": "emarat.mp3",
  "समई": "samai.mp3",
  "ईडलिंबू": "edlimbu.mp3",
  "उखळ": "ukhad.mp3",
  "उशी": "ushi.mp3",
  "ऊस": "oos.mp3",
  "पाऊस": "paus.mp3",
  "ऋषि": "rushi.mp3",
  "ऋतु": "rutu.mp3",
  "एक": "aek.mp3",
  "एडका": "aedaka.mp3",
  "ऐरण": "airan.mp3",
  "ऐरावत": "airavat.mp3",
  "ओढा": "odha.mp3",
  "ओढणी": "odhani.mp3",
  "औजार": "auzar.mp3",
  "औषध": "aushadh.mp3",
  "अंजीर": "angeer.mp3",
  "अंगठी": "angathi.mp3",
  "स्वतः": "swatha.mp3",
  "पुनः": "punhaa.mp3",
  "अँट": "ant.mp3",
  "अँनिमल": "animal.mp3",
  "ऑफिस": "office.mp3",
  "ऑईल": "oil.mp3"
};

const swarList = Object.keys(letterData); // ["अ","आ","इ",...]
let currentIndex = -1;
let currentData = null; // 🔥 store globally
let letter = null;
let showAnswer = false;

const swars = document.querySelectorAll(".swars");
const homePage = document.getElementById('home');
const gamePage = document.getElementById('gamePage');
const homeBtn = document.getElementById('home-btn');
const mainText = document.getElementById('main-txt');
const agalaSwarBtn = document.getElementById('agala-swar-btn');
const uttarDekheBtn = document.getElementById('uttar-dekhe-btn');
const showAnswerbtn = document.getElementById("showAnswerBtn");
const soundBtn = document.getElementById("soundBtn");

let activeLottieMap = new Map(); // store per option

document.addEventListener('DOMContentLoaded', function () {

  swars.forEach(el => {
    el.addEventListener("click", function () {
      gamePage.style.display = 'block';
      homePage.style.display = 'none';

      letter = this.getAttribute("data-value");
      currentIndex = swarList.indexOf(letter);

      const data = letterData[letter];
      if(letter == "अं"){
        agalaSwarBtn.style.opacity = 0.3;
        agalaSwarBtn.style.pointerEvents = 'none';
      }

      if (data) {
        currentData = data; // ✅ store for later (important)

        setQuestion(data.question); // ✅ call here
        setOptions(data);           // ✅ call here
        playSound(letter);
      }
    });
  });

  agalaSwarBtn.addEventListener("click", () => {

    // if already at last index → do nothing
    if (currentIndex >= swarList.length - 1) {
      return;
    }

    currentIndex++;

    const letter = swarList[currentIndex];
    loadSwar(letter);
    playSound(letter);
    resetOptions();

    // if reached last → disable button
    if (currentIndex === swarList.length - 1) {
      agalaSwarBtn.style.opacity = 0.3;
      agalaSwarBtn.style.pointerEvents = 'none'; // disable click
    }
  });

  homeBtn.addEventListener('click', () => {
    homePage.style.display = 'block';
    gamePage.style.display = 'none';
    showAnswerbtn.textContent = "उत्तर देखें";
    showAnswer = false;
    resetOptions();
  });
});

function resetOptions() {
  optionsImg.forEach(btn => {
    btn.style.pointerEvents = "auto";
  });

  // reset clicked tracking (IMPORTANT)
  clickedSet.clear();   // if using Set approach

  // clear any running lottie animations from previous question
  optionsImg.forEach(btn => {
    if (activeLottieMap.has(btn)) {
      activeLottieMap.get(btn).destroy();
      activeLottieMap.delete(btn);
    }
    const lottieContainer = btn.querySelector(".lottie-container");
    if (lottieContainer) lottieContainer.innerHTML = "";
  });

  // reset button state
  uttarDekheBtn.style.opacity = 1;
  uttarDekheBtn.style.pointerEvents = "auto";
  agalaSwarBtn.style.opacity = 1;
  agalaSwarBtn.style.pointerEvents = 'auto';
}

function loadSwar(selectedLetter) {
  gamePage.style.display = 'block';
  homePage.style.display = 'none';
  showAnswerbtn.textContent = "उत्तर देखें";
  showAnswer = false;

  letter = selectedLetter;
  const data = letterData[letter];

  if (data) {
    currentData = data;

    setQuestion(data.question);
    setOptions(data);
  }
}

function playSound(letter) {
  const soundFile = soundJson[letter];

  if (!soundFile) {
    console.warn("No sound for:", letter);
    return;
  }
  const audio = new Audio(`./assets/audio/swar/${soundFile}`);
  audio.play();
}

function playWordSound(word) {
  const soundFile = wordSoundJson[word];

  if (!soundFile) return;

  const audio = new Audio(`./assets/audio/swar-ans/${soundFile}`);
  audio.play();
}

function playLottie(container, parentEl) {
  if (!container) {
    console.warn("playLottie: .lottie-container not found for option", parentEl);
    return;
  }
  if (typeof lottie === "undefined" || !lottie.loadAnimation) {
    console.error("playLottie: lottie library not loaded (lottie.min.js missing?)");
    return;
  }

  // 🧹 destroy previous lottie in THIS option only
  let hadPrev = false;
  if (activeLottieMap.has(parentEl)) {
    hadPrev = true;
    activeLottieMap.get(parentEl).destroy();
    activeLottieMap.delete(parentEl);
  }
  // Avoid clearing container on first load to reduce visible flicker
  if (hadPrev) container.innerHTML = "";

  const anim = lottie.loadAnimation({
    container: container,
    renderer: "svg",
    loop: false,
    autoplay: true,
    path: "./assets/animation/confetti.json"
  });

  activeLottieMap.set(parentEl, anim);
}

const optionsImg = document.querySelectorAll(".option-img");
const clickedSet = new Set();

optionsImg.forEach(el => {
  el.addEventListener("click", function () {

    const lottieContainer = this.querySelector(".lottie-container");
    const textEl = this.querySelector(".option-txt");
    const imgEl = this.querySelector("img");

    const selectedText = textEl.innerText.trim();

    if (!currentData) return;

    // Prevent re-triggering (reduces flicker on repeated clicks)
    // If the option was clicked before but Lottie was cleared (e.g. after showAnswer toggle),
    // allow re-clicking so animation can play again.
    if (clickedSet.has(this) && activeLottieMap.has(this)) return;
    clickedSet.add(this);

    const isCorrect = currentData.answers.includes(selectedText);

    // ✅ Only if correct answer
    if (isCorrect) {

      const imgName = imgJson[selectedText]; // get correct image
      if (imgName) {
        imgEl.src = `./assets/images/${imgName}`;
      }

      // Play animation only on correct answer
      playLottie(lottieContainer, this);
      playWordSound(selectedText);
    } else {
      // ❌ optional wrong case
      imgEl.src = "./assets/images/incorrect.svg";

      // Clear animation on wrong answer
      if (activeLottieMap.has(this)) {
        activeLottieMap.get(this).destroy();
        activeLottieMap.delete(this);
      }
      if (lottieContainer) lottieContainer.innerHTML = "";
    }

    // ✅ check if all clicked
    if (clickedSet.size === optionsImg.length) {
      optionsImg.forEach(btn => {
        btn.style.pointerEvents = "none";
        uttarDekheBtn.style.opacity = 0.5;
        uttarDekheBtn.style.pointerEvents = "none";
      });
    }
  });
});

soundBtn.addEventListener("click", () => {
  const letter = swarList[currentIndex];
  playSound(letter); // 🔥 replay current sound
});

function setQuestion(question) {
  document.getElementById("question").textContent = question;
  mainText.innerText = letter;
}

function setOptions(data) {
  const optionEls = document.querySelectorAll(".option-img");

  let options = [...data.answers, ...data.distractors];
  options = options.sort(() => Math.random() - 0.5);
  console.log(options);
  optionEls.forEach((el, index) => {
    el.querySelector(".option-txt").innerText = options[index];

    // 🔥 reset image back to default
    //el.querySelector("img").src = "./assets/images/letter.svg";

    const img = el.querySelector("img");
    img.src = "./assets/images/letter.svg";

  });
}


function toggleAnswer() {
  if (!currentData) return;

  const optionEls = document.querySelectorAll(".option-img");
  showAnswer = !showAnswer; // 🔥 toggle

  const optionsAllClicked = clickedSet.size === optionsImg.length;

  optionEls.forEach(el => {
    const text = el.querySelector(".option-txt").innerText.trim();
    const imgEl = el.querySelector("img");
    const optTxt = el.querySelector(".option-txt");
    const lottieContainer = el.querySelector(".lottie-container");

    // Enable/disable click target (the handler is on .option-img)
    el.style.pointerEvents = showAnswer ? "none" : (optionsAllClicked ? "none" : "auto");

    // When answers are shown, also disable interactions on children.
    imgEl.style.pointerEvents = showAnswer ? "none" : "auto";
    optTxt.style.pointerEvents = showAnswer ? "none" : "auto";
    optTxt.style.cursor = showAnswer ? "none" : "pointer";
    if (showAnswer) {
      // ✅ SHOW ANSWERS
      if (currentData.answers.includes(text)) {
        imgEl.src = `./assets/images/${imgJson[text]}`; // correct image
      }
      else{
        imgEl.src = './assets/images/incorrect.svg';
      }

      // Hide lottie completely during "show answer"
      if (lottieContainer) lottieContainer.style.display = "none";
      if (activeLottieMap.has(el)) {
        activeLottieMap.get(el).destroy();
        activeLottieMap.delete(el);
      }
      if (lottieContainer) lottieContainer.innerHTML = "";
    } else {
      // 🔄 HIDE ANSWERS (reset)
      imgEl.src = "./assets/images/letter.svg";

      // Restore styling to the initial state
      imgEl.style.transform = "";
      imgEl.style.position = "";
      imgEl.style.top = "";
      imgEl.style.bottom = "";
      imgEl.style.transition = "";
      imgEl.style.zIndex = "";
      imgEl.style.backfaceVisibility = "";
      imgEl.style.transformOrigin = "";

      if (lottieContainer) lottieContainer.style.display = "";
      
    }
  });
  // 🔥 Optional: change button text
  showAnswerbtn.textContent = showAnswer ? "उत्तर हटाएँ" : "उत्तर देखें";
}

uttarDekheBtn.addEventListener("click", toggleAnswer);