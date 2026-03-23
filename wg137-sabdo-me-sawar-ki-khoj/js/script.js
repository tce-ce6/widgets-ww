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
    "distractors": ["ऊनी", "ऊसर"],
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

document.addEventListener('DOMContentLoaded', function () {

  swars.forEach(el => {
    el.addEventListener("click", function () {
      gamePage.style.display = 'block';
      homePage.style.display = 'none';

      letter = this.getAttribute("data-value");
      currentIndex = swarList.indexOf(letter);

      const data = letterData[letter];

      if (data) {
        currentData = data; // ✅ store for later (important)

        setQuestion(data.question); // ✅ call here
        setOptions(data);           // ✅ call here
        playSound(letter);
      }
    });
  });

  agalaSwarBtn.addEventListener("click", () => {
    currentIndex++;

    // loop back to start
    if (currentIndex >= swarList.length) {
      currentIndex = 0;
    }

    const letter = swarList[currentIndex];
    loadSwar(letter);
    playSound(letter);
    resetOptions();
  });

  homeBtn.addEventListener('click', () => {
    homePage.style.display = 'block';
    gamePage.style.display = 'none';
    showAnswerbtn.textContent = "उत्तर देखें";
    resetOptions();
  });
});

function resetOptions() {
  optionsImg.forEach(btn => {
    btn.style.pointerEvents = "auto";
  });

  // reset clicked tracking (IMPORTANT)
  clickedSet.clear();   // if using Set approach

  // reset button state
  uttarDekheBtn.style.opacity = 1;
  uttarDekheBtn.style.pointerEvents = "auto";
}

function loadSwar(selectedLetter) {
  gamePage.style.display = 'block';
  homePage.style.display = 'none';
  showAnswerbtn.textContent = "उत्तर देखें";

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

const optionsImg = document.querySelectorAll(".option-img");
const clickedSet = new Set();

optionsImg.forEach(el => {
  el.addEventListener("click", function () {

    const textEl = this.querySelector(".option-txt");
    const imgEl = this.querySelector("img");

    const selectedText = textEl.innerText.trim();

    if (!currentData) return;

    // ✅ mark this element as clicked
    clickedSet.add(this);

    // ✅ Only if correct answer
    if (currentData.answers.includes(selectedText)) {

      const imgName = imgJson[selectedText]; // get correct image
      if (imgName) {
        imgEl.src = `./assets/images/${imgName}`;
        imgEl.style.transform = "scale(1.7)";
        imgEl.style.position = 'absolute';
        imgEl.style.top = '-65px';
        imgEl.style.bottom = '0px';
      }
      playWordSound(selectedText);
    } else {
      // ❌ optional wrong case
      imgEl.src = "./assets/images/incorrect.svg";
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

    // remove applied styles
    img.style.transform = "";
    img.style.position = "";
    img.style.top = "";
    img.style.bottom = "";
  });
}


function toggleAnswer() {
  if (!currentData) return;

  const optionEls = document.querySelectorAll(".option-img");

  showAnswer = !showAnswer; // 🔥 toggle

  optionEls.forEach(el => {
    const text = el.querySelector(".option-txt").innerText.trim();
    const imgEl = el.querySelector("img");

    if (showAnswer) {
      // ✅ SHOW ANSWERS
      if (currentData.answers.includes(text)) {
        imgEl.src = `./assets/images/${imgJson[text]}`; // correct image
        imgEl.style.transform = "scale(1.7)";
        imgEl.style.position = 'absolute';
        imgEl.style.top = '-60px';
        imgEl.style.bottom = '0px';
      }
    } else {
      // 🔄 HIDE ANSWERS (reset)
      //imgEl.src = "./assets/images/letter.svg";
      const img = el.querySelector("img");
      img.src = "./assets/images/letter.svg";

      // remove applied styles
      img.style.transform = "";
      img.style.position = "";
      img.style.top = "";
      img.style.bottom = "";
    }
  });

  // 🔥 Optional: change button text
  showAnswerbtn.textContent = showAnswer ? "उत्तर हटाएं" : "उत्तर देखें";
}

uttarDekheBtn.addEventListener("click", toggleAnswer);