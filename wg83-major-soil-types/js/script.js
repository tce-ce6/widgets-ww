// GLOBAL VARIABLES
let soilTypes = [];
let selectedSoil = null;
let selectedTexture = null;
let selectedCrop = null;
let currentQuestionType = "texture"; // "texture" or "crop"
let textureAnswerCorrect = false;
let cropAnswerCorrect = false;
let mapLocationCorrect = false;


document.body.classList.add("step-1");

// LOAD JSON
fetch("./data.json")
  .then(response => response.json())
  .then(data => {

    soilTypes = data.soilTypes;

    initSoilClick();

  })
  .catch(err => console.log("JSON Load Error:", err));




// INIT SOIL CLICK
function initSoilClick() {

  const soilItems = document.querySelectorAll(".soil-list li");

  soilItems.forEach((item) => {

    item.addEventListener("click", () => {

      const soilKey = item.dataset.soil;

      // find correct soil from JSON
      selectedSoil = soilTypes.find(soil =>
        soil.tabImage.includes(soilKey)
      );

      showStep2();

    });

  });

}




// SHOW STEP 2
function showStep2() {

  const step1 = document.getElementById("step-1");
  const step2 = document.getElementById("step-2");

  step1.style.display = "none";
  step2.style.display = "block";
  document.body.classList.remove("step-1");
  document.body.classList.add("step-2");

  // ── FULL UI RESET FOR FRESH FLOW ──

  // 1. Show map, hide option list, hide reset & preview buttons
  const soilMap = document.getElementById("soil-map");
  if (soilMap) {
    soilMap.style.display = "block";
    // Clear correct/wrong classes from all map regions
    soilMap.querySelectorAll("[id$='-soil-map']").forEach(g => {
      g.classList.remove("correct", "wrong");
    });
  }

  const optionListWrapper = document.getElementById("option-list-wrapper");
  if (optionListWrapper) optionListWrapper.style.display = "none";

  const resetBtn = document.getElementById("reset-btn");
  if (resetBtn) resetBtn.style.display = "none";


  // 2. Hide summary, show soil-typeSection
  document.getElementById("summary-sec").style.display = "none";
  const previewBtn = document.querySelector(".preview-btn");
  if (previewBtn) previewBtn.style.display = "none";

  // 3. Hide error note
  const errorNote = document.getElementById("error-note");
  if (errorNote) {
    errorNote.style.display = "none";
    errorNote.classList.remove("correct", "wrong");
  }

  // 4. Reset next button to disabled, back button removes disabled
  const backBtn = document.querySelectorAll(".backNext-btn span")[0];
  const nextBtn = document.querySelectorAll(".backNext-btn span")[1];
  if (nextBtn) nextBtn.classList.add("disabled");
  if (backBtn) backBtn.classList.remove("disabled");

  // 5. Reset question state variables
  currentQuestionType = "texture";
  textureAnswerCorrect = false;
  cropAnswerCorrect = false;
  mapLocationCorrect = false;
  isAnswerShown = false;
  if (showAnsBtn) { showAnsBtn.innerText = "Show Answer"; }
  const noteTxt = document.querySelector(".note-txt");
  if (noteTxt) noteTxt.innerText = "Tap its location on the map.";

  updateSoilDetails();
  document.getElementById("selected-question").innerText = "Where do you find this soil type in India?";
  loadTextureQuestion();

}




// UPDATE LEFT PANEL
function updateSoilDetails() {

  document.getElementById("soil-typeSection").style.display = "block";

  document.getElementById("selected-img").src =
    selectedSoil.tabImage;

  document.getElementById("selected-mountain-type").innerText =
    selectedSoil.name;

  document.getElementById("selected-question").innerText =
    selectedSoil.textureQuestion.question;

}




// LOAD TEXTURE OPTIONS
function loadTextureQuestion() {

  const optionList = document.getElementById("option-list");

  optionList.innerHTML = "";

  selectedSoil.textureQuestion.options.forEach(option => {

    const li = document.createElement("li");

    li.innerHTML = `
        <img src="${option.image}">
        <span class="bottom-note">${option.text}</span>
        <div class="lottie-container"></div>
    `;

    li.dataset.correct = option.isCorrect;

    li.addEventListener("click", function () {

      handleTextureAnswer(this);

    });

    optionList.appendChild(li);

  });

  initMapClick();

}




// INIT MAP CLICK
function initMapClick() {

  const soilMap = document.getElementById("soil-map");

  if (!soilMap) return;

  // Get all soil region groups from map
  const allSoilGroups = soilMap.querySelectorAll("[id$='-soil-map']");

  console.log("Found soil groups:", allSoilGroups.length);
  console.log("Selected soil:", selectedSoil);

  allSoilGroups.forEach(group => {

    console.log("Attaching listener to group:", group.id);

    // Add click listener to each group
    group.addEventListener("click", function (e) {

      console.log("Clicked on:", this.id);
      e.stopPropagation();
      handleMapClick(this);

    });

  });

}




// HANDLE MAP CLICK
function handleMapClick(element) {

  if (mapLocationCorrect) return;

  const soilMap = document.getElementById("soil-map");
  const allGroups = soilMap.querySelectorAll("[id$='-soil-map']");

  // Remove previous correct and wrong classes
  allGroups.forEach(group => {
    group.classList.remove("correct", "wrong");
  });

  // Get clicked element's id
  const clickedId = element.id;
  const correctLocation = selectedSoil["map-location"];

  console.log("Clicked ID:", clickedId, "Correct location:", correctLocation);

  const errorNote = document.getElementById("error-note");

  // Check if clicked region matches selected soil's map-location
  if (correctLocation === clickedId) {

    console.log("Correct selection!");
    element.classList.add("correct");
    mapLocationCorrect = true;

    if (errorNote) {
      errorNote.style.display = "block";
      errorNote.innerText = "You are correct!";
      errorNote.classList.remove("wrong");
      errorNote.classList.add("correct");
    }

    // Remove disabled class from next button
    const nextButton = document.querySelectorAll(".backNext-btn span")[1];
    if (nextButton) {
      nextButton.classList.remove("disabled");
    }

  } else {

    console.log("Wrong selection!");
    element.classList.add("wrong");

    if (errorNote) {
      errorNote.style.display = "block";
      errorNote.innerText = "Not quite! Try again.";
      errorNote.classList.remove("correct");
      errorNote.classList.add("wrong");
    }

  }

}




// HANDLE TEXTURE ANSWER
function handleTextureAnswer(element) {

  const allOptions = document.querySelectorAll("#option-list li");

  allOptions.forEach(opt => {
    opt.classList.remove("active");
  });

  element.classList.add("active");

  selectedTexture = element.dataset.correct;

  const errorNote = document.getElementById("error-note");
  const lottieContainer = element.querySelector(".lottie-container");

  if (selectedTexture === "true") {

    textureAnswerCorrect = true;
    errorNote.style.display = "none";

    // Play correct lottie animation
    if (lottieContainer) {
      lottieContainer.innerHTML = "";
      lottie.loadAnimation({
        container: lottieContainer,
        renderer: "svg",
        loop: false,
        autoplay: true,
        path: "./lottie/correctLottie.json"
      });
    }

    // Enable next button for texture stage
    const nextButton = document.querySelectorAll(".backNext-btn span")[1];
    if (nextButton) {
      nextButton.classList.remove("disabled");
    }

    // Hide incorrect options
    allOptions.forEach(li => {
      if (li.dataset.correct !== "true") {
        li.style.display = "none";
      }
    });

  } else {

    element.classList.add("wrong");
    // Play incorrect lottie animation
    if (lottieContainer) {
      lottieContainer.innerHTML = "";
      lottie.loadAnimation({
        container: lottieContainer,
        renderer: "svg",
        loop: false,
        autoplay: true,
        path: "./lottie/incorrectLottie.json"
      });
    }

    // Only disable next button if no correct answer has been selected yet
    if (!textureAnswerCorrect) {
      const nextButton = document.querySelectorAll(".backNext-btn span")[1];
      if (nextButton) {
        nextButton.classList.add("disabled");
      }
    }

  }

}




// SHOW SUMMARY
function showSummary() {

  document.getElementById("soil-typeSection").style.display = "none";

  document.getElementById("summary-sec").style.display = "block";

  const previewBtn = document.querySelector(".preview-btn");
  if (previewBtn) previewBtn.style.display = "block";

  // Show soil map when summary is displayed
  const soilMap = document.getElementById("soil-map");
  if (soilMap) {
    soilMap.style.display = "block";
  }


  document.querySelector(".summary-header").innerText =
    selectedSoil.name;

  document.querySelector(".detail-txt").innerText =
    selectedSoil.summary.detail;

  document.querySelectorAll(".summary-sec p")[2].innerText =
    "Soil Type - " + selectedSoil.name;

  document.getElementById("textureTxt").innerText =
    selectedSoil.summary.texture;

  document.getElementById("importantCropsTxt").innerText =
    selectedSoil.summary.importantCrops.join(", ") + ".";

  document.getElementById("distributionTxt").innerText =
    selectedSoil.summary.distribution;

}




// LOAD CROP QUESTION OPTIONS
function loadCropQuestion() {

  const optionList = document.getElementById("option-list");

  optionList.innerHTML = "";

  selectedSoil.cropQuestion.options.forEach(option => {

    const li = document.createElement("li");
    console.log("option.image", option.image);

    li.innerHTML = `
        <img src="${option.image}">
        <span class="bottom-note">${option.name}</span>
        <div class="lottie-container"></div>
    `;

    li.dataset.correct = option.isCorrect;

    li.addEventListener("click", function () {

      handleCropAnswer(this);

    });

    optionList.appendChild(li);

  });

}




// HANDLE CROP ANSWER
function handleCropAnswer(element) {

  const allOptions = document.querySelectorAll("#option-list li");

  element.classList.toggle("active");

  if (!element.classList.contains("active")) {
    element.classList.remove("wrong");
    const lottieContainer = element.querySelector(".lottie-container");
    if (lottieContainer) lottieContainer.innerHTML = "";
    return;
  }

  selectedCrop = element.dataset.correct;

  const lottieContainer = element.querySelector(".lottie-container");

  if (selectedCrop === "true") {

    // Play correct lottie animation
    if (lottieContainer) {
      lottieContainer.innerHTML = "";
      lottie.loadAnimation({
        container: lottieContainer,
        renderer: "svg",
        loop: false,
        autoplay: true,
        path: "./lottie/correctLottie.json"
      });
    }

    // Check if all correct options are selected
    const totalCorrectOptions = selectedSoil.cropQuestion.options.filter(opt => opt.isCorrect).length;
    const selectedCorrectOptions = document.querySelectorAll("#option-list li.active[data-correct='true']").length;

    if (selectedCorrectOptions === totalCorrectOptions) {
      cropAnswerCorrect = true;
      const nextButton = document.querySelectorAll(".backNext-btn span")[1];
      if (nextButton) {
        nextButton.classList.remove("disabled");
      }

      // Hide incorrect options
      allOptions.forEach(li => {
        if (li.dataset.correct !== "true") {
          li.style.display = "none";
        }
      });
    }

  } else {

    element.classList.add("wrong");
    // Play incorrect lottie animation
    if (lottieContainer) {
      lottieContainer.innerHTML = "";
      lottie.loadAnimation({
        container: lottieContainer,
        renderer: "svg",
        loop: false,
        autoplay: true,
        path: "./lottie/incorrectLottie.json"
      });
    }

  }

}







// BACK BUTTON
// BACK BUTTON
document.querySelectorAll(".backNext-btn span")[0].addEventListener("click", () => {

  const soilMap = document.getElementById("soil-map");
  const optionListWrapper = document.getElementById("option-list-wrapper");
  const resetBtn = document.getElementById("reset-btn");
  const errorNote = document.getElementById("error-note");
  const nextButton = document.querySelectorAll(".backNext-btn span")[1];

  const isOptionListVisible = optionListWrapper &&
    optionListWrapper.style.display !== "none" &&
    optionListWrapper.style.display !== "";

  // Stage: Crop Question → Texture Question
  if (currentQuestionType === "crop" && isOptionListVisible) {

    currentQuestionType = "texture";
    loadTextureQuestion();

    document.getElementById("selected-question").innerText =
      selectedSoil.textureQuestion.question;

    if (textureAnswerCorrect) {
      if (nextButton) nextButton.classList.remove("disabled");
    } else {
      if (nextButton) nextButton.classList.add("disabled");
    }

    isAnswerShown = false;
    if (showAnsBtn) showAnsBtn.innerText = "Show Answer";
    if (errorNote) { errorNote.style.display = "none"; errorNote.classList.remove("correct", "wrong"); }

  }
  // Stage: Texture Question → Map
  else if (currentQuestionType === "texture" && isOptionListVisible) {

    optionListWrapper.style.display = "none";
    if (resetBtn) resetBtn.style.display = "none";
    if (soilMap) soilMap.style.display = "block";

    if (soilMap) {
      soilMap.querySelectorAll("[id$='-soil-map']").forEach(g => g.classList.remove("correct", "wrong"));
    }

    if (nextButton) nextButton.classList.add("disabled");
    isAnswerShown = false;
    if (showAnsBtn) showAnsBtn.innerText = "Show Answer";
    if (errorNote) { errorNote.style.display = "none"; errorNote.classList.remove("correct", "wrong"); }

    const noteTxt = document.querySelector(".note-txt");
    if (noteTxt) noteTxt.innerText = "Tap its location on the map.";
    document.getElementById("selected-question").innerText = "Where do you find this soil type in India?";

  }
  // Stage: Map → Step 1
  else {

    document.getElementById("step-2").style.display = "none";
    document.getElementById("step-1").style.display = "block";
    document.body.classList.remove("step-2");
    document.body.classList.add("step-1");

  }

});




// RESET BUTTON
document.querySelector(".reset-btn").addEventListener("click", () => {

  if (currentQuestionType === "texture") {
    loadTextureQuestion();
  } else if (currentQuestionType === "crop") {
    loadCropQuestion();
  }

  document.getElementById("error-note").style.display = "none";

  // Disable next button on reset
  const nextButton = document.querySelectorAll(".backNext-btn span")[1];
  if (nextButton) {
    nextButton.classList.add("disabled");
  }

});




// NEXT BUTTON HANDLER - Navigate between stages
const nextButtons = document.querySelectorAll(".backNext-btn span");
if (nextButtons.length > 1) {
  nextButtons[1].addEventListener("click", function () {
    // Only allow if not disabled
    if (this.classList.contains("disabled")) {
      return;
    }

    const soilMap = document.getElementById("soil-map");
    const optionListWrapper = document.getElementById("option-list-wrapper");
    const resetBtn = document.getElementById("reset-btn");

    const errorNote = document.getElementById("error-note");

    if (errorNote) {
      errorNote.style.display = "none";
    }

    // Stage 1: Map to Texture Question
    if (!optionListWrapper || optionListWrapper.style.display === "none") {
      soilMap.style.display = "none";
      if (optionListWrapper) {
        optionListWrapper.style.display = "block";
      }
      if (resetBtn) {
        resetBtn.style.display = "block";
      }

      // Reset next button state
      this.classList.add("disabled");

      // Reset show answer button
      isAnswerShown = false;
      if (showAnsBtn) { showAnsBtn.innerText = "Show Answer"; }

      // Update question to texture question
      document.getElementById("selected-question").innerText = selectedSoil.textureQuestion.question;
      const noteTxt = document.querySelector(".note-txt");
      if (noteTxt) noteTxt.innerText = "Tap the correct picture.";

    }
    // Stage 2: Texture Question to Crop Question
    else if (currentQuestionType === "texture" && textureAnswerCorrect) {
      currentQuestionType = "crop";
      loadCropQuestion();

      // Update question to crop question
      document.getElementById("selected-question").innerText = selectedSoil.cropQuestion.question;
      const noteTxt = document.querySelector(".note-txt");
      if (noteTxt) noteTxt.innerText = "Tap the correct picture.";

      // Reset show answer button
      isAnswerShown = false;
      if (showAnsBtn) { showAnsBtn.innerText = "Show Answer"; }

      // Reset next button state
      this.classList.add("disabled");

    }
    // Stage 3: Crop Question to Summary
    else if (currentQuestionType === "crop" && cropAnswerCorrect) {
      if (optionListWrapper) {
        optionListWrapper.style.display = "none";
      }

      if (resetBtn) {
        resetBtn.style.display = "none";
      }

      showSummary();
    }

  });
}




// SHOW ANSWER BUTTON HANDLER
let isAnswerShown = false;
const showAnsBtn = document.querySelector(".show-ansBtn");
if (showAnsBtn) {
  showAnsBtn.addEventListener("click", () => {

    const optionListWrapper = document.getElementById("option-list-wrapper");
    const isOptionListVisible = optionListWrapper &&
      optionListWrapper.style.display !== "none" &&
      optionListWrapper.style.display !== "";

    if (!isAnswerShown) {

      // ── OPTION LIST STAGE (texture or crop question) ──
      if (isOptionListVisible) {

        const allOptions = document.querySelectorAll("#option-list li");

        allOptions.forEach(li => {
          const lottieContainer = li.querySelector(".lottie-container");
          if (!lottieContainer) return;

          lottieContainer.innerHTML = "";

          if (li.dataset.correct === "true") {
            li.classList.add("active");
            lottie.loadAnimation({
              container: lottieContainer,
              renderer: "svg",
              loop: false,
              autoplay: true,
              path: "./lottie/correctLottie.json"
            });
          } else {
            li.classList.add("wrong");
            lottie.loadAnimation({
              container: lottieContainer,
              renderer: "svg",
              loop: false,
              autoplay: true,
              path: "./lottie/incorrectLottie.json"
            });
          }
        });

        // Hide incorrect options
        allOptions.forEach(li => {
          if (li.dataset.correct !== "true") {
            li.style.display = "none";
          }
        });

        // Enable next button
        const nextButton = document.querySelectorAll(".backNext-btn span")[1];
        if (nextButton) {
          nextButton.classList.remove("disabled");
        }

        // Mark the correct answer flag so next stage navigation works
        if (currentQuestionType === "texture") {
          textureAnswerCorrect = true;
        } else if (currentQuestionType === "crop") {
          cropAnswerCorrect = true;
        }

      } else {

        // ── MAP STAGE ──
        const correctMapId = selectedSoil["map-location"];
        const correctMapElement = document.getElementById(correctMapId);

        if (correctMapElement) {
          correctMapElement.classList.add("correct");
          mapLocationCorrect = true;

          const nextButton = document.querySelectorAll(".backNext-btn span")[1];
          if (nextButton) {
            nextButton.classList.remove("disabled");
          }

          const errorNote = document.getElementById("error-note");
          if (errorNote) {
            errorNote.style.display = "block";
            errorNote.innerText = "Here is the correct location!";
            errorNote.classList.remove("wrong");
            errorNote.classList.add("correct");
          }
        }

      }

      showAnsBtn.innerText = "Hide Answer";
      isAnswerShown = true;

    } else {

      // ── HIDE ANSWER ──
      if (isOptionListVisible) {

        // Clear all lottie containers in the option list
        const allOptions = document.querySelectorAll("#option-list li");
        allOptions.forEach(li => {
          li.style.display = "flex";
          li.classList.remove("active", "wrong");
          const lottieContainer = li.querySelector(".lottie-container");
          if (lottieContainer) {
            lottieContainer.innerHTML = "";
          }
        });

      } else {

        const correctMapId = selectedSoil["map-location"];
        const correctMapElement = document.getElementById(correctMapId);

        if (correctMapElement) {
          correctMapElement.classList.remove("correct");
          mapLocationCorrect = false;

          const errorNote = document.getElementById("error-note");
          if (errorNote) {
            errorNote.style.display = "none";
          }
        }

      }

      showAnsBtn.innerText = "Show Answer";
      isAnswerShown = false;
    }

  });
}


// HOME BUTTON (inside summary-sec)
const homeBtn = document.getElementById("home-btn");
if (homeBtn) {
  homeBtn.addEventListener("click", () => {

    const step1 = document.getElementById("step-1");
    const step2 = document.getElementById("step-2");

    // Hide step-2, show step-1
    step2.style.display = "none";
    step1.style.display = "block";
    document.body.classList.remove("step-2");
    document.body.classList.add("step-1");

    const previewBtn = document.querySelector(".preview-btn");
    if (previewBtn) previewBtn.style.display = "none";

    const soilItems = document.querySelectorAll(".soil-list li");
    mapLocationCorrect = false;
    soilItems.forEach(li => {
      const soilKey = li.dataset.soil; // e.g. "red-soil"
      if (selectedSoil && selectedSoil.tabImage.includes(soilKey)) {
        li.classList.add("completed");
      }
    });

  });
}


const previewBtn = document.querySelector(".preview-btn");
const previewPopup = document.querySelector(".preview-popup");
const previewBackdrop = document.getElementById("modal-backdrop")
const closePreview = document.getElementById("close-previewPopup");

if (previewBtn) {
  previewBtn.addEventListener("click", () => {
    previewPopup.style.display = "block";
    previewBackdrop.style.display = "block";
  });
}

if (closePreview) {
  closePreview.addEventListener("click", () => {
    previewPopup.style.display = "none";
    previewBackdrop.style.display = "none";
  });
}