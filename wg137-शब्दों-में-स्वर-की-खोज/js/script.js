
const swars = document.querySelectorAll(".swars");
const homePage = document.getElementById('home');
const gamePage = document.getElementById('gamePage');
const homeBtn = document.getElementById('home-btn');


swars.forEach(el => {
  el.addEventListener("click", function () {
    gamePage.style.display = 'block';
    homePage.style.display = 'none';
    const value = this.getAttribute("data-value");
    console.log("Clicked:", value);
  });
});

document.addEventListener('DOMContentLoaded', function () {

  homeBtn.addEventListener('click', () => {
    homePage.style.display = 'block';
    gamePage.style.display = 'none';
  });
});
