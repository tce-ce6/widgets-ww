WordAudioEnum = {};
let usedWords = [];
let selectedWord = null;
let audioPlayer = new Audio();
let lottieInstances = null;
let selectedLottie = null;
let audio_button_1 = false;
let audio_button_2 = false;
let age_badhe_button = false
const LottieAnimations = {
  ayee: {
    CORRECT: "correct-feedback-ayee.json",
    INCORRECT: "incorrect-feedback.json"
  },
  ye: {
    CORRECT: "correct-feedback-ye.json",
    INCORRECT: "incorrect-feedback.json"
  },
};


function init() {
    console.log("Script loaded and initialized.");
    // document.getElementById("i_text_1").style.fill = "blue";
    selectRandomWord();
    naya_shabd();
    hideAndShowText1();
    hideAndShowAudioButtons('none');
    showAnswer();
    showText();
    lottiAnimation('none');
    nextbutton();
    audioListener();
    nextStep();
    gyankosh_button();
    getRandomAnimation();
        let audioPLay = document.getElementById("audio_button_3")
        audioPLay.addEventListener("click", () => {
             playAudio("correct");
          
        });
          textClickEvent();
}

selectRandomWord = () => {
    currentWordKey = getRandomUnusedWordKey();
    selectedWord = WordAudioEnum[currentWordKey];
    console.log("Selected Word:", selectedWord);
   textDisplay();
}
function textDisplay() {
    let text1 = document.getElementById("cloud_text_01");  
    let text2 = document.getElementById("cloud_text_02");  
    const tspans = text1.querySelector("tspan");
    const tspan2 = text2.querySelector("tspan");
    tspans.innerHTML = selectedWord.incorrect;
    tspan2.innerHTML = selectedWord.correct;
}
function nextStep() {
    let nextButton = document.getElementById("age_badhe_button");
    nextButton.addEventListener("click", () => {
        // Logic to go to the next step
        nextButton.style.display = 'none';
        let i_text = document.getElementById("i_text_1");
         const tspans = i_text.querySelector("tspan");
         tspans.innerHTML = 'ऑडियो सुनें। कौन-सा शब्द सुना आपने? सही शब्द पर टैप करें।'
        age_badhe_button = true
        document.getElementById("audio_button_1").style.display = 'none';
        document.getElementById("audio_button_2").style.display = 'none';
        hideAndShowAudioButtons('block');
       
    
        // You can add your navigation logic here
    });

}
function textClickEvent() {
    let cloud_text_01 =  document.getElementById("cloud_text_01");
    let cloud_text_02 =  document.getElementById("cloud_text_02");

    // Remove previous listeners by cloning and replacing the node

    cloud_text_01.addEventListener("click", () => {
        if(age_badhe_button ){
            document.getElementById("cloud_text_highlight_01").style.display = 'block';
            document.getElementById("cloud_text_outline_Incorrect").style.display = 'block';
            // document.getElementById("incorrect-box").style.display = 'block';
            // document.getElementById("correct-box").style.display = 'none';
            lottiAnimation('block');
            playLottieAnimation('INCORRECT');
             playAnimationAudio("feedback-Incorrect");
        }
    });
    cloud_text_02.addEventListener("click", () => {
      if(age_badhe_button){
        document.getElementById("cloud_text_highlight_02").style.display = 'block';
        document.getElementById("cloud_text_outline_correct").style.display = 'block';
        // document.getElementById("correct-box").style.display = 'block';
        // document.getElementById("incorrect-box").style.display = 'none';
        lottiAnimation('block');
        playLottieAnimation('CORRECT');
         playAnimationAudio(`feedback-Correct-${selectedWord.type}`);
      }
    });
}

function audioListener() {
    const audio1 = document.getElementById("audio_button_1");
    const audio2 = document.getElementById("audio_button_2");
        audio1.addEventListener("click", () => {
          audio_button_1 = true;
         playAudio("wrong");
        });

        audio2.addEventListener("click", () => {
           audio_button_2 = true;
         playAudio("correct");
        });
}

function playAudio(type) {
  if (!audioPlayer || !(audioPlayer instanceof Audio)) {
    audioPlayer = new Audio();
  }
  audioPlayer.pause();
  audioPlayer.currentTime = 0;

  let fileName = type === "wrong"
    ? selectedWord.wrongAudio
    : selectedWord.correctAudio;

  audioPlayer.src = `assets/audio/final_audio/${fileName}`;
  audioPlayer.addEventListener('error', () => {
    console.error('Error loading audio:', audioPath);
  });
  audioPlayer.play().catch(error => {
    console.error('Error playing audio:', error);
  });;
}
function playAnimationAudio(type) {
    if (!audioPlayer || !(audioPlayer instanceof Audio)) {
    audioPlayer = new Audio();
  }
  audioPlayer.pause();
  audioPlayer.currentTime = 0
audioPlayer.addEventListener('error', () => {
    console.error('Error loading audio:', audioPath);
  });
  audioPlayer.src = `assets/audio/final_audio/${type}.mp3`;
  audioPlayer.play().catch(error => {
    console.error('Error playing audio:', error);
  });
}

function hideAndShowText1(state='none') {
    document.getElementById("i_text_2").style.display = state;
}

function hideAndShowAudioButtons(state='none') {
    // document.getElementById("audio_button_1").style.display = state;
    // document.getElementById("audio_button_2").style.display = state;
    document.getElementById("audio_button_3").style.display = state;
    document.getElementById("arrow_audio").style.display = state;
}
function showAnswer(state='none') {
    document.getElementById("cloud_text_outline_Incorrect").style.display = state;
    document.getElementById("cloud_text_outline_correct").style.display = state;
}
function showText(state="none") {
    document.getElementById("cloud_text_highlight_01").style.display = state;
     document.getElementById("cloud_text_highlight_02").style.display = state;
}
function lottiAnimation(state='block') {
    document.getElementById("Character_train_01").style.display = state;
}
function nextbutton(state='block') {
    document.getElementById("age_badhe_button").style.display = state;
}
function openModal() {
  document.getElementById("modalOverlay").style.display = "flex";
}

function closeModal() {
  document.getElementById("modalOverlay").style.display = "none";
}
function gyankosh_button() {
  const btn = document.getElementById("gyankosh_button");
  if (!btn) {
    console.error("gyankosh_button element not found in DOM");
    return;
  }
  btn.addEventListener("click", function() {
    console.log("Gyankosh button clicked");
    openModal();
  });
  // Add close modal event after DOM is ready
    var closeBtn = document.getElementById("btn-close");
    if (closeBtn) {
      closeBtn.onclick = closeModal;
    }
    // Also close modal when clicking outside modal content
    var overlay = document.getElementById("modalOverlay");
    if (overlay) {
      overlay.addEventListener("click", function(e) {
        if (e.target === overlay) closeModal();
      });
    }
}
function naya_shabd(){
    naya_shabd_button = document.getElementById("naya_shabd_button");
    naya_shabd_button.addEventListener("click",()=>{
        console.log("Naya shabd button clicked");
        document.getElementById("audio_button_1").style.display = 'block';
        document.getElementById("audio_button_2").style.display = 'block';
        audio_button_1 = false;
        audio_button_2 = false;
        age_badhe_button = false
        selectRandomWord();
        hideAndShowText1();
        hideAndShowAudioButtons('none');
        showAnswer();
        showText();
        lottiAnimation('none');
        nextbutton();
        getRandomAnimation();
        audioPlayer.pause();
          let i_text = document.getElementById("i_text_1");
         const tspans = i_text.querySelector("tspan");
         tspans.innerHTML = 'दोनों शब्दों को सुनें और मात्रा का उच्चारण समझें। '
    });
}

 
 function getRandomAnimation() {
  selectedLottie = LottieAnimations[selectedWord.type];
}
  
 
  function playLottieAnimation(bandGroup) {
    const containerEl = document.getElementById('lottie-container');
    if (!containerEl) return;

    const animationPath = selectedLottie[bandGroup];
    // Clear previous
    if (lottieInstances) {
        lottieInstances.destroy();
    }
    containerEl.innerHTML = '';

    lottieInstances = lottie.loadAnimation({
        container: containerEl,
        renderer: 'svg',
        loop: false,
        autoplay: true,
        path: `assets/JSON/${animationPath}`
    });

    // Optional guard (as above)
    lottieInstances.audioController = lottieInstances.audioController || {};
    lottieInstances.audioController.pause = () => console.warn("Audio pause skipped");
}
 
 

function getRandomUnusedWordKey() {
  const keys = Object.keys(WordAudioEnum).filter(k => !usedWords.includes(k));

  if (keys.length === 0) {
    usedWords = []; // reset when all used
    return getRandomUnusedWordKey();
  }

  const randomKey = keys[Math.floor(Math.random() * keys.length)];
  usedWords.push(randomKey);
  return randomKey;
}
getAllWordElements = () => {
    fetch('assets/JSON/word.json') // Replace with your API endpoint
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok: ' + response.statusText);
    }
 
    return response.json();
  })
  .then(data => {
    // Work with the parsed JSON data (a JavaScript object)
    console.log(data);
    WordAudioEnum = data;
    init();

  })
  .catch(error => {
   
    console.error('Error fetching data:', error);
  });
}
window.onload = getAllWordElements();
