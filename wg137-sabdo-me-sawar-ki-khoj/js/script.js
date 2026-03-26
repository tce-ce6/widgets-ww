let letterData = {
  "अ": {
    "answers": ["अनार", "अनानास"],
    "distractors": ["अंगूर", "आठ"],
    "question": "‘अ’ की ध्वनि वाले शब्दों को पहचानिए।"
  },
  "आ": {
    "answers": ["आलू", "आकाश"],
    "distractors": ["अनाज", "अचार"],
    "question": "‘आ’ की ध्वनि वाले शब्दों को पहचानिए।"
  },
  "इ": {
    "answers": ["इडली", "इमली"],
    "distractors": ["ईद", "ईमानदार"],
    "question": "‘इ’ की ध्वनि वाले शब्दों को पहचानिए।"
  },
  "ई": {
    "answers": ["ईख", "ईल"],
    "distractors": ["इमारत", "इलाज"],
    "question": "‘ई’ की ध्वनि वाले शब्दों को पहचानिए।"
  },
  "उ": {
    "answers": ["उपहार", "उनचास"],
    "distractors": ["ऊन", "ऊसर"],
    "question": "‘उ’ की ध्वनि वाले शब्दों को पहचानिए।"
  },
  "ऊ": {
    "answers": ["ऊन", "ऊदबिलाव"],
    "distractors": ["उपमा", "उदास"],
    "question": "‘ऊ’ की ध्वनि वाले शब्दों को पहचानिए।"
  },
  "ऋ": {
    "answers": ["ऋषि", "ऋतु"],
    "distractors": ["एड़ी", "ऊपर"],
    "question": "‘ऋ’ की ध्वनि वाले शब्दों को पहचानिए।"
  },
  "ए": {
    "answers": ["एक", "एकतारा"],
    "distractors": ["ऐलान", "ऐंठना"],
    "question": "‘ए’ की ध्वनि वाले शब्दों को पहचानिए।"
  },
  "ऐ": {
    "answers": ["ऐनक", "ऐरावत"],
    "distractors": ["एड़ी", "एकता"],
    "question": "‘ऐ’ की ध्वनि वाले शब्दों को पहचानिए।"
  },
  "ओ": {
    "answers": ["ओढ़नी", "ओखली"],
    "distractors": ["औलाद", "औषधालय"],
    "question": "‘ओ’ की ध्वनि वाले शब्दों को पहचानिए।"
  },
  "औ": {
    "answers": ["औरत", "औषधि"],
    "distractors": ["ओस", "ओले"],
    "question": "‘औ’ की ध्वनि वाले शब्दों को पहचानिए।"
  },
  "अं": {
    "answers": ["अंडा", "अंजीर"],
    "distractors": ["आम", "इत्र"],
    "question": "‘अं’ की ध्वनि वाले शब्दों को पहचानिए।"
  }
}

let imgJson = {
  "अनार": "anar.svg",
  "अनानास": "ananas.svg",
  "आकाश": "akash.svg",
  "ऐनक": "ainak.svg",
  "ऐरावत": "airavat.svg",
  "आलू": "aaloo.svg",

  "अंडा": "anda.svg",
  "अंजीर": "anjir.svg",
  "औरत": "aurat.svg",
  "औषधि": "aushadhi.svg",

  "ईल": "eel.svg",
  "एक": "Ek.svg",
  "एकतारा": "ektara.svg",

  "इडली": "idli.svg",
  "ईख": "ikh.svg",
  "इमली": "imali.svg",

  "ओढ़नी": "odhani.svg",
  "ओखली": "okhali.svg",

  "ऋषि": "rishi.svg",
  "ऋतु": "rutu.svg",

  "ऊदबिलाव": "uddbilav.svg",
  "उनचास": "unchas.svg",
  "ऊन": "unn.svg",
  "उपहार": "upahar.svg"
}

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
  "ऊ": "uu.mp3"
};

let wordSoundJson = {
  "अनार": "anar.mp3",
  "अनानास": "ananas.mp3",
  "आकाश": "akash.mp3",
  "ऐनक": "ainak.mp3",
  "ऐरावत": "airavat.mp3",
  "आलू": "aaloo.mp3",

  "अंडा": "anda.mp3",
  "अंजीर": "anjir.mp3",
  "औरत": "aurat.mp3",
  "औषधि": "aushadhi.mp3",

  "ईल": "eel.mp3",
  "एक": "Ek.mp3",
  "एकतारा": "ektara.mp3",

  "इडली": "idli.mp3",
  "ईख": "ikh.mp3",
  "इमली": "imali.mp3",

  "ओढ़नी": "odhani.mp3",
  "ओखली": "okhali.mp3",

  "ऋषि": "rishi.mp3",
  "ऋतु": "rutu.mp3",

  "ऊदबिलाव": "uddbilav.mp3",
  "उनचास": "unchas.mp3",
  "ऊन": "unn.mp3",
  "उपहार": "uphar.mp3"
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