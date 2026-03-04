// GLOBAL VARIABLES
let soilTypes = [];
let selectedSoil = null;
let selectedTexture = null;


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

  updateSoilDetails();
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
    `;

    li.dataset.correct = option.isCorrect;

    li.addEventListener("click", function () {

      handleTextureAnswer(this);

    });

    optionList.appendChild(li);

  });

}




// HANDLE TEXTURE ANSWER
function handleTextureAnswer(element) {

  const allOptions = document.querySelectorAll("#option-list li");

  allOptions.forEach(opt => opt.classList.remove("active"));

  element.classList.add("active");

  selectedTexture = element.dataset.correct;

  const errorNote = document.getElementById("error-note");

  if (selectedTexture === "true") {

    errorNote.style.display = "none";

    showSummary();

  } else {

    errorNote.style.display = "block";

  }

}




// SHOW SUMMARY
function showSummary() {

  document.getElementById("soil-typeSection").style.display = "none";

  document.getElementById("summary-sec").style.display = "block";


  document.querySelector(".summary-header").innerText =
    selectedSoil.name;

  document.getElementById("textureTxt").innerText =
    selectedSoil.summary.texture;

  document.getElementById("importantCropsTxt").innerText =
    selectedSoil.summary.importantCrops.join(", ");

}




// RESET BUTTON
document.querySelector(".reset-btn").addEventListener("click", () => {

  loadTextureQuestion();

  document.getElementById("error-note").style.display = "none";

});




// BACK BUTTON
document.querySelectorAll(".backNext-btn span")[0].addEventListener("click", () => {

  const step1 = document.getElementById("step-1");
  const step2 = document.getElementById("step-2");

  step2.style.display = "none";
  step1.style.display = "block";

});




// PREVIEW POPUP
const previewBtn = document.querySelector(".preview-btn");
const previewPopup = document.querySelector(".preview-popup");
const closePreview = document.getElementById("close-previewPopup");


previewBtn.addEventListener("click", () => {

  previewPopup.style.display = "block";

});


closePreview.addEventListener("click", () => {

  previewPopup.style.display = "none";

});