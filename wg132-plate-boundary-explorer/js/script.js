
const homePage = document.getElementById('home');
const gamePage = document.getElementById('game');
const plates = document.querySelectorAll('.plates');

const gameIText = document.getElementById('game-itext');
const homeIText = document.getElementById('home-itext');

const buttons = document.getElementById('buttons');
const resetPlateBtn = document.getElementById('reset-plate');
const nextBtn = document.getElementById('next-btn');
const homeBtn = document.getElementById('home-btn');

const convergentPushButtonFill = document.getElementById('convergent-push-button-fill');
const convergentPushButton = document.getElementById('convergent-push-button');

let currentPlate = null;

document.addEventListener('DOMContentLoaded', function () {

  plates.forEach(el => {
    el.addEventListener("click", function () {
      currentPlate = this.dataset.value; // get data-value

      gameIText.style.display = 'block';
      homePage.style.display = 'none';
      homeIText.style.display = 'none';
      buttons.style.display = 'block';

      // First hide all related sections (optional but recommended)
      // document.querySelectorAll('[id]').forEach(item => {
      //   item.style.display = 'none';
      // });

      const prefix = currentPlate.replace('-plate', '');

      document.querySelectorAll(`[id^="${prefix}"]`).forEach(item => {
        item.style.display = 'block';
      });
    });
  });
});

homeBtn.addEventListener("click", function () {
  homePage.style.display = 'block';
  gameIText.style.display = 'none';
  homeIText.style.display = 'block';
  buttons.style.display = 'none';

  if (currentPlate) {
    const prefix = currentPlate.replace('-plate', '');

    document.querySelectorAll(`[id^="${prefix}"]`).forEach(item => {
      item.style.display = 'none';
    });
  }

  currentPlate = null; // ✅ reset after use
});

convergentPushButton.addEventListener("click", function () {
  convergentPushButtonFill.style.fill = '#d60000';
});