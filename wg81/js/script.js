WordAudioEnum = {};
let usedWords = [];
let selectedWord = null;
let audioPlayer = new Audio();

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
        document.getElementById("audio_button_1").style.display = 'none';
        document.getElementById("audio_button_2").style.display = 'none';
        hideAndShowAudioButtons('block');
       
        let audioPLay = document.getElementById("audio_button_3")
        audioPLay.addEventListener("click", () => {
             playAudio("correct");
            textClickEvent();
        });
        // You can add your navigation logic here
    });

}
function textClickEvent() {
    let cloud_text_01 =  document.getElementById("cloud_text_01");
    let cloud_text_02 =  document.getElementById("cloud_text_02");
    cloud_text_01.addEventListener("click", () => {
            document.getElementById("cloud_text_highlight_01").style.display = 'block';
            document.getElementById("cloud_text_outline_Incorrect").style.display = 'block';
            document.getElementById("incorrect-box").style.display = 'block';
             document.getElementById("correct-box").style.display = 'none';
            lottiAnimation('block');

    });
    cloud_text_02.addEventListener("click", () => {
        document.getElementById("cloud_text_highlight_02").style.display = 'block';
        document.getElementById("cloud_text_outline_correct").style.display = 'block';
        document.getElementById("correct-box").style.display = 'block';
         document.getElementById("incorrect-box").style.display = 'none';
        lottiAnimation('block');
    });
}

function audioListener() {
    const audio1 = document.getElementById("audio_button_1");
    const audio2 = document.getElementById("audio_button_2");
        audio1.addEventListener("click", () => {
         playAudio("wrong");
        });

        audio2.addEventListener("click", () => {
         playAudio("correct");
        });
}

function playAudio(type) {
  audioPlayer.pause();
  audioPlayer.currentTime = 0;

  let fileName = type === "wrong"
    ? selectedWord.wrongAudio
    : selectedWord.correctAudio;

  audioPlayer.src = `assets/audio/final_audio/${fileName}`;
  audioPlayer.play();
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
  document.getElementById("gyankosh_button").addEventListener("click", function() {
    console.log("Gyankosh button clicked");
    openModal();
  });
  //document.getElementById("closeModal").addEventListener("click", closeModal);
}
function naya_shabd(){
    naya_shabd_button = document.getElementById("naya_shabd_button");
    naya_shabd_button.addEventListener("click",()=>{
        console.log("Naya shabd button clicked");
        document.getElementById("audio_button_1").style.display = 'block';
        document.getElementById("audio_button_2").style.display = 'block';
       selectRandomWord();
        hideAndShowText1();
        hideAndShowAudioButtons('none');
        showAnswer();
        showText();
        lottiAnimation('none');
        nextbutton();
    });
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
