
let letterData = {
  "અ": {
    "answers": ["અજમો", "અખરોટ", "અનાજ"],
    "distractors": ["આઠ", "ઓશીકું", "ઇનામ"],
    "question": "'અ' ની ધ્વનિ વાળા શબ્દોને ઓળખો."
  },
  "આ": {
    "answers": ["આગ", "આકાશ", "આદુ"],
    "distractors": ["અખરોટ", "ઇસ્ત્રી", "ઓરડો"],
    "question": "'આ' ની ધ્વનિ વાળા શબ્દોને ઓળખો."
  },
  "ઇ": {
    "answers": ["ઇયળ", "ઇનામ", "ઇસ્ત્રી"],
    "distractors": ["ઈશ્વર", "ઈડલી", "ઉકાળો"],
    "question": "'ઇ' ની ધ્વનિ વાળા શબ્દોને ઓળખો."
  },
  "ઈ": {
    "answers": ["ઈશ્વર", "ઈજા"],
    "distractors": ["ઇયળ", "ઇનામ", "ઓખલી", "આગ"],
    "question": "'ઈ' ની ધ્વનિ વાળા શબ્દોને ઓળખો."
  },
  "ઉ": {
    "answers": ["ઉપહાર", "ઉકાળો", "ઉનાળો"],
    "distractors": ["ઊન", "ઊધઈ", "એક"],
    "question": "'ઉ' ની ધ્વનિ વાળા શબ્દોને ઓળખો."
  },
  "ઊ": {
    "answers": ["ઊન", "ઊધઈ"],
    "distractors": ["ઉપહાર", "ઉકાળો", "ઓઢણી", "અંજીર"],
    "question": "'ઊ' ની ધ્વનિ વાળા શબ્દોને ઓળખો."
  },
  "ઋ": {
    "answers": ["ઋષિ", "ઋતુ"],
    "distractors": ["એરંડો", "ઐરાવત", "ઓખલી", "અંબા"],
    "question": "'ઋ' ની ધ્વનિ વાળા શબ્દોને ઓળખો."
  },
  "એ": {
    "answers": ["એક", "એકતારો", "એરંડો"],
    "distractors": ["અજમો", "ઐરાવત", "ઓઢણી"],
    "question": "'એ' ની ધ્વનિ વાળા શબ્દોને ઓળખો."
  },
  "ઐ": {
    "answers": ["ઐક્ય", "ઐરાવત", "ઐતિહાસિક"],
    "distractors": ["એક", "ઓખલી", "ઔષધિ"],
    "question": "'ઐ' ની ધ્વનિ વાળા શબ્દોને ઓળખો."
  },
  "ઓ": {
    "answers": ["ઓઢણી", "ઓશીકું", "ઓરડો"],
    "distractors": ["ઔષધિ", "ઔજાર", "અંકુર"],
    "question": "'ઓ' ની ધ્વનિ વાળા શબ્દોને ઓળખો."
  },
  "ઔ": {
    "answers": ["ઔષધિ", "ઔજાર"],
    "distractors": ["ઓસ", "ઓરડો", "આગ", "અંજીર"],
    "question": "'ઔ' ની ધ્વનિ વાળા શબ્દોને ઓળખો."
  },
  "અં": {
    "answers": ["અંબાડી", "અંબર"],
    "distractors": ["ઊંટ", "ઈંટ", "ઈડલી", "ઐરાવત"],
    "question": "'અં' ની ધ્વનિ વાળા શબ્દોને ઓળખો."
  }
};


let imgJson = {
  // અ (A)
  "અજમો": "ajmo.svg",       // mapped from अनार
  "અખરોટ": "akhrot.svg",     // mapped from अनानास
  "અનાજ": "anaj.svg",       // mapped from आकाश
  "આઠ": "ainak.svg",         // mapped from ऐनक
  "ઓશીકું": "airavat.svg",    // mapped from ऐरावत
  "ઇનામ": "aaloo.svg",       // mapped from आलू

  // આ (Aa)
  "આગ": "aag.svg",          // mapped from अंडा
  "આકાશ": "aakash.svg",       // mapped from अंजीर
  "આદુ": "aadu.svg",         // mapped from औरत
  "ઇસ્ત્રી": "istri.svg",   // mapped from औषधि

  // ઇ (I)
  "ઇયળ": "iyad.svg",          // mapped from ईल
  "ઇનામ": "inam.svg",         // mapped from एक (disambiguated key)
  "ઇસ્ત્રી": "istri.svg",    // mapped from एकतारा

  // ઈ (Ee)
  "ઈજા": "ijaa.svg",         // mapped from इडली
  "ઈશ્વર": "ishwar.svg",         // mapped from ईख
  "ઇમલી": "imali.svg",       // mapped from इमली

  // ઉ (U)
  "ઉનાળો": "unalo.svg",     // mapped from ओढ़नी
  "ઉકાળો": "ukalo.svg",
  "ઉપહાર": "upahar.svg",    // mapped from उपहार
       // mapped from ओखली

  // ઋ (Ri)
  "ઋષિ": "rishi.svg",         // mapped from ऋषि
  "ઋતુ": "rutu.svg",          // mapped from ऋतु

  // એ/ઊ/અં (E/Oo/An)
  "ઊધઈ": "udhai.svg",   // mapped from ऊदबिलाव (keeping original or mapping to Gujarati if preferred)
  "उनचास": "unchas.svg",     // mapped from उनचास
  "ઊન": "unn.svg",           // mapped from ऊन

  // ए (E) equivalents
  "એક": "ek.svg",
  "એકતારો": "ektaro.svg",
  "એરંડો": "erando.svg",

   "ઐક્ય": "aikya.svg",
  "ઐરાવત": "airavat.svg",
  "ઐતિહાસિક": "aitihasik.svg",

  // ओ (O) equivalents
  "ઓઢણી": "odhani.svg",
  "ઓશીકું": "oshiku.svg",
  "ઓરડો": "orado.svg",

  // ઔ (Au) equivalents
  "ઔષધિ": "aushadhi.svg",
  "ઔજાર": "aujar.svg",

  // અં (An) equivalents
  "અંબાડી": "ambadi.svg",
  "અંબર": "ambar.svg"

};

let soundJson = {
  "અ": "a.mp3",
  "આ": "aa.mp3",
  "ઇ": "e.mp3",
  "ઈ": "ee.mp3",
  "ઉ": "u.mp3",
  "ઊ": "uu.mp3",
  "ઋ": "ri.mp3",
  "એ": "ae.mp3",
  "ઐ": "aee.mp3",
  "ઓ": "o.mp3",
  "ઔ": "ou.mp3",
  "અં": "um.mp3"
};

let wordSoundJson = {
  // अ / अ (A) equivalents
  "અજમો": "ajmo.mp3",
  "અખરોટ": "akhrot.mp3",
  "અનાજ": "anaj.mp3",
  
  // आ (Aa) equivalents
  "આગ": "aag.mp3",
  "આકાશ": "aakash.mp3",
  "આદુ": "aadu.mp3",

  // इ (I) equivalents
  "ઇયળ": "iyad.mp3",
  "ઇનામ": "inam.mp3",
  "ઇસ્ત્રી": "istri.mp3",

  // ई (Ee) equivalents
  "ઈશ્વર": "ishwar.mp3",
  "ઈજા": "ijaa.mp3",
  "ઇડલી": "idli.mp3",

  // उ (U) equivalents
  "ઉપહાર": "uphar.mp3",
  "ઉકાળો": "ukalo.mp3",
  "ઉનાળો": "unalo.mp3",

  // ऊ (Oo) equivalents
  "ઊન": "unn.mp3",
  "ઊધઈ": "udhai.mp3",

  // ઋ (Ri) equivalents
  "ઋષિ": "rishi.mp3",
  "ઋતુ": "rutu.mp3",

  // ए (E) equivalents
  "એક": "ek.mp3",
  "એકતારો": "ektaro.mp3",
  "એરંડો": "erando.mp3",

  // ઐ (Ai) equivalents
  "ઐક્ય": "aikya.mp3",
  "ઐરાવત": "airavat.mp3",
  "ઐતિહાસિક": "aitihasik.mp3",

  // ओ (O) equivalents
  "ઓઢણી": "odhani.mp3",
  "ઓશીકું": "oshiku.mp3",
  "ઓરડો": "orado.mp3",

  // ઔ (Au) equivalents
  "ઔષધિ": "aushadhi.mp3",
  "ઔજાર": "aujar.mp3",

  // અં (An) equivalents
  "અંબાડી": "ambadi.mp3",
  "અંબર": "ambar.mp3"
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
    showAnswerbtn.textContent = "જવાબ જુઓ";
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
  showAnswerbtn.textContent = "જવાબ જુઓ";
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
  showAnswerbtn.textContent = showAnswer ? "જવાબ છુપાવો" : "જવાબ જુઓ";
}

uttarDekheBtn.addEventListener("click", toggleAnswer);